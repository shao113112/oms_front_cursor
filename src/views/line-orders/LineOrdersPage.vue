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
        placeholder="搜索订单号或客户名称..."
        class="mb-4"
        clearable
      />
      <p class="text-xs text-gray-400 mb-4">支持多条记录搜索,每行一个关键词</p>
      <div class="flex flex-wrap gap-3 mb-4">
        <el-select v-model="filters.logisticsProduct" placeholder="物流产品" clearable style="width: 140px">
          <el-option label="全部" value="" />
          <el-option label="巴西海运散装普货" value="巴西海运散装普货" />
          <el-option label="巴西空运散装普货" value="巴西空运散装普货" />
        </el-select>
        <el-select v-model="filters.cargoType" placeholder="货物属性" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="普货" value="普货" />
        </el-select>
        <el-date-picker v-model="filters.createTime" type="daterange" range-separator="至" start-placeholder="创建时间" end-placeholder="结束" value-format="YYYY-MM-DD" style="width: 240px" />
        <el-select v-model="filters.creator" placeholder="创建人" clearable style="width: 120px">
          <el-option label="全部" value="" />
        </el-select>
        <el-button type="primary" @click="doSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <!-- 状态 Tab -->
      <el-tabs v-model="activeStatus" class="mb-4">
        <el-tab-pane label="全部 (22)" name="all" />
        <el-tab-pane label="待处理 (21)" name="待处理" />
        <el-tab-pane label="运输中 (0)" name="运输中" />
        <el-tab-pane label="送达 (0)" name="送达" />
        <el-tab-pane label="草稿 (1)" name="草稿" />
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
        <el-table :data="paginatedList" stripe style="width: 100%; min-width: 1400px" max-height="500" class="mobile-table-dense mobile-action-buttons">
          <el-table-column type="selection" width="40" />
          <el-table-column prop="orderNo" label="订单号" min-width="100" />
          <el-table-column prop="referenceNo" label="参考号" min-width="80" />
          <el-table-column prop="warehouse" label="集货仓" min-width="100" />
          <el-table-column prop="cargoType" label="货物属性" min-width="80" />
          <el-table-column prop="recipient" label="收件信息" min-width="160" show-overflow-tooltip />
          <el-table-column prop="transportMethod" label="运输方式" width="80" />
          <el-table-column prop="boxCount" label="箱数" width="70" />
          <el-table-column prop="totalWeight" label="总重量(KG)" width="110" />
          <el-table-column prop="totalVolume" label="总体积(CBM)" width="120" />
          <el-table-column prop="logisticsProduct" label="物流产品" min-width="140" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small" type="info">{{ row.status || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="费用" min-width="160">
            <template #default="{ row }">
              <span v-if="row.fee">{{ row.fee }}</span>
              <el-tag v-if="row.fee && !row.feeConfirmed" size="small" type="primary" class="ml-1">费用未确认</el-tag>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="latestTrack" label="最新轨迹" min-width="100">
            <template #default="{ row }">
              {{ row.latestTrack || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="90" />
          <el-table-column prop="createTime" label="创建时间" width="140" />
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <router-link :to="`/line-orders/${row.id}`" class="text-primary">查看</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页栏：横向宽屏整行 -->
      <div class="w-full px-4 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">每页显示</span>
          <el-select v-model="pageSize" style="width: 100px" @change="currentPage = 1">
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
            <el-option label="100条" :value="100" />
          </el-select>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          layout="prev, pager, next"
          :total="filteredList.length"
          :page-size="pageSize"
          :small="true"
          class="[&_.el-pagination__editor]:hidden"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { lineOrdersList } from '@/mock/lineOrders'

const searchKeyword = ref('')
const activeStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)
const filters = reactive({
  logisticsProduct: '',
  cargoType: '',
  createTime: null,
  creator: '',
})

const filteredList = computed(() => {
  let list = lineOrdersList
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter((o) => o.orderNo?.toLowerCase().includes(kw) || o.recipient?.toLowerCase().includes(kw))
  }
  if (activeStatus.value && activeStatus.value !== 'all') {
    list = list.filter((o) => o.status === activeStatus.value)
  }
  return list
})

const paginatedList = computed(() => {
  const list = filteredList.value
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

function doSearch() {}
function resetSearch() {
  searchKeyword.value = ''
  filters.logisticsProduct = ''
  filters.cargoType = ''
  filters.createTime = null
  filters.creator = ''
  activeStatus.value = 'all'
}
</script>
