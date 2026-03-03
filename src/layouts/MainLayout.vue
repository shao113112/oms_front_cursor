<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <header class="flex-shrink-0 bg-header text-white shadow-soft">
      <div class="max-w-full mx-auto px-4 h-14 flex items-center justify-between relative">
        <div class="flex items-center gap-6 shrink-0">
          <!-- Logo：浅蓝图标 + EpochV OMS -->
          <router-link to="/" class="flex items-center gap-2">
            <svg class="w-8 h-8 text-primary-light" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="font-semibold text-lg tracking-tight">EpochV OMS</span>
          </router-link>
          <button
            type="button"
            class="md:hidden p-2 rounded hover:bg-white/10"
            aria-label="打开菜单"
            @click="mobileMenuOpen = true"
          >
            <el-icon :size="24"><Menu /></el-icon>
          </button>
        </div>
        <nav class="hidden md:flex items-center justify-center gap-0.5 absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <router-link
              to="/"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="route.path === '/' ? 'bg-white/10 text-white' : ''"
            >
              <el-icon class="w-5 h-5 mb-0.5" :size="20"><Odometer /></el-icon>
              <span class="text-sm">仪表盘</span>
            </router-link>
            <router-link
              to="/line-orders"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="isActive('/line-orders') ? 'bg-white/10 text-white' : ''"
            >
              <el-icon class="w-5 h-5 mb-0.5" :size="20"><Document /></el-icon>
              <span class="text-sm">专线订单</span>
            </router-link>
            <router-link
              to="/container-orders"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="isActive('/container-orders') ? 'bg-white/10 text-white' : ''"
            >
              <el-icon class="w-5 h-5 mb-0.5" :size="20"><Box /></el-icon>
              <span class="text-sm">整柜订单</span>
            </router-link>
            <el-dropdown ref="settingDropdownRef" trigger="click" class="ml-0.5" @command="goToSetting">
              <span
                class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] cursor-pointer hover:bg-white/10 text-white"
                :class="isActive('/users') || isActive('/logistics-products') || isActive('/pricing-rules') || isActive('/shipping-addresses') || isActive('/pickup-addresses') ? 'bg-white/10' : ''"
              >
                <el-icon class="w-5 h-5 mb-0.5 shrink-0" :size="20"><Setting /></el-icon>
                <span class="text-sm inline-flex items-center gap-0.5">系统设置 <el-icon :size="14" class="inline opacity-90"><CaretBottom /></el-icon></span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in settingMenuItems"
                    :key="item.path"
                    :command="item.path"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </nav>
        <div class="flex items-center gap-2 md:gap-3 shrink-0">
          <!-- 主题 -->
          <el-dropdown trigger="click" @command="setTheme">
            <button type="button" class="p-2 rounded hover:bg-white/10 text-white/95 flex items-center gap-1 text-sm" aria-label="切换主题">
              <el-icon :size="18"><Sunny v-if="theme === 'light'" /><Moon v-else /></el-icon>
              <span class="hidden sm:inline">{{ themeLabel }}</span>
              <el-icon :size="14"><CaretBottom /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="light" :class="{ 'is-active': theme === 'light' }">浅色</el-dropdown-item>
                <el-dropdown-item command="dark" :class="{ 'is-active': theme === 'dark' }">深色</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 当前用户：仅展示 name，点击下拉：修改密码、退出 -->
          <el-dropdown v-if="currentUser" trigger="click" @command="onUserCommand">
            <span class="text-sm text-white/95 cursor-pointer flex items-center gap-0.5 hover:bg-white/10 rounded px-2 py-1">
              {{ currentUser.name || '用户' }}
              <el-icon :size="14"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 移动端抽屉菜单（与顶栏一致：仅 4 项 + 系统设置子项） -->
    <el-drawer v-model="mobileMenuOpen" direction="ltr" size="280px" title="菜单" append-to-body>
      <nav class="flex flex-col gap-1 px-2">
        <router-link to="/" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">
          <el-icon class="w-5 h-5 text-slate-500" :size="20"><Odometer /></el-icon>
          仪表盘
        </router-link>
        <router-link to="/line-orders" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">
          <el-icon class="w-5 h-5 text-slate-500 shrink-0" :size="20"><Document /></el-icon>
          专线订单
        </router-link>
        <router-link to="/container-orders" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">
          <el-icon class="w-5 h-5 text-slate-500 shrink-0" :size="20"><Box /></el-icon>
          整柜订单
        </router-link>
        <div class="border-t pt-2 mt-2">
          <p class="px-3 py-1 text-sm text-slate-500">系统设置</p>
          <router-link to="/pickup-addresses" class="block px-3 py-2.5 rounded-lg hover:bg-slate-100" @click="mobileMenuOpen = false">提货地址</router-link>
          <router-link to="/shipping-addresses" class="block px-3 py-2.5 rounded-lg hover:bg-slate-100" @click="mobileMenuOpen = false">收件信息</router-link>
          <router-link to="/logistics-products" class="block px-3 py-2.5 rounded-lg hover:bg-slate-100" @click="mobileMenuOpen = false">物流产品</router-link>
          <router-link to="/pricing-rules" class="block px-3 py-2.5 rounded-lg hover:bg-slate-100" @click="mobileMenuOpen = false">定价规则</router-link>
          <router-link to="/users" class="block px-3 py-2.5 rounded-lg hover:bg-slate-100" @click="mobileMenuOpen = false">用户管理</router-link>
        </div>
      </nav>
    </el-drawer>

    <main class="flex-1 p-4 md:p-6 main-content">
      <router-view />
    </main>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="400px" :close-on-click-modal="false" @close="resetPwdForm">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="原密码" prop="pwd">
          <el-input v-model="pwdForm.pwd" type="password" show-password placeholder="请输入原密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" type="password" show-password placeholder="请输入新密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPwdConfirm">
          <el-input v-model="pwdForm.newPwdConfirm" type="password" show-password placeholder="请再次输入新密码" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdSubmitting" @click="submitUpdatePwd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCurrentUser, logout as apiLogout } from '@/api/auth'
import { updatePwd as apiUpdatePwd } from '@/api/users'
import { useLocaleTheme } from '@/composables/useLocaleTheme'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const settingDropdownRef = ref(null)
const currentUser = ref(getCurrentUser())

const pwdDialogVisible = ref(false)
const pwdFormRef = ref(null)
const pwdSubmitting = ref(false)
const pwdForm = ref({ pwd: '', newPwd: '', newPwdConfirm: '' })
const validateConfirm = (_rule, value, callback) => {
  if (value !== pwdForm.value.newPwd) callback(new Error('两次输入的新密码不一致'))
  else callback()
}
const pwdRules = {
  pwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  newPwdConfirm: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

const { theme, setTheme } = useLocaleTheme()
const themeLabel = computed(() => ((theme?.value ?? theme) === 'dark' ? '深色' : '浅色'))

const settingMenuItems = [
  { path: '/users', label: '用户管理' },
  { path: '/logistics-products', label: '物流产品' },
  { path: '/pricing-rules', label: '通用报价' },
  { path: '/shipping-addresses', label: '收件信息' },
  { path: '/pickup-addresses', label: '提货地址' },
]

watch(() => route.path, () => {
  currentUser.value = getCurrentUser()
}, { immediate: true })

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function onUserCommand(command) {
  if (command === 'changePwd') pwdDialogVisible.value = true
  else if (command === 'logout') handleLogout()
}

function resetPwdForm() {
  pwdForm.value = { pwd: '', newPwd: '', newPwdConfirm: '' }
  pwdFormRef.value?.clearValidate()
}

async function submitUpdatePwd() {
  const valid = await pwdFormRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  const { pwd, newPwd } = pwdForm.value
  const id = currentUser.value?.id
  if (!id) {
    ElMessage.error('无法获取当前用户，请重新登录')
    return
  }
  pwdSubmitting.value = true
  try {
    await apiUpdatePwd({ id, pwd, newPwd })
    ElMessage.success('密码修改成功')
    pwdDialogVisible.value = false
    resetPwdForm()
  } catch (e) {
    ElMessage.error(e?.response?.data?.message ?? e?.message ?? '修改失败')
  } finally {
    pwdSubmitting.value = false
  }
}

async function handleLogout() {
  await apiLogout()
  currentUser.value = null
  router.push('/auth')
}
function goToSetting(path) {
  if (path) router.push(path)
  settingDropdownRef.value?.handleClose?.()
}
</script>
