<template>
  <div class="header">
    <div class="header-left">
      <div class="icon">
        <router-link tag="div" :to="{name:'home'}">
          <img src="@/assets/images/icon.png" alt="icon">
          <div class="text">迎客通</div>
        </router-link>
      </div>
    </div>
    <div class="header-center">
      <Menu mode="horizontal" theme="light" active-name="0" @on-select="selectMenu">
        <MenuItem name="home">
          首页
        </MenuItem>
        <MenuItem name="company">
          产品介绍
        </MenuItem>
        <MenuItem name="personInfo">
          客户案例
        </MenuItem>
        <MenuItem name="4">
          使用帮助
        </MenuItem>
        <MenuItem name="5">
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
          <router-link tag="p" :to="{name:'register', params:{step:0}}">免费试用</router-link>
        </div>
      </div>
      <div class="login-after" v-show="userStatus == 2">
        <Dropdown trigger="hover" :transfer="true" @on-click="enterRoute">
          <div class="user">
            <div class="user-img">
              <img v-if="userStatus == 2" :src="userInfo.picUrl" alt="userImg">
            </div>
            <div class="user-name" v-if="userStatus == 2">{{userInfo.nickName}}</div>
            <Icon type="arrow-down-b"></Icon>
          </div>
          <DropdownMenu slot="list" class="userDrop">
            <DropdownItem name="company"><Icon size="16" type="home"></Icon>我的企业</DropdownItem>
            <DropdownItem name="personInfo"><Icon size="16" type="person"></Icon>个人中心</DropdownItem>
            <DropdownItem name="quit"><Icon size="16" type="power"></Icon>退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken, removeToken, removeCookie } from '@/assets/js/cookies'
import { logout } from '@/api/query'
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
      if (name === 'home') {
        this.$router.push({ name: name })
      }
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
          removeCookie('accountList')
          removeCookie('currentCorp')
          this.$router.push({ name: 'login' })
        }
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~@/assets/stylus/mixin'
.header
  height 60px
  border-bottom solid 1px #dcdee2
  background-color #fff
  clear()
  .header-left
    float left
    line-height 60px
    margin-left 120px
    .icon
      cursor pointer
      clear()
      img
        float left
        margin-top 16px
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
        float left
        padding 7px 12px
        margin-top 17px
        cursor pointer
        &:nth-of-type(1)
          margin-right 34px
        &:nth-of-type(2)
          background-color #409eff
          border-radius 4px
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


