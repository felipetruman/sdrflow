-- ============================================================================
-- SDR Flow — Query Performance Analysis
-- Run: psql $DATABASE_URL -f scripts/analyze-slow-queries.sql
-- ============================================================================

-- Enable pg_stat_statements (run once as superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 1. Top 20 slowest queries by mean execution time (P50)
SELECT
  substring(query, 1, 120) AS query_preview,
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round((stddev_exec_time)::numeric, 2) AS stddev_ms,
  round(min_exec_time::numeric, 2) AS min_ms,
  round(max_exec_time::numeric, 2) AS max_ms,
  round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS pct_total
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%'
  AND query NOT LIKE '%pg_catalog%'
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 2. Queries hitting critical SDR Flow tables
SELECT
  substring(query, 1, 150) AS query,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  rows
FROM pg_stat_statements
WHERE query ~* '(leads|campaigns|funnel_stages|generated_messages|lead_activities)'
ORDER BY total_exec_time DESC
LIMIT 15;

-- 3. Top 10 queries by total impact (calls × avg time)
SELECT
  substring(query, 1, 120) AS query_preview,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  round(total_exec_time::numeric, 2) AS total_ms,
  round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS pct_total
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%'
ORDER BY total_exec_time DESC
LIMIT 10;

-- 4. Index usage analysis — tables with seq scans vs index scans
SELECT
  schemaname || '.' || relname AS table_name,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  pg_size_pretty(pg_relation_size(relid)) AS size
FROM pg_stat_user_tables
ORDER BY seq_tup_read DESC
LIMIT 15;

-- 5. Unused indexes (candidates for removal)
SELECT
  schemaname || '.' || tablename AS table_name,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size,
  idx_scan AS times_used,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan < 10
  AND pg_relation_size(indexrelid) > 8192  -- bigger than 8KB
ORDER BY pg_relation_size(indexrelid) DESC;

-- 6. Tables with missing indexes on foreign keys
SELECT
  tc.table_schema || '.' || tc.table_name AS table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = (tc.table_schema || '.' || tc.table_name)::regclass
      AND a.attname = kcu.column_name
  );

-- 7. Table sizes (helps prioritize optimization)
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS data_size,
  pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) AS index_size,
  n_live_tup AS estimated_rows
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;

-- 8. Cache hit ratio (should be > 99% for good performance)
SELECT
  round(
    (100 * sum(heap_blks_hit)) /
    nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0),
    2
  ) AS cache_hit_ratio_pct
FROM pg_statio_user_tables;

-- To reset stats between test runs:
-- SELECT pg_stat_statements_reset();
-- SELECT pg_stat_reset();
