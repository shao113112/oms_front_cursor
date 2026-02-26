import { request, TOKEN_KEY } from './request'

/**
 * 后端统一 Response: { status: 'S'|'E', code, message, data }
 */

export function login(data) {
  return request.post('/users/login', data).then((res) => {
    const d = res.data?.data
    if (d?.token) {
      localStorage.setItem(TOKEN_KEY, d.token)
    }
    return res.data
  })
}

export function register(data) {
  return request.post('/users/register', {
    email: data.email,
    name: data.name,
    company: data.company || '',
    pwd: data.password,
  }).then((res) => res.data)
}
