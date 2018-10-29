<template>
  <div id="addInput" :style="{height: height + 'px'}">
    <ul class="list">
      <li v-for="(item, key) in details" :key="key" v-if="showLi(item)">
        <Row type="flex" justify="start" align="middle" class="code-row-bg" :gutter="16">
          <Col>
            <span v-if="item.title" class="titles">
              <i class="star" v-if="item.name === 'name' || item.name==='phone' || item.name==='zuoxiCode'">*</i>
              {{item.title}}
            </span>
          </Col>
          <Col>
            <div class="input_wrap" v-if="item.name === 'name'">
              <Input :class="{'err': nameErr}" v-model="item.val" style="width: 300px" 
              @on-blur="inputChange(item)"  placeholder="请填写员工姓名"/>
              <p class="err" v-if="nameErr">姓名不能为空且字符数不能超过40个</p>
            </div>
            <Input v-model="item.val" style="width: 300px" 
            v-if="item.name === 'duty'" placeholder="请输入部门职务名称, 例如:销售顾问"/>
            <div class="input_wrap" v-if="item.name === 'phone'">
              <Input :class="{'err': mobileErr}" v-model="item.val" @on-blur="inputChange(item)" 
              placeholder="员工手机号验证通过后可加入企业">
                <span slot="prepend">中国大陆 +86</span>
              </Input>
              <p class="err" v-if="mobileErr">手机号格式错误</p>
            </div>
            <div v-if="item.name === 'zuoxi'" class="switch_wrap">
              <i-switch v-model="isZuoxiOpen" v-if="zuoxiArr.length > 0"></i-switch>
              <i-switch disabled='disabled' v-if="zuoxiArr.length <= 0"></i-switch>
              <span v-show="!isZuoxiOpen" v-if="zuoxiArr.length > 0">剩余{{total}}个坐席</span>
              <span v-show="isZuoxiOpen" v-if="zuoxiArr.length > 0">剩余{{total - 1}}个坐席</span>
              <p v-if="zuoxiArr.length > 0">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
              <span v-if="zuoxiArr.length <= 0">无剩余坐席</span>
              <p v-if="zuoxiArr.length <= 0">您可前往坐席管理调整分配, 或升级套餐增加坐席数。 
                <i class="updateSet cursor" @click="handle('updateMenu')">升级套餐</i>
              </p>
            </div>
            <RadioGroup v-if="item.name === 'gender'" v-model="item.val">
              <Radio label="1">
                <span>男</span>
              </Radio>
              <Radio label="2">
                  <span>女</span>
              </Radio>
            </RadioGroup>
            <div v-if="isZuoxiOpen && (item.name === 'zuoxiCode')" class="input_wrap">
              <Select style="width: 400px" :class="{'err': seatNoErr}" v-model="item.val">
                <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.seatNo">{{child.seatNo}}</Option>
              </Select>
              <p class="err" v-if="seatNoErr && isZuoxiOpen">请选择一个坐席</p>
            </div>
            <Input v-model="item.val" style="width: 300px" 
            v-if="isZuoxiOpen && (item.name === 'zuoxiTip')"  placeholder="请输入坐席备注"/>
          </Col>
        </Row>
      </li>
    </ul>
  </div>
</template>

<script>
import Const from './const'
export default {
  data() {
    return {
        details: [],
        // 手机号输入错误
        mobileErr: false,
        originData: null,
        seatNoErr: false,
        nameErr: false,
        isZuoxiOpen: false,
        zuoxiArr: [],
        total: 0
    }
  },
  props: {
    height: {
        type: Number,
        default: 0
    }
  },
  created() {
    this.init()
    this.getZuoxi()
  },
  methods: {
    init() {
        this.details = this.deepCopy(Const.addInput)
    },
    showLi(item) {
      return (item.name !== 'zuoxiCode' && (item.name !== 'zuoxiTip')) || (this.isZuoxiOpen && (item.name === 'zuoxiTip' || (item.name === 'zuoxiCode')))
    },
    getParams() {
        if (this.valid(this.details[0]) && this.valid(this.details[1]) && this.valid(this.details[4])) {
          let arr = this.details
          let obj = {
            nickname: arr[0].val.replace(/\s+/g, ''),
            mobile: arr[1].val,
            sex: arr[2].val,
            postName: arr[3].val,
          }
          if (this.isZuoxiOpen) {
            obj.seatNo = arr[5].val
            obj.seatName = arr[6].val
          }
          this.$store.commit('stuff/SET_USER_INFO', obj)
          return obj
        } else {
            this.inputChange(this.details[0])
            this.inputChange(this.details[1])
            !this.valid(this.details[5]) && (this.seatNoErr = true)
            return false
        }
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
          if (this.zuoxiArr.length) {
            for (let item of this.details) {
              item.name === 'zuoxiCode' && this.$set(item, 'val', this.zuoxiArr[0].seatNo)
            }
          } else {
            this.isZuoxiOpen = false
          }
        }
      })
    },
    inputChange(item) {
        item.name === 'name' && (this.nameErr = !this.valid(item))
        item.name === 'phone' && (this.mobileErr = !this.valid(item))
    },
    valid(item) {
        if (item.name === 'name') return item.val.trim() && (item.val.length <= 40)
        if (item.name === 'phone') return item.val && /^[1][3,4,5,7,8][0-9]{9}$/.test(item.val.trim())
        if (item.name === 'zuoxiCode') {
          if (this.isZuoxiOpen) {
            return item.val
          }
        }
        return true
    },
    handle(key) {
      this._BUS.$emit('handle', key)
    },
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.inline
  inline()
#addInput
  relative()
  height 100%
  padding 20px
  overflow-y auto
  .list
    fn(14px)
    >li
      padding: 12px 0
      .titles
        fl()
        width 85px
      .ivu-radio-group
        mt(9px)
      .switch_wrap
        fl()
        .ivu-switch
          mr(10px)
        p
          mt(8px)
          .updateSet
            color(text_color)
      .portrait
        square(50px)
        bgColor(skyblue)
      .star
        color(err_color)
      .ivu-input-wrapper
        width 400px !important
      .ivu-select.err
        .ivu-select-selection
          border-color err_color
          color(#333)
      .ivu-input-wrapper.err
        .ivu-input-group-prepend, input
          border-color err_color
      .err
        color(err_color)
      .input_wrap
        relative()
        p
          absolute()
          top:42px
          fn(12px)
          left:0
</style>
