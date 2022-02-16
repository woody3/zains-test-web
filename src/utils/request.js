import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// request拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前
    // 让每个请求携带自定义token
    if (store.getters.token) {
      config.headers['X-USER-TOKEN'] = store.getters.token
    }
    return config
  }, (error) => {
    // 请求错误
    console.log('interceptors.request 拦截到异常', error)
    Promise.reject(error)
  })

window.showDialog = true
// response拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  }, (error) => {
    const response = error.response
    if (response) {
      if (response.status === 403) {
        if (!window.showDialog) { return Promise.reject(error) }
        window.showDialog = false
        // 权限错误
        Message({
          message: (response.data ? response.data.message : response.data) || response.data || '权限不足',
          type: 'error',
          duration: 3 * 1000,
          onClose: (message) => {
            window.showDialog = true
          }
        })
      } else if (response.status === 401) {
        if (!window.showDialog) { return Promise.reject(error) }
        window.showDialog = false
        // 登录过期
        MessageBox.confirm((response.data ? response.data.message : response.data) || response.data || '你可能太长时间没有操作了, 出于安全考虑, 你需要重新登陆', '身份验证失败', {
          confirmButtonText: '重新登录',
          cancelButtonText: '留在此处',
          type: 'warning'
        }).then((value) => {
          if (value === 'cancel') { return false }
          store.dispatch('FedLogOut').then(() => {
            // 重新实例化vue-router对象 避免bug
            location.reload()
          })
        }).finally(() => {
          window.showDialog = true
        })
      } else {
        console.log('response异常', error.config.url, response.data)
      }
    } else {
      console.log('response异常', error)
    }
    return Promise.reject(error)
  })

export default axios
