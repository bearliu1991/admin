<template>
  <div id="linkList">
    <ScrollBar>
    <waterfall :line-gap="225" :watch="linkList">
      <!-- each component is wrapped by a waterfall slot -->
      <waterfall-slot
        class="waterfall-item"
        v-for="(item, index) in linkList"
        :width="210"
        :height="picTextHeight[item.info.length]"
        :order="index"
        :key="index"
      >
        <div @click="chooseIdx(index)" class="li_wrap" :class="{'active': activeIdx === index}">
          <div class="deep_wrap" >
            <PicText :linksArr="item.info"></PicText>
          </div>
          <div class="badge"><i class="icon">&#xe637;</i></div>
        </div>
      </waterfall-slot>
    </waterfall>
    </ScrollBar>
  </div>
</template>
<script>
import PicText from './PicText'
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
  export default {
    name: 'linkList',
    data() {
      return {
        activeIdx: 0,
        picTextHeight: {
          1: 232,
          2: 212,
          3: 262,
          4: 312,
          5: 362,
          6: 412,
          7: 462,
          8: 512,
          9: 562
        },
        linkList: [
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 512
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              }
            ]
          },
          {
            name: '我',
            type: 1,
            infoType: 0,
            msgType: 6,
            id: 51,
            chatTime: 1533260730,
            info: [
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '今山东分局哦我就饿哦极乐世界的富婆视频和教师辅导辅导和',
                msgType: 6,
                infoType: 0,
                id: 511
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 512
              },
              {
                info: 'http://xingke100.com/logo.png',
                title: '进垃圾堆了',
                content: '是公司鬼斧神工三个都是更好地发挥的好的人同样',
                msgType: 6,
                infoType: 0,
                id: 513
              }
            ]
          }
        ]

      }
    },
    props: {
      sourceArr: {
        type: Array,
        default: () => { return [] }
      },
      type: {
        type: [Number, String],
        default: 0
      }
    },
    mounted() {
      this.init()
    },
    components: {
      PicText,
      Waterfall,
      WaterfallSlot},
    methods: {
      init() {
        this.$emit('on-change', this.linkList[0])
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        this.$emit('on-change', this.linkList[idx])
      },
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #linkList
    height 100%
    .waterfall-item
      padding 20px
    .li_wrap
      position relative
      width 210px
      boxSizing()
      .badge
        display none
      .deep_wrap
        position relative
        // flex_()
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
          boxShadow(-1px 2px 12px 3px #ccc)
      &.active
        .deep_wrap
          boxShadow(-1px 2px 12px 3px #409fff)
          border_(#409fff)
        .badge
          display block
          position absolute
          bottom 0
          right 0
          i
            color #409fff
</style>
