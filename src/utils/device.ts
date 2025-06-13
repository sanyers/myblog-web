import { LOGIN_CONF } from '@/config'

export const getLanguage = () => {
  const local = localStorage.getItem(LOGIN_CONF.LANGUAGE)
  const lang = local || navigator.language
  return lang
}

export const setLanguage = (lang?: string) => {
  if (!lang) {
    const lg = getLanguage()
    lang = lg === 'zh-CN' ? 'en-US' : 'zh-CN'
  }
  localStorage.setItem(LOGIN_CONF.LANGUAGE, lang)
  location.reload()
}

export const getTheme = () => localStorage.getItem(LOGIN_CONF.THEME) || 'dark'

export const setTheme = (theme?: string) => {
  if (!theme) {
    const t = getTheme()
    if (t === 'dark') {
      theme = 'bright'
    } else {
      theme = 'dark'
    }
  }
  localStorage.setItem(LOGIN_CONF.THEME, theme)
  location.reload()
}

export const isMobile = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    )
  ) {
    return true // 移动端
  } else {
    return false // PC端
  }
}
