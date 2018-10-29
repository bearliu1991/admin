<template>
  <div class="admin-header" :class="{bigHeader:collapsed, smallHeader:!collapsed}">
    <div class="header-wrapper">
      <div class="toggle header-item" @click="changeNav()">
        <img src="@/assets/images/navbig/navDown.png" alt="">
      </div>
      <div class="company header-item">
        <Dropdown trigger="click" :transfer="false" @on-click="selectCompany">
          <div class="user">
            <div class="user-name" :title="currentCorp.corpName">
              {{currentCorp.corpName}}
            </div>
            <Icon type="arrow-down-b"></Icon>
          </div>
          <DropdownMenu slot="list" class="userDrop">
            <DropdownItem v-for="(item, index) in corpData" :key="index" :name="index" :title="item.corpName">{{item.corpName}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="combo header-item">
        <Tooltip :transfer="true" placement="top">
          <div class="combo-wrapper">
            <span class="combo-item">当前套餐：</span>
            <span class="combo-item">{{corpPackageData.packageName}}</span>
          </div>
          <div slot="content">
            <p>
              <span>到期时间：</span>
              <span>{{corpPackageData.endDate || 0}}</span>
            </p>
            <p>
              <span>剩余天数：</span>
              <span v-show="corpPackageData.remainingTime>=0">{{corpPackageData.remainingTime || 0}}</span>
              <span v-show="corpPackageData.remainingTime<0">0</span>
            </p>
            <p>
              <span>可绑定公众号数：</span>
              <span>{{corpPackageData.officialAccountsNum || 0}}</span>
            </p>
            <p>
              <span>坐席数：</span>
              <span>{{corpPackageData.seatNum || 0}}</span>
            </p>
            <p>
              <span>员工人数：</span>
              <span>{{corpPackageData.employeeNum || 0}}</span>
            </p>
          </div>
        </Tooltip>
        <span class="leavel-up" @click="upgrade">套餐升级</span>
      </div>
      <div class="user-header header-item">
        <Dropdown trigger="hover" :transfer="false" @on-click="enterRoute">
          <div class="user">
            <div class="user-img">
              <img v-if="userStatus == 2" :src="userInfo.picUrl" alt="userImg">
            </div>
            <div class="user-name" v-if="userStatus == 2">{{userInfo.nickName}}</div>
            <Icon type="arrow-down-b"></Icon>
          </div>
          <DropdownMenu slot="list" class="userDrop">
            <DropdownItem name="company"><Icon size="16" type="home"></Icon>我的企业</DropdownItem>
            <DropdownItem name="personInfo"><Icon size="16" type="person"></Icon>个人信息</DropdownItem>
            <DropdownItem name="quit"><Icon size="16" type="power"></Icon>退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <common-modal ref="cropTips" :closable="false" :maskClosable="false" :header="header" :content="content" @ok="goToCrop" confrim="知道了" :cancelBtn="false"></common-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  getToken,
  removeToken,
  getCookie,
  setCookie,
  removeCookie,
  removeCookieSession
} from '@/utils/cookies'
import {
  getUserCorpAuthMulti,
  logout,
  saveloginCompany,
  queryCorpPackageById,
  getCorpStatisticsInfo,
  getPublicAccountList,
  getKeyIndicators,
  queryCorpPackRoleList
} from '@/api/query'
import { DateDiff } from '@/utils/util'
const minuTimer = 3 * 60 * 1000
export default {
  name: 'adminHeader',
  data() {
    return {
      header: '',
      content: '',
      showNav: '',
      userInfo: getToken() || null,
      userStatus: 1,
      currentCorp: getCookie('currentCorp'),
      corpData: [],
      sameName: '',
      timer: null,
      corpStatusTimer: null,
      closeLoop: true,
      systems: [
        {
          name: '分配权限',
          obj: {}
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      collapsed: 'nav/getCollapsed',
      corpPackageData: 'survey/getCorpPackage',
      keyIndicatorsData: 'survey/getKeyIndicators',
      corpInfoData: 'survey/getCorpInfo'
    })
  },
  created() {
    this.$root.Bus.$on('accountDataToDb', () => {
      this.intervalLoop()
    })
    this.$root.Bus.$on('regainCompanyInfo', (name) => {
      this.saveloginCompany(name)
    })
  },
  mounted() {
    if (!getCookie('currentCorp')) {
      this.$router.push({name: 'company'})
    }
    this.sameName = getCookie('currentCorp').corpName
    this.isLogin()
    this.saveloginCompany()
    this.showNav = this.collapsed
  },
  methods: {
    queryCorpPackRoleList() {
      let params = {
        platformType: 'PC_WEB_ADMIN'
      }
      queryCorpPackRoleList(params).then(data => {
        if (data.code === 1) {
          // let arr = divideGroup(data.data, 'groupName')
          let obj = {}
          for (let item of data.data) {
            obj[item.groupName] = obj[item.groupName] || {}
            obj[item.groupName].name = item.groupName
            obj[item.groupName].data = obj[item.groupName].data || []
            obj[item.groupName].data.push({
              cont: item.roleName,
              id: item.roleId,
              groupName: item.groupName,
              isSelect: false
            })
          }
          this.systems[0].obj = obj
          this.setCorpPackRoleList(this.systems)
        }
      })
    },
    // 查询公司状态
    queryCompanyStats() {
      this.$get(this.fylPath.getCorpEmpPacStatus).then((data) => {
        switch (data.data.corpStatus) {
          case 'ACTIVE':
            break
          case 'DISABLE':
            this.header = '停用提示'
            this.content = '该企业已被停用，请联系企业管理员或销大师客服人员。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break
          case 'FORBIDDEN':
            this.header = '禁用提示'
            this.content = '抱歉，该企业已被禁用，您暂时无法操作，请联系销大师客服人员。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break
          case 'EXPIRE':
            this.header = '已过期提示'
            this.content = '该企业套餐已过期，请升级后继续使用。如有问题，请咨询销大师客服人员，谢谢。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break  
          default:
            break
        }
        switch (data.data.employeeStatus) {
          case 1:
            break
          case 2:
            this.header = '停用提示'
            this.content = '该员工已被停用，请联系企业管理员或销大师客服人员。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break
          case 3:
            this.header = '未加入提示'
            this.content = '抱歉，该员工未加入，您暂时无法操作，请联系销大师客服人员。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break
          case 5:
            this.header = '已离开提示'
            this.content = '抱歉，该员工已离开，您暂时无法操作，请联系销大师客服人员。'
            clearInterval(this.corpStatusTimer)
            this.$refs.cropTips.showModal()
            break      
          default:
            break
        }
      }).catch(() => {
        this.header = '网络异常'
        this.content = '抱歉，网络出现故障，暂不能操作'
        clearInterval(this.corpStatusTimer)
        this.$refs.cropTips.showModal()
      })
    },
    // 获取公司统计信息
    getCorpStatisticsInfo() {
      let obj = {
        corpId: getCookie('currentCorp').applyId
      }
      getCorpStatisticsInfo(obj)
        .then(data => {
          let corpInfoData = data.data || {}
          if (data.code === 1) {
            corpInfoData.loadingDataStatu = 2
            this.setCorpInfo(Object.assign({}, this.corpInfoData, corpInfoData))
          } else {
            corpInfoData.loadingDataStatu = 3
            this.setCorpInfo(Object.assign({}, this.corpInfoData, corpInfoData))
          }
        })
        .catch(() => {
          this.setCorpInfo({ loadingDataStatu: 3 })
        })
    },
    queryCorpPackageById(id) {
      let obj = {
        id: id
      }
      queryCorpPackageById(obj).then(data => {
        if (data.code === 1) {
          let packageData = data.data
          let startTime = packageData.startTime.substring(0, 10)
          let endTime = packageData.endTime.substring(0, 10)
          packageData.remainingTime = DateDiff(endTime)
          packageData.startDate = startTime
          packageData.endDate = endTime
          this.setCorpPackage(packageData)
        }
      })
    },
    upgrade() {
      let corpId = getCookie('currentCorp').applyId
      let corpName = getCookie('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    isAdmin(createId) {
      return this.getToken().userId === createId
    },
    // 进入公司信息
    saveloginCompany(name) {
      let obj = {
        corpId: getCookie('currentCorp').applyId
      }
      saveloginCompany(obj).then(data => {
        if (data.code === 1) {
          clearInterval(this.corpStatusTimer)
          this.currentCorp = getCookie('currentCorp')
          this.sameName = getCookie('currentCorp').corpName
          let id = data.data.packId
          data.data.admin = this.isAdmin(data.data.createId)
          this.setSaveloginCompany(data.data)
          // this.setLoginCompany(data.data)
          this.getUserCorpAuthMulti()
          this.queryCorpPackageById(id)
          this.getCorpStatisticsInfo()
          this.getPublicAccountList()
          this.getKeyIndicators(0)
          this.queryCorpPackRoleList()
          this.queryCompanyStats()
          // 进入公司并跳到指定页面
          if (name) {
            this.$router.push({name: name})
          }
          this.corpStatusTimer = setInterval(() => {
            this.queryCompanyStats()
            this.queryCorpPackageById(id)
            this.getCorpStatisticsInfo()
            this.queryCorpPackRoleList()
          }, minuTimer)
        } else {
          this.header = '不可用提示'
          this.content = data.message || '很抱歉，网络链接出现故障，请刷新页面！'
          this.$refs.cropTips.showModal()
        }
      })
    },
    goToCrop() {
      this.$router.push({ name: 'company' })
    },
    // 获得关键指标
    getKeyIndicators(date) {
      let obj = {
        time: date,
        appAccountId: this.userInfo.defaultWechatAccountid
      }
      this.setKeyIndicators({ loadingDataStatu: 1 })
      getKeyIndicators(obj)
        .then(data => {
          let keyIndicatorsData = data.data || {}
          if (data.code === 1) {
            keyIndicatorsData.loadingDataStatu = 2
            this.setKeyIndicators(
              Object.assign({}, this.keyIndicatorsData, keyIndicatorsData)
            )
          } else {
            keyIndicatorsData.loadingDataStatu = 3
            this.setKeyIndicators(
              Object.assign({}, this.keyIndicatorsData, keyIndicatorsData)
            )
          }
        })
        .catch(() => {
          this.setKeyIndicators({ loadingDataStatu: 3 })
        })
    },
    getUserCorpAuthMulti() {
      // let params = {
      //   offset: this.offset,
      //   limit: 10,
      //   // ASC
      //   order: 'ASC'
      // }
      getUserCorpAuthMulti().then(data => {
        if (data.code === 1) {
          this.corpData = data.data
        }
      })
    },
    getPublicAccountList() {
      let params = {
        corpId: getCookie('currentCorp').applyId
      }
      getPublicAccountList(params).then(data => {
        if (data.code === 1) {
          let tencentData = data.data
          if (tencentData.length > 0) {
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
          }
          setCookie('accountList', tencentData || [])
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
    enterRoute(name) {
      if (name !== 'quit') {
        this.$router.push({ name: name })
      } else {
        this.logout()
      }
    },
    selectCompany(name) {
      clearInterval(this.timer)
      if (this.sameName === this.corpData[name].corpName) {
        return
      }
      this.sameName = name
      removeCookie('accountList')
      let currentCorp = {
        applyId: this.corpData[name].applyId,
        corpName: this.corpData[name].corpName
      }
      this.currentCorp = currentCorp
      this.$root.Bus.$emit('changeCurrentCorp', this.currentCorp)
      setCookie('currentCorp', currentCorp)
      this.saveloginCompany('survey')
    },
    isLogin() {
      if (this.userInfo) {
        this.userStatus = 2
      } else {
        this.userStatus = 1
      }
    },
    changeNav() {
      this.showNav = !this.showNav
      this.setCollapsed(this.showNav)
    },
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          removeToken()
          removeCookieSession()
          removeCookie('accountList')
          removeCookie('currentCorp')
          removeCookie('preAuthCode')
          removeCookie('saveStepsData')
          removeCookie('companyParams')
          removeCookie('orderId')
          removeCookie('seatsInfo')
          removeCookie('corpId')
          removeCookie('orderPayPrice')
          removeCookie('corpName')
          removeCookie('nextOrderStep')
          this.$router.push({ name: 'login' })
        }
      })
    },
    ...mapActions({
      setCollapsed: 'nav/setCollapsed',
      setCorpPackage: 'survey/setCorpPackage',
      setCorpInfo: 'survey/setCorpInfo',
      setKeyIndicators: 'survey/setKeyIndicators',
      setCorpPackRoleList: 'seats/setCorpPackRoleList',
      setSaveloginCompany: 'survey/setSaveloginCompany',
      setPayStatu: 'pay/setPayStatu'
    })
  },
  watch: {
    collapsed(val) {
      this.showNav = this.collapsed
    }
  },
  destroyed() {
    clearInterval(this.corpStatusTimer)
    clearInterval(this.timer)
    this.$root.Bus.$off('accountDataToDb')
    this.$root.Bus.$off('regainCompanyInfo')
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.admin-header
  position fixed
  z-index 10
  left 0
  width 100%
  height 50px
  box-shadow 0px 1px 0px 0px #e3e4e5
  background-color #fff
  transition all 0.2s
  min-width 700px 
  &.bigHeader
    padding-left 120px
  &.smallHeader
    padding-left 60px
  .header-wrapper
    clear()
    height 100%
    .header-item
      float left
      height 100%
      cursor pointer
    .toggle
      padding 0 20px
      margin-top 18px
    .company
      line-height 50px
      .user
        clear()
        .user-name
          float left
          max-width 211px
          margin-right 5px
          no-wrap()
    .combo
      position relative
      margin-left 40px
      &:after
        position absolute
        content ''
        height 24px
        width 1px
        background-color #d8dfe5
        left -20px
        top 12.5px
      .leavel-up
        margin-left 20px
        &:hover
          color #409eff
      .combo-wrapper
        line-height 50px
        .combo-item
          display inline-block
          &:nth-of-type(3)
            margin-left 20px
    .user-header
      float right
      margin-right 10px
      clear()
      .user
        line-height 50px
        .user-img
          float left
          margin-right 5px
          img
            width 36px
            height 36px
            border-radius 50%
            display inline-block
            vertical-align middle
        .user-name
          float left
          padding-right 5px
          max-width 90px
          no-wrap()
</style>

