<template>
  <div class="text-editor">
    <div class="editor-main" ref="editor">

    </div>
    <div class="inser-content">
      <div class="inser-item" @click="addFace()">
        <span class="icon icon-gaikuang"></span>
      </div>
      <div class="inser-item">
        <span class="icon icon-gaikuang"></span>
      </div>
      <div class="inser-item">
        <span class="fans-name">[粉丝昵称]</span>
      </div>
      <div class="inser-item inser-tips">
        <span class="right-span">还可输入 <span class="text-num">{{textLength}}</span> 字，按下Enter键换行</span>
      </div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
const TEXTMAXNUM = 600
export default {
  name: 'textEditor',
  data() {
    return {
      editor: null,
      editorContent: '',
      textLength: TEXTMAXNUM
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.editor = new E(this.$refs.editor)
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.textLength = this.filterText(this.editor.txt.text(), TEXTMAXNUM)
      }
      this.editor.customConfig.menus = []
      this.editor.customConfig.zIndex = 1
      this.editor.customConfig.onchangeTimeout = 17
      this.editor.create()
    },
    addFace() {
      this.editor.cmd.do('insertHTML', '<p>11122112</p>')
    },
    filterText(str, num) {
      str = str.replace(/&nbsp;/g, '')
      let strLen = str.length
      return num - strLen
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.text-editor
  .editor-main
    height 260px
    .w-e-toolbar
      display none
    .w-e-text-container
      height 260px !important
      border none !important
      .w-e-text
        overflow auto
  .inser-content
    height 40px
    line-height 40px
    border-top solid 1px #e3e4e6
    clear()
    .inser-item
      float left
      margin-left 30px
      cursor pointer
      color #606366
      &:hover
        color #409fff
      span 
        display inline-block
        .text-num
          color #606366
    .inser-tips
      float right
      margin-right 30px
      .right-span
        color: #979899
</style>

