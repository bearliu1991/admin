import Path from './path'
import orderPath from './flyPath'
import Vue from 'vue'
import Api from './index'

export default function () {
  Vue.prototype.Path = Path
  Vue.prototype.fylPath = orderPath
  Vue.prototype.$get = function(url, args) {
    return Api.$get(url, args)
  }
  Vue.prototype.$post = function(url, args) {
    return Api.$post(url, args)
  }
  // 获取树结构
  Vue.prototype.getTree = function () {
    return Api.get(Path.getTree)
  }
  // 获取员工数据
  Vue.prototype.getStuff = function (args) {
    return Api.get(Path.getUsers, args)
  }
  // 获取坐席列表
  Vue.prototype.zuoxiList = function (args) {
    return Api.get(Path.zuoxiList, args)
  }
  // 获取坐席和员工状态列表
  Vue.prototype.searchOption = function (args) {
    return Api.get(Path.searchOption, args)
  }
  // 创建部门
  Vue.prototype.creatApart = function (args) {
    return Api.get(Path.creatApart, args)
  }
  // 删除部门
  Vue.prototype.delApart = function (args) {
    return Api.get(Path.delApart, args)
  }
  // 修改部门
  Vue.prototype.modifyApart = function (args) {
    return Api.get(Path.modifyApart, args)
  }
  // 添加员工
  Vue.prototype.addUser = function (args) {
    return Api.get(Path.addUser, args)
  }
  // 修改员工
  Vue.prototype.modifyUserDetail = function (args) {
    return Api.get(Path.modifyUserDetail, args)
  }
  Vue.prototype.modifyUserRole = function (args) {
    return Api.get(Path.modifyUserRole, args)
  }
  Vue.prototype.userRightsList = function (args) {
    return Api.get(Path.userRightsList, args)
  }
  Vue.prototype.userDetail = function (args) {
    return Api.get(Path.userDetail, args)
  }
  Vue.prototype.setUserZuoxi = function (args) {
    return Api.get(Path.setUserZuoxi, args)
  }
  Vue.prototype.addRights = function (args) {
    return Api.get(Path.addRights, args)
  }
  Vue.prototype.updateRole = function (args) {
    return Api.get(Path.updateRole, args)
  }
  Vue.prototype.addMultiRights = function (args) {
    return Api.get(Path.addMultiRights, args)
  }
  Vue.prototype.createCompany = function (args) {
    return Api.get(Path.createCompany, args)
  }
  Vue.prototype.formWecode = function (args) {
    return Api.get(Path.formWecode, args)
  }
  Vue.prototype.enterCompany = function (args) {
    return Api.get(Path.enterCompany, args)
  }
  Vue.prototype.addApart = function (args) {
    return Api.get(Path.addApart, args)
  }
  Vue.prototype.getRightsList = function (args) {
    return Api.get(Path.getRightsList, args)
  }
  Vue.prototype.isAddUserAvail = function (args) {
    return Api.get(Path.isAddUserAvail, args)
  }
  // 启用员工
  Vue.prototype.startUser = function (args) {
    return Api.get(Path.processUser, args)
  }
  // 停用员工
  Vue.prototype.stopUser = function (args) {
    return Api.get(Path.processUser, args)
  }
  // 删除员工
  Vue.prototype.delUser = function (args) {
    return Api.get(Path.processUser, args)
  }
  // 置顶员工
  Vue.prototype.setTopUser = function (args) {
    return Api.get(Path.setTopUser, args)
  }
  // 取消置顶员工
  Vue.prototype.cancelTopUser = function (args) {
    return Api.get(Path.cancelTopUser, args)
  }
  // 解绑员工
  Vue.prototype.unbindUser = function (args) {
    return Api.get(Path.unbindUser, args)
  }

  /*
    订单相关
  */
  // 获取转化时间格式的时间列表
  Vue.prototype.ajaxDateList = function (args) {
    return Api.get(Path.dateList, args)
  }
  // 获取套餐列表
  Vue.prototype.ajaxMenuList = function (args) {
    return Api.get(Path.menuList, args)
  }
  // 获取订单列表
  Vue.prototype.ajaxRecordsList = function (args) {
    return Api.get(Path.recordsList, args)
  }
  // 获取订单状态列表
  Vue.prototype.ajaxOrderStatus = function (args) {
    return Api.get(Path.orderStatus, args)
  }
  // 获取订单详情
  Vue.prototype.ajaxOrderDetail = function (args) {
    return Api.get(Path.orderDetail, args)
  }
  // 获取正在使用的套餐
  Vue.prototype.ajaxUsingMenu = function (args) {
    return Api.get(Path.usingMenu, args)
  }
  // 取消订单
  Vue.prototype.ajaxUsingMenu = function (args) {
    return Api.get(Path.usingMenu, args)
  }
}
