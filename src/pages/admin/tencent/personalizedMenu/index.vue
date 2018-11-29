<template>
  <div>
    <PublicNo></PublicNo>

    <div id="personalizedMenu">
      <div class="wechat-title">
        自定义菜单
      </div>
      <NewTable @getcurrent="getcurrent" :datas="tableData"></NewTable>
    </div>
  </div>
</template>
<script>
import PublicNo from '../components/currPublicNo'
import NewTable from './newtable/'
export default {
  name: 'personalizedMenu',
  components: {
    PublicNo,
    NewTable
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    getcurrent(param, type) {
      console.log(param, type)
      if (type === "detail") {
        this.toDetailPage(param)
      } else if (type === "toPay") {
        this.toCreateOrder(param)
      } else if (type === "cancle") {
        this.cancle(param, 1)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableData = [
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: [1,3,4,5,6,7,8,9,0,221],
          status: 0
        },
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: ["互联网精英互联网精英互联网精英英","互联网精英互联网精英互联网精英英",4,32,44443334, 43, 465,123],
          status: 0
        },
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: [1,3,4,5,6,7,8,9,0,221],
          status: 0
        },
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: ["互联网精英互联网精英互联网精英英","互联网精英互联网精英互联网精英英",4,32,44443334, 43, 465,123],
          status: 0
        },
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: [1,3,4,5,6,7,8,9,0,221],
          status: 0
        },
        {
          title: 1,
          area: 2,
          sex: 1,
          os: 4,
          lang: 5,
          tags: ["互联网精英互联网精英互联网精英英","互联网精英互联网精英互联网精英英",4,32,44443334, 43, 465,123],
          status: 0
        }
      ]
    }, 100)
  }
}
</script>
<style lang="stylus">
#personalizedMenu
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .weixin-wrapper
    padding 0 10px 20px
</style>
