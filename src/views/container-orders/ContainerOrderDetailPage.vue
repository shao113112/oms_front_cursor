<template>
  <div v-loading="loading" class="page-wrap">
    <div v-if="detail" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <router-link to="/container-orders" class="link-back">
          <span aria-hidden="true">←</span> 返回
        </router-link>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-800">整柜订单详情</h1>
          <el-tag size="small" :type="getOrderStatusTagType(detail.order?.orderStatus)">{{ orderStatusText[detail.order?.orderStatus] || detail.order?.orderStatus || '-' }}</el-tag>
        </div>
      </div>

      <!-- 订单信息 -->
      <section class="page-card page-card-padding">
        <h2 class="section-title">订单信息</h2>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div><span class="text-slate-500 block mb-0.5">订单号</span><div class="text-slate-800">{{ detail.order?.orderNo || '-' }}</div></div>
          <div><span class="text-slate-500 block mb-0.5">运输方式</span><div class="text-slate-800">{{ detail.order?.transportMethod || '-' }}</div></div>
          <div><span class="text-slate-500 block mb-0.5">箱数</span><div class="text-slate-800">{{ detail.order?.boxQty ?? '-' }} 箱</div></div>
          <div><span class="text-slate-500 block mb-0.5">创建时间</span><div class="text-slate-800">{{ formatTime(detail.order?.createTime) }}</div></div>
          <div class="col-span-2"><span class="text-slate-500 block mb-0.5">备注</span><div class="text-slate-800">{{ detail.order?.memo || '-' }}</div></div>
        </div>
      </section>

      <!-- 提货地址 -->
      <section class="address-block page-card page-card-padding">
        <h2 class="section-title">提货地址</h2>
        <div class="flex flex-col gap-2 text-sm">
          <p><span class="text-slate-500">联系人:</span> {{ detail.order?.pickupContactName ?? '-' }}</p>
          <p><span class="text-slate-500">联系电话:</span> {{ detail.order?.pickupPhone ?? '-' }}</p>
          <p><span class="text-slate-500">详细地址:</span> {{ detail.order?.pickupAddress ?? '-' }}</p>
        </div>
      </section>

      <!-- 收件地址 -->
      <section class="address-block page-card page-card-padding">
        <h2 class="section-title">收件地址</h2>
        <div class="flex flex-col gap-2 text-sm">
          <p><span class="text-slate-500">联系人:</span> {{ detail.order?.receiveContactName ?? '-' }}</p>
          <p><span class="text-slate-500">联系电话:</span> {{ detail.order?.receivePhone ?? '-' }}</p>
          <p><span class="text-slate-500">详细地址:</span> {{ detail.order?.receiveAddress ?? detail.order?.shippingAddress ?? '-' }}</p>
        </div>
      </section>

      <!-- 申报信息 -->
      <section class="page-card page-card-padding">
        <h2 class="section-title">申报信息</h2>
        <div v-if="!detail.goods || detail.goods.length === 0" class="py-8 text-center text-slate-400">
          暂无申报商品
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm min-w-[900px]">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-slate-700">商品名称</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">英文名称</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">品牌</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">申报价格</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">数量</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">箱数</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">总价</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">材质</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">规格</th>
                <th class="px-4 py-2 text-left font-medium text-slate-700">用途</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(item, i) in detail.goods" :key="item.id || i">
                <td class="px-4 py-2">{{ item.goodsName || '-' }}</td>
                <td class="px-4 py-2">{{ item.goodsEnglishName || '-' }}</td>
                <td class="px-4 py-2">{{ item.brand || '-' }}</td>
                <td class="px-4 py-2">{{ item.declaredPrice != null ? item.declaredPrice : '-' }}</td>
                <td class="px-4 py-2">{{ item.quantity ?? '-' }}</td>
                <td class="px-4 py-2">{{ item.boxCount ?? '-' }}</td>
                <td class="px-4 py-2">{{ rowTotal(item) }}</td>
                <td class="px-4 py-2">{{ item.material || '-' }}</td>
                <td class="px-4 py-2">{{ item.spec || '-' }}</td>
                <td class="px-4 py-2">{{ item.purpose || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex gap-6 text-sm text-slate-600">
          <span>总件数: {{ totalPieces }}</span>
          <span>总箱数: {{ detail.order?.boxQty ?? 0 }}</span>
          <span>申报总货值: {{ totalDeclaredValue }}</span>
        </div>
      </section>
    </div>
    <div v-else-if="!loading" class="py-12 text-center text-slate-500">
      订单不存在
      <router-link to="/container-orders" class="text-primary ml-2">返回列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getContainerOrderDetail } from '@/api/containerOrders'

const orderStatusText = { DRAFT: '草稿', PENDING: '待处理', TRANSPORTING: '运输中', DELIVERED: '已送达', CANCELLED: '已取消' }
const orderStatusTagType = { DRAFT: 'info', PENDING: 'warning', TRANSPORTING: 'primary', DELIVERED: 'success', CANCELLED: 'danger' }
function getOrderStatusTagType(v) { return orderStatusTagType[v] || 'info' }

const route = useRoute()
const loading = ref(true)
const detail = ref(null)

const totalPieces = computed(() => {
  const goods = detail.value?.goods
  if (!goods?.length) return 0
  return goods.reduce((s, g) => s + (Number(g.quantity) || 0), 0)
})

const totalDeclaredValue = computed(() => {
  const goods = detail.value?.goods
  if (!goods?.length) return '0.00'
  const sum = goods.reduce((s, g) => s + (Number(g.quantity) || 0) * (Number(g.declaredPrice) || 0), 0)
  return sum.toFixed(2)
})

function formatTime(v) {
  if (!v) return '-'
  if (typeof v === 'string') return v
  try {
    return new Date(v).toLocaleString('zh-CN')
  } catch {
    return String(v)
  }
}

function rowTotal(item) {
  const q = Number(item?.quantity) || 0
  const p = Number(item?.declaredPrice) || 0
  if (!q && !p) return '-'
  return (q * p).toFixed(2)
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    loading.value = false
    return
  }
  try {
    const data = await getContainerOrderDetail(id)
    // 接口已做归一化，保证 { order, goods } 结构
    detail.value = data && (data.order != null || (data.goods && data.goods.length > 0))
      ? data
      : null
  } catch (e) {
    ElNotification({ title: '错误', message: e?.message || '加载失败', type: 'error' })
    detail.value = null
  } finally {
    loading.value = false
  }
})
</script>
