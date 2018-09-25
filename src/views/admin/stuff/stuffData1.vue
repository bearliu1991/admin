<template>
  <div id="stuffData">
    <Drawer :showDrawer="drawer" :titleTips="drawerTitle" :isScroll="false">
      <div slot="content">
        <UserDetail v-if="filter('UserDetail')" ref="userDetail"></UserDetail>
        <Filters v-if="filter('Filters')" ref="filters"></Filters>
        <AddUser v-if="filter('AddUser')" ref="addUser"></AddUser>
        <WeCode v-if="filter('WeCode')" ref="weCode">
          <div>
            <p>立即邀请<span>{{123}}</span>加入企业</p>
            <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
          </div>
        </WeCode>
      </div>
      <div slot="footer" class='drawer_footer'>
        <Button class="width_bg" @click="goNext">保存并下一步</Button>
        <Button class="width_bg" @click="addMore">完成并继续添加</Button>
        <Button class="width_bg" @click="cancel">完成</Button>
        <Button class="width_bg" @click="cancel">保存</Button>
        <Button @click="preStep">上一步</Button>
        <Button @click="cancel">取消</Button>
        <Button @click="cancel">返回</Button>
      </div>
    </Drawer>
    <div class="cont">
        <h3>某部门</h3>
        <div class="process">
            <span @click="drawer = true">添加子部门</span>
            | <span>修改</span>
            | <span>删除</span>
        </div>
        <div class="border"></div>
        <div class="middle">
            <Button @click="addUser">添加员工</Button>
            <div class="right_pro">
                <Input search enter-button placeholder="Enter something..." @on-click="'doNothing'" />
                <Icon type="ios-funnel-outline" @click="setFilter"/>
                <Icon type="ios-redo" @click="exportCsv"/>
                <Icon type="ios-refresh-circle-outline" @click="refresh"/>
                <Poptip placement="top">
                    <Icon type="ios-hammer-outline" />
                    <div slot="content">
                      <Chooses :columns="columns"></Chooses>
                    </div>
                </Poptip>
            </div>
        </div>
        <div class="table">
            <Table ref="table" :loading="loading" :columns="columns" :data="datas" @on-selection-change="selectionChange"></Table>
        </div>
        <div class="common_pro">
            <div class="left_pro">
                <div class="checkbox">
                    <i @click="setAllChoose"><Checkbox v-model="isAllChoosed"></Checkbox></i> 全选
                </div>
                <span @click="handle('delete')">批量删除</span>
                <span @click="handle('stop')">批量停用</span>
                <span>更换部门</span>
            </div>
            <div class="pages">
                <Page
                show-elevator
                v-if="pagination"
                :page-size = 'pageSize'
                :total="pageTotal"
                :current="currPage"
                show-total
                show-sizer
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
                ></Page>
            </div>
        </div>
    </div>
    <Modal :title="title" v-model="showModal">
        <div v-html="modalCont"></div>
    </Modal>
  </div>
</template>

<script>
import UserDetail from './userDetail'
import Chooses from './chooses'
import Filters from './filter'
import AddUser from './addUser'
import WeCode from './weCode'
import Const from './const'
export default {
  data() {
    return {
      nowCompo: '',
      drawer: false,
      showModal: false,
      drawerTitle: '',
      corId: -1,
      title: '',
      modalCont: '',
      pageTotal: 100,
      currPage: 1,
      pagination: true,
      selectedRows: [],
      pageSize: 6,
      action: Const.action(this.handle),
      loading: false,
      actionItems: Const.actionItems,
      columns: [],
      datas: Const.datas,
      isAllChoosed: false
    }
  },
  created() {
    this.init()
    this._BUS.$on('setColumn', arr => {
      // let arr = []
      // for (let val of obj) {
      //   val.show && arr.push(val)
      // }
      // console.error(arr)
      this.$set(this, 'columns', arr)
    })
    this._BUS.$on('handle', (key, param) => {
      this.handle(key, param)
    })
  },
  components: { UserDetail, Chooses, Filters, AddUser, WeCode },
  methods: {
    init() {
      this.columns = Const.columns(this.handle)
      this.columns.push(this.action)
      this.columns.map(item => {
        return (item.show = true)
      })
    },
    preStep() {
      this.$refs['addUser'].preStep()
    },
    addMore() {
      this.$refs['addUser'].addMore()
    },
    goNext() {
      this.$refs['addUser'].goNext()
    },
    cancel() {
      this.handle('goback')
    },
    filter(name) {
      return this.nowCompo === name
    },
    addUser() {
      this.nowCompo = "AddUser"
      this.drawer = true
      this.drawerTitle = "添加员工"
    },
    // 刷新数据
    refresh() {},
    // 导出数据
    exportCsv() {
      this.$refs.table.exportCsv({
        filename: '用户数据.excel',
        columns: this.columns,
        data: this.datas
      })
    },
    setFilter() {
      this.nowCompo = "Filters"
      this.drawer = true
      this.drawerTitle = '筛选'
    },
    // 批量删除
    delArr() {
      console.error(this.selectedRows)
    },
    setAllChoose() {
      this.isAllChoosed = !this.isAllChoosed
      this.$refs.table.selectAll(this.isAllChoosed)
    },
    modify(param) {
      // let self = this
      console.error(param)
      setTimeout(() => {}, 1000)
    },
    getData() {},
    setTop() {},
    stop() {},
    del() {},
    start() {},
    unbind() {},
    handle(type, param) {
      let title = ''
      let cont = ''
      switch (type) {
        case 'show':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详细'
          break
        case 'modify':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详细'
          this._BUS.$emit('modify')
          break
        case 'setTop':
          break
        case 'unbind':
          title = '解绑'
          this.showModal = true
          cont = Const.unbindTips
          break
        case 'stop':
          title = '停用'
          this.showModal = true
          cont = Const.stopTips
          break
        case 'start':
          title = '启用'
          this.showModal = true
          cont = Const.startTips
          break
        case 'delete':
          title = '删除'
          this.showModal = true
          cont = Const.delTips
          break
        case 'goback':
          this.drawer = false
          break
        case 'filter':
          this.drawer = false
          break
        case 'askFor':
          this.drawer = true
          this.nowCompo = 'WeCode'
          break
        default:
          break
      }
      this.bodyClick()
      this.title = title
      this.modalCont = cont
    },
    pageChange(page) {
      if (page !== this.currPage) {
        this.currPage = page
      }
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize
    },
    changeOrder(param) {
      let arg = {
        key: param.key,
        order: param.order
      }
      this._BUS.$emit('sortChange', arg)
      // this.$emit('sort', arg)
    },
    selectionChange(selection) {
      let isAllChoosed = selection.length === this.pageSize
      this._BUS.$emit('isAllSelected', isAllChoosed)
      this.selectedRows = selection
    }
  }
}
</script>
<style>
.action {
  width: 60px !important;
  min-width: 60px;
  /* padding:0 !important; */
}
.action .ivu-poptip-body {
  text-align: center;
  padding: 5px 0;
}
.action .ivu-poptip-body .action-item:hover {
  background-color: skyblue;
  cursor: pointer;
  color: #fff;
}
</style>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
.modal_link
  padding 3px 5px
  inline()
  border 1px solid blue
  color(blue)
#stuffData
  height 100%
  width 100%
  .drawer_footer
    .ivu-btn
      vertical(40px)
      padding: 0 5px
      &.width_bg
        bgColor(skyblue)
        color()
  .cont
    h3
      mb(10px)
    .process
      color(blue)
    .middle
      setBetween()
      mb(20px)
      .right_pro
        setMiddle()
        .ivu-icon
          cursor()
          width 30px
          height 30px
          fn(14px)
          text-align center
          border 1px solid #ddd
    .common_pro
      setBetween()
      mt(20px)
      .left_pro
        setStart()
        span
          margin 0 5px
          padding 5px
          border 1px solid #ddd
          cursor()
        .checkbox
          mr(20px)
    .border
      border-bottom 1px solid #dddddd
      margin 20px 0
</style>
