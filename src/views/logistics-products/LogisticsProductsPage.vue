<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <h1 class="page-title">物流产品管理</h1>
      <el-button type="primary" @click="openDialog()">+ 添加产品</el-button>
    </div>

    <div class="table-card">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%" class="mobile-table-dense mobile-action-buttons">
        <el-table-column label="排序" width="80" align="center">
          <template #default>
            <span class="text-slate-400 cursor-pointer">↑</span>
            <span class="text-slate-400 cursor-pointer ml-1">↓</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" min-width="160" />
        <el-table-column prop="transportMethod" label="运输方式" min-width="100" />
        <el-table-column prop="cargoType" label="货物类型" min-width="100" />
        <el-table-column prop="remark" label="产品备注" min-width="100" />
        <el-table-column prop="enabledStatus" label="状态" width="80">
          <template #default="{ row }">
            <span :class="row.enabledStatus === 'AVAILABLE' ? 'text-green-600' : 'text-slate-500'">{{ row.enabledStatus === 'AVAILABLE' ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑产品' : '添加产品'" width="500px" destroy-on-close @close="resetForm">
      <el-form :model="form" label-width="100px">
        <el-form-item label="产品名称" required>
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="运输方式" required>
          <el-select v-model="form.transportMethod" placeholder="请选择" class="w-full">
            <el-option label="海运" value="海运" />
            <el-option label="空运" value="空运" />
          </el-select>
        </el-form-item>
        <el-form-item label="货物类型" required>
          <el-select v-model="form.cargoType" placeholder="请选择" class="w-full">
            <el-option label="普货" value="普货" />
            <el-option label="特货" value="特货" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品备注">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.enabledStatus" class="w-full">
            <el-option label="启用" value="AVAILABLE" />
            <el-option label="停用" value="UNAVAILABLE" />
          </el-select>
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
  searchLogisticsProducts,
  createLogisticsProduct,
  updateLogisticsProduct,
  deleteLogisticsProduct,
} from '@/api/logisticsProducts'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

function mapItem(row) {
  const enabledStatus = row.enabledStatus ?? (row.enabledStatusText?.includes('停用') ? 'UNAVAILABLE' : 'AVAILABLE')
  return {
    ...row,
    name: row.productName ?? row.name,
    remark: row.memo ?? row.remark ?? '',
    enabledStatus,
    createTime: row.createTime ? formatDate(row.createTime) : '',
  }
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false })
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchLogisticsProducts({ page: currentPage.value, size: pageSize.value })
    list.value = (res.items || []).map(mapItem)
    total.value = res.total ?? 0
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
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
  name: '',
  transportMethod: '',
  cargoType: '',
  remark: '',
  enabledStatus: 'AVAILABLE',
})

function openDialog(row) {
  editingId.value = row?.id ?? ''
  if (row) {
    form.name = row.name ?? row.productName ?? ''
    form.transportMethod = row.transportMethod ?? ''
    form.cargoType = row.cargoType ?? ''
    form.remark = row.remark ?? row.memo ?? ''
    form.enabledStatus = row.enabledStatus ?? 'AVAILABLE'
  }
  dialogVisible.value = true
}

function resetForm() {
  editingId.value = ''
  form.name = ''
  form.transportMethod = ''
  form.cargoType = ''
  form.remark = ''
  form.enabledStatus = 'AVAILABLE'
}

async function submitForm() {
  if (!(form.name != null && String(form.name).trim())) {
    ElMessage.warning('请输入产品名称')
    return
  }
  if (!(form.transportMethod != null && String(form.transportMethod).trim())) {
    ElMessage.warning('请选择运输方式')
    return
  }
  if (!(form.cargoType != null && String(form.cargoType).trim())) {
    ElMessage.warning('请选择货物类型')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await updateLogisticsProduct({
        id: editingId.value,
        name: form.name,
        transportMethod: form.transportMethod,
        cargoType: form.cargoType,
        remark: form.remark,
        enabledStatus: form.enabledStatus,
      })
    } else {
      await createLogisticsProduct({
        name: form.name,
        transportMethod: form.transportMethod,
        cargoType: form.cargoType,
        remark: form.remark,
        enabledStatus: form.enabledStatus,
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
  try {
    await ElMessageBox.confirm(`确定删除「${row.name ?? row.productName}」吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'oms-message-box',
      showClose: false,
    })
    await deleteLogisticsProduct(row.id)
    await fetchList()
    ElMessage.success('删除成功')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}
</script>
