import {
  getToken
} from '@/assets/js/cookies'

const state = {
  token: getToken(),
  // session失效
  message: 1,
  test: 1
}
const getters = {
  getToken: state => state.token,
  getMessage: state => state.message,
  getTest: state => state.test
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_MESSAGE(state, message) {
    state.message = message
  },
  STE_TEST(state, test) {
    state.test++
    console.log(state.test)
  }
}
const actions = {
  // 用户名登录
  setMessage({
    commit
  }, message) {
    commit('SET_MESSAGE', message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
