import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // login({ commit }, userInfo) {
    // const { email, password } = userInfo
  login({ commit },userInfo) {
    const { data, params } = userInfo
    return new Promise((resolve, reject) => {
      login(data,params).then(response => {
        // const data = response    // 返回字典{users：{},token: }
        const { data } = response   //{message: "成功", data: { token:}}
        console.log("拿到token")
        commit('SET_TOKEN', data.token)
        // commit('SET_TOKEN', data['token'])      
        setToken(data.token)    // 在auth.js封装了setToken，登录成功后将token存储在cookie之中
        // setToken(data['token'])
        console.log("成功把token放到cookie中")
        resolve()     // token有效期是Session，就是当浏览器关闭了就丢失了
      }).catch(error => {
        console.log("登录失败");        
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
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
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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

