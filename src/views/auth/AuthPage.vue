<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-header p-4">
    <div class="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/20 p-8">
      <!-- Logo -->
      <div class="flex justify-center mb-5">
        <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z"/>
          </svg>
        </div>
      </div>
      <h1 class="text-center text-2xl font-bold text-slate-800 tracking-tight">EpochV OMS</h1>
      <p class="text-center text-slate-500 text-sm mt-1.5">专业的物流订单管理平台</p>

      <!-- 登录/注册 切换 -->
      <div class="flex mt-6 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          :class="[
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === 'login'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          ]"
          @click="switchTab('login')"
        >
          登录
        </button>
        <button
          type="button"
          :class="[
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === 'register'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          ]"
          @click="switchTab('register')"
        >
          注册
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-show="activeTab === 'login'" class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="请输入邮箱"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('email') }"
          />
          <p v-if="hasError('email')" class="text-red-500 text-sm mt-1">{{ getError('email') }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">密码</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('password') }"
          />
          <p v-if="hasError('password')" class="text-red-500 text-sm mt-1">{{ getError('password') }}</p>
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200 shadow-soft hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登录中...
          </span>
          <span v-else>登录</span>
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-show="activeTab === 'register'" class="mt-6 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">姓名</label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="请输入姓名"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('name') }"
          />
          <p v-if="hasError('name')" class="text-red-500 text-sm mt-1">{{ getError('name') }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">公司名称</label>
          <input
            v-model="registerForm.company"
            type="text"
            placeholder="请输入公司名称"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('company') }"
          />
          <p v-if="hasError('company')" class="text-red-500 text-sm mt-1">{{ getError('company') }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('email') }"
          />
          <p v-if="hasError('email')" class="text-red-500 text-sm mt-1">{{ getError('email') }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">密码</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码(至少6位，包含字母和数字)"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
            :class="{ 'border-red-500 focus:ring-red-500/30': hasError('password') }"
          />
          <p v-if="hasError('password')" class="text-red-500 text-sm mt-1">{{ getError('password') }}</p>
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200 shadow-soft hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            注册中...
          </span>
          <span v-else>注册</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormValidation } from '@/composables/useFormValidation'

const router = useRouter()
const route = useRoute()
const activeTab = ref('login')

// 表单数据
const loginForm = reactive({
  email: 'opr@dotmatrix.com',
  password: 'operator',
})

const registerForm = reactive({
  name: '',
  company: '',
  email: '',
  password: '',
})

// 使用表单验证
const { 
  errors, 
  isSubmitting, 
  validateLoginForm, 
  validateRegisterForm, 
  getError, 
  hasError,
  clearErrors 
} = useFormValidation()

function handleLogin() {
  if (!validateLoginForm(loginForm)) return
  
  isSubmitting.value = true
  // 模拟API调用延迟
  setTimeout(() => {
    localStorage.setItem('oms_token', 'mock')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
    isSubmitting.value = false
  }, 800)
}

function handleRegister() {
  if (!validateRegisterForm(registerForm)) return
  
  isSubmitting.value = true
  // 模拟API调用延迟
  setTimeout(() => {
    localStorage.setItem('oms_token', 'mock')
    router.push(route.query.redirect || '/')
    isSubmitting.value = false
  }, 800)
}

// 切换tab时清除错误
function switchTab(tab) {
  activeTab.value = tab
  clearErrors()
}
</script>
