<template>
  <div id="addInput">
    <ul class="list">
      <li v-for="(item, key) in details" :key="key" 
      v-if="(item.name !== 'zuoxiCode' && (item.name !== 'zuoxiTip')) || (isZuoxiOpen && (item.name === 'zuoxiTip' || (item.name === 'zuoxiCode')))">
          <span v-if="item.title" class="titles"><i class="star" v-if="item.name==='name' || item.name==='phone'">*</i>{{item.title}}</span>
          <Input :class="{'err': nameErr}" v-model="item.val" style="width: 300px" 
          v-if="item.name === 'name'" @on-blur="inputChange(item)"/>
          <Input v-model="item.val" style="width: 300px" 
          v-if="item.name === 'duty'"/>
          
          <Input :class="{'err': mobileErr}" v-model="item.val" v-if="item.name === 'phone'" @on-blur="inputChange(item)">
            <span slot="prepend">中国大陆 +86</span>
          </Input>
          <div v-if="item.name === 'zuoxi'" class="switch_wrap">
            <i-switch v-model="isZuoxiOpen"></i-switch><span v-show="isZuoxiOpen">剩余{{total > 0 ? total - 1: 0}}个坐席</span>
            <p v-show="isZuoxiOpen">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
          </div>
          <RadioGroup v-if="item.name === 'gender'" v-model="item.val">
            <Radio label="1">
              <span>男</span>
            </Radio>
            <Radio label="2">
                <span>女</span>
            </Radio>
          </RadioGroup>
          <Select style="width: 400px" v-if="isZuoxiOpen && (item.name === 'zuoxiCode')" v-model="item.val">
              <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.seatNo">{{child.seatNo}}</Option>
          </Select>
          <Input v-model="item.val" style="width: 300px" 
          v-if="isZuoxiOpen && (item.name === 'zuoxiTip')"/>
          <Select style="width: 400px" v-if="item.name === 'apart'" v-model="item.val">
              <Option value="销售二部B组">销售二部B组</Option>
              <Option value="销售一部B组">销售一部B组</Option>
              <Option value="技术二部B组">技术二部B组</Option>
          </Select>
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
        nameErr: false,
        isZuoxiOpen: false,
        zuoxiArr: [],
        total: 0
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
    getParams() {
        if (this.valid(this.details[0]) && this.valid(this.details[1])) {
          let arr = this.details
          let obj = {
            nickname: arr[0].val,
            mobile: arr[1].val,
            sex: arr[2].val,
            postName: arr[3].val,
          }
          if (this.isZuoxiOpen) {
            obj.seatName = arr[5].val
            obj.seatNo = arr[6].val
          }
          this.$store.commit('stuff/SET_USER_INFO', obj)
          return obj
        } else {
            this.inputChange(this.details[0])
            this.inputChange(this.details[1])
            this.$Message.error('输入有误, 请重新输入')
            return false
        }
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
        }
      })
    },
    inputChange(item) {
        item.name === 'name' && (this.nameErr = !this.valid(item))
        item.name === 'phone' && (this.mobileErr = !this.valid(item))
    },
    valid(item) {
        if (item.name === 'name') return item.val.trim()
        if (item.name === 'phone') return item.val && /^[1][3,4,5,7,8][0-9]{9}$/.test(item.val.trim())
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.inline
  inline()
#addInput
  relative()
  height 90%
  padding 20px
  overflow-y auto
  .list
    fn(14px)
    li
      padding:5px
      overflow:hidden
      .titles
        fl()
        mt(12px)
        width 120px
      .ivu-radio-group
        mt(9px)
      .switch_wrap
        fl()
        mt(12px)
        .ivu-switch
          mr(10px)
        p
          mt(8px)
      .portrait
        square(50px)
        bgColor(skyblue)
      .star
        color(err_color)
      .ivu-input-wrapper
        width 400px !important
      .ivu-input-wrapper.err
        .ivu-input-group-prepend, input
          border-color err_color
</style>
