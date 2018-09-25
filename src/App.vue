<template>
  <div id="app" :class="{wrapperMargin:wrapperMargin,scrollMargin: scrollMargin}">
    <router-view/>
    <titleTips></titleTips>
  </div>
</template>

<script>
import { getCookieSession, setCookieSession } from '@/assets/js/cookies'
import { getSessionId } from '@/api/query'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      timer: null,
      wrapperMargin: false,
      scrollMargin: false
    }
  },
  computed: {
    ...mapGetters({
      message: 'user/getMessage'
    })
  },
  mounted() {
    if (!getCookieSession()) {
      this.getSessionId()
    }
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.getSessionId()
      }, 1000 * 60 * 28)
    }
  },
  methods: {
    getSessionId() {
      getSessionId().then(data => {
        setCookieSession(data.sessionId, 0.041)
      })
    },
    ...mapActions({
      setRouterInfo: 'nav/setRouterInfo'
    })
  },
  watch: {
    message(val) {
      if (val === 2) {
        if (this.$route.name !== 'login' && this.$route.name !== 'register') {
          this.$router.push({ name: 'login' })
        }
      }
    },
    $route(to, from) {
      this.setRouterInfo(to)
      switch (to.name) {
        case 'register':
          break
        case 'home':
          this.wrapperMargin = true
          break
        case 'survey':
          this.scrollMargin = true
          break
        default:
          this.wrapperMargin = false
          this.scrollMargin = false
          break
      }
      if (to.name === 'login' || to.name === 'register') {
        this.getSessionId()
      }
    }
  }
}
</script>

<style lang="stylus">
#app
  width 100%
  height 100%
  min-width 1200px
  font-family 'MicrosoftYaHei', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #303133
.wrapperMargin
  #main
    >.main-wrapper
      margin 0 !important
      box-shadow none
#admin
  .admin-main
    .admin-main-wrapper
      padding-left:10px
      padding-right:10px
.scrollMargin
  #admin
    .admin-main-wrapper
      .admin-main-scroll
        padding-top 10px
</style>
