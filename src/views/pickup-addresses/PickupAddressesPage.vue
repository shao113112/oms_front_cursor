<template>
  <div class="w-full min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-bold text-gray-800">提货地址管理</h1>
      <el-button type="primary" @click="openAdd">+ 新增提货地址</el-button>
    </div>

    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden">
      <el-table :data="list" stripe v-loading="loading">
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
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑提货地址' : '新增提货地址'" width="500px" destroy-on-close @close="resetForm">
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
        <el-button type="primary" @click="submitForm" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  searchPickupAddresses,
  createPickupAddress,
  updatePickupAddress,
  deletePickupAddress,
} from '@/api/pickupAddresses'
import { useOperationFeedback } from '@/composables/useOperationFeedback'

const list = ref([])
const loading = ref(false)
const saving = ref(false)

function mapItem(row) {
  return {
    ...row,
    name: row.addressName ?? row.name,
    contact: row.name ?? row.contact,
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchPickupAddresses({ page: 1, size: 500 })
    list.value = (res.items || []).map(mapItem)
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchList())

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

const { withDeleteConfirm, withSaveOperation, showError } = useOperationFeedback()

function openAdd() {
  editingId.value = ''
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  form.name = row.name ?? ''
  form.contact = row.contact ?? ''
  form.phone = row.phone ?? ''
  form.address = row.address ?? ''
  form.remark = row.remark ?? row.memo ?? ''
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

async function submitForm() {
  saving.value = true
  try {
    await withSaveOperation(async () => {
      if (editingId.value) {
        await updatePickupAddress({
          id: editingId.value,
          name: form.name,
          contact: form.contact,
          phone: form.phone,
          address: form.address,
          remark: form.remark,
          isDefault: form.isDefault,
        })
        const idx = list.value.findIndex((a) => a.id === editingId.value)
        if (idx !== -1) {
          list.value[idx] = mapItem({
            ...list.value[idx],
            addressName: form.name,
            name: form.contact,
            phone: form.phone,
            address: form.address,
            memo: form.remark,
            isDefault: form.isDefault,
          })
        }
      } else {
        await createPickupAddress({
          name: form.name,
          contact: form.contact,
          phone: form.phone,
          address: form.address,
          remark: form.remark,
          isDefault: form.isDefault,
        })
        await fetchList()
      }
    }, '提货地址')
    dialogVisible.value = false
  } catch (e) {
    showError(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  const id = typeof row === 'object' ? row.id : row
  const item = list.value.find((a) => a.id === id)
  if (!item) return
  await withDeleteConfirm(item.name || item.addressName || '该地址', async () => {
    await deletePickupAddress(id)
    list.value = list.value.filter((a) => a.id !== id)
  })
}
</script>
