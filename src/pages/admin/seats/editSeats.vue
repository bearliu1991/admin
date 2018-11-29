<template>
  <div class="edit-seats">
    <drawer titleTips="修改" :isScroll="false" v-model="showEditSeats" :isCloseHeghtLight="heghtLightStatu">
      <div slot="content">
        <div class="tab-wrapper">
          <Tabs v-model="editTabsVal" :animated="false">
            <TabPane label="坐席信息" name="1">
              <scroll-bar>
                <add-first-step v-if="editTabsVal == '1'" ref="addFirstStep"></add-first-step>
              </scroll-bar>
            </TabPane>
            <TabPane label="坐席权限" name="2">
              <div class="noseatDate" v-show="accountList.length<=0">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没有绑定公众号</div>
                <div class="item btn"><Button type="primary" @click="addAccount">添加公众号</Button></div>
              </div>
              <scroll-bar v-show="accountList.length>0">
                <seatsLimit v-if="editTabsVal == '2'" ref="seatsLimit"></seatsLimit>
              </scroll-bar>
            </TabPane>
            <TabPane label="个性化坐席" name="3">
              <div class="noseatDate" v-show="!seatsInfo.seatPublicNumDetailDtos">
                <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
                <div class="item tip">您还没个性化坐席</div>
                <div class="item small-tip">如需个性化坐席请先设置坐席权限</div>
                <div class="item btn"><Button type="primary" @click="setAuthSeat">设置坐席权限</Button></div>
              </div>
              <scroll-bar v-show="seatsInfo.seatPublicNumDetailDtos">
                <customSeats v-if="editTabsVal == '3'" ref="customSeats"></customSeats>
              </scroll-bar>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button class="footer-btn" @click="saveSeatsInfo" type="primary" :loading="doneLoading">保存</Button>
        <Button class="footer-btn" @click="back" type="ghost" :disabled="doneLoading">返回</Button>
      </div>
    </drawer>
  </div>  
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import {updateSeatBaseInfo, updateSeatAuth, updateConditionalSeat} from '@/api/query'
import addFirstStep from './addFirstStep'
import seatsLimit from './seatsLimit'
import customSeats from './customSeats'
export default {
  props: {
    tabsVal: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      heghtLightStatu: true,
      showEditSeats: false,
      editTabsVal: '1',
      accountList: this.getCookie('accountList') || [],
      doneLoading: false
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      firstStepData: 'seats/getFirstStepData',
      secondStepData: 'seats/getSecondStepData',
      thirdStepData: 'seats/getThirdStepData',
      seatsInfo: 'seats/getSeatsInfo'
    })
  },
  watch: {
    tabsVal(val) {
      this.editTabsVal = val
    },
    showEditSeats(val) {
      if (!val) {
        this.editTabsVal = '1'
      }
    }
  },
  methods: {
    setAuthSeat() {
      this.editTabsVal = '2'
    },
    addAccount() {
      this.$router.push({name: 'tencentManage'})
    },
    updateSeatBaseInfo(params) {
      this.doneLoading = true
      updateSeatBaseInfo(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改坐席信息成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else if (data.code === 5018) {
          this.$Message.error('修改失败,员工已有坐席')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    updateSeatAuth(params) {
      updateSeatAuth(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改坐席权限成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    updateConditionalSeat(params) {
      updateConditionalSeat(params).then(data => {
        this.doneLoading = false
        if (data.code === 1) {
          this.$Message.success('修改个性化坐席成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(() => {
        this.doneLoading = false
      })
    },
    showDrawer() {
      this.showEditSeats = true
    },
    saveSeatsInfo() {
      this.heghtLightStatu = false
      this.editSeatParams = {}
      this.editSeatParams.seatId = this.seatsInfo.id || null
      if (this.editTabsVal === '1') {
        let param = this.$refs['addFirstStep'].isGoNext()
        if (param) {
          param.seatId = this.seatsInfo.id || null
          this.updateSeatBaseInfo(param)
        }
      } else if (this.editTabsVal === '2') {
        let param = this.$refs['seatsLimit'].isGoNext()
        if (param) {
          param.seatId = this.seatsInfo.id || null
          this.updateSeatAuth(param)
        }
      } else {
        let isUpdate = this.$refs['customSeats'].isDone()
        if (isUpdate) {
          let param = {}
          param.updateConditionalSeats = this.$refs['customSeats'].isDone()
          if (param) {
            param.seatId = this.seatsInfo.id || null
            this.updateConditionalSeat(param)
          }
        }
      }
    },
    hideEditSeats() {
      this.showEditSeats = false
    },
    back() {
      this.heghtLightStatu = true
      this.hideEditSeats()
    },
    ...mapActions({
      setFirstStepData: 'seats/setFirstStepData',
      setSecondStepData: 'seats/setSecondStepData',
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  components: {
    seatsLimit,
    customSeats,
    addFirstStep
  }
}
</script>
<style lang="stylus">
.edit-seats
  .ivu-tabs-content
    margin-top 30px
  .tab-wrapper
    padding-top 20px
</style>


