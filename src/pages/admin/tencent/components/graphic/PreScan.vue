<template>
  <div class="preSan">
    <div class="scan_wrap">
      <Button type="primary" size="small" class="scan_button" @click.stop="clickBtn">预览</Button>
      <!-- <Button type="primary" class="scan_button" @click.stop="clickBtn">选择</Button> -->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'preSan',
    data() {
      return {

      }
    },
    props: ['type', 'val'],
    methods: {
      clickBtn() {
        (!this.type || (this.type === 'link')) && window.open(this.val, "_blank")
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
  .preSan
    absolute()
    right:0
    left:0
    top:0
    bottom:0
    bgColor(rgba(0,0,0, 0.3))
    .scan_wrap
      absolute()
      left 50%
      top 50%
      fn(14px)
      transform: translate(-50%, -50%)
      .scan_button
        background #409eff
        padding 0
        radius(3px)
        height 28px
        line-height 28px
        width: 66px
        &:first-child
          mr(15px)
</style>
