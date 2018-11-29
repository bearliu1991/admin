<template>
  <div class="editMenu">
    <div class="item-left">
      <WechatMenu :menuParams="passParams"></WechatMenu>
    </div>
    <div class="item-right">
      <WechatContent :contentParams="passParams"></WechatContent>
    </div>
  </div>
</template>
<script>
import WechatMenu from '../components/WechatMenu'
import WechatContent from '../components/WechatContent'
export default {
  name: 'meterial',
  data() {
    return {
      passParams: {
        level: 0,
        menu: {},
        selectedMenuIndex: '',
        selectedSubMenuIndex: '',
        menuNameBounds: 1
      }
    }
  },
  watch: {
    // passParams: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true
    // }
  },
  methods: {
    updataMenuDone(params) {
      this.passParams = params
    }
  },
  components: {
    WechatMenu,
    WechatContent
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.editMenu
  padding 30px 30px 0
  min-height 650px 
  position relative
  clear()
  .item-left
    float left
    width 314px
  .item-right
    float left
    margin-left 30px
    width calc(100% - 344px)
</style>


