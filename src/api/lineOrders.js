import { request } from './request'

/** 获取新建专线订单号（用于创建页展示及箱号前缀 orderNo_001） */
export function getNewLineOrderNo() {
  return request.post('/lineOrders/getNewOrderNo').then((res) => res.data?.data ?? '')
}

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
 */
export function createLineOrder(payload) {
  return request
    .post('/lineOrders/create', payload)
    .then((res) => res.data?.data)
}

/**
 * 保存专线订单草稿（新建时步骤 3 的「保存草稿」）
 * @param payload 同 createLineOrder
 */
export function createLineOrderDraft(payload) {
  return request
    .post('/lineOrders/draft', payload)
    .then((res) => res.data?.data)
}

/** 删除草稿订单（仅 DRAFT 可删） */
export function deleteLineOrderDraft(id) {
  return request
    .post('/lineOrders/deleteDraft', { id: id != null ? Number(id) : undefined })
    .then(() => {})
}

/** 复制订单：根据订单 id 复制生成新订单，返回新订单 id */
export function copyLineOrder(id) {
  return request
    .post('/lineOrders/copyOrder', { id: id != null ? Number(id) : undefined })
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

/**
 * 打印箱唛：根据选中订单 ID 列表生成 PDF，返回 Blob（用于预览/下载）
 * @param lineOrderIds 专线订单 ID 数组
 */
export function printBoxLabels(lineOrderIds) {
  return request
    .post('/lineOrders/printBoxLabels', { lineOrderIds: lineOrderIds || [] }, { responseType: 'blob' })
    .then((res) => res.data)
}

/**
 * 导出 WMS 入库单 Excel
 * @param lineOrderIds 专线订单 ID 数组
 * @param expectedArrivalDate 预计到仓日期，格式 yyyy-MM-dd
 * @returns Promise<Blob>
 */
export function exportWmsInbound(lineOrderIds, expectedArrivalDate) {
  return request
    .post(
      '/lineOrders/exportWmsInbound',
      { lineOrderIds: lineOrderIds || [], expectedArrivalDate: expectedArrivalDate || '' },
      { responseType: 'blob' }
    )
    .then((res) => res.data)
}
