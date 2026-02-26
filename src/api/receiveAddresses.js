import { request } from './request'

/** 后端收货地址(收件信息) PageBean */
export function searchReceiveAddresses(params = {}) {
  return request
    .post('/receiveAddresses/search', {
      page: params.page ?? 1,
      size: params.size ?? 100,
      name: params.name ?? undefined,
      phone: params.phone ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

export function createReceiveAddress(data) {
  return request
    .post('/receiveAddresses/create', {
      name: data.name ?? data.recipient,
      phone: data.phone ?? data.contact,
      address: data.address,
      isDefault: !!data.isDefault,
      memo: data.memo ?? '',
    })
    .then((res) => res.data?.data)
}

export function updateReceiveAddress(data) {
  return request
    .post('/receiveAddresses/update', {
      id: data.id,
      name: data.name ?? data.recipient,
      phone: data.phone ?? data.contact,
      address: data.address,
      isDefault: !!data.isDefault,
      memo: data.memo ?? '',
    })
    .then(() => {})
}

export function deleteReceiveAddress(id) {
  return request.post('/receiveAddresses/delete', { id }).then(() => {})
}
