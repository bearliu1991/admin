<template>
  <div id="newtable-container">
    <table id="records-table" cellspacing="0" >
      <thead class="new-table-header">
        <tr>
          <td class="td1">个性化标题</td>
          <td class="td2">地区</td>
          <td class="td3">性别</td>
          <td class="td4">手机操作系统</td>
          <td class="td5">语言</td>
          <td class="td6">用户标签</td>
          <td class="td7">菜单状态</td>
          <td class="td8">操作</td>
        </tr>
      </thead>
      <tbody class="new-table-body" v-if="data.length > 0" >
            <tr class="new-table-tr" v-for="(item, index) of data" :key="index">
                <td class="td1"><div class="td-container">
                  {{item.title}}
                </div></td>
                <td class="td2"><div class="td-container">
                  {{item.area}}
                </div></td>
                <td class="td3"><div class="td-container">
                  <div style="text-decoration: line-through;">{{item.sex}}</div>
                </div></td>
                <td class="td4"><div class="td-container">
                  {{item.os}}
                </div></td>
                <td class="td5"><div class="td-container">
                  {{item.lang}}
                </div></td>
                <td class="td6"><div class="td-container">
                  <Tags :tags="item.tags" @showAll="getcurrent(item, 'showAll')"></Tags>
                </div></td>
                <td class="td7"><div class="td-container">
                    <div>{{item.status | status}}</div>
                </div></td>
                <td class="td8"><div class="td-container">
                    <Button type="primary" size="small" @click="getcurrent(item, 'edit')">编辑</Button>
                    <Button size="small" @click="getcurrent(item, 'active')">启用</Button>
                    <Button size="small" @click="getcurrent(item, 'stop')">停用</Button>
                    <Button size="small" @click="getcurrent(item, 'delete')">删除</Button>
                </div></td>
            </tr>
      </tbody>
    </table >
    <div v-if="data.length === 0" style="height: 60px; line-height: 60px; text-align: center">暂无订单记录</div>
  </div>
</template>

<script>
import Tags from './tags'
  export default {
    name: "newTable",
    components: { Tags },
    props: {
        datas: {
            type: Array,
            default: function () { return [] }
        }
    },
    filters: {
      status: (val) => {
          return val
      }
    },
    data() {
        return {
          data: this.datas
        }
    },
    watch: {
      datas(newVal) {
        this.data = newVal
      }
    },
    methods: {
      getQuery() {
        const _getQuery = (arg) => this.$post(this.Path.queryTItemValueByPager, {itemKey: arg})
        const turnStringToNum = (arr) => arr.map(item => {
            item.itemValue = parseInt(item.itemValue)
            return item
          })
        this.PageConfig.filters.forEach(item => {
          if (item.key === "orderStatusQ") {
            _getQuery('OMS_ORDERMNG_ORDER_STATUS').then(res => {
                item.options = this.transformData(turnStringToNum(res.data.records), {
                    itemValue: "value", itemName: 'label'
                })
            })
          }
        })
      },
      getcurrent(item, type) {
        this.$emit("getcurrent", item, type)
      }
    }
  }
</script>

<style lang="stylus">
height1 = 40px
#newtable-container
  background-color #fff
  width 100%
  overflow-x auto
#records-table
  position relative
  border-collapse separate
  border-spacing 0px 10px
  width 100%
  .new-table-header
      background #f7f9fa
      height 45px
      line-height 45px
  .new-table-body
    margin-top 10px
    td
      vertical-align middle
      .td-container
        padding 10px 0
  .td1, .td2, .td3, .td4, .td5, .td6, .td7, .td8
    min-width 100px
  .td1
    min-width 150px
  .td3
    text-align center
  .td5
    .td-container
      display flex
      align-items center
      .avatar
        width 40px
        height 40px
  .detail:hover
    cursor pointer
    color #0099CC
  .td6
    width 260px
  .td8
    text-align center
  .cancle
    cursor pointer
    font-size 12px


</style>
