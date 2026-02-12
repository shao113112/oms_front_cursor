<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 tracking-tight">欢迎使用货代管理系统</h1>
    <p class="text-sm text-slate-500 mt-1 mb-6">管理您的专线订单和整柜订单</p>

    <!-- 4 个统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 transition-shadow hover:shadow-soft-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-slate-500">专线订单箱数</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">22</p>
            <p class="text-sm text-slate-500 mt-0.5">待收货订单</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-soft">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18z"/></svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 transition-shadow hover:shadow-soft-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-slate-500">整柜订单箱数</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">1</p>
            <p class="text-sm text-slate-500 mt-0.5">待处理订单</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-soft">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 transition-shadow hover:shadow-soft-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-slate-500">待处理订单</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">21</p>
            <p class="text-sm text-slate-500 mt-0.5">待处理订单</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-soft">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 transition-shadow hover:shadow-soft-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-slate-500">运输中</p>
            <p class="text-2xl font-bold text-slate-800 mt-1">0</p>
            <p class="text-sm text-slate-500 mt-0.5">正在运输的订单</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-soft">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L20.5 6 22 7.41l-9.5 9.5-4-4-6 6.01z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 2 个功能卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link
        to="/line-orders"
        class="block bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 hover:shadow-soft-lg hover:border-primary/20 transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">专线订单管理</h2>
            <p class="text-slate-600 mt-1">管理海运/空运散货订单</p>
            <p class="text-sm text-slate-500 mt-2">创建和管理专线订单，支持订单-箱-商品三级结构管理</p>
          </div>
        </div>
      </router-link>
      <router-link
        to="/container-orders"
        class="block bg-white rounded-2xl shadow-soft border border-slate-200/80 p-6 hover:shadow-soft-lg hover:border-amber-200 transition-all duration-200"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">整柜订单管理</h2>
            <p class="text-slate-600 mt-1">管理整柜订单</p>
            <p class="text-sm text-slate-500 mt-2">创建和管理整柜订单，跟踪订单状态</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
