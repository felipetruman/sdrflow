import http from 'k6/http'
import { check } from 'k6'
import { SUPABASE_URL, ANON_KEY } from '../config.js'

export function login(email, password) {
  const res = http.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email, password }),
    {
      headers: {
        apikey: ANON_KEY,
        'Content-Type': 'application/json',
      },
    }
  )

  check(res, {
    'login successful': (r) => r.status === 200,
    'access_token returned': (r) => r.json('access_token') !== undefined,
  })

  if (res.status !== 200) {
    console.error(`Login failed: ${res.status} ${res.body}`)
    return null
  }

  return {
    token: res.json('access_token'),
    userId: res.json('user.id'),
  }
}

export function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
    'Content-Type': 'application/json',
  }
}
