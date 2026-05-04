import { login } from './auth.js'
import { getStages, getCampaigns } from './data-seed.js'

export function requireCredentials() {
  const email = __ENV.TEST_USER_EMAIL
  const password = __ENV.TEST_USER_PASSWORD
  const workspaceId = __ENV.WORKSPACE_ID

  if (!email || !password) {
    throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD env vars')
  }
  if (!workspaceId) {
    throw new Error('Missing WORKSPACE_ID env var')
  }

  return { email, password, workspaceId }
}

export function setupBaseAuth() {
  const { email, password, workspaceId } = requireCredentials()
  const auth = login(email, password)
  if (!auth) throw new Error('Login failed')
  return { token: auth.token, workspaceId }
}

export function setupWithStages() {
  const { email, password, workspaceId } = requireCredentials()
  const auth = login(email, password)
  if (!auth) throw new Error('Login failed')
  const stages = getStages(auth.token, workspaceId)
  const baseStage = stages.find(s => s.name === 'Base')
  return { token: auth.token, workspaceId, baseStageId: baseStage?.id }
}

export function setupWithCampaigns() {
  const { email, password, workspaceId } = requireCredentials()
  const auth = login(email, password)
  if (!auth) throw new Error('Login failed')
  const campaigns = getCampaigns(auth.token, workspaceId)
  return { token: auth.token, workspaceId, campaignId: campaigns[0]?.id }
}
