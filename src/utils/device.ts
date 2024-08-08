import { LOGIN_CONF } from '@/config'

export const getLanguage = () => {
  const local = localStorage.getItem(LOGIN_CONF.LANGUAGE)
  const language = (navigator.language || 'zh').toLowerCase().split('-')[0]
  const lang = local || language
  return lang
}

export const setLanguage = (lang?: string) => {
  if (!lang) {
    const lg = getLanguage()
    lang = lg === 'zh' ? 'en' : 'zh'
  }
  localStorage.setItem(LOGIN_CONF.LANGUAGE, lang)
  location.reload()
}

export const getTheme = () => localStorage.getItem(LOGIN_CONF.THEME)

export const setTheme = (theme?: string) => {
  if (!theme) {
    const t = getTheme()
    theme = t ? '' : 'dark'
  }
  localStorage.setItem(LOGIN_CONF.THEME, theme)
  location.reload()
}
