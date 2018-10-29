<template>
  <div class="fullpage-drawer">
    <transition name="slide-fade">
      <div class="fullpage-drawer-wrapper" :class="[position]" v-if="showDrawer">
        <div class="fullpage-header">
          <div class="header-float img">
            <img src="http://xingke100.com/logo.png" alt="icon">
          </div>
          <slot name="header"></slot>
          <div class="header-float-r">
            <Icon class="close" type="android-close" @click="closeDrawer"></Icon>
          </div>
        </div>
        <div class="slot-wrapper">
          <scroll-bar>
            <slot name="slotWrapper"></slot>
          </scroll-bar>
        </div>
      </div>
     </transition>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { removeCookie } from '@/utils/cookies'
export default {
  name: 'fullPageDrawer',
  model: {
    prop: 'showDrawer',
    event: 'close'
  },
  props: {
    showDrawer: {
      default: false,
      type: Boolean
    },
    position: {
      default: 'top',
      type: String
    },
    isClearInfo: {
      default: false,
      type: Boolean
    }
  },
  mounted() {
    this.$root.Bus.$on('hideFullPageDrawer', value => {
      this.$emit('close', false)
    })
  },
  methods: {
    closeDrawer() {
      this.$emit('close', false)
    },
    ...mapActions({
      // 隐藏主页面的滚动条
      setOverStatu: 'user/setOverStatu',
      setIsFullPage: 'pay/setIsFullPage'
    })
  },
  watch: {
    showDrawer(val) {
      if (!val) {
        if (this.isClearInfo) {
          removeCookie('saveStepsData')
          removeCookie('orderPayPrice')
          removeCookie('companyParams')
          removeCookie('orderId')
          removeCookie('corpId')
          removeCookie('isCreatCompany')
          removeCookie('corpName')
          removeCookie('nextOrderStep')
        }
        this.setOverStatu(1)
        this.setIsFullPage(1)
      } else {
        this.setOverStatu(2)
      }
    }
  },
  beforeDestroy() {
    this.$root.Bus.$off('hideFullPageDrawer')
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.fullpage-drawer
  .fullpage-drawer-wrapper
    background-color #fff
    position fixed
    z-index 60
    width 100%
    min-width: 1140px
    overflow auto
    height 100%
    left 0
    top 0
    .fullpage-header
      height 68px
      line-border()
      clear()
      .header-float
        float left
        color #0c0c0d
        font-size 18px
        margin-top 25px
        &.img
          margin-top 18px
          margin-left 20px
          img
            width 33px
            height 32px
        &.xufei
          margin-left 10px
        &.gongsi
          margin-left 20px
          padding-left 20px
          border-left solid 2px #cacbcc
      .header-float-r
        float right
        line-height 68px
        .close
          cursor pointer
          margin-right 28px
          font-size 25px
          color #979899
          &:hover
            color #409eff
    .slot-wrapper
      height calc(100% - 68px)    
  .slide-fade-enter-active, .slide-fade-leave-active
    transition all 0.3s ease-in-out
  .top
    &.slide-fade-enter
      transform translateY(-100%)
    &.slide-fade-leave-to
      transform translateY(-100%)
  .bottom
    &.slide-fade-enter
      transform translateY(100%)
    &.slide-fade-leave-to
      transform translateY(100%)
  .left
    &.slide-fade-enter
      transform translateX(-100%)
    &.slide-fade-leave-to
      transform translateX(-100%)
  .right
    &.slide-fade-enter
      transform translateX(100%)
    &.slide-fade-leave-to
      transform translateX(100%)      
</style>


