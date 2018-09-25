<template>
  <div class="tmpQrcode">
    <div class="qrcode-img" :style="styles">
      <Spin fix v-show="loadingImg">
        <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
        <div>loading</div>
      </Spin>
      <img class="img" v-if="loginData.url" :src="loginData.url" alt="tmpQrcode">
      <div class="loss" v-show="status == 3">
        <div class="loss-center" :class="{registerCenter: qrcodeType=='Register'}">
          <img src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
          二维码已失效
        </div>
      </div>
    </div>
    <div class="status-tips">
      <div class="tips">
        <div v-show="status == 1 && qrcodeType=='Login'">
          <img class="wechat" src="@/assets/images/wechat.png" alt="right">
          微信扫一扫登录
        </div>
        <div v-show="status == 2">
          <img src="@/assets/images/right.png" alt="right">
          {{tips}}
        </div>
        <div class="btn" v-show="status == 3">
          <Button type="primary" @click="refresh" :disabled="refreshBtn">
            <Icon type="refresh"></Icon>
            点击刷新
            </Button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import {
  getTmpQrcode,
  getSession,
  getPersonalInfo,
  getDefaultInfo,
  getUserCorpAuthMulti
} from '@/api/query'
import { setToken, setCookie } from '@/assets/js/cookies'
export default {
  props: {
    styles: {
      type: Object,
      default: () => {
        return {
          width: '180px',
          height: '180px'
        }
      }
    },
    qrcodeType: {
      type: String,
      default: 'Login'
    },
    tips: {
      type: String,
      default: '登录成功 正在跳转'
    }
  },
  data() {
    return {
      loginData: [],
      appAccountId: '',
      loadingImg: true,
      timer: null,
      status: 1,
      refreshBtn: false,
      tokenData: {}
    }
  },
  created() {
    this.getDefaultInfo()
    this.getTmpQrcode()
  },
  methods: {
    getUserCorpAuthMulti() {
      // let params = {
      //   offset: this.offset,
      //   limit: 10,
      //   // ASC
      //   order: 'ASC'
      // }
      getUserCorpAuthMulti().then(data => {
        if (data.code === 1) {
          setCookie('currentCorp', data.data[0], 0.5)
          this.$router.push({ name: 'survey' })
        }
      })
    },
    refresh() {
      this.refreshBtn = true
      this.getTmpQrcode()
    },
    getDefaultInfo() {
      getDefaultInfo().then(data => {
        this.appAccountId = data.data.defaultWechatAccountid
        this.tokenData = Object.assign({}, this.tokenData, data.data)
      })
    },
    getTmpQrcode() {
      let params = {
        platformType: 3,
        qrcodeType: 'TMPQRCODE_LOGIN_SESSIONID',
        expireSeconds: 6000,
        appAccountId: this.appAccountId,
        corpId: null,
        mobile: null
      }
      this.loadingImg = true
      getTmpQrcode(params)
        .then(data => {
          if (data.code === 1) {
            this.refreshBtn = false
            this.status = 1
            this.loadingImg = false
            this.loginData = data.data
            this.getSession()
            this.timer = setInterval(() => {
              this.getSession()
            }, 5000)
            setTimeout(() => {
              this.status = 3
              clearInterval(this.timer)
              this.timer = null
            }, 180 * 1000)
          }
        })
        .catch(() => {
          this.refreshBtn = false
        })
    },
    getPersonalInfo() {
      getPersonalInfo().then(data => {
        if (data.code === 1) {
          this.status = 2
          this.tokenData.corpList = data.data.corpList.length
          setToken(this.tokenData, 0.5)
          if (data.data.corpList.length === 0) {
            setTimeout(() => {
              if (this.qrcodeType === 'Register') {
                this.$emit('steps', 2)
              } else {
                this.$Message.warning('您还没有绑定企业，请先绑定企业')
                this.$router.push({
                  name: 'register',
                  params: {
                    step: 2
                  }
                })
              }
            }, 1500)
          } else if (data.data.corpList.length === 1) {
            this.getUserCorpAuthMulti()
          } else {
            setTimeout(() => {
              this.$router.push({ name: 'company' })
            }, 1500)
          }
        }
      })
    },
    getSession() {
      getSession()
        .then(data => {
          if (data.code === 1) {
            clearInterval(this.timer)
            this.timer = null
            this.status = 2
            this.tokenData = Object.assign({}, this.tokenData, data.data)
            this.tokenData.corpList = 0
            setToken(this.tokenData, 0.5)
            if (data.data.mobileStatus !== 'BIND') {
              if (this.qrcodeType === 'Register') {
                this.$emit('steps', 1)
              } else {
                setTimeout(() => {
                  this.$Message.warning('您还没有绑定手机，请先绑定手机')
                  this.$router.push({
                    name: 'register',
                    params: {
                      step: 1
                    }
                  })
                }, 1500)
              }
            } else {
              this.getPersonalInfo()
            }
          } else if (data.code === 200) {
          }
        })
        .catch(() => {
          clearInterval(this.timer)
          this.timer = null
        })
    }
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="stylus">
.tmpQrcode
  display inline-block
  .qrcode-img
    position relative
    .loss
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      background-color rgba(255, 255, 255, 0.9)
      .loss-center
        margin-top 75px
        &.registerCenter
          margin-top 80px
        img
          display inline-block
          vertical-align middle
    .img
      width 100%
  .status-tips
    margin-top 13px
    .tips
      height 40px
      line-height 24px
      margin-bottom 10px
      img
        display inline-block
        vertical-align middle
      .btn
        .ivu-btn
          width 100%
          margin-bottom 15px
    .tips
      .wechat
        width 24px
</style>

