<template>
  <div id="linkList">
    <ScrollBar>
      <div class="waterfall-item">
        <div v-for="(item, index) in audioList" :key="index" @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
          <div class="deep_wrap">
            <FileTemp v-show="true" :file="item"></FileTemp>
            <div class="badge"><i class="icon">&#xe637;</i></div>
          </div>
        </div>
      </div>
    </ScrollBar>
  </div>
</template>
<script>

import FileTemp from './FileTemp'
  export default {
    name: 'linkList',
    components: {FileTemp},
    data() {
      return {
        activeIdx: 0,
        audioList:
        [
          {name: '轻音乐.ppt', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.doc', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.pdf', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.zip', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.asdfa', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"},
          {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', size: '1.23MB', source: "http://www.w3school.com.cn/i/horse.mp3"}
        ]
      }
    },
    props: {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$emit('on-change', this.audioList[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.audioList[idx])
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #linkList
    height 100%
    .waterfall-item
      padding 20px 10px
    .li_wrap
      position relative
      height 80px

      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
        boxSizing()
        transform-origin:center center
        transition: 0.2s all cubic-bezier(.46, 1, .23, 1.52);
        radius(5px)
      &:hover, &.active
        z-index 2
        .deep_wrap
          bgColor()
          boxShadow(2px 0px 10px 2px #ccc)
      &.active
        .deep_wrap
          boxShadow(2px 0px 10px 2px #409fff)
          border_(#409fff)
        .badge
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
