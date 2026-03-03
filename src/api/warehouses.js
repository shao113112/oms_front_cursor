import { request } from './request'

/** 下拉用：不分页，返回数组 */
export function listWarehouses(params = {}) {
  return request
    .post('/warehouses/list', params || {})
    .then((res) => res.data?.data ?? [])
}

/**
 * 仓库分页查询
 * @param params { page, size }
 * @returns { items: Array<{ id, warehouseName, name, phone, address, memo }>, total }
 */
export function searchWarehouses(params = {}) {
  return request
    .post('/warehouses/search', {
      page: params.page ?? 1,
      size: params.size ?? 500,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}
