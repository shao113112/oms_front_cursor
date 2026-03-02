import { request, TOKEN_KEY } from './request'

const USER_KEY = 'oms_user'

/**
 * 后端统一 Response: { status: 'S'|'E', code, message, data }
 */

export function login(data) {
  return request.post('/users/login', data).then((res) => {
    const d = res.data?.data
    if (d?.token) {
      localStorage.setItem(TOKEN_KEY, d.token)
    }
    if (d && (d.name != null || d.email != null)) {
      localStorage.setItem(USER_KEY, JSON.stringify({ name: d.name || '', email: d.email || '' }))
    }
    return res.data
  })
}

/** 获取当前登录用户信息（name、email），从 localStorage 读取 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** 登出：调用后端 users/logout，并清除本地 token 与用户信息 */
export function logout() {
  return request.post('/users/logout').catch(() => {}).finally(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  })
}

export { USER_KEY }

export function register(data) {
  return request.post('/users/register', {
    email: data.email,
    name: data.name,
    company: data.company || '',
    pwd: data.password,
  }).then((res) => res.data)
}
