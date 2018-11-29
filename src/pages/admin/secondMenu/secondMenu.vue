<template>
  <div id="tencent">
    <div class="second-nav" :class="{secondcollapsed:!collapsed}" v-if="secondMenu">
      <div class="nav-title">
        {{secondMenu.name}}
      </div>
      <div class="second-nav-link" v-for="(item, index) in secondMenu.list" :key="index">
        <div class="second-nav-item" @click="goToRouter(item.menuUrl)" :class="{active: routerInfo.name.indexOf(item.menuUrl || 1)>=0}">{{item.menuName}}</div>
      </div>
    </div>
    <!-- <div> -->
      
    <div v-if="$route.name === 'tencentManage' || $route.path.indexOf('setting') >= 0" class="tencent-wrapper" :class="{tencentcollapsed:!collapsed}">
      <scroll-bar :isTop="true">
        <div class="tencent-wrapper-scroller">
          <router-view></router-view>
        </div>
      </scroll-bar>
    </div>
    <div v-else class="tencent-wrapper1" :class="{tencentcollapsed:!collapsed}">
      <scroll-bar :isTop="true">
        <div class="tencent-wrapper-scroller">
          <router-view></router-view>
        </div>
      </scroll-bar>
    </div>

    <!-- </div> -->
  </div>
</template>
<script>
// import PublicNo from '@/components/currPublicNo'
import {mapGetters} from 'vuex'
export default {
  name: 'tencent',
  computed: {
    ...mapGetters({
      collapsed: 'nav/getCollapsed',
      routerInfo: 'nav/getRouterInfo',
      secondMenu: 'nav/getSecondMenu'
    })
  },
  created() {
  },
  methods: {
    goToRouter(name) {
      if (this.routerInfo.name.indexOf(name) < 0) {
        this.$router.push({
          name: name
        })
      }
    }
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
      font-weight 600
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
    .tencent-wrapper, .tencent-wrapper1
      height 100%
      margin-left 130px
      transition margin-left 0.2s
      border-radius 3px
      .tencent-wrapper-scroller
        padding:20px
        padding-bottom 10px
      &.tencentcollapsed
        margin-left 0
    .tencent-wrapper
      background-color #ffffff
    .tencent-wrapper1
      .tencent-wrapper-scroller
        padding 20px 0px
        padding-bottom 0
</style>

