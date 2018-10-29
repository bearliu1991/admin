<template>
  <div class="orderPay">
    <div class="orderpay-wrapper">
      <Menus :menuList='menuList' @curMenu="getCurMenu"></Menus>
      <div class="buy-info">
        <div class="new-info">
          <p class="title">新订购服务</p>
          <tablePay tableType="new" :buyInfo="newInfo"></tablePay>
        </div>
        <div class="old-info" v-if="type !== 'createCompany' && oldInfo.goodsName">
          <p class="title">原订购服务</p>
          <tablePay tableType="old" :buyInfo="oldInfo"></tablePay>
        </div>
      </div>
      <div class="order-summary">
        <div class="prev-wrapper">
          <div class="total order-item">
            <div class="order-float">
              <span class="span1">付款合计</span>
              <span class="span2 fixed-width">¥ {{newInfo.countPrice}}</span>
            </div>
          </div>
          <div class="discount order-item" v-if="type !== 'createCompany' && oldInfo.goodsName">
            <div class="order-float">
              <span class="span1">抵扣小计</span>
              <span class="span2 fixed-width">¥ {{oldInfo.minusPrice}}</span>
            </div>
          </div>
        </div>
        <div class="actual order-item">
          <div class="order-float">
            <span class="span1">实付款</span>
            <span class="span2"><span class="fuhao">¥</span> {{newInfo.countPrice - (oldInfo.minusPrice||0)}}</span>
            <span class="span3"><Poptips width="217" content="实付款=付款小计-抵扣合计"></Poptips></span>
          </div>
        </div>
        <div class="order-company order-item">
          <div class="order-float">
            <span class="span1">订购企业</span>
            <span class="span2 company-color">{{corpName}}</span>
          </div>
        </div>
      </div>
      <div class="submit">
        <div class="submit-left">
          <span class="check">
            <Checkbox v-model="single">我已阅读并同意<span>《销大师在线订购协议》</span>，付款完成后可在发票管理中申请开票。</Checkbox>
          </span>
        </div>
        <div class="submit-right">
          <Button class="cancel" @click="cancel" type="ghost">取消</Button>
          <Button class="cancel" v-if="type=='createCompany'" @click="lastStep" type="ghost">上一步</Button>
          <Button class="tijiao" @click="submit" type="error">提交订单</Button>
        </div>
      </div>
    </div>
    <NewModal v-model="isOrder" header="订购提醒" confrim="去支付" content="当前企业有待付款订单，您可直接去支付或者重新订购" cancelText="重新订购" @ok="goPay" @cancel="restartPay"></NewModal>
  </div>
</template>
<script>
import Menus from './menus'
import tablePay from './tablePay'
import {getCurOrderDetail, saveOrderInfo, saveCorpCreateApplyForOrder} from '@/api/query'
import {getCookie, setCookie} from '@/utils/cookies'
export default {
  name: '',
  props: {
    type: {
      type: String,
      default: 'upgrade'
    }
  },
  data() {
    return {
      isOrder: false,
      single: true,
      newInfo: {},
      oldInfo: {},
      menuList: [],
      saveOrderData: {},
      corpName: getCookie('corpName') || '',
      corpOrderData: {},
      dateArr: [
        {itemKey: "ValidDay", itemValue: "15", itemName: "15天"},
        {itemKey: "ValidDay", itemValue: "180", itemName: "半年"},
        {itemKey: "ValidDay", itemValue: "30", itemName: "1个月"},
        {itemKey: "ValidDay", itemValue: "365", itemName: "一年"},
        {itemKey: "ValidDay", itemValue: "60", itemName: "2个月"},
        {itemKey: "ValidDay", itemValue: "7", itemName: "7天"},
        {itemKey: "ValidDay", itemValue: "90", itemName: "3个月"}
      ],
      // 用于展示不同的套餐背景图
      classList: ['bg0', 'bg1', 'bg2', 'bg3', 'bg4', 'disabled']
    }
  },
  created() {
    this.init()
  },
  components: { Menus, tablePay },
  methods: {
    init() {
      this.getDateArr()
      if (this.type === 'upgrade') {
        this.getCurOrderDetail()
      }
    },
    cancel() {
      if (this.type === 'createCompany') {
        this.$router.push({name: 'company'})
      } else {
        this.$root.Bus.$emit('hideFullPageDrawer', false)
      }
    },
    lastStep() {
      this.$emit('lastStep', 0)
    },
    // 获取时间列表
    getDateArr() {
      this.ajaxDateList({itemKey: "ValidDay", limit: 9999, offset: 0}).then((res) => {
        if (res.code === 1) {
          this.dateArr = res.data.records
          // 获取套餐列表
          this.ajaxMenuList({corpId: this.getCookie('corpId')}).then((res) => {
            if (res.code === 1) {
              this.handleMenu(res.data)
            }
          })
        }
      })
    },
    // 获取公司当前订购服务
    getCurOrderDetail() {
      let params = {
        corpId: getCookie('corpId')
      }
      getCurOrderDetail(params).then(data => {
        if (data.code === 1) {
          if (data.data) {
            this.oldInfo = {
              goodsName: data.data.goodsName,
              goodsPrice: data.data.goodsPrice / 100,
              goodsNum: data.data.goodsNum,
              orderPayprice: data.data.orderPayprice / 100,
              validTime: data.data.createTime + ' —— ' + data.data.endTime,
              leftDay: data.data.leftDay,
              minusPrice: data.data.minusPrice / 100
            }
          }
        } else {
          this.$Message.warning(data.message)
        }
      })
    },
    // 保存订单
    saveOrderInfo(params) {
      saveOrderInfo(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('提交订单成功')
            setCookie('orderId', data.data.orderId)
            this.$emit('submitOrder')
            break
          case 6620:
            setCookie('orderId', data.data.orderId)
            this.isOrder = true
            break
          default:
            this.$Message.warning(data.message)
            break
        }
      })
    },
    // 保存创建公司并创建订单
    saveCorpCreateApplyForOrder(params) {
      saveCorpCreateApplyForOrder(params).then(data => {
        switch (data.code) {
          case 1:
            setCookie('orderId', data.data.orderId)
            setCookie('corpId', data.data.corpId)
            this.$Message.success('提交订单成功')
            this.$emit('submitOrder')
            break
          default:
            this.$Message.warning(data.message)
            break
        }
      })
    },
    submit() {
      if (this.single) {
        if (this.type === 'createCompany') {
          this.corpOrderData = getCookie('companyParams') || {}
          this.saveOrderData.corpId = null
          this.saveOrderData.reOrder = null
          this.saveOrderData.packId = this.saveOrderData.packageId
          this.saveOrderData.orderPayprice = (this.newInfo.countPrice - (this.oldInfo.minusPrice || 0)) * 100
          this.saveOrderData.packageId = null
          let params = Object.assign({}, this.corpOrderData, this.saveOrderData)
          this.saveCorpCreateApplyForOrder(params)
        } else {
          this.saveOrderData.reOrder = 0
          this.saveOrderData.orderPayprice = (this.newInfo.countPrice - (this.oldInfo.minusPrice || 0)) * 100
          this.saveOrderInfo(this.saveOrderData)
        }
      } else {
        this.$Message.warning('请阅读并同意《销大师在线订购协议》')
      }
    },
    goPay() {
      this.$emit('submitOrder')
    },
    restartPay() {
      this.saveOrderData.reOrder = 1
      this.saveOrderInfo(this.saveOrderData)
    },
    handleMenu(list) {
      let arr = []
      // 先将套餐根据套餐级别排序,方便找出推荐的套餐
      list.sort((a, b) => {
        return a.leave - b.leave
      })
      /*
        recommendIdx： 推荐套餐的index
        recommendLeave: 推荐套餐的级别值leave
      */
      let recommendIdx = list.findIndex((item) => {
        return item.recommend === 1
      })
      let recommendLeave
      recommendIdx > -1 && (recommendLeave = list[recommendIdx].leave)
      /*
        usingIdx 正在使用套餐的index
        usingLeave: 正在使用套餐的级别值leave
      */
      let usingIdx = list.findIndex((item) => {
        return item.id === item.corpPackageId
      })
      usingIdx = usingIdx > -1 ? usingIdx : 1
      let usingLeave = list[usingIdx].leave

      // 如果没有推荐的套餐
      if (recommendIdx === -1) {
        let idx = list.findIndex((item) => {
          return item.leave > usingLeave && item.group !== list[usingIdx].group
        })
        // 如果有比使用套餐级别大的套餐, 且该套餐不和使用中的套餐同组，则推荐套餐为该套餐
        if (idx > -1) {
          list[idx].recommend = true
        } else { // 否则推荐套餐为正在使用中的套餐
          list[usingIdx].recommend = true
        }
      } else { // 如果有推荐的套餐
        // 如果使用中的套餐级别大于推荐的级别，则推荐的套餐为使用中的套餐, 推荐图标不显示（notShowRecommend控制)
        if (usingLeave > recommendLeave) {
          list[recommendIdx].recommend = false
          list[usingIdx].recommend = true
          list[usingIdx].notShowRecommend = true
        }
      }
      // 组装数组，将同组数值放在一个对象下面
      for (let item of list) {
        // 转换时间单位
        item.dateUnit = this.transferUnit(item)

        let isGroup = list.find((val) => {
          return (val.group === item.group && (val.id !== item.id))
        })
        if (isGroup) {
          let allFalse = true
          for (let n of arr) {
            if (n.group && (n.group === item.group)) {
              allFalse = false
              n.arr.push(item)
            }
          }
          if (allFalse) {
            arr.push(
              {
                group: item.group,
                name: item.name,
                summary: item.summary,
                arr: [item],
                mostBuyNum: item.mostBuyNum
              }
            )
          }
        } else {
          arr.push(item)
        }
      }
      /*
        判断如何显示各数据
        val.isVailUse 套餐是否可选
        val.isUsing 是否在使用中
        val.recommend 是否为推荐套餐
       */
      for (let val of arr) {
        let isUsing = false
        if (val.arr) {
          val.arr.sort((a, b) => {
            return a.leave - b.leave
          })
          val.isVailUse = val.arr[val.arr.length - 1].leave >= usingLeave
          val.maxLeave = val.arr[val.arr.length - 1].leave
          val.minLeave = val.arr[0].leave
          !val.isVailUse && (val.content = '该版本低于当前使用的版本, 不支持续费升级')
          val.recommend = val.arr.findIndex((item) => {
            return item.recommend === true
          }) > -1
          isUsing = val.arr.find((item) => {
            return item.corpPackageId === item.id
          })
          val.notShowRecommend = val.arr.findIndex((item) => {
            return item.notShowRecommend === true
          }) > -1
        } else {
          isUsing = val.corpPackageId === val.id
          val.isVailUse = val.leave >= usingLeave
          !val.isVailUse && (val.content = '该版本低于当前使用的版本, 不支持续费升级')
          if (val.isFreeMenu && !val.freePackageSelect) {
            val.isVailUse = false
            val.content = "您已使用过" + val.name + ', 不可重复订购。'
          }
        }
        val.isUsing = isUsing
      }
      arr.map((item, index) => {
        return (item.className = 'bg' + index)
      })
      // 为各个套餐添加不同的class,用于背景颜色区别
      arr.map((item, idx) => {
        return !item.isVailUse && (item.className = this.classList[this.classList.length - 1])
      })
      this.menuList = arr.slice()
    },
    transferUnit(item) {
      let result = this.dateArr.find((val) => {
        return val.itemValue - 0 === item.validDay - 0
      })
      return result ? result.itemName : '年'
    },
    getCurMenu(obj, num) {
      this.saveOrderData = {
        corpId: getCookie('corpId'),
        packageId: obj.id,
        packageNum: num,
        orderPayprice: '',
        reOrder: 0
      }
      this.newInfo = {
        name: obj.name,
        price: obj.price / 100,
        num: num,
        dateUnit: obj.dateUnit,
        countPrice: obj.discountsPrice * num / 100
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/mixin'
.orderPay
  .orderpay-wrapper
    .buy-info
      .new-info, .old-info
        margin-top 29px
        .title
          margin-bottom 13px
          font-weight bold
    .order-summary
      background-color #f7f9fa
      padding 20px
      text-align right
      .prev-wrapper
        text-align left
        padding-left 100px
        padding-bottom 15px
        display inline-block
        border-bottom solid 1px #cacbcc
      .order-item
        text-align left
        clear()
        .order-float
          float right
          .span1, .span2
            display inline-block
          .span1
            margin-right 12px
            color #525253
          .span2
            color #606366
          .fixed-width
            width 78px
            text-align right
          .company-color
            color #303133
      .discount
        margin-top 15px
      .actual
        margin-bottom 20px
        margin-top 15px
        .order-float
          .span2
            color #f56c6c
            font-size 30px
          .fuhao
            font-size 14px
    .submit
      margin-top 20px
      clear()
      .submit-left
        float left
        margin-top 14px
        .check
          span
            color: #409eff
            cursor pointer
      .submit-right
        float right
        .cancel
          width 100px
          margin-right 20px
        .tijiao
          width 100px
          background-color #f56c6c
          border-color #f56c6c
</style>
