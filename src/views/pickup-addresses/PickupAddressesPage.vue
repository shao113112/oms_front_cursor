<template>
  <div class="bg-content-dark min-h-[calc(100vh-8rem)] -mx-4 -my-6 px-4 py-6 md:-mx-6 md:px-6 md:py-6 rounded-lg">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-white">提货地址管理</h1>
      <el-button type="primary" @click="dialogVisible = true">+ 新增提货地址</el-button>
    </div>

    <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
      <p class="text-sm">暂无提货地址，点击上方按钮添加</p>
    </div>
    <div v-else class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <el-table :data="list" class="dark-table">
        <el-table-column prop="name" label="地址名称" min-width="120" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系方式" width="140" />
        <el-table-column prop="address" label="详细地址" min-width="200" show-overflow-tooltip />
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

    <el-dialog v-model="dialogVisible" title="新增提货地址" width="500px" destroy-on-close @close="resetForm">
      <p class="text-gray-500 text-sm mb-4">请填写提货地址的详细信息</p>
      <el-form :model="form" label-width="100px">
        <el-form-item label="地址名称">
          <el-input v-model="form.name" placeholder="例如:工厂地址、仓库1号等" />
        </el-form-item>
        <el-form-item label="联系人" required>
          <el-input v-model="form.contact" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" required>
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input v-model="form.address" type="textarea" placeholder="请输入详细地址" :rows="3" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="填写其他备注信息" :rows="2" />
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
import { pickupAddressesList, addPickupAddress, updatePickupAddress, deletePickupAddress } from '@/mock/pickupAddresses'

const list = ref([])

onMounted(() => {
  list.value = [...pickupAddressesList]
})

const dialogVisible = ref(false)
const editingId = ref('')
const form = reactive({
  name: '',
  contact: '',
  phone: '',
  address: '',
  remark: '',
  isDefault: false,
})

function openEdit(row) {
  editingId.value = row.id
  form.name = row.name || ''
  form.contact = row.contact || ''
  form.phone = row.phone || ''
  form.address = row.address || ''
  form.remark = row.remark || ''
  form.isDefault = !!row.isDefault
  dialogVisible.value = true
}
function resetForm() {
  editingId.value = ''
  form.name = ''
  form.contact = ''
  form.phone = ''
  form.address = ''
  form.remark = ''
  form.isDefault = false
}
function submitForm() {
  if (editingId.value) {
    updatePickupAddress(editingId.value, { ...form })
    const idx = list.value.findIndex((a) => a.id === editingId.value)
    if (idx !== -1) Object.assign(list.value[idx], { ...form, isDefault: form.isDefault })
  } else {
    addPickupAddress({ ...form })
    list.value = [...pickupAddressesList]
  }
  dialogVisible.value = false
}
function handleDelete(id) {
  deletePickupAddress(id)
  list.value = list.value.filter((a) => a.id !== id)
}
</script>
