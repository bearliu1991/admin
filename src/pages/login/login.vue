<template>
  <div id="login">
    <div class="login-header">
      <div class="header-left">
        <div class="icon">
          <router-link tag="div" :to="{name:'home'}">
            <img src="http://xingke100.com/logo.png" alt="icon">
            <div class="text">销大师</div>
          </router-link>
        </div>
      </div>
      <div class="header-right">
        <span class="select-login" v-if="!userInfo">
          <span @click="toRegister">免费试用</span>
        </span>
        <div class="login-after" v-if="userInfo">
          <Dropdown trigger="hover" :transfer="true" @on-click="enterRoute">
            <div class="user">
              <div class="user-img">
                <img :src="userInfo.picUrl" alt="userImg">
              </div>
              <div class="user-name">{{userInfo.nickName}}</div>
              <Icon type="arrow-down-b"></Icon>
            </div>
            <DropdownMenu slot="list" class="userDrop">
              <DropdownItem name="company"><Icon size="16" type="home"></Icon>我的企业</DropdownItem>
              <DropdownItem name="personInfo"><Icon size="16" type="person"></Icon>个人信息</DropdownItem>
              <DropdownItem name="quit"><Icon size="16" type="power"></Icon>退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="login-main">
      <div class="center">
        <div class="official">
          <div class="official-wrapper">
            <h2>销大师</h2>
            <div class="item">云计算</div>
            <div class="item">大数据</div>
            <div class="item">社交传播</div>
          </div>
        </div>
        <div class="login-form">
          <div class="title">欢迎登录销大师</div>
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
import { removeToken, getToken } from '@/utils/cookies'
import {mapActions} from 'vuex'
import CommonFooter from '@/components/CommonFooter'
import TmpQrcode from '@/components/TmpQrcode'
export default {
  data() {
    return {
      // 1 成功 2 过期
      userInfo: getToken() || null,
    }
  },
  created() {
    // this.logout()
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
    },
    toRegister() {
      this.setStep(0)
      this.$router.push({name: 'register'})
    },
    ...mapActions({
      setStep: 'user/setStep'
    })
  },
  components: {
    CommonFooter,
    TmpQrcode
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
  overflow auto
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
          margin-top 14px
          width 33px
          height 32px
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
        span
          cursor pointer
          color #ffffff 
      .login-after
        margin-right 94px
        cursor pointer
        clear()
        .user
          line-height 60px
          .user-img
            float left
            margin-right 5px
            img
              width 36px
              height 36px
              border-radius 50%
              display inline-block
              vertical-align middle
          .user-name
            float left
            padding-right 5px
            max-width 90px
            no-wrap()          
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
  >.footer
    background-color transparent
    .commom-footer-wrapper
      background-color transparent
</style>