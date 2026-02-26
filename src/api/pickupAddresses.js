import { request } from './request'

/** 后端 PageBean: { page, size, total, totalPage, items } */
export function searchPickupAddresses(params = {}) {
  return request
    .post('/pickupAddresses/search', {
      page: params.page ?? 1,
      size: params.size ?? 100,
      addressName: params.addressName ?? undefined,
      name: params.name ?? undefined,
      phone: params.phone ?? undefined,
    })
    .then((res) => res.data?.data ?? { items: [], total: 0 })
}

export function createPickupAddress(data) {
  return request
    .post('/pickupAddresses/create', {
      addressName: data.addressName ?? data.name,
      name: data.contact,
      phone: data.phone,
      address: data.address,
      isDefault: !!data.isDefault,
      memo: data.memo ?? data.remark ?? '',
    })
    .then((res) => res.data?.data)
}

export function updatePickupAddress(data) {
  return request
    .post('/pickupAddresses/update', {
      id: data.id,
      addressName: data.addressName ?? data.name,
      name: data.contact,
      phone: data.phone,
      address: data.address,
      isDefault: !!data.isDefault,
      memo: data.memo ?? data.remark ?? '',
    })
    .then(() => {})
}

export function deletePickupAddress(id) {
  return request.post('/pickupAddresses/delete', { id }).then(() => {})
}
