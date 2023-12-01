import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/management/wechat-user/list',
    method: 'get',
    params: data
  })
}

export function updateWechatUser(data) {
  return request({
    url: '/management/wechat-user/update',
    method: 'put',
    data
  })
}
