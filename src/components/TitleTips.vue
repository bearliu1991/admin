<template>
  <div class="titleTips"></div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'titleTips',
  data() {
    return {
      secondMenu: {
        tencent: {
          name: '公众号',
          list: [
            {
              name: 'tencentManage',
              text: '公众号管理'
            },
            {
              name: '',
              text: '自定义菜单'
            },
            {
              name: '',
              text: '个性化菜单'
            },
            {
              name: '',
              text: '素材管理'
            },
            {
              name: '',
              text: '自动回复'
            }
          ]
        },
        setting: {
          name: '设置',
          list: [
            {
              name: 'seatSetting',
              text: '坐席设置'
            },
            {
              name: 'records',
              text: '订单记录'
            },
            {
              name: '',
              text: '发票管理'
            },
            {
              name: 'corpInfo',
              text: '企业信息'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      routerInfo: 'nav/getRouterInfo'
    })
  },
  methods: {
    ...mapActions({
      setSecondMenu: 'nav/setSecondMenu'
    })
  },
  watch: {
    'routerInfo.name'(val) {
      switch (val) {
        case 'register':
          document.title = '免费试用-欢迎注册销大师'
          break
        case 'company':
          document.title = '我的企业'
          break  
        default:
          document.title = '销大师企业管理'
          break
      }
    },
    'routerInfo.path'(val) {
      for (let k in this.secondMenu) {
        if (val.indexOf(k) >= 0) {
          this.setSecondMenu(this.secondMenu[k] || [])
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.titleTips
  display none
</style>


