const state = {
  collapsed: true,
  routerInfo: {}
}
const getters = {
  getCollapsed: state => state.collapsed,
  getRouterInfo: state => state.routerInfo
}
const mutations = {
  SET_COLLAPSED(state, collapsed) {
    state.collapsed = collapsed
  },
  SET_ROUTERINFO(state, routerInfo) {
    state.routerInfo = routerInfo
  }
}
const actions = {
  // 用户名登录
  setCollapsed({commit}, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  },
  setRouterInfo({commit}, routerInfo) {
    commit('SET_ROUTERINFO', routerInfo)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
