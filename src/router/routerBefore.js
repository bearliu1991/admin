import Vue from 'vue'
import iView from 'iview'
import router from './index'
// import store from '@/store'
import {
  getToken
} from '@/assets/js/cookies'
Vue.use(iView)
// const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  let token = getToken()
  iView.LoadingBar.start()
  if (to.meta.requireAuth) {
    if (token) {
      if (token.mobileStatus !== 'BIND') {
        next({
          name: 'register',
          params: {
            step: 1
          }
        })
      } else if (token.corpList === 0) {
        next({
          name: 'register',
          params: {
            step: 2
          }
        })
      } else {
        next()
      }
    } else {
      next({
        name: 'login'
      })
    }
  } else {
    if (token) {
      if (to.name) {
        next()
      } else {
        next({name: 'home'})
      }
    } else {
      if (to.name) {
        next()
      } else {
        next({name: 'home'})
      }
    }
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish()
})
