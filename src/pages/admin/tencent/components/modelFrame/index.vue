<template>
  <div id="modelFrame">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="container">
      <div class="left">
        <ul class="label">
          <slot name="label"></slot>
        </ul>
      </div>
      <div class="right">
        <div class="action">
          <searchinput class="searchinput" @change="getKeyWord"></searchinput>
          <div class="upload">
            <slot name="action"></slot>
          </div>
        </div>
        <div class="main-container">
          <slot name="main"></slot>
        </div>
      </div>
    </div>
    <div class="pagenation">
      <Page :styles="{height: '28px'}" :total="40" @on-change="change" @on-page-size-change="pageSizeChange" size="small" show-total show-elevator show-sizer  />
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import searchinput from './searchInput'
  export default {
    name: 'modelFrame',
    components: {
      searchinput
    },
    model: {
    },
    data() {
      return {
        page: 1,
        pageSize: 10,
        total: 40
      }
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      getKeyWord(keyword) {
        this.$emit('keyword', keyword)
      },
      change(page) {
        console.log(page)
      },
      pageSizeChange(pageSize) {
        console.log(pageSize)
      },
    }
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#modelFrame
  width: 885px;
  height: 740px;
  background-color: #ffffff;
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: solid 1px #cacbcc;
  padding 20px
  css3Middle()
  .header
    height 20px
    line-height 20px
    margin-bottom 20px
    font-size: 18px;
    .title
      display inline-block
      width 820px
    .close
      display inline-block
      width 10px

  .container
    display table-row
    height: 550px;

    .left
      display table-cell
      vertical-align: top;
      width: 160px;
      .label
        padding-top 15px
        text-align center
        li
          font-size: 14px
          color: #606366;
          margin-bottom 30px
          &.active
            color #409fff

    .right
      display table-cell
      vertical-align: top;
      width: 704px;
      .action
        height 30px
        line-height 30px
        #search_input
          display inline-block
          width 620px
        .upload
          display inline-block
          text-align right
          width 80px
      .main-container
        margin 20px 0
        width: 704px;
        height: 500px;
        background-color: #f7f9fa;
        overflow-y auto

  .pagenation
    text-align right

  .footer
    text-align right
    margin 30px 0
    button
      width 60px
      height 32px
      ml(20px)
    .cancel
      background #ffffff
</style>

