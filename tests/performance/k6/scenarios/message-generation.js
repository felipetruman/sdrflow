import http from 'k6/http'
import { check, group } from 'k6'
import { Trend, Rate } from 'k6/metrics'
import { login, authHeaders } from '../helpers/auth.js'
import { getRandomLead, getCampaigns } from '../helpers/data-seed.js'
import { SUPABASE_URL, scenarios } from '../config.js'

const llmDuration = new Trend('llm_generation_duration')
const llmRateLimited = new Rate('llm_rate_limited')

export const options = {
  scenarios: { spike: scenarios.spike },
  thresholds: {
    llm_generation_duration: ['p(95)<8000', 'p(99)<15000'],
    llm_rate_limited: ['rate<0.20'],
    http_req_failed: ['rate<0.10'],
  },
}

const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD
const WORKSPACE_ID = __ENV.WORKSPACE_ID

export function setup() {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
    throw new Error('Missing credentials')
  }
  const auth = login(TEST_USER_EMAIL, TEST_USER_PASSWORD)
  if (!auth) throw new Error('Login failed')
  const campaigns = getCampaigns(auth.token, WORKSPACE_ID)
  return { token: auth.token, workspaceId: WORKSPACE_ID, campaignId: campaigns[0]?.id }
}

export default function (data) {
  const { token, workspaceId, campaignId } = data

  if (!campaignId) {
    console.warn('No active campaign found')
    return
  }

  const lead = getRandomLead(token, workspaceId)
  if (!lead) {
    console.warn('No leads available')
    return
  }

  group('Gerar mensagens via Edge Function', () => {
    const start = Date.now()
    const res = http.post(
      `${SUPABASE_URL}/functions/v1/generate-messages`,
      JSON.stringify({
        lead_id: lead.id,
        campaign_id: campaignId,
      }),
      {
        headers: authHeaders(token),
        timeout: '30s',
      }
    )
    llmDuration.add(Date.now() - start)

    check(res, {
      'status 200': (r) => r.status === 200,
      'returns messages array': (r) => {
        try { return Array.isArray(r.json('messages')) } catch { return false }
      },
    })

    llmRateLimited.add(res.status === 429)
    if (res.status === 429) {
      console.warn(`Rate limited at VU ${__VU}`)
    }
  })
}
