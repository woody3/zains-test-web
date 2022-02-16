
const state = {
  version: '',
  website: '',
  defaultPassword: ''
}

const mutations = {
  SET_SYSTEM_PROPERTIES: (state, payload) => {
    state.version = payload.version || state.version
    state.website = payload.website || state.website
    state.defaultPassword = payload.defaultPassword || state.defaultPassword
  }
}

const actions = {
  // 加载系统属性
  loadSystemProperties({ commit }) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
    // return new Promise((resolve, reject) => {
    //   fetchSystemProperties().then(response => {
    //     commit('SET_SYSTEM_PROPERTIES', response.data)
    //     resolve(response.data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
