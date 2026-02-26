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
          <el-option v-for="u in usersList" :key="u.id" :label="u.username + ' (' + u.email + ')'" :value="u.id" />
        </el-select>
        <el-select v-model="assignRole" placeholder="选择角色" clearable style="width: 140px">
          <el-option v-for="r in rolesList" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
        <el-button type="primary" size="small">添加角色</el-button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 overflow-hidden">
      <div class="responsive-table-container">
        <el-table :data="filteredUsers" stripe class="mobile-table-dense mobile-action-buttons">
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="company" label="公司" width="100" />
          <el-table-column prop="role" label="角色" width="100" />
          <el-table-column prop="registerTime" label="注册时间" width="160" />
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
import { ref, computed } from 'vue'
import { usersList, rolesList } from '@/mock/users'

const searchKeyword = ref('')
const assignUser = ref('')
const assignRole = ref('')

const filteredUsers = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return usersList
  return usersList.filter((u) => u.email?.toLowerCase().includes(kw) || u.username?.toLowerCase().includes(kw))
})
</script>
