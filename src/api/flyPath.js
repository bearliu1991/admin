const apiHost = ''
export default {
  existOrder: apiHost + "/api/pay/getExistOrder",
  cancelOrder: apiHost + "/api/pay/getCancelOrder",
  // 修改公司logo
  updateCorpLogo: apiHost + "/api/set/updateCorpLogo",
  // 获取公司混合信息
  getCorpInfoMulti: apiHost + "/api/set/getCorpInfoMulti",
  // 查询公司，套餐，员工状态
  getCorpEmpPacStatus: apiHost + "/api/set/getCorpEmpPacStatus",
  // 修改公司省市区
  updateCorpAddress: apiHost + "/api/set/updateCorpAddress",
  // 修改管理员员工姓名
  updateAdminEmployeeName: apiHost + "/api/set/updateAdminEmployeeName",
  // 删除图片
  deleteuploadfile: apiHost + "/api/deleteuploadfile",
  // 上传图片
  upload: apiHost + "/api/upload",
  // 查看图片
  overview: apiHost + "/api/overview",
  queryTItemValueByPager: apiHost + "/api/survey/queryTItemValueByPager"
}
