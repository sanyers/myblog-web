type Options = {
  label: string
  key: string
  isActive: boolean
}
export type CategoryItem = {
  _id: string
  name: string
  desc: string
  ctime: number
  utime: number
  parentId?: string
  typeList?: CategoryItem[]
  typeOption?: Options[]
  isActive?: boolean
}
