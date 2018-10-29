<template>
  <div class="seats-limit">
    <div class="seats-limit-wrapper">
      <div class="limit-wrapper-title">
        <Checkbox :indeterminate="indeterminate.accountIndeterminate" :value="checkAll.accountCheckAll" @click.prevent.native="accountHandleCheckAll">分配公众号</Checkbox>
      </div>
      <div class="limit-wrapper-content">
        <CheckboxGroup v-model="checkAllGroup.accountCheckAllGroup" @on-change="accountCheckAllGroupChange">
          <Checkbox :label="item.appAccountId" :disabled="item.status!=1" v-for="(item, index) in accountList" :key="index">
            <div class="list-item">
              <div class="left">
                <img :src="item.headImg" alt="">
              </div>
              <div class="right" :class="{'unActive':item.status!=1}">
                <div class="text">{{item.principalName}}</div>
                <div class="statu">状态：
                  <span class="menu-float tips" v-show="item.status === 1">正常</span>
                  <span class="menu-float tips" v-show="item.status === 2">停用</span>
                  <span class="menu-float tips" v-show="item.status === 0">禁用</span>
                  <span class="menu-float tips" v-show="item.status === 3">未授权</span>
                </div>
              </div>
            </div>
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div class="limit-wrapper-title limit-wrapper-title2">
        <div class="limit-check-first">
          <Checkbox :indeterminate="indeterminate.limitIndeterminate" :value="checkAll.limitCheckAll" @click.prevent.native="limitHandleCheckAll">分配权限</Checkbox>
        </div>
      </div>
      <div class="menu-wrapper">
        <div class="menu-wrapper-list">
          <FoldPanel :isFold="true">
            <div slot="title">
              <div class="limit-check-second">
                <Checkbox :indeterminate="indeterminate.dialogIndeterminate" :value="checkAll.dialogCheckAll" @click.stop.prevent.native="dialogHandleCheckAll">{{corpPackRoleList[0].groupName}}</Checkbox>
              </div>
            </div>
            <div slot="container">
              <div class="limit-check-third">
                <CheckboxGroup v-model="checkAllGroup.dialogCheckAllGroup" @on-change="dialogCheckAllGroupChange">
                  <Checkbox :label="item.roleId" v-for="(item, index) in corpPackRoleList[0].data" :key="index">{{item.roleName}}</Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          </FoldPanel>
        </div>
        <div class="menu-wrapper-list">
          <FoldPanel :isFold="true">
            <div slot="title">
              <div class="limit-check-second">
                <Checkbox :indeterminate="indeterminate.fansIndeterminate" :value="checkAll.fansCheckAll" @click.stop.prevent.native="fansHandleCheckAll">{{corpPackRoleList[1].groupName}}</Checkbox>
              </div>
            </div>
            <div slot="container">
              <div class="limit-check-third">
                  <CheckboxGroup v-model="checkAllGroup.fansCheckAllGroup" @on-change="fansCheckAllGroupChange">
                    <Checkbox :label="item.roleId" v-for="(item, index) in corpPackRoleList[1].data" :key="index">{{item.roleName}}</Checkbox>
                  </CheckboxGroup>
                </div>
            </div>
          </FoldPanel>
          <groupCheckBox :systems="systems" :isEdit="true" v-if="false"></groupCheckBox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookies'
import groupCheckBox from './groupCheckBox'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appAccountIdArr: [],
      canSelectAccountArr: [],
      // systems: [
      //   {
      //     name: '分配权限',
      //     obj: {}
      //   }
      // ],
      accountList: getCookie('accountList'),
      indeterminate: {
        limitIndeterminate: true,
        accountIndeterminate: true,
        dialogIndeterminate: true,
        fansIndeterminate: true
      },
      checkAll: {
        limitCheckAll: false,
        accountCheckAll: false,
        dialogCheckAll: false,
        fansCheckAll: false
      },
      checkAllGroup: {
        accountCheckAllGroup: [],
        dialogCheckAllGroup: [],
        fansCheckAllGroup: []
      }
    }
  },
  components: {
    groupCheckBox
  },
  computed: {
    ...mapGetters({
      secondStepData: 'seats/getSecondStepData',
      seatsInfo: 'seats/getSeatsInfo',
      corpPackRoleList: 'seats/getCorpPackRoleList'
    })
  },
  mounted() {
    // let obj = {}
    // for (let item of this.corpPackRoleList) {
    //     obj[item.groupName] = obj[item.groupName] || {}
    //     obj[item.groupName].name = item.groupName
    //     obj[item.groupName].data = obj[item.groupName].data || []
    //     obj[item.groupName].data.push({
    //         cont: item.roleName,
    //         id: item.roleId,
    //         groupName: item.groupName,
    //         isSelect: false
    //     })
    // }
    // this.systems[0].obj = obj
    // console.log(this.systems)
    this.appidChange()
    this.init()
    this.showCheckBoxStatu()
  },
  methods: {
    init() {
      if (this.seatsInfo.seatNo) {
        if (this.seatsInfo.authIds && this.seatsInfo.authIds.length > 0) {
          this.seatsInfo.authIds.forEach(item => {
            if (this.corpPackRoleList[0].roleId.indexOf(item) >= 0) {
              this.checkAllGroup.dialogCheckAllGroup.push(item)
            }
            if (this.corpPackRoleList[1].roleId.indexOf(item) >= 0) {
              this.checkAllGroup.fansCheckAllGroup.push(item)
            }
          })
        }
        if (
          this.seatsInfo.seatPublicNumDetailDtos &&
          this.seatsInfo.seatPublicNumDetailDtos.length > 0
        ) {
          this.seatsInfo.seatPublicNumDetailDtos.forEach(item => {
            if (this.appAccountIdArr.indexOf(item.appAccountId) >= 0) {
              this.checkAllGroup.accountCheckAllGroup.push(item.appAccountId)
            }
          })
        }
      }
    },
    appidChange() {
      this.accountList.forEach(item => {
        this.appAccountIdArr.push(item.appAccountId)
        if (item.status === 1) {
          this.canSelectAccountArr.push(item.appAccountId)
        }
      })
    },
    isGoNext() {
      if (
        this.checkAllGroup.accountCheckAllGroup.length > 0 &&
        (this.checkAllGroup.dialogCheckAllGroup.length > 0 ||
          this.checkAllGroup.fansCheckAllGroup.length > 0)
      ) {
        let authIds = this.checkAllGroup.dialogCheckAllGroup.concat(
          this.checkAllGroup.fansCheckAllGroup
        )
        return {
          authIds: authIds,
          appAccountIds: this.checkAllGroup.accountCheckAllGroup
        }
      } else {
        this.$Message.info('至少选择一个公众号和一个坐席权限')
        return false
      }
    },
    accountHandleCheckAll() {
      if (this.indeterminate.accountIndeterminate) {
        this.checkAll.accountCheckAll = false
      } else {
        this.checkAll.accountCheckAll = !this.checkAll.accountCheckAll
      }
      this.indeterminate.accountIndeterminate = false

      if (this.checkAll.accountCheckAll) {
        this.checkAllGroup.accountCheckAllGroup = this.canSelectAccountArr
      } else {
        this.checkAllGroup.accountCheckAllGroup = []
      }
    },
    accountCheckAllGroupChange(data) {
      if (data.length === this.appAccountIdArr.length) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = true
      } else if (data.length > 0) {
        this.indeterminate.accountIndeterminate = true
        this.checkAll.accountCheckAll = false
      } else {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = false
      }
    },
    dialogHandleCheckAll() {
      if (this.indeterminate.dialogIndeterminate) {
        this.checkAll.dialogCheckAll = false
      } else {
        this.checkAll.dialogCheckAll = !this.checkAll.dialogCheckAll
      }
      this.indeterminate.dialogIndeterminate = false

      if (this.checkAll.dialogCheckAll) {
        this.checkAllGroup.dialogCheckAllGroup = this.corpPackRoleList[0].roleId
      } else {
        this.checkAllGroup.dialogCheckAllGroup = []
      }
      this.showLimitStatu()
    },
    dialogCheckAllGroupChange(data) {
      this.showLimitStatu()
      if (data.length === this.corpPackRoleList[0].roleId.length) {
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = true
      } else if (data.length > 0) {
        this.indeterminate.dialogIndeterminate = true
        this.checkAll.dialogCheckAll = false
      } else {
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = false
      }
    },
    fansHandleCheckAll() {
      if (this.indeterminate.fansIndeterminate) {
        this.checkAll.fansCheckAll = false
      } else {
        this.checkAll.fansCheckAll = !this.checkAll.fansCheckAll
      }
      this.indeterminate.fansIndeterminate = false

      if (this.checkAll.fansCheckAll) {
        this.checkAllGroup.fansCheckAllGroup = this.corpPackRoleList[1].roleId
      } else {
        this.checkAllGroup.fansCheckAllGroup = []
      }
      this.showLimitStatu()
    },
    fansCheckAllGroupChange(data) {
      this.showLimitStatu()
      if (data.length === this.corpPackRoleList[1].roleId.length) {
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = true
      } else if (data.length > 0) {
        this.indeterminate.fansIndeterminate = true
        this.checkAll.fansCheckAll = false
      } else {
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = false
      }
    },
    limitHandleCheckAll() {
      if (this.indeterminate.limitIndeterminate) {
        this.checkAll.fansCheckAll = false
      } else {
        this.checkAll.limitCheckAll = !this.checkAll.limitCheckAll
      }
      this.indeterminate.limitIndeterminate = false

      if (this.checkAll.limitCheckAll) {
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = true
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = true
        this.checkAllGroup.fansCheckAllGroup = this.corpPackRoleList[1].roleId
        this.checkAllGroup.dialogCheckAllGroup = this.corpPackRoleList[0].roleId
      } else {
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = false
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = false
        this.checkAllGroup.fansCheckAllGroup = []
        this.checkAllGroup.dialogCheckAllGroup = []
      }
    },
    showCheckBoxStatu() {
      if (
        this.checkAllGroup.accountCheckAllGroup.length ===
        this.appAccountIdArr.length
      ) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = true
      } else if (this.checkAllGroup.accountCheckAllGroup.length === 0) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = false
      } else {
        this.indeterminate.accountIndeterminate = true
        this.checkAll.accountCheckAll = false
      }
      //
      if (
        this.checkAllGroup.dialogCheckAllGroup.length ===
        this.corpPackRoleList[0].roleId.length
      ) {
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = true
      } else if (this.checkAllGroup.dialogCheckAllGroup.length === 0) {
        this.indeterminate.dialogIndeterminate = false
        this.checkAll.dialogCheckAll = false
      } else {
        this.indeterminate.dialogIndeterminate = true
        this.checkAll.dialogCheckAll = false
      }
      //
      if (
        this.checkAllGroup.fansCheckAllGroup.length ===
        this.corpPackRoleList[1].roleId.length
      ) {
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = true
      } else if (this.checkAllGroup.fansCheckAllGroup.length === 0) {
        this.indeterminate.fansIndeterminate = false
        this.checkAll.fansCheckAll = false
      } else {
        this.indeterminate.fansIndeterminate = true
        this.checkAll.fansCheckAll = false
      }
      //
      if (
        this.checkAllGroup.fansCheckAllGroup.length ===
          this.corpPackRoleList[1].roleId.length &&
        this.checkAllGroup.dialogCheckAllGroup.length ===
          this.corpPackRoleList[0].roleId.length
      ) {
        this.indeterminate.limitIndeterminate = false
        this.checkAll.limitCheckAll = true
      } else if (
        this.checkAllGroup.fansCheckAllGroup.length === 0 &&
        this.checkAllGroup.dialogCheckAllGroup.length === 0
      ) {
        this.indeterminate.limitIndeterminate = false
        this.checkAll.limitCheckAll = false
      } else {
        this.indeterminate.limitIndeterminate = true
        this.checkAll.limitCheckAll = false
      }
    },
    showLimitStatu() {
      if (
        this.checkAllGroup.fansCheckAllGroup.length ===
          this.corpPackRoleList[1].roleId.length &&
        this.checkAllGroup.dialogCheckAllGroup.length ===
          this.corpPackRoleList[0].roleId.length
      ) {
        this.indeterminate.limitIndeterminate = false
        this.checkAll.limitCheckAll = true
      } else if (
        this.checkAllGroup.fansCheckAllGroup.length === 0 &&
        this.checkAllGroup.dialogCheckAllGroup.length === 0
      ) {
        this.indeterminate.limitIndeterminate = false
        this.checkAll.limitCheckAll = false
      } else {
        this.indeterminate.limitIndeterminate = true
        this.checkAll.limitCheckAll = false
      }
    },
    ...mapActions({
      setSecondStepData: 'seats/setSecondStepData'
    })
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
@import '~@/assets/stylus/mixin'
.seats-limit
  .seats-limit-wrapper
    .limit-wrapper-title
      height 40px
      line-height 40px
      padding-left 20px
      background-color #e6edf5
    .menu-wrapper
      padding-right 20px
      padding-left 20px
      .menu-wrapper-list
        margin-top 20px
      .ivu-checkbox-group-item
        width 23%
        margin-top 20px
        // margin-right 65px
        &:nth-of-type(4n)
          margin-right 10px
    .limit-wrapper-title2
      margin-top 10px
    .limit-wrapper-content
      margin-top 40px
      .ivu-checkbox-group-item
        width 49%
        margin-right 0
        padding-left 20px
        margin-bottom 30px
      .ivu-checkbox
        vertical-align top
      .list-item
        display inline-block
        .left
          float left
          img
            width 40px
            height 40px
            margin-right 10px
        .right
          width 121px
          float left
          &.unActive
            color #979899
          .text
            no-wrap()
          .statu
            no-wrap()
            margin-top 12px
  .ivu-menu-submenu-title
    padding-top 22px
    padding-bottom 22px
    padding-right 0
    borb()
  .ivu-checkbox
    margin-right 7px
  .ivu-menu-item
    display inline-block !important
    .ivu-checkbox-wrapper
      margin-right 50px
      margin-bottom 20px
      &:nth-of-type(4n)
        margin-right 5px
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    border-right none
    &:after
      width 0
  .ivu-menu-vertical .ivu-menu-item
    cursor default
  .ivu-menu-vertical.ivu-menu-light:after
    width 0
  .ivu-menu-submenu-title-icon
    color #409eff
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover
    background-color #fff
  .ivu-menu-submenu-title > i, .ivu-menu-submenu-title span > i
    margin-right 0
  .limit-check-second
    display inline-block
</style>


