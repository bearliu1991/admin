<template>
  <div id="calcMoney">
    <div class="calc_wrap">
      <ul>
        <li>
          <span>付款合计</span>
          <i>¥{{total}}</i>
        </li>
        <li>
          <span>抵扣小计</span>
          <i>¥{{deduction}}</i>
        </li>
      </ul>
      <RealPay :realPay="minusVal" :status="status"></RealPay>
    </div>
  </div>
</template>
<script>
  import RealPay from './realPay'
  export default {
    name: 'calcMoney',
    props: {
      total: {
        type: Number,
        default: 0
      },
      deduction: {
        type: Number,
        default: 0
      },
      status: {
        type: 0
      }
    },
    components: { RealPay },
    computed: {
      minusVal() {
        return this.total !== undefined && (this.deduction !== undefined) ? (this.total - this.deduction) / 100 : 0
      }
    },
    methods: {
      
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #calcMoney
    overflow hidden
    height:110px
    bgColor(#f7f9fa)
    padding: 15px 20px 0 0
    .calc_wrap
      fr()
      ul
        borb()
        mb(5px)
        padl(30px)
        li
          alignR()
          mb(10px)
          span, i
            inline()
          span
            mr(15px)
          i
            min-width:60px
</style>
