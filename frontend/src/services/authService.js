import api, { API_URL } from './api'

// ---------------------------------------------------------------------------
// Dados mock para o modo demo (sem backend)
// ---------------------------------------------------------------------------
const DEMO_USER  = { id: 1, name: 'Herickson Willian', email: 'demo@taskmanager.com' }
const DEMO_TOKEN = 'demo-token-github-pages'
const isDemoMode = !API_URL

// ---------------------------------------------------------------------------
// Auth Service
// ---------------------------------------------------------------------------

export async function login(email, password) {
  if (isDemoMode) {
    // Aceita qualquer credencial no modo demo
    localStorage.setItem('tm_token', DEMO_TOKEN)
    localStorage.setItem('tm_user', JSON.stringify(DEMO_USER))
    return { token: DEMO_TOKEN, user: DEMO_USER }
  }

  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('tm_token', data.data.token)
  localStorage.setItem('tm_user', JSON.stringify(data.data.user))
  return data.data
}

export async function register(name, email, password) {
  if (isDemoMode) {
    const user = { id: Date.now(), name, email }
    localStorage.setItem('tm_token', DEMO_TOKEN)
    localStorage.setItem('tm_user', JSON.stringify(user))
    return { token: DEMO_TOKEN, user }
  }

  const { data } = await api.post('/auth/register', { name, email, password })
  localStorage.setItem('tm_token', data.data.token)
  localStorage.setItem('tm_user', JSON.stringify(data.data.user))
  return data.data
}

export function logout() {
  localStorage.removeItem('tm_token')
  localStorage.removeItem('tm_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('tm_user')
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('tm_token')
}
