<template>
  <div class="admin-header" :class="{bigHeader:collapsed, smallHeader:!collapsed}">
    <div class="header-wrapper">
      <div class="toggle header-item" @click="changeNav()">
        <img src="@/assets/images/navbig/navDown.png" alt="">
      </div>
      <div class="company header-item">
        <Dropdown trigger="click" :transfer="true" @on-click="selectCompany">
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
      <div class="combo header-item" v-if="saveloginData">
        <Tooltip :transfer="true" placement="top">
          <div class="combo-wrapper">
            <span class="combo-item">当前套餐：</span>
            <span class="combo-item">{{saveloginData.packageName}}</span>
          </div>
          <div slot="content">
            <p>
              <span>到期时间：</span>
              <span>{{saveloginData.endDate || 0}}</span>
            </p>
            <p>
              <span>剩余天数：</span>
              <span v-show="saveloginData.remainingTime>=0">{{saveloginData.remainingTime || 0}}</span>
              <span v-show="saveloginData.remainingTime<0">0</span>
            </p>
            <p>
              <span>可绑定公众号数：</span>
              <span>{{saveloginData.officialAccountsNum || 0}}</span>
            </p>
            <p>
              <span>坐席数：</span>
              <span>{{saveloginData.seatNum || 0}}</span>
            </p>
            <p>
              <span>员工人数：</span>
              <span>{{saveloginData.employeeNum || 0}}</span>
            </p>
          </div>
        </Tooltip>
        <span class="leavel-up" @click="upgrade">套餐升级</span>
      </div>
      <div class="user-header header-item">
        <Dropdown trigger="click" :transfer="false" @on-click="enterRoute">
          <div class="user">
            <div class="user-img">
              <img :src="userInfo.picUrl" alt="userImg">
            </div>
            <div class="user-name">{{userInfo.nickName}}</div>
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
  getUserCorpAuthMulti,
  logout,
  saveloginCompany,
  // queryCorpPackageById,
  getCorpStatisticsInfo,
  getPublicAccountList,
  getKeyIndicators,
  queryCorpPackRoleList
} from '@/api/query'
import Const from '@/pages/personalCenter/const'
import ConstCommon from '@/utils/const'
import { DateDiff } from '@/utils/util'
const minuTimer = 3 * 60 * 1000
export default {
  name: 'adminHeader',
  data() {
    return {
      const: Const,
      tencentRules: ConstCommon.tencentRules,
      header: '',
      content: '',
      showNav: '',
      userInfo: this.getToken() || null,
      currentCorp: this.getCookie('currentCorp'),
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
      saveloginData: 'survey/getSaveloginCompany'
    })
  },
  created() {
    this.$root.Bus.$on('accountDataToDb', () => {
      this.getPublicAccountList()
    })
    this.$root.Bus.$on('regainCompanyInfo', name => {
      this.saveloginCompany(name)
    })
  },
  mounted() {
    if (!this.getCookie('currentCorp')) {
      this.$router.push({ name: 'company' })
    }
    this.sameName = this.getCookie('currentCorp').corpName
    this.init()
    this.showNav = this.collapsed
  },
  methods: {
    init() {
      clearInterval(this.corpStatusTimer)
      this.currentCorp = this.getCookie('currentCorp')
      this.sameName = this.getCookie('currentCorp').corpName
      this.getSaveCorpInfo()
      this.getUserCorpAuthMulti()
      this.getCorpStatisticsInfo()
      this.getPublicAccountList()
      this.getKeyIndicators(0)
      this.queryCorpPackRoleList()
      this.queryCompanyStats()
      this.corpStatusTimer = setInterval(() => {
        this.queryCompanyStats()
        this.getSaveCorpInfo()
      }, minuTimer)
    },
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
      this.$get(this.flyPath.getCorpEmpPacStatus, {}, true).then(data => {
        if (data.code === 1) {
          switch (data.data.corpStatus) {
            case 'ACTIVE':
              break
            case 'DISABLE':
              this.header = '停用提示'
              this.content =
                '该企业已被停用，请联系企业管理员或销大师客服人员。'
              clearInterval(this.corpStatusTimer)
              this.$refs.cropTips.showModal()
              break
            case 'FORBIDDEN':
              this.header = '禁用提示'
              this.content =
                '抱歉，该企业已被禁用，您暂时无法操作，请联系销大师客服人员。'
              clearInterval(this.corpStatusTimer)
              this.$refs.cropTips.showModal()
              break
            case 'EXPIRE':
              this.header = '已过期提示'
              this.content =
                '该企业套餐已过期，请升级后继续使用。如有问题，请咨询销大师客服人员，谢谢。'
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
              this.content =
                '该员工已被停用，请联系企业管理员或销大师客服人员。'
              clearInterval(this.corpStatusTimer)
              this.$refs.cropTips.showModal()
              break
            case 3:
              this.header = '未加入提示'
              this.content =
                '抱歉，该员工未加入，您暂时无法操作，请联系销大师客服人员。'
              clearInterval(this.corpStatusTimer)
              this.$refs.cropTips.showModal()
              break
            case 5:
              this.header = '已离开提示'
              this.content =
                '抱歉，该员工已离开，您暂时无法操作，请联系销大师客服人员。'
              clearInterval(this.corpStatusTimer)
              this.$refs.cropTips.showModal()
              break
            default:
              break
          }
        } else {
          this.header = '不可用提示'
          this.content = data.message || '抱歉，网络出现故障，暂不能操作'
          clearInterval(this.corpStatusTimer)
          this.$refs.cropTips.showModal()
        }
      })
      // .catch(() => {
      //   this.header = '网络异常'
      //   this.content = '抱歉，网络出现故障，暂不能操作'
      //   clearInterval(this.corpStatusTimer)
      //   this.$refs.cropTips.showModal()
      // })
    },
    // 获取公司统计信息
    getCorpStatisticsInfo() {
      let obj = {
        corpId: this.getCookie('currentCorp').applyId
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
    // queryCorpPackageById(id) {
    //   let obj = {
    //     id: id
    //   }
    //   queryCorpPackageById(obj).then(data => {
    //     if (data.code === 1) {
    //       let packageData = data.data
    //       let startTime = packageData.startTime.substring(0, 10)
    //       let endTime = packageData.endTime.substring(0, 10)
    //       packageData.remainingTime = DateDiff(endTime)
    //       packageData.startDate = startTime
    //       packageData.endDate = endTime
    //       this.setCorpPackage(packageData)
    //     }
    //   })
    // },
    upgrade() {
      let corpId = this.getCookie('currentCorp').applyId
      let corpName = this.getCookie('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    isAdmin(createId) {
      return this.getToken().userId === createId
    },
    getSaveCorpInfo() {
      saveloginCompany({}, true).then(data => {
        if (data.code === 1) {
          if (!data.data.menuTree) {
            this.header = '不可用提示'
            this.content = '非常抱歉，您暂无权限，不能进入管理'
            this.$refs.cropTips.showModal()
            return
          }
          let navMenu = this.doneData(data.data.menuTree, this.const.unfoldData)
          this.setCookie('secondMenu', navMenu.allSecondObj)
          this.setCookie('mainMenu', navMenu.mainMenuList)
          this.setMenuList(navMenu)
          let packageData = data.data
          if (packageData.corpPack.startTime) {
            let startTime = packageData.corpPack.startTime.substring(0, 10)
            packageData.startDate = startTime
          }
          if (packageData.corpPack.endTime) {
            let endTime = packageData.corpPack.endTime.substring(0, 10)
            packageData.endDate = endTime
            packageData.remainingTime = DateDiff(endTime)
          }
          packageData.corpId = packageData.id
          packageData.employeeNum = packageData.corpPack.employeeNum
          packageData.officialAccountsNum = packageData.corpPack.officialAccountsNum
          packageData.seatNum = packageData.corpPack.seatNum
          packageData.packageName = packageData.corpPack.packageName
          packageData.admin = this.isAdmin(packageData.createId)
          this.setSaveloginCompany(packageData)
        }
      })
    },
    // 进入公司信息
    saveloginCompany(name) {
      let obj = {
        corpId: this.getCookie('currentCorp').applyId
      }
      saveloginCompany(obj).then(data => {
        if (data.code === 1) {
          if (!data.data.menuTree) {
            this.header = '不可用提示'
            this.content = '非常抱歉，您暂无权限，不能进入管理'
            this.$refs.cropTips.showModal()
            return
          }
          clearInterval(this.corpStatusTimer)
          this.currentCorp = this.getCookie('currentCorp')
          this.sameName = this.getCookie('currentCorp').corpName
          this.getSaveCorpInfo()
          this.getUserCorpAuthMulti()
          this.getCorpStatisticsInfo()
          this.getPublicAccountList()
          this.getKeyIndicators(0)
          this.queryCorpPackRoleList()
          this.queryCompanyStats()

          // this.queryCorpPackageById(id)
          // let id = data.data.packId
          // this.setLoginCompany(data.data)
          // 进入公司并跳到指定页面
          if (name) {
            this.$router.push({ name: name })
          }
          this.corpStatusTimer = setInterval(() => {
            this.queryCompanyStats()
            this.getSaveCorpInfo()
            // this.queryCorpPackageById(id)
            // this.getCorpStatisticsInfo()
            // this.queryCorpPackRoleList()
          }, minuTimer)
        } else {
          this.header = '不可用提示'
          this.content =
            data.message || '很抱歉，网络链接出现故障，请刷新页面！'
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
        appAccountId: null
      }
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
      getUserCorpAuthMulti().then(data => {
        if (data.code === 1) {
          this.corpData = data.data
        }
      })
    },
    getPublicAccountList() {
      let params = {
        corpId: this.getCookie('currentCorp').applyId
      }
      getPublicAccountList(params).then(data => {
        if (data.code === 1) {
          let tencentData = data.data
          if (tencentData.length > 0) {
            let accountList = this.getCookie('accountList')
            if (accountList && accountList.length > 0) {
              this.closeLoop = true
              for (let i = 0; i < accountList.length; i++) {
                for (let j = 0; j < tencentData.length; j++) {
                  if (accountList[i].appAccountId === tencentData[j].appAccountId) {
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
          } else {
            clearInterval(this.timer)
            this.timer = null
          }
          let cookieTencentData = this.transformData(tencentData, this.tencentRules)
          this.setCookie('accountList', cookieTencentData || [])
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
      this.removeCookie('accountList')
      let currentCorp = {
        applyId: this.corpData[name].applyId,
        corpName: this.corpData[name].corpName
      }
      this.currentCorp = currentCorp
      this.$root.Bus.$emit('changeCurrentCorp', this.currentCorp)
      this.setCookie('currentCorp', currentCorp)
      this.saveloginCompany('survey')
    },
    changeNav() {
      this.showNav = !this.showNav
      this.setCollapsed(this.showNav)
    },
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          this.removeToken()
          this.removeCookie('accountList')
          this.removeCookie('currentCorp')
          this.removeCookie('preAuthCode')
          this.removeCookie('saveStepsData')
          this.removeCookie('companyParams')
          this.removeCookie('seatsInfo')
          this.removeCookie('orderId')
          this.removeCookie('status')
          this.removeCookie('corpId')
          this.removeCookie('orderPayPrice')
          this.removeCookie('isCreatCompany')
          this.removeCookie('corpName')
          this.removeCookie('nextOrderStep')
          this.removeCookie('secondMenu')
          this.removeCookie('mainMenu')
          this.$router.push({ name: 'login' })
        }
      })
    },
    doneData(newArr, oldArr) {
      if (newArr.length < 0) {
        return
      }
      let arr = []
      let obj = {}
      newArr = newArr.sort(this.sortBy('menuOrder'))
      for (let index = 0; index < newArr.length; index++) {
        if (newArr[index].subMenu.length > 0) {
          newArr[index].subMenu = newArr[index].subMenu.sort(
            this.sortBy('menuOrder')
          )
        }
      }
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].isSecond = false
        for (let j = 0; j < oldArr.length; j++) {
          if (newArr[i].menuName === oldArr[j].menuName) {
            if (newArr[i].subMenu.length > 0) {
              newArr[i].isSecond = true
            }
            let assignObj = Object.assign({}, oldArr[j], newArr[i])
            arr.push(assignObj)
            if (newArr[i].subMenu.length > 0) {
              obj[newArr[i].menuUrl] = {}
              obj[newArr[i].menuUrl].name = newArr[i].menuName
              obj[newArr[i].menuUrl].list = newArr[i].subMenu
            }
          }
        }
      }
      let rules = {
        fontClass: 'fontClass',
        menuName: 'menuName',
        isSecond: 'isSecond',
        menuUrl: 'menuUrl'
      }
      let mainMenu = this.transformData(arr, rules)
      return {
        allSecondObj: obj,
        mainMenuList: mainMenu
      }
    },
    ...mapActions({
      setCollapsed: 'nav/setCollapsed',
      setCorpPackage: 'survey/setCorpPackage',
      setCorpInfo: 'survey/setCorpInfo',
      setKeyIndicators: 'survey/setKeyIndicators',
      setCorpPackRoleList: 'seats/setCorpPackRoleList',
      setSaveloginCompany: 'survey/setSaveloginCompany',
      setPayStatu: 'pay/setPayStatu',
      setMenuList: 'nav/setMenuList'
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

