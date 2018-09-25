<template>
  <div class="titleTips"></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'titleTips',
  computed: {
    ...mapGetters({
      routerInfo: 'nav/getRouterInfo'
    })
  },
  watch: {
    'routerInfo.name'(val) {
      switch (val) {
        case 'register':
          document.title = '免费试用-欢迎注册迎客通'
          break
        case 'company':
          document.title = '我的企业'
          break  
        default:
          document.title = '迎客通企业管理'
          break
      }
    }
  }
}
</script>
<style lang="stylus">
.titleTips
  display none
</style>


