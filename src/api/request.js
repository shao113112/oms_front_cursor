import axios from 'axios'
import { ElMessageBox } from 'element-plus'

const TOKEN_KEY = 'oms_token'
const USER_KEY = 'oms_user'

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

function isCode401(body) {
  if (!body || typeof body !== 'object') return false
  const code = body.code ?? body.data?.code
  return code === 401 || code === '401'
}

function handleUnauthorized() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  const path = window.location.pathname
  const doRedirect = () => {
    if (!path.startsWith('/auth')) {
      window.location.href = `/auth?redirect=${encodeURIComponent(path)}`
    }
  }
  ElMessageBox.alert('会话已过期，请重新登录', '提示', {
    confirmButtonText: '确认',
    customClass: 'oms-message-box',
    callback: () => {
      doRedirect()
    },
  })
}

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && isCode401(body)) {
      handleUnauthorized()
      return Promise.reject(new Error('会话已过期，请重新登录'))
    }
    if (body && body.status === 'E') {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return response
  },
  (err) => {
    if (err.response?.status === 401) {
      handleUnauthorized()
      return Promise.reject(new Error('会话已过期，请重新登录'))
    }
    const msg = err.response?.data?.message || err.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export { TOKEN_KEY }
