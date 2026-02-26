import { request } from './request'

/** 后端 PageBean: { page, size, total, totalPage, items } */
export function searchLogisticsProducts(params = {}) {
  return request
    .post('/logisticsProducts/search', {
      page: params.page ?? 1,
      size: params.size ?? 100,
      productName: params.productName ?? undefined,
      transportMethod: params.transportMethod ?? undefined,
      cargoType: params.cargoType ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

export function createLogisticsProduct(data) {
  return request
    .post('/logisticsProducts/create', {
      productName: data.productName ?? data.name,
      transportMethod: data.transportMethod,
      cargoType: data.cargoType,
      memo: data.memo ?? data.remark ?? '',
      enabledStatus: data.enabledStatus ?? 'AVAILABLE',
    })
    .then((res) => res.data?.data)
}

export function updateLogisticsProduct(data) {
  return request
    .post('/logisticsProducts/update', {
      id: data.id,
      productName: data.productName ?? data.name,
      transportMethod: data.transportMethod,
      cargoType: data.cargoType,
      memo: data.memo ?? data.remark ?? '',
      enabledStatus: data.enabledStatus ?? 'AVAILABLE',
    })
    .then(() => {})
}

export function deleteLogisticsProduct(id) {
  return request.post('/logisticsProducts/delete', { id }).then(() => {})
}
