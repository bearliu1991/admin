<template>
  <div id="editPhone">
    <div class="title">修改手机</div>
    <div class="form">
      <Form label-position="left" ref="formEditPhone" :model="formEditPhone" :rules="ruleValidate"  :label-width="100">
        <FormItem label="原手机号">
            {{$route.params.oldMobile}}
        </FormItem>
        <FormItem label="验证身份">
          <div class="infoAuth">
            <div class="left">
              <Spin fix v-show="loadingImg">
                <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
                <div>loading</div>
              </Spin>
              <img v-if="tmpData.url" :src="tmpData.url" alt="">
            </div>
            <div class="right">
              请用该手机号绑定企业时对应的微信扫码验证您的用户身份
            </div>
          </div>
          <div class="hintInfo">
            <div v-show="verifyStatus==1">
              <Icon size="25" type="checkmark-circled" color="#409eff"></Icon>
              <span>验证成功</span>
            </div>
            <div v-show="verifyStatus==2">
              <img class="img" src="@/assets/images/excalmatory-mark.png" alt="excalmatory">
              <span>验证失败</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="新手机号" prop="phone" :error="alreadyRegister">
          <Input v-model="formEditPhone.phone" clearable placeholder="请填写您更改后的手机号">
            <div slot="prepend">中国大陆+86</div>
          </Input>
        </FormItem>
        <FormItem label="短信验证码" prop="code">
          <Row>
            <Col span="15"><Input v-model="formEditPhone.code" :error="codeError" clearable placeholder="请填写验证码"></Input></Col>
            <Col offset="1" span="8">
              <Button type="primary" @click="intervalTime" :disabled="codeBtn">
                {{oneMinute}}
                <span v-show="codeBtn">秒后重发</span>
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem class="end">
          <div class="go-on">
            <Button class="left" type="primary" @click="handleSubmit('formEditPhone')">保存</Button>
            <Button class="right" @click="cancal">返回</Button>
          </div>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { phone } from '@/assets/js/regExp'
import { getToken } from '@/assets/js/cookies'
import {
  getScanResult,
  updateCorpMobileById,
  resendCode,
  getTmpQrcode,
  getDefaultInfo
} from '@/api/query'
const TIMENUM = 60
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      value = value.alltrim()
      let isPhone = phone.test(value)
      if (isPhone) {
        callback()
      } else {
        callback(new Error('手机格式不正确，请重新输入'))
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length === 4) {
        callback()
      } else {
        callback(new Error('请输入4位验证码'))
      }
    }
    return {
      formEditPhone: {
        phone: '',
        code: ''
      },
      ruleValidate: {
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { validator: validatePhone, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入4位验证码',
            trigger: 'blur'
          },
          {
            validator: validateCode,
            trigger: 'blur'
          }
        ]
      },
      codeBtn: false,
      oneMinute: '获取验证码',
      alreadyRegister: '',
      codeError: '',
      token: getToken(),
      tmpData: {},
      appAccountId: '',
      verifyRandomStr: '',
      verifyStatus: 0,
      timer: null,
      loadingImg: true
    }
  },
  mounted() {
    this.getTmpQrcode()
    this.getDefaultInfo()
  },
  watch: {
    'formEditPhone.phone'(val) {
      if (val.length === 3 || val.length === 8) {
        this.formEditPhone.phone = this.formEditPhone.phone + ' '
      }
    }
  },
  methods: {
    getScanResult() {
      let params = {
        randomStr: this.tmpData.randomStr,
        qrcodeType: 'TMPQRCODE_MODMOBILE_VALID'
      }
      getScanResult(params).then(data => {
        switch (data.code) {
          case 1:
            clearInterval(this.timer)
            this.verifyStatus = 1
            this.verifyRandomStr = data.data.randomStr
            break
          case 2518:
            this.verifyStatus = 2
            break
          case 2517:
            this.verifyStatus = 0
            break 
          default:
            break
        }
      })
    },
    getTmpQrcode() {
      this.loadingImg = true
      let params = {
        platformType: 3,
        qrcodeType: 'TMPQRCODE_MODMOBILE_VALID',
        expireSeconds: 6000,
        appAccountId: this.appAccountId,
        corpId: this.$route.params.applyId,
        mobile: this.$route.params.oldMobile
      }
      getTmpQrcode(params).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          this.tmpData = data.data
          this.timer = setInterval(() => {
            this.getScanResult()
          }, 2000)
        }
      }).catch(() => {
        this.loadingImg = true
      })
    },
    getDefaultInfo() {
      getDefaultInfo().then(data => {
        this.appAccountId = data.data.defaultWechatAccountid
      })
    },
    updateCorpMobileById() {
      let params = {
        applyId: this.$route.params.applyId,
        identifyType: 'MOBILE',
        oldMobile: this.$route.params.oldMobile,
        validateCode: this.formEditPhone.code,
        identifyCode: this.formEditPhone.phone.alltrim(),
        userId: this.token.userId,
        randomStr: this.tmpData.randomStr,
        verifyRandomStr: this.verifyRandomStr
      }
      updateCorpMobileById(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('恭喜你，保存成功！')
            this.$router.push({ name: 'personInfo' })
            break
          case 2501:
            this.codeError = '验证码错误'
            break
          case 2519:
            this.$Message.warning('请先用微信扫描上面的二维码验证身份')
            break
          case 1002:
            this.$Message.warning('请先用微信扫描上面的二维码验证身份')
            break    
          case 2502:
            this.oneMinute = '获取验证码'
            this.codeBtn = false
            this.alreadyRegister = '该手机号已绑定，请重新输入'
            break
          default:
            break
        }
      })
    },
    resendCode() {
      this.codeParams = {
        userId: this.token.userId,
        identifyType: 'MOBILE',
        identifyCode: this.formEditPhone.phone.alltrim(),
        validateCode: null,
        validateCodeType: 1,
        validateCodeLength: 4,
        validateCodeBusiType: 'MODMOBILE_VALID'
      }
      resendCode(this.codeParams).then(data => {
        if (data.code === 1) {
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateCorpMobileById()
        } else {
        }
      })
    },
    cancal() {
      this.$router.push({ name: 'personInfo' })
    },
    intervalTime() {
      this.$refs.formEditPhone.validateField('phone', message => {
        if (!message) {
          this.resendCode()
          this.oneMinute = TIMENUM
          this.codeBtn = true
          let timer = setInterval(() => {
            this.oneMinute--
            if (this.oneMinute <= 0) {
              this.codeBtn = false
              this.oneMinute = '获取验证码'
              clearInterval(timer)
            }
          }, 1000)
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
#editPhone
  padding 42px 43px 20px 43px
  .title
    font-size 20px
  .form
    width 410px
    margin 75px auto
    .ivu-btn
      height 40px
    .ivu-form-item
      margin-bottom 31px
      &:nth-of-type(1)
        margin-bottom 25px
    .end
      .ivu-form-item-content
        margin-left 0 !important
        .go-on
          .ivu-btn
            height 40px
            width 140px
          .left
            float left
          .right
            float right
    .infoAuth
      clear()
      .left
        position relative
        width 120px
        height 120px
        left -8px
        top 5px
        float left
        img
          width 120px
      .right
        position relative
        top 10px
        float left
        line-height 22px
        width 154px
    .hintInfo
      height 32px
      margin-top 3px
      margin-left 8px
      .ivu-icon
        vertical-align middle
        margin-right 5px
      .img
        display inline-block
        margin-right 5px
        vertical-align middle
</style>