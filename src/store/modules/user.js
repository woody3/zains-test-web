import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import unknownHead from '@/assets/unknown-head.png'

const state = {
  token: getToken(),
  name: '',
  username: '',
  avatar: '',
  enabled: false,
  isAdmin: false,
  introduction: '',
  phone: '',
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
  },
  SET_INFO: (state, user) => {
    state.name = user.name || state.name
    state.username = user.username || state.username
    state.avatar = user.avatar || state.avatar || unknownHead
    state.enabled = user.enabled || state.enabled
    state.isAdmin = user.isAdmin || state.isAdmin
    state.introduction = user.introduction || state.introduction
    state.permissions = user.permissions || state.permissions
    state.phone = user.phone || state.phone
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // const res = await login({ username: username.trim(), password: password });
    // if (res.code === 200) {
    //   commit('SET_TOKEN', res.data.token)
    //   setToken(res.data.token)
    //   return 'ok'
    // } else {
    //   return Promise.reject(new Error('false'))
    // }
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { permissions } = data

        // permissions must be a non-empty array
        if (!permissions || permissions.length <= 0) {
          reject('getInfo: permissions must be a non-null array!')
        }

        commit('SET_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONS', [])
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_PERMISSIONS', [])
      resolve()
    })
  },

  // Dynamically modify permissions
  changePermissions({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)

      const { permissions } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on permissions
      const accessRoutes = await dispatch('permission/generateRoutes', permissions, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
