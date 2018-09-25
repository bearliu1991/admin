const state = {
  // 公司套餐信息
  corpPackageData: {},
  // 获取公司统计信息
  corpInfoData: {
    loadingDataStatu: 1
  },
  // 进入公司信息
  loginCompanyData: {},
  // 关键指标
  keyIndicatorsData: {
    loadingDataStatu: 1
  }
}
const getters = {
  getCorpPackage: state => state.corpPackageData,
  getCorpInfo: state => state.corpInfoData,
  getLoginCompany: state => state.loginCompanyData,
  getKeyIndicators: state => state.keyIndicatorsData
}
const mutations = {
  SET_CORPPACKAGE(state, corpPackageData) {
    state.corpPackageData = corpPackageData
  },
  SET_CORPINFO(state, corpInfoData) {
    state.corpInfoData = corpInfoData
  },
  SET_LOGINCOMPANY(state, loginCompanyData) {
    state.loginCompanyData = loginCompanyData
  },
  SET_KEYINDICATORS(state, keyIndicatorsData) {
    state.keyIndicatorsData = keyIndicatorsData
  }
}
const actions = {
  // 用户名登录
  setCorpPackage({commit}, corpPackageData) {
    commit('SET_CORPPACKAGE', corpPackageData)
  },
  setCorpInfo({commit}, corpInfoData) {
    commit('SET_CORPINFO', corpInfoData)
  },
  setLoginCompany({commit}, loginCompanyData) {
    commit('SET_LOGINCOMPANY', loginCompanyData)
  },
  setKeyIndicators({commit}, keyIndicatorsData) {
    commit('SET_KEYINDICATORS', keyIndicatorsData)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}