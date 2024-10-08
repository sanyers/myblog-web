import { axios } from './http'

// 登录后台
export const userLogin = (data: any) => {
  return axios.request({
    method: 'post',
    url: '/user/login',
    data,
  })
}

// 退出登录
export const userLogout = () => {
  return axios.request({
    method: 'post',
    url: '/user/logout',
  })
}

// 获取登录信息
export const userInfo = () => {
  return axios.request({
    method: 'get',
    url: '/user/info',
  })
}
