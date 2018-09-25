import componentModules from '@/assets/utils/components'
import Request from '../../api/request'
import * as Cookies from '../../common/js/cookies'
import * as Utils from '../../common/js/util'
export default {
  install(Vue, options) {
    Request()
    Vue.prototype.deepCopy = function (data) {
      return JSON.parse(JSON.stringify(data))
    }
    Vue.prototype.bodyClick = function (data) {
      return document.body.click()
    }
    // 设置cookie
    Vue.prototype.setCookie = function (cname, cvalue, exdays) {
      let d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
      let expires = "expires=" + d.toUTCString()
      document.cookie = cname + "=" + cvalue + "; " + expires + ';'
    }
    Vue.prototype.getCookie = function (cname) {
      let name = cname + "="
      let ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
      }
      return ""
    }
    Vue.prototype.removeCookie = function (name) {
      this.$cookies.remove(name)
    }
    Vue.prototype.openMessage = (arg, fn) => {
      let html = ''
      if (!arg.bool) {
        html = '<span style="color: #C44DDC">' + arg.str + '</span>'
      } else {
        html = '<i style="color: red">' + arg.str + '</i>'
      }
      arg.ele.$alert(html, arg.title, {
        dangerouslyUseHTMLString: true,
        showClose: false,
        callback: () => {
          if (fn) fn()
        }
      })
    }
    Vue.prototype.addUploadUrl = (url, arr) => {
      let _arr = []
      arr.forEach((item, index) => {
        _arr.push(url + item)
      })
      return _arr
    }
    Vue.prototype.dedupe = function (array) {
      return Array.from(new Set(array))
    }
    Vue.prototype.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]'
    }
    // 全局监听click事件，用于全局点击的时候隐藏内容
    Vue.prototype.globalClick = function (callback) {
      document.getElementById('app').onclick = function () {
        callback()
      }
    }
    Vue.directive('focus', {
      // 当绑定元素插入到 DOM 中。
      inserted: function (el) {
        // 聚焦元素
        el.focus()
      }
      // 也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
      // 有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
      // update: function (el) {
      // el.focus()
      // }
    })
    Vue.prototype._BUS = new Vue()
    Vue.prototype.format = function (millisecond, fmt) {
      millisecond = (millisecond + '0000').slice(0, 13)
    
      const time = new Date(parseInt(millisecond))
      const o = {
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
        'q+': Math.floor((time.getMonth() + 3) / 3),
        'S': time.getMilliseconds()
      }
    
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
    
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
    
      return fmt
    }
  
    Vue.prototype._computedTreeTotal = function (obj, rules, subobj, ruleSumItem) {
      const copyTarget = (obj, rules, subobj, ruleSumItem, arr, childflag, currflag) => {
        let temp = {}
        temp['flag'] = childflag || 'tree'
        let _arr = arr || []
        _arr.push(temp)
        _arr.forEach(item => {
          if (temp['flag'].includes(item.flag)) {
            item[ruleSumItem] += obj[rules[ruleSumItem]] || 0
          }
          if (currflag === item.flag) {
            for (let key in rules) {
              if (key !== ruleSumItem) {
                temp[key] = item[rules[key]]
              } else {
                temp[key] = 0
              }
            }
          }
        })
        for (let key in obj) {
          if (key === subobj && Array.isArray(obj[subobj])) {
            temp[key] = []
            obj[key].forEach((item, index) => {
              let childflag = temp.flag + "-" + index
              let currflag = temp.flag
              temp[key].push(copyTarget(item, rules, subobj, ruleSumItem, _arr, childflag, currflag))
            })
          } else {
            temp[key] = obj[key]
          }
        }
        return temp
      }
      return copyTarget(obj, rules, subobj, ruleSumItem)
    }
    for (let key in Cookies) {
      Vue.prototype[key] = Cookies[key]
    }
    for (let key in Utils) {
      Vue.prototype[key] = Utils[key]
    }
    // 将plugins下面所有的vue组件注册为全局组件
    for (let key in componentModules) {
      Vue.component(key, componentModules[key])
    }
  }
}
