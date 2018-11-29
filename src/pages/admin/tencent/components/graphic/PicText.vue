<template>
  <div id="pic_text" @mouseenter.stop="allEnter">
    <!-- 第一幅为大图片 -->
    <div class="big" @mouseenter.stop="bigEnter">
      <img :src="bigList.info">
      <p class="img_detail">{{bigList.title}}</p>
      <!-- hover 遮盖层 -->
      <PreScan v-show="bigScan" class="scan" @click="bigScan = false"></PreScan>
    </div>
    <!-- 其他为小图片 -->
    <div class="small_wrap">
      <ul class="small" v-if="smallList.length">
        <li v-for="(item, idx) in smallList" :key="idx">
          <a target="_blank" class="small_a">
            <!-- <div class="title">{{item.title}}</div> -->
            <div class="content">
              <span>{{item.content}}</span>
              <img :src="item.info">
            </div>
          </a>
          <!-- hover 遮盖层 -->
          <PreScan v-show="smallScan" class="scan"></PreScan>
        </li>
      </ul>
      <div class="side_part" v-show="linksArr.length === 1">
        <div class="img_descript">
          <p>{{bigList.content}}</p>
        </div>
      </div>
      <div class="detail_btn" v-if="linksArr.length === 1">
        <span style="color: #222;">详情</span>
        <i>></i>
      </div>
      <div class="bottom_detail">
        <div class="user_info">
          <span>更新时间</span>
          <i>13:50</i>
        </div>
      </div>
    </div>
    <!-- hover 遮盖层 -->
    <!-- <PreScan v-show="allScan" class="scan"></PreScan> -->
    <slot></slot>
  </div>
</template>

<script>
import PreScan from './PreScan'
export default {
    name: "pic_text",
    components: {
      PreScan
    },
    data() {
      return {
        allScan: true,
        smallScan: true,
        bigScan: true
      }
    },
    props: {
      linksArr: {
        type: Array,
        default: () => { return [] }
      },
      type: {
        type: String,
        default: 'sucai'
      }
    },
    computed: {
      bigList() {
        return this.linksArr.length ? this.linksArr[0] : {}
      },
      smallList() {
        return this.linksArr.length > 1 ? this.linksArr.slice(1) : []
      }
    },
    methods: {
      allEnter() {
        //
        if (this.type === 'sucai') {
          this.allScan = true
        } else if (this.type === 'shoucang') {

        }
      },
      bigEnter() {
        if (this.type === 'sucai') {
          this.allScan = true
        } else if (this.type === 'shoucang') {

        }
      }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/index.styl'
  .split_line
    relative()
    z-index:1
    bort()

  #pic_text
    relative()
    border-bottom 1px solid #e3e4e6;
    fn(0)
    .big
      relative()
      inline()
      ellipsis()
      width 210px
      height: 116.667px
      fn(14px)
      &:hover
        .scan
          visibility visible
      .scan
        visibility hidden
      img
        radiusTop(5px)
        width: 100%
        height:100%
      p
        absolute()
        width: 100%
        ellipsis()
        vertical(32px)
        color()
        bottom: 0
        alignL()
        padl(15px)
        bgColor(rgba(0, 0, 0 , 0.3))
    .small_wrap
      .side_part
        margin 10px 0
        padding 0px 13px
        width 210px
        overflow hidden
        &:before
          display:table
          content: ''
        .img_descript
          borb()
          padding-bottom 10px
          p
            white-space: pre-wrap
            alignL()
            height: 30px
            line-height: 15px;
            fn(12px)
            overflow:hidden
            color(#606366)
      .detail_btn
        margin 10px 0
        height 12px
        line-height 12px
        padding 0 15px
        fn(14px)
        setBetween()
        color(deep_color)
        i
          color(#979899)
      .bottom_detail
        height 12px
        line-height 12px
        margin 10px 0
        fn(14px)
        padding:0 15px
        .user_info
          setStart()
          fn(12px)
          color(#979899)
          span
            mr(10px)
      .small
        color(#333)
        fn(14px)
        li
          width 210px
          height 44px
          overflow hidden
          padding 6px 13px
          margin 6px 0
          relative()
          &:hover
            .scan
              visibility visible
          .scan
            visibility hidden
          .small_a
            display:block
            color:inherit
            .content
              setBetween()
              img
                width: 32px
                height: 32px
              span
                ellipsis()
                width:120px
</style>
