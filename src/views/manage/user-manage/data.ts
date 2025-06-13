import { h } from 'vue'
import MoreButton from '@/components/more-button.vue'
import { renderIcon } from '@/utils/render'

export const getRoleOptions = () => [
  { label: '普通用户', value: 1 },
  { label: '管理员', value: 0 },
]

export type UserItem = {
  id: string // id
  userName: string // 账号
  ctime: number // 注册时间
  role: number // 权限 -1 普通用户，0 管理员
}

export const optionList = {
  setRole: {
    label: '配置权限',
    key: 'setRole',
    icon: renderIcon('icon-role'),
  },
  delete: {
    label: '删除',
    key: 'delete',
    icon: renderIcon('icon-shanchu'),
  },
  deletes: {
    label: '移除',
    key: 'deletes',
    icon: renderIcon('icon-shanchu'),
  },
}

export const getUserData = (
  pageType: number,
  userName: string,
  operateSelect: Function,
) => ({
  columns: [
    { title: '账号', key: 'userName' },
    {
      title: '启用状态',
      key: 'role',
      render(row: UserItem) {
        const txt = row.role >= 0 ? '已启用' : '未启用'
        return h('span', null, txt)
      },
    },
    {
      title: '注册时间',
      key: 'ctime',
      width: 200,
      render(row: UserItem) {
        const time = new Date(row.ctime * 1000).toLocaleString()
        return h('span', null, time)
      },
    },
    {
      title: '操作',
      key: 'operation',
      render(row: UserItem) {
        const options = []
        if (pageType === 0) {
          if (userName !== row.userName) {
            options.push(optionList.setRole, optionList.delete)
          }
        } else {
          if (userName !== row.userName) {
            options.push(optionList.deletes)
          }
        }

        if (options.length) {
          return h(MoreButton, {
            options,
            handleSelect: (key: string) => operateSelect(key, row),
          })
        } else {
          return h('span', null, '')
        }
      },
    },
  ],
  rowKey: (row: UserItem) => row.id,
  list: [] as Array<UserItem>,
})
