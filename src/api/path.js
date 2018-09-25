const url = process.env.API_ROOT + '/api/stuff'
export default {
  getTree: url + '/getTree', // 获取部门树
  creatApart: url + "/creatApart", // 创建部门
  delApart: url + "/delApart", // 删除部门
  getUsers: url + "/getUsers", // 获取部门下的员工（包括查询）
  modifyApart: url + "/modifyApart", // 修改部门
  addApart: url + "/addApart", // 修改部门
  addUser: url + "/addUser", //  添加员工
  setTopUser: url + "/setTopUser", // 置顶用户
  cancelTopUser: url + "/cancelTopUser", // 取消置顶用户
  searchOption: url + "/searchOption", // 查询列表内容

  formWecode: url + "/formWecode", // 生成邀请二维码
  unbindUser: url + '/unbindUser',
  isAddUserAvail: url + "/isAddUserAvail", // 查询是否可以添加员工
  processUser: url + '/processUser', // 批量停用启用删除员工
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
  zuoxiList: url + "/zuoxiList" // 获取坐席列表
}
