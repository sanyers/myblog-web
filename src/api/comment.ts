import { axios } from './http'

// 查询博客评论
export const getComment = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/comment',
    params,
  })
}

// 查询博客评论（后台）
export const getComments = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/comments',
    params,
  })
}

// 博客评论（前台评论）
export const commentUpdate = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment',
    data,
  })
}

// 博客评论（后台回复）
export const commentUpdates = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comments',
    data,
  })
}

// 显示与隐藏评论（后台操作）
export const commentShow = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment/show',
    data,
  })
}

// 删除评论（后台操作）
export const commentDelete = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment/delete',
    data,
  })
}
