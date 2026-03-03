import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/main.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

dayjs.locale('zh-cn')

const app = createApp(App)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
