<template>
  <div v-if="order" class="max-w-full">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <router-link to="/line-orders" class="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
        <span>←</span> 返回
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-gray-800">订单详情</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ order.orderNo }}</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="mb-6">
      <el-tab-pane label="基本信息" name="basic" />
      <el-tab-pane label="订单费用" name="fee" />
      <el-tab-pane label="物流轨迹" name="track" />
    </el-tabs>

    <!-- 基本信息 -->
    <div v-show="activeTab === 'basic'" class="space-y-6">
      <!-- 订单信息 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-800">订单信息</h2>
          <div class="flex gap-2">
            <span v-for="tag in order.statusTags" :key="tag" class="px-2 py-0.5 rounded text-sm bg-gray-100 text-gray-700">{{ tag }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p><span class="text-gray-500">订单号:</span> {{ order.orderInfo.orderNo }}</p>
          <p><span class="text-gray-500">物流产品:</span> {{ order.orderInfo.logisticsProduct }}</p>
          <p class="col-span-2"><span class="text-gray-500">收件信息:</span> {{ order.orderInfo.recipient }}</p>
          <p><span class="text-gray-500">货物属性:</span> {{ order.orderInfo.cargoType }}</p>
          <p><span class="text-gray-500">总重量(KG):</span> {{ order.orderInfo.totalWeight }}</p>
          <p><span class="text-gray-500">计费体积(CBM):</span> {{ order.orderInfo.billingVolume }}</p>
          <p><span class="text-gray-500">计费重(KG):</span> {{ order.orderInfo.billingWeight }}</p>
          <p><span class="text-gray-500">总体积(CBM):</span> {{ order.orderInfo.totalVolume }}</p>
          <p><span class="text-gray-500">参考号:</span> {{ order.orderInfo.referenceNo }}</p>
          <p><span class="text-gray-500">订单备注:</span> {{ order.orderInfo.orderRemark }}</p>
        </div>
      </section>

      <!-- 箱 + 箱内商品 -->
      <section v-for="box in order.boxes" :key="box.id" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-800">箱 #{{ box.boxNo }}</h2>
          <el-button size="small">编辑计费</el-button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-4">
          <p><span class="text-gray-500">箱类型:</span> {{ box.boxType }}</p>
          <p><span class="text-gray-500">重量(KG):</span> {{ box.weight }}</p>
          <p><span class="text-gray-500">长(CM):</span> {{ box.length }}</p>
          <p><span class="text-gray-500">宽(CM):</span> {{ box.width }}</p>
          <p><span class="text-gray-500">高(CM):</span> {{ box.height }}</p>
          <p><span class="text-gray-500">计费重(KG):</span> {{ box.billingWeight }}</p>
          <p><span class="text-gray-500">体积(CBM):</span> {{ box.volume }}</p>
          <p><span class="text-gray-500">计费体积(CBM):</span> {{ box.billingVolume }}</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[800px]">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">商品图片</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">商品名称</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">英文名称</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">商品编码</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">品牌</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">材质</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">规格</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">用途</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">数量</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">申报价</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">单品重量(KG)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, i) in box.items" :key="i">
                <td class="px-4 py-2 w-12"><div class="w-10 h-10 bg-gray-100 rounded" /></td>
                <td class="px-4 py-2">{{ item.productName }}</td>
                <td class="px-4 py-2">{{ item.englishName }}</td>
                <td class="px-4 py-2">{{ item.productCode }}</td>
                <td class="px-4 py-2">{{ item.brand }}</td>
                <td class="px-4 py-2">{{ item.material }}</td>
                <td class="px-4 py-2">{{ item.specification }}</td>
                <td class="px-4 py-2">{{ item.purpose }}</td>
                <td class="px-4 py-2">{{ item.quantity }}</td>
                <td class="px-4 py-2">{{ item.declaredPrice }}</td>
                <td class="px-4 py-2">{{ item.singleWeight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- 订单费用 -->
    <div v-show="activeTab === 'fee'" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-800">订单费用</h2>
        <div class="flex gap-2">
          <el-button type="primary" size="small">+ 添加费用</el-button>
          <el-button type="primary" size="small" plain>费用确认</el-button>
        </div>
      </div>
      <el-table :data="order.fees" border class="mb-4">
        <el-table-column prop="feeItem" label="费用项" />
        <el-table-column prop="calcMethod" label="计算方式" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="currency" label="币种" />
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="primary" link size="small">编辑</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-sm text-gray-600">
        <p v-for="(val, key) in order.feeSummary" :key="key">{{ key }}: {{ val }}</p>
      </div>
    </div>

    <!-- 物流轨迹 -->
    <div v-show="activeTab === 'track'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
      暂无物流轨迹
    </div>
  </div>
  <div v-else class="py-12 text-center text-gray-500">
    订单不存在
    <router-link to="/line-orders" class="text-primary ml-2">返回列表</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getLineOrderDetail } from '@/mock/lineOrders'

const route = useRoute()
const order = ref(null)
const activeTab = ref('basic')

onMounted(() => {
  order.value = getLineOrderDetail(route.params.id)
})
</script>
