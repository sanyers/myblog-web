import { getLanguage } from '@/utils/device'
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const i18n = createI18n({
  fallbackLocale: 'zh',
  globalInjection: true,
  legacy: false,
  locale: getLanguage(),
  messages: {
    zh,
    en,
  },
})

export default i18n
