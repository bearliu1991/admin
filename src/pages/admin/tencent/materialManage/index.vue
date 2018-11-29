<template>
  <div id="collect_group" @click.stop>
    <div class="title_wrap">
      <p>选择素材</p>
      <Icon type="close-round" class="know_icon" @click="close"></Icon>
    </div>
    <div class="title_pro">
      <ul class="collet_title">
        <li v-for="(btn, index) in btns" :key="index" :class="{'li_active': btnIdx === index}" @click="switchBtn(index)">{{btn}}</li>
      </ul>
      <Input v-model="inputVal" placeholder="搜索文章标题" style="width: 200px">
        <span slot="prepend"><Icon type="ios-search"></Icon></span>
      </Input>
    </div>
    <div class="content_wrap">
      <div class="left-wrapper">
        <div class="scroll-wrapper">
          <ScrollBar>
            <div class="item" v-for="(item, idx) in groupList" :key="idx" :class="{active:idx === groupIndex}"
              @click.stop="groupSwitch(idx)">
              <span class="inblock">{{item.name}}</span>
            </div>
          </ScrollBar>
        </div>
      </div>
      <div class="right-wrapper">
        <div class="main_cont">
          <TypeArr :type="0" v-show="btnIdx === 0" :sourceArr="textList"></TypeArr>
          <TypeArr :type="2" v-show="btnIdx === 2" :sourceArr="imgList"></TypeArr>
          <TypeArr :type="3" v-show="btnIdx === 3" :sourceArr="videoList"></TypeArr>
          <TypeArr :type="4" v-show="btnIdx === 4" :sourceArr="videoList"></TypeArr>
          <TypeArr :type="5" v-show="btnIdx === 5" :sourceArr="fileList"></TypeArr>
          <LinkList v-if="btnIdx === 1"></LinkList>
          <!-- <collectList :groupIndex="groupIndex" :btnIdx="btnIdx" :collectData="collectData" @hidePoptip="hidePoptip"></collectList> -->
        </div>
      </div>
    </div>
    <Pages class="page_vue"></Pages>
    <ul class='pro_btns'>
        <li class="send">发送</li>
        <li class="cancel" @click="close">取消</li>
      </ul>
  </div>
</template>

<script>
// 模板
import LinkList from "./linkList"
import TypeArr from "./typeArr"
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      btnIdx: 0,
      groupIndex: 0,
      groupInput: "",
      showInput: false,
      inputVal: '',
      btns: ['文本消息', '图文信息', '图片', '语音', '视频', '文件'],
      groupList: [
        {name: '全部', val: 0},
        {name: '祝福', val: 1},
        {name: '问候', val: 2},
        {name: '有事', val: 3},
        {name: '未分组', val: 4}
      ],
      textList:
      [
        {name: 'Yoko', time: '2018-4-2 12:32', content: '安徽都少见啊怕大家小女测量距离为了减肥立刻集散地分厘卡即使了解更多六十九公里破IP全屏取景安稳平静安抚啊大家斯拉夫卡丢了就看得更加动感'},
        {name: 'Yoko', time: '2018-4-2 12:32', content: '安徽都少见啊怕大家小女测量距离为了减肥立刻集散地分厘卡即使了解更多六十九公里破IP全屏取景安稳平静安抚'},
        {name: 'Yoko', time: '2018-4-2 12:32', content: '安徽都少见啊怕大家小女测量距离为了减肥立刻集散地分厘卡即使了解更多六十九公里破IP全屏取景安稳平静安抚'},
        {name: 'Yoko', time: '2018-4-2 12:32', content: '安徽都少见啊怕大家小女测量距离为了减肥立刻集散地分厘卡即使了解更多六十九公里破IP全屏取景安稳平静安抚'},
        {name: 'Yoko', time: '2018-4-2 12:32', content: '安徽都少见啊怕大家小女测量距离为了减肥立刻集散地分厘卡即使了解更多六十九公里破IP全屏取景安稳平静安抚'}
      ],
      imgList:
      [
        {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: '/static/imgs/1.jpg'},
        {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: '/static/imgs/2.jpg'},
        {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: '/static/imgs/3.jpg'},
        {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: '/static/imgs/4.jpg'},
        {name: 'sdflj.jpg', user: '郭军(ZXX001)', time: '12:32', src: '/static/imgs/4.jpg'}
      ],
      videoList:
      [
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'}
      ],
      fileList:
      [
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'},
        {name: '轻音乐.mp3', user: "郭军(ZX0001)", time: '12:32', length: '00:30 "'}
      ]
    }
  },
  computed: {
    ...mapGetters({ getCollectList: "collect/getCollectList" }),
    collectData() {
      return this.getCollectList.length ? this.getCollectList[this.groupIndex] : []
    }
  },
  methods: {
    // 顶部btn切换
    switchBtn(idx) {
      this.btnIdx = idx
    },
    // 组切换
    groupSwitch(idx) {
      this.groupIndex = idx
    },
    close() {
      this.$emit("close", false)
    },
    ...mapActions({
      addStoreGroup: "collect/addStoreGroup",
      delStoreGroup: "collect/delStoreGroup",
      getStore: 'collect/getStore'
    })
  },
  watch: {
    groupInput(val) {
      this.groupInput = val.substring(0, 10)
    }
  },
  components: { LinkList, TypeArr }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/index.styl'

#collect_group
  fn(14px)
  .title_wrap
    setBetween()
    mb(25px)
    >p
      alignL()
      fn(18px)
    .know_icon
      cursor()
  .title_pro
    setBetween()
    mb(15px)
    .ivu-input-group
      .ivu-input-group-prepend
        radius(16px)
        border:none
      .ivu-input
        border:none
        bgColor(#eee)
        radiusRight(16px)
  .collet_title
    setStart()
    li
      border:1px solid transparent
      padding: 0 12px
      height 28px
      line-height:26px
      radiusLeft(14px)
      radiusRight(14px)
      cursor()
      &.li_active
        color(text_color)
        border: 1px solid text_color
  .content_wrap
    flex_()
    .left-wrapper
      width 153px
      border-right solid 1px #ddd
      .title
        font-size 14px
        font-weight bold
        border-bottom solid 1px #ddd
        padding 5px 0
        text-align center
      .scroll-wrapper
        height 400px
        width: 100%
        overflow auto
        .item
          cursor pointer
          text-align center
          position relative
          &.active
            color(text_color)
          &:hover
            bgColor(#dedede)
            .delete
              display block
          .inblock
            display inline-block
            padding:15px 0
    .right-wrapper
      flex 1
      max-width 100%
      .main_cont
        height 440px
        overflow-y:auto
        bgColor(#f8f9fb)
      .title
        font-size 14px
        font-weight bold
        text-align center
        border-bottom solid 1px #ddd
        padding 5px 10px
  .page_vue
    mt(10px)
  .pro_btns
    mt(30px)
    setEnd()
    li
      padding:0 15px
      vertical(35px)
      radius(3px)
      inline()
      border_()
      ml(10px)
      cursor()
      &.send
        bgColor(text_color)
        color()
      &.delete
        border_(text_color)
        color(err_color)

</style>
