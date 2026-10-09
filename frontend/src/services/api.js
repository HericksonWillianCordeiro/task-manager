import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Instância do axios configurada com base URL e interceptors JWT.
 * Se VITE_API_URL não estiver definida, usamos modo demo (localStorage).
 */
const api = axios.create({
  baseURL: API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Injeta o token JWT em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Trata erros globais (401 → redireciona para login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tm_token')
      localStorage.removeItem('tm_user')
      window.location.href = '/task-manager/'
    }
    return Promise.reject(error)
  }
)

export { API_URL }
export default api
