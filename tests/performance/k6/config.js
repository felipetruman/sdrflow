export const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://kjxvjqadoefbvzxymgff.supabase.co'
export const ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeHZqcWFkb2VmYnZ6eHltZ2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjI1MzQsImV4cCI6MjA5MzEzODUzNH0.vd2pzyj1v_RENZLjN7m9fZxW1d08BqwUyrlcRv3-flo'
export const SERVICE_KEY = __ENV.SUPABASE_SERVICE_KEY || ''
export const APP_URL = __ENV.APP_URL || 'http://localhost:3000'
export const BASE_URL = `${SUPABASE_URL}/rest/v1`

export const thresholds = {
  http_req_duration: [
    'p(50)<500',
    'p(95)<1500',
    'p(99)<3000',
  ],
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.95'],
}

export const scenarios = {
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '30s',
    tags: { test_type: 'smoke' },
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 20 },
      { duration: '5m', target: 20 },
      { duration: '2m', target: 0 },
    ],
    tags: { test_type: 'load' },
  },
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '5m', target: 200 },
      { duration: '2m', target: 0 },
    ],
    tags: { test_type: 'stress' },
  },
  spike: {
    executor: 'ramping-arrival-rate',
    startRate: 1,
    timeUnit: '1s',
    preAllocatedVUs: 50,
    maxVUs: 200,
    stages: [
      { duration: '10s', target: 1 },
      { duration: '1m', target: 100 },
      { duration: '10s', target: 1 },
    ],
    tags: { test_type: 'spike' },
  },
  soak: {
    executor: 'constant-vus',
    vus: 10,
    duration: '2h',
    tags: { test_type: 'soak' },
  },
}
