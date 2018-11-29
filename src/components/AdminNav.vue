<template>
  <div class="admin-nav" :class="{bigWidth:collapsed, smallWidth:!collapsed}">
    <div class="nav-unfold" v-show="collapsed">
      <div class="nav-icon">
        <div class="nav-icon-img">
          <img src="http://xingke100.com/logo.png" alt="">
        </div>
        <div class="nav-icon-text">销大师</div>
      </div>
      <div class="nav-main">
        <ul>
          <li v-for="(item, index) in mainMenuList" :key="index" :class="{active:routerInfo.path.indexOf(item.menuUrl)>=0}" class="nav-item" @click="goToRouter(item.menuUrl, item.isSecond)" @mouseover="mouseActive(index)" @mouseout="mouseUnActive(index)">
            <div class="img-iconfont">
              <i class="iconfont" :class="item.fontClass"></i>
            </div>
            <div class="text">
              {{item.menuName}}
            </div>
          </li>
        </ul>
      </div>
      <div class="nav-service">
        <div class="left">
          <img src="@/assets/images/navbig/servicenav.png" alt="">
        </div>
        <div class="right">
          客服中心
        </div>
      </div>
    </div>
    <div class="nav-packup" v-show="!collapsed">
      <div class="nav-icon">
        <div class="nav-icon-img">
          <img src="http://xingke100.com/logo.png" alt="">
          <Tooltip content="销大师" placement="right" :transfer="true">
            <div class="text-tootip"></div>
          </Tooltip>
        </div>
      </div>
      <div class="nav-main">
        <ul>
          <li v-for="(item, index) in mainMenuList" :key="index" class="nav-item" :class="{active:routerInfo.path.indexOf(item.menuUrl)>=0}" @click="goToRouterPackup(item.menuUrl, item.isSecond)" @mouseover="mouseActive(index)" @mouseout="mouseUnActive(index)">
            <Tooltip :content="item.menuName" placement="right" :transfer="true">
              <div class="text-tootip"></div>
            </Tooltip>
            <div class="img-iconfont">
              <i class="iconfont" :class="item.fontClass"></i>
            </div>
          </li>
        </ul>
      </div>
      <div class="nav-service">
        <Tooltip content="客服中心" placement="right" :transfer="true">
          <div class="text-tootip"></div>
        </Tooltip>
        <div class="left">
          <img src="@/assets/images/navbig/servicenav.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'adminNav',
  data() {
    return {
      unfoldData: [
        {
          fontClass: "icon-gaikuang",
          name: '概况',
          urlName: 'survey'
        },
        {
          fontClass: "icon-weixin",
          name: '公众号',
          urlName: 'tencent',
          isSecond: true,
        },
        {
          fontClass: "icon-yuangong",
          name: '员工',
          urlName: 'stuff'
        },
        {
          fontClass: "icon-zuoxi",
          name: '坐席',
          urlName: 'seats'
        },
        {
          fontClass: "icon-yingxiao",
          name: '营销'
        },
        {
          fontClass: "icon-qunfa",
          name: '群发'
        },
        {
          fontClass: "icon-fensi",
          name: '粉丝'
        },
        {
          fontClass: "icon-tongji",
          name: '统计'
        },
        {
          fontClass: "icon-shezhi",
          name: '设置',
          urlName: 'setting',
          isSecond: true
        }
      ],
      mouseStatus: -1
    }
  },
  computed: {
    ...mapGetters({
      collapsed: 'nav/getCollapsed',
      routerInfo: 'nav/getRouterInfo',
      mainMenuList: 'nav/getMainMenuList'
    })
  },
  mounted() {
  },
  methods: {
    mouseActive(index) {
      this.mouseStatus = index
    },
    goToRouter(name, isSecond) {
      if (isSecond) {
        if (this.routerInfo.path.indexOf(name) < 0) {
          // for (let k in this.secondMenu) {
          //   if (k === name) {
          //     this.setCookie('secondMenu', this.secondMenu[k])
          //     this.$root.Bus.$emit('selectSecondMenu')
          //     break
          //   }
          // }
          this.$router.push({
            name: name
          })
        }
      } else {
        this.$router.push({
          name: name
        })
      }
    },
    goToRouterPackup(name, isSecond) {
      if (isSecond) {
        this.setCollapsed(true)
        if (this.routerInfo.path.indexOf(name) < 0) {
          // for (let k in this.secondMenu) {
          //   if (k === name) {
          //     this.setCookie('secondMenu', this.secondMenu[k])
          //     this.$root.Bus.$emit('selectSecondMenu')
          //     break
          //   }
          // }
          this.$router.push({
            name: name
          })
        }
      } else {
        this.$router.push({
          name: name
        })
      }
    },
    mouseUnActive(index) {
      this.mouseStatus = -1
    },
    ...mapActions({
      setCollapsed: 'nav/setCollapsed'
    })
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.admin-nav
  height 100%
  background-color #242b33
  overflow hidden
  .ivu-tooltip
    position absolute
    z-index 10
    opacity 0
    width 100%
    height 100%
    .ivu-tooltip-rel
      width 100%
      height 100%
      .text-tootip
        width 100%
        height 100%
  &.bigWidth
    transition all 0.2s
    width 120px
  &.smallWidth
    transition all 0.2s
    width 60px
  .nav-unfold, .nav-packup
    .nav-icon
      margin-top 33px
      .nav-icon-img
        cursor pointer
        position relative
        height 52px
        img
          transition all 0.5s 
          position absolute
          left 33px
          width 54px
          height 54px
      .nav-icon-text
        display inline-block
        width 48px
        color #fff
        height 16px
        font-size 16px
        margin 9px 0 32px
        margin-left 34px
    .nav-main
      .nav-item
        position relative
        height 50px
        line-height 50px
        cursor pointer
        &:hover, &.active
          background-color #35404c
          .img-iconfont .iconfont, .text
            color #fff
        .img-iconfont
          position absolute
          top 0px
          left 30px
          .iconfont 
            font-size: 18px
            color #a8adb2    
        .text
          width 42px
          left 58px
          position absolute
          color #a8adb2
    .nav-service
      position relative
      height 50px
      line-height 50px
      margin-top 75px
      cursor pointer
      background-color #1c64ae
      .left
        position absolute
        left 20px
        img
          width 18px
          display inline-block
          vertical-align middle
      .right
        position absolute
        left 43px
        width 56px
        color #fff
  .nav-packup
    .nav-icon
      .nav-icon-img
        img
          left 13px
          width 33px
          height 33px
          transition all 0.5s 
    .nav-main
      margin-top 57px
      .nav-item
        .img-iconfont
          position absolute
          top 0px
          left 18px
          .iconfont 
            font-size: 18px
            color #a8adb2   
    .nav-service
      .left
        left 19px
        text-align center
        img
          width 21px
</style>

