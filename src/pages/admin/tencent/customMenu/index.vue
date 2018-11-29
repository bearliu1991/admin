<template>
  <div>
    <PublicNo></PublicNo>
    <div id="material">
      <div class="weixin-wrapper">
        <div class="wechat-title">
          自定义菜单
        </div>
        <editMenu></editMenu>
      </div>
    </div>
  </div>
</template>
<script>
import PublicNo from '../components/currPublicNo'
import editMenu from '@/pages/admin/tencent/customMenu/editMenu'
export default {
  name: 'meterial',
  components: {
    PublicNo,
    editMenu
  }
}
</script>
<style lang="stylus">
#material
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .weixin-wrapper
    padding 0 10px 20px
</style>
