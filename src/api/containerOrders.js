import { request } from './request'

/** 获取新建整柜订单号（用于创建页展示，提交后系统生成该单号） */
export function getNewContainerOrderNo() {
  return request.post('/containerOrders/getNewOrderNo').then((res) => res.data?.data ?? '')
}

/**
 * 分页查询整柜订单列表
 * @param params { page, size, orderNo }
 */
export function searchContainerOrders(params = {}) {
  return request
    .post('/containerOrders/search', {
      page: params.page ?? 1,
      size: params.size ?? 20,
      orderNo: params.orderNo || undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

/**
 * 创建整柜订单
 * @param payload { order: { orderNo?, pickupAddressId, shippingAddressId, orderStatus?, boxQty, memo }, goods: Array<{ goodsName, goodsEnglishName?, brand?, material?, spec?, purpose?, quantity, declaredPrice }> }
 */
export function createContainerOrder(payload) {
  return request
    .post('/containerOrders/create', payload)
    .then((res) => res.data?.data)
}

/**
 * 整柜订单详情
 * @param id 订单ID
 */
export function getContainerOrderDetail(id) {
  const numId = id != null && id !== '' ? Number(id) : null
  if (numId == null || Number.isNaN(numId)) {
    return Promise.resolve(null)
  }
  return request
    .post('/containerOrders/getDetail', { id: numId })
    .then((res) => {
      const body = res.data
      // 兼容 data / result 或直接返回详情对象
      const raw = body?.data ?? body?.result ?? body
      if (raw == null) return null
      return {
        order: raw.order ?? null,
        goods: Array.isArray(raw.goods) ? raw.goods : [],
      }
    })
}
