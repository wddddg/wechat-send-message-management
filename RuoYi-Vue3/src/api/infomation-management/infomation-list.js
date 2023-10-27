import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/management/information/list',
    method: 'get',
    params: data
  })
}

export function updateInfomation(data) {
  return request({
    url: '/management/information/update',
    method: 'put',
    data
  })
}

export function deleteInfomation(ids) {
  return request({
    url: '/management/information/' + ids,
    method: 'delete'
  })
}
