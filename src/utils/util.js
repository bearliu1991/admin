function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function isNumber(inputData) {
  if (parseFloat(inputData).toString() === "NaN") {
    return false
  } else {
    return true
  }
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}
export function DateDiff(sDate1) { // sDate1和sDate2是2002-12-18格式
  let sDate2 = Thistime()
  let aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为12-18-2002格式  
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数  
  return iDays
}

function Thistime() { // 当前日期
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let time = year + '-' + month + '-' + day
  return time
}

// 每隔三位小数加逗号
export function addComma(num) {
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

export function _transformData(obj, rules = {}, reverse, subobj) {
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
  return transform(obj, rules, subobj)
};

export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

export function divideGroup(arr, groupName) {
  let map = {}
  let dest = []
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i]
    if (!map[ai.groupName]) {
      dest.push({
        groupName: ai.groupName,
        data: [ai],
        roleId: [ai.roleId]
      })
      map[ai.groupName] = ai
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j]
        if (dj.groupName === ai.groupName) {
          dj.data.push(ai)
          dj.roleId.push(ai.roleId)
          break
        }
      }
    }
  }
  return dest
}
// 两个数组去重（1）
export function ArrDistinct(arr1, arr2) {
  let result = arr1.filter(function(item1) {
    return arr2.every(function(item2) {
        return item2.id !== item1.id
    })
  })
  return result
}

export function toFix(val, num) {
  let n = num === undefined ? 2 : num
  if (parseFloat(val).toString() === "NaN") {
    return '--'
  } else {
    return (parseInt(val * 100) / 100).toFixed(n)
  }
}

export function skipUrl(url) {
  let newLink = document.createElement('a')
  newLink.href = url
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    newLink.target = '_blank'
  } else {
    newLink.target = '_self'
  }
  document.body.appendChild(newLink)
  newLink.click()
  document.body.removeChild(newLink)
}