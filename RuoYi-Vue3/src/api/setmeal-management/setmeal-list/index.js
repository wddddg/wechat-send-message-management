import request from '@/utils/request'

// 登录方法
export function getList(data) {
  return request({
    url: '/setmeal/list',
    method: 'get',
    params: data
  })
}