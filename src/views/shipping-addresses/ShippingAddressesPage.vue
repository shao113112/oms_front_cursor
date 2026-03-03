<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <h1 class="page-title">收件信息管理</h1>
      <el-button type="primary" @click="openDialog">+ 新增收件信息</el-button>
    </div>

    <div class="table-card">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%" class="mobile-table-dense mobile-action-buttons">
        <el-table-column prop="recipient" label="收件人" min-width="140" />
        <el-table-column prop="contact" label="联系方式" min-width="160" />
        <el-table-column prop="address" label="详细地址" min-width="220" show-overflow-tooltip />
        <el-table-column prop="isDefault" label="默认地址" width="100">
          <template #default="{ row }">
            <span v-if="row.isDefault" class="text-primary">默认</span>
            <span v-else class="text-slate-500">-</span>
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
      <div class="pagination-bar">
        <div class="flex items-center gap-2">
          <span class="text-slate-500">每页显示</span>
          <el-select v-model="pageSize" style="width: 100px" @change="currentPage = 1; fetchList()">
            <el-option label="10条" :value="10" />
            <el-option label="20条" :value="20" />
            <el-option label="50条" :value="50" />
            <el-option label="100条" :value="100" />
          </el-select>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :small="true"
          class="[&_.el-pagination__editor]:hidden"
          @current-change="fetchList"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑收件信息' : '新增收件信息'" width="500px" destroy-on-close @close="resetForm">
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
        <el-button type="primary" @click="submitForm" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  searchReceiveAddresses,
  createReceiveAddress,
  updateReceiveAddress,
  deleteReceiveAddress,
} from '@/api/receiveAddresses'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

function mapItem(row) {
  return {
    ...row,
    recipient: row.name ?? row.recipient,
    contact: row.phone ?? row.contact,
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchReceiveAddresses({ page: currentPage.value, size: pageSize.value })
    const raw = res && typeof res === 'object' ? res : {}
    const items = Array.isArray(raw.items) ? raw.items : []
    list.value = items.map(mapItem)
    total.value = Number(raw.total) >= 0 ? Number(raw.total) : 0
  } catch (e) {
    ElMessage.error(e?.message || '加载失败')
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchList())

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
  form.recipient = row.recipient ?? row.name ?? ''
  form.contact = row.contact ?? row.phone ?? ''
  form.address = row.address ?? ''
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

async function submitForm() {
  if (!(form.recipient != null && String(form.recipient).trim())) {
    ElMessage.warning('请输入收件人')
    return
  }
  if (!(form.contact != null && String(form.contact).trim())) {
    ElMessage.warning('请输入联系方式')
    return
  }
  if (!(form.address != null && String(form.address).trim())) {
    ElMessage.warning('请输入详细地址')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await updateReceiveAddress({
        id: editingId.value,
        recipient: form.recipient,
        contact: form.contact,
        address: form.address,
        isDefault: form.isDefault,
      })
      const idx = list.value.findIndex((a) => a.id === editingId.value)
      if (idx !== -1) {
        list.value[idx] = mapItem({
          ...list.value[idx],
          name: form.recipient,
          phone: form.contact,
          address: form.address,
          isDefault: form.isDefault,
        })
      }
    } else {
      await createReceiveAddress({
        recipient: form.recipient,
        contact: form.contact,
        address: form.address,
        isDefault: form.isDefault,
      })
    }
    await fetchList()
    ElMessage.success('保存成功')
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  const id = typeof row === 'object' ? row.id : row
  try {
    await ElMessageBox.confirm('确定删除该收件信息吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      appendTo: document.body,
      customClass: 'oms-message-box',
    })
    await deleteReceiveAddress(id)
    await fetchList()
    ElMessage.success('删除成功')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}
</script>
