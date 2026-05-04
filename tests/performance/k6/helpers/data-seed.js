import http from 'k6/http'
import { authHeaders } from './auth.js'
import { BASE_URL } from '../config.js'

export function getRandomLead(token, workspaceId) {
  const res = http.get(
    `${BASE_URL}/leads?workspace_id=eq.${workspaceId}&limit=1&order=created_at.desc`,
    { headers: authHeaders(token) }
  )
  if (res.status !== 200 || !res.json().length) return null
  return res.json()[0]
}

export function getStages(token, workspaceId) {
  const res = http.get(
    `${BASE_URL}/pipeline_stages?workspace_id=eq.${workspaceId}&order=position.asc`,
    { headers: authHeaders(token) }
  )
  if (res.status !== 200) return []
  return res.json()
}

export function getCampaigns(token, workspaceId) {
  const res = http.get(
    `${BASE_URL}/campaigns?workspace_id=eq.${workspaceId}&is_active=eq.true&limit=5`,
    { headers: authHeaders(token) }
  )
  if (res.status !== 200) return []
  return res.json()
}
