<template>
  <div class="min-h-[calc(100vh-8rem)] bg-surface">
    <!-- 顶栏：返回 | 标题与步骤 | 操作按钮 -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <router-link to="/line-orders" class="text-gray-600 hover:text-gray-900 flex items-center gap-1">
        <span>←</span> 返回
      </router-link>
      <div class="text-center order-first w-full sm:order-none sm:w-auto">
        <h1 class="text-xl font-bold text-gray-800">新建专线订单</h1>
        <p class="text-sm text-gray-500 mt-0.5">步骤 {{ step }}/3 - {{ stepTitles[step - 1] }}</p>
      </div>
      <div class="flex flex-wrap gap-2 justify-end">
        <el-button @click="saveDraft">
          <svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          暂存
        </el-button>
        <el-button v-if="step > 1" @click="step--">上一步</el-button>
        <el-button v-if="step < 3" type="primary" @click="nextStep">下一步</el-button>
        <template v-else>
          <el-button @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" @click="finishCreate">完成创建</el-button>
        </template>
      </div>
    </div>

    <!-- 步骤 1: 订单基本信息 - 白卡片、两列 -->
    <div v-show="step === 1" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
      <h2 class="text-lg font-bold text-gray-800">基本信息</h2>
      <p class="text-sm text-gray-500 mb-6">订单基本信息</p>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左列 -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">集运仓 <span class="text-red-500">*</span></label>
            <el-select v-model="form.warehouseId" placeholder="请选择集运仓" class="w-full">
              <el-option label="深圳布吉仓" value="1" />
            </el-select>
            <p class="text-xs text-gray-500 mt-1.5">深圳市龙岗区布吉储运路44号 (导航: 深圳市华辰天投资有限公司)</p>
            <p class="text-xs text-gray-500">周敏 18928485015</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">收件信息 <span class="text-red-500">*</span></label>
            <el-select v-model="form.recipientId" placeholder="请选择收件信息" class="w-full" @change="onRecipientChange">
              <el-option
                v-for="r in shippingAddressesList"
                :key="r.id"
                :label="`已选择: ${r.recipient}`"
                :value="r.id"
              />
            </el-select>
            <template v-if="selectedRecipient">
              <p class="text-xs text-gray-500 mt-1.5">收件人: {{ selectedRecipient.recipient }}</p>
              <p class="text-xs text-gray-500">联系方式: {{ selectedRecipient.contact }}</p>
              <p class="text-xs text-gray-500">详细地址: {{ selectedRecipient.address }}</p>
            </template>
          </div>
        </div>
        <!-- 右列 -->
        <div class="space-y-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-700">物流产品:</span>
            <span v-if="form.logisticsProductName" class="font-semibold text-primary">{{ form.logisticsProductName }}</span>
            <span v-else class="text-gray-500">未选择</span>
            <el-button type="primary" link size="small" @click="showProductModal = true">修改</el-button>
            <span class="text-sm text-gray-700 ml-4">订单号:</span>
            <span class="font-semibold text-gray-800">{{ form.orderNo }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">货物属性 <span class="text-red-500">*</span></label>
            <el-select v-model="form.cargoType" placeholder="请选择货物属性" class="w-full">
              <el-option label="普货" value="普货" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">参考号</label>
            <el-input v-model="form.referenceNo" placeholder="" clearable />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">客户参考号 (可选)</label>
            <el-input v-model="form.customerRef" placeholder="" clearable />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <el-input v-model="form.remark" type="textarea" placeholder="订单备注信息" :rows="3" />
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤 2: 箱信息 - 白卡片、复制箱明细、添加新箱 -->
    <div v-show="step === 2" class="space-y-6">
      <div v-for="(box, idx) in form.boxes" :key="box.id" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <h2 class="text-lg font-bold text-gray-800">箱 #{{ box.boxNo }}</h2>
          <el-button size="small" @click="copyBoxDetail(box)">
            <svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4h8"/></svg>
            复制箱明细
          </el-button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">箱号 <span class="text-red-500">*</span></label>
            <el-input v-model="box.boxNo" placeholder="箱号" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">箱型 <span class="text-red-500">*</span></label>
            <el-select v-model="box.boxType" placeholder="选择箱型" class="w-full">
              <el-option label="纸箱" value="纸箱" />
              <el-option label="木箱" value="木箱" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">重量(KG) <span class="text-red-500">*</span></label>
            <el-input v-model="box.weight" type="number" placeholder="重量" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">长(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.length" type="number" placeholder="长" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">宽(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.width" type="number" placeholder="宽" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">高(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.height" type="number" placeholder="高" />
          </div>
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">箱体积(CBM)</label>
            <el-input :model-value="boxVolume(box)" placeholder="自动计算" disabled />
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">箱唛</label>
            <el-input v-model="box.boxMark" type="textarea" placeholder="箱唛信息" :rows="3" resize="vertical" />
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <el-button type="primary" plain @click="addBox">
        <span class="mr-1">+</span> 添加新箱
      </el-button>
      </div>
    </div>

    <!-- 步骤 3: 商品信息 - 白卡片、商品#1、商品图片行、添加商品 -->
    <div v-show="step === 3" class="space-y-6">
      <div v-for="(box, bi) in form.boxes" :key="'box-' + bi" class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-6">箱 #{{ box.boxNo }} - 商品清单</h2>
        <div v-for="(item, ii) in box.items" :key="ii" class="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-semibold text-gray-800 mb-4">商品 #{{ ii + 1 }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">商品名称 <span class="text-red-500">*</span></label>
              <el-input v-model="item.productName" placeholder="请输入商品名称" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">英文名称 <span class="text-red-500">*</span></label>
              <el-input v-model="item.englishName" placeholder="English Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">商品编码</label>
              <el-input v-model="item.productCode" placeholder="商品编码(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">品牌</label>
              <el-input v-model="item.brand" placeholder="品牌(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">材质 <span class="text-red-500">*</span></label>
              <el-input v-model="item.material" placeholder="请输入材质" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">规格</label>
              <el-input v-model="item.spec" placeholder="规格(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用途</label>
              <el-input v-model="item.purpose" placeholder="用途(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">数量 <span class="text-red-500">*</span></label>
              <el-input v-model="item.quantity" type="number" placeholder="请输入数量" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">单位</label>
              <el-select v-model="item.unit" placeholder="单位" class="w-full">
                <el-option label="件" value="件" />
                <el-option label="个" value="个" />
                <el-option label="套" value="套" />
              </el-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">申报价 <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <el-input v-model="item.declaredPrice" placeholder="请输入申报价" class="flex-1" />
                <el-select v-model="item.declaredCurrency" style="width: 90px">
                  <el-option label="USD" value="USD" />
                  <el-option label="CNY" value="CNY" />
                </el-select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">单品重量(KG)</label>
              <el-input v-model="item.singleWeight" placeholder="请输入单品重量" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">商品图片 <span class="text-red-500">*</span></label>
              <div class="flex flex-wrap items-center gap-3">
                <el-button size="small">选择文件</el-button>
                <span class="text-sm text-gray-500">未选择任何文件</span>
                <el-button size="small">图片库</el-button>
              </div>
              <p class="text-xs text-gray-500 mt-1.5">支持格式:JPG、PNG、WEBP | 尺寸要求:最小480×480像素,最大1024×1024像素 | 文件大小不超过1MB</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <el-button plain @click="addItem(box)">
          <span class="mr-1">+</span> 添加商品
        </el-button>
        </div>
      </div>
    </div>

    <!-- 物流产品选择弹窗 - 与截图一致 -->
    <el-dialog v-model="showProductModal" title="请选择 物流产品" width="560px" destroy-on-close class="line-order-product-dialog">
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="p in logisticsProducts"
          :key="p.id"
          class="border border-slate-200 rounded-xl p-4 hover:border-primary hover:shadow-soft transition-all duration-200"
        >
          <h3 class="font-semibold text-gray-800">{{ p.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ p.desc }}</p>
          <p v-if="p.tag" class="text-xs text-amber-600 mt-0.5">{{ p.tag }}</p>
          <p class="mt-3 text-lg font-bold text-orange-600">{{ p.currency }}{{ p.price }} / {{ p.unit }}</p>
          <el-button type="primary" size="small" class="mt-3" @click="selectProduct(p)">下单</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logisticsProducts } from '@/mock/lineOrders'
import { shippingAddressesList } from '@/mock/shippingAddresses'

const router = useRouter()
const step = ref(1)
const stepTitles = ['订单基本信息', '箱信息', '商品信息']
const showProductModal = ref(false)

const form = reactive({
  orderNo: 'EP0120260211002',
  logisticsProductId: '',
  logisticsProductName: '',
  warehouseId: '1',
  recipientId: '',
  cargoType: '',
  referenceNo: '',
  customerRef: '',
  remark: '',
  boxes: [
    {
      id: '1',
      boxNo: 'EP0120260211002_001',
      boxType: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      boxMark: '',
      items: [{
        productName: '',
        englishName: '',
        productCode: '',
        brand: '',
        material: '',
        spec: '',
        purpose: '',
        quantity: '',
        unit: '件',
        declaredPrice: '',
        declaredCurrency: 'USD',
        singleWeight: '',
      }],
    },
  ],
})

const selectedRecipient = computed(() => {
  if (!form.recipientId) return null
  return shippingAddressesList.find((r) => r.id === form.recipientId)
})

function onRecipientChange() {}

function boxVolume(box) {
  const l = Number(box.length)
  const w = Number(box.width)
  const h = Number(box.height)
  if (!l || !w || !h) return ''
  return ((l * w * h) / 1000000).toFixed(4)
}

function selectProduct(p) {
  form.logisticsProductId = p.id
  form.logisticsProductName = p.name
  showProductModal.value = false
}

function nextStep() {
  if (step.value < 3) step.value++
}

function addBox() {
  const n = form.boxes.length + 1
  const suffix = n < 10 ? '00' + n : n < 100 ? '0' + n : String(n)
  form.boxes.push({
    id: String(n),
    boxNo: form.orderNo + '_' + suffix,
    boxType: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    boxMark: '',
    items: [{
      productName: '',
      englishName: '',
      productCode: '',
      brand: '',
      material: '',
      spec: '',
      purpose: '',
      quantity: '',
      unit: '件',
      declaredPrice: '',
      declaredCurrency: 'USD',
      singleWeight: '',
    }],
  })
}

function copyBoxDetail(box) {
  const n = form.boxes.length + 1
  const suffix = n < 10 ? '00' + n : n < 100 ? '0' + n : String(n)
  form.boxes.push({
    id: String(n),
    boxNo: form.orderNo + '_' + suffix,
    boxType: box.boxType,
    weight: box.weight,
    length: box.length,
    width: box.width,
    height: box.height,
    boxMark: box.boxMark,
    items: [{
      productName: '',
      englishName: '',
      productCode: '',
      brand: '',
      material: '',
      spec: '',
      purpose: '',
      quantity: '',
      unit: '件',
      declaredPrice: '',
      declaredCurrency: 'USD',
      singleWeight: '',
    }],
  })
}

function addItem(box) {
  box.items.push({
    productName: '',
    englishName: '',
    productCode: '',
    brand: '',
    material: '',
    spec: '',
    purpose: '',
    quantity: '',
    unit: '件',
    declaredPrice: '',
    declaredCurrency: 'USD',
    singleWeight: '',
  })
}

function saveDraft() {
  router.push('/line-orders')
}

function finishCreate() {
  router.push('/line-orders')
}

onMounted(() => {
  if (shippingAddressesList.length) form.recipientId = shippingAddressesList[0].id
})
</script>
