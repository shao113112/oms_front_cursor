<template>
  <div v-if="order" class="w-full min-w-0">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <router-link to="/container-orders" class="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
        <span>←</span> 返回
      </router-link>
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-800">订单详情</h1>
        <span class="px-2 py-0.5 rounded text-sm bg-gray-100 text-gray-700">{{ order.status }}</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 订单信息 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">订单信息</h2>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p><span class="text-gray-500">订单号:</span> {{ order.orderNo }}</p>
          <p><span class="text-gray-500">箱数:</span> {{ order.boxCount }}箱</p>
          <p><span class="text-gray-500">运输方式:</span> {{ order.transportMethod }}</p>
          <p><span class="text-gray-500">创建时间:</span> {{ order.createTime }}</p>
        </div>
      </section>

      <!-- 提货地址 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">提货地址</h2>
        <div class="text-sm text-gray-600 space-y-1">
          <p>联系人: {{ order.pickupContact || '-' }}</p>
          <p>联系电话: {{ order.pickupPhone || '-' }}</p>
          <p>详细地址: {{ order.pickupAddressDetail || '-' }}</p>
        </div>
      </section>

      <!-- 收件地址 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">收件地址</h2>
        <div class="text-sm text-gray-600 space-y-1">
          <p>收件人: {{ order.recipientName || '-' }}</p>
          <p>联系电话: {{ order.recipientPhone || '-' }}</p>
          <p>详细地址: {{ order.recipientAddressDetail || '-' }}</p>
        </div>
      </section>

      <!-- 申报信息 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">申报信息</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[700px]">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">商品名称</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">英文名称</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">品牌</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">申报价格</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">数量</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">箱数</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">总价</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">材质</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">规格</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">用途</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, i) in order.declarationItems" :key="i">
                <td class="px-4 py-2">{{ item.productName }}</td>
                <td class="px-4 py-2">{{ item.englishName || '-' }}</td>
                <td class="px-4 py-2">{{ item.brand || '-' }}</td>
                <td class="px-4 py-2">CNY {{ item.declaredPrice }}</td>
                <td class="px-4 py-2">{{ item.quantity }}{{ item.unit || '件' }}</td>
                <td class="px-4 py-2">{{ item.boxCount }}</td>
                <td class="px-4 py-2">CNY {{ item.totalPrice }}</td>
                <td class="px-4 py-2">{{ item.material || '-' }}</td>
                <td class="px-4 py-2">{{ item.specification || '-' }}</td>
                <td class="px-4 py-2">{{ item.purpose || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex gap-6 text-sm text-gray-600">
          <span>总件数: {{ order.totalPieces }}</span>
          <span>总箱数: {{ order.totalBoxes }}</span>
          <span>申报总货值(CNY): {{ order.totalDeclaredValue }}</span>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="py-12 text-center text-gray-500">
    订单不存在
    <router-link to="/container-orders" class="text-primary ml-2">返回列表</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getContainerOrderDetail } from '@/mock/containerOrders'

const route = useRoute()
const order = ref(null)

onMounted(() => {
  order.value = getContainerOrderDetail(route.params.id)
})
</script>
