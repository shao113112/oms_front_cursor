import { request } from './request'

/** 后端 PageBean: { page, size, total, totalPage, items } */
export function searchLineOrders(params = {}) {
  const createTime = params.createTime
  return request
    .post('/lineOrders/search', {
      page: params.page ?? 1,
      size: params.size ?? 20,
      orderNo: params.orderNo || undefined,
      orderStatus: params.orderStatus || undefined,
      createTimeBegin: createTime?.[0] ? new Date(createTime[0]).toISOString() : undefined,
      createTimeEnd: createTime?.[1] ? new Date(createTime[1] + 'T23:59:59.999Z').toISOString() : undefined,
      creator: params.creator || undefined,
      logisticsProductId: params.logisticsProductId || undefined,
      cargoType: params.cargoType || undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

/**
 * 创建专线订单
 * @param payload { order: LineOrderCreate, boxes: LineOrderBoxItem[] }
 * LineOrderBoxItem = { box: LineOrderBox, goods: LineOrderBoxGoods[] }
 */
export function createLineOrder(payload) {
  return request
    .post('/lineOrders/create', payload)
    .then((res) => res.data?.data)
}

/** 订单详情：body 传 { id }，返回 { order, boxes, fees } */
export function getLineOrderDetail(id) {
  return request
    .post('/lineOrders/getDetail', { id: id != null ? Number(id) : undefined })
    .then((res) => res.data?.data)
}

/** 添加费用 */
export function addLineOrderFee(data) {
  return request
    .post('/lineOrders/addFee', {
      lineOrderId: data.lineOrderId,
      feeName: data.feeName,
      calcMethod: data.calcMethod,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      amount: data.amount,
      currency: data.currency || 'USD',
    })
    .then((res) => res.data?.data)
}

/** 修改费用 */
export function updateLineOrderFee(data) {
  return request
    .post('/lineOrders/updateFee', {
      id: data.id,
      lineOrderId: data.lineOrderId,
      feeName: data.feeName,
      calcMethod: data.calcMethod,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      amount: data.amount,
      currency: data.currency || 'USD',
    })
    .then(() => {})
}

/** 删除费用 */
export function deleteLineOrderFee(feeId) {
  return request
    .post('/lineOrders/deleteFee', { id: feeId })
    .then(() => {})
}

/** 确认费用 */
export function confirmLineOrderFee(lineOrderId) {
  return request
    .post('/lineOrders/confirmFee', { id: lineOrderId })
    .then(() => {})
}

/** 更新箱计费重量/体积 */
export function updateLineOrderBoxBilling(data) {
  return request
    .post('/lineOrders/updateBoxBilling', {
      id: data.id,
      billingWeight: data.billingWeight != null ? Number(data.billingWeight) : undefined,
      billingVolume: data.billingVolume != null ? Number(data.billingVolume) : undefined,
    })
    .then(() => {})
}
