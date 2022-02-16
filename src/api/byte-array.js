import axios from '@/utils/request'

export function fetchByteArray(id) {
  return axios.get(`/bytes/${id}`)
}
