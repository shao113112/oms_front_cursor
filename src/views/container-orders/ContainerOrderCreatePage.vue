<template>
  <div class="w-full min-w-0">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <router-link to="/container-orders" class="text-gray-600 hover:text-gray-900 flex items-center gap-1">
        <span>←</span> 返回
      </router-link>
      <div>
        <h1 class="text-xl font-bold text-gray-800">整柜预约</h1>
        <p class="text-sm text-gray-500 mt-0.5">提交后系统自动生成整柜单号</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 提货地址 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">提货地址</h2>
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">提货方式</label>
            <div class="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">上门提货</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">提货地址 <span class="text-red-500">*</span></label>
            <el-select v-model="form.pickupAddressId" placeholder="请选择提货地址" class="w-full" filterable clearable>
              <el-option v-for="a in pickupAddresses" :key="a.id" :label="pickupLabel(a)" :value="a.id" />
            </el-select>
            <template v-if="selectedPickup">
              <p class="text-xs text-gray-500 mt-1.5">联系人: {{ selectedPickup.name }}</p>
              <p class="text-xs text-gray-500">电话: {{ selectedPickup.phone }}</p>
              <p class="text-xs text-gray-500">地址: {{ selectedPickup.address }}</p>
            </template>
          </div>
        </div>
      </section>

      <!-- 收件地址 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">收件地址</h2>
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">收件地址 <span class="text-red-500">*</span></label>
            <el-select v-model="form.shippingAddressId" placeholder="请选择收件地址" class="w-full" filterable clearable>
              <el-option v-for="a in receiveAddresses" :key="a.id" :label="receiveLabel(a)" :value="a.id" />
            </el-select>
            <template v-if="selectedShipping">
              <p class="text-xs text-gray-500 mt-1.5">联系人: {{ selectedShipping.name || selectedShipping.recipient }}</p>
              <p class="text-xs text-gray-500">电话: {{ selectedShipping.phone || selectedShipping.contact }}</p>
              <p class="text-xs text-gray-500">地址: {{ selectedShipping.address }}</p>
            </template>
          </div>
          
        </div>
      </section>

      <!-- 基本信息 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">基本信息</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">运输方式</label>
            <div class="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">海运</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">箱数 <span class="text-red-500">*</span></label>
            <el-input-number v-model="form.boxCount" :min="1" class="w-full" />
          </div>
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">发货备注</label>
            <el-input v-model="form.shippingNote" type="textarea" placeholder="请输入发货备注" :rows="3" />
          </div>
        </div>
      </section>

      <!-- 申报信息 -->
      <section class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-800">申报信息</h2>
          <el-button type="primary" @click="addDeclaration">+ 新增</el-button>
        </div>
        <div v-if="form.declarationItems.length === 0" class="py-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
          暂无数据，请至少添加一条申报商品
        </div>
        <div v-else class="border border-gray-200 rounded-lg overflow-x-auto">
          <table class="w-full text-sm min-w-[900px]">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-700">商品名称</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">英文名称</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">品牌</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">申报价格</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">数量</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">箱数</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">材质</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">规格</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700">主要用途</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700 w-20">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, idx) in form.declarationItems" :key="idx">
                <td class="px-3 py-2"><el-input v-model="item.productName" size="small" placeholder="商品名称" /></td>
                <td class="px-3 py-2"><el-input v-model="item.englishName" size="small" placeholder="英文名称" /></td>
                <td class="px-3 py-2"><el-input v-model="item.brand" size="small" placeholder="品牌" /></td>
                <td class="px-3 py-2"><el-input v-model="item.declaredPrice" size="small" placeholder="申报价格" /></td>
                <td class="px-3 py-2"><el-input-number v-model="item.quantity" :min="0" size="small" class="w-full" /></td>
                <td class="px-3 py-2"><el-input-number v-model="item.boxCount" :min="0" size="small" class="w-full" /></td>
                <td class="px-3 py-2"><el-input v-model="item.material" size="small" placeholder="材质" /></td>
                <td class="px-3 py-2"><el-input v-model="item.spec" size="small" placeholder="规格" /></td>
                <td class="px-3 py-2"><el-input v-model="item.purpose" size="small" placeholder="主要用途" /></td>
                <td class="px-3 py-2"><el-button type="danger" link size="small" @click="form.declarationItems.splice(idx, 1)">删除</el-button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 flex flex-wrap gap-6 text-sm text-gray-600">
          <span>总件数: {{ totalPieces }}</span>
          <span>总箱数: {{ form.boxCount || 0 }}</span>
          <span>申报总货值(CNY): {{ totalDeclaredValue }}</span>
        </div>
      </section>

      <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <el-checkbox v-model="form.agreed">阅读并同意《服务协议》</el-checkbox>
        <el-button type="primary" :disabled="!form.agreed || submitLoading" :loading="submitLoading" @click="submit">确认提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createContainerOrder } from '@/api/containerOrders'
import { searchPickupAddresses } from '@/api/pickupAddresses'
import { searchReceiveAddresses } from '@/api/receiveAddresses'

const router = useRouter()
const submitLoading = ref(false)
const pickupAddresses = ref([])
const receiveAddresses = ref([])

function pickupLabel(a) {
  const name = a.name || a.addressName || ''
  const addr = a.address || ''
  return name && addr ? `${name}-${addr}` : (name || addr || String(a.id))
}

function receiveLabel(a) {
  const name = a.name || a.recipient || ''
  const addr = a.address || ''
  return name && addr ? `${name}-${addr}` : (name || addr || String(a.id))
}

const form = reactive({
  pickupAddressId: undefined,
  shippingAddressId: undefined,
  boxCount: 1,
  shippingNote: '',
  agreed: false,
  declarationItems: [],
})

const selectedPickup = computed(() => {
  if (!form.pickupAddressId) return null
  return pickupAddresses.value.find((a) => a.id === form.pickupAddressId || String(a.id) === String(form.pickupAddressId))
})

const selectedShipping = computed(() => {
  if (!form.shippingAddressId) return null
  return receiveAddresses.value.find((a) => a.id === form.shippingAddressId || String(a.id) === String(form.shippingAddressId))
})

const totalPieces = computed(() => form.declarationItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0))
const totalDeclaredValue = computed(() =>
  form.declarationItems.reduce((s, i) => s + (Number(i.declaredPrice) || 0) * (Number(i.quantity) || 0), 0).toFixed(2)
)

function addDeclaration() {
  form.declarationItems.push({
    productName: '',
    englishName: '',
    brand: '',
    declaredPrice: '',
    quantity: 0,
    boxCount: 0,
    material: '',
    spec: '',
    purpose: '',
  })
}

async function loadAddresses() {
  try {
    const [pickupRes, receiveRes] = await Promise.all([
      searchPickupAddresses({ page: 1, size: 200 }),
      searchReceiveAddresses({ page: 1, size: 200 }),
    ])
    pickupAddresses.value = pickupRes?.items ?? pickupRes?.list ?? []
    receiveAddresses.value = receiveRes?.items ?? receiveRes?.list ?? []
  } catch {
    pickupAddresses.value = []
    receiveAddresses.value = []
  }
}

async function submit() {
  if (!form.agreed) return
  const boxQty = Number(form.boxCount) || 1
  const goods = form.declarationItems
    .filter((i) => i.productName != null && String(i.productName).trim() !== '')
    .map((i) => ({
      goodsName: String(i.productName).trim(),
      goodsEnglishName: i.englishName?.trim(),
      brand: i.brand?.trim(),
      declaredPrice: Number(i.declaredPrice) || 0,
      quantity: Number(i.quantity) || 0,
      boxCount: Number(i.boxCount) || 0,
      material: i.material?.trim(),
      spec: i.spec?.trim(),
      purpose: i.purpose?.trim(),
    }))
  if (goods.length === 0) {
    ElMessage.warning('请至少添加一条申报商品')
    return
  }
  submitLoading.value = true
  try {
    const id = await createContainerOrder({
      order: {
        pickupAddressId: form.pickupAddressId ? Number(form.pickupAddressId) : undefined,
        receiveAddressId: form.shippingAddressId ? Number(form.shippingAddressId) : undefined,
        boxQty,
        memo: form.shippingNote?.trim() || undefined,
      },
      goods,
    })
    ElMessage.success('创建成功')
    router.push(`/container-orders/${id}`)
  } catch (e) {
    ElMessage.error(e?.message || '创建失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => loadAddresses())
</script>
