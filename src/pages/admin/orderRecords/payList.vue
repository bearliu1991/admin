<template>
  <div id="payList">
    <Table :columns="columns" :data="payList"></Table>
    <SelfModal v-model="showPop" :zIndex="showPop && '0'" v-if="showPop">
      <div class="modal_cont">
        <div class="titles">
          <h3>付款方信息</h3>
          <Icon class="icons" type="ios-close-empty" size="36" @click="showPop = false"></Icon>
        </div>
        <Row type="flex" class="rows" aligin="top" v-for="(item, key, index) in popObj" :key="index">
          <Col class="first_col">{{key}}</Col>
          <Col class="sec_col">
            <span v-if="key !== '打款凭证'">{{item}}</span>
            <ImgEnlarge v-if="key === '打款凭证'" :imgUrl="item"></ImgEnlarge>
          </Col>
        </Row>
      </div>
    </SelfModal>
  </div>
</template>
<script>
  import Const from './const'
  export default {
    name: '',
    data() {
        return {
          columns: Const.payListColumn(this.showPayList),
          payList: [],
          showPop: false,
          popObj: {}
        }
    },
    watch: {
      details() {
        let list = this.details && this.details.payDetailList
        if (list) {
          for (let val of list) {
            val.orderPayprice = (this.details.orderPayprice - 0) / 100
          }
          this.payList = this.details.payDetailList
        }
      } 
    },
    props: ['details'],
    created() {

    },
    components: {},
    methods: {
      showPayList(val) {
        if (val) {
          this.showPop = true
          this.popObj = {
            '名称': val.accountName,
            '账户': val.accountNo,
            '付款时间': val.payTime,
            '打款凭证': val.payVoucher
          }
          if (this.details.status === 4) {
            this.popObj['审核失败原因'] = val.authMisc
            this.popObj['审核时间'] = val.authTime
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #payList
    .modal_cont
      width: 600px
      padding:20px
      padb(40px)
      bgColor()
      .titles
        overflow:hidden
        mb(45px)
        h3
          fn(18px)
          normal()
          fl()
          mt(8px)
        .icons
          fr()
          cursor()
      .rows
        mb(15px)
        line-height:18px
        .first_col
          width:120px
          padl(20px)
        .sec_col
          width: calc(100% - 140px)
        img
          height 100px
          width: 180px
          
</style>
