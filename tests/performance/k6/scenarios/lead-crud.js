import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics'
import { authHeaders } from '../helpers/auth.js'
import { setupWithStages } from '../helpers/setup.js'
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

export function setup() {
  return setupWithStages()
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
