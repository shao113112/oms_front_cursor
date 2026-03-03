import { request } from './request'

/** 物流产品报价列表（含产品名、运输方式、货物类型、单价等，专线订单选择弹窗用） */
export function listLogisticsProductPrices(params = {}) {
  return request
    .post('/logisticsProductPrices/list', {
      productId: params.productId ?? undefined,
      transportMethod: params.transportMethod ?? undefined,
      cargoType: params.cargoType ?? undefined,
    })
    .then((res) => res.data?.data ?? [])
}

/** 分页查询：返回 { items, total, page, size, totalPage } */
export function searchLogisticsProductPrices(params = {}) {
  return request
    .post('/logisticsProductPrices/search', {
      page: params.page ?? 1,
      size: params.size ?? 10,
      productId: params.productId ?? undefined,
      transportMethod: params.transportMethod ?? undefined,
      cargoType: params.cargoType ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

export function getLogisticsProductPriceById(id) {
  return request
    .post('/logisticsProductPrices/getById', { id })
    .then((res) => res.data?.data ?? null)
}

export function createLogisticsProductPrice(data) {
  return request
    .post('/logisticsProductPrices/create', {
      productId: data.productId,
      feeName: data.feeName ?? undefined,
      calcMethod: data.calcMethod ?? undefined,
      unitPrice: data.unitPrice,
      unit: data.unit ?? '件',
      currency: data.currency ?? undefined,
      calcFormula: data.calcFormula ?? undefined,
      memo: data.memo ?? '',
      enabledStatus: data.enabledStatus ?? data.status ?? 'AVAILABLE',
    })
    .then((res) => res.data?.data)
}

export function updateLogisticsProductPrice(data) {
  return request
    .post('/logisticsProductPrices/update', {
      id: data.id,
      productId: data.productId,
      feeName: data.feeName ?? undefined,
      calcMethod: data.calcMethod ?? undefined,
      unitPrice: data.unitPrice,
      unit: data.unit ?? '件',
      currency: data.currency ?? undefined,
      calcFormula: data.calcFormula ?? undefined,
      memo: data.memo ?? '',
      enabledStatus: data.enabledStatus ?? data.status ?? 'AVAILABLE',
    })
    .then(() => {})
}

export function deleteLogisticsProductPrice(id) {
  return request.post('/logisticsProductPrices/delete', { id }).then(() => {})
}
