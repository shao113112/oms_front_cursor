<template>
  <div class="max-w-3xl w-full">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">整柜预约</h1>
      <span class="text-sm text-gray-500">整柜单号: {{ orderNo }}</span>
    </div>

    <div class="space-y-6 bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6">
      <!-- 提货地址 -->
      <section>
        <h2 class="text-base font-semibold text-gray-800 mb-4">提货地址</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">提货方式 <span class="text-red-500">*</span></label>
            <input type="text" value="上门提货" readonly class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">提货地址 <span class="text-red-500">*</span></label>
            <el-select v-model="form.pickupAddressId" placeholder="添加或选择管理提货地址" class="w-full" filterable>
              <el-option label="请选择提货地址" value="" />
              <el-option v-for="a in pickupAddresses" :key="a.id" :label="a.name" :value="a.id" />
            </el-select>
          </div>
        </div>
      </section>

      <!-- 收件地址 -->
      <section>
        <h2 class="text-base font-semibold text-gray-800 mb-4">收件地址</h2>
        <div class="flex items-start justify-between gap-4">
          <div class="text-gray-700">
            <p>{{ form.recipientSummary || 'Thomas BESSA - Bouvervard Jourdan 75014 Sao Paulo, Brazil' }}</p>
            <p class="text-sm text-gray-500 mt-2">收件人: Thomas BESSA</p>
            <p class="text-sm text-gray-500">联系方式: +88932312344432</p>
            <p class="text-sm text-gray-500">地址: Bouvervard Jourdan 75014 Sao Paulo, Brazil</p>
          </div>
          <el-button type="primary" link>更改</el-button>
        </div>
      </section>

      <!-- 基本信息 -->
      <section>
        <h2 class="text-base font-semibold text-gray-800 mb-4">基本信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">运输方式 <span class="text-red-500">*</span></label>
            <input type="text" value="海运" readonly class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">箱数 <span class="text-red-500">*</span></label>
            <el-input v-model="form.boxCount" placeholder="请输入箱数" type="number" min="1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">发货备注</label>
            <el-input v-model="form.shippingNote" type="textarea" placeholder="请输入发货备注" :rows="3" />
          </div>
        </div>
      </section>

      <!-- 申报信息 -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-800">申报信息</h2>
          <el-button type="primary" @click="addDeclaration">+ 新增</el-button>
        </div>
        <div v-if="form.declarationItems.length === 0" class="py-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
          暂无数据
        </div>
        <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">商品名称</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">数量</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">申报价格</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, idx) in form.declarationItems" :key="idx">
                <td class="px-4 py-2"><el-input v-model="item.productName" size="small" placeholder="商品名称" /></td>
                <td class="px-4 py-2"><el-input v-model="item.quantity" type="number" size="small" /></td>
                <td class="px-4 py-2"><el-input v-model="item.declaredPrice" size="small" placeholder="申报价" /></td>
                <td class="px-4 py-2"><el-button type="danger" link size="small" @click="form.declarationItems.splice(idx, 1)">删除</el-button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 flex gap-6 text-sm text-gray-600">
          <span>总件数: {{ totalPieces }}</span>
          <span>总箱数: {{ form.boxCount || 0 }}</span>
          <span>申报总货值(CNY): {{ totalDeclaredValue }}</span>
        </div>
      </section>

      <div class="flex items-center justify-end gap-4 pt-4 border-t">
        <el-checkbox v-model="form.agreed">阅读并同意《服务协议》</el-checkbox>
        <el-button type="primary" :disabled="!form.agreed" @click="submit">确认提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderNo = ref('EP0220260211003')

const pickupAddresses = ref([{ id: '1', name: '深圳布吉仓' }])

const form = reactive({
  pickupAddressId: '',
  recipientSummary: '',
  boxCount: 1,
  shippingNote: '',
  agreed: false,
  declarationItems: [],
})

const totalPieces = computed(() => form.declarationItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0))
const totalDeclaredValue = computed(() =>
  form.declarationItems.reduce((s, i) => s + (Number(i.declaredPrice) || 0) * (Number(i.quantity) || 0), 0).toFixed(2)
)

function addDeclaration() {
  form.declarationItems.push({ productName: '', quantity: 0, declaredPrice: '' })
}
function submit() {
  router.push('/container-orders')
}
</script>
