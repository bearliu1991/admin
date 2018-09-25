<template>
  <div class="edit-seats">
    <drawer titleTips="修改" :isScroll="false" v-model="showEditSeats">
      <div slot="content">
        <div class="tab-wrapper">
          <Tabs v-model="editTabsVal" :animated="false">
            <TabPane label="坐席信息" name="1">
              <scroll-bar>
                <add-first-step v-if="editTabsVal == '1'" ref="addFirstStep"></add-first-step>
              </scroll-bar>
            </TabPane>
            <TabPane label="坐席权限" name="2">
              <scroll-bar>
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
        <Button class="footer-btn" @click="saveSeatsInfo" type="primary">保存</Button>
        <Button class="footer-btn" @click="back" type="ghost">返回</Button>
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
      showEditSeats: false,
      editTabsVal: '1'
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
    updateSeatBaseInfo(params) {
      updateSeatBaseInfo(params).then(data => {
        if (data.code === 1) {
          this.$Message.success('修改成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.warning('修改失败')
        }
      })
    },
    updateSeatAuth(params) {
      updateSeatAuth(params).then(data => {
        if (data.code === 1) {
          this.$Message.success('修改成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.warning('修改失败')
        }
      })
    },
    updateConditionalSeat(params) {
      updateConditionalSeat(params).then(data => {
        if (data.code === 1) {
          this.$Message.success('修改成功')
          this.$emit('editInfoSeat', this.seatsInfo.id, 'seatsInfo', this.editTabsVal)
          this.hideEditSeats()
        } else {
          this.$Message.warning('修改失败')
        }
      })
    },
    showDrawer() {
      this.showEditSeats = true
    },
    saveSeatsInfo() {
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
</style>


