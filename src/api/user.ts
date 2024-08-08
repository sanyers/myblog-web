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
