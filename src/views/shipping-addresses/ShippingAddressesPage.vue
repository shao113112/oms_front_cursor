<template>
  <div class="bg-content-dark min-h-[calc(100vh-8rem)] -mx-4 -my-6 px-4 py-6 md:-mx-6 md:px-6 md:py-6 rounded-lg">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-white">收件信息管理</h1>
      <el-button type="primary" @click="openDialog">+ 新增收件信息</el-button>
    </div>

    <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
      <p class="text-sm">暂无收件信息，点击上方按钮添加</p>
    </div>
    <div v-else class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <el-table :data="list">
        <el-table-column prop="recipient" label="收件人" width="140" />
        <el-table-column prop="contact" label="联系方式" width="160" />
        <el-table-column prop="address" label="详细地址" min-width="220" show-overflow-tooltip />
        <el-table-column prop="isDefault" label="默认地址" width="100">
          <template #default="{ row }">
            <span v-if="row.isDefault" class="text-primary">默认</span>
            <span v-else class="text-gray-500">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="新增收件信息" width="500px" destroy-on-close @close="resetForm">
      <p class="text-gray-500 text-sm mb-4">请填写收件人的详细信息</p>
      <el-form :model="form" label-width="100px">
        <el-form-item label="收件人" required>
          <el-input v-model="form.recipient" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" required>
          <el-input v-model="form.contact" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input v-model="form.address" type="textarea" placeholder="请输入详细地址" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { shippingAddressesList, addShippingAddress, updateShippingAddress, deleteShippingAddress } from '@/mock/shippingAddresses'

const list = ref([])

onMounted(() => {
  list.value = [...shippingAddressesList]
})

const dialogVisible = ref(false)
const editingId = ref('')
const form = reactive({
  recipient: '',
  contact: '',
  address: '',
  isDefault: false,
})

function openDialog() {
  editingId.value = ''
  resetForm()
  dialogVisible.value = true
}
function openEdit(row) {
  editingId.value = row.id
  form.recipient = row.recipient
  form.contact = row.contact
  form.address = row.address
  form.isDefault = !!row.isDefault
  dialogVisible.value = true
}
function resetForm() {
  editingId.value = ''
  form.recipient = ''
  form.contact = ''
  form.address = ''
  form.isDefault = false
}
function submitForm() {
  if (editingId.value) {
    updateShippingAddress(editingId.value, { ...form })
    const idx = list.value.findIndex((a) => a.id === editingId.value)
    if (idx !== -1) Object.assign(list.value[idx], { ...form, isDefault: form.isDefault })
  } else {
    addShippingAddress({ ...form })
    list.value = [...shippingAddressesList]
  }
  dialogVisible.value = false
}
function handleDelete(id) {
  deleteShippingAddress(id)
  list.value = list.value.filter((a) => a.id !== id)
}
</script>
