import axios from '@/utils/request'

export function login(data) {
  return axios.post('/login', data)
}

export function getInfo() {
  return axios.get('/users/current')
}

export function fetchList(query) {
  return axios.post('/users/search', query)
}

export function fetchUser(userId) {
  return axios.get(`/users/${userId}`)
}

export function updateUser(data) {
  return axios.post('/users', data)
}

export function deleteUser(userId) {
  return axios.delete(`/users/${userId}`)
}

export function logout() {
  return axios.post('/logout')
}

export function fetchUsers() {
  return axios.get('/users')
}

export function changePassword(data) {
  return axios.put('/users/change-password', data)
}

export function resetPassword(userId) {
  return axios.put(`/users/reset-password/${userId}`)
}

export function uploadWechatQrcode(data) {
  return axios.post('/users/upload-wechat-qrcode', data)
}

export function setting(data) {
  return axios.put('/users/setting', data)
}

