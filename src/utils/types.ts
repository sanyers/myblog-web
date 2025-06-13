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
  children?: Options[]
  isActive?: boolean
  label: string
  key: string
}

export type BlogItem = {
  _id: string
  name: string
  type1: string
  type2: string
  ctime: number
  utime: number
  isTop: boolean
  content: string
  author: string
  authorLink: string
  release: boolean
  format: string
  desc?: string
}

export type CommentItem = {
  id: number
  quoteId?: number
  userName: string
  email?: string
  blogId: string
  ctime: number
  desc: string
  isAuthor: boolean
}

export type CommentData = {
  _id: string
  blogId: string
  blogName: string
  comments: Array<CommentItem>
  author: string
  ctime: number
  utime: number
}
