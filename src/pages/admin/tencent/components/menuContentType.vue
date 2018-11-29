<template>
  <div class="menuContentType">
    <div class="content-wrapper" :class="{errBorder: false}">
      <div class="content-icon">
        <div class="content-icon-item" v-for="(item, index) in contentIcon" :key="index" @click="selectType1(index, item.type)" :class="{active: typeIndex===index}">
         11 <span class="icon" :class="item.icon"></span>
          <div class="content-text">{{item.text}} {{item.type}}</div>
        </div>
      </div>
      <div class="content-item">
        <TextEditor></TextEditor>
      </div>
    </div>
    <div class="err-text" v-show="false">请设置当前菜单内容</div>
  </div>
</template>
<script>
import Const from './const'
import TextEditor from './text'
export default {
  name: 'menuContentType',
  data() {
    return {
      contentIcon: Const.contentIcon,
      typeIndex: 0
    }
  },
  mounted() {
    this.$emit('parentCadcader', false)
    this.$emit('sendType','text')
  },
  methods: {
    selectType1(idx, type) {
      this.typeIndex = idx
      this.$emit('sendType',type)
    }
  },
  components: {
    TextEditor
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.menuContentType
  display block
  .content-wrapper
    height 360px
    border solid 1px #e3e4e5
    &.errBorder
      border solid 1px #f56c6c
    .content-icon
      height 60px
      line-height 60px
      background-color #f7f9fa
      clear()
      .content-icon-item
        cursor pointer
        float left
        margin-right 40px
        &.active
          color #409fff
        &:hover
          color #409fff
        &:nth-of-type(1)
          margin-left 25px
        .icon
          display inline-block
        .content-text
          display inline-block
          margin-left 8px
  .err-text
    font-size 12px
    color: #f56c6c
    margin-top 10px
</style>


