import { axios } from './http'

// 查询博客评论
export const getComment = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/comment',
    params,
  })
}

// 博客评论
export const commentUpdate = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment',
    data,
  })
}

// 审核评论
export const commentVerify = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment/verify',
    data,
  })
}

// 删除评论
export const commentDelete = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/comment/delete',
    data,
  })
}
