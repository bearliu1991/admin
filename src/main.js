// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import utils from './assets/utils/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/assets/stylus/iview.less'
import '@/assets/stylus/index.styl'
import '@/assets/js/compatibility'
import strPro from '@/assets/js/methods'
import '@/router/routerBefore'
// import dataLoading from '@/components/dataLoading/dataLoading'
// import scrollBar from '@/components/scrollBar/scrollBar'
// import commonModal from '@/components/modal/modal'
// import TreeList from '@/components/treelist/treelist'
// Vue.component('commonModal', commonModal)
// Vue.component('dataLoading', dataLoading)
// Vue.component('scrollBar', scrollBar)
// Vue.component('TreeList', TreeList)

Vue.use(iView)
Vue.use(strPro)
Vue.use(utils)

Vue.config.productionTip = false
iView.Message.config({
  duration: 2
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data: {
    Bus: new Vue()
  }
})
