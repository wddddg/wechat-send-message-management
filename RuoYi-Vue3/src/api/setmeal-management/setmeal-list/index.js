import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/setmeal/list',
    method: 'get',
    params: data
  })
}

export function addSetmeal(data) {
  return request({
    url: '/setmeal/add',
    method: 'post',
    data
  })
}

export function updateSetmeal(data) {
  return request({
    url: '/setmeal/update',
    method: 'put',
    data
  })
}

export function deleteSetmeal(ids) {
  return request({
    url: '/setmeal/' + ids,
    method: 'delete'
  })
}
