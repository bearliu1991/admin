<template>
  <div id="baseInfo" :style="{height: height + 'px'}">
    <ul class="list">
      <li v-for="(item, key) in list" :key="key" :class="{'split': liSplit(item)}" v-if="showLi(item)">
        <div class="portrait_p" v-if="item.name === 'picUrl'">
          <img class="" width="50px" height="50px" :src="item.val" v-if="item.val"/>
          <img class="" width="50px" height="50px" v-else src="@/assets/images/admin/portrait.png" />
          <span v-if="list[list.length - 1].val !== 1" class="por_left">
            <i>未加入企业</i>
            <a @click.stop="handle('askFor')">去邀请</a>
          </span>
          <span class="por_left" v-else>{{item.title}}</span>
        </div>
        <Row type="flex" justify="start" align="middle" class="code-row-bg">
          <Col>
            <span v-if="item.title && (item.name !== 'picUrl')" class="titles">
              <i class="star" v-if="(item.name==='nickname' || item.name==='seatNo') && isEdit">*</i>
              {{item.title}}
            </span>
          </Col>
          <Col>
            <span v-if="(filterTitle(item) || !isEdit) && (item.name !== 'picUrl') && (item.name !== 'mobile')" class="sec_class">
              {{transfor(item)}}
            </span>
            <span v-if="(!isEdit && (item.name === 'mobile')) || (isEdit && (item.name === 'mobile') && !isMobileEdit)" class="sec_class">
              {{transfor(item)}}
            </span>
            <div class="input_wrap" v-if="isEdit && (item.name === 'mobile') && isMobileEdit">
              <Input :class="{'err': mobileErr}" v-model="item.val" @on-blur="inputChange(item)" 
              placeholder="员工手机号验证通过后可加入企业">
                <span slot="prepend">中国大陆 +86</span>
              </Input>
              <p class="err" v-if="mobileErr">手机号格式错误</p>
            </div>
            <div v-if="isEdit && (item.name === 'nickname')" class="input_wrap">
              <Input :class="{'err': nameErr}" v-model="item.val" style="width: 300px" 
             @on-blur="inputChange(item)"/>
              <p class="err" v-if="nameErr">姓名不能为空</p>
            </div>
            <Input v-model="item.val" style="width: 300px" 
            v-if="isEdit && (item.name === 'postName')" placeholder="请输入部门职务名称, 例如: 销售顾问"/>
            <Input v-model="item.val" style="width: 300px" 
            v-if="isEdit && (item.name === 'seatName')" placeholder="请输入坐席备注"/>
            <div v-if="isEdit && (item.name === 'zuoxi')" class="switch_wrap">
              <i-switch v-model="isZuoxiOpen" v-if="zuoxiArr.length > 0" @on-change="change"></i-switch>
              <i-switch disabled='disabled' v-if="zuoxiArr.length  <= 0"></i-switch>
              <span v-show="!isZuoxiOpen" v-if="zuoxiArr.length > 0">剩余{{total}}个坐席</span>
              <span v-show="isZuoxiOpen" v-if="zuoxiArr.length > 0">剩余{{total - 1}}个坐席</span>
              <p v-if="zuoxiArr.length > 0">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
              <span v-if="zuoxiArr.length <= 0">无剩余坐席</span>
              <p v-if="zuoxiArr.length <= 0">您可前往坐席管理调整分配, 或升级套餐增加坐席数。 
                <i class="updateSet cursor" @click="handle('updateMenu')">升级套餐</i>
              </p>
            </div>
            <RadioGroup v-if="isEdit && (item.name === 'sex')" v-model="item.val">
              <Radio :label="1">男</Radio>
              <Radio :label="2">女</Radio>
            </RadioGroup>
            <div v-if="isEdit && isZuoxiOpen && (item.name === 'seatNo')" class="input_wrap">
              <Select style="width: 300px" :class="{'err': seatNoErr}" v-model="item.val">
                <Option :value="item.val || 0" class="zuoxi_opt">{{item.val}}</Option>
                <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.seatNo">{{child.seatNo}}</Option>
              </Select>
              <p class="err" v-if="seatNoErr">请选择一个坐席</p>
            </div>
            <Input v-if="isEdit && (item.name === 'deptName')" placeholder="请点击选择所属部门"
            style="width: 400px" @on-focus="showApart" v-model="item.val" />
          </Col>
        </Row>
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
      seatNoErr: false,
      originData: null,
      nameErr: false,
      isZuoxiOpen: false,
      list: [],
      zuoxiArr: [],
      total: 0,
      isMobileEdit: false,
      seatStatus: 0
    }
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    details: {
      default: () => { return [] },
      type: Array
    },
    isEdit: {
      default: true,
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
      this.refresh(param)
    })
  },
  methods: {
    init() {
      let arr = this.details.slice()
      this.seatStatus = this.curUser.seatStatus
      for (let item of arr) {
        item.val = this.curUser[item.name]
        item.name === 'zuoxi' && (item.val = this.curUser.seatNo || '未分配')
        if (item.name === 'picUrl') {
          item.val = this.curUser.picUrl
          item.title = this.curUser.accountNickName
        }
        item.name === 'deptName' && (item.deptId = this.curUser.deptId)
        item.name === 'seatNo' && (item.val = this.curUser.seatNo)
      }
      this.list = arr.slice()
    },
    iterateCurrNode(val) {
        if (val.currentNode) {
            return this.iterateCurrNode(val.currentNode)
        } else {
            return val
        }
    },
    refresh(param) {
      let curNode = this.iterateCurrNode(param)
      let obj = this.list.slice()
      obj.map((item) => {
        if (item.name === 'deptName') {
          item.val = curNode.title
          item.deptId = curNode.id
        }
        return item
      })
      this.$set(this, 'list', obj)
    },
    filterShow(item, name) {
      return item.name === name
    },
    showLi(item) {
      if (item.name === 'joinStatus') return false
      if (item.name === 'postName') {
        if (!this.isEdit && (this.list[this.list.length - 1].val !== 1)) return false
      }
      return (item.name !== 'seatNo' && item.name !== 'seatName') || (this.isZuoxiOpen && (item.name === 'seatNo')) || (this.isZuoxiOpen && (item.name === 'seatName'))
    },
    liSplit(item) {
      return item.name === 'deptName' || (item.name === 'identity')
    },
    handle(key) {
      this._BUS.$emit('handle', key, this.curUser.eeId)
    },
    transfor(item) {
      if (item.name === "sex") {
        return item.val - 0 === 1 ? "男" : '女'
      }
      if (item.name === "status") {
        switch (item.val - 0) {
          case 1:
            return '正常'
          case 2:
            return '停用'
          case 3:
            return '未加入'
          case 5:
            return '已退出'
          default:
            return ''
        }
      }
      if (item.name === "identity") {
        return item.val - 0 === 1 ? "管理员" : '普通员工'
      }
      if ((item.name === 'addTime' || 'createTime') && item.val) {
        return item.val.split(' ')[0]
      }
      if (!item.val) return '无'
      return item.val
    },
    showApart() {
      this._BUS.$emit('showApart', this.details[4].deptId)
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
          if (this.zuoxiArr.length) {
            this.isZuoxiOpen = Boolean(this.seatStatus)
          }
        }
      })
    },
    valid(item) {
        if (item.name === 'nickname') return item.val.trim()
        if (item.name === 'mobile') return /^[1][3,4,5,7,8][0-9]{9}$/.test(item.val)
        if (item.name === 'seatNo') {
          if (this.isZuoxiOpen) {
            return item.val
          }
          return true
        }
    },
    getParams() {
        if (this.valid(this.details[1]) && this.valid(this.details[2]) && this.valid(this.details[7])) {
          let arr = this.details
          let obj = {
            nickname: arr[1].val,
            sex: arr[3].val,
            postName: arr[5].val,
            mobile: this.isMobileEdit ? this.details[2].val : null,
            deptId: arr[4].deptId,
            eeId: this.curUser.eeId
          }
          if (this.isZuoxiOpen) {
            obj.seatName = arr[8].val === '未分配' ? '' : arr[8].val
            obj.seatNo = arr[7].val
          }
          this.$store.commit('stuff/SET_USER_INFO', obj)
          return obj
        } else {
          this.inputChange(this.details[1])
          this.inputChange(this.details[2])
          !this.valid(this.details[7]) && (this.seatNoErr = true)
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
    filterTitle(item) {
      let arr = ['identity', 'status', 'status', 'addTime', 'createTime']
      if (item.name === 'status') {
        this.isMobileEdit = item.val !== 1
      }
      if (arr.includes(item.name)) {
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
  height 100%
  padding 20px
  overflow-y auto
  .list
    height 200px
    fn(14px)
    li
      padding:12px
      &.split
        mt(20px)
      .portrait_p
        overflow:hidden
        img
          fl()
          border:1px solid #ddd
        .por_left
          fl()
          ml(50px)
          mt(15px)
          a
            color(text_color)
            inline()
            ml(20px)
      .titles
        fl()
        width 85px
      // .sec_class
      //   fl()
      //   // mt(12px)
      .ivu-radio-group
        mt(9px)
      .switch_wrap
        fl()
        .ivu-switch
          mr(10px)
        p
          mt(8px)
          color(#979899)
          fn(12px)
          .updateSet
            color(text_color)
      .portrait
        square(50px)
        bgColor(skyblue)
      .star
        color(err_color)
      .ivu-input-wrapper
        fl()
        width 300px !important
      .input_wrap
        relative()
        p
          absolute()
          top:42px
          fn(12px)
          left:0
      .ivu-select.err
        .ivu-select-selection
          border-color err_color
          color(#333)
      .err
        color(err_color)
      .zuoxi_opt
        visibility: hidden
        height:0
        padding: 0
      .ivu-input-wrapper.err
        .ivu-input-group-prepend, input
          border-color err_color
</style>
