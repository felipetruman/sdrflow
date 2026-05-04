import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics'
import { login, authHeaders } from '../helpers/auth.js'
import { getStages } from '../helpers/data-seed.js'
import { BASE_URL, scenarios, thresholds } from '../config.js'

const leadCreationDuration = new Trend('lead_creation_duration')
const leadListDuration = new Trend('lead_list_duration')

export const options = {
  scenarios: { load: scenarios.load },
  thresholds: {
    ...thresholds,
    lead_creation_duration: ['p(95)<800'],
    lead_list_duration: ['p(95)<500'],
  },
}

const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD
const WORKSPACE_ID = __ENV.WORKSPACE_ID

export function setup() {
  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
    throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD env vars')
  }
  const auth = login(TEST_USER_EMAIL, TEST_USER_PASSWORD)
  if (!auth) throw new Error('Login failed')
  const stages = getStages(auth.token, WORKSPACE_ID)
  const baseStage = stages.find(s => s.name === 'Base')
  return { token: auth.token, workspaceId: WORKSPACE_ID, baseStageId: baseStage?.id }
}

export default function (data) {
  const { token, workspaceId, baseStageId } = data

  group('Listar leads (Kanban)', () => {
    const start = Date.now()
    const res = http.get(
      `${BASE_URL}/leads?workspace_id=eq.${workspaceId}&select=id,name,stage_id,company,job_title,email&order=created_at.desc&limit=100`,
      { headers: authHeaders(token) }
    )
    leadListDuration.add(Date.now() - start)

    check(res, {
      'status 200': (r) => r.status === 200,
      'returns array': (r) => Array.isArray(r.json()),
    })
  })

  sleep(1)

  group('Criar lead', () => {
    const name = `LoadTest-${__VU}-${__ITER}`
    const email = `loadtest-${__VU}-${__ITER}@sdrflow.test`
    const payload = {
      workspace_id: workspaceId,
      stage_id: baseStageId,
      name,
      email,
      company: `Empresa ${__VU}`,
      job_title: 'CEO',
      source: 'Outbound',
      status: 'active',
    }

    const start = Date.now()
    const res = http.post(
      `${BASE_URL}/leads`,
      JSON.stringify(payload),
      {
        headers: { ...authHeaders(token), Prefer: 'return=representation' },
      }
    )
    leadCreationDuration.add(Date.now() - start)

    check(res, {
      'lead created (201)': (r) => r.status === 201,
      'lead has id': (r) => r.json('0.id') !== undefined,
    })
  })

  sleep(2)
}

export function teardown() {
  console.log('Tests completed')
}
