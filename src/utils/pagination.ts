import { h } from 'vue'
import i18n from '../i18n'

const { t } = i18n.global
const span = (value: any, props: any = null) => {
  return h('span', props, value)
}

export const pagination = (pageSize?: number) => ({
  page: 1,
  pageCount: 0,
  pageSize: pageSize || 20,
  itemCount: 0,
  pageSizes: [
    { label: `10 / 页`, value: 10 },
    { label: `20 / 页`, value: 20 },
    { label: `50 / 页`, value: 50 },
  ],
  showSizePicker: true,
  prefix(info: any) {
    const leftTxt = span('共') // 共
    const centerTxt = span(info.itemCount, { style: 'margin:0 6px;' })
    const rightTxt = span('条') // 条
    return span([leftTxt, centerTxt, rightTxt])
  },
  next() {
    return '下一页' // 下一页
  },
  prev() {
    return '上一页' // 上一页
  },
})
