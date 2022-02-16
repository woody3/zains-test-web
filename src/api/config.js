import axios from '@/utils/request'

export function fetchConfigs() {
  return axios.get('/configs')
}

export function saveConfigs(data) {
  return axios.post('/configs', data)
}
