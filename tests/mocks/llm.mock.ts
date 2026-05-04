import { http, HttpResponse } from 'msw'

export const mockLLMMessages = [
  'Olá [NOME], notei que você atua como [CARGO] na [EMPRESA] e queria compartilhar uma oportunidade...',
  'Oi [NOME], tudo bem? Vi que a [EMPRESA] está crescendo no segmento de [SEGMENTO]...',
  '[NOME], boa tarde! Tenho uma proposta personalizada para otimizar os resultados da [EMPRESA]...',
]

export const llmHandlers = [
  http.post('https://api.openai.com/v1/chat/completions', () =>
    HttpResponse.json({
      id: 'chatcmpl-test',
      choices: [{ message: { role: 'assistant', content: JSON.stringify({ messages: mockLLMMessages }) }, finish_reason: 'stop' }],
      usage: { total_tokens: 150 },
    }),
  ),
  http.post('https://api.anthropic.com/v1/messages', () =>
    HttpResponse.json({
      id: 'msg_test',
      content: [{ type: 'text', text: JSON.stringify({ messages: mockLLMMessages }) }],
      stop_reason: 'end_turn',
    }),
  ),
]
