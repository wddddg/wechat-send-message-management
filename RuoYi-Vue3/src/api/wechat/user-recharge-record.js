import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/management/wechat-user/recharge-record',
    method: 'get',
    params: data
  })
}
