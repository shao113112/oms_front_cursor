<template>
  <div v-loading="loading" class="max-w-full min-h-[200px]">
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
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="tag in order.statusTags" :key="tag" class="px-2 py-0.5 rounded text-sm bg-gray-100 text-gray-700">{{ tag }}</span>
            <el-tag v-if="order.feeConfirmed" size="small" type="success">费用已确认</el-tag>
            <el-tag v-else size="small" type="warning">费用未确认</el-tag>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
          <div><span class="text-gray-500 block mb-0.5">订单号</span><div class="text-gray-800">{{ order.orderInfo?.orderNo ?? order.orderNo }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">物流产品</span><div class="text-gray-800">{{ order.orderInfo?.logisticsProduct ?? order.logisticsProductId ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">货物属性</span><div class="text-gray-800">{{ order.orderInfo?.cargoType ?? order.cargoType ?? '-' }}</div></div>
          <div class="col-span-3"><span class="text-gray-500 block mb-0.5">收件信息</span><div class="text-gray-800">{{ order.orderInfo?.recipient ?? order.receiveAddressId ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">总重量(KG)</span><div class="text-gray-800">{{ order.orderInfo?.totalWeight ?? order.totalWeight ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">总体积(CBM)</span><div class="text-gray-800">{{ order.orderInfo?.totalVolume ?? order.totalVolume ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">计费重(KG)</span><div class="text-gray-800">{{ order.orderInfo?.billingWeight ?? order.billingWeight ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">计费体积(CBM)</span><div class="text-gray-800">{{ order.orderInfo?.billingVolume ?? order.billingVolume ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">参考号</span><div class="text-gray-800">{{ order.orderInfo?.referenceNo ?? order.referenceNo ?? '-' }}</div></div>
          <div class="col-span-3"><span class="text-gray-500 block mb-0.5">订单备注</span><div class="text-gray-800">{{ order.orderInfo?.orderRemark ?? order.memo ?? '-' }}</div></div>
        </div>
      </section>

      <!-- 箱 + 箱内商品 -->
      <section v-for="box in order.boxes" :key="box.id" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-800">箱 #{{ box.boxNo }}</h2>
          <el-button size="small" @click="openBoxBilling(box)">编辑计费</el-button>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-4 gap-x-6 gap-y-4 text-sm mb-4">
          <div><span class="text-gray-500 block mb-0.5">箱类型</span><div class="text-gray-800">{{ box.boxType ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">长(CM)</span><div class="text-gray-800">{{ box.length ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">宽(CM)</span><div class="text-gray-800">{{ box.width ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">高(CM)</span><div class="text-gray-800">{{ box.height ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">重量(KG)</span><div class="text-gray-800">{{ box.weight ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">计费重(KG)</span><div class="text-gray-800">{{ box.billingWeight ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">体积(CBM)</span><div class="text-gray-800">{{ box.volume ?? '-' }}</div></div>
          <div><span class="text-gray-500 block mb-0.5">计费体积(CBM)</span><div class="text-gray-800">{{ box.billingVolume ?? '-' }}</div></div>
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
              <tr v-for="(item, i) in (box.items || box.goodsList || [])" :key="i">
                <td class="px-4 py-2 w-12"><div class="w-10 h-10 bg-gray-100 rounded" /></td>
                <td class="px-4 py-2">{{ item.productName ?? item.goodsName }}</td>
                <td class="px-4 py-2">{{ item.englishName ?? item.goodsEnglishName }}</td>
                <td class="px-4 py-2">{{ item.productCode ?? item.goodsCode }}</td>
                <td class="px-4 py-2">{{ item.brand }}</td>
                <td class="px-4 py-2">{{ item.material }}</td>
                <td class="px-4 py-2">{{ item.specification ?? item.spec }}</td>
                <td class="px-4 py-2">{{ item.purpose }}</td>
                <td class="px-4 py-2">{{ item.quantity }}{{ item.quantityUnit ? item.quantityUnit : '' }}</td>
                <td class="px-4 py-2">{{ item.declaredPrice }}</td>
                <td class="px-4 py-2">{{ item.singleWeight ?? item.unitWeight }}</td>
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
          <el-button type="primary" size="small" @click="showAddFeeDialog = true">+ 添加费用</el-button>
          <el-button type="primary" size="small" plain :disabled="order.feeConfirmed" :loading="confirmFeeLoading" @click="handleConfirmFee">费用确认</el-button>
        </div>
      </div>
      <el-table :data="order.fees" border class="mb-4">
        <el-table-column prop="feeName" label="费用项" />
        <el-table-column prop="calcMethod" label="计算方式" />
        <el-table-column label="单价">
          <template #default="{ row }">{{ row.unitPrice != null ? row.unitPrice : '-' }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" />
        <el-table-column label="金额">
          <template #default="{ row }">{{ row.amount != null ? row.amount : '-' }}</template>
        </el-table-column>
        <el-table-column prop="currency" label="币种" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :disabled="order.feeConfirmed" @click="openEditFee(row)">编辑</el-button>
            <el-button type="danger" link size="small" :disabled="order.feeConfirmed" @click="handleDeleteFee(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-sm text-gray-600">
        <p v-for="(val, key) in order.feeSummary" :key="key">{{ key }}: {{ val }}</p>
      </div>
    </div>

    <!-- 编辑箱计费弹窗 -->
    <el-dialog v-model="showBoxBillingDialog" title="编辑计费" width="360px" destroy-on-close>
      <el-form v-if="editingBox" :model="boxBillingForm" label-width="100px">
        <el-form-item label="箱号">
          <span>{{ editingBox.boxNo }}</span>
        </el-form-item>
        <el-form-item label="计费重量(KG)">
          <el-input-number v-model="boxBillingForm.billingWeight" :min="0" :precision="4" class="w-full" />
        </el-form-item>
        <el-form-item label="计费体积(CBM)">
          <el-input-number v-model="boxBillingForm.billingVolume" :min="0" :precision="6" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBoxBillingDialog = false">取消</el-button>
        <el-button type="primary" :loading="boxBillingLoading" @click="submitBoxBilling">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加费用弹窗 -->
    <el-dialog v-model="showAddFeeDialog" title="添加费用" width="440px" destroy-on-close @close="resetFeeForm">
      <el-form :model="feeForm" label-width="90px">
        <el-form-item label="费用项" required>
          <el-input v-model="feeForm.feeName" placeholder="如：空运公斤费" />
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="feeForm.calcMethod" placeholder="请选择" class="w-full">
            <el-option label="按重量" value="按重量" />
            <el-option label="按体积" value="按体积" />
            <el-option label="固定费用" value="固定费用" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="feeForm.currency" class="w-full">
            <el-option v-for="opt in currencyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="feeForm.unitPrice" :min="0" :precision="4" class="w-full" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="feeForm.quantity" :min="0" :precision="0" class="w-full" />
        </el-form-item>
        <el-form-item label="预计金额">
          <div class="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">{{ feeExpectedAmountText }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddFeeDialog = false">取消</el-button>
        <el-button type="primary" :loading="addFeeLoading" @click="submitAddFee">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改费用弹窗 -->
    <el-dialog v-model="showEditFeeDialog" title="修改费用" width="440px" destroy-on-close @close="editingFee = null">
      <el-form v-if="editingFee" :model="feeForm" label-width="90px">
        <el-form-item label="费用项" required>
          <el-input v-model="feeForm.feeName" placeholder="如：空运公斤费" />
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="feeForm.calcMethod" placeholder="请选择" class="w-full">
            <el-option label="按重量" value="按重量" />
            <el-option label="按体积" value="按体积" />
            <el-option label="固定费用" value="固定费用" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="feeForm.currency" class="w-full">
            <el-option v-for="opt in currencyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="feeForm.unitPrice" :min="0" :precision="4" class="w-full" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="feeForm.quantity" :min="0" :precision="0" class="w-full" />
        </el-form-item>
        <el-form-item label="预计金额">
          <div class="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">{{ feeExpectedAmountText }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditFeeDialog = false">取消</el-button>
        <el-button type="primary" :loading="editFeeLoading" @click="submitEditFee">保存</el-button>
      </template>
    </el-dialog>

    <!-- 物流轨迹 -->
    <div v-show="activeTab === 'track'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
      暂无物流轨迹
    </div>
  </div>
  </div>
  <div v-if="!loading && !order" class="py-12 text-center text-gray-500">
    订单不存在
    <router-link to="/line-orders" class="text-primary ml-2">返回列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLineOrderDetail as fetchLineOrderDetail, addLineOrderFee, updateLineOrderFee, deleteLineOrderFee, confirmLineOrderFee, updateLineOrderBoxBilling } from '@/api/lineOrders'

const orderStatusText = { DRAFT: '草稿', PENDING: '待处理', TRANSPORTING: '运输中', DELIVERED: '已送达', CANCELLED: '已取消' }

const route = useRoute()
const order = ref(null)
const activeTab = ref('basic')
const loading = ref(false)
const showAddFeeDialog = ref(false)
const addFeeLoading = ref(false)
const showEditFeeDialog = ref(false)
const editingFee = ref(null)
const editFeeLoading = ref(false)
const confirmFeeLoading = ref(false)
const currencyOptions = [
  { value: 'CNY', symbol: '￥', label: '￥ 人民币' },
  { value: 'USD', symbol: '$', label: '$ 美元' },
  { value: 'BRL', symbol: 'R$', label: 'R$ 雷亚尔' },
]
const feeForm = ref({
  feeName: '',
  calcMethod: '',
  unitPrice: undefined,
  quantity: undefined,
  currency: 'USD',
})
const feeExpectedAmountText = computed(() => {
  const u = feeForm.value.unitPrice
  const q = feeForm.value.quantity
  const val = (Number(u) || 0) * (Number(q) || 0)
  const opt = currencyOptions.find((o) => o.value === feeForm.value.currency)
  const symbol = opt?.symbol ?? ''
  return symbol ? `${symbol} ${val.toFixed(2)}` : val.toFixed(2)
})
const showBoxBillingDialog = ref(false)
const editingBox = ref(null)
const boxBillingForm = ref({ billingWeight: undefined, billingVolume: undefined })
const boxBillingLoading = ref(false)

function normalizeDetail(data) {
  if (!data) return null
  const o = data.order || {}
  const boxes = (data.boxes || []).map((box) => ({
    ...box,
    items: (box.goodsList || box.items || []).map((g) => ({
      productName: g.goodsName,
      englishName: g.goodsEnglishName,
      productCode: g.goodsCode,
      brand: g.brand,
      material: g.material,
      specification: g.spec,
      purpose: g.purpose,
      quantity: g.quantity,
      quantityUnit: g.quantityUnit,
      declaredPrice: g.declaredPrice,
      singleWeight: g.unitWeight,
    })),
  }))
  const fees = data.fees || []
  const feeSummary = {}
  fees.forEach((f) => {
    const cur = f.currency || 'USD'
    if (!feeSummary[cur]) feeSummary[cur] = 0
    feeSummary[cur] += Number(f.amount) || 0
  })
  Object.keys(feeSummary).forEach((k) => {
    feeSummary[k] = (feeSummary[k] >= 0 ? '' : '-') + (k === 'USD' ? '$' : '') + Math.abs(feeSummary[k]).toFixed(2)
  })
  const statusTags = [orderStatusText[o.orderStatus] || o.orderStatus].filter(Boolean)
  return {
    ...o,
    orderNo: o.orderNo,
    statusTags,
    orderInfo: {
      orderNo: o.orderNo,
      logisticsProduct: o.logisticsProductId,
      recipient: o.receiveAddressId,
      cargoType: o.cargoType,
      totalWeight: o.totalWeight,
      billingVolume: o.billingVolume,
      billingWeight: o.billingWeight,
      totalVolume: o.totalVolume,
      referenceNo: o.referenceNo,
      orderRemark: o.memo,
    },
    boxes,
    fees,
    feeSummary,
  }
}

async function refetchDetail() {
  const id = route.params.id
  if (!id) return
  try {
    const data = await fetchLineOrderDetail(id)
    order.value = normalizeDetail(data)
  } catch (e) {
    ElMessage.error(e?.message || '刷新失败')
  }
}

function resetFeeForm() {
  feeForm.value = {
    feeName: '',
    calcMethod: '',
    unitPrice: undefined,
    quantity: undefined,
    currency: 'USD',
  }
}

async function submitAddFee() {
  if (!feeForm.value.feeName?.trim()) {
    ElMessage.warning('请填写费用项')
    return
  }
  const id = order.value?.id
  if (id == null) return
  addFeeLoading.value = true
  try {
    const unitPrice = Number(feeForm.value.unitPrice) || 0
    const quantity = Number(feeForm.value.quantity) || 0
    await addLineOrderFee({
      lineOrderId: id,
      feeName: feeForm.value.feeName.trim(),
      calcMethod: feeForm.value.calcMethod || undefined,
      unitPrice,
      quantity,
      amount: unitPrice * quantity,
      currency: feeForm.value.currency || 'USD',
    })
    ElMessage.success('添加成功')
    showAddFeeDialog.value = false
    await refetchDetail()
  } catch (e) {
    ElMessage.error(e?.message || '添加失败')
  } finally {
    addFeeLoading.value = false
  }
}

function openEditFee(fee) {
  if (!fee || order.value?.feeConfirmed) return
  editingFee.value = fee
  feeForm.value = {
    feeName: fee.feeName ?? '',
    calcMethod: fee.calcMethod ?? '',
    unitPrice: fee.unitPrice != null ? Number(fee.unitPrice) : undefined,
    quantity: fee.quantity != null ? Number(fee.quantity) : undefined,
    currency: fee.currency || 'USD',
  }
  showEditFeeDialog.value = true
}

async function submitEditFee() {
  const fee = editingFee.value
  const id = order.value?.id
  if (!fee?.id || id == null) return
  if (!feeForm.value.feeName?.trim()) {
    ElMessage.warning('请填写费用项')
    return
  }
  editFeeLoading.value = true
  try {
    const unitPrice = Number(feeForm.value.unitPrice) || 0
    const quantity = Number(feeForm.value.quantity) || 0
    await updateLineOrderFee({
      id: fee.id,
      lineOrderId: id,
      feeName: feeForm.value.feeName.trim(),
      calcMethod: feeForm.value.calcMethod || undefined,
      unitPrice,
      quantity,
      amount: unitPrice * quantity,
      currency: feeForm.value.currency || 'USD',
    })
    ElMessage.success('修改成功')
    showEditFeeDialog.value = false
    editingFee.value = null
    await refetchDetail()
  } catch (e) {
    ElMessage.error(e?.message || '修改失败')
  } finally {
    editFeeLoading.value = false
  }
}

async function handleDeleteFee(fee) {
  if (!fee?.id || order.value?.feeConfirmed) return
  try {
    await ElMessageBox.confirm(`确定删除费用「${fee.feeName ?? '该项'}」？`, '删除费用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      appendTo: document.body,
      customClass: 'oms-message-box',
    })
  } catch {
    return
  }
  try {
    await deleteLineOrderFee(fee.id)
    ElMessage.success('已删除')
    await refetchDetail()
  } catch (e) {
    ElMessage.error(e?.message || '删除失败')
  }
}

function openBoxBilling(box) {
  editingBox.value = box
  boxBillingForm.value = {
    billingWeight: box.billingWeight != null ? Number(box.billingWeight) : undefined,
    billingVolume: box.billingVolume != null ? Number(box.billingVolume) : undefined,
  }
  showBoxBillingDialog.value = true
}

async function submitBoxBilling() {
  const box = editingBox.value
  if (!box?.id) return
  boxBillingLoading.value = true
  try {
    await updateLineOrderBoxBilling({
      id: box.id,
      billingWeight: boxBillingForm.value.billingWeight,
      billingVolume: boxBillingForm.value.billingVolume,
    })
    ElMessage.success('保存成功')
    showBoxBillingDialog.value = false
    editingBox.value = null
    await refetchDetail()
  } catch (e) {
    ElMessage.error(e?.message || '保存失败')
  } finally {
    boxBillingLoading.value = false
  }
}

async function handleConfirmFee() {
  const id = order.value?.id
  if (id == null) return
  try {
    await ElMessageBox.confirm('确认后订单费用将锁定，是否确认？', '费用确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      appendTo: document.body,
      customClass: 'oms-message-box',
    })
  } catch {
    return
  }
  confirmFeeLoading.value = true
  try {
    await confirmLineOrderFee(id)
    ElMessage.success('已确认')
    await refetchDetail()
  } catch (e) {
    ElMessage.error(e?.message || '确认失败')
  } finally {
    confirmFeeLoading.value = false
  }
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    order.value = null
    return
  }
  loading.value = true
  try {
    const data = await fetchLineOrderDetail(id)
    order.value = normalizeDetail(data)
  } catch (e) {
    ElMessage.error(e?.message || '加载失败')
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>
