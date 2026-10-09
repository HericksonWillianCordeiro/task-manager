import { createContext, useContext, useState, useCallback } from 'react'
import { login, register, logout, getCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleLogin = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loggedUser } = await login(email, password)
      setUser(loggedUser)
      return loggedUser
    } catch (err) {
      const message = err.response?.data?.message || 'Falha ao fazer login.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRegister = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: newUser } = await register(name, email, password)
      setUser(newUser)
      return newUser
    } catch (err) {
      const message = err.response?.data?.message || 'Falha ao cadastrar.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login:    handleLogin,
        register: handleRegister,
        logout:   handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
