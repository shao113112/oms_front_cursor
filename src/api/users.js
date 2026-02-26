import { request } from './request'

/** 后端 PageBean: { page, size, total, totalPage, items }；用户项含 createTime，角色暂不传 */
export function searchUsers(params = {}) {
  return request
    .post('/users/search', {
      page: params.page ?? 1,
      size: params.size ?? 100,
      createTimeStart: params.createTimeStart ?? undefined,
      createTimeEnd: params.createTimeEnd ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}
