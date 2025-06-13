import { h } from 'vue'

export function renderIcon(icon: string) {
  return () => h('span', { className: 'iconfont ' + icon }, '')
}

export const navList = (isAdmin: boolean) => [
  {
    label: '首页',
    key: 'manage',
    icon: renderIcon('icon-shouye'),
  },
  {
    label: '我的文档',
    key: 'my-document',
    icon: renderIcon('icon-blog'),
  },
  {
    label: '我的评论',
    key: 'my-comment',
    icon: renderIcon('icon-pinglun'),
  },
  ...(isAdmin
    ? [
        {
          label: '用户管理',
          key: 'user-manage',
          icon: renderIcon('icon-users'),
        },
        {
          label: '栏目管理',
          key: 'category-manage',
          icon: renderIcon('icon-fenlei'),
        },
        // {
        //   label: '文档管理',
        //   key: 'document-manage',
        //   icon: renderIcon('icon-doc'),
        // },
        // {
        //   label: '评论管理',
        //   key: 'comment-manage',
        //   icon: renderIcon('icon-chat'),
        // },
      ]
    : []),
]
