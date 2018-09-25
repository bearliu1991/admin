<template>
  <div id="main">
    <common-header></common-header>
    <div class="main-wrapper">
      <div class="main-content">
        <router-view></router-view>
      </div>
      
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#main
  height 100%
  width 100%
  .main-wrapper
    min-height calc(100% - 183px)
    margin 32px 30px 10px
    background-color #ffffff
    box-shadow 1px 2px 18px 0px rgba(0, 0, 0, 0.2)
    hide-boxShadow()
</style>
