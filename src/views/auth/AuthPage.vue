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
          @click="activeTab = 'login'"
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
          @click="activeTab = 'register'"
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
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">密码</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200 shadow-soft hover:shadow-glow"
        >
          登录
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
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">公司名称</label>
          <input
            v-model="registerForm.company"
            type="text"
            placeholder="请输入公司名称"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">密码</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-3.5 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-shadow"
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200 shadow-soft hover:shadow-glow"
        >
          注册
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeTab = ref('login')

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

function handleLogin() {
  localStorage.setItem('oms_token', 'mock')
  const redirect = route.query.redirect || '/'
  router.push(redirect)
}

function handleRegister() {
  localStorage.setItem('oms_token', 'mock')
  router.push(route.query.redirect || '/')
}
</script>
