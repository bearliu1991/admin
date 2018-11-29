<template>
  <div id="drawerDetail">
    <div class="switch">
      <p :class="{'active': (activeId === 0)}" @click="setActive(0)">基本信息</p>
      <p @click="setActive(1)" :class="{'active': (activeId === 1)}">权限设置</p>
    </div>
    <data-loading :dataSatau="dataSatau">
      <BaseInfo v-show="activeId === 0" ref="baseInfo" :height='height' :isEdit="isEdit" :details="details"></BaseInfo>
      <RightSet class="right_set" v-show="activeId === 1" ref="rightSet" :style="{height: height + 'px'}" :isEdit="isEdit" :systems="systems"></RightSet>
    </data-loading>
    <ul class="handles" v-if='!isEdit'>
      <li v-for="(item, key ,index) in actions" :key="index" @click="handle(key, item)">
        {{item}}
      </li>
    </ul>
    <div class="handles save_data" v-if='isEdit'>
      <i-button type="primary" @click="saveData">保存</i-button>
      <i-button @click="cancel">取消</i-button>
    </div>
  </div>
</template>

<script>
import BaseInfo from './baseInfo'
import RightSet from './rightSet'
import Const from './const'
export default {
  data() {
    return {
      activeId: 0,
      actionItems: {},
      isEdit: false,
      details: [],
      systems: [],
      userRights: [],
      dataSatau: 1,
      actions: {},
      height: 0
    }
  },
  props: ['userId', 'isModify'],
  created() {
    this.init()
    this.isEdit = this.isModify
  },
  mounted() {
    let val = document.getElementById('drawerDetail').getBoundingClientRect().height
    this.height = val - 70 > 0 ? val - 70 : 0
  },
  methods: {
    init() {
      // 增加返回按钮
      let obj = this.deepCopy(Const.actionItems)
      delete obj.show
      obj.goback = '返回'
      this.actionItems = obj
      this.details = this.deepCopy(Const.details)
      this.systems = this.deepCopy(Const.systems)
      this.getUserDetail()
      this.getUserRights()
    },
    showRules(param) {
      let obj = {}
      let keysArr = []
      if (param.status === 3) {
        keysArr = ['modify', 'stop', 'delete']
      }
      if (param.status === 1) {
        keysArr = ['modify', 'stop', 'delete', 'unbind', 'delete']
      }
      if (param.status === 2) {
        keysArr = ['modify', 'start', 'delete']
      }
      if (param.status === 5) {
        keysArr = ['modify', 'stop', 'delete']
      }
      if (param.topval > -1) {
        keysArr.push('cancelTop')
      } else {
        keysArr.push('setTop')
      }
      if (param.joinStatus === 1) {
        keysArr.push('unbind')
      }
      for (let key of Object.keys(this.actionItems)) {
        if (keysArr.includes(key)) {
          obj[key] = this.actionItems[key]
        }
      }
      obj.goback = "返回"
      return obj
    },
    getUserDetail() {
      let id = this.userId
      id && this.userDetail({id: id}).then((res) => {
        this.dataSatau = 2
        if (res.code === 1) {
          this.$store.commit('stuff/SET_CUR_USER', this.deepCopy(res.data))
          this.actions = this.showRules(res.data)
        } else {
          this.$Message.error('请求员工详情错误')
        }
      })
    },
    getUserRights() {
      let id = this.userId
      this.userRightsList({id: id}).then((res) => {
        this.dataSatau = 2
        if (res.code === 1) {
          this.userRights = res.data
          this.getGroupData()
        }
      })
    },
    cancel() {
      let idx = this.activeId
      this.init()
      this.activeId = idx
      this.isEdit = false
    },
    getGroupData() {
        this.ajaxData('PC_WEB_ADMIN', 0)
        this.ajaxData('PC_WEB_CHAT', 1)
    },
    ajaxData(key, index) {
        this.getRightsList({platformType: key}).then((res) => {
          this.dataSatau = 2
          let obj = {}
          if (res.code === 1) {
              for (let item of res.data) {
                  obj[item.groupName] = obj[item.groupName] || {}
                  obj[item.groupName].name = item.groupName
                  obj[item.groupName].data = obj[item.groupName].data || []
                  obj[item.groupName].data.push({
                      cont: item.roleName,
                      id: item.roleId,
                      groupName: item.groupName,
                      isSelect: this.userRights.includes(item.roleId)
                  })
              }
          }
          this.systems[index].obj = obj
          this.$set(this, 'systems', this.deepCopy(this.systems))
        })
    },
    setActive(idx) {
      this.activeId = idx
      this.isEdit = false
    },
    saveData() {
      let baseInfo = this.$refs.baseInfo
      let rightSet = this.$refs.rightSet
      if (this.activeId === 0) {
        if (this.isEdit) {
          let param = baseInfo.getParams()
          param && this.modifyUserDetail(param).then((res) => {
            if (res.code === 1) {
              this.handle('goback')
              this._BUS.$emit('getUsers')
            }
          })
        }
      } else {
        let id = this.userId
        let ids = rightSet.getSysId()
        if (!ids || !ids.length) {
          this.$Message.error('请至少选择一个权限')
          return false
        }
        this.modifyUserRole({eeId: id, addRoleIds: ids}).then((res) => {
            if (res.code === 1) {
              this.handle('goback')
              this._BUS.$emit('getUsers')
            }
          })
      }
    },
    handle(key) {
      if (key === 'modify') return (this.isEdit = true)
      this._BUS.$emit('handle', key, this.userId)
    }
  },
  components: { BaseInfo, RightSet }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#drawerDetail
  height 100%
  width 100%
  relative()
  .right_set
    overflow-y:auto
  .switch
    border-bottom 1px solid #efefef
    width:100%
    height:50px
    // setStart()
    p
      fl()
      // fn(18px)
      line-height 49px
      width 100px
      cursor()
      center()
      &.active
        color(text_color)
        border-bottom 1px solid text_color
        // mb(-1px)
</style>
