const uploadService = process.env.API_ROOT
const url = process.env.API_ROOT + '/api/stuff'
const urlOrder = process.env.API_ROOT + '/api/order'
export default {
  uploadfile: uploadService + "/uploadfile",
  downloadfile: uploadService + "/downloadfile",

  getTree: url + "/getTree", // 获取部门树
  creatApart: url + "/creatApart", // 创建部门
  delApart: url + "/delApart", // 删除部门
  getUsers: url + "/getUsers", // 获取部门下的员工（包括查询）
  modifyApart: url + "/modifyApart", // 修改部门
  addApart: url + "/addApart", // 修改部门
  addUser: url + "/addUser", //  添加员工
  setTopUser: url + "/setTopUser", // 置顶用户
  cancelTopUser: url + "/cancelTopUser", // 取消置顶用户
  searchOption: url + "/searchOption", // 查询列表内容
  moveApart: url + "/moveApart", // 移动部门

  formWecode: url + "/formWecode", // 生成邀请二维码
  unbindUser: url + "/unbindUser",
  isAddUserAvail: url + "/isAddUserAvail", // 查询是否可以添加员工
  processUser: url + "/processUser", // 批量停用启用删除员工
  modifyUserDetail: url + "/modifyUserDetail", // 修改员工详情
  modifyUserRole: url + "/modifyUserRole", // 修改员工角色
  userRightsList: url + "/userRightsList", // 员工权限列表
  userDetail: url + "/userDetail", // 查询员工详情
  setUserZuoxi: url + "/setUserZuoxi", // 员工分配坐席
  addRights: url + "/addRights", // 添加权限
  updateRole: url + "/updateRole", // 保存或更新角色
  addMultiRights: url + "/addMultiRights", // 根据角色添加多个权限
  createCompany: url + "/createCompany", // 创建公司
  enterCompany: url + "/enterCompany", // 进入公司
  getRightsList: url + "/getRightsList", // 查询公司套餐的权限列表
  zuoxiList: url + "/zuoxiList", // 获取坐席列表

  /**
    订单相关
   */
  dateList: urlOrder + "/dateList", // 时间列表相关
  menuList: urlOrder + "/menuList", // 套餐列表
  recordsList: urlOrder + "/recordsList", // 订单列表
  orderStatus: urlOrder + "/orderStatus", // 订单状态列表
  orderDetail: urlOrder + "/orderDetail", // 订单详情
  usingMenu: urlOrder + "/usingMenu" // 原订单
}
