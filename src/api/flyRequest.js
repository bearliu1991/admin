import Path from './flyPath'
import Vue from 'vue'
import Api from './index'

export default function () {
  Vue.prototype.getExistOrder = function (args) {
    return Api.get(Path.existOrder, args)
  }
  Vue.prototype.getCancelOrder = function (args) {
    return Api.get(Path.cancelOrder, args)
  }
}