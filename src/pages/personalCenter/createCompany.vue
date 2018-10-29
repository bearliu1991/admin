<template>
  <div id="createCompany">
    <div class="title">创建新企业</div>
    <div class="create-steps">
      <OperateSteps :current="currentSteps" :isUpgrade="false"></OperateSteps>
    </div>
    <div class="form" v-if="reloadComponent" v-show="currentSteps==0">
      <third-step @companyParams="companyParams" type="go-on"></third-step>
    </div>
    <div class="order-second-steps" v-if="reloadComponent" v-show="currentSteps==1">
      <orderPay type="createCompany" @lastStep="lastStep" @submitOrder="submitOrder"></orderPay>
    </div>
    <div class="order-third-steps" v-if="currentSteps==2">
      <payment @restartOrder="restartOrder" @nextOrderStep="nextOrderStep"></payment>
    </div>
    <div class="order-four-steps" v-if="currentSteps==3">
      <complatePay :complateStatus="complateStatus"></complatePay>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import OperateSteps from '@/components/OperateSteps'
import orderPay from '@/pages/admin/pay/OrderPay'
import payment from '@/pages/admin/pay/payment'
import thirdStep from '@/pages/register/thirdStep'
import complatePay from '@/pages/admin/pay/complatePay'
import {getCookie, setCookie} from '@/utils/cookies'
export default {
  name: 'creatCompany',
  data() {
    return {
      corpData: {},
      currentSteps: (getCookie('saveStepsData') && getCookie('saveStepsData').current) || 0,
      saveStepsData: {
        current: 0,
        name: this.$route.name
      },
      complateStatus: getCookie('nextOrderStep') || 1,
      reloadComponent: true
    }
  },
  mounted() {
    this.setCurrentCokie()
  },
  computed: {
    ...mapGetters({
      routerInfo: 'nav/getRouterInfo'
    })
  },
  methods: {
    setCurrentCokie() {
      this.saveStepsData.current = this.currentSteps
      setCookie('saveStepsData', this.saveStepsData)
    },
    companyParams(params) {
      this.corpData = params
      this.currentSteps = 1
      this.setCurrentCokie()
    },
    lastStep(val) {
      this.currentSteps = 0
      this.setCurrentCokie()
    },
    submitOrder() {
      this.currentSteps = 2
      this.setCurrentCokie()
    },
    nextOrderStep(val) {
      this.complateStatus = val
      setCookie('nextOrderStep', val)
      this.currentSteps = 3
      this.setCurrentCokie()
    },
    restartOrder() {
      this.reloadComponent = false
      this.$nextTick(() => {
        this.reloadComponent = true
        this.currentSteps = 0
        this.setCurrentCokie()
      })
    }
  },
  watch: {
    // $route(to, from) {
    //   this.saveStepsData.name = to.name
    //   this.setCurrentCokie()
    // },
    'routerInfo.name'(val) {
      this.saveStepsData.name = val
      this.setCurrentCokie()
    }
  },
  components: {
    thirdStep,
    OperateSteps,
    payment,
    orderPay,
    complatePay
  }
}
</script>

<style lang="stylus">
#createCompany
  padding-bottom 35px
  padding-top 43px
  min-height 742px
  >.title
    font-size 20px
    margin-left 43px
  .form
    margin-top 75px
  .create-steps
    margin 50px 0
  .order-second-steps
    width 75%
    margin 0 auto
  .order-third-steps
    width 64.286%
    margin 0 auto
</style>


