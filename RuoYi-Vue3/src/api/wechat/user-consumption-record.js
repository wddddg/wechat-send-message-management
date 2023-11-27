import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/management/wechat-user/consumption-record',
    method: 'get',
    params: data
  })
}
