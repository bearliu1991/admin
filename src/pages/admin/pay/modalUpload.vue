<template>
    <Modal
        class="upload-pingzheng"
        v-model="showModal"
        :title="title"
        :width="width"
        :mask-closable="true"
        @on-visible-change="visibleChange"
        @on-cancel="modalCancel">
        <div>
          <div class="title">            
            收款方信息
          </div>
          <Row class="row-msg">
            <Col span="5" >
              收款方名称
            </Col>
            <Col span="18">
              {{pingzhengInfo.payeeName}}
            </Col>
          </Row>
          <Row class="row-msg">
            <Col span="5">
              收款方开户行
            </Col>
            <Col span="18">
              {{pingzhengInfo.bankName}}
            </Col>
          </Row>
          <Row class="row-msg">
            <Col span="5">
              收款方账号
            </Col>
            <Col span="18">
              {{pingzhengInfo.bankAccount}}
            </Col>
          </Row>
        </div>
        <div>
          <div class="title">            
            付款方信息（请填写好您的付款账号信息或付款凭证）
          </div>
          <Row class="row-msg">
            <Col span="3">
              实付金额
            </Col>
            <Col span="18">
              ￥{{pingzhengInfo.realPayment}}
            </Col>
          </Row>          
        </div>
        <div class="row-msg">
            <RadioGroup v-model="pingzhengInfo.payType" @on-change="payTypeChange">
                <Radio label="0">名称账号信息</Radio>
                <Radio label="1">付款凭证</Radio>
            </RadioGroup>  
        </div>
        <div v-if="pingzhengInfo.payType === '1'">
          <Row class="row-msg">
            <Col span="4">
              <span class="need"></span>打款凭证
            </Col>
            <Col span="18">
              <Upload @uploadSucess="uploadSuccess" v-if="showModal && (pingzhengInfo.payType === '1')"></Upload>
              <div v-if="errorTips.payVoucher" class="err-tip pingzheng">请上传打款凭证</div>
            </Col>
          </Row>          
        </div>
        <div v-else>
          <Row class="row-msg">
            <Col span="4" style="line-height: 40px; ">
              <span class="need"></span>名称
            </Col>
            <Col span="18">
              <Input @on-blur="inputChange('accountName')" v-model="formParams.accountName" placeholder="请填写付款名称" style="width: 360px; "></Input>
              <div class="err-tip" v-if="errorTips.accountName">名称不能为空</div>
            </Col>
          </Row>
          <Row class="row-msg" style="line-height: 40px; ">
            <Col span="4">
              <span class="need"></span>账号
            </Col>
            <Col span="18">
              <Input @on-blur="inputChange('accountNo')" v-model="formParams.accountNo" placeholder="请填写付款账户" style="width: 360px; "></Input>
              <div class="err-tip" v-if="errorTips.accountNo">账号不能为空</div>
            </Col>
          </Row> 
        </div>
        <div>
          <Row class="row-msg">
            <Col span="4" style="line-height: 40px;">
              付款时间
            </Col>
            <Col span="18">
              <DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="dateChange"  :transfer="true" :editable="false" :options="options" type="datetime" placeholder="请选择付款时间" style="width: 228px; "></DatePicker>
            </Col>
          </Row>   
        </div>
        <div slot="footer">
            <Button class="btns-sure" type="primary" @click="modalOk">确定</Button>
            <Button class="btns-cancel" type="ghost" size="large" @click="modalCancel">取消</Button>
        </div>
     </Modal>
</template>

<script>
import { savePayVoucherTradeOrder, saveAccountTradeOrder } from '@/api/query'
import { getCookie } from '@/utils/cookies'
export default {
  name: 'modalValidateForm',
  components: {},
  model: {
    prop: 'modal',
    event: 'close'
  },
  props: {
    modal: {
      default: false,
      type: Boolean
    },
    title: {
      type: String,
      default: '上传凭证'
    },
    width: {
      type: String,
      default: '610'
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    // 传递价钱和订单号的参数字段
    transferProps: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      // modal: false,
      pingzhengInfo: {
        payeeName: '杭州洋财信息技术有限公司',
        bankName: '招商银行股份有限公司杭州高新支行',
        bankAccount: '5719 0782 1710 904',
        realPayment: this.transferProps.orderPayprice,
        payType: '1',
        src: ''
      },
      formParams: {
        payTime: '',
        accountNo: '',
        accountName: '',
        payVoucher: ''
      },
      errorTips: {
        accountNo: false,
        accountName: false,
        payVoucher: false
      },
      options: {
        shortcuts: [
          {
            text: 'Today',
            value() {
              return new Date()
            },
            onClick: picker => {
              this.$Message.info('Click today')
            }
          },
          {
            text: 'Yesterday',
            value() {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              return date
            },
            onClick: picker => {
              this.$Message.info('Click yesterday')
            }
          },
          {
            text: 'One week',
            value() {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              return date
            },
            onClick: picker => {
              this.$Message.info('Click a week ago')
            }
          }
        ]
      }
    }
  },
  mounted() { },
  computed: {
    showModal: {
      get() {
        return this.modal
      },
      set() {}
    }
  },
  methods: {
    // 付款方名称账号确认银行汇款
    saveAccountTradeOrder(params) {
      saveAccountTradeOrder(params).then(data => {
        switch (data.code) {
          case 1:
            this.$emit('success', 2)
            this.$emit('close', false)
            this.$Message.success('上传凭证成功')
            break
          case 3550:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6601:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6605:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6606:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break        
          default:
            break
        }
      })
    },
    // 付款凭证确认银行汇款
    savePayVoucherTradeOrder(params) {
      savePayVoucherTradeOrder(params).then(data => {
        switch (data.code) {
          case 1:
            this.$emit('success', 2)
            this.$emit('close', false)
            this.$Message.success('上传凭证成功')
            break
          case 3550:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6601:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6605:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break
          case 6606:
            this.$emit('close', false)
            this.$Message.warning(data.message)
            break        
          default:
            break
        }
      })
    },
    modalOk() {
      this.errorTips = {
        accountNo: false,
        accountName: false,
        payVoucher: false
      }
      if (this.pingzhengInfo.payType === '0') {
        if (this.formParams.accountName.trim() === '') {
          this.errorTips.accountName = true
        }
        if (this.formParams.accountNo.trim() === '') {
          this.errorTips.accountNo = true
        }
        if (!this.errorTips.accountNo && !this.errorTips.accountName) {
          // 写提交代码
          let params = {
            orderId: getCookie('orderId'),
            accountName: this.formParams.accountName,
            accountNo: this.formParams.accountNo,
            payTime: this.formParams.payTime
          }
          this.saveAccountTradeOrder(params)
        }
      } else {
        if (this.formParams.payVoucher === '') {
          this.errorTips.payVoucher = true
        }
        if (!this.errorTips.payVoucher) {
          // 写提交代码
          let params = {
            orderId: getCookie('orderId'),
            payVoucher: this.formParams.payVoucher,
            payTime: this.formParams.payTime
          }
          this.savePayVoucherTradeOrder(params)
        }
      }
    },
    dateChange(val, newData) {
      this.formParams.payTime = '2018-10-18 17:00:00'
    },
    inputChange(val) {
      if (val === 'accountName') {
        if (this.formParams.accountName === '') {
          this.errorTips.accountName = true
        } else {
          this.errorTips.accountName = false
        }
      } else {
        if (this.formParams.accountNo === '') {
          this.errorTips.accountNo = true
        } else {
          this.errorTips.accountNo = false
        }
      }
    },
    payTypeChange() {
      this.errorTips = {
        accountNo: false,
        accountName: false,
        payVoucher: false
      }
    },
    modalCancel() {
      this.$emit('close', false)
    },
    afterCancel(val) {
      console.log(val)
    },
    visibleChange(val) {
      this.$emit('visibleChange', val)
    },
    uploadSuccess(path) {
      this.errorTips.payVoucher = false
      this.formParams.payVoucher = path
    }
  }
}
</script>

<style lang="stylus">
.upload-pingzheng
  .title
    padding-left 20px
    height 40px
    line-height 40px
    margin 10px 0
    background-color #e6edf5
  .row-msg
    padding-left 20px
    margin 20px 0
    .ivu-col
      position relative
      .err-tip
        position absolute
        color #f56c6c
        line-height 14px
        font-size 12px
        top 41px
      .pingzheng
        top 102px
  .need:before
    content '*'
    color #f00
  .btns-sure
    width 90px
    height 40px
    background-color #409eff
    border-radius 3px
  .btns-cancel
    width 90px
    height 40px
    border-radius 3px
  .ivu-modal-header-inner
    color #0c0c0d
    font-size 18px
  .ivu-modal-header
    border-bottom 0px solid #e3e8ee
  .ivu-modal-footer
    border-top 0px solid #e3e8ee
</style>
