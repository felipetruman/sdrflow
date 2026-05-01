import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const RESULTS_DIR = ".claude/review-results";
const METRICS_FILE = ".claude/review-metrics.json";
const BADGE_FILE = ".claude/review-results/badge.json";
const PR_NUMBER = process.env.PR_NUMBER;
const REPO = process.env.REPO;
const HEAD_REF = process.env.HEAD_REF;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// --- Semantic deduplication with normalized matching ---
function dedupeKey(f) {
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
  return `${norm(f.file)}:${f.line}:${norm(f.category)}:${norm(f.suggestion).slice(0, 40)}`;
}

function loadFindings() {
  if (!existsSync(RESULTS_DIR)) return [];
  const files = readdirSync(RESULTS_DIR).filter(
    (f) => f.endsWith(".json") && f !== "badge.json"
  );
  const all = [];
  for (const f of files) {
    const reviewer = f.replace(".json", "");
    const raw = readFileSync(join(RESULTS_DIR, f), "utf-8").trim();
    if (!raw || raw === "[]") continue;
    try {
      const findings = JSON.parse(raw);
      if (!Array.isArray(findings)) continue;
      for (const item of findings) {
        all.push({ ...item, reviewer: item.reviewer || reviewer });
      }
    } catch {
      console.error(`WARN: Could not parse ${f}`);
    }
  }
  return all;
}

function deduplicate(findings) {
  const seen = new Map();
  for (const f of findings) {
    const key = dedupeKey(f);
    if (!seen.has(key)) {
      seen.set(key, { ...f, reviewers: [f.reviewer] });
    } else {
      const existing = seen.get(key);
      existing.reviewers.push(f.reviewer);
      if (f.severity === "CRITICAL") existing.severity = "CRITICAL";
      else if (f.severity === "HIGH" && existing.severity !== "CRITICAL")
        existing.severity = "HIGH";
    }
  }
  return [...seen.values()];
}

function computeMetrics(findings, deduped) {
  const by_severity = {};
  const by_category = {};
  for (const f of findings) {
    by_severity[f.severity] = (by_severity[f.severity] || 0) + 1;
    by_category[f.category] = (by_category[f.category] || 0) + 1;
  }

  const multiReviewer = deduped.filter((f) => f.reviewers.length > 1);
  const agreement_rate =
    deduped.length > 0 ? multiReviewer.length / deduped.length : 0;

  const auto_fixable = deduped.filter((f) => f.auto_fixable);
  const reviewers = [...new Set(findings.map((f) => f.reviewer))];

  return {
    date: new Date().toISOString(),
    pr_number: Number(PR_NUMBER),
    reviewers,
    total_findings: findings.length,
    unique_findings: deduped.length,
    by_severity,
    by_category,
    agreement_rate: Math.round(agreement_rate * 100) / 100,
    auto_fixable_count: auto_fixable.length,
    auto_fixed_count: 0,
  };
}

function hasCriticalSecurityOrType(deduped) {
  return deduped.some(
    (f) =>
      f.severity === "CRITICAL" &&
      (f.reviewer === "security" || f.reviewer === "type-safety")
  );
}

// --- Real auto-fix with regex pattern replacement ---
const AUTO_FIX_RULES = [
  {
    name: "console-remove",
    pattern: /^\s*console\.(log|debug|info|warn)\([^)]*\);?\s*$/gm,
    replacement: "",
    test: (f) => f.category === "other" && f.suggestion.toLowerCase().includes("console"),
  },
  {
    name: "add-unknown-catch",
    pattern: /catch\s*\((\w+)\)\s*\{/g,
    replacement: (m, varName) => `catch (${varName}: unknown) {`,
    test: (f) => f.category === "implicit-any" || f.category === "any-type",
  },
];

function autoFixTrivial(deduped) {
  const fixable = deduped.filter((f) => f.auto_fixable && existsSync(f.file));
  if (fixable.length === 0) return 0;

  let totalFixed = 0;
  const fileChanges = new Map();

  for (const f of fixable) {
    for (const rule of AUTO_FIX_RULES) {
      if (!rule.test(f)) continue;
      try {
        if (!fileChanges.has(f.file)) {
          fileChanges.set(f.file, readFileSync(f.file, "utf-8"));
        }
        let content = fileChanges.get(f.file);
        const newContent = content.replace(rule.pattern, rule.replacement);
        if (newContent !== content) {
          fileChanges.set(f.file, newContent);
          totalFixed++;
          console.log(`  FIX [${rule.name}]: ${f.file}:${f.line}`);
        }
      } catch (e) {
        console.error(`  FIX FAILED: ${f.file}: ${e.message}`);
      }
    }
  }

  for (const [file, content] of fileChanges) {
    writeFileSync(file, content);
  }

  if (totalFixed > 0) {
    try {
      execSync(`git add -A && git commit -m "style: auto-fix ${totalFixed} trivial review findings"`, {
        stdio: "pipe",
      });
      console.log(`Committed ${totalFixed} auto-fixes.`);
    } catch (e) {
      console.error("Auto-fix commit failed:", e.message);
    }
  }

  return totalFixed;
}

// --- Badge generation (Shields.io JSON) ---
function generateBadge(metrics) {
  const critCount = metrics.by_severity?.CRITICAL || 0;
  const highCount = metrics.by_severity?.HIGH || 0;
  const total = metrics.unique_findings;

  let color = "brightgreen";
  if (critCount > 0) color = "red";
  else if (highCount > 0) color = "orange";
  else if (total > 0) color = "yellow";

  const badge = {
    schemaVersion: 1,
    label: "PR Review",
    message: total === 0 ? "clean" : `${total} findings`,
    color,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(BADGE_FILE, JSON.stringify(badge, null, 2));
  return badge;
}

function buildReviewBody(deduped, metrics) {
  const groups = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
  for (const f of deduped) {
    const sev = groups[f.severity] ? f.severity : "LOW";
    groups[sev].push(f);
  }

  let body = "## PR Review Summary\n\n";
  body += `**Reviewers:** ${metrics.reviewers.join(", ")}\n`;
  body += `**Findings:** ${metrics.total_findings} total, ${metrics.unique_findings} unique\n`;
  body += `**Agreement rate:** ${(metrics.agreement_rate * 100).toFixed(0)}%\n`;
  body += `**Auto-fixable:** ${metrics.auto_fixable_count}\n\n`;

  if (hasCriticalSecurityOrType(deduped)) {
    body += "> **Critical security or type-safety issues detected.** Requesting changes.\n\n";
  }

  for (const [sev, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    const icon = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", LOW: "🟢" }[sev];
    body += `### ${icon} ${sev} (${items.length})\n\n`;
    for (const f of items) {
      const reviewerList = f.reviewers.join(", ");
      body += `- **${f.file}:${f.line}** [${f.category}] — ${f.suggestion} _(${reviewerList})_\n`;
      if (f.auto_fixable) body += `  - _Auto-fixable_\n`;
    }
    body += "\n";
  }

  body += "---\n_Generated by Gemini-powered PR review pipeline._\n";
  return body;
}

function postReview(body, deduped) {
  if (!GITHUB_TOKEN || !REPO || !PR_NUMBER) {
    console.log("Skipping review post (missing env vars). Body:");
    console.log(body);
    return;
  }

  const tmpFile = `/tmp/review-body-${PR_NUMBER}.txt`;
  writeFileSync(tmpFile, body);

  try {
    execSync(
      `gh pr comment ${PR_NUMBER} --repo ${REPO} --body-file ${tmpFile}`,
      { stdio: "inherit" }
    );
    console.log("Review comment posted.");
  } catch (e) {
    console.error("Failed to post review:", e.message);
  }

  if (hasCriticalSecurityOrType(deduped)) {
    try {
      execSync(
        `gh pr review ${PR_NUMBER} --repo ${REPO} --request-changes --body "Critical security/type issues found. See review comment."`,
        { stdio: "inherit" }
      );
    } catch (e) {
      console.error("Failed to request changes:", e.message);
    }
  }
}

// --- Main ---
const findings = loadFindings();
console.log(`Loaded ${findings.length} findings from reviewers.`);

const deduped = deduplicate(findings);
console.log(`${deduped.length} unique findings after dedup.`);

const metrics = computeMetrics(findings, deduped);
writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
console.log(`Metrics written to ${METRICS_FILE}`);

generateBadge(metrics);
console.log("Badge generated.");

const autoFixed = autoFixTrivial(deduped);
metrics.auto_fixed_count = autoFixed;
writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));

const body = buildReviewBody(deduped, metrics);
postReview(body, deduped);

console.log("Coordination complete.");
