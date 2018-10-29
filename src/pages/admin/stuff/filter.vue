<template>
  <div id="filter">
    <div class="filter_wrap">
        <h3>分配坐席</h3>
        <div class="ul">
            <div class="li" v-for="(item, index) in zuoxiStatus" :class="{'active': activeZuoxi === index}" 
            :key="index" @click="setZuoxi(index)">{{item.itemName}}</div>
        </div>
    </div>
    <div class="filter_wrap">
        <h3>员工状态</h3>
        <div class="ul">
            <div class="li" v-for="(item, index) in stuffStatus" :class="{'active': activeStatus === index}" 
            :key="index" @click="setStatus(index)">{{item.itemName}}</div>
        </div>
    </div>
    <div class="filter_wrap">
        <h3>加入时间</h3>
        <div class="ul">
            <DatePicker type="daterange" :transfer='true' format="yyyy年MM月dd日" placement="bottom-start" 
            placeholder="开始时间 - 结束时间" :value="dataVal" style="width: 300px" @on-change="dataChange"></DatePicker>
        </div>
        <div class="time_btn">
            <i-button v-for="(item, index) in otherDates" :key="index" @click="setDate(index)">{{item}}</i-button>
        </div>
    </div>
    <div class="handles">
      <i-button type="primary" @click="confirm" class="width_bg">确定</i-button>
      <i-button @click="cancel">取消</i-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      otherDates: ['最近一周', '最近一个月', '最近三个月'],
      dataVal: [],
      activeZuoxi: 0,
      activeStatus: 0,
      startTime: '',
      endTime: ''
    }
  },
  props: {
    stuffStatus: {
      type: Array,
      default: () => { return [] }
    },
    zuoxiStatus: {
      type: Array,
      default: () => { return [] }
    }
  },
  computed: {
    ...mapGetters({
      filterData: 'stuff/getFilterData'
    })
  },
  created() {
    if (this.filterData) {
      this.dataVal = this.filterData.dataVal
      this.activeZuoxi = this.filterData.activeZuoxi
      this.activeStatus = this.filterData.activeStatus
    }
  },
  methods: {
    init() {
      Object.assign(this.$data, this.$options.data())
    },
    setZuoxi(index) {
      this.activeZuoxi = index
    },
    setStatus(index) {
      this.activeStatus = index
    },
    confirm() {
      this.$store.commit('stuff/SET_Filter_DATA', {dataVal: this.dataVal, activeZuoxi: this.activeZuoxi, activeStatus: this.activeStatus})
      let zuoxiCode = this.zuoxiStatus[this.activeZuoxi].itemValue
      let statusCode = this.stuffStatus[this.activeStatus].itemValue
      let obj = {
        statusQ: statusCode,
        seatStatusQ: zuoxiCode,
        addTimeQ: this.dataVal.length ? this.dataVal[0].replace(/[年月日]/g, '') : this.dataVal[0]
      }
      this.$store.commit('stuff/SET_FILTE_OPT', obj)
      this._BUS.$emit('getUsers')
      this._BUS.$emit('handle', 'goback')
    },
    isArrEqual(arr1, arr2) {
      return arr1[0] === arr2[0] && arr1[1] === arr2[1]
    },
    cancel() {
      this.init()
      this._BUS.$emit('handle', 'goback')
    },
    setDate(index) {
      if (index === 0) {
        this.dataVal = this.calcTime(7)
      } else if (index === 1) {
        this.dataVal = this.calcTime(30)
      } else {
        this.dataVal = this.calcTime(365)
      }
    },
    calcTime(num) {
      let endT = new Date()
      let startT = new Date()
      let start = this.format(startT.getTime() - 3600 * 1000 * 24 * num, 'yyyy年MM月dd日')
      let end = this.format(endT.getTime(), 'yyyy年MM月dd日')
      return [start, end]
    },
    dataChange(data) {
      this.dataVal = data
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#filter
  width 100%
  height 100%
  relative()
  padt:30px
  .filter_wrap
    mb 30px
    :before
      display:table
      content: ''
    h3
      width 150px
      fn(14px)
      font-weight:normal
      alignL()
      inline()
    .ul
      inline()
      .li
        width 60px
        center()
        inline()
        vertical(30px)
        border 1px solid #ddd
        radius(3px)
        mr(20px)
        cursor()
        &.active
            border-color:text_color
            color(text_color)
    .time_btn
      ml(153px)
      mt(5px)
      button
        fn(14px)
        border 1px solid #ddd
        padding 5px 10px
        margin: 10px 20px
        ml(0)
        cursor()
        raius(3px)
</style>
