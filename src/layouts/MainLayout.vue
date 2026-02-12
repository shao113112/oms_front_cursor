<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <header class="flex-shrink-0 bg-header text-white shadow-soft">
      <div class="max-w-full mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <!-- Logo：浅蓝图标 + EpochV OMS -->
          <router-link to="/" class="flex items-center gap-2 shrink-0">
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
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </button>
          <nav class="hidden md:flex items-center gap-0.5">
            <router-link
              to="/"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="route.path === '/' ? 'bg-white/10 text-white' : ''"
            >
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              <span class="text-sm">仪表盘</span>
            </router-link>
            <router-link
              to="/line-orders"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="isActive('/line-orders') ? 'bg-white/10 text-white' : ''"
            >
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span class="text-sm">专线订单</span>
            </router-link>
            <router-link
              to="/container-orders"
              class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] hover:bg-white/10"
              :class="isActive('/container-orders') ? 'bg-white/10 text-white' : ''"
            >
              <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span class="text-sm">整柜订单</span>
            </router-link>
            <el-dropdown trigger="click" class="ml-0.5" @command="handleSettingCommand">
              <span
                class="flex flex-col items-center justify-center px-4 py-2 rounded min-w-[4rem] cursor-pointer hover:bg-white/10"
              >
                <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="text-sm flex items-center gap-0.5">系统设置 <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg></span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="pickup-addresses">提货地址</el-dropdown-item>
                  <el-dropdown-item command="shipping-addresses">收件信息</el-dropdown-item>
                  <el-dropdown-item command="logistics-products">物流产品</el-dropdown-item>
                  <el-dropdown-item command="pricing-rules">定价规则</el-dropdown-item>
                  <el-dropdown-item command="users">用户管理</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">operator</span>
          <button type="button" class="text-sm flex items-center gap-1 hover:opacity-90" @click="logout">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            退出
          </button>
        </div>
      </div>
    </header>

    <!-- 移动端抽屉菜单（与顶栏一致：仅 4 项 + 系统设置子项） -->
    <el-drawer v-model="mobileMenuOpen" direction="ltr" size="280px" title="菜单" append-to-body>
      <nav class="flex flex-col gap-1 px-2">
        <router-link to="/" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          仪表盘
        </router-link>
        <router-link to="/line-orders" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">专线订单</router-link>
        <router-link to="/container-orders" class="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center gap-2" @click="mobileMenuOpen = false">整柜订单</router-link>
        <div class="border-t pt-2 mt-2">
          <p class="px-3 py-1 text-sm text-gray-500">系统设置</p>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function logout() {
  localStorage.removeItem('oms_token')
  router.push('/auth')
}
function handleSettingCommand(command) {
  router.push(`/${command}`)
}
</script>
