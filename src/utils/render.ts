import { h } from 'vue'

export function renderIcon(icon: string, title?: string) {
  return () => h('span', { className: 'iconfont ' + icon, title }, '')
}
