<template>
  <div class="add-seats">
    <drawer titleTips="添加坐席" :isScroll="false" v-model="showAddSeats">
      <div slot="content">
        <div class="steps">
          <Steps :current="currentSteps" size="small">
            <Step title="坐席信息"></Step>
            <Step title="坐席权限"></Step>
            <Step title="个性化坐席"></Step>
          </Steps>
        </div>
        <div class="scroll-add" v-show="currentSteps==0">
          <div class="steps0">
            <scroll-bar>
              <add-first-step :createSeat="createSeat"  ref="addFirstStep" :isAdd="true"></add-first-step>
            </scroll-bar>
          </div>
        </div>
        <div  class="scroll-add" v-show="currentSteps==1">
          <div class="steps1">
            <scroll-bar>
              <seatsLimit ref="seatsLimit" :isAdd="true"></seatsLimit>
            </scroll-bar>
          </div>
        </div>
        <div  class="scroll-add" v-show="currentSteps==2">
          <div class="steps2">
            <scroll-bar>
              <customSeats ref="customSeats" :appAccountIds="saveSeatParams.appAccountIds" :isAdd="true"></customSeats>
            </scroll-bar>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper" id="footer-wrapper" :class="{'endStep': currentSteps==2}">
          <Button class="footer-btn" v-show="currentSteps==2" @click="againStep" type="primary">完成并继续添加</Button>
          <Button class="footer-btn" v-show="currentSteps==2" @click="doneStep" type="primary">完成</Button>
          <Button class="footer-btn" v-show="currentSteps!=2" @click="nextStep(currentSteps)" type="primary">保存并下一步</Button>
          <Button class="footer-btn" v-show="currentSteps!=0" @click="lastStep" type="ghost">上一步</Button>
          <Button class="footer-btn" type="ghost" @click="cancalStep">取消</Button>
        </div>
      </div>
    </drawer>
    
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { saveSeat } from '@/api/query'
import addFirstStep from './addFirstStep'
import seatsLimit from './seatsLimit'
import customSeats from './customSeats'
// import axios from 'axios'
export default {
  props: {
    createSeat: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isJixuAdd: false,
      showAddSeats: false,
      currentSteps: 0,
      saveSeatParams: {
        seatId: null,
        remark: null,
        eeId: null,
        appAccountIds: [],
        authIds: [],
        saveConditionalSeatForm: []
      }
    }
  },
  computed: {
    ...mapGetters({
      firstStepData: 'seats/getFirstStepData',
      secondStepData: 'seats/getSecondStepData',
      thirdStepData: 'seats/getThirdStepData'
    })
  },
  mounted() {},
  methods: {
    // saveSeat() {
    //   this.saveSeatParams = JSON.stringify(this.saveSeatParams)
    //   let formData = new FormData()
    //   formData.append('saveSeatParams', this.saveSeatParams)
    //   axios.post('http://localhost:8091/api/seats/saveSeat', formData).then(data => {
        
    //   })
      // saveSeat(this.saveSeatParams).then(data => {
      //   if (data.code === 1) {
      //     this.$Message.success('添加坐席成功')
      //     this.hideAddSeats()
      //     this.$root.Bus.$emit('refreshList')
      //     if (this.isJixuAdd) {
      //       this.currentSteps = 0
      //       setTimeout(() => {
      //         this.showAddSeats = true
      //       }, 0.1)
      //     }
      //   } else if (data.code === 5018) {
      //     this.$Message.warning(data.message)
      //   } else {
      //     this.$Message.warning(data.message)
      //     this.hideAddSeats()
      //   }
      // }).catch(() => {
      //    this.$Message.success('添加坐席失败')
      // })
    // },
    saveSeat() {
      saveSeat(this.saveSeatParams).then(data => {
        if (data.code === 1) {
          this.$Message.success('添加坐席成功')
          this.hideAddSeats()
          this.$root.Bus.$emit('refreshList')
          if (this.isJixuAdd) {
            this.currentSteps = 0
            setTimeout(() => {
              this.showAddSeats = true
            }, 0.1)
          }
        } else if (data.code === 5018) {
          this.$Message.warning(data.message)
        } else {
          this.$Message.warning(data.message)
          this.hideAddSeats()
        }
      }).catch(() => {
         this.$Message.success('添加坐席失败')
      })
    },
    showDrawer() {
      this.showAddSeats = true
    },
    hideAddSeats() {
      this.showAddSeats = false
    },
    nextStep(currentSteps) {
      if (currentSteps === 0) {
        let param = this.$refs['addFirstStep'].isGoNext()
        this.saveSeatParams.seatId = this.createSeat.id || null
        if (param) {
          this.saveSeatParams.remark = param.remark || null
          this.saveSeatParams.eeId = param.eeId || null
          this.currentSteps++
        }
      } else {
        let param = this.$refs['seatsLimit'].isGoNext()
        if (param) {
          this.saveSeatParams.appAccountIds = param.appAccountIds || null
          this.saveSeatParams.authIds = param.authIds || null
          this.currentSteps++
        }
      }
    },
    lastStep() {
      this.currentSteps--
    },
    cancalStep() {
      this.hideAddSeats()
    },
    doneStep() {
      this.isJixuAdd = false
      let param = this.$refs['customSeats'].isDone()
      if (param) {
        this.saveSeatParams.saveConditionalSeatForm = param || null
        console.log(this.saveSeatParams)
        this.saveSeat()
      }
    },
    againStep() {
      this.isJixuAdd = true
      let param = this.$refs['customSeats'].isDone()
      if (param) {
        this.saveSeatParams.saveConditionalSeatForm = param || null
        this.saveSeat()
      }
    },
    ...mapActions({
      setFirstStepData: 'seats/setFirstStepData',
      setSecondStepData: 'seats/setSecondStepData',
      setThirdStepData: 'seats/setThirdStepData'
    })
  },
  watch: {
    showAddSeats(val) {
      if (!val) {
        this.currentSteps = 0
      }
    }
  },
  components: {
    seatsLimit,
    customSeats,
    addFirstStep
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.add-seats
  .steps
    padding 50px 0 50px 20px
    .ivu-steps
      .ivu-steps-item
        width 40% !important
        &:nth-last-of-type(1)
          width 17.3333% !important
      .ivu-steps-item.ivu-steps-status-wait .ivu-steps-title
        color #979899
  .scroll-add
    height calc(100% - 122px)
    .steps1, .steps2, .steps0
      height 100%
  .steps0
    padding-left 20px
#footer-wrapper
  &.endStep
    .footer-btn
      width 90px
      &:nth-of-type(1)
        width 130px
</style>
 
 
