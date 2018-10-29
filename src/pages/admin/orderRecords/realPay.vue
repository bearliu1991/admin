<template>
  <div id="realPay">
    <i v-if="status - 0 === 0 || (status - 0 === 2) || (status - 0 === 4)">应</i><i v-else>实</i>付款 &nbsp;&nbsp;&nbsp;&nbsp;<span>¥<i>{{realPay}}</i></span>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      realPay: {
        type: Number,
        default: 0
      },
      status: {
        default: 0
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  #realPay
    span
      color(err_color)
      i
        fn(30px)
</style>
