export let pricingRulesList = [
  { id: '1', logisticsProduct: '巴西空运散装普货', feeName: '空运公斤费', calcMethod: '按计费重', currency: '$', unitPrice: '$55.00/KG', status: '启用' },
  { id: '2', logisticsProduct: '巴西海运散装普货', feeName: '海运体积费', calcMethod: '按计费体积', currency: '$', unitPrice: '$50.00/CBM', status: '启用' },
]

export function addPricingRule(data) {
  const id = String(Date.now())
  pricingRulesList = [...pricingRulesList, { id, ...data }]
  return id
}

export function updatePricingRule(id, data) {
  const idx = pricingRulesList.findIndex((r) => r.id === id)
  if (idx === -1) return
  pricingRulesList = pricingRulesList.map((r, i) => (i === idx ? { ...r, ...data } : r))
}

export function deletePricingRule(id) {
  pricingRulesList = pricingRulesList.filter((r) => r.id !== id)
}
