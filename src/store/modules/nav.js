const state = {
  collapsed: true,
  routerInfo: {},
  secondMenu: []
}
const getters = {
  getCollapsed: state => state.collapsed,
  getRouterInfo: state => state.routerInfo,
  getSecondMenu: state => state.secondMenu
}
const mutations = {
  SET_COLLAPSED(state, collapsed) {
    state.collapsed = collapsed
  },
  SET_ROUTERINFO(state, routerInfo) {
    state.routerInfo = routerInfo
  },
  SET_SECONDMENU(state, secondMenu) {
    state.secondMenu = secondMenu
  }
}
const actions = {
  // 用户名登录
  setCollapsed({commit}, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  },
  setRouterInfo({commit}, routerInfo) {
    commit('SET_ROUTERINFO', routerInfo)
  },
  setSecondMenu({commit}, secondMenu) {
    commit('SET_SECONDMENU', secondMenu)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
