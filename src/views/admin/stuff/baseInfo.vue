<template>
  <div id="baseInfo">
    <ul class="list">
      <li v-for="(item, key) in list" :key="key" v-if="item.name !== 'seatNo' || (isZuoxiOpen && (item.name === 'seatNo'))">
          <div class="portrait_p" v-if="item.name === 'picUrl'">
            <img class="" width="50px" height="50px" :src="item.val" />
            <span v-if="!item.val" class="por_left">
              <i>未加入企业</i>
              <a @click.stop="handle('askFor')">去邀请</a>
            </span>
            <span class="por_left" v-else>{{item.title}}</span>
          </div>
          <span v-if="item.title && (item.name !== 'picUrl')" class="titles">
            <i class="star" v-if="item.name==='nickname' || item.name==='mobile'">*</i>
            {{item.title}}
          </span>
          <span v-if="(filter(item.name) || !isEdit) && (item.name !== 'picUrl')" class="sec_class">
            {{transfor(item)}}
          </span>
          <Input :class="{'err': nameErr}" v-model="item.val" style="width: 300px" 
          v-if="isEdit && (item.name === 'nickname')" @on-blur="inputChange(item)"/>
          <Input v-model="item.val" style="width: 300px" 
          v-if="isEdit && ((item.name === 'postName') || (item.name === 'seatName'))"/>
          <div v-if="isEdit && (item.name === 'zuoxi')" class="switch_wrap">
            <i-switch v-model="isZuoxiOpen" @on-change="change"></i-switch><span v-show="isZuoxiOpen">剩余2个坐席</span>
            <p v-show="isZuoxiOpen">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
          </div>
          <RadioGroup v-if="isEdit && (item.name === 'sex')" v-model="item.val">
            <Radio label="1">
              <span>男</span>
            </Radio>
            <Radio label="2">
                <span>女</span>
            </Radio>
          </RadioGroup>
          <Select style="width: 300px" v-if="isEdit && isZuoxiOpen && (item.name === 'seatNo')" v-model="item.val">
              <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.seatNo">{{child.seatNo}}</Option>
          </Select>
          <Input :class="{'err': apartErr}" v-if="isEdit && (item.name === 'deptName')" style="width: 400px" @on-focus="showApart" v-model="apartVal.title" />
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      // 手机号输入错误
      mobileErr: false,
      apartVal: {},
      originData: null,
      nameErr: false,
      apartErr: false,
      isZuoxiOpen: false,
      list: [],
      zuoxiArr: [],
      total: 0
    }
  },
  props: {
    details: {
      default: () => { return [] },
      type: Array
    },
    isEdit: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      curUser: 'stuff/getCurUser'
    })
  },
  watch: {
    curUser() {
      if (this.curUser) {
        this.init()
      }
    }
  },
  created() {
    this.getZuoxi()
    this._BUS.$on('apartChoosed', (param) => {
      this.apartVal = param
    })
  },
  methods: {
    init() {
      let arr = this.details.slice()
      for (let item of arr) {
        item.val = this.curUser[item.name]
        item.name === 'zuoxi' && (item.val = this.curUser.seatNo)
        if (item.name === 'picUrl') {
          item.val = this.curUser.picUrl
          item.title = this.curUser.accountNickName
        }
      }
      this.list = arr.slice()
    },
    handle() {
      this._BUS.$emit('handle')
    },
    transfor(item) {
      if (item.name === "sex") {
        return item.val - 0 === 1 ? "男" : '女'
      }
      if (item.name === "status") {
        switch (item.val - 0) {
          case 1:
            return '启用'
          case 2:
            return '停用'
          case 3:
            return '未加入'
          case 5:
            return '已离开'
          default:
            return ''
        }
      }
      if (item.name === "identity") {
        return item.val - 0 === 1 ? "管理员" : '普通员工'
      }
      return item.val
    },
    showApart() {
      this._BUS.$emit('showApart')
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
        }
      })
    },
    valid(item) {
        if (item.name === 'nickname') return item.val.trim()
    },
    getParams() {
        if (this.valid(this.details[1]) && this.apartVal.id) {
          let arr = this.details
          let obj = {
            nickname: arr[1].val,
            sex: arr[3].val,
            postName: arr[5].val,
            deptId: this.apartVal.id,
            eeId: this.curUser.eeId
          }
          if (this.isZuoxiOpen) {
            obj.seatName = arr[6].val
            obj.seatNo = arr[7].val
          }
          this.$store.commit('stuff/SET_USER_INFO', obj)
          return obj
        } else {
            this.inputChange(this.details[1])
            if (!this.apartVal.id) { this.apartErr = true }
            this.$Message.error('输入有误, 请重新输入')
            return false
        }
    },
    inputChange(item) {
      switch (item.name) {
        case 'nickname':
          this.nameErr = !item.val.trim()
          break
        case 'mobile':
          this.mobileErr =
            !item.val || !/^[1][3,4,5,7,8][0-9]{9}$/.test(item.val)
          break
        default:
          break
      }
    },
    change() {},
    filter(name) {
      let arr = ['identity', 'status', 'status', 'addTime', 'mobile']
      if (arr.includes(name)) {
        return true
      }
      
      return false
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.inline
  inline()
#baseInfo
  relative()
  height 90%
  padding 20px
  overflow-y auto
  .list
    fn(14px)
    li
      padding:5px
      overflow:hidden
      .portrait_p
        img
          fl()
          border:1px solid #ddd
        .por_left
          fl()
          ml(70px)
          mt(15px)
          a
            color(text_color)
            inline()
            ml(20px)
      .titles
        fl()
        mt(12px)
        width 120px
      .sec_class
        fl()
        mt(12px)
      .ivu-radio-group
        mt(9px)
      .switch_wrap
        mt(12px)
        fl()
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
        fl()
        width 300px !important
      .ivu-input-wrapper.err
        .ivu-input-group-prepend, input
          border-color err_color
</style>
