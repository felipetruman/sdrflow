#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const TARGET_LEADS = parseInt(process.env.SEED_LEADS || '1000', 10)
const BATCH_SIZE = 300
const WORKSPACE_NAME = process.env.WORKSPACE_NAME || 'LOAD TEST WORKSPACE'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const STAGE_NAMES = ['Base', 'Lead Mapeado', 'Tentando Contato', 'Conexão Iniciada', 'Qualificado', 'Reunião Agendada', 'Desqualificado']
const SOURCES = ['website', 'linkedin', 'referral', 'event', 'outbound', 'inbound']

async function seed() {
  console.log(`Seeding ${TARGET_LEADS} leads into workspace...`)

  const { data: ws } = await supabase
    .from('workspaces')
    .insert({ name: WORKSPACE_NAME, owner_id: '00000000-0000-0000-0000-000000000000' })
    .select()
    .single()

  if (!ws) {
    console.error('Failed to create workspace')
    process.exit(1)
  }

  console.log(`Workspace created: ${ws.id}`)

  const stagesPayload = STAGE_NAMES.map((name, i) => ({
    workspace_id: ws.id,
    name,
    order_index: i,
    color: ['#6B7280', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#EC4899'][i],
  }))

  const { data: stages } = await supabase.from('funnel_stages').insert(stagesPayload).select()
  if (!stages) {
    console.error('Failed to create stages')
    process.exit(1)
  }

  console.log(`${stages.length} funnel stages created`)

  let inserted = 0
  for (let i = 0; i < TARGET_LEADS; i += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, TARGET_LEADS - i)
    const batch = Array.from({ length: batchSize }, () => ({
      workspace_id: ws.id,
      stage_id: stages[Math.floor(Math.random() * stages.length)].id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      job_title: faker.person.jobTitle(),
      source: faker.helpers.arrayElement(SOURCES),
      notes: faker.lorem.sentence(),
      status: 'active',
    }))

    const { error } = await supabase.from('leads').insert(batch)
    if (error) {
      console.error(`Error at batch ${i}:`, error.message)
      continue
    }
    inserted += batch.length
    console.log(`${inserted}/${TARGET_LEADS} leads...`)
  }

  console.log(`\nDone!`)
  console.log(`  WORKSPACE_ID=${ws.id}`)
  console.log(`  Total leads: ${inserted}`)
  console.log(`\nClean up with:`)
  console.log(`  DELETE FROM workspaces WHERE id='${ws.id}';`)
}

seed().catch(console.error)
