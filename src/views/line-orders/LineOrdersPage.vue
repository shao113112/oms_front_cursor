<template>
  <div class="w-full min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-slate-800 tracking-tight">专线订单管理</h1>
      <router-link
        to="/line-orders/create"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shrink-0"
      >
        <span class="text-lg">+</span> 新建订单
      </router-link>
    </div>

    <!-- 搜索与筛选 -->
    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-4 mb-6">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索订单号..."
        class="mb-4 max-w-md"
        clearable
      />
      <div class="flex flex-wrap gap-3 mb-4">
        <el-select v-model="filters.logisticsProductId" placeholder="物流产品" clearable filterable style="width: 180px">
          <el-option label="全部" value="" />
          <el-option v-for="p in logisticsProducts" :key="p.id" :label="p.name || p.productName" :value="p.id" />
        </el-select>
        <el-select v-model="filters.cargoType" placeholder="货物属性" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="普货" value="普货" />
        </el-select>
        <el-date-picker v-model="filters.createTime" type="daterange" range-separator="至" start-placeholder="创建时间" end-placeholder="结束" value-format="YYYY-MM-DD" style="width: 240px" />
        <el-input v-model="filters.creator" placeholder="创建人" clearable style="width: 120px" />
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <!-- 状态 Tab -->
      <el-tabs v-model="activeStatus" class="mb-4">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待处理" name="PENDING" />
        <el-tab-pane label="运输中" name="TRANSPORTING" />
        <el-tab-pane label="已送达" name="DELIVERED" />
        <el-tab-pane label="草稿" name="DRAFT" />
      </el-tabs>
      <!-- 批量操作 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <el-button size="small">复制</el-button>
        <el-button size="small">重新计费</el-button>
        <el-button size="small">打印箱唛</el-button>
        <el-button size="small">统计装柜</el-button>
        <el-dropdown>
          <el-button size="small">导出 <span class="ml-1">▼</span></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>导出Excel</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button size="small">列设置</el-button>
      </div>
    </div>

    <!-- 表格：横向可滚动，占满宽度 -->
    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden w-full">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%; min-width: 1200px" max-height="500" class="mobile-table-dense mobile-action-buttons">
          <el-table-column type="selection" width="40" />
          <el-table-column prop="orderNo" label="订单号" min-width="100" />
          <el-table-column prop="referenceNo" label="参考号" min-width="80">
            <template #default="{ row }">{{ row.referenceNo || '-' }}</template>
          </el-table-column>
          <el-table-column label="集货仓" min-width="90">
            <template #default="{ row }">{{ row.warehouseId ?? '-' }}</template>
          </el-table-column>
          <el-table-column prop="cargoType" label="货物属性" min-width="80">
            <template #default="{ row }">{{ row.cargoType || '-' }}</template>
          </el-table-column>
          <el-table-column label="收件信息" min-width="100">
            <template #default="{ row }">{{ row.receiveAddressId ?? '-' }}</template>
          </el-table-column>
          <el-table-column prop="boxQty" label="箱数" width="70">
            <template #default="{ row }">{{ row.boxQty ?? 0 }}</template>
          </el-table-column>
          <el-table-column label="总重量(KG)" width="100">
            <template #default="{ row }">{{ formatNum(row.totalWeight) }}</template>
          </el-table-column>
          <el-table-column label="总体积(CBM)" width="110">
            <template #default="{ row }">{{ formatNum(row.totalVolume) }}</template>
          </el-table-column>
          <el-table-column label="物流产品" min-width="100">
            <template #default="{ row }">{{ getProductName(row.logisticsProductId) || '-' }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small" type="info">{{ orderStatusText(row.orderStatus) || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="费用" min-width="160">
            <template #default="{ row }">
              <span v-if="row.totalFee != null && row.totalFee !== ''">{{ formatFee(row) }}</span>
              <span v-else class="text-gray-400">-</span>
              <template v-if="row.totalFee != null && row.totalFee !== ''">
                <el-tag v-if="row.feeConfirmed" size="small" type="success" class="ml-1.5">已确认</el-tag>
                <el-tag v-else size="small" type="warning" class="ml-1.5">未确认</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="90">
            <template #default="{ row }">{{ row.creator || '-' }}</template>
          </el-table-column>
          <el-table-column label="创建时间" width="140">
            <template #default="{ row }">{{ formatDate(row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <router-link :to="`/line-orders/${row.id}`" class="text-primary">查看</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页栏 -->
      <div class="w-full px-4 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">每页显示</span>
          <el-select v-model="pageSize" style="width: 100px" @change="currentPage = 1; fetchList()">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { searchLineOrders } from '@/api/lineOrders'
import { searchLogisticsProducts } from '@/api/logisticsProducts'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const searchKeyword = ref('')
const activeStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)
const logisticsProducts = ref([])
const filters = reactive({
  logisticsProductId: '',
  cargoType: '',
  createTime: null,
  creator: '',
})

const orderStatusMap = { DRAFT: '草稿', PENDING: '待处理', TRANSPORTING: '运输中', DELIVERED: '已送达', CANCELLED: '已取消' }
function orderStatusText(v) {
  if (v == null || v === '') return ''
  return orderStatusMap[v] || (typeof v === 'string' ? v : '')
}

function formatNum(v) {
  if (v == null || v === '') return '-'
  const n = Number(v)
  return isNaN(n) ? String(v) : n
}

function formatFee(row) {
  const fee = row.totalFee != null ? Number(row.totalFee) : null
  const cur = row.feeCurrency || 'USD'
  if (fee == null || isNaN(fee)) return '-'
  return (cur === 'USD' ? '$' : '') + fee.toFixed(2)
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
      createTime: filters.createTime,
      creator: filters.creator || undefined,
      logisticsProductId: filters.logisticsProductId || undefined,
      cargoType: filters.cargoType || undefined,
    })
    list.value = res.items ?? []
    total.value = res.total ?? 0
  } catch (e) {
    ElMessage.error(e?.message || '加载失败')
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
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
  filters.createTime = null
  filters.creator = ''
  activeStatus.value = 'all'
  currentPage.value = 1
  fetchList()
}

onMounted(() => {
  searchLogisticsProducts({ size: 500 }).then((r) => {
    logisticsProducts.value = r.items || []
  })
  fetchList()
})
</script>
