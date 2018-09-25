<template>
  <div id="tencentMange">
    <div class="title" v-show="noData">
      公众号列表
    </div>
    <div class="title" v-show="!noData">
      公众号管理
    </div>
    <data-loading :data-satau='loadingStatu'>
      <div class="noData-wrapper" v-show="noData">
        <div class="tips-wrapper">
          <div class="noImg">
            <img src="@/assets/images/admin/noTencent.png" alt="">
          </div>
          <div class="tip-1">
            您尚未添加任何公众号
          </div>
          <div class="tip-2">当前套餐版本最多支持{{corpInfoData.packAppidNum}}个公众号，如需更多服务请<span> 升级</span></div>
          <Button class="tip-3" type="primary" @click="addTencent">添加公众号</Button>
        </div>
        <div class="bottom-tip">
          <div class="explain">授权说明</div>
          <div>1、公众号分为四种类型：非认证订阅号、认证订阅号、非认证服务号、认证服务号;</div>
          <div>2、授权绑定公众号后，可在迎客通系统使用自定义菜单、自动回复、消息群发等功能;</div>
          <div>3、不同类型的公众号，接口权限不一样，在迎客通系统可使用的功能也不一样。认证服务号拥有最多的接口权限，迎客通系统相应的拥有最多的功能;</div>
          <div>4、一个微信公众号仅可绑定一个企业；绑定之后支持解除绑定。;</div>
          <div>5、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给迎客通;"</div>
        </div>
      </div>
      <div class="tencentManage-wrapper" v-show="!noData">
        <div class="table-wrapper">
          <div class="table-btn">
            <div class="left">
              <Button type="primary" @click="addTencent">添加公众号</Button>
            </div>
            <div class="right" @click="refreshPage">
              <Icon type="refresh" size="17"></Icon>
              刷新
            </div>
          </div>
          <div class="table-list">
            <Spin fix v-show="loadingImg">
              <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
              <div>loading</div>
            </Spin>
            <Table :row-class-name="rowClassName" :columns="columns7" :data="tencentListData"></Table>
          </div>
        </div>
      </div>
    </data-loading>
    
    <Modal v-model="modalSync" :styles="{top: '33%', marginTop: '-8%'}">
      <p slot="header">
        <span>一键同步</span>
      </p>
      <div class="modalSync">
        <p>温馨提示</p>
        <div>1、为了您更好的使用迎客通系统，一键同步将从微信平台同步以下数据信息至迎客通系统，以确保迎客通系统与微信系统一致。</div>
        <div>2、您可将以下信息取消勾选，取消勾选的模块数据将不做同步处理。</div>
        <div>3、数据信息越多，同步时间稍长，请您耐心等待。</div>
        <div class="radios">
          <div class="all-radio">
            <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <div class="single-radio">
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <Checkbox label="USER_INFO">
                <div class="check-right">
                  <div>粉丝信息</div>
                  <div class="tips">粉丝数量越多，同步时间越长</div>
                </div>
              </Checkbox>
              <Checkbox label="MENU"><span class="check-right">自定义菜单</span></Checkbox>
              <Checkbox label="TEMPLATE"><span class="check-right">模板消息</span></Checkbox>
              <Checkbox label="MEDIA"><span class="check-right">素材数据</span></Checkbox>
              <Checkbox label="AUTO_REPLY"><span class="check-right">自动回复</span></Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click.stop="okSync">确定</Button>
        <Button type="ghost" @click.stop="cancalokSync">取消</Button>
      </div>
    </Modal>
    <common-modal ref="addTencent" header="套餐不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
    <common-modal ref="relieve" header="解除授权" content="解除授权后该账号将无法使用在迎客通系统设置的所有功能，但数据会被妥善保存，再次重新授权后可继续使用。" @ok="relieve" ></common-modal>
    <common-modal ref="deleteTencent" header="删除公众号" content="您正在删除公众号，删除后需重新添加授权才能继续使用，确定要删除公众号吗？" @ok="deleteTencent" ></common-modal>
    <common-modal ref="blockUp" header="停用公众号" content="您正在停用公众号，停用后，该公众号的所有操作无法使用，确定停用吗？" @ok="blockUp" ></common-modal>
    <common-modal ref="forbidden" header="禁用提示" content="您的公众号已被禁用，无法操作，请联系客服人员。" ></common-modal>
  </div>
</template>
<script>
import { getToken, setCookie, getCookie } from '@/assets/js/cookies'
import { mapGetters } from 'vuex'
import { addComma } from '@/assets/js/util'
import {
  getPublicAccountList,
  checkAppIdNum,
  getAuthUrl,
  updateCssWxPublicAccountStatusToDelete,
  updateCssWxPublicAccountToAuthBlockUp,
  updateCssWxPublicAccountToBlockUp,
  updateCssWxPublicAccountToDisabled,
  updateCssWxPublicAccountToActive,
  updateCssWxPublicAccountDataToDb
} from '@/api/query'
export default {
  name: 'tencentMange',
  data() {
    return {
      loadingStatu: 1,
      closeLoop: true,
      timer: null,
      noData: false,
      modalSync: false,
      isAddTencent: false,
      content: '',
      tencentListData: [],
      userInfo: getToken() || null,
      thirdplatUrl: '',
      checkAll: false,
      loadingImg: true,
      loadingCount: 0,
      checkAllGroup: [],
      appAccountId: '',
      appId: '',
      data6: [
        {
          principalName: '啦啦啦',
          serviceTypeInfo: 0,
          verifyTypeInfo: -1,
          privilegedTime: '2018-09-08 12:00:00',
          privilegedEeName: 'lalala',
          lockInTime: '2018-09-08 12:00:00',
          userCount: 200254256,
          status: 0
        }
      ],
      columns7: [
        {
          title: '公众号名称',
          key: 'principalName',
          width: 180,
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                }
              },
              [
                h('img', {
                  class: {
                    inbl: true
                  },
                  attrs: {
                    src: params.row.headImg
                  }
                }),
                h(
                  'div',
                  {
                    class: {
                      inbl: true
                    },
                    attrs: {
                      title: params.row.principalName
                    }
                  },
                  params.row.principalName
                )
              ]
            )
          }
        },
        {
          title: '账号类型',
          key: 'serviceTypeInfo',
          render: (h, params) => {
            return h(
              'div',
              params.row.serviceTypeInfo === 2 ? '服务号' : '订阅号'
            )
          }
        },
        {
          title: '认证状态',
          key: 'verifyTypeInfo',
          render: (h, params) => {
            return h(
              'div',
              params.row.verifyTypeInfo === 0 ? '已认证' : '未认证'
            )
          }
        },
        {
          title: '授权时间',
          key: 'privilegedTime',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.privilegedTime
                }
              },
              params.row.privilegedTime.substring(0, 16)
            )
          }
        },
        {
          title: '授权员工',
          key: 'privilegedEeName'
        },
        {
          title: '最近同步时间',
          key: 'lockInTime',
          render: (h, params) => {
            return h('div', params.row.lockInTime.substring(0, 16))
          }
        },
        {
          title: '用户数',
          key: 'userCount',
          render: (h, params) => {
            return h('div', addComma(params.row.userCount))
          }
        },
        {
          title: '公众号状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                }
              },
              params.row.status === 0
                ? '禁用'
                : params.row.status === 1
                  ? '正常'
                  : params.row.status === 2 ? '停用' : '未授权'
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  class: {
                    isHideAction: !(
                      params.row.lockInStatus !== 0 && params.row.status === 1
                    )
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'ansy',
                        params.row.status,
                        params.row.appAccountId
                      )
                    }
                  }
                },
                '一键同步'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: true
                  },
                  class: {
                    isHideAction: !(
                      params.row.lockInStatus === 0 && params.row.status === 1
                    )
                  },
                  style: {
                    marginRight: '6px'
                  }
                },
                '同步中...'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '6px'
                  },
                  class: {
                    isHideAction: params.row.authorizationStatus === 1
                  },
                  on: {
                    click: () => {
                      this.addTencent()
                    }
                  }
                },
                '重新授权'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction:
                      params.row.authorizationStatus === 0 ||
                      !params.row.authorizationStatus
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'relieve',
                        params.row.status
                      )
                    }
                  }
                },
                '解除授权'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction: params.row.status !== 1
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'blockUp',
                        params.row.status
                      )
                    }
                  }
                },
                '停用'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction: params.row.status !== 2
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.updateCssWxPublicAccountToActive(params.row.appId)
                    }
                  }
                },
                '启用'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction: params.row.status === 1
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'deleteTencent',
                        params.row.status
                      )
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      corpInfoData: 'survey/getCorpInfo',
      loginCompanyData: 'survey/getLoginCompany'
    })
  },
  created() {
    this.getPublicAccountList()
    this.getAuthUrl()
    this.checkAppIdNum()
  },
  methods: {
    // 删除微信公众号
    updateCssWxPublicAccountStatusToDelete(params) {
      updateCssWxPublicAccountStatusToDelete(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('删除公众号成功')
            this.$root.Bus.$emit('regainCompanyInfo')
            this.getPublicAccountList()
            break
          case 3503:
            this.$Message.error('删除失败，公司不存在')
            break
          case 6000:
            this.$Message.error('删除失败，公众号不存在')
            break
          case 6005:
            this.$Message.error('删除失败，公众号非停用状态或未授权')
            break
          default:
            break
        }
      })
    },
    // 操作解除授权按钮停用微信公众号
    updateCssWxPublicAccountToAuthBlockUp(params) {
      updateCssWxPublicAccountToAuthBlockUp(params).then(data => {
        switch (data.code) {
          case 1:
            this.checkAppIdNum()
            this.$Message.success('解除授权成功')
            this.getPublicAccountList()
            break
          case 3503:
            this.$Message.error('解除授权失败，公司不存在')
            break
          case 6000:
            this.$Message.error('解除授权失败，公众号不存在')
            break
          case 6004:
            this.$Message.error('解除授权失败，公众号未授权')
            break
          default:
            break
        }
      })
    },
    // 操作停用按钮停用微信公众号
    updateCssWxPublicAccountToBlockUp(params) {
      updateCssWxPublicAccountToBlockUp(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('停用成功')
            this.getPublicAccountList()
            break
          case 3503:
            this.$Message.error('停用失败，公司不存在')
            break
          case 6004:
            this.$Message.error('停用失败，应用账号未授权')
            break
          case 6000:
            this.$Message.error('停用失败，公众号不存在')
            break
          default:
            break
        }
      })
    },
    // 禁用微信公众号
    updateCssWxPublicAccountToDisabled(params) {
      updateCssWxPublicAccountToDisabled(params).then(data => {
        switch (data.code) {
          case 1:
            break
          case 3503:
            this.$Message.error('禁用失败，公司不存在')
            break
          default:
            break
        }
      })
    },
    // 启用微信公众号
    updateCssWxPublicAccountToActive(params) {
      updateCssWxPublicAccountToActive({ appId: params }).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('启用成功')
            this.getPublicAccountList()
            break
          case 3503:
            this.$Message.error('启用失败，公司不存在')
            break
          default:
            break
        }
      })
    },
    // 公众号信息一键同步
    updateCssWxPublicAccountDataToDb() {
      let obj = {
        updatePublicAccountData: this.checkAllGroup,
        eeId: this.loginCompanyData.employeeData.eeId,
        appId: this.appId,
        appAccountId: this.appAccountId
      }
      updateCssWxPublicAccountDataToDb(obj).then(data => {
        if (data.code === 1) {
          this.getPublicAccountList()
          this.$root.Bus.$emit('accountDataToDb')
        }
      })
    },
    getAuthUrl() {
      let params = {
        redirectUrl: 'http://xingke100.com:8080/authorization',
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
        }
      })
    },
    getPublicAccountList() {
      if (this.loadingCount === 0) {
        this.loadingStatu = 1
        this.loadingImg = true
      }
      this.loadingCount++
      getPublicAccountList().then(data => {
        if (data.code === 1) {
          this.loadingStatu = 2
          this.loadingImg = false
          let tencentData = data.data
          this.tencentListData = tencentData
          if (tencentData.length <= 0) {
            this.noData = true
          } else {
            let accountList = getCookie('accountList')
            if (accountList) {
              this.closeLoop = true
              for (let i = 0; i < accountList.length; i++) {
                for (let j = 0; j < tencentData.length; j++) {
                  if (accountList[i].appId === tencentData[j].appId) {
                    if (
                      accountList[i].lockInStatus === 0 &&
                      tencentData[j].lockInStatus === 1
                    ) {
                      this.$Message.success(
                        `${tencentData[j].principalName}公众号同步完成`
                      )
                      break
                    }
                  }
                  if (tencentData[j].lockInStatus === 0) {
                    this.intervalLoop()
                    this.closeLoop = false
                  }
                }
              }
              if (this.closeLoop) {
                clearInterval(this.timer)
                this.timer = null
              }
            }
            setCookie('accountList', tencentData)
            this.noData = false
          }
        }
      })
    },
    intervalLoop() {
      if (this.timer) {
        return
      }
      this.timer = setInterval(() => {
        this.getPublicAccountList()
      }, 3000)
    },
    checkAppIdNum() {
      checkAppIdNum().then(data => {
        switch (data.code) {
          case 1:
            if (data.data) {
              this.isAddTencent = true
            } else {
              this.isAddTencent = false
            }
            break
          case 3503:
            break
          default:
            break
        }
      })
    },
    refreshPage() {
      this.loadingCount = 0
      this.getPublicAccountList()
    },
    showSelect(params, type, status, appAccountId) {
      if (status === 0) {
        this.$refs['forbidden'].showModal()
        return
      }
      this.appId = params
      if (type === 'ansy') {
        this.modalSync = true
        this.appAccountId = appAccountId
      } else {
        this.$refs[type].showModal()
      }
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.checkAllGroup = [
          'MENU',
          'USER_INFO',
          'TEMPLATE',
          'MEDIA',
          'AUTO_REPLY'
        ]
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 5) {
        this.checkAll = true
      } else if (data.length > 0) {
        this.checkAll = false
      } else {
        this.checkAll = false
      }
    },
    addTencent() {
      this.checkAppIdNum()
      if (this.isAddTencent) {
        window.open(this.thirdplatUrl, '_blank')
        let newLink = document.createElement('a')
        newLink.href = this.thirdplatUrl
        newLink.target = '_blank'
        document.body.appendChild(newLink)
        newLink.click()
        document.body.removeChild(newLink)
      } else {
        this.content = `当前套餐版本最多支持${
          this.corpInfoData.packAppidNum
        }个公众号，如需更多服务请升级。`
        this.$refs.addTencent.showModal()
      }
    },
    upgrade() {},
    okSync() {
      this.modalSync = false
      this.updateCssWxPublicAccountDataToDb()
      // this.$Message.error('公众号数据同步失败')
    },
    cancalSync() {
      this.modalSync = false
    },
    relieve() {
      this.updateCssWxPublicAccountToAuthBlockUp({ appId: this.appId })
    },
    deleteTencent() {
      this.updateCssWxPublicAccountStatusToDelete({ appId: this.appId })
    },
    blockUp() {
      this.updateCssWxPublicAccountToBlockUp({ appId: this.appId })
    },
    rowClassName(row, index) {
      if (row.authorizationStatus === 0) {
        return 'table-unactive-row'
      }
      return ''
    }
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
<style lang="stylus">
@import './tencentManage.styl'
#tencentMange
  background-color #fff
  border-radius 3px
  .isHideAction
    display none
  .table-unactive-row
    color #787c80
</style>
