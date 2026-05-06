import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const llmApiKey = Deno.env.get('LLM_API_KEY')
  const llmModel = Deno.env.get('LLM_MODEL') || 'gpt-4o-mini'
  const llmBaseUrl = Deno.env.get('LLM_BASE_URL') || 'https://api.openai.com/v1'

  return new Response(
    JSON.stringify({
      configured: Boolean(llmApiKey),
      model: llmModel,
      baseUrl: llmBaseUrl,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
