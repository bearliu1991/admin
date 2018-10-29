import Vue from 'vue'
import iView from 'iview'
import router from './index'
import store from '@/store'

// import store from '@/store'
import { getToken, removeCookieSession, getCookie, removeCookie } from "@/utils/cookies"
Vue.use(iView)
// const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  let token = getToken()
  iView.LoadingBar.start()
  if (getCookie('saveStepsData') && getCookie('saveStepsData').name !== to.name) {
    removeCookie('saveStepsData')
    removeCookie('companyParams')
    removeCookie('orderId')
    removeCookie('corpId')
    removeCookie('orderPayPrice')
    removeCookie('isCreatCompany')
    removeCookie('corpName')
    removeCookie('nextOrderStep')
  }
  if (to.meta.requireAuth) {
    // if (token && getCookie("loginFlag") === 1) {
    if (token) {
      if (token.mobileStatus !== "BIND") {
        store.dispatch("user/setStep", 1)
        iView.Message.warning("您还没有绑定手机，请先绑定手机")
        next({ name: "register" })
        if (from.name === "register") {
          iView.LoadingBar.finish()
        }
      } else if (token.corpList.length === 0) {
        store.dispatch("user/setStep", 2)
        iView.Message.warning("您还没有绑定企业，请先绑定企业")
        next({ name: "register" })
        if (from.name === "register") {
          iView.LoadingBar.finish()
        }
      } else {
        next()
      }
    } else {
      removeCookieSession()
      next({ name: "login" })
    }
  } else {
    if (token) {
      if (!to.name) {
        next({
          name: 'home'
        })
      } else if (token.mobileStatus !== 'BIND') {
        if (to.name === 'login') {
          store.dispatch('user/setStep', 1)
          next({
            name: 'register'
          })
        } else if (to.name === 'register') {
          store.dispatch('user/setStep', 1)
          next()
        } else {
          next()
        }
      } else if (token.corpList.length === 0) {
        if (to.name === 'login') {
          store.dispatch('user/setStep', 2)
          next({
            name: 'register'
          })
        } else if (to.name === 'register') {
          store.dispatch('user/setStep', 2)
          next()
        } else {
          next()
        }
      } else if (to.name === 'login' || to.name === 'register') {
        next({
          name: 'home'
        })
      } else if (to.name) {
        next()
      } else {
        next({
          name: 'home'
        })
      }
    } else {
      removeCookieSession()
      if (to.name) {
        next()
      } else {
        next({
          name: 'home'
        })
      }
    }
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish()
})

// if (token) {
//   if (!to.name) {
//     next({name: 'home'})
//   } else if (token.mobileStatus !== 'BIND') {
//     console.log(to)
//     if (to.name === 'login') {
//       store.dispatch('user/setStep', 1)
//       next({name: 'register'})
//     } else if (to.name === 'register') {
//       store.dispatch('user/setStep', 1)
//       next()
//     } else {
//       next()
//     }
//   } else if (token.corpList === 0) {
//     if (to.name === 'login') {
//       store.dispatch('user/setStep', 2)
//       next({name: 'register'})
//     } else if (to.name === 'register') {
//       store.dispatch('user/setStep', 2)
//       next()
//     } else {
//       next()
//     }
//   } else if (to.name === 'login' || to.name === 'register') {
//     next({name: 'home'})
//   } else if (to.name) {
//     next()
//   } else {
//     next({name: 'home'})
//   }
// } else {
//   if (to.name) {
//     next()
//   } else {
//     next({name: 'home'})
//   }
// }
