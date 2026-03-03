import { request } from './request'

/** 下拉用：不分页，返回数组 */
export function listUsers(params = {}) {
  return request
    .post('/users/list', params || {})
    .then((res) => res.data?.data ?? [])
}

/** 后端 PageBean: { page, size, total, totalPage, items }；用户项含 createTime，角色暂不传；keyword 模糊匹配邮箱/姓名 */
export function searchUsers(params = {}) {
  return request
    .post('/users/search', {
      page: params.page ?? 1,
      size: params.size ?? 100,
      keyword: params.keyword?.trim() || undefined,
      createTimeStart: params.createTimeStart ?? undefined,
      createTimeEnd: params.createTimeEnd ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

/** 创建子用户：email, name, pwd, company, mainId（主用户传当前用户 id） */
export function createUser(body) {
  return request.post('/users/create', {
    email: body.email,
    name: body.name,
    pwd: body.pwd,
    company: body.company ?? '',
    mainId: body.mainId,
  })
}

/** 修改密码：id 当前用户 id，pwd 原密码，newPwd 新密码 */
export function updatePwd({ id, pwd, newPwd }) {
  return request.post('/users/updatePwd', { id, pwd, newPwd })
}
