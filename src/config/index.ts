// 本地存储前缀
export const STORAGE_PREFIX = 'MYBLOG_SYSTEM_'

// 登录key存储前缀
export const LOGIN_CONF = {
  KEY: STORAGE_PREFIX + 'LOGIN_USER_KEY',
  NAME: STORAGE_PREFIX + 'LOGIN_USER_NAME',
  LANGUAGE: STORAGE_PREFIX + 'LANGUAGE',
  THEME: STORAGE_PREFIX + 'THEME',
  role: STORAGE_PREFIX + 'role',
  user: STORAGE_PREFIX + 'user',
  email: STORAGE_PREFIX + 'email',
  formatEdit: STORAGE_PREFIX + 'formatEdit', // 编辑器默认格式
}
