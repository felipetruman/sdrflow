import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Trend } from 'k6/metrics'
import { authHeaders } from '../helpers/auth.js'
import { setupBaseAuth } from '../helpers/setup.js'
import { BASE_URL, scenarios } from '../config.js'

const kanbanDuration = new Trend('kanban_duration')
const rpcDuration = new Trend('rpc_duration')

export const options = {
  scenarios: { stress: scenarios.stress },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
    kanban_duration: ['p(95)<1500'],
    rpc_duration: ['p(95)<2000'],
  },
}

export function setup() {
  return setupBaseAuth()
}

export default function (data) {
  const { token, workspaceId } = data

  group('Kanban — listar leads com ordenação', () => {
    const start = Date.now()
    const res = http.get(
      `${BASE_URL}/leads?workspace_id=eq.${workspaceId}&select=id,name,stage_id,company,job_title,email,owner_id&order=created_at.desc&limit=200`,
      { headers: authHeaders(token) }
    )
    kanbanDuration.add(Date.now() - start)
    check(res, {
      'kanban loaded': (r) => r.status === 200,
      'response under 1.5s': (r) => r.timings.duration < 1500,
    })
  })

  sleep(1)

  group('RPC — get_workspace_stages', () => {
    const start = Date.now()
    const res = http.post(
      `${BASE_URL}/rpc/get_workspace_stages`,
      JSON.stringify({ p_workspace_id: workspaceId }),
      { headers: authHeaders(token) }
    )
    rpcDuration.add(Date.now() - start)
    check(res, {
      'stages loaded': (r) => r.status === 200,
      'response under 2s': (r) => r.timings.duration < 2000,
    })
  })

  sleep(1)

  group('Listagem de campanhas ativas', () => {
    const res = http.get(
      `${BASE_URL}/campaigns?workspace_id=eq.${workspaceId}&is_active=eq.true&limit=10`,
      { headers: authHeaders(token) }
    )
    check(res, {
      'campaigns loaded': (r) => r.status === 200,
    })
  })

  sleep(Math.random() * 3)
}
