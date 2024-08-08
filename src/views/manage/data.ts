import { h } from 'vue'

export function renderIcon(icon: string) {
  return () => h('span', { className: 'iconfont ' + icon }, '')
}

export const navList = () => [
  {
    label: '首页',
    key: 'manage',
    icon: renderIcon('icon-shouye'),
  },
  {
    label: '分类管理',
    key: 'category-page',
    icon: renderIcon('icon-fenlei'),
  },
  {
    label: '博客管理',
    key: 'blog-page',
    icon: renderIcon('icon-blog'),
  },
  {
    label: '评论管理',
    key: 'comment-page',
    icon: renderIcon('icon-pinglun'),
  },
]
