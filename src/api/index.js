import axios from 'axios'
import store from '@/store'
import {
  getCookieSession,
  setCookieSession
} from '@/assets/js/cookies'

const service = axios.create({
  withCredentials: true, // 允许携带cookie
  baseURL: process.env.API_ROOT
})

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios(url, params) {
  if (params) {
    params = filterNull(params)
  } else {
    params = {}
  }
  let obj = {}
  let sessionId = getCookieSession()
  let timestamp = new Date()
  if (sessionId) {
    obj.sessionId = sessionId
    setCookieSession(sessionId, 0.041)
  }
  obj.timestamp = timestamp.getTime()
  let paramsData = Object.assign({}, params, obj)
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: paramsData
    }).then(function (res) {
      resolve(res.data)
    }).catch(function (err) {
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}



// respone interceptor
// axios.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  // error => {
  //   console.log('err' + error) // for debug
  //   this.$Message.info('This is a info tip')
  //   return Promise.reject(error)
  // })

service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  })

// respone interceptor
service.interceptors.response.use(
  response => {
    let message = response.data
    if (message.code === 200 && message.message === 'Session不存在或已失效') {
      store.dispatch('user/setMessage', 2)
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })

export default {
  get: function (url, params) {
    return apiAxios(url, params)
  }
}
