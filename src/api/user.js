import request from '@/utils/request'

export function login(data,params) {
  return request({
    // url: '/user/login',
    url: '/idm/auth/login/email',
    method: 'post',
    data,
    params,
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
