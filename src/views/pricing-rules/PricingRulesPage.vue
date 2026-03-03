<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <h1 class="page-title">通用报价管理</h1>
      <el-button type="primary" @click="openDialog()">+ 添加报价规则</el-button>
    </div>

    <div class="table-card">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%" class="mobile-table-dense mobile-action-buttons">
        <el-table-column prop="productName" label="物流产品" min-width="160" />
        <el-table-column prop="feeName" label="费用名称" min-width="120" />
        <el-table-column prop="calcMethod" label="计算方式" min-width="120" />
        <el-table-column prop="currency" label="币种" width="80" />
        <el-table-column label="单价/单位" width="140">
          <template #default="{ row }">
            {{ formatUnitPrice(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="enabledStatus" label="状态" width="80">
          <template #default="{ row }">
            <span :class="(row.enabledStatus || row.enabledStatusText || '').toString().includes('启用') || row.enabledStatus === 'AVAILABLE' ? 'text-green-600' : 'text-slate-500'">
              {{ row.enabledStatus === 'AVAILABLE' || (row.enabledStatusText && row.enabledStatusText.includes('启用')) ? '启用' : '停用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div class="pagination-bar">
        <div class="flex items-center gap-2">
          <span class="text-slate-500">每页显示</span>
          <el-select v-model="pageSize" style="width: 100px" @change="page = 1; fetchList()">
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
          </el-select>
        </div>
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          :small="true"
          class="[&_.el-pagination__editor]:hidden"
          @current-change="fetchList"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑报价规则' : '添加报价规则'" width="500px" destroy-on-close @close="resetForm">
      <el-form :model="form" label-width="100px">
        <el-form-item label="物流产品" required>
          <el-select v-model="form.productId" placeholder="选择物流产品" class="w-full" filterable>
            <el-option
              v-for="p in productOptions"
              :key="p.id"
              :label="(p.productName || p.name) + (p.transportMethod || p.cargoType ? ` · ${p.transportMethod || ''} ${p.cargoType || ''}` : '')"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="费用名称">
          <el-input v-model="form.feeName" placeholder="例如:运费、操作费" />
        </el-form-item>
        <el-form-item label="计算方式">
          <el-select v-model="form.calcMethod" class="w-full">
            <el-option label="按计费重" value="按计费重" />
            <el-option label="按计费体积" value="按计费体积" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="form.currency" class="w-full">
            <el-option label="$ 美元" value="$" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input v-model="form.unitPrice" type="number" placeholder="0.00" step="0.01" />
        </el-form-item>
        <el-form-item label="单位" required>
          <el-select v-model="form.unit" class="w-full">
            <el-option label="KG" value="KG" />
            <el-option label="CBM" value="CBM" />
            <el-option label="件" value="件" />
          </el-select>
        </el-form-item>
        <el-form-item label="计算公式(可选)">
          <el-input v-model="form.calcFormula" placeholder="例如: weight * 1.2" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo" type="textarea" placeholder="备注" :rows="2" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  searchLogisticsProductPrices,
  getLogisticsProductPriceById,
  createLogisticsProductPrice,
  updateLogisticsProductPrice,
  deleteLogisticsProductPrice,
} from '@/api/logisticsProductPrices'
import { listLogisticsProducts } from '@/api/logisticsProducts'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const productOptions = ref([])

function formatUnitPrice(row) {
  const cur = row.currency || '$'
  const price = row.unitPrice
  const unit = row.unit || ''
  if (price == null && price !== 0) return '-'
  return unit ? `${cur}${price} / ${unit}` : `${cur}${price}`
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchLogisticsProductPrices({ page: page.value, size: pageSize.value })
    list.value = res.items || []
    total.value = res.total ?? 0
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

async function loadProductOptions() {
  try {
    productOptions.value = await listLogisticsProducts()
    if (!Array.isArray(productOptions.value)) productOptions.value = []
  } catch {
    productOptions.value = []
  }
}

onMounted(() => {
  fetchList()
  loadProductOptions()
})

const dialogVisible = ref(false)
const editingId = ref('')
const form = reactive({
  productId: null,
  feeName: '',
  calcMethod: '按计费重',
  currency: '$',
  unitPrice: '',
  unit: 'KG',
  calcFormula: '',
  memo: '',
  enabled: true,
})

function fillFormFromRow(row) {
  form.productId = row.productId
  form.feeName = row.feeName ?? ''
  form.calcMethod = row.calcMethod ?? '按计费重'
  form.currency = row.currency ?? '$'
  form.unitPrice = row.unitPrice != null ? Number(row.unitPrice) : ''
  form.unit = row.unit ?? 'KG'
  form.calcFormula = row.calcFormula ?? ''
  form.memo = row.memo ?? ''
  form.enabled = row.enabledStatus === 'AVAILABLE' || (String(row.enabledStatus || row.enabledStatusText || '').includes('启用'))
}

function openDialog(row) {
  editingId.value = row?.id ?? ''
  if (row && row.id) {
    fillFormFromRow(row)
    getLogisticsProductPriceById(row.id).then((detail) => {
      if (detail) {
        form.productId = detail.productId
        form.feeName = detail.feeName ?? ''
        form.calcMethod = detail.calcMethod ?? '按计费重'
        form.currency = detail.currency ?? '$'
        form.unitPrice = detail.unitPrice != null ? Number(detail.unitPrice) : ''
        form.unit = detail.unit ?? 'KG'
        form.calcFormula = detail.calcFormula ?? ''
        form.memo = detail.memo ?? ''
        form.enabled = detail.enabledStatus === 'AVAILABLE' || (detail.enabledStatusText && String(detail.enabledStatusText).includes('启用'))
      }
    }).catch(() => {})
  } else {
    resetForm()
  }
  dialogVisible.value = true
}

function resetForm() {
  editingId.value = ''
  form.productId = null
  form.feeName = ''
  form.calcMethod = '按计费重'
  form.currency = '$'
  form.unitPrice = ''
  form.unit = 'KG'
  form.calcFormula = ''
  form.memo = ''
  form.enabled = true
}

async function submitForm() {
  const unitPriceNum = form.unitPrice === '' || form.unitPrice == null ? null : Number(form.unitPrice)
  if (unitPriceNum == null || (typeof unitPriceNum === 'number' && isNaN(unitPriceNum))) {
    ElMessage.warning('请输入有效单价')
    return
  }
  if (!form.productId) {
    ElMessage.warning('请选择物流产品')
    return
  }
  saving.value = true
  try {
    const payload = {
      productId: form.productId,
      feeName: form.feeName || undefined,
      calcMethod: form.calcMethod,
      currency: form.currency,
      unitPrice: unitPriceNum,
      unit: form.unit,
      calcFormula: form.calcFormula || undefined,
      memo: form.memo || undefined,
      enabledStatus: form.enabled ? 'AVAILABLE' : 'UNAVAILABLE',
    }
    if (editingId.value) {
      await updateLogisticsProductPrice({ id: editingId.value, ...payload })
    } else {
      await createLogisticsProductPrice(payload)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await fetchList()
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  const id = typeof row === 'object' ? row.id : row
  const name = row?.productName || row?.feeName || '该报价'
  try {
    await ElMessageBox.confirm(`确定删除「${name}」吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      appendTo: document.body,
      customClass: 'oms-message-box',
    })
    await deleteLogisticsProductPrice(id)
    ElMessage.success('删除成功')
    await fetchList()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}
</script>
