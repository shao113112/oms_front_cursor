<template>
  <div class="page-wrap">
    <div class="page-title-row">
      <div>
        <h1 class="page-title">用户权限管理</h1>
        <p class="page-subtitle">管理系统用户及其角色权限</p>
      </div>
    </div>
    <div class="space-y-6">
      <div v-if="isMainUser" class="flex flex-wrap items-center gap-2">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户邮箱或姓名..."
          class="max-w-md"
          clearable
          @keyup.enter="search"
        />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" plain @click="openCreateDialog">添加子用户</el-button>
      </div>

      <div v-if="isMainUser" class="page-card page-card-padding-tight flex flex-wrap items-center gap-3">
        <span class="text-sm text-slate-600">为用户分配角色</span>
        <el-select v-model="assignUser" placeholder="选择用户" clearable style="width: 180px">
          <el-option v-for="u in assignUserOptions" :key="u.id" :label="(u.name || u.username) + ' (' + u.email + ')'" :value="u.id" />
        </el-select>
        <el-select v-model="assignRole" placeholder="选择角色" clearable style="width: 140px">
          <el-option v-for="r in rolesList" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
        <el-button type="primary" size="small">添加角色</el-button>
      </div>
    </div>

    <div class="table-card">
      <div class="responsive-table-container">
        <el-table :data="list" stripe v-loading="loading" style="width: 100%" class="mobile-table-dense mobile-action-buttons">
          <el-table-column prop="name" label="用户名" min-width="80">
            <template #default="{ row }">{{ row.name || row.username || '-' }}</template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="company" label="公司" min-width="100">
            <template #default="{ row }">{{ row.company || '-' }}</template>
          </el-table-column>
          <el-table-column label="角色" width="100">
            <template #default>{{ '-' }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间" width="160">
            <template #default="{ row }">{{ formatDate(row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default>
              <el-button type="primary" link size="small">切换账号</el-button>
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

    <el-dialog v-model="createDialogVisible" title="添加子用户" width="440px" :close-on-click-modal="false" @close="resetCreateForm">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="createForm.pwd" type="password" show-password placeholder="请输入密码" autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="createForm.company" disabled placeholder="继承主账号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="createSubmitting" @click="submitCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCurrentUser } from '@/api/auth'
import { searchUsers, listUsers, createUser as apiCreateUser } from '@/api/users'
import { rolesList } from '@/mock/users'

const currentUser = ref(getCurrentUser())
const isMainUser = computed(() => {
  const u = currentUser.value
  if (!u || u.id == null) return false
  const mainId = u.mainId ?? u.id
  return Number(mainId) === Number(u.id)
})

const list = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const assignUser = ref('')
const assignRole = ref('')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const assignUserOptions = ref([])

const createDialogVisible = ref(false)
const createFormRef = ref(null)
const createSubmitting = ref(false)
const createForm = ref({ email: '', name: '', pwd: '', company: '' })
const createRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function formatDate(v) {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false })
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchUsers({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value?.trim() || undefined,
    })
    list.value = res.items ?? []
    total.value = res.total ?? 0
  } catch (e) {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function search() {
  currentPage.value = 1
  fetchList()
}

function openCreateDialog() {
  currentUser.value = getCurrentUser()
  createForm.value = {
    email: '',
    name: '',
    pwd: '',
    company: currentUser.value?.company ?? '',
  }
  createDialogVisible.value = true
}

function resetCreateForm() {
  createForm.value = { email: '', name: '', pwd: '', company: '' }
  createFormRef.value?.clearValidate()
}

async function submitCreate() {
  const valid = await createFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  const u = currentUser.value
  const mainId = u?.mainId ?? u?.id
  if (mainId == null) {
    ElMessage.error('无法获取主账号信息，请重新登录')
    return
  }
  createSubmitting.value = true
  try {
    await apiCreateUser({
      email: createForm.value.email.trim(),
      name: createForm.value.name.trim(),
      pwd: createForm.value.pwd,
      company: createForm.value.company ?? u?.company ?? '',
      mainId: Number(mainId),
    })
    ElMessage.success('添加成功')
    createDialogVisible.value = false
    resetCreateForm()
    fetchList()
    assignUserOptions.value = await listUsers().catch(() => assignUserOptions.value)
  } catch (e) {
    ElMessage.error(e?.response?.data?.message ?? e?.message ?? '添加失败')
  } finally {
    createSubmitting.value = false
  }
}

onMounted(async () => {
  currentUser.value = getCurrentUser()
  await fetchList()
  try {
    assignUserOptions.value = await listUsers()
    if (!Array.isArray(assignUserOptions.value)) assignUserOptions.value = []
  } catch {
    assignUserOptions.value = []
  }
})
</script>
