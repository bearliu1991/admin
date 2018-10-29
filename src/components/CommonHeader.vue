<template>
  <div class="header">
    <div class="header-left">
      <div class="icon">
        <router-link tag="div" :to="{name:'home'}">
          <img src="http://xingke100.com/logo.png" alt="icon">
          <div class="text">销大师</div>
        </router-link>
      </div>
    </div>
    <div class="header-center">
      <Menu mode="horizontal" theme="light" active-name="0" @on-select="selectMenu">
        <MenuItem name="home">
          首页
        </MenuItem>
        <MenuItem name="product">
          产品介绍
        </MenuItem>
        <MenuItem name="service">
          服务优势
        </MenuItem>
        <MenuItem name="contact">
          联系我们
        </MenuItem>
      </Menu>
    </div>
    <div class="header-right">
      <div class="login-before" v-show="userStatus == 1">
        <div>
          <router-link to="/login">登录</router-link>
        </div>
        <div>
          <p @click="toRegister">免费试用</p>
        </div>
      </div>
      <div class="login-after" v-show="userStatus == 2">
        <Dropdown trigger="click" @on-click="enterRoute">
          <div class="user">
            <div class="user-img">
              <img v-if="userStatus == 2" :src="userInfo.picUrl" alt="userImg">
            </div>
            <div class="user-name" v-if="userStatus == 2">{{userInfo.nickName}}</div>
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
</template>
<script>
import { getToken, removeToken, removeCookie, removeCookieSession } from '@/utils/cookies'
import { logout } from '@/api/query'
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      userInfo: getToken() || null,
      userStatus: 1
    }
  },
  mounted() {
    this.isLogin()
  },
  methods: {
    enterRoute(name) {
      if (name !== 'quit') {
        this.$router.push({ name: name })
      } else {
        this.logout()
      }
    },
    selectMenu(name) {
      this.setAnchor(name)
      this.$router.push({ name: 'home' })
    },
    isLogin() {
      if (this.userInfo) {
        this.userStatus = 2
      } else {
        this.userStatus = 1
      }
    },
    logout() {
      logout().then(data => {
        if (data.code === 1) {
          removeToken()
          removeCookieSession()
          removeCookie('accountList')
          removeCookie('currentCorp')
          removeCookie('preAuthCode')
          removeCookie('saveStepsData')
          removeCookie('companyParams')
          removeCookie('seatsInfo')
          removeCookie('orderId')
          removeCookie('corpId')
          removeCookie('orderPayPrice')
          removeCookie('isCreatCompany')
          removeCookie('corpName')
          removeCookie('nextOrderStep')
          this.$router.push({ name: 'login' })
        }
      })
    },
    toRegister() {
      this.setStep(0)
      this.$router.push({name: 'register'})
    },
    ...mapActions({
      setStep: 'user/setStep',
      setAnchor: 'user/setAnchor'
    })
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~@/assets/stylus/mixin'
.header
  position fixed
  height 60px
  top 0
  left 0
  border-bottom solid 1px #dcdee2
  background-color #fff
  z-index 50
  width 100%
  min-width 1057px
  clear()
  .header-left
    float left
    line-height 60px
    margin-left 120px
    .icon
      cursor pointer
      clear()
      img
        width 33px
        height 32px
        float left
        margin-top 14px
      .text
        float left
        font-size 21px
        margin-left 5px
        color #0f0f0f
  .header-center
    float left
    margin-left 91px
    .ivu-menu-horizontal .ivu-menu-item
      padding 0 35px
  .header-right
    float right
    margin-right 124px
    font-size 14px
    .login-before
      clear()
      div
        margin-top 13px
        float left
        cursor pointer
        height 34px
        line-height 34px
        border-radius 3px
        text-align center
        a
          color #409eff
          display inline-block
          width 100%
          height 100%
        &:nth-of-type(1)
          margin-right 34px
          width 90px
          border: solid 1px #409eff 
        &:nth-of-type(2)
          width 110px
          background-color #409eff
          color #fff
    .login-after
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
</style>


