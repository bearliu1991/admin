<template>
  <div id="tencent">
    <div class="second-nav" :class="{secondcollapsed:!collapsed}">
      <div class="nav-title">
        公众号
      </div>
      <div class="second-nav-link">
        <div class="second-nav-item" :class="{active: routerInfo.path.indexOf('tencent/tencentManage')>=0}">公众号管理</div>
        <div class="second-nav-item">自定义菜单</div>
        <div class="second-nav-item">个性化菜单</div>
        <div class="second-nav-item">素材管理</div>
        <div class="second-nav-item">自动回复</div>
      </div>
    </div>
    <!-- <div> -->
    
    <div class="tencent-wrapper" :class="{tencentcollapsed:!collapsed}">
      <scroll-bar>
        <router-view></router-view>
      </scroll-bar>
    </div>
    
    <!-- </div> -->
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'tencent',
  computed: {
    ...mapGetters({
      collapsed: 'nav/getCollapsed',
      routerInfo: 'nav/getRouterInfo'
    })
  }
}
</script>
<style lang="stylus">
  .second-nav
    position fixed
    z-index 10
    overflow hidden
    width 120px
    height 100%
    transition all 0.2s
    &.secondcollapsed
      width 0
    .nav-title
      padding-left 20px
      width 120px
      margin-top 43px
      color: #909499
    .second-nav-link
      width 120px
      margin-top 12px
      .second-nav-item
        position relative
        cursor pointer
        color: #0c0c0d
        height 40px
        padding-left 20px
        line-height 40px
        border-radius 3px
        &:hover
          background-color #ffffff
          &:after
            position absolute
            content ''
            left 10px
            top 13px
            width 3px
            height 12px
            background-color #409eff
        &.active
          background-color #ffffff
          &:after
            position absolute
            content ''
            left 10px
            top 13px
            width 3px
            height 12px
            background-color #409eff
  #tencent
    height 100%
    .tencent-wrapper
      padding-bottom 10px
      height 100%
      margin-left 130px
      transition all 0.2s
      background-color #fff
      &.tencentcollapsed
        margin-left 0
</style>

