import { h } from 'vue'
import MoreButton from '@/components/more-button.vue'
import { renderIcon } from '@/utils/render'
import { CommentData } from '@/utils/types'

export const optionList = {
  query: {
    label: '查看',
    key: 'query',
    icon: renderIcon('icon-query'),
  },
  delete: {
    label: '删除',
    key: 'delete',
    icon: renderIcon('icon-shanchu'),
  },
}

export const getCommentData = (operateSelect: Function) => ({
  columns: [
    { title: '标题', key: 'blogName' },
    {
      title: '创建时间',
      key: 'ctime',
      width: 200,
      render(row: CommentData) {
        const time = new Date(row.ctime).toLocaleString()
        return h('span', null, time)
      },
    },
    {
      title: '更新时间',
      key: 'utime',
      width: 200,
      render(row: CommentData) {
        const time = new Date(row.utime).toLocaleString()
        return h('span', null, time)
      },
    },
    {
      title: '操作',
      key: 'operation',
      render(row: CommentData) {
        const options = [optionList.query, optionList.delete]
        return h(MoreButton, {
          options,
          handleSelect: (key: string) => operateSelect(key, row),
        })
      },
    },
  ],
  rowKey: (row: CommentData) => row._id,
  list: [] as Array<CommentData>,
})
