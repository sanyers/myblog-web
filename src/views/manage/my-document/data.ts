import { h } from 'vue'
import MoreButton from '@/components/more-button.vue'
import { renderIcon } from '@/utils/render'
import { BlogItem } from '@/utils/types'
import { NTag } from 'naive-ui'

export const optionList = {
  query: {
    label: '查看',
    key: 'query',
    icon: renderIcon('icon-query'),
  },
  edit: {
    label: '编辑',
    key: 'edit',
    icon: renderIcon('icon-bianji'),
  },
  top: {
    label: '置顶',
    key: 'top',
    icon: renderIcon('icon-top'),
  },
  untop: {
    label: '取消置顶',
    key: 'untop',
    icon: renderIcon('icon-untop'),
  },
  release: {
    label: '发布',
    key: 'release',
    icon: renderIcon('icon-fabu'),
  },
  unrelease: {
    label: '取消发布',
    key: 'unrelease',
    icon: renderIcon('icon-unrelease'),
  },
  ctime: {
    label: '修改创建时间',
    key: 'ctime',
    icon: renderIcon('icon-edit-time'),
  },
  types: {
    label: '修改栏目',
    key: 'types',
    icon: renderIcon('icon-edit-menu'),
  },
  delete: {
    label: '删除',
    key: 'delete',
    icon: renderIcon('icon-shanchu'),
  },
}

export const getBlogData = (getTypes: Function, operateSelect: Function) => ({
  columns: [
    { title: '标题', key: 'name' },
    {
      title: '所属栏目',
      key: 'types',
      render(row: BlogItem) {
        const { name1, name2 } = getTypes(row.type1, row.type2)
        const tag1 = h(NTag, null, { default: () => name1 })
        const tag2 = h(NTag, null, { default: () => name2 })
        return h('div', { className: 'types-item' }, [tag1, tag2])
      },
    },
    {
      title: '置顶',
      key: 'isTop',
      render(row: BlogItem) {
        const txt = row.isTop ? '已置顶' : '-'
        return h('span', null, txt)
      },
    },
    {
      title: '发布状态',
      key: 'release',
      render(row: BlogItem) {
        const txt = row.release ? '已发布' : '-'
        return h('span', null, txt)
      },
    },
    {
      title: '创建时间',
      key: 'ctime',
      width: 200,
      render(row: BlogItem) {
        const time = new Date(row.ctime).toLocaleString()
        return h('span', null, time)
      },
    },
    {
      title: '更新时间',
      key: 'utime',
      width: 200,
      render(row: BlogItem) {
        const time = new Date(row.utime).toLocaleString()
        return h('span', null, time)
      },
    },
    {
      title: '操作',
      key: 'operation',
      render(row: BlogItem) {
        const options = []
        if (row.release) {
          options.push(optionList.query)
        }
        options.push(optionList.edit)
        options.push(row.isTop ? optionList.untop : optionList.top)
        options.push(row.release ? optionList.unrelease : optionList.release)
        options.push(optionList.ctime, optionList.types, optionList.delete)
        return h(MoreButton, {
          options,
          handleSelect: (key: string) => operateSelect(key, row),
        })
      },
    },
  ],
  rowKey: (row: BlogItem) => row._id,
  list: [] as Array<BlogItem>,
})
