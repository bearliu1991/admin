<template>
<div class="drawer-main">
  <transition name="slide-fade">
    <div class="drawer" v-if="showDrawer" @click="clickBody">
      <div class="drawer-wrapper" @click.stop>
        <div class="title">
          <span>{{titleTips}}</span>
        </div>
        <div v-if="isScroll" class="content isScroll-content">
          <scroll-bar>
            <slot name="content"></slot>  
          </scroll-bar>
        </div>
        <div v-if="!isScroll" class="content">
          <slot name="content"></slot>  
        </div>
        <div class="footer" v-if="showFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
export default {
  model: {
    prop: "showDrawer",
    event: "close"
  },
  props: {
    showDrawer: {
      default: false,
      type: Boolean
    },
    titleTips: {
      default: '筛选',
      type: String
    },
    isScroll: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    clickBody() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.drawer-main
  .drawer
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    width 100%
    height 100%
    z-index 500
    .drawer-wrapper
      position relative
      float right
      height 100%
      width 640px
      background-color #fff
      box-shadow -5px 0px 8px 0px rgba(3, 0, 0, 0.15)
      .title
        font-size 18px
        padding 29px 20px 15px
        border-bottom solid 1px #edeff0
      .content
        padding 0 20px 0 20px
        margin-bottom 60px
        height calc(100% - 123px)
        >div
          height 100%
          .tab-wrapper
            height 100%
            .ivu-tabs
              height 100%
              .ivu-tabs-content
                height calc(100% - 72px)
                .ivu-tabs-tabpane
                  height 100%
      .isScroll-content
        padding-top 20px          
      .footer
        border-top solid 1px #edeff0
        position absolute
        background-color #fff
        left 0
        bottom 0
        width 100%
        height 60px
        line-height 60px
        text-align center
        >div
          height 100%
  .slide-fade-enter-active, .slide-fade-leave-active
    transition all 0.2s ease-in-out
  .slide-fade-enter, .slide-fade-leave-to
    transform translateX(640px)
</style>


