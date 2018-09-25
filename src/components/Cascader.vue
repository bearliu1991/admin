<template>
  <div v-show="showCascaderModal" class="cascader" @click.stop>
    <div class="cascader-wrapper">
      <div class="cascader-select">
        <div class="cascader-select-item" :class="{'select-item-active':selectIndex==0}" @click.stop="selectArea(0)">
          省
        </div>
        <div class="cascader-select-item" :class="{'select-item-active':selectIndex==1}" @click.stop="selectArea(1)">
          市
        </div>
        <div class="cascader-select-item" :class="{'select-item-active':selectIndex==2}" @click.stop="selectArea(2)">
          区
        </div>
      </div>
      <div class="cascader-content">
        <div class="area" v-show="selectIndex==0&&!loadingImg">
          <div class="area-item" v-for="(item, index) in provinceData" :key="index">
            <div class="area-text" :class="{active: activeItem.pro == index}"  @click.stop="selectAreaItem('CountyId', item.itemValue, index, item.itemName)">
              {{item.itemName}}
            </div>
          </div>
        </div>
        <div class="area" v-show="selectIndex==1&&!loadingImg">
          <div class="area-item" v-for="(item, index) in cityData" :key="index">
            <div class="area-text" :class="{active: activeItem.city == index}"  @click.stop="selectAreaItem('District', item.itemValue, index, item.itemName)">
              {{item.itemName}}
            </div>
          </div>
        </div>
        <div class="area" v-show="selectIndex==2&&!loadingImg">
          <div class="area-item" v-for="(item, index) in districtData" :key="index">
            <div class="area-text" :class="{active: activeItem.dis == index}" @click.stop="selectDistric(index,  item.itemName)">
              {{item.itemName}}
            </div>
          </div>
        </div>
        <div class="area-img" v-show="loadingImg">
          <Spin fix>
            <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
            <div>loading</div>
          </Spin>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { loadTConfigListTree, queryTItemValueByPager } from '@/api/query'
export default {
  props: {
    showCascaderModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectIndex: 0,
      activeItem: {
        pro: -1,
        city: -1,
        dis: -1
      },
      provinceData: [],
      cityData: [],
      districtData: [],
      loadingImg: true,
      areaName: {
        proName: '',
        cityName: '',
        disName: ''
      }
    }
  },
  created() {
    this.loadTConfigListTree()
  },
  mounted() {
    document.addEventListener('click', () => {
      this.$emit('parentCadcader', false)
    })
  },
  methods: {
    selectAreaItem(str, itemValue, index, itemName) {
      if (str === 'CountyId') {
        this.activeItem.pro = index
        this.areaName.proName = itemName
      } else {
        this.activeItem.city = index
        this.areaName.cityName = itemName
      }
      let params = {
        itemKey: str,
        itemValueOrItemPv: itemValue,
        itemValue: '',
        limit: '10000',
        offset: '0',
        order: 'DESC',
        sort: ''
      }
      this.queryTItemValueByPager(params)
    },
    selectDistric(index, itemName) {
      this.areaName.disName = itemName
      this.activeItem.dis = index
      let areaName = `${this.areaName.proName}/${this.areaName.cityName}/${this.areaName.disName}`
      this.$emit('areaSelect', areaName)
      this.$emit('parentCadcader', false)
    },
    selectArea(val) {
      this.selectIndex = val
    },
    loadTConfigListTree() {
      let obj = {
        itemKeyOrItemKeyDesc: 'Province'
      }
      this.loadingImg = true
      loadTConfigListTree(obj).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          this.provinceData = data.data
        }
      })
    },
    queryTItemValueByPager(params) {
      this.loadingImg = true
      queryTItemValueByPager(params).then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          if (params.itemKey === 'CountyId') {
            this.cityData = data.data.records
            if (this.cityData.length <= 0) {
              this.$emit('parentCadcader', false)
            } else {
              this.selectIndex = 1
            }
            this.$emit('areaSelect', this.areaName.proName)
          } else {
            this.districtData = data.data.records
            if (this.districtData.length <= 0) {
              this.$emit('parentCadcader', false)
            } else {
              this.selectIndex = 2
            }
            let areaName = `${this.areaName.proName}/${this.areaName.cityName}`
            this.$emit('areaSelect', areaName)
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.cascader
  hide-boxShadow()
  position absolute
  box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
  left -160px
  top -315px
  line-height 1
  z-index 4
  width 600px
  text-align left
  background-color #fff
  padding 10px 20px 5px
  .cascader-wrapper
    .cascader-select
      padding-bottom 20px
      border-bottom solid 1px #e6e6e6
      .cascader-select-item
        display inline-block
        height 28px
        margin-right 40px
        padding 6px 23px
        cursor pointer
        border-radius 5px
        &.select-item-active
          background-color #3d96f2
          color #fff
        &:hover
          background-color #3d96f2
          color #fff
    .cascader-content
      .area
        clear()
        margin-top 19px
        .area-item
          float left
          width 25%
          margin-bottom 17px
          .area-text
            display inline-block
            height 28px
            padding 6px 15px
            cursor pointer
            border-radius 5px
            &.active
              background-color #3d96f2
              color #fff
            &:hover
              background-color #3d96f2
              color #fff
      .area-img
        position relative
        height 220px
</style>


