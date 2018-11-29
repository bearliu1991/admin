<template>
  <div id="typeArr">
    <ul>
      <li v-for="(item, index) in sourceArr" :key="index" 
        @click="chooseIdx(index)" :class="liClass(index)">
        <div class="li_wrap">
          <div v-if="type === 0" class="text_type">
            <div class="name_time">
              <span>{{item.name}}</span>
              <span>{{item.time}}</span>
            </div>
            <div class="text_main">
              <p>{{item.content}}</p>
            </div>
          </div>
          <div v-if="type === 2" class="img_type">
            <div class="img_wrap">
              <img :src="item.src" >
            </div>
            <span class="img_span">{{item.name}}</span>
            <div class="img_cont">
                <i>{{item.user}}</i>
                <p>{{item.time}}</p>
            </div>
          </div>
          <div v-if="type === 3" class="video_type">
            <AudioType></AudioType>
          </div>
          <div v-if="type === 4" class="video_type">
            <div class="video_wrap">
              <div class="wrap icon play" @click.stop="play"><Icon type="videocamera"></Icon></Icon></div>
              <div class="discription">
                <p>打包合集</p>
                <span>1.3M</span>
              </div>
            </div>
            <div class="user_detail">
              <span>赵四(ZX0001)</span>
              <i>15:28</i>
            </div>
          </div>
          <div v-if="type === 5" class="video_type">
            <div class="video_wrap">
              <div class="wrap icon play" @click.stop="play"><Icon type="document-text"></Icon></Icon></div>
              <div class="discription">
                <p>打包合集</p>
                <span>1.3M</span>
              </div>
            </div>
            <div class="user_detail">
              <span>赵四(ZX0001)</span>
              <i>15:28</i>
            </div>
          </div>
        </div>
        <Icons v-if="index === activeIdx" 
          :rightVal="type === 0 ? '20px' : type === 2 ? '-10px' : 0 "
          :bottomVal="type === 2 ? '-10px' : 0"></Icons>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'typeArr',
    data() {
        return {
          activeIdx: 0
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
    components: {},
    methods: {
      chooseIdx(idx) {
        this.activeIdx = idx
      },
      liClass(index) {
        let obj = {
          'active': index === this.activeIdx,
          "text_li": this.type === 0,
          "img_li": this.type === 2,
          "file_li": this.type === 5 || (this.type === 3) || (this.type === 4)
        }
        return obj
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/assets/css/index.styl'
        
  #typeArr
    ul
      li
        relative()
        padding:0 20px
        &.text_li
          margin:20px
          cursor()
          .li_wrap
            relative()
            bgColor()
            .text_type
              padding:20px
              radius(5px)
          &:hover, &.active
            .text_type
              // top:-10px
              // left: -10px
              // width: calc(100% + 20px)
              // height: calc(100% + 20px)
              boxShadow(-1px 2px 12px 3px #ccc)
          &.active
            .text_type
              border_(text_color)
        &.img_li
          border-sizing:border-box
          border_(transparent)
          height:170px
          fl()
          width: 30%
          text-align:center
          margin: 1.66%
          setColumn()
          alignL()
          &:hover, &.active
            .li_wrap
              top:-10px
              left: -10px
              width: calc(100% + 20px)
              height: calc(100% + 20px)
              padding:10px
              bgColor()
              boxShadow(-1px 2px 12px 3px #ccc)
          &.active
            .li_wrap
              border_(text_color)
        &.file_li
          cursor()
          height 80px
          margin:20px 30px
          &:hover, &.active
            .li_wrap
              top:-10px
              left: -10px
              width: calc(100% + 10px)
              height: calc(100% + 10px)
              padding:10px
              bgColor()
              boxShadow(-1px 2px 12px 3px #ccc)
          &.active
            .li_wrap
              border_(text_color)
          // .li_wrap
          //   padding:0 20px
        .li_wrap
          absolute()
          flex_()
          top:0
          left:0
          transform-origin:center center
          transition: 0.5s all cubic-bezier(.46, 1, .23, 1.52);
          height:100%
          width:100%
          radius(5px)
          .text_type
            .name_time
              setBetween()
              mb(15px)
            .text_main
              white-space: pre-wrap
              line-height:20px
              alignL()
              fn(12px)
          .img_type
            width: 100%
            .img_wrap
              flex:1
              height:128px
              setMiddle()
              img
                max-width: 100%
                max-height: 100%
            .img_span
              margin: 5px 0
            .img_cont
              setStart()
              i
                mr(5px)
          .video_type
            setBetween()
            .video_wrap
              setStart()
              &.active
                border:1px solid text_color
              video
                display:none
              .wrap
                margin:0 10px
                radius(50%)
                fn(20px)
                color(text_color)
                mr(10px)
                cursor()
          .user_detail
            mt(-20px)
</style>
