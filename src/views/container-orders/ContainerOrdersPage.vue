<template>
  <div class="w-full min-w-0">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">整柜订单</h1>
      <router-link
        to="/container-orders/create"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shrink-0"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
        整柜预约
      </router-link>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="请输入订单号搜索"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          @keyup.enter="search"
        />
      </div>
      <el-button type="primary" @click="search">查询</el-button>
    </div>

    <div v-loading="loading" class="overflow-x-auto bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden">
      <table class="w-full min-w-[800px] text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-700">订单号</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">提货地址</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">收货地址</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">运输方式</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">箱数</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">状态</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">备注</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
            <th class="px-4 py-3 text-left font-medium text-gray-700">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="row in list" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-800">{{ row.orderNo || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ row.pickupAddress || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ row.receiveAddress || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">transportMethod</td>
            <td class="px-4 py-3 text-gray-600">{{ row.boxQty ?? '-' }}</td>
            <td class="px-4 py-3">
              <span class="text-primary font-medium">{{ orderStatusText[row.orderStatus] || row.orderStatus || '-' }}</span>
            </td>
            <td class="px-4 py-3 text-gray-600 max-w-[200px] truncate" :title="row.memo">{{ row.memo || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatTime(row.createTime) }}</td>
            <td class="px-4 py-3">
              <router-link :to="`/container-orders/${row.id}`" class="text-gray-500 hover:text-primary inline-flex">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && list.length === 0" class="py-12 text-center text-gray-400">暂无数据</div>
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

function formatTime(v) {
  if (!v) return '-'
  if (typeof v === 'string') return v
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

async function search() {
  loading.value = true
  try {
    const data = await searchContainerOrders({
      page: 1,
      size: 100,
      orderNo: searchKeyword.value?.trim() || undefined,
    })
    list.value = data?.items ?? data?.list ?? []
  } catch (e) {
    ElMessage.error(e?.message || '查询失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  search()
})
</script>
