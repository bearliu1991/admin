const state = {
  corpkey: null, // 部门id
  fitlerOpt: null, // 筛选参数
  fitlerName: null, // 筛选姓名或手机
  addUserInfo: {}, // 添加员工信息(临时存储)
  addUserRights: [], // 添加员工权限
  currApart: null, // 被选中的部门
  selectRows: [], // 被选中的用户数组
  trees: [], // 树结构
  isPopTree: false, // 是否处于弹窗选择状态
  popCurApart: null, // 弹窗选择的部门
  curUser: null // 正在操作的员工
}
const getters = {
  getCorpkey: state => state.corpkey,
  getFitlerOpt: state => state.fitlerOpt,
  getFitlerName: state => state.fitlerName,
  getAddUserInfo: state => state.addUserInfo,
  getAddUserRights: state => state.addUserRights,
  getCurrApart: state => state.currApart,
  getSelectRows: state => state.selectRows,
  getTrees: state => state.trees,
  getIsPopTree: state => state.isPopTree,
  getPopApart: state => state.popCurApart,
  getCurUser: state => state.curUser
}
const mutations = {
  SET_CUR_USER(state, val) {
    state.curUser = val
  },
  SET_POP_APART(state, val) {
    state.popCurApart = val
  },
  SET_IS_POPTREE(state, val) {
    state.isPopTree = val
  },
  SET_TREE(state, val) {
    state.trees = val
  },
  SET_SELECT_ROWS(state, val) {
    state.selectRows = val
  },
  SET_CORP_KEY(state, val) {
    state.corpkey = val
  },
  SET_FILTE_OPT(state, val) {
    state.fitlerOpt = val
  },
  SET_FILTE_NAME(state, val) {
    state.fitlerName = val
  },
  SET_USER_INFO(state, val) {
    state.addUserInfo = val
  },
  SET_USER_RIGHTS(state, val) {
    state.addUserRights = val
  },
  SET_CUR_APART(state, val) {
    state.currApart = val
  }
}
const actions = {
  // 用户名登录
  setCollapsed({ commit }, collapsed) {
    commit('SET_COLLAPSED', collapsed)
  },
  setRouterInfo({ commit }, routerInfo) {
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
