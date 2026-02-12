export let pickupAddressesList = []

export function addPickupAddress(data) {
  const id = String(Date.now())
  pickupAddressesList = [...pickupAddressesList, { id, ...data, isDefault: data.isDefault || false }]
  if (data.isDefault) {
    pickupAddressesList = pickupAddressesList.map((a) => ({ ...a, isDefault: a.id === id }))
  }
  return id
}

export function updatePickupAddress(id, data) {
  const idx = pickupAddressesList.findIndex((a) => a.id === id)
  if (idx === -1) return
  pickupAddressesList = pickupAddressesList.map((a, i) => (i === idx ? { ...a, ...data } : a))
  if (data.isDefault) {
    pickupAddressesList = pickupAddressesList.map((a) => ({ ...a, isDefault: a.id === id }))
  }
}

export function deletePickupAddress(id) {
  pickupAddressesList = pickupAddressesList.filter((a) => a.id !== id)
}
