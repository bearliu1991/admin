<template>
  <div id="stuff">
    <div class="stuff_wrap">
      <CreateUnit></CreateUnit>
        <!-- <router-view></router-view> -->
    </div>
    <!-- <common-footer></common-footer> -->
  </div>
</template>

<script>
import CreateUnit from './CreateUnit'
export default {
  components: { CreateUnit }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#stuff
  height 100%
  .stuff_wrap
    height: 100%
</style>
