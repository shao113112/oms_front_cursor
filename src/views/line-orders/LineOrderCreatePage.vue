<template>
  <div class="min-h-[calc(100vh-8rem)] bg-surface">
    <!-- 顶栏：返回 | 标题与步骤 | 操作按钮 -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <router-link to="/line-orders" class="text-slate-600 hover:text-slate-900 flex items-center gap-1">
        <span>←</span> 返回
      </router-link>
      <div class="text-center order-first w-full sm:order-none sm:w-auto">
        <h1 class="text-xl font-bold text-slate-800">新建专线订单</h1>
        <p class="text-sm text-slate-500 mt-0.5">步骤 {{ step }}/3 - {{ stepTitles[step - 1] }}</p>
      </div>
      <div class="flex flex-wrap gap-2 justify-end">
        <el-button @click="saveDraft" :loading="saving">
          <span v-if="!saving"><svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>暂存</span>
        </el-button>
        <el-button v-if="step > 1" @click="step--">上一步</el-button>
        <el-button v-if="step < 3" type="primary" :disabled="step === 1 ? !step1CanProceed : !step2CanProceed" @click="nextStep">下一步</el-button>
        <template v-else>
          <el-button @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" :disabled="!step1CanProceed || !step2CanProceed || !step3CanProceed" @click="finishCreate" :loading="saving">完成创建</el-button>
        </template>
      </div>
    </div>

    <!-- 步骤 1: 订单基本信息 - 白卡片、两列（含物流产品） -->
    <div v-show="step === 1" class="page-card page-card-padding">
      <div class="flex items-center justify-between gap-4 mb-2">
        <h2 class="section-title text-lg font-bold">基本信息</h2>
        <span v-if="draftOrderId" class="text-sm font-medium text-amber-600">编辑草稿</span>
      </div>
      <p class="text-sm text-slate-500 mb-2">订单基本信息</p>
      <p v-if="draftOrderId && form.orderNo" class="text-sm text-slate-600 mb-6">
        您正在编辑草稿订单。创建后，订单号将更新为：<span class="font-mono font-medium text-slate-800">{{ form.orderNo }}</span>
      </p>
      <p v-else-if="draftOrderId" class="text-sm text-slate-600 mb-6">您正在编辑草稿订单，正在获取新订单号…</p>
      <div v-else class="mb-6" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左列：订单号 + 物流产品 + 集运仓 + 收件信息 -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">订单号</label>
            <div class="px-3 py-2 rounded-lg bg-slate-50 text-slate-700 font-mono">{{ form.orderNo || '—' }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">物流产品 <span class="text-red-500">*</span></label>
            <div class="flex flex-wrap items-center gap-2">
              <span v-if="form.logisticsProductName" class="font-semibold text-primary">{{ form.logisticsProductName }}</span>
              <span v-else class="text-slate-500">未选择</span>
              <el-button type="primary" link size="small" @click="showProductModal = true">{{ form.logisticsProductId ? '修改' : '选择' }}</el-button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">集运仓 <span class="text-red-500">*</span></label>
            <el-select v-model="form.warehouseId" placeholder="请选择集运仓" class="w-full" filterable>
              <el-option
                v-for="w in warehousesList"
                :key="w.id"
                :label="w.warehouseName || w.name || '-'"
                :value="w.id"
              />
            </el-select>
            <template v-if="selectedWarehouse">
              <p v-if="selectedWarehouse.address" class="text-xs text-slate-500 mt-1.5">{{ selectedWarehouse.address }}</p>
              <p v-if="selectedWarehouse.name || selectedWarehouse.phone" class="text-xs text-slate-500">{{ selectedWarehouse.name }} {{ selectedWarehouse.phone }}</p>
            </template>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">收件信息 <span class="text-red-500">*</span></label>
            <el-select v-model="form.recipientId" placeholder="请选择收件信息" class="w-full" @change="onRecipientChange">
              <el-option
                v-for="r in shippingAddressesList"
                :key="r.id"
                :label="`${r.name || r.recipient || '收件信息'} ${r.phone ? '(' + r.phone + ')' : ''}`"
                :value="r.id"
              />
            </el-select>
            <template v-if="selectedRecipient">
              <p class="text-xs text-slate-500 mt-1.5">收件人: {{ selectedRecipient.name || selectedRecipient.recipient }}</p>
              <p class="text-xs text-slate-500">联系方式: {{ selectedRecipient.phone || selectedRecipient.contact }}</p>
              <p class="text-xs text-slate-500">详细地址: {{ selectedRecipient.address }}</p>
            </template>
          </div>
        </div>
        <!-- 右列：货物属性（两层，与 cargoTypeSelect.png 一致）+ 参考号 + 备注 -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">货物属性 <span class="text-red-500">*</span></label>
            <el-popover :visible="cargoTypePopoverVisible" placement="bottom-start" :width="440" trigger="manual" @update:visible="(v) => (cargoTypePopoverVisible = v)">
              <template #reference>
                <div
                  class="el-input el-input--default w-full cursor-pointer flex items-center justify-between rounded-[var(--el-input-border-radius)] border border-[var(--el-border-color)] bg-[var(--el-fill-color-blank)] px-4 py-2 min-h-[32px] text-[var(--el-text-color-regular)]"
                  @click.stop="cargoTypePopoverVisible = !cargoTypePopoverVisible"
                >
                  <span :class="form.cargoType ? 'text-[var(--el-text-color-primary)]' : 'text-[var(--el-text-color-placeholder)]'">
                    {{ form.cargoType || '请选择货物属性（普货或特货）' }}
                  </span>
                  <span class="text-slate-400 shrink-0">▼</span>
                </div>
              </template>
              <!-- 与 cargoTypeSelect.png 一致：实际选项仅普货/特货；第二层为提示说明，不可选 -->
              <div class="cargo-type-select py-1 max-h-80 overflow-y-auto">
                <!-- 第一层可选项：普货 -->
                <div class="mb-4">
                  <button
                    type="button"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2"
                    :class="form.cargoType === '普货' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                    @click="form.cargoType = '普货'; cargoTypePopoverVisible = false"
                  >
                    {{ form.cargoType === '普货' ? '✓ ' : '' }}普货
                  </button>
                  <p class="text-xs text-slate-500 mb-1.5">包含例如：</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="item in cargoTypePuHuo"
                      :key="item"
                      class="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600"
                    >{{ item }}</span>
                  </div>
                </div>
                <!-- 第一层可选项：特货 -->
                <div>
                  <button
                    type="button"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2"
                    :class="form.cargoType === '特货' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                    @click="form.cargoType = '特货'; cargoTypePopoverVisible = false"
                  >
                    {{ form.cargoType === '特货' ? '✓ ' : '' }}特货
                  </button>
                  <p class="text-xs text-slate-500 mb-1.5">包含例如：</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="item in cargoTypeTeHuo"
                      :key="item"
                      class="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600"
                    >{{ item }}</span>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">客户参考号 (可选)</label>
            <el-input v-model="form.customerRef" placeholder="" clearable />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">备注</label>
            <el-input v-model="form.remark" type="textarea" placeholder="订单备注信息" :rows="3" />
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤 2: 箱信息 - 白卡片、复制箱明细、添加新箱 -->
    <div v-show="step === 2" class="space-y-6">
      <div v-for="(box, idx) in form.boxes" :key="box.id" class="page-card page-card-padding">
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <h2 class="text-lg font-bold text-slate-800">箱 #{{ box.boxNo }}</h2>
          <el-button size="small" @click="copyBoxDetail(box)">
            <svg class="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4h8"/></svg>
            复制箱明细
          </el-button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">箱号</label>
            <el-input :model-value="box.boxNo" readonly placeholder="订单号_001" class="bg-slate-50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">箱型 <span class="text-red-500">*</span></label>
            <el-select v-model="box.boxType" placeholder="选择箱型" class="w-full">
              <el-option label="纸箱" value="纸箱" />
              <el-option label="麻袋" value="麻袋" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">重量(KG) <span class="text-red-500">*</span></label>
            <el-input v-model="box.weight" type="number" placeholder="重量" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">长(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.length" type="number" placeholder="长" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">宽(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.width" type="number" placeholder="宽" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">高(CM) <span class="text-red-500">*</span></label>
            <el-input v-model="box.height" type="number" placeholder="高" />
          </div>
          <div class="sm:col-span-1">
            <label class="block text-sm font-medium text-slate-700 mb-1">箱体积(CBM)</label>
            <el-input :model-value="boxVolume(box)" placeholder="自动计算" disabled />
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">箱唛</label>
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
      <div v-for="(box, bi) in form.boxes" :key="'box-' + bi" class="page-card page-card-padding">
        <h2 class="text-lg font-bold text-slate-800 mb-6">箱 #{{ box.boxNo }} - 商品清单</h2>
        <div v-for="(item, ii) in box.items" :key="ii" class="form-block-inner mb-6">
          <h3 class="text-sm font-semibold text-slate-800 mb-4">商品 #{{ ii + 1 }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">商品名称 <span class="text-red-500">*</span></label>
              <el-input v-model="item.productName" placeholder="请输入商品名称" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">英文名称 <span class="text-red-500">*</span></label>
              <el-input v-model="item.englishName" placeholder="English Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">商品编码</label>
              <el-input v-model="item.productCode" placeholder="商品编码(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">品牌</label>
              <el-input v-model="item.brand" placeholder="品牌(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">材质 <span class="text-red-500">*</span></label>
              <el-input v-model="item.material" placeholder="请输入材质" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">规格</label>
              <el-input v-model="item.spec" placeholder="规格(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">用途</label>
              <el-input v-model="item.purpose" placeholder="用途(可选)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">数量 <span class="text-red-500">*</span></label>
              <el-input v-model="item.quantity" type="number" placeholder="请输入数量" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">单位</label>
              <el-select v-model="item.unit" placeholder="单位" class="w-full">
                <el-option label="件" value="件" />
                <el-option label="个" value="个" />
                <el-option label="套" value="套" />
              </el-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">申报价 <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <el-input v-model="item.declaredPrice" placeholder="请输入申报价" class="flex-1" />
                <el-select v-model="item.declaredCurrency" style="width: 90px">
                  <el-option label="USD" value="USD" />
                  <el-option label="CNY" value="CNY" />
                </el-select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">单品重量(KG)</label>
              <el-input v-model="item.singleWeight" placeholder="请输入单品重量" />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-slate-700 mb-1">商品图片 <span class="text-red-500">*</span></label>
              <div class="flex flex-wrap items-center gap-3">
                <el-button size="small">选择文件</el-button>
                <span class="text-sm text-slate-500">未选择任何文件</span>
                <el-button size="small">图片库</el-button>
              </div>
              <p class="text-xs text-slate-500 mt-1.5">支持格式:JPG、PNG、WEBP | 尺寸要求:最小480×480像素,最大1024×1024像素 | 文件大小不超过1MB</p>
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

    <!-- 物流产品选择弹窗：与 productselect.png 一致，卡片展示产品+报价，下单按钮 -->
    <el-dialog
      v-model="showProductModal"
      title="请选择 物流产品"
      width="560px"
      destroy-on-close
      class="line-order-product-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="!!form.logisticsProductId"
    >
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="item in logisticsProductPrices"
          :key="item.id"
          class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-soft hover:border-primary hover:shadow-soft transition-all duration-200 flex flex-col"
        >
          <h3 class="text-base font-bold text-slate-800 leading-snug">{{ item.productName || '—' }}</h3>
          <p class="text-sm text-slate-500 mt-2">{{ (item.transportMethod || '') + (item.transportMethod && item.cargoType ? ' · ' : '') + (item.cargoType || '') || '—' }}</p>
          <p v-if="item.memo" class="text-xs text-amber-600 mt-1">{{ item.memo }}</p>
          <p class="mt-3 text-lg font-bold text-red-600">
            <template v-if="productPriceDisplay(item)">{{ productPriceDisplay(item) }}</template>
            <span v-else class="text-slate-400 font-normal">—</span>
          </p>
          <div class="mt-auto pt-4">
            <el-button type="primary" class="w-full" @click="selectProduct(item)">下单</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listLogisticsProductPrices } from '@/api/logisticsProductPrices'
import { listReceiveAddresses } from '@/api/receiveAddresses'
import { listWarehouses } from '@/api/warehouses'
import {
  createLineOrder,
  createLineOrderDraft,
  getNewLineOrderNo,
  getLineOrderDetail,
} from '@/api/lineOrders'
import { listLogisticsProducts } from '@/api/logisticsProducts'

/** 货物属性两层：普货 / 特货 及其子项（参考 cargoTypeSelect.png） */
const cargoTypePuHuo = ['毛巾', '鞋子', '服装', '日用品', '家具(不含木)', '插电的小家电', '家居装饰品', '五金配件', '塑料制品', '无内置或外接电池', '无IC', '无磁', '无电机', '无液体', '无粉末', '无食品', '无品牌或仿牌', '赝金属饰品', '电机(小型)', '木制品(5方内)']
const cargoTypeTeHuo = ['食品相关', '洗浴品', '护肤品', '化妆品', '化工品(非危,需要化工品标签)', '贵金属原材料等', '电器（涉证）', '厨具(涉证)', '陶瓷', '玩具', '木制家具和木制品(加商检可按普货支持)', 'PVC管', '建材', '装修材料', '钢材', '铝材', '电缆', '直接接触婴儿的产品', '纸尿裤', '卫生巾', '动漫手办模型', '人体用品与进嘴类制品', '非品牌的电子产品(除手机平板等高货值货物)', '带电带磁内置电池', '微磁产品', '数码产品与配件', '医疗用品', '摩托/汽车配件']

const router = useRouter()
const route = useRoute()
/** 从列表草稿进入编辑时存在，仅用于加载草稿数据后取新订单号、默认步骤 1；保存草稿用 /draft，完成用 /create */
const draftOrderId = ref(route.query.draftId ? String(route.query.draftId) : '')
const step = ref(1)
const stepTitles = ['订单基本信息', '箱信息', '商品信息']
const showProductModal = ref(false)
const cargoTypePopoverVisible = ref(false)
const saving = ref(false)
const shippingAddressesList = ref([])
const logisticsProductPrices = ref([])
const warehousesList = ref([])

const form = reactive({
  orderNo: '',
  logisticsProductId: '',
  logisticsProductName: '',
  warehouseId: '',
  recipientId: '',
  cargoType: '',
  referenceNo: '',
  customerRef: '',
  remark: '',
  boxes: [
    {
      id: '1',
      boxNo: '',
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
  const id = form.recipientId
  return shippingAddressesList.value.find((r) => r.id === id || String(r.id) === String(id))
})

const selectedWarehouse = computed(() => {
  if (form.warehouseId == null || form.warehouseId === '') return null
  const id = form.warehouseId
  return warehousesList.value.find((w) => w.id === id || String(w.id) === String(id))
})

function onRecipientChange() {}

/** 与 productselect.png 一致：价格展示，如 "$55 / KG"、"$50 / CBM" */
function productPriceDisplay(item) {
  const price = item.unitPrice
  const unit = item.unit
  if (price == null || price === '') return ''
  const cur = item.currency && item.currency !== 'USD' ? item.currency : '$'
  return unit ? `${cur}${price} / ${unit}` : `${cur}${price}`
}

function boxVolume(box) {
  const l = Number(box.length)
  const w = Number(box.width)
  const h = Number(box.height)
  if (!l || !w || !h) return ''
  return (l * w * h) / 1000000
}

function selectProduct(item) {
  form.logisticsProductId = item.productId
  form.logisticsProductName = item.productName || ''
  showProductModal.value = false
}

/** 步骤1必填：物流产品、集运仓、收件信息、货物属性 */
function getStep1Error() {
  if (!form.logisticsProductId) return '请选择物流产品'
  if (form.warehouseId == null || form.warehouseId === '') return '请选择集运仓'
  if (!form.recipientId) return '请选择收件信息'
  if (!form.cargoType || !form.cargoType.trim()) return '请选择货物属性（普货或特货）'
  return ''
}

/** 步骤2必填：每个箱的箱号（自动生成）、箱型、重量、长宽高 */
function getStep2Error() {
  for (let i = 0; i < form.boxes.length; i++) {
    const box = form.boxes[i]
    const no = (box.boxNo != null && String(box.boxNo).trim()) || ''
    if (!no) return `箱 #${i + 1}：箱号未生成，请先完成步骤一获取订单号`
    if (!box.boxType || !String(box.boxType).trim()) return `箱 #${i + 1}：请选择箱型`
    const w = Number(box.weight)
    if (box.weight === '' || box.weight == null || isNaN(w) || w <= 0) return `箱 #${i + 1}：请填写有效重量(KG)`
    const l = Number(box.length)
    if (box.length === '' || box.length == null || isNaN(l) || l <= 0) return `箱 #${i + 1}：请填写有效长(CM)`
    const ww = Number(box.width)
    if (box.width === '' || box.width == null || isNaN(ww) || ww <= 0) return `箱 #${i + 1}：请填写有效宽(CM)`
    const h = Number(box.height)
    if (box.height === '' || box.height == null || isNaN(h) || h <= 0) return `箱 #${i + 1}：请填写有效高(CM)`
  }
  return ''
}

/** 步骤3必填：每个商品的商品名称、英文名称、材质、数量、申报价 */
function getStep3Error() {
  for (let bi = 0; bi < form.boxes.length; bi++) {
    const box = form.boxes[bi]
    const items = box.items || []
    if (items.length === 0) return `箱 #${box.boxNo || bi + 1}：请至少添加一个商品`
    for (let ii = 0; ii < items.length; ii++) {
      const item = items[ii]
      const name = (item.productName != null && String(item.productName).trim()) || ''
      if (!name) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写商品名称`
      const en = (item.englishName != null && String(item.englishName).trim()) || ''
      if (!en) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写英文名称`
      const mat = (item.material != null && String(item.material).trim()) || ''
      if (!mat) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写材质`
      const q = Number(item.quantity)
      if (item.quantity === '' || item.quantity == null || isNaN(q) || q <= 0) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写有效数量`
      const price = item.declaredPrice
      if (price === '' || price == null) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写申报价`
      const pNum = Number(price)
      if (isNaN(pNum) || pNum < 0) return `箱 #${box.boxNo || bi + 1} 商品 #${ii + 1}：请填写有效申报价`
    }
  }
  return ''
}

const step1CanProceed = computed(() => !getStep1Error())
const step2CanProceed = computed(() => !getStep2Error())
const step3CanProceed = computed(() => !getStep3Error())

function nextStep() {
  if (step.value === 1) {
    const err = getStep1Error()
    if (err) {
      ElMessage.warning(err)
      return
    }
  } else if (step.value === 2) {
    const err = getStep2Error()
    if (err) {
      ElMessage.warning(err)
      return
    }
  }
  if (step.value < 3) step.value++
}

/** 按订单号刷新所有箱号：orderNo_001, orderNo_002, ... */
function refreshBoxNos() {
  const prefix = form.orderNo || ''
  form.boxes.forEach((box, i) => {
    box.boxNo = prefix ? `${prefix}_${String(i + 1).padStart(3, '0')}` : ''
  })
}

function addBox() {
  const n = form.boxes.length + 1
  const boxNo = form.orderNo ? `${form.orderNo}_${String(n).padStart(3, '0')}` : ''
  form.boxes.push({
    id: String(n),
    boxNo,
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
  const boxNo = form.orderNo ? `${form.orderNo}_${String(n).padStart(3, '0')}` : ''
  form.boxes.push({
    id: String(n),
    boxNo,
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

function buildPayload(orderStatus) {
  let totalWeight = 0
  let totalVolume = 0
  const boxes = form.boxes.map((box) => {
    const w = Number(box.weight) || 0
    const vol = boxVolume(box) || 0
    totalWeight += w
    totalVolume += vol
    const boxPayload = {
      boxNo: box.boxNo,
      boxType: box.boxType,
      weight: w,
      length: Number(box.length) || null,
      width: Number(box.width) || null,
      height: Number(box.height) || null,
      volume: vol,
      billingVolume: vol,
      billingWeight: w,
      boxMark: box.boxMark || undefined,
    }
    const goods = (box.items || []).map((item) => ({
      goodsName: item.productName,
      goodsEnglishName: item.englishName,
      goodsCode: item.productCode,
      brand: item.brand,
      material: item.material,
      spec: item.spec,
      purpose: item.purpose,
      quantity: Number(item.quantity) || 0,
      quantityUnit: item.unit,
      declaredPrice: item.declaredPrice != null && item.declaredPrice !== '' ? Number(item.declaredPrice) : null,
      declaredCurrency: item.declaredCurrency,
      unitWeight: item.singleWeight != null && item.singleWeight !== '' ? Number(item.singleWeight) : null,
    }))
    return { box: boxPayload, goods }
  })
  const order = {
    orderNo: form.orderNo || undefined,
    referenceNo: form.customerRef || form.referenceNo || undefined,
    warehouseId: form.warehouseId != null ? Number(form.warehouseId) : null,
    logisticsProductId: form.logisticsProductId != null ? Number(form.logisticsProductId) : null,
    receiveAddressId: form.recipientId != null ? Number(form.recipientId) : null,
    cargoType: form.cargoType || undefined,
    orderStatus,
    feeConfirmed: false,
    boxQty: form.boxes.length,
    totalWeight,
    totalVolume,
    billingWeight: totalWeight,
    billingVolume: totalVolume,
    totalFee: 0,
    memo: form.remark || undefined,
  }
  const payload = { order, boxes }
  if (draftOrderId.value) {
    payload.sourceOrderId = Number(draftOrderId.value)
  }
  return payload
}

async function saveDraft() {
  saving.value = true
  try {
    const payload = buildPayload('DRAFT')
    const id = await createLineOrderDraft(payload)
    ElMessage.success('草稿保存成功')
    if (id != null) router.push(`/line-orders/${id}`)
    else router.push('/line-orders')
  } catch (e) {
    ElMessage.error(e?.message || '保存草稿失败')
  } finally {
    saving.value = false
  }
}

async function finishCreate() {
  const e1 = getStep1Error()
  if (e1) {
    ElMessage.warning(e1)
    return
  }
  const e2 = getStep2Error()
  if (e2) {
    ElMessage.warning(e2)
    return
  }
  const e3 = getStep3Error()
  if (e3) {
    ElMessage.warning(e3)
    return
  }
  saving.value = true
  try {
    const payload = buildPayload('PENDING')
    const id = await createLineOrder(payload)
    ElMessage.success('保存成功')
    if (id != null) router.push(`/line-orders/${id}`)
    else router.push('/line-orders')
  } catch (e) {
    ElMessage.error(e?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

/** 从草稿详情回填表单，停留在步骤 1（订单号由下方取新号覆盖） */
function fillFormFromDraft(detail) {
  const o = detail?.order
  const boxesData = detail?.boxes || []
  if (!o) return
  form.warehouseId = o.warehouseId ?? ''
  form.recipientId = o.receiveAddressId ?? ''
  form.logisticsProductId = o.logisticsProductId ?? ''
  form.logisticsProductName = o.logisticsProductName ?? ''
  form.cargoType = o.cargoType ?? ''
  form.customerRef = o.referenceNo ?? ''
  form.remark = o.memo ?? ''
  form.boxes = boxesData.map((box, i) => {
    const goodsList = box.goodsList || []
    return {
      id: String(box.id ?? i + 1),
      boxNo: '', // 由 refreshBoxNos 按新订单号生成
      boxType: box.boxType ?? '',
      weight: box.weight != null ? String(box.weight) : '',
      length: box.length != null ? String(box.length) : '',
      width: box.width != null ? String(box.width) : '',
      height: box.height != null ? String(box.height) : '',
      boxMark: box.boxMark ?? '',
      items: goodsList.length
        ? goodsList.map((g) => ({
            productName: g.goodsName ?? '',
            englishName: g.goodsEnglishName ?? '',
            productCode: g.goodsCode ?? '',
            brand: g.brand ?? '',
            material: g.material ?? '',
            spec: g.spec ?? '',
            purpose: g.purpose ?? '',
            quantity: g.quantity != null ? String(g.quantity) : '',
            unit: g.quantityUnit ?? '件',
            declaredPrice: g.declaredPrice != null ? String(g.declaredPrice) : '',
            declaredCurrency: g.declaredCurrency ?? 'USD',
            singleWeight: g.unitWeight != null ? String(g.unitWeight) : '',
          }))
        : [
            {
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
            },
          ],
    }
  })
  if (form.boxes.length === 0) {
    form.boxes = [
      {
        id: '1',
        boxNo: '',
        boxType: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        boxMark: '',
        items: [
          {
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
          },
        ],
      },
    ]
  }
  step.value = 1
}

onMounted(async () => {
  if (draftOrderId.value) {
    try {
      const [detail, addrs, warehouses, orderNo] = await Promise.all([
        getLineOrderDetail(draftOrderId.value),
        listReceiveAddresses(),
        listWarehouses(),
        getNewLineOrderNo(),
      ])
      shippingAddressesList.value = Array.isArray(addrs) ? addrs : []
      warehousesList.value = Array.isArray(warehouses) ? warehouses : []
      if (detail) {
        fillFormFromDraft(detail)
        if (orderNo) {
          form.orderNo = orderNo
          refreshBoxNos()
        }
        if (form.logisticsProductId && !form.logisticsProductName) {
          const products = await listLogisticsProducts()
          const product = Array.isArray(products)
            ? products.find((p) => p.id === form.logisticsProductId || String(p.id) === String(form.logisticsProductId))
            : null
          if (product) form.logisticsProductName = product.productName || product.name || ''
        }
      } else {
        ElMessage.warning('草稿不存在')
      }
    } catch (e) {
      ElMessage.error(e?.message || '加载草稿失败')
    }
    return
  }
  const [addrs, warehouses, orderNo] = await Promise.all([
    listReceiveAddresses(),
    listWarehouses(),
    getNewLineOrderNo(),
  ])
  shippingAddressesList.value = Array.isArray(addrs) ? addrs : []
  warehousesList.value = Array.isArray(warehouses) ? warehouses : []
  if (orderNo) {
    form.orderNo = orderNo
    refreshBoxNos()
  }
  if (shippingAddressesList.value.length && !form.recipientId) {
    form.recipientId = shippingAddressesList.value[0].id
  }
  if (warehousesList.value.length && form.warehouseId === '') {
    form.warehouseId = warehousesList.value[0].id
  }
  if (!form.logisticsProductId) {
    showProductModal.value = true
  }
})

watch(showProductModal, (visible) => {
  if (visible) loadProductPrices()
})

async function loadProductPrices() {
  try {
    const list = await listLogisticsProductPrices()
    logisticsProductPrices.value = Array.isArray(list) ? list : []
  } catch {
    logisticsProductPrices.value = []
  }
}
</script>
