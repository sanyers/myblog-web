// 单位换算
export const bytesToSize = (bytes: number, scale?: number) => {
  if (bytes === 0) return '0'
  if (bytes === -1) return ''
  const k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  const n = (bytes / Math.pow(k, i)).toFixed(scale ?? 2).split('.')
  let m = n[0]
  if (Number(n[1])) {
    m += '.' + n[1]
  }
  return m + ' ' + sizes[i]
}
