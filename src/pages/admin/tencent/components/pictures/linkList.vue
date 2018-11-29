<template>
  <div id="linkList">
    <ScrollBar>
      <div class="waterfall-item">
        <div v-for="(item, index) in imgList" :key="index" @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
          <div class="deep_wrap">
            <TypeArr :type="2" v-show="true" :picture="item"></TypeArr>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>
import TypeArr from './typeArr'
  export default {
    name: 'linkList',
    data() {
      return {
        activeIdx: 0,
        imgList:
        [
          {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: 'http://xingke100.com/logo.png'},
          {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: 'https://file.iviewui.com/asd/asd-coding.png'},
          {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: 'http://xingke100.com/logo.png'},
          {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: 'http://xingke100.com/logo.png'},
          {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: 'http://thirdwx.qlogo.cn/mmopen/UexNUibPFfPA502DIs4EgK8Z2lXDpicp8BdiaIu2avlSXAsEib6hpbibw7TLdFyRerYhWYR73QrQMXVZfy1RWRuG39tzQZwkm3ZhN/132'}
        ],
      }
    },
    props: {},
    mounted() {
      this.init()
    },
    components: {TypeArr},
    methods: {
      init() {
        this.$emit('on-change', this.imgList[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.imgList[idx])
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #linkList
    height 100%
    .waterfall-item
      padding 14px
    .li_wrap
      display inline-block
      position relative
      width 225px
      height 164px

      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
        boxSizing()
        transform-origin:center center
        transition: 0.3s all cubic-bezier(.46, 1, .23, 1.52);
        radius(5px)
      &:hover, &.active
        z-index 2
        padb(0px)
        .deep_wrap
          margin-top:-3px
          bgColor()
          boxShadow(-1px 2px 10px 2px #ccc)
      &.active
        .deep_wrap
          boxShadow(-1px 2px 10px 2px #409fff)
          border_(#409fff)
        .badge
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
