import componentModules from '@/utils/components'
import Request from '@/api/request'
import flyRequest from '@/api/flyRequest'
import * as Cookies from '@/utils/cookies'
import * as Utils from '@/utils/util'
// import { Function } from 'core-js'
export default {
  install(Vue, options) {
    Request()
    flyRequest()
    Vue.prototype.constRedirectUrl = 'http://xingke100.com/authorization'
    Vue.prototype.qrcodeUrl = 'http://xk.xingke100.com/mobile/pay'
    Vue.prototype.getUploadUrl = 'http://fdfs.xingke100.com/'
    Vue.prototype.ltIE10 = function (data) {
      let ie = navigator.appVersion.match(/MSIE\s(.+?);/i) || [0, 100000]
      return (parseInt(ie[1]) < 10)
    }
    Vue.prototype.isIE = function () {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true
      } else {
        return false
      }
    }
    Vue.prototype.deepCopy = function (data) {
      return JSON.parse(JSON.stringify(data))
    }
    // 将分换算成元并保留两位小时
    Vue.prototype.insertPoint = function (str) {
      str = str.toString()
      let len = str.length - 2
      let newStr = str.substring(0, len) + '.' + str.substring(len, str.length)
      return newStr
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
    // 两个父子关系的数组去重
    Vue.prototype.ArrDistinct = function (arr1, arr2) {
      let result = arr1.filter(function (item1) {
        return arr2.every(function (item2) {
          return item2.id !== item1.id
        })
      })
      return result
    }
    // 数据转化
    Vue.prototype.transformData = function (obj, rules = {}, reverse, subobj) {
      // obj: 数据 object / array 类型
      // rules：需要将相关将属性转换的规则；{ 当前属性名：改变后属性名}
      // subobj： 树的子节点属性名
      // reverse: 翻转将属性转换的规则
      // 
      let reverseRules = {}
      if (reverse) {
        for (let key in rules) {
          reverseRules[rules[key]] = key
        }
        rules = reverseRules
      }
      const transform = function (obj, rules, subobj) {
        let temp = {}
        for (let key in rules) {
          if (key === subobj && obj[key]) {
            if (Array.isArray(obj[key])) {
              temp[rules[key]] = []
              obj[key].forEach(_item => {
                temp[rules[key]].push(transform(_item, rules, subobj))
              })
            } else {
              temp[rules[key]] = transform(obj[key], rules, subobj)
            }
          } else {
            temp[rules[key]] = obj[key]
          }
        }
        return temp
      }
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item, rules, subobj))
      }
      return transform(obj, rules, subobj)
    }
    // 每隔三位小数加逗号
    Vue.prototype.addComma = function (num) {
      num = (num || 0).toString()
      var result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      return result
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
    Vue.prototype._computedTreeTotal = function (obj, rules, subobj, ruleSumItem, expand) {
      // obj: 整个树
      // rules：需要将相关将属性转换的规则；{ 当前节点新增属性名：父节点属性名}
      // subobj： 树的子节点属性名
      // ruleSumItem: 树的累计属性名
      // add
      // 展开的深度
      let expandDeep = 3
      let currentDeep = 0
      const copyTarget = (obj, objIndex, rules, subobj, ruleSumItem, arr, childflag, currflag) => {
        // 判断展开
        if (currentDeep < expandDeep) obj.expand = true
        currentDeep++

        let temp = {}
        temp['flag'] = childflag || 'tree'

        let _arr = arr || []
        _arr.push(temp)
        _arr.forEach(item => {
          // 继承操作
          if (temp['flag'].includes(item.flag)) {
            item[ruleSumItem] === undefined && (item[ruleSumItem] = 0)
            item[ruleSumItem] += obj[rules[ruleSumItem]] || 0
          }
          // 统计计算
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
              temp[key].push(copyTarget(item, index, rules, subobj, ruleSumItem, _arr, childflag, currflag))
            })
          } else {
            temp[key] = obj[key]
          }
        }
        return temp
      }
      if (Array.isArray(obj)) {
        return obj.map((item, index) => copyTarget(item, index, rules, subobj, ruleSumItem))
      } else {
        return copyTarget(obj, 0, rules, subobj, ruleSumItem)
      }
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
