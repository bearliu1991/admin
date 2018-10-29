import axios from 'axios'
import store from '@/store'
import {
  getCookieSession,
  setCookieSession,
  getToken,
  setToken
} from '@/utils/cookies'
const apiHost = process.env.API_ROOT
const service = axios.create({
  withCredentials: false, // 允许携带cookie
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
function getData(url, paramsData) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: paramsData
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      console.log(err)
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
function getPostData(url, paramsData) {
  return new Promise((resolve, reject) => {
    service.post(url, paramsData).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      console.log(err)
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
function apiGetSessionId() {
  return new Promise((resolve, reject) => {
    service.get(apiHost + '/getSessionId').then((res) => {
      res.data.sessionId = res.data.sessionId + 'F'
      resolve(res.data)
    }).catch((err) => {
      let res = err.response
      if (res) {
        reject(err)
      }
    })
  })
}
// get 请求
function getApiAxios(url, params) {
  if (params) {
    params = filterNull(params)
  } else {
    params = {}
  }
  let obj = {}
  let sessionId = getCookieSession()
  let timestamp = new Date()
  obj.timestamp = timestamp.getTime()
  let token = getToken()
  if (token) {
    setToken(token, 0.5)
  }
  if (sessionId) {
    obj.sessionId = sessionId
    setCookieSession(sessionId, 0.5)
    let paramsData = Object.assign({}, params, obj)
    return getData(url, paramsData)
  } else {
    return apiGetSessionId().then(data => {
      if (data.sessionId) {
        setCookieSession(data.sessionId, 0.5)
        obj.sessionId = data.sessionId
        let paramsData = Object.assign({}, params, obj)
        return getData(url, paramsData)
      }
    })
  }
}
// post 请求
function postApiAxios(url, params) {
  if (params) {
    params = filterNull(params)
  } else {
    params = {}
  }
  let obj = {}
  let sessionId = getCookieSession()
  let token = getToken()
  if (token) {
    setToken(token, 0.5)
  }
  if (sessionId) {
    obj.sessionId = sessionId
    setCookieSession(sessionId, 0.5)
    let paramsData = Object.assign({}, params, obj)
    return getPostData(url, paramsData)
  } else {
    return apiGetSessionId().then(data => {
      setCookieSession(data.sessionId, 0.5)
      obj.sessionId = data.sessionId
      let paramsData = Object.assign({}, params, obj)
      console.log(paramsData)
      return getPostData(url, paramsData)
    })
  }
}

// function markLogin(res) {
//   if (res.config.url.includes('adminUser/getSession') && res.data.code === 1) {
//     setCookie("loginFlag", "1", 1 / 24 / 2)
//   } else if (res.data.code >= 200 && res.data.code <= 299) {
//     setCookie("loginFlag", "0")
//   }
// }

// function httpGet(url, args) {
//   return new Promise(function (resolve, reject) {
//     service.get(url, {
//       params: args
//     })
//       .then(function (r) {
//         resolve(r)
//       }).catch(function (err) {
//         reject(err)
//       })
//   })
// }
function httpPost(url, args) {
  return new Promise(function (resolve, reject) {
    service
      .post(url, args)
      .then(function (r) {
        resolve(r)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

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
    if (message.code >= 200 && message.code <= 299) {
      store.dispatch('user/setMessage', 2)
    } else if (message.code === 1) {
      store.dispatch('user/setMessage', 1)
    }
    // markLogin(response)
    return response
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })

export default {
  get: function(url, params) {
    return getApiAxios(url, params)
  },
  post: function(url, params) {
    return postApiAxios(url, params)
  },
  $get: function(url, params) {
    return getApiAxios(url, params)
  },
  $post: function (url, params) {
    return httpPost(url, params)
  }
}
