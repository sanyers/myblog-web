import { axios } from './http'

// 根据ID获取博客
export const getBlogbyId = () => {
  return axios.request({
    method: 'get',
    url: '/blog',
  })
}

// 搜索博客
export const getBlogSearch = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/blog/search',
    params,
  })
}

// 按类别查询博客列表
export const getBlogList = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/blog/list',
    params,
  })
}

// 最近更新列表
export const getBlogLast = () => {
  return axios.request({
    method: 'get',
    url: '/blog/last',
  })
}

// 创建、更新博客
export const blogUpdate = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/blog',
    data,
  })
}

// 查询置顶博客
export const getBlogTop = () => {
  return axios.request({
    method: 'get',
    url: '/blog/top',
  })
}

// 置顶、取消置顶博客
export const blogTop = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/blog/top',
    data,
  })
}

// 删除博客
export const blogDelete = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/blog/delete',
    data,
  })
}

// 发布博客
export const blogRelease = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/blog/release',
    data,
  })
}
