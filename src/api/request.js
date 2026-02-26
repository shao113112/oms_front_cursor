import axios from 'axios'

const TOKEN_KEY = 'oms_token'

export const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Token = token
    }
    return config
  },
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && body.status === 'E') {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return response
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      const path = window.location.pathname
      if (!path.startsWith('/auth')) {
        window.location.href = `/auth?redirect=${encodeURIComponent(path)}`
      }
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    const msg = err.response?.data?.message || err.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export { TOKEN_KEY }
