import { axios } from './http'

// 获取系统信息
export const getSystem = () => {
  return axios.request({
    method: 'get',
    url: '/system',
  })
}

// 重启系统
export const setSystemRestart = () => {
  return axios.request({
    method: 'post',
    url: '/system/restart',
  })
}
