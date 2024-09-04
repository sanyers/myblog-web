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
  isShow: boolean
}
