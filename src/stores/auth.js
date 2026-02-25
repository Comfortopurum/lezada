import { defineStore } from 'pinia'
import api from '@/services/api'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('authToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (tokenValue, userData) => {
    token.value = tokenValue
    user.value = userData

    localStorage.setItem('authToken', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const res = await api.post('/login', { email, password })

      const tokenValue = res.data?.token
      const userData = res.data?.user

      if (!tokenValue) {
        error.value = res.data?.message || 'Login succeeded but token is missing.'
        return false
      }

      setAuth(tokenValue, userData || null)
      return true
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Invalid login credentials'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (name, email, password) => {
    loading.value = true
    error.value = null

    try {
      const res = await api.post('/register', { name, email, password })
      const tokenValue = res.data?.token
      const userData = res.data?.user

      if (!tokenValue) {
        error.value = res.data?.message || 'Registration succeeded but token is missing.'
        return false
      }

      setAuth(tokenValue, userData || null)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (err) {
      console.warn('Logout API failed:', err.response?.data || err.message)
    } finally {
      clearAuth()
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuth,
  }
})
