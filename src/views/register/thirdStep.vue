<template>
  <div class="second-step" @click.stop>
    <Form ref="formBusiness" :model="formBusiness" :rules="ruleValidate"  :label-width="80">
      <FormItem label="企业名称" prop="name" :error="cropName">
          <Input v-model="formBusiness.name" clearable placeholder="请填写企业全称">
          </Input>
      </FormItem>
      <FormItem label="联系人" prop="linkman">
        <Input v-model="formBusiness.linkman" clearable placeholder="请填写联系人姓名"></Input>
      </FormItem>
      <FormItem required label="所在地区" prop="area">
        <Input v-model="formBusiness.area" clearable readonly @on-focus.stop="showCascader" placeholder="请选择省/市/区" icon="chevron-down"></Input>
        <cascader :showCascaderModal="showCascaderModal" @areaSelect="areaSelect" @parentCadcader="parentCadcader"></cascader>
        <!-- <Cascader :transfer="true" :data="provinceData" :load-data="loadData" v-model="formBusiness.area"></Cascader> -->
      </FormItem>
      <FormItem :label-width="0.1">
        <div v-show="type=='new'">
          <Button type="primary" @click="handleSubmit('formBusiness')">完成</Button>
        </div>
        <div class="go-on" v-show="type=='go-on'">
          <Button class="left" type="primary" @click="handleSubmit('formBusiness')">保存</Button>
          <Button class="right" @click="cancal">返回</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {
  saveCorpCreateApply,
  getDefaultInfo,
  getPersonalInfo,
  getUserCorpAuthMulti
} from '@/api/query'
import { getToken, setToken, setCookie } from '@/assets/js/cookies'
import { uuid } from '@/assets/js/util'
export default {
  props: {
    type: {
      default: 'new',
      type: String
    }
  },
  data() {
    const validateArea = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择所在地区'))
      } else {
        callback()
      }
    }
    return {
      formBusiness: {
        name: '',
        linkman: '',
        area: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请填写企业名称！',
            trigger: 'blur'
          }
        ],
        linkman: [
          {
            required: true,
            message: '请填写联系人姓名！',
            trigger: 'blur'
          }
        ],
        area: [
          {
            validator: validateArea,
            trigger: 'change'
          }
        ]
      },
      token: getToken(),
      cropName: '',
      showCascaderModal: false
    }
  },
  mounted() {
    this.getDefaultInfo()
    // this.token.platformDetail = JSON.parse(this.token.platformDetail)
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
    getPersonalInfo() {
      getPersonalInfo().then(data => {
        if (data.code === 1) {
          let tokenData = {}
          tokenData.corpList = data.data.corpList.length
          tokenData = Object.assign({}, this.token, tokenData)
          setToken(tokenData, 0.5)
          if (data.data.corpList.length === 1) {
            this.getUserCorpAuthMulti()
          } else {
            this.$router.push({ name: 'company' })
          }
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.saveCorpCreateApply()
        } else {
        }
      })
    },
    showCascader() {
      this.showCascaderModal = true
    },
    parentCadcader() {
      this.showCascaderModal = false
    },
    saveCorpCreateApply() {
      let areaArr = this.formBusiness.area.split('/')
      let params = {
        applyId: null,
        userId: this.token.userId,
        packId: this.packId,
        regNo: uuid(),
        corpName: this.formBusiness.name,
        contactName: this.formBusiness.linkman,
        corpType: '',
        premises: '',
        telephone: this.token.bindMobile,
        province: areaArr[0],
        city: areaArr[1] || '',
        area: areaArr[2] || '',
        ceo: '',
        regCapital: '',
        startDate: '',
        expires: '',
        busiType: '',
        busScope: '',
        email: '',
        nation: '',
        address: '',
        logo: '',
        remark: ''
      }
      saveCorpCreateApply(params).then(data => {
        switch (data.code) {
          case 1:
            this.getPersonalInfo()
            break
          case 3515:
            this.cropName = '您已创建了该企业'
            break
          default:
            this.$Message.warning('您还没绑定企业')
            break
        }
      })
    },
    areaSelect(areaName) {
      this.formBusiness.area = areaName
    },
    cancal() {
      this.$router.push({ name: 'company' })
    },
    getDefaultInfo() {
      getDefaultInfo().then(data => {
        this.packId = data.data.defaultFreePackage
      })
    }
  }
}
</script>

<style lang="stylus">
.second-step
  width 410px
  margin 109px auto 0
  .ivu-form .ivu-form-item-label
    height 40px
    line-height 1.3
  .ivu-input-group-prepend
    color #cdcdcd
  .ivu-form-item-content
    line-height 40px
    position relative
  .ivu-btn
    height 40px
    width 100%
  .ivu-form-item
    margin-bottom 34px
  .go-on
    .ivu-btn
      height 40px
      width 140px
    .left
      float left
    .right
      float right
</style>


