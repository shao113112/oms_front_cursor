export let shippingAddressesList = [
  { id: '1', recipient: 'Thomas BESSA', contact: '+88932312344432', address: 'Bouvervard Jourdan 75014 Sao Paulo, Brazil', isDefault: true },
]

export function addShippingAddress(data) {
  const id = String(Date.now())
  shippingAddressesList = [...shippingAddressesList, { id, ...data, isDefault: data.isDefault || false }]
  if (data.isDefault) {
    shippingAddressesList = shippingAddressesList.map((a) => ({ ...a, isDefault: a.id === id }))
  }
  return id
}

export function updateShippingAddress(id, data) {
  const idx = shippingAddressesList.findIndex((a) => a.id === id)
  if (idx === -1) return
  shippingAddressesList = shippingAddressesList.map((a, i) => (i === idx ? { ...a, ...data } : a))
  if (data.isDefault) {
    shippingAddressesList = shippingAddressesList.map((a) => ({ ...a, isDefault: a.id === id }))
  }
}

export function deleteShippingAddress(id) {
  shippingAddressesList = shippingAddressesList.filter((a) => a.id !== id)
}
