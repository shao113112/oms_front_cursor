<template>
  <div class="w-full min-w-0">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-800">用户权限管理</h1>
      <p class="text-sm text-gray-500 mt-1">管理系统用户及其角色权限</p>
    </div>
    <div class="space-y-6">
      <el-input v-model="searchKeyword" placeholder="搜索用户邮箱或姓名..." class="max-w-md" clearable />

      <div class="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl shadow-soft border border-slate-200/80">
        <span class="text-sm text-gray-600">为用户分配角色</span>
        <el-select v-model="assignUser" placeholder="选择用户" clearable style="width: 180px">
          <el-option v-for="u in list" :key="u.id" :label="(u.name || u.username) + ' (' + u.email + ')'" :value="u.id" />
        </el-select>
        <el-select v-model="assignRole" placeholder="选择角色" clearable style="width: 140px">
          <el-option v-for="r in rolesList" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
        <el-button type="primary" size="small">添加角色</el-button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden">
      <div class="responsive-table-container">
        <el-table :data="filteredUsers" stripe v-loading="loading" class="mobile-table-dense mobile-action-buttons">
          <el-table-column prop="name" label="用户名" width="120">
            <template #default="{ row }">{{ row.name || row.username || '-' }}</template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="company" label="公司" width="100">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { searchUsers } from '@/api/users'
import { rolesList } from '@/mock/users'

const list = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const assignUser = ref('')
const assignRole = ref('')

function formatDate(v) {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false })
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchUsers({ page: 1, size: 500 })
    list.value = res.items ?? []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return list.value
  return list.value.filter(
    (u) =>
      (u.email && u.email.toLowerCase().includes(kw)) ||
      (u.name && u.name.toLowerCase().includes(kw)) ||
      (u.username && String(u.username).toLowerCase().includes(kw))
  )
})

onMounted(() => fetchList())
</script>
