import { axios } from './http'

// 获取类别
export const categoryList = () => {
  return axios.request({
    method: 'get',
    url: '/category',
  })
}

// 创建类别
export const categoryCreate = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/category',
    data,
  })
}

// 更新类别
export const categoryUpdate = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/category/update',
    data,
  })
}

// 删除类别
export const categoryDelete = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/category/delete',
    data,
  })
}
