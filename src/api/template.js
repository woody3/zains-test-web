import axios from '@/utils/request'

export function fetchList(query) {
  return axios.post('/templates/search', query || {})
}

export function fetchTemplate(templateId) {
  return axios.get(`/templates/${templateId}`)
}

export function fetchTemplateContent(templateId) {
  return axios.get(`/templates/${templateId}/content`)
}

export function updateTemplate(data) {
  return axios.post('/templates', data)
}

export function deleteTemplate(templateId) {
  return axios.delete(`/templates/${templateId}`)
}
