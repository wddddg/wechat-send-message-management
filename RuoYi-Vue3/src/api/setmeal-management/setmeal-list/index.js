import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/management/setmeal/list',
    method: 'get',
    params: data
  })
}

export function addSetmeal(data) {
  return request({
    url: '/management/setmeal/add',
    method: 'post',
    data
  })
}

export function updateSetmeal(data) {
  return request({
    url: '/management/setmeal/update',
    method: 'put',
    data
  })
}

export function deleteSetmeal(ids) {
  return request({
    url: '/management/setmeal/' + ids,
    method: 'delete'
  })
}
