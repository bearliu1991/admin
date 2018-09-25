<template>
  <div class="groupCheckBox">
    <div class="set_wrap">
      <div v-for="(chid, indx) in totals" :key="indx">
        <div class="limit-wrapper-title limit-wrapper-title2">
          <div class="limit-check-first">
            <Icon type="ios-circle-filled" v-if="calcAll(chid, true) === 2" 
          @click.stop="setTopRight(2, indx)" v-show="isEdit"></Icon>
          <Icon type="ios-minus" v-if="calcAll(chid, true) === 1" 
          @click.stop="setTopRight(1, indx)" v-show="isEdit"></Icon>
          <Icon type="ios-circle-outline" v-if="calcAll(chid, true) === 0" 
          @click.stop="setTopRight(0, indx)" v-show="isEdit"></Icon>
          {{chid.name}}
          </div>
        </div>
        <div class="menu-wrapper">
          <div class="menu-wrapper-list" v-for="(item, key, index) in chid.obj" :key="index">
            <FoldPanel :isFold="true">
              <div slot="title">
                <div class="limit-check-second">
                  <Icon type="ios-circle-filled" v-if="calcAll(item.data) === 2" 
                  @click.stop="setMiddleRight(2, key, indx)" v-show="isEdit"></Icon>
                  <Icon type="ios-minus" v-if="calcAll(item.data) === 1" 
                  @click.stop="setMiddleRight(1, key, indx)" v-show="isEdit"></Icon>
                  <Icon type="ios-circle-outline" v-if="calcAll(item.data) === 0" 
                  @click.stop="setMiddleRight(0, key, indx)" v-show="isEdit"></Icon>
                  {{item.name}}
                </div>
              </div>
              <div slot="container">
                <div class="limit-check-third">
                  <div v-for="(n, idx) in item.data" :key="idx">
                    <Checkbox :label="n.isSelect" v-show="isEdit" v-model="n.isSelect">{{n.cont}}</Checkbox>
                  </div>
                </div>
              </div>
            </FoldPanel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totals: []
    }
  },
  props: {
    systems: {
      default: () => {
        return []
      },
      type: Array
    },
    isEdit: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    systems: {
      handler(newValue, oldValue) {
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.totals = this.deepCopy(this.systems)
      console.log(this.totals)
    },
    // 设置顶层权限
    setTopRight(num, indx) {
      let arr = this.deepCopy(this.totals)
      let data = arr[indx].obj
      for (let key of Object.keys(data)) {
        let obj = data[key].data
        for (let n of obj) {
          n.isSelect = num === 0
        }
      }
      this.$set(this, 'totals', arr)
    },
    getSysId(num) {
      let arr = []
      for (let val of this.totals) {
        for (let key of Object.keys(val.obj)) {
          let obj = val.obj[key].data
          for (let n of obj) {
            n.isSelect && arr.push(n.id)
          }
        }
      }
      console.log(this.dedupe(arr))
      return this.dedupe(arr)
    },
    // 设置二级权限
    setMiddleRight(num, key, index) {
      let array = []
      if (num === 0) {
        array = this.resetObj(key, true, index)
      } else {
        array = this.resetObj(key, false, index)
      }
      this.$set(this, 'totals', array)
    },
    resetObj(key, bool, index) {
      let arr = this.deepCopy(this.totals)
      let data = arr[index].obj[key].data
      for (let val of data) {
        val.isSelect = bool
      }
      return arr
    },
    // 计算如何显示图标
    calcAll(data, bool) {
      if (bool) {
        let allTrue = []
        let allFalse = []
        for (let key of Object.keys(data.obj)) {
          let obj = data.obj[key].data
          allTrue.push(
            obj.every(item => {
              return item.isSelect === true
            })
          )
          allFalse.push(
            obj.every(item => {
              return item.isSelect === false
            })
          )
        }
        if (
          allTrue.every(n => {
            return n === true
          })
        ) {
          return 2
        }
        if (
          allFalse.every(n => {
            return n === true
          })
        ) {
          return 0
        }
        return 1
      } else {
        let count = 0
        data.forEach(val => {
          val.isSelect && count++
        })
        if (data.length === count) {
          return 2
        }
        if (count > 0 && count < data.length) {
          return 1
        }
        return 0
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#rightSet
  height 100%
  width 100%
  mt(1px)
  .set_wrap
    .big_title
      bgColor(#f0faff)
      fn(16px)
      padding 5px 20px
    .ivu-menu-submenu-title
      borb()
    .ivu-menu-item
      display inline-block !important
      border 0 !important
    .ivu-menu-item-active:not(.ivu-menu-submenu)
      bgColor(inherit)
      color(inherit)
      border 0
      &:after
        width 0
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
</style>
