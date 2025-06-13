import { axios } from './http'

// 获取登录信息
export const userInfo = () => {
  return axios.request({
    method: 'get',
    url: '/user/info',
  })
}

// 初始化查询
export const userInit = () => {
  return axios.request({
    method: 'get',
    url: '/user/init',
  })
}

// 首次注册后台
export const setUserInit = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/init',
    data,
  })
}

// 添加后台用户（管理员）
export const addUser = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/add',
    data,
  })
}

// 修改账号权限（管理员）
export const setUserRole = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/role',
    data,
  })
}

// 登录后台
export const userLogin = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/login',
    data,
  })
}

// 退出系统
export const userLogout = () => {
  return axios.request({
    method: 'post',
    url: '/user/logout',
  })
}

// 重置当前账号密码
export const userResetpassword = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/resetpassword',
    data,
  })
}

// 重置账号密码（管理员）
export const userResetpasswords = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/resetpasswords',
    data,
  })
}

// 删除账号（管理员）
export const deleteUser = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/delete',
    data,
  })
}

// 获取用户列表（管理员）
export const getUserList = (params: any) => {
  return axios.request({
    method: 'get',
    url: '/user/list',
    params,
  })
}
