<template>
  <div id="app" :class="{wrapperMargin:wrapperMargin,scrollMargin: scrollMargin,overHidden:overHidden==2}">
    <router-view/>
    <titleTips></titleTips>
    <!-- 订单流程抽屉 -->
    <FullPageDrawer :isClearInfo="true" position='top' v-if="routerName !== 'createCompany'" v-model="showFullPage">
      <div slot="header">
        <div class="header-float xufei">
          续费升级
        </div>
        <div class="header-float gongsi">
          {{corpName}}
        </div>
      </div>
      <div slot="slotWrapper">
        <UpgradeOrder></UpgradeOrder>
      </div>
    </FullPageDrawer>
    <!-- 详情抽屉 -->
    <FullPageDrawer position='top' v-model="orderDetailFullPage">
      <div slot="header">
        <div class="header-float xufei">
          订单详情
        </div>
      </div>
      <div class="order-detail-wrapper" slot="slotWrapper">
        <orderDetail @restartOrder="restartPay" :drawerDetail="true" :orderInfo="curOrderInfo"></orderDetail>
      </div>
    </FullPageDrawer>
    <NewModal :isOrder="true" v-model="isWaitOrder" header="订购提醒" confrim="去支付" content="当前企业有待付款订单，您可直接去支付或者重新订购。" cancelText="重新订购" @ok="goPay" @cancel="restartPay"></NewModal>
    <NewModal :isOrder="true" v-model="isAuditOrder" header="订购提醒" confrim="查看详情" content="当前企业有未完成订单，无法续费升级，您可查看该订单详情。"  @ok="viewDetail"></NewModal>
    <NewModal :isOrder="true" v-model="isErrAuditOrder" header="订购提醒" confrim="重新订购" content="当前企业有审核失败订单，您可重新订购或查看订单详情。" cancelText="查看订单" @ok="restartPay"  @cancel="viewDetail"></NewModal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TitleTips from '@/components/TitleTips'
import UpgradeOrder from '@/components/public/UpgradeOrder'
import orderDetail from '@/pages/admin/orderRecords/orderDetail'
export default {
  name: 'App',
  data() {
    return {
      timer: null,
      wrapperMargin: false,
      scrollMargin: false,
      showFullPage: !!this.getCookie('saveStepsData'),
      saveStepsData: {
        current: 0,
        name: this.$route.name
      },
      corpName: this.getCookie('corpName') || '',
      orderDetailFullPage: false,
      routerName: 'createCompany',
      curOrderInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      isOrder: 'pay/getIsOrder',
      isFullPage: 'pay/getIsFullPage',
      message: 'user/getMessage',
      overHidden: 'user/getOverStatu',
      corpId: 'pay/getCorpId'
    }),
    // 待付款订单
    isWaitOrder() {
      return this.isOrder === 2
    },
    // 待审核、审核成功的订单
    isAuditOrder() {
      return this.isOrder === 3
    },
    // 审核失败的订单
    isErrAuditOrder() {
      return this.isOrder === 4
    }
  },
  created() {
  },
  mounted() {
    if (this.ltIE10()) {
      this.ieWarning()
    }
    this.$root.Bus.$on('hideFullPageDrawer', value => {
      if (value) {
        this.cancelOrder()
      }
    })
    this.$root.Bus.$on('openDrawerDetail', value => {
      this.curOrderInfo = value
      this.orderDetailFullPage = true
      this.showFullPage = false
    })
    this._BUS.$on('orderPayNow', value => {
      this.goPay()
    })
    // if (!this.getCookieSession()) {
    //   this.getSessionId()
    // }
    // if (!this.timer) {
    //   this.timer = setInterval(() => {
    //     this.getSessionId()
    //   }, 1000 * 60 * 28)
    // }
  },
  methods: {
    ieWarning() {
      this.$Notice.warning({
        title: '浏览器版本过低',
        desc:
          '为了给您提供更优质的网页浏览体验，建议使用IE10及以上版本的浏览器',
        duration: 0
      })
    },
    setCurrentCokie(val) {
      this.saveStepsData.current = val
      this.setCookie('saveStepsData', this.saveStepsData)
    },
    goPay() {
      this.saveStepsData.name = this.$route.name
      this.setCurrentCokie(1)
      this.showFullPage = true
    },
    restartPay() {
      let orderId = this.getCookie('orderId')
      let params = {
        orderIds: [orderId],
        orderStatus: 'CANCEL',
        corpId: this.getCookie('corpId')
      }
      this.getCancelOrder(params).then(data => {
        if (data.code === 1) {
          this.saveStepsData.name = this.$route.name
          this.setCurrentCokie(0)
          this.orderDetailFullPage = false
          this.showFullPage = true
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    cancelOrder() {
      let orderId = this.getCookie('orderId')
      let params = {
        orderIds: [orderId],
        orderStatus: 'CANCEL',
        corpId: this.getCookie('corpId')
      }
      this.getCancelOrder(params).then(data => {
        if (data.code === 1) {
          this.$Message.success('取消订单成功')
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    viewDetail() {
      this.curOrderInfo.orderId = this.getCookie('orderId')
      this.curOrderInfo.corpId = this.getCookie('corpId')
      this.curOrderInfo.status = this.getCookie('status')
      this.orderDetailFullPage = true
    },
    ...mapActions({
      setRouterInfo: 'nav/setRouterInfo'
    })
  },
  watch: {
    message(val) {
      if (val === 2) {
        if (this.$route.name !== 'login' && this.$route.name !== 'register') {
          this.removeCookieSession()
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
      }
    },
    $route(to, from) {
      this.routerName = to.name
      if (to.name !== 'createCompany') {
        this.showFullPage = !!this.getCookie('saveStepsData')
      }
      this.orderDetailFullPage = false
      this.setRouterInfo(to)
      this.$nextTick(() => {
        this.$root.Bus.$emit('calcScrollHeight')
      })
      switch (to.name) {
        case 'register':
          break
        case 'home':
          this.wrapperMargin = true
          break
        case 'survey':
          this.scrollMargin = true
          break
        default:
          this.wrapperMargin = false
          this.scrollMargin = false
          break
      }
      // if (to.name === 'login' || to.name === 'register') {
      //   this.getSessionId()
      // }
    },
    isFullPage(val) {
      if (val === 2) {
        this.showFullPage = true
      } else if (val === 3) {
        this.orderDetailFullPage = true
      }
    },
    showFullPage() {
      this.corpName = this.getCookie('corpName') || ''
    }
  },
  components: {
    TitleTips,
    UpgradeOrder,
    orderDetail
  },
  destroyed() {
    this.$root.Bus.$off('hideFullPageDrawer')
    this.$root.Bus.$off('openDrawerDetail')
  }
}
</script>

<style lang="stylus">
#app
  width 100%
  height 100%
  min-width 1140px
  font-family 'MicrosoftYaHei', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #303133
.overHidden
  min-width inherit !important
  overflow hidden !important
.wrapperMargin
  #main
    >.main-scroll-bar .main-wrapper-noscroll
      margin 0 !important
      box-shadow none
#admin
  .admin-main
    .admin-main-wrapper
      padding-left 10px
      padding-right 10px
.scrollMargin
  #admin
    .admin-main-wrapper
      .admin-main-scroll
        padding-top 10px
.order-detail-wrapper
  width 56.25%
  margin auto
</style>
