// 整柜订单 Mock 数据
export const containerOrdersList = [
  {
    id: '20251113-001',
    waybillNo: '20251113-001',
    pickupAddress: '-',
    recipientAddress: '-',
    transportMethod: '海运',
    boxCount: 1,
    boxSpec: '1箱',
    status: '待处理',
    remark: '-',
    submitTime: '2025/11/13 13:57:27',
  },
]

export function getContainerOrderDetail(id) {
  const order = containerOrdersList.find((o) => o.id === id || o.waybillNo === id)
  if (!order) return null
  return {
    ...order,
    orderNo: order.waybillNo,
    boxCount: 1,
    createTime: order.submitTime,
    pickupContact: '',
    pickupPhone: '',
    pickupAddressDetail: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddressDetail: '',
    declarationItems: [
      {
        productName: 'hanger',
        englishName: 'hanger',
        brand: '-',
        declaredPrice: '1.99',
        quantity: 1000,
        unit: '件',
        boxCount: 1000,
        totalPrice: '1990.00',
        material: '木头',
        specification: '-',
        purpose: '-',
      },
    ],
    totalPieces: 1000,
    totalBoxes: 1000,
    totalDeclaredValue: '1990.00',
  }
}
