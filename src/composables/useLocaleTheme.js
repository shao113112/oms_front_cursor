import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const STORAGE_LOCALE = 'oms-locale'
const STORAGE_THEME = 'oms-theme'

const locales = {
  'zh-cn': { locale: zhCn, dayjs: 'zh-cn', label: '简体中文' },
  en: { locale: en, dayjs: 'en', label: 'English' },
}

export function useLocaleThemeProvider() {
  const localeKey = ref(localStorage.getItem(STORAGE_LOCALE) || 'zh-cn')
  const theme = ref(localStorage.getItem(STORAGE_THEME) || 'light')

  const locale = computed(() => locales[localeKey.value]?.locale ?? zhCn)

  function setLocale(key) {
    if (!locales[key]) return
    localeKey.value = key
    localStorage.setItem(STORAGE_LOCALE, key)
    dayjs.locale(locales[key].dayjs)
  }

  function setTheme(value) {
    theme.value = value
    localStorage.setItem(STORAGE_THEME, value)
    document.documentElement.classList.toggle('dark', value === 'dark')
  }

  watch(theme, (val) => {
    document.documentElement.classList.toggle('dark', val === 'dark')
  }, { immediate: false })

  onMounted(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    dayjs.locale(locales[localeKey.value]?.dayjs ?? 'zh-cn')
  })

  provide('localeKey', localeKey)
  provide('setLocale', setLocale)
  provide('localeOptions', Object.entries(locales).map(([key, v]) => ({ key, label: v.label })))
  provide('theme', theme)
  provide('setTheme', setTheme)

  return { locale, localeKey, setLocale, theme, setTheme, localeOptions: Object.entries(locales).map(([key, v]) => ({ key, label: v.label })) }
}

export function useLocaleTheme() {
  return {
    localeKey: inject('localeKey', ref('zh-cn')),
    setLocale: inject('setLocale', () => {}),
    localeOptions: inject('localeOptions', []),
    theme: inject('theme', ref('light')),
    setTheme: inject('setTheme', () => {}),
  }
}
