<template>
  <div id="orderTitle">
    <div class="left">
      <Row type="flex" justify="center" align="middle" class="rows">
       <Col class="left_wrap">
        <span class="icon" :class="transferStatus().className" value="待支付" v-html="transferStatus().icon"></span>
        <Row type="flex" align="middle" justify="center" class="title_des">
          <Col><h3>{{transferStatus().name}}</h3></Col>
          <Col v-if="transferStatus().tips && (details.status - 0 !== 0)"><i>{{transferStatus().tips}}</i></Col>
          <Col v-if="details.status - 0 === 0">
            剩余<CountDown color="inherit" :creatTime="details.orderCreateTime" :serviceTime="details.curTime" @payInvalid="orderInvalid"></CountDown>
          </Col>
        </Row>
       </Col>
       <Col class="tip" v-if="transferStatus().restTip">
        {{transferStatus().restTip}}
       </Col>
      </Row>
    </div>
    <!-- <div class="split_line"></div> -->
    <div class="right">
      <Row type="flex" justify="start" align="middle" class="right_list">
       <Col v-for="(item, key, index) in filterDetail()" :key="index">
        <span>{{key}}</span>
        <i>{{item}}</i>
       </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'orderTitle',
    data() {
        return {
          detailArr: [],
        }
    },
    props: ['details'],
    created() {

    },
    components: {},
    methods: {
      filterDetail() {
        if (this.details.orderId !== undefined) {
          let obj
          let list = this.details.payDetailList
          obj = {
            '订购企业': this.details.corpName,
            '订单编号': this.details.orderId,
            '创建时间': this.details.orderCreateTime
          }
          if (list.length === 1) {
            obj['支付单号'] = list[0].payOrderNo
            list[0].payType === 3 && (obj['上传凭证时间'] = list[0].uploadVoucherTime)
          }
          return obj
        }
        return {}
      },
      // 订单过期
      orderInvalid() {
        this._BUS.$emit('handleOrder', 'orderClose', this.details)
      },
      transferStatus() {
        let obj = {}
        if (this.details.orderId !== undefined) {
          switch (this.details.status - 0) {
            // 待付款
            case 0:
              obj = {
                name: '待付款...', 
                restTip: '该订单为您保留48小时, 48小时之后如果还未付款, 系统将自动取消订单',
                className: 'unpay',
                icon: '&#xe6ab;'
              }
              break
            // 订单完成
            case 1:
              obj = {
                name: '订单完成!', 
                className: 'success',
                icon: '&#xe749;'
              }
              break
            // 订单关闭
            case 2:
              obj = {
                name: '订单关闭!',
                className: 'error',
                icon: '&#xe703;'
              }
              break
            // 待审核
            case 3:
              obj = {
                name: '待审核...', 
                className: 'unpay',
                icon: '&#xe60e;'
              }
              break
            // 审核失败
            case 4:
              obj = {
                name: '审核失败!', 
                className: 'error',
                icon: '&#xe61a;'
              }
              break
            // 审核成功
            case 5:
              obj = {
                name: '审核成功!', 
                className: 'success',
                icon: '&#xe60f;'
              }
              break
            // 订单异常
            case 6:
              obj = {
                name: '订单处理中...', 
                className: 'unpay',
                icon: '&#xe610;'
              }
              break
            default:
              break
          }
          let list = this.details.payDetailList
          list.length === 1 && (obj.tips = '支付方式: ' + this.transferPayType(list[0].payType))
        }
        
        return obj
      },
      transferPayType(payType) {
        return payType === 1 ? '微信支付' : payType === 2 ? '支付宝支付' : '银行汇款'
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #orderTitle
    bgColor(#f7f9fa)
    height:183px
    padding:25px
    .left
      fl()
      height:100%
      width:50%
      padt(10px)
      .rows
        height:100%
        .left_wrap
          inline()
          .icon
            fl()
            fn(46px)
            mt(-5px)
            mr(3px)
          .unpay
            color(#ffbc58)
          .success
            color(#3fb838)
          .error
            color(err_color)
          img
            width:40px
            height 40px
            fl()
            mr(8px)
          .title_des
            fl()
            height:40px
            .ivu-col
              width:100%
              h3
                fn(16px)
                weight()
                mb(5px)
        .tip
          fn(12px)
          color(#979899)
          line-height:16px
          center()
    .right
      height:100%
      fr()
      borl()
      vertical-align middle
      width:45%
      center()
      .right_list
        height:100%
        .ivu-col
          width:100%
          alignL()
          ellipsis()
          padl(20px)
          span 
            mr(2px)
            width: 85px
            fl()
          i
            fl()
</style>
