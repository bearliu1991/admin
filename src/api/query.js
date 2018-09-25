/**
 * Created by workpc on 18/1/29.
 */

import api from './index'
const apiHost = process.env.API_ROOT
// 预览上传的fastfds服务的文件
// const preview_file = process.env.FILESERVER_ROOT 
// 上传名片
export const uploadPostcard = (params) => api.get(apiHost + '/uploadpostcard', params)
// 下载名片
export const downloadPostcard = (params) => {
    let downLoadUrl = "/downloadpostcard" + '?' + params.fileName + "=" + params.filePath
    window.location.href = downLoadUrl
}
// 获得sessionId
export const getSessionId = () => api.get(apiHost + '/getSessionId')
// 生成二维码
export const getTmpQrcode = (params) => api.get(apiHost + '/api/adminUser/getTmpQrcode', params)
// 获取用户信息,企业信息等
export const getSession = () => api.get(apiHost + '/api/adminUser/getSession')
// 获取默认免费信息 套餐id 套餐角色id 官方appid对应的accountid
export const getDefaultInfo = () => api.get(apiHost + '/api/adminUser/getDefaultInfo')
// 生成验证码
export const resendCode = (params) => api.get(apiHost + '/api/adminUser/resendCode', params)
// 加载系统配置内容树
export const loadTConfigListTree = (params) => api.get(apiHost + '/api/adminUser/loadTConfigListTree', params)
// 加载系统配置内容树
export const queryTItemValueByPager = (params) => api.get(apiHost + '/api/adminUser/queryTItemValueByPager', params)
// 保存创建公司申请
export const saveCorpCreateApply = (params) => api.get(apiHost + '/api/adminUser/saveCorpCreateApply', params)
// 获取当前用户创建或加入（中） 与 审核通过的 公司列表
export const getUserCorpAuthMulti = (params) => api.get(apiHost + '/api/adminCenter/getUserCorpAuthMulti', params)
// 修改企业名称
export const updateCorpName = (params) => api.get(apiHost + '/api/adminCenter/updateCorpName', params)
// 个人信息修改
export const editUser = (params) => api.get(apiHost + '/api/adminCenter/editUser', params)
// 离开公司
export const savelogoutCompany = (params) => api.get(apiHost + '/api/adminCenter/savelogoutCompany', params)
// 新建企业检查
export const checkCreateCorpApply = () => api.get(apiHost + '/api/adminCenter/checkCreateCorpApply')
// 退出
export const logout = () => api.get(apiHost + '/api/adminCenter/logout')
// 修改绑定手机号,同时校验验证码
export const updateCorpMobileById = (params) => api.get(apiHost + '/api/adminCenter/updateCorpMobileById', params)
// 扫描二维码后,查看扫描结果
export const getScanResult = (params) => api.get(apiHost + '/api/adminCenter/getScanResult', params)
// 获取个人信息
export const getPersonalInfo = () => api.get(apiHost + '/api/adminCenter/getPersonalInfo')
// 获得关键指标
export const getKeyIndicators = (params) => api.get(apiHost + '/api/survey/getKeyIndicators', params)
// 进入公司信息
export const saveloginCompany = (params) => api.get(apiHost + '/api/survey/saveloginCompany', params)
// 获取公司统计信息
export const getCorpStatisticsInfo = (params) => api.get(apiHost + '/api/survey/getCorpStatisticsInfo', params)
// 根据id查询公司套餐
export const queryCorpPackageById = (params) => api.get(apiHost + '/api/survey/queryCorpPackageById', params)
// 查看授权状态
export const updateBindCorp = (params) => api.get(apiHost + '/api/survey/updateBindCorp', params)
// 获取公众号列表
export const getPublicAccountList = () => api.get(apiHost + '/api/tencent/getPublicAccountList')
// 判断是否可以添加公众号
export const checkAppIdNum = () => api.get(apiHost + '/api/tencent/checkAppIdNum')
// 删除微信公众号
export const updateCssWxPublicAccountStatusToDelete = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountStatusToDelete', params)
// 操作解除授权按钮停用微信公众号
export const updateCssWxPublicAccountToAuthBlockUp = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToAuthBlockUp', params)
// 操作停用按钮停用微信公众号
export const updateCssWxPublicAccountToBlockUp = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToBlockUp', params)
// 禁用微信公众号
export const updateCssWxPublicAccountToDisabled = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToDisabled', params)
// 启用微信公众号
export const updateCssWxPublicAccountToActive = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountToActive', params)
// 公众号信息一键同步
export const updateCssWxPublicAccountDataToDb = (params) => api.get(apiHost + '/api/tencent/updateCssWxPublicAccountDataToDb', params)
// 停用某用户
export const stopUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 启用某用户
export const startUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 删除用户
export const delUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 修改某用户
export const modifyUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 将某用户置顶
export const setTopUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 解绑用户
export const unbindUser = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 用来生成第三方授权url
export const getAuthUrl = (params) => api.get(apiHost + '/api/survey/getAuthUrl', params)
// 获取坐席列表
export const getIntoSeatList = (params) => api.get(apiHost + '/api/seats/getIntoSeatList', params)
// 点击添加坐席生成坐席编号
export const saveSeatNo = (params) => api.get(apiHost + '/api/seats/saveSeatNo', params)
// 保存坐席接口
export const saveSeat = (params) => api.get(apiHost + '/api/seats/saveSeat', params)
// 修改坐席接口
export const updateSeat = (params) => api.get(apiHost + '/api/seats/updateSeat', params)
// 获取坐席详情接口
export const getSeatDetail = (params) => api.get(apiHost + '/api/seats/getSeatDetail', params)
// 查询坐席列表接口
export const getSeatList = (params) => api.get(apiHost + '/api/seats/getSeatList', params)
// 批量为坐席修改公众号权限
export const updateSeatAuthByBatch = (params) => api.get(apiHost + '/api/seats/updateSeatAuthByBatch', params)
// 解除授权/停用/批量停用/启用统一调用接口
export const updateSeatStatus = (params) => api.get(apiHost + '/api/seats/updateSeatStatus', params)
// 查询公司套餐的权限列表
export const queryCorpPackRoleList = (params) => api.get(apiHost + '/api/survey/queryCorpPackRoleList', params)
// 修改坐席基本信息接口
export const updateSeatBaseInfo = (params) => api.get(apiHost + '/api/seats/updateSeatBaseInfo', params)
// 修改坐席权限接口
export const updateSeatAuth = (params) => api.get(apiHost + '/api/seats/updateSeatAuth', params)
// 修改个性化坐席接口
export const updateConditionalSeat = (params) => api.get(apiHost + '/api/seats/updateConditionalSeat', params)