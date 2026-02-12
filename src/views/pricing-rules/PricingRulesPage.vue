<template>
  <div class="w-full min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">通用报价管理</h1>
      <el-button type="primary" @click="openDialog()">+ 添加报价规则</el-button>
    </div>

    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden">
      <el-table :data="list" stripe>
        <el-table-column prop="logisticsProduct" label="物流产品" min-width="160" />
        <el-table-column prop="feeName" label="费用名称" width="120" />
        <el-table-column prop="calcMethod" label="计算方式" width="120" />
        <el-table-column prop="currency" label="币种" width="80" />
        <el-table-column prop="unitPrice" label="单价/单位" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <span :class="row.status === '启用' ? 'text-green-600' : 'text-gray-500'">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑报价规则' : '添加报价规则'" width="500px" destroy-on-close @close="resetForm">
      <el-form :model="form" label-width="100px">
        <el-form-item label="物流产品" required>
          <el-select v-model="form.logisticsProduct" placeholder="选择物流产品" class="w-full">
            <el-option label="巴西海运散装普货" value="巴西海运散装普货" />
            <el-option label="巴西空运散装普货" value="巴西空运散装普货" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用名称" required>
          <el-input v-model="form.feeName" placeholder="例如:运费、操作费" />
        </el-form-item>
        <el-form-item label="计算方式" required>
          <el-select v-model="form.calcMethod" class="w-full">
            <el-option label="按计费重" value="按计费重" />
            <el-option label="按计费体积" value="按计费体积" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种" required>
          <el-select v-model="form.currency" class="w-full">
            <el-option label="$ 美元" value="$" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input v-model="form.unitPriceNum" type="number" placeholder="0.00" />
        </el-form-item>
        <el-form-item label="单位" required>
          <el-select v-model="form.unit" class="w-full">
            <el-option label="KG" value="KG" />
            <el-option label="CBM" value="CBM" />
          </el-select>
        </el-form-item>
        <el-form-item label="计算公式(可选)">
          <el-input v-model="form.formula" placeholder="例如: weight * 1.2" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { pricingRulesList, addPricingRule, updatePricingRule, deletePricingRule } from '@/mock/pricingRules'

const list = ref([])

onMounted(() => {
  list.value = [...pricingRulesList]
})

const dialogVisible = ref(false)
const editingId = ref('')
const form = reactive({
  logisticsProduct: '',
  feeName: '',
  calcMethod: '按计费重',
  currency: '$',
  unitPriceNum: '',
  unit: 'KG',
  formula: '',
  enabled: true,
})

function openDialog(row) {
  editingId.value = row?.id || ''
  if (row) {
    form.logisticsProduct = row.logisticsProduct
    form.feeName = row.feeName
    form.calcMethod = row.calcMethod
    form.currency = row.currency
    form.unitPriceNum = row.unitPrice ? parseFloat(row.unitPrice.replace(/[^0-9.]/g, '')) : ''
    form.unit = row.unitPrice?.includes('CBM') ? 'CBM' : 'KG'
    form.enabled = row.status === '启用'
  }
  dialogVisible.value = true
}
function resetForm() {
  editingId.value = ''
  form.logisticsProduct = ''
  form.feeName = ''
  form.calcMethod = '按计费重'
  form.currency = '$'
  form.unitPriceNum = ''
  form.unit = 'KG'
  form.formula = ''
  form.enabled = true
}
function submitForm() {
  const unitPrice = `${form.currency}${form.unitPriceNum || '0.00'}/${form.unit}`
  const status = form.enabled ? '启用' : '停用'
  if (editingId.value) {
    updatePricingRule(editingId.value, { ...form, unitPrice, status })
    const item = list.value.find((r) => r.id === editingId.value)
    if (item) Object.assign(item, { logisticsProduct: form.logisticsProduct, feeName: form.feeName, calcMethod: form.calcMethod, currency: form.currency, unitPrice, status })
  } else {
    addPricingRule({ logisticsProduct: form.logisticsProduct, feeName: form.feeName, calcMethod: form.calcMethod, currency: form.currency, unitPrice, status })
    list.value = [...pricingRulesList]
  }
  dialogVisible.value = false
}
function handleDelete(id) {
  deletePricingRule(id)
  list.value = list.value.filter((r) => r.id !== id)
}
</script>
