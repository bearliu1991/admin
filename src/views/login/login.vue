<template>
  <div id="login">
    <div class="login-header">
      <div class="header-left">
        <div class="icon">
          <router-link tag="div" :to="{name:'home'}">
            <img src="@/assets/images/icon.png" alt="icon">
            <div class="text">迎客通</div>
          </router-link>
        </div>
      </div>
      <div class="header-right">
        <span class="select-login">
          <router-link to="/register/0">免费试用</router-link>
        </span>
      </div>
    </div>
    <div class="login-main">
      <div class="center">
        <div class="official">
          <div class="official-wrapper">
            <h2>迎客通</h2>
            <div class="item">云计算</div>
            <div class="item">大数据</div>
            <div class="item">社交传播</div>
          </div>
        </div>
        <div class="login-form">
          <div class="title">欢迎登录迎客通</div>
          <div class="content">
            <tmp-qrcode></tmp-qrcode>
            <!-- <div class="weixin">
              <Spin fix v-show="loadingImg">
                  <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
                  <div>loading</div>
              </Spin>
              <img v-if="loginData.url" :src="loginData.url">
            </div>
            <div class="tips success">
              <div v-show="status == 1">
                <img src="@/assets/images/right.png" alt="right">
                登录成功 正在跳转…
              </div>
            </div>
            <div class="tips dex">
              <span>微信扫一扫</span>
            </div>
            <div class="tips err" v-show="false">
              <div>
                <img src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
                二维码已过期
              </div>
            </div>
            <div class="tips done" v-show="false">
              <div>
                <span>您可以点击</span>
                <span class="refresh">刷新二维码</span>
                <span>重新微信扫码登录</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <commonFooter></commonFooter>
    </div>
  </div>
</template>

<script>
import {
  logout
} from '@/api/query'
import { removeToken } from '@/assets/js/cookies'
export default {
  data() {
    return {
      // 1 成功 2 过期
    }
  },
  created() {
    this.logout()
  },
  mounted() {
  },
  methods: {
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          removeToken()
        }
      })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#login
  width 100%
  height 100%
  min-height 762px
  background-image url('../../assets/images/login-bg.png')
  background-position 50% 50%
  background-size 100%
  .login-header
    z-index 2
    height 60px
    .header-left
      clear()
      float left
      line-height 60px
      margin-left 30px
      .icon
        cursor pointer
        clear()
        img
          float left
          margin-top 16px
        .text
          float left
          color #fff
          font-size 16px
          margin-left 5px
    .header-right
      margin-right 30px
      line-height 60px
      float right
      .select-login
        a
          color #ffffff      
  .login-main
    position relative
    width 100%
    text-align center
    margin 116px 0
    clear()
    .center
      display inline-block
    .official
      text-align left  
      float left
      margin-right 351px
      .official-wrapper
        color #ffffff
        h2
          margin-top 46px
          margin-bottom 80px 
          font-size 60px
        .item
          margin-top 38px
          font-size 30px
          padding-left 39px
          position relative
          &:after
            position absolute
            content ''
            width 10px
            height 10px
            background-color #ffffff
            border-radius 50%
            top 50%
            margin-top -5px
            left 0
    .login-form
      float left
      height 425px
      width 490px
      background-color #fff
      margin-top 5px
      box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
      hide-boxShadow()
      .title
        font-size 30px
        margin-top 58px
        margin-bottom 62px
      .content
        display inline-block
  .footer
    margin-top 250px
    background-color transparent
    .footer
      background-color transparent
</style>