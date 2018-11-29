<template>
  <div class="custom-seats">
    <div class="individuation" >
      <FoldPanel :isFold="true" v-for="(item, index) in customAccount" :key="index">
        <div slot="title">
          <div class="menu-tit" :class="{'un-active': item.status!=1}">
            <div class="menu-float img"><img :src="item.headImg" alt=""></div>
            <div class="menu-float text">{{item.nickName || item.principalName}}</div>
            <div class="menu-float tips" v-show="item.status === 2">停用</div>
            <div class="menu-float tips" v-show="item.status === 0">禁用</div>
            <div class="menu-float tips" v-show="item.status === 3">未授权</div>
          </div>
        </div>
        <div slot="container">
          <div class="menu-con" :class="{'un-active': item.status!=1}">
            <div class="menu-con-item">
              <span class="item-name">坐席昵称</span>
              <span class="item-info"> <Input v-model="item.seatNickName" :disabled="item.status!=1" placeholder="请输入坐席昵称" style="width: 360px"></Input></span>
            </div>
            <div class="menu-con-item">
              <span class="item-name">坐席头像</span>
              <span class="item-info">
                <UploadImg v-if="item.conditionalHeadImg || item.headImg" @fileBoob="fileBoob" :idx="index" :isUpload="item.status==1" :imgSrc="item.conditionalHeadImg || item.headImg"></UploadImg>
              </span>
              <span class="items-tips">
                点击上传头像，建议尺寸400px*400px
              </span>
            </div>
          </div>
        </div>
      </FoldPanel>
      <!-- <Menu theme="light" width="100%" :open-names="[0,1,2]">
        <Submenu :name="index" v-for="(item, index) in 3" :key="index">
          <template slot="title">
              <div class="menu-tit" :class="{'un-active': index==1}">
                <div class="menu-float img"><img src="@/assets/images/wechat.png" alt=""></div>
                <div class="menu-float text">正点财经正点财经...</div>
                <div class="menu-float tips">停用</div>
              </div>
          </template>
          <MenuItem :name="index + '' + idx" v-for="(item, idx) in 1" :key="idx">
            <div class="menu-con" :class="{'un-active': index==1}">
              <div class="menu-con-item">
                <span class="item-name">坐席昵称</span>
                <span class="item-info"> <Input v-model="seatsName" placeholder="请输入坐席昵称" style="width: 360px"></Input></span>
              </div>
              <div class="menu-con-item">
                <span class="item-name">坐席头像</span>
                <span class="item-info">
                  <UploadImg @fileBoob="fileBoob" :idx="index" :imgSrc="require('@/assets/images/wechat.png')"></UploadImg>
                </span>
                <span class="items-tips">
                  点击上传头像，建议尺寸400px*400px
                </span>
              </div>
            </div>
          </MenuItem>
        </Submenu>
      </Menu> -->
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import UploadImg from '@/components/UploadImg'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    appAccountIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      copyArr: [],
      seatsName: '',
      accountList: this.getCookie('accountList') || [],
      customAccount: [],
      seatsInfo: this.getCookie('seatsInfo'),
      appAccountId: this.appAccountIds
    }
  },
  computed: {
    ...mapGetters({
      thirdStepData: 'seats/getThirdStepData'
    })
  },
  created() {
    if (!this.isAdd) {
      let customAccount = this.seatsInfo.seatPublicNumDetailDtos || []
      customAccount.forEach(item => {
        item.principalName = item.nickName
        item.filename = null
        item.isError = false
        item.seatNickName = item.seatNickName || item.nickName
      })
      this.customAccount = customAccount
      console.log(this.customAccount)
      this.copyArr = JSON.parse(JSON.stringify(this.customAccount))
    }
  },
  watch: {
    appAccountIds() {
      this.init()
    }
  },
  methods: {
    init() {
      this.customAccount = []
      if (this.appAccountIds.length > 0) {
        this.accountList.forEach(item => {
          let idx = this.appAccountIds.indexOf(item.appAccountId)
          if (idx >= 0) {
            item.seatNickName = item.principalName
            item.conditionalHeadImg = item.headImg
            item.filename = null
            item.isError = false
            this.customAccount.push(item)
          }
        })
        this.copyArr = JSON.parse(JSON.stringify(this.customAccount))
      }
    },
    isDone() {
      let arr = []
      for (let index = 0; index < this.customAccount.length; index++) {
        let customAccount = this.customAccount[index]
        let copyArr = this.copyArr[index]
        customAccount.isError = false
        if (customAccount.seatNickName === '') {
          customAccount.isError = true
        }
        let obj = {}
        let isPush = false
        obj.appAccountId = customAccount.appAccountId
        if (customAccount.seatNickName !== copyArr.seatNickName) {
          isPush = true
          obj.seatNickName = customAccount.seatNickName
        }
        if (customAccount.filename !== copyArr.filename) {
          isPush = true
          obj.filename = customAccount.filename
          obj.file = customAccount.file
        }
        if (isPush) {
          arr.push(obj)
        }
      }
      for (let index = 0; index < this.customAccount.length; index++) {
        let customAccount = this.customAccount[index]
        if (customAccount.isError) {
          this.$Message.error('坐席昵称不能为空')
          return false
        }
      }
      return arr
    },
    fileBoob(file, filename, idx) {
      this.customAccount[idx].file = file
      this.customAccount[idx].filename = filename
    },
    ...mapActions({
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  components: {
    UploadImg
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
@import '~@/assets/stylus/mixin'
.custom-seats
  .ivu-menu-item
    display inline-block !important
  .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    &:after
      width 0
  .ivu-menu-vertical.ivu-menu-light:after
    width 0
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    bgColor(inherit)
    color(inherit)
    border-right none
    &:after
      width 0
  .ivu-menu-vertical .ivu-menu-item
    cursor default
  .ivu-menu-submenu-title-icon
    color #409eff
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover
    background-color #fff
  .ivu-menu-submenu-title > i, .ivu-menu-submenu-title span > i
    margin-right 0
  .individuation
    padding-right 20px
    padding-left 20px
    .fold-panel .fold-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .ivu-menu-submenu-title
      border-top solid 1px #e3e4e6
      border-bottom none
    .menu-tit
      display inline-block
      clear()
      .menu-float
        float left
        height 20px
        line-height 20px
        margin-right 10px
      .img
        img
          width 20px
          height 20px
      .tips
        background-color #cacbcc
        padding 0 10px
        color #ffffff
        font-size 12px
        border-radius 3px
    .menu-con
      .menu-con-item
        margin-top 40px
        margin-bottom 40px
        clear()
        .item-name
          float left
          height 40px
          line-height 40px
          margin-right 25px
        .item-info
          float left
          img
            cursor pointer
            width 60px
            height 60px
        .items-tips
          color #979899
          display inline-block
          margin-left 15px
          margin-top 40px
</style>


