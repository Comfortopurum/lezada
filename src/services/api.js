import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.headers?.Authorization) {
      // remove stale header if any
      delete config.headers.Authorization
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Optional: auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // optional: window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
