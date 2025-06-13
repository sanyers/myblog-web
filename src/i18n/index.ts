import { getLanguage } from '@/utils/device'
import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

const i18n = createI18n({
  fallbackLocale: 'zh-CN',
  globalInjection: true,
  legacy: false,
  locale: getLanguage(),
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n
