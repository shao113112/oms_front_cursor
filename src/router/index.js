import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/auth/AuthPage.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardPage.vue'),
      },
      {
        path: 'container-orders',
        name: 'ContainerOrders',
        component: () => import('@/views/container-orders/ContainerOrdersPage.vue'),
      },
      {
        path: 'container-orders/create',
        name: 'ContainerOrderCreate',
        component: () => import('@/views/container-orders/ContainerOrderCreatePage.vue'),
      },
      {
        path: 'container-orders/:id',
        name: 'ContainerOrderDetail',
        component: () => import('@/views/container-orders/ContainerOrderDetailPage.vue'),
      },
      {
        path: 'line-orders',
        name: 'LineOrders',
        component: () => import('@/views/line-orders/LineOrdersPage.vue'),
      },
      {
        path: 'line-orders/create',
        name: 'LineOrderCreate',
        component: () => import('@/views/line-orders/LineOrderCreatePage.vue'),
      },
      {
        path: 'line-orders/:id',
        name: 'LineOrderDetail',
        component: () => import('@/views/line-orders/LineOrderDetailPage.vue'),
      },
      {
        path: 'logistics-products',
        name: 'LogisticsProducts',
        component: () => import('@/views/logistics-products/LogisticsProductsPage.vue'),
      },
      {
        path: 'pickup-addresses',
        name: 'PickupAddresses',
        component: () => import('@/views/pickup-addresses/PickupAddressesPage.vue'),
      },
      {
        path: 'shipping-addresses',
        name: 'ShippingAddresses',
        component: () => import('@/views/shipping-addresses/ShippingAddressesPage.vue'),
      },
      {
        path: 'pricing-rules',
        name: 'PricingRules',
        component: () => import('@/views/pricing-rules/PricingRulesPage.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UsersPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Mock 登录态：未登录跳转 /auth
router.beforeEach((to, _from, next) => {
  const hasAuth = !!localStorage.getItem('oms_token')
  if (to.meta.requiresAuth && !hasAuth) {
    next({ path: '/auth', query: { redirect: to.fullPath } })
  } else if (to.path === '/auth' && hasAuth) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
