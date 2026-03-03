<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <h1 class="page-title">整柜订单</h1>
      <router-link
        to="/container-orders/create"
        class="btn-primary-main"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
        整柜预约
      </router-link>
    </div>
    <div class="page-card page-card-padding-tight mb-6">
      <div class="flex flex-wrap items-end gap-3">
        <div class="filter-field">
          <span class="filter-field__label">订单号</span>
          <el-input
            v-model="searchKeyword"
            placeholder="请输入订单号搜索"
            clearable
            style="width: 220px"
            @keyup.enter="search"
          />
        </div>
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="searchKeyword = ''; currentPage = 1; fetchList()">重置</el-button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%; min-width: 800px" class="mobile-table-dense mobile-action-buttons">
          <el-table-column prop="orderNo" label="订单号" min-width="120">
            <template #default="{ row }">{{ row.orderNo || '-' }}</template>
          </el-table-column>
          <el-table-column label="提货地址" min-width="140">
            <template #default="{ row }">{{ row.pickupAddress || '-' }}</template>
          </el-table-column>
          <el-table-column label="收货地址" min-width="140">
            <template #default="{ row }">{{ row.receiveAddress || '-' }}</template>
          </el-table-column>
          <el-table-column prop="transportMethod" label="运输方式" width="100">
            <template #default="{ row }">{{ row.transportMethod || '-' }}</template>
          </el-table-column>
          <el-table-column label="箱数" width="80" align="center">
            <template #default="{ row }">{{ row.boxQty ?? '-' }}</template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <span class="text-primary font-medium">{{ orderStatusText[row.orderStatus] || row.orderStatus || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">{{ row.memo || '-' }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160">
            <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-1">
                <router-link :to="`/container-orders/${row.id}`" class="inline-flex items-center justify-center text-slate-500 hover:text-primary p-0.5" title="查看">
                  <el-icon :size="18"><View /></el-icon>
                </router-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { searchContainerOrders } from '@/api/containerOrders'

const orderStatusText = { DRAFT: '草稿', PENDING: '待处理', TRANSPORTING: '运输中', DELIVERED: '已送达', CANCELLED: '已取消' }

const loading = ref(false)
const searchKeyword = ref('')
const list = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

function formatTime(v) {
  if (!v) return '-'
  if (typeof v === 'string') return v
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

async function fetchList() {
  loading.value = true
  try {
    const data = await searchContainerOrders({
      page: currentPage.value,
      size: pageSize.value,
      orderNo: searchKeyword.value?.trim() || undefined,
    })
    list.value = data?.items ?? data?.list ?? []
    total.value = data?.total ?? 0
  } catch (e) {
    ElMessage.error(e?.message || '查询失败')
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function search() {
  currentPage.value = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>
