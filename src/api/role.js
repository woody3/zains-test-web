import axios from '@/utils/request'

export function fetchList(query) {
  return axios.post('/roles/search', query)
}

export function updateRole(data) {
  return axios.post(`/roles`, data)
}

export function deleteRole(roleId) {
  return axios.delete(`/roles/${roleId}`)
}

export function fetchUsersByRole(roleId) {
  return axios.get(`/roles/${roleId}/users`)
}

export function fetchPermissions() {
  return axios.get('/permissions')
}

export function fetchPermissionsByRole(roleId) {
  return axios.get(`/permissions/${roleId}`)
}
