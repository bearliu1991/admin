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
      <!-- <div class="limit-wrapper-title limit-wrapper-title2">
        <div class="limit-check-first">
          <Checkbox :indeterminate="indeterminate.limitIndeterminate" :value="checkAll.limitCheckAll" @click.prevent.native="limitHandleCheckAll">分配权限</Checkbox>
        </div>
      </div> -->
      <div class="menu-wrapper">
        <groupCheckBox ref="groupLimit" :systems="corpPackRoleList" :isEdit="true"></groupCheckBox>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookies'
import {ArrDistinct} from '@/utils/util'
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
      disabledAllAccount: [],
      disabledAccount: [],
      systems: [
        {
          name: '分配权限',
          obj: {}
        }
      ],
      accountList: getCookie('accountList'),
      indeterminate: {
        accountIndeterminate: true
      },
      checkAll: {
        accountCheckAll: false
      },
      checkAllGroup: {
        accountCheckAllGroup: []
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
    this.appidChange()
    this.init()
    this.showCheckBoxStatu()
  },
  methods: {
    init() {
      if (this.seatsInfo.seatNo) {
        if (this.seatsInfo.authIds && this.seatsInfo.authIds.length > 0) {
          for (let i = 0; i < this.corpPackRoleList.length; i++) {
            for (let k in this.corpPackRoleList[i]) {
              for (let j = 0; j < this.corpPackRoleList[i][k].length; j++) {
                let roleId = this.corpPackRoleList[i][k][j].roleId
                this.corpPackRoleList[i][k][j].isSelect = this.seatsInfo.authIds.includes(roleId)
              }
            }
          }
        }
        if (this.seatsInfo.seatPublicNumDetailDtos && this.seatsInfo.seatPublicNumDetailDtos.length > 0) {
          this.seatsInfo.seatPublicNumDetailDtos.forEach(item => {
            if (item.status !== 1) {
              this.disabledAccount.push(item)
            }
            if (this.appAccountIdArr.indexOf(item.appAccountId) >= 0) {
              this.checkAllGroup.accountCheckAllGroup.push(item.appAccountId)
            }
          })
        }
      }
    },
    appidChange() {
      this.accountList.forEach((item) => {
        this.appAccountIdArr.push(item.appAccountId)
        if (item.status !== 1) {
          this.disabledAllAccount.push(item)
        }
      })
    },
    isGoNext() {
      let authIds = this.$refs.groupLimit.getSysId()
      if (this.checkAllGroup.accountCheckAllGroup.length > 0 && authIds > 0) {
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
        let appAccountIdArr = ArrDistinct(this.appAccountIdArr, this.disabledAllAccount)
        appAccountIdArr = appAccountIdArr.concat(this.disabledAccount)
        this.checkAllGroup.accountCheckAllGroup = appAccountIdArr
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
    showCheckBoxStatu() {
      if (this.checkAllGroup.accountCheckAllGroup.length === this.appAccountIdArr.length) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = true
      } else if (this.checkAllGroup.accountCheckAllGroup.length === 0) {
        this.indeterminate.accountIndeterminate = false
        this.checkAll.accountCheckAll = false
      } else {
        this.indeterminate.accountIndeterminate = true
        this.checkAll.accountCheckAll = false
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


