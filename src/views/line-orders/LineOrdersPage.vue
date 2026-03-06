<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <h1 class="page-title">专线订单管理</h1>
      <router-link to="/line-orders/create" class="btn-primary-main">
        <span class="text-lg" aria-hidden="true">+</span> 新建订单
      </router-link>
    </div>

    <!-- 搜索与筛选：按 订单号、创建时间、创建人、物流产品、货物属性 排列，标签在控件左上角 -->
    <div class="page-card page-card-padding-tight mb-6">
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <div class="filter-field">
          <span class="filter-field__label">订单号</span>
          <el-input v-model="searchKeyword" clearable style="width: 160px" />
        </div>
        <div class="filter-field">
          <span class="filter-field__label">创建时间</span>
          <div class="flex items-center gap-1">
            <el-date-picker
              v-model="filters.createTimeStart"
              type="date"
              value-format="YYYY-MM-DD"
              class="line-order-date-start"
            />
            <span class="text-slate-400 text-xs">至</span>
            <el-date-picker
              v-model="filters.createTimeEnd"
              type="date"
              value-format="YYYY-MM-DD"
              class="line-order-date-end"
            />
          </div>
        </div>
        <div class="filter-field">
          <span class="filter-field__label">创建人</span>
          <el-input v-model="filters.creator" clearable style="width: 100px" />
        </div>
        <div class="filter-field">
          <span class="filter-field__label">物流产品</span>
          <el-select v-model="filters.logisticsProductId" clearable filterable style="width: 160px">
            <el-option label="全部" value="" />
            <el-option v-for="p in logisticsProducts" :key="p.id" :label="p.name || p.productName" :value="p.id" />
          </el-select>
        </div>
        <div class="filter-field">
          <span class="filter-field__label">货物属性</span>
          <el-select v-model="filters.cargoType" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="普货" value="普货" />
            <el-option label="特货" value="特货" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 操作栏：搜索/重置 左侧，复制等 右侧 -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
      <div class="flex items-center gap-2">
        <el-button type="primary" @click="doSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <el-button size="small" :disabled="selectedRows.length !== 1" :loading="copyLoading" @click="handleCopyOrder">复制</el-button>
        <el-button size="small">重新计费</el-button>
        <el-button size="small" :disabled="selectedRows.length === 0" :loading="printBoxLabelLoading" @click="handlePrintBoxLabels">打印箱唛</el-button>
        <el-button size="small">统计装柜</el-button>
        <el-dropdown>
          <el-button size="small">导出 <span class="ml-1">▼</span></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :disabled="selectedRows.length === 0" @click="openExportWmsDialog">导出WMS入库单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popover placement="bottom-end" :width="220" trigger="click">
          <template #reference>
            <el-button size="small">列设置</el-button>
          </template>
          <div class="text-sm font-medium text-slate-700 mb-2">显示列</div>
          <div class="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
            <el-checkbox v-for="col in columnConfig" :key="col.key" v-model="columnVisible[col.key]">
              {{ col.label }}
            </el-checkbox>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 订单状态 Tab：在搜索重置下方、分页区上方 -->
    <div class="mb-4">
      <el-tabs v-model="activeStatus" class="line-order-status-tabs">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待处理" name="PENDING" />
        <el-tab-pane label="运输中" name="TRANSPORTING" />
        <el-tab-pane label="已送达" name="DELIVERED" />
        <el-tab-pane label="草稿" name="DRAFT" />
      </el-tabs>
    </div>

    <!-- 表格：横向可滚动，占满宽度 -->
    <div class="table-card">
      <div class="responsive-table-container">
        <el-table ref="tableRef" :data="list" stripe v-loading="loading" style="width: 100%; min-width: 1200px" max-height="500" class="mobile-table-dense mobile-action-buttons" @selection-change="onSelectionChange">
          <el-table-column type="selection" width="40" />
          <el-table-column v-if="columnVisible.orderNo" prop="orderNo" label="订单号" min-width="100">
            <template #default="{ row }">
              <router-link
                :to="row.orderStatus === 'DRAFT' ? `/line-orders/create?draftId=${row.id}` : `/line-orders/${row.id}`"
                class="text-primary hover:underline"
              >
                {{ row.orderNo || '-' }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column v-if="columnVisible.referenceNo" prop="referenceNo" label="参考号" min-width="80">
            <template #default="{ row }">{{ row.referenceNo || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.warehouse" label="集货仓" min-width="90">
            <template #default="{ row }">{{ row.warehouseName ?? '-' }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.cargoType" prop="cargoType" label="货物属性" min-width="80">
            <template #default="{ row }">{{ row.cargoType || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.receiveAddress" label="收件信息" min-width="200">
            <template #default="{ row }">
              <div class="flex flex-col gap-0.5 text-sm">
                <div>{{ row.receiveAddressName ?? '-' }} / {{ row.receiveAddressPhone ?? '-' }}</div>
                <div class="text-slate-500" :title="row.receiveAddress">{{ row.receiveAddress ?? '-' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="columnVisible.boxQty" prop="boxQty" label="箱数" width="70">
            <template #default="{ row }">{{ row.boxQty ?? 0 }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.totalWeight" label="总重量(KG)" width="100">
            <template #default="{ row }">{{ formatNum(row.totalWeight) }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.totalVolume" label="总体积(CBM)" width="110">
            <template #default="{ row }">{{ formatNum(row.totalVolume) }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.logisticsProduct" label="物流产品" min-width="100">
            <template #default="{ row }">{{ row.logisticsProductName || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.orderStatus" label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small" :type="orderStatusTagType(row.orderStatus)">{{ orderStatusText(row.orderStatus) || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="columnVisible.fee" label="费用" min-width="160">
            <template #default="{ row }">
              <span v-if="row.totalFee != null && row.totalFee !== ''">{{ formatFee(row) }}</span>
              <span v-else class="text-slate-400">-</span>
              <template v-if="row.totalFee != null && row.totalFee !== ''">
                <el-tag v-if="row.feeConfirmed" size="small" type="success" class="ml-1.5">已确认</el-tag>
                <el-tag v-else size="small" type="warning" class="ml-1.5">未确认</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-if="columnVisible.creator" prop="creator" label="创建人" width="90">
            <template #default="{ row }">{{ row.creator || '-' }}</template>
          </el-table-column>
          <el-table-column v-if="columnVisible.createTime" label="创建时间" width="140">
            <template #default="{ row }">{{ formatDate(row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-1">
                <!-- 草稿：编辑 + 删除 -->
                <template v-if="row.orderStatus === 'DRAFT'">
                  <router-link :to="`/line-orders/create?draftId=${row.id}`" class="inline-flex items-center justify-center text-slate-500 hover:text-primary p-0.5" title="编辑">
                    <el-icon :size="18"><Edit /></el-icon>
                  </router-link>
                  <el-button type="danger" link class="p-0.5 min-w-0 inline-flex items-center justify-center text-red-500 hover:text-red-600" title="删除" @click="handleDeleteDraft(row)">
                    <el-icon :size="18"><Delete /></el-icon>
                  </el-button>
                </template>
                <!-- 非草稿：查看详情 -->
                <router-link v-else :to="`/line-orders/${row.id}`" class="inline-flex items-center justify-center text-slate-500 hover:text-primary p-0.5" title="查看">
                  <el-icon :size="18"><View /></el-icon>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页区：每页条数 + 分页 -->
      <div class="pagination-bar">
          <div class="flex items-center gap-2">
            <span class="text-slate-500">每页显示</span>
            <el-select v-model="pageSize" style="width: 100px" @change="currentPage = 1; fetchList()">
              <el-option label="10条" :value="10" />
              <el-option label="20条" :value="20" />
              <el-option label="50条" :value="50" />
              <el-option label="100条" :value="100" />
            </el-select>
          </div>
          <el-pagination
          v-model:current-page="currentPage"
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :small="true"
          class="[&_.el-pagination__editor]:hidden"
          @current-change="fetchList"
        />
      </div>
    </div>

    <!-- 导出 WMS 入库单弹窗 -->
    <el-dialog
      v-model="showExportWmsDialog"
      title="导出WMS入库单"
      width="420px"
      :close-on-click-modal="false"
      @close="exportWmsExpectedDate = ''"
    >
      <p class="text-slate-600 text-sm mb-4">请选择预计到仓日期，确认后将生成WMS入库单文件</p>
      <div class="mb-2">
        <span class="text-sm text-slate-500">预计到仓日期</span>
      </div>
      <el-date-picker
        v-model="exportWmsExpectedDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="选择日期"
        style="width: 100%"
        class="mb-4"
      />
      <p class="text-slate-500 text-sm">已选择 {{ selectedRows.length }} 个订单</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showExportWmsDialog = false">取消</el-button>
          <el-button type="primary" :loading="exportWmsLoading" @click="confirmExportWms">确认导出</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus'
import { searchLineOrders, printBoxLabels, exportWmsInbound, deleteLineOrderDraft, copyLineOrder } from '@/api/lineOrders'
import { listLogisticsProducts } from '@/api/logisticsProducts'

const router = useRouter()
const tableRef = ref(null)
const selectedRows = ref([])
const printBoxLabelLoading = ref(false)
const copyLoading = ref(false)
const showExportWmsDialog = ref(false)
const exportWmsExpectedDate = ref('')
const exportWmsLoading = ref(false)

const list = ref([])
const total = ref(0)
const loading = ref(false)
const searchKeyword = ref('')
const activeStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const logisticsProducts = ref([])

const STORAGE_KEY_COLUMNS = 'line_orders_column_visible'
const columnConfig = [
  { key: 'orderNo', label: '订单号' },
  { key: 'referenceNo', label: '参考号' },
  { key: 'warehouse', label: '集货仓' },
  { key: 'cargoType', label: '货物属性' },
  { key: 'receiveAddress', label: '收件信息' },
  { key: 'boxQty', label: '箱数' },
  { key: 'totalWeight', label: '总重量(KG)' },
  { key: 'totalVolume', label: '总体积(CBM)' },
  { key: 'logisticsProduct', label: '物流产品' },
  { key: 'orderStatus', label: '状态' },
  { key: 'fee', label: '费用' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' }
]
const defaultColumnVisible = Object.fromEntries(columnConfig.map(c => [c.key, true]))
function loadColumnVisible() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLUMNS)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultColumnVisible, ...parsed }
    }
  } catch (_) {}
  return { ...defaultColumnVisible }
}
const columnVisible = reactive(loadColumnVisible())
watch(columnVisible, (val) => {
  try { localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(val)) } catch (_) {}
}, { deep: true })

const filters = reactive({
  logisticsProductId: '',
  cargoType: '',
  createTimeStart: '',
  createTimeEnd: '',
  creator: '',
})

const orderStatusMap = { DRAFT: '草稿', PENDING: '待处理', TRANSPORTING: '运输中', DELIVERED: '已送达', CANCELLED: '已取消' }
/** 订单状态对应 el-tag type，用于区分颜色 */
const orderStatusTagTypeMap = { DRAFT: 'info', PENDING: 'warning', TRANSPORTING: 'primary', DELIVERED: 'success', CANCELLED: 'danger' }
function orderStatusText(v) {
  if (v == null || v === '') return ''
  return orderStatusMap[v] || (typeof v === 'string' ? v : '')
}
function orderStatusTagType(v) {
  return orderStatusTagTypeMap[v] || 'info'
}

function formatNum(v) {
  if (v == null || v === '') return '-'
  const n = Number(v)
  return isNaN(n) ? String(v) : n
}

function formatFee(row) {
  const fee = row.totalFee != null ? Number(row.totalFee) : null
  const cur = row.feeCurrency || ''
  if (fee == null || isNaN(fee)) return '-'
  return fee.toFixed(2) + ' ' + cur
}

function formatDate(v) {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false })
}

function getProductName(id) {
  if (id == null || id === '') return ''
  const p = logisticsProducts.value.find((x) => x.id === id || x.id === String(id))
  return p ? (p.name || p.productName) : ''
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchLineOrders({
      page: currentPage.value,
      size: pageSize.value,
      orderNo: searchKeyword.value.trim() || undefined,
      orderStatus: activeStatus.value === 'all' ? undefined : activeStatus.value,
      createTime: (filters.createTimeStart || filters.createTimeEnd) ? [filters.createTimeStart || null, filters.createTimeEnd || null] : undefined,
      creator: filters.creator || undefined,
      logisticsProductId: filters.logisticsProductId || undefined,
      cargoType: filters.cargoType || undefined,
    })
    list.value = res.items ?? []
    total.value = res.total ?? 0
  } catch (e) {
    ElNotification({ title: '错误', message: e?.message || '加载失败', type: 'error' })
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function onSelectionChange(rows) {
  selectedRows.value = rows || []
}

async function handleCopyOrder() {
  const rows = selectedRows.value
  if (rows.length !== 1) {
    ElNotification({ title: '提示', message: '请勾选一条订单后再复制', type: 'warning' })
    return
  }
  const id = rows[0].id
  if (id == null) {
    ElNotification({ title: '提示', message: '所选订单无效', type: 'warning' })
    return
  }
  copyLoading.value = true
  try {
    const newId = await copyLineOrder(id)
    ElNotification({ title: '成功', message: '复制成功', type: 'success' })
    await fetchList()
    if (newId != null) {
      router.push(`/line-orders/${newId}`)
    }
  } catch (e) {
    ElNotification({ title: '错误', message: e?.message || '复制失败', type: 'error' })
  } finally {
    copyLoading.value = false
  }
}

async function handleDeleteDraft(row) {
  try {
    await ElMessageBox.confirm(`确定删除草稿订单「${row.orderNo || row.id}」吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'oms-message-box',
      showClose: false,
    })
    await deleteLineOrderDraft(row.id)
    ElNotification({ title: '成功', message: '已删除', type: 'success' })
    await fetchList()
  } catch (e) {
    if (e !== 'cancel') ElNotification({ title: '错误', message: e?.message || '删除失败', type: 'error' })
  }
}

async function handlePrintBoxLabels() {
  const rows = selectedRows.value
  if (!rows.length) {
    ElNotification({ title: '提示', message: '请先勾选要打印箱唛的订单', type: 'warning' })
    return
  }
  const ids = rows.map((r) => r.id).filter((id) => id != null)
  if (!ids.length) {
    ElNotification({ title: '提示', message: '所选订单无有效ID', type: 'warning' })
    return
  }
  printBoxLabelLoading.value = true
  try {
    const blob = await printBoxLabels(ids)
    const url = URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob], { type: 'application/pdf' }))
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (win) {
      setTimeout(() => {
        try { win.print() } catch (_) {}
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      }, 2000)
    } else {
      ElNotification({ title: '提示', message: '请允许弹窗以打开打印预览', type: 'warning' })
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    let msg = e?.message || '打印箱唛失败'
    if (e?.response?.data instanceof Blob) {
      try {
        const text = await e.response.data.text()
        const j = JSON.parse(text)
        msg = j.message || j.msg || '所选订单没有可打印的箱信息或请求失败'
      } catch {
        msg = '所选订单没有可打印的箱信息或请求失败'
      }
    }
    ElNotification({ title: '错误', message: msg, type: 'error' })
  } finally {
    printBoxLabelLoading.value = false
  }
}

function openExportWmsDialog() {
  if (selectedRows.value.length === 0) return
  exportWmsExpectedDate.value = ''
  showExportWmsDialog.value = true
}

async function confirmExportWms() {
  const date = exportWmsExpectedDate.value
  if (!date || !date.trim()) {
    ElNotification({ title: '提示', message: '请选择预计到仓日期', type: 'warning' })
    return
  }
  const rows = selectedRows.value
  const ids = rows.map((r) => r.id).filter((id) => id != null)
  if (!ids.length) {
    ElNotification({ title: '提示', message: '所选订单无有效ID', type: 'warning' })
    return
  }
  exportWmsLoading.value = true
  try {
    const blob = await exportWmsInbound(ids, date)
    const url = URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'WMS入库单.xlsx'
    a.click()
    URL.revokeObjectURL(url)
    showExportWmsDialog.value = false
    ElNotification({ title: '成功', message: '导出成功', type: 'success' })
  } catch (e) {
    let msg = e?.message || '导出失败'
    if (e?.response?.data instanceof Blob) {
      try {
        const text = await e.response.data.text()
        const j = JSON.parse(text)
        msg = j.message || j.msg || '导出WMS入库单失败'
      } catch {
        msg = '导出WMS入库单失败'
      }
    }
    ElNotification({ title: '错误', message: msg, type: 'error' })
  } finally {
    exportWmsLoading.value = false
  }
}

function doSearch() {
  currentPage.value = 1
  fetchList()
}

watch(activeStatus, () => {
  currentPage.value = 1
  fetchList()
})

function resetSearch() {
  searchKeyword.value = ''
  filters.logisticsProductId = ''
  filters.cargoType = ''
  filters.createTimeStart = ''
  filters.createTimeEnd = ''
  filters.creator = ''
  activeStatus.value = 'all'
  currentPage.value = 1
  fetchList()
}

onMounted(() => {
  listLogisticsProducts().then((r) => {
    logisticsProducts.value = Array.isArray(r) ? r : []
  })
  fetchList()
})
</script>

<style scoped>
.line-order-status-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}
.line-order-status-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
/* 只保留 Tab 按钮，隐藏底部内容区，避免出现“两排”效果 */
.line-order-status-tabs :deep(.el-tabs__content) {
  display: none;
}
.line-order-date-start,
.line-order-date-end {
  width: 100px !important;
}
.line-order-date-start :deep(.el-input__wrapper),
.line-order-date-end :deep(.el-input__wrapper) {
  padding-left: 8px;
  padding-right: 8px;
}

</style>
