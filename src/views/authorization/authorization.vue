<template>
  <div id="authorization">
    <div class="auth-header">
      <div><img src="@/assets/images/admin/weixin.png" alt=""></div>
      <div>微信公众平台</div>
      <div>迎客通</div>
    </div>
    <div class="auth-main">
      <div class="auth-title">公众平台账号授权</div>
      <div class="auth-wrapper">
        <div class="already-auth auth-item" v-show="status == 3">
          <div class="auth-img">
            <Icon type="information-circled" size="46" color="#F7BA2B"></Icon>
          </div>
          <div class="result">公众号已授权</div>
          <div class="tips">该公众号已被授权给迎客通其他企业，请尝试其他公众号，或将此公众号解绑后再行授权</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost" @click="getAuthUrl">其他公众号</Button>
            <Button size="small" class="right" type="primary"  @click="goTencent">继续使用</Button>
          </div>
        </div>
        <div class="auth-error auth-item" v-show="status == 2">
          <div class="auth-img">
            <Icon type="close-circled" size="46" color="#F46C6C"></Icon>
          </div>
          <div class="result">授权失败</div>
          <div class="tips">公众号授权失败，请重新扫码授权</div>
          <div class="single-btn">
            <Button size="small" type="primary"  @click="getAuthUrl">重新授权</Button>
          </div>
        </div>
        <div class="ansy-auth auth-item" v-show="status == 0">
          <div class="auth-img auth-loading">
            <Spin fix>
              <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
            </Spin>
          </div>
          <div class="result">同步数据</div>
          <div class="tips">预计{{countNum}}s后完成，请稍后…</div>
        </div>
        <div class="ansy-error auth-item" v-show="status == 4">
          <div class="auth-img">
            <Icon type="close-circled" size="46" color="#F46C6C"></Icon>
          </div>
          <div class="result">数据同步失败</div>
          <div class="tips">数据同步失败，该公众号授权可能失败，您可重新授权或点击查看公众号是否授权成功</div>
          <div class="float-btn">
            <Button size="small" class="left" type="ghost" @click="getAuthUrl">重新授权</Button>
            <Button size="small" class="right" type="primary" @click="goTencent">查看公众号</Button>
          </div>
        </div>
        <div class="success-auth auth-item" v-show="status == 1">
          <div class="auth-img">
            <Icon type="checkmark-circled"  size="46" color="#3FB738"></Icon>
          </div>
          <div class="result">授权成功</div>
          <div class="tips">数据同步完成，公众号授权成功，您可正常使用迎客通系统</div>
          <div class="single-btn">
            <Button size="small" type="primary"  @click="goTencent">立即使用</Button>
          </div>
        </div>
        <div class="end-end">
          <div class="left">
            <img src="@/assets/images/icon.png" alt="">
          </div>
          <div class="right">
            <div>迎客通</div>
            <div>
              企业级微信CRM平台，基于微信公众号管理粉丝关系，了解粉丝的行为及喜好。利用数据让你的营销变得更聪明。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setCookie, getCookie } from '@/assets/js/cookies'
import { getScanResult, getAuthUrl, updateBindCorp } from '@/api/query'
export default {
  name: 'authorization',
  data() {
    return {
      timer: null,
      numTime: null,
      outTime: null,
      thirdplatUrl: '',
      status: 0,
      authCode: '',
      countNum: 10,
      randomStr: '',
      preAuthCode: getCookie('preAuthCode')
    }
  },
  mounted() {
    if (this.$route.query) {
      this.authCode = this.$route.query.auth_code
    }
    this.getAuthorization()
    this.numTime = setInterval(() => {
      this.countNum--
    }, 1000)
    this.outTime = setTimeout(() => {
      this.status = 4
      clearInterval(this.timer)
      clearInterval(this.numTime)
      this.timer = null
      this.numTime = null
    }, 10000)
  },
  methods: {
    goTencent() {
      this.$router.push({ name: 'tencentManage' })
    },
    getAuthUrl() {
      let params = {
        redirectUrl: 'http://xingke100.com:8080/authorization',
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
          setCookie('preAuthCode', data.data.preAuthCode)
          this.preAuthCode = data.data.preAuthCode
          location.href = this.thirdplatUrl
          // window.open(this.thirdplatUrl, '_blank')
        }
      })
    },
    getAuthorization() {
      let params = {
        randomStr: this.authCode,
        preAuthCode: this.preAuthCode
      }
      updateBindCorp(params).then(data => {
        switch (data.code) {
          case 1:
            this.randomStr = data.data.randomStr
            this.intervalLoop()
            this.status = 0
            break
          // 验证无效
          case 2517:
            break
          // 验证失败
          case 2518:
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            this.status = 2
            break
          // 授权码已经绑定过 COMPONENT_AUTHCODE
          case 2521:
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            this.status = 3
            break
          // 数据已被禁用  
          case 2522:
            this.$Message.error('授权失败，数据已被禁用')
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          // 数据已被停用
          case 2523:
            this.$Message.error('授权失败，数据已被停用')
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          default:
            break
        }
      }).catch(() => {
        this.status = 4
        clearTimeout(this.outTime)
        clearInterval(this.timer)
        clearInterval(this.numTime)
        this.outTime = null
        this.timer = null
        this.numTime = null
      })
    },
    getScanResult() {
      let params = {
        // qrcodeType: 'COMPONENT_AUTHCODE',
        qrcodeType: 'SYNC_WX_PUBLIC_ACCOUNT',
        randomStr: this.randomStr
      }
      getScanResult(params).then(data => {
        switch (data.code) {
          case 1:
            this.status = 1
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          case 2517:
            break
          case 2518:
            this.status = 4
            clearTimeout(this.outTime)
            clearInterval(this.timer)
            clearInterval(this.numTime)
            this.outTime = null
            this.timer = null
            this.numTime = null
            break
          default:
            break
        }
      }).catch(() => {
        this.status = 4
        clearTimeout(this.outTime)
        clearInterval(this.timer)
        clearInterval(this.numTime)
        this.outTime = null
        this.timer = null
        this.numTime = null
      })
    },
    intervalLoop() {
      if (this.timer) {
        return
      }
      this.timer = setInterval(() => {
        this.getScanResult()
      }, 2000)
    }
  },
  destroyed() {
    clearTimeout(this.outTime)
    clearInterval(this.timer)
    clearInterval(this.numTime)
    this.outTime = null
    this.timer = null
    this.numTime = null
  }
}
</script>
<style lang="stylus">
@import './authorization.styl'
</style>


