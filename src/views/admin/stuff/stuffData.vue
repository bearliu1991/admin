<template>
  <div id="stuffData">
    <Drawer v-model="drawer" :titleTips="drawerTitle" :isScroll="false" :showFooter="false">
      <div slot="content">
        <UserDetail v-if="filter('UserDetail')" :userId="userId"></UserDetail>
        <Filters ref="filters" v-show="filter('Filters')" :stuffStatus="stuffStatus" :zuoxiStatus="zuoxiStatus"></Filters>
        <AddUser v-if="filter('AddUser')"></AddUser>
        <AddApart v-if="filter('AddApart')" :isAdd="isAdd" :isModifyApart="isModifyApart"></AddApart>
        <div v-if="filter('WeCode')" class="ask_for">
          <WeCode :datas="weCodeData" :curApart="currApart">
            <div>
              <p>立即邀请<span>{{weCodeData.nickname}}</span>加入企业</p>
              <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
            </div>
          </WeCode>
          <div class="handles">
            <i-button @click="drawer = false" class="return">返回</i-button>
          </div>
        </div>
      </div>
    </Drawer>
    <div class="cont">
        <h3>销售部门(20)</h3>
        <div class="process">
            <span @click="handle('addApart')">添加子部门</span>
            | <span @click="handle('modifyApart')">修改</span>
            | <span @click="handle('delApart')">删除</span>
        </div>
        <div class="border"></div>
        <data-loading :dataSatau="dataSatau">
          <Tables ref="tables" :columns="columns" :datas="datas"></Tables>
        </data-loading>
    </div>
    <Modal :title="modalTitle" v-model="showModal" @on-ok="modalConfirm"
        @on-cancel="showModal = false">
        <div v-html="modalCont"></div>
    </Modal>
    <ApartChoose></ApartChoose>
  </div>
</template>

<script>
import UserDetail from './userDetail'
import Filters from './filter'
import AddUser from './addUser'
import WeCode from './weCode'
import AddApart from './addApart'
import Tables from './tables'
import ApartChoose from './ApartChoose'
import Const from './const'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      // 坐席列表和坐席状态
      stuffStatus: [],
      zuoxiStatus: [],
      curProcess: '',
      // 是否为增加子部门
      isAdd: true,
      userId: null,
      isModifyApart: false,
      nowCompo: 'Filters',
      drawer: false,
      showModal: false,
      drawerTitle: '',
      corId: -1,
      modalTitle: '',
      action: Const.action(this.handle),
      modalCont: '',
      loading: false,
      columns: [],
      dataSatau: 1,
      actionItems: Const.actionItems,
      isAllChoosed: false,
      datas: [],
      curUserList: [],
      weCodeData: {}
    }
  },
  computed: {
    ...mapGetters({
      currApart: 'stuff/getCurrApart',
      fitlerOpt: 'stuff/getFitlerOpt',
      fitlerName: 'stuff/getFitlerName',
      selectRows: 'stuff/getSelectRows'
    })
  },
  created() {
    this.init()
    // 获取筛选列表
    this.getFilterOption()
    // 获取用户列表
    this._BUS.$on('getUsers', () => {
      this.getStuffData()
    })
    this._BUS.$on('addUser', () => {
      this.handle('addUser')
    })
    this._BUS.$on('showFilter', (param) => {
      this.showFilter(param)
    })
    this._BUS.$on('apartProcess', (key) => {
      key === 'addApart' && this.handle(key)
      key === 'modifyApart' && this.handle(key)
      key === 'delApart' && this.handle(key)
    })
    this._BUS.$on('setColumn', arr => {
      this.$set(this, 'columns', arr)
    })
    this._BUS.$on('handle', (key, param) => {
      this.handle(key, param)
    })
  },
  components: { UserDetail, Filters, AddUser, WeCode, AddApart, ApartChoose, Tables },
  methods: {
    init() {
      this.columns = Const.columns(this.handle)
      this.columns.push(this.action)
      this.columns.map(item => {
        return (item.show = true)
      })
    },
    getStuffData() {
      this.dataSatau = 1
      let pageObj = this.$refs.tables.pageParam
      let param = {
        addTimeQ: null,
        name: this.fitlerName,
        order: "DESC",
        seatStatusQ: null,
        sort: null,
        statusQ: null,
        limit: null,
        offset: null,
        isTop: true,
        deptId: this.currApart.id || null
      }
      param = {...param, ...pageObj}
      if (this.fitlerOpt) {
        param = Object.assign(param, this.fitlerOpt)
      }
      this.getStuff(param).then((res) => {
        let rules = {
          nickname: 'name',
          mobile: 'mobile',
          deptName: 'apartment',
          postName: 'duty',
          applyId: 'applyId',
          status: 'status',
          eeId: 'eeId',
          userId: 'userId',
          entryDate: 'entryDate',
          identity: 'identity',
          joinStatus: 'joinStatus',
          addTime: 'addTime',
          seatStatus: 'seatStatus',
          deptId: 'deptId',
          sex: 'sex',
          corpId: 'corpId',
          postId: 'postId',
          topval: 'topval',
          remark: 'remark',
          seatName: 'seatName',
          seatNo: 'seatNo',
          picUrl: 'picUrl',
          accountNickName: 'accountNickName'
        }
        if (res.code === 1) {
          this.dataSatau = 2
          let arr = res.data.records
          if (arr.length) {
            this.datas = arr.map(item => this._transformData(item, rules))
          } else {
            this.datas = []
          }
        } else {
          this.dataSatau = 3
        }
      })
    },
    getFilterOption() {
      let param = {
        "itemKey": "",
        "itemPv": "",
        "itemValue": "",
        "limit": 20,
        "offset": 0,
        "order": "DESC",
        "sort": ""
      }
      let param1 = this.deepCopy(param)
      let param2 = this.deepCopy(param)
      param1.itemKey = 'EEMNG_eeStatus'
      param2.itemKey = 'EEMNG_seatStatus'
      this.searchOption(param1).then((res) => {
        if (res.code === 1 && res.data) {
          this.stuffStatus = res.data.records
        }
      })
      this.searchOption(param2).then((res) => {
        if (res.code === 1 && res.data) {
          this.zuoxiStatus = res.data.records
        }
      })
    },
    showFilter({nowCompo, drawerTitle}) {
      this.nowCompo = nowCompo
      this.drawer = true
      this.drawerTitle = drawerTitle
    },
    filter(name) {
      return this.nowCompo === name
    },
    unbindUsers() {
      let param = {
        id: this.curUserList[0]
      }
      this.unbindUser(param).then((res) => {
        if (res.code === 1) {
          this.getStuffData()
        }
      })
    },
    delCurApart() {
      this.delApart({id: this.currApart.id}).then((res) => {
        if (res.code === 1) {
          this.$Message.success('删除成功')
          this._BUS.$emit('getTreeData')
        }
      })
    },
    processUsers(key) {
      let param = {
        eeIdList: this.curUserList,
        status: key
      }
      if (key === 0) {
        this.delUser(param).then((res) => {
          if (res.code === 1) {
            this.getStuffData()
            this.drawer = false
          }
        })
      } else if (key === 1) {
        this.startUser(param).then((res) => {
          if (res.code === 1) {
            this.getStuffData()
            this.drawer = false
          }
        })
      } else if (key === 2) {
        this.stopUser(param).then((res) => {
          if (res.code === 1) {
            this.getStuffData()
            this.drawer = false
          }
        })
      }
    },
    setParam(param) {
      if (param !== undefined) {
        this.curUserList = [param]
      } else {
        if (this.selectRows.length) {
          this.curUserList = this.selectRows.map((item) => {
            return item.eeId
          })
        } else {
          this.$Message.info('请至少选择一个用户')
        }
      }
    },
    setTops(eeId) {
      this.setTopUser({id: eeId}).then((res) => {
        if (res.code === 1) {
          this.getStuffData()
          this.drawer = false
        }
      })
    },
    askForUser(eeId) {
      this.formWecode({id: eeId}).then((data) => {
          this.weCodeData = data.data
      })
    },
    cancelTop(eeId) {
      this.cancelTopUser({id: eeId}).then((res) => {
        if (res.code === 1) {
          this.getStuffData()
          this.drawer = false
        }
      })
    },
    modalConfirm() {
      switch (this.curProcess) {
        case 'unbind':
          this.unbindUsers()
          break
        case 'stop':
          this.processUsers(2)
          break
        case 'start':
          this.processUsers(1)
          break
        case 'deleteUser':
          this.processUsers(0)
          break
        case 'delApart':
          this.delCurApart()
          break
        default:
          break
      }
    },
    handle(type, param) {
      let title = ''
      let cont = ''
      switch (type) {
        case 'show':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详细'
          this.userId = param.row.eeId
          break
        case 'modify':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详细'
          this.userId = param
          this._BUS.$emit('modify')
          break
        case 'setTop':
          this.curProcess = 'setTop'
          this.setTops(param)
          break
        case 'cancelTop':
          this.cancelTop(param)
          break
        case 'unbind':
          title = '解绑'
          this.curProcess = 'unbind'
          this.setParam(param)
          this.showModal = true
          cont = Const.unbindTips
          break
        case 'stop':
          title = '停用'
          this.setParam(param)
          this.curProcess = 'stop'
          this.showModal = true
          cont = Const.stopTips
          break
        case 'start':
          title = '启用'
          this.setParam(param)
          this.curProcess = 'start'
          this.showModal = true
          cont = Const.startTips
          break
        case 'delete':
          title = '删除'
          this.setParam(param)
          this.curProcess = 'deleteUser'
          this.showModal = true
          cont = Const.delTips
          break
        case 'goback':
          this.drawer = false
          break
        case 'addUser':
          this.drawer = true
          this.nowCompo = 'AddUser'
          this.drawerTitle = "添加员工"
          break
        case 'askFor':
          this.nowCompo = 'WeCode'
          this.drawer = true
          this.drawerTitle = "邀请加入"
          this.askForUser(param.row.eeId)
          break
        case 'addApart':
          this.drawerTitle = "添加子部门"
          this.isModifyApart = false
          this.nowCompo = "AddApart"
          this.drawer = true
          break
        case 'modifyApart':
          this.drawerTitle = "修改部门"
          this.isModifyApart = true
          this.nowCompo = "AddApart"
          this.drawer = true
          break
        case 'delApart':
          this.curProcess = 'delApart'
          if (this.currApart.children && this.currApart.children.length) {
            this.$Message.info(Const.delWithChild)
          } else if (this.datas.length) {
            this.$Message.info(Const.delWithUsers)
          } else {
            this.showModal = true
            title = "删除"
            cont = "您正在删除" + this.currApart.title + ",确定删除吗？"
          }
          break
        default:
          break
      }
      if (this.showModal) {
        this.modalTitle = title
        this.modalCont = cont
      }
      this.bodyClick()
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
<style lang="stylus">
@import '~@/assets/stylus/index'
.ivu-poptip-popper
  min-width:0
.ivu-poptip-body
  // padding:0
.modal_link
  padding 3px 5px
  inline()
  border 1px solid blue
  color(blue)
.handles
  setMiddle()
  absolute()
  bottom -40px
  right 0
  left 0
  bgColor()
  border-top 1px solid #ddd
  padding 20px 30px
  padb(0)
  center()
  &.save_data
    // setMiddle()
  li
    padding: 0 10px
  button
    padding:0 15px
  button,li
    inline()
    cursor()
    vertical(40px)
    center()
    radius(3px)
    margin:0 10px
    border:1px solid #ddd
    &.width_bg
      color()
      border:none
.ask_for
  height:100%
  relative()

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
    height:100%
    h3
      mb(10px)
    .process
      color(light_color)
      span
        color(text_color)
        cursor()
    // .middle
    //   setBetween()
    //   mb(20px)
    //   .right_pro
    //     fr()
    //     .search_input
    //       fl()
    //       border_()
    //       vertical(40px)
    //       radius(3px)
    //       relative()
    //       width:200px
    //       input
    //         absolute()
    //         left:5px
    //         top:0
    //         height:100%
    //         bottom:0
    //         right:20px
    //       i
    //         absolute()
    //         right:0
    //         width:20px
    //         cursor()
    //         fn(20px)
    //         color(#aaa)
    //     .ivu-icon
    //       cursor()
    //       width 30px
    //       height 30px
    //       fn(14px)
    //       text-align center
    //       border 1px solid #ddd
    //     >span, .pop_span
    //       fl()
    //       margin:0 10px
    //       mt(10px)
    //       cursor()
    //       fn(18px)
    //       &:hover
    //         color(text_color)
    //     .pop_span
    //       mt(8px)
    //       fn(24px)
    //     .pop_span:hover
    //       color(text_color)
    // .common_pro
      // setBetween()
      // mt(20px)
      // .left_pro
      //   fl()
      //   button
      //     fl()
      //     margin:0 5px
      //     bgColor()
      //   .checkbox
      //     mt(8px)
      //     fl()
      //     mr(20px)
      // .pages
      //   fr()
      //   mt(-5px)
    .border
      border-bottom 1px solid #dddddd
      margin 20px 0
    // .no_data
    //   margin:0 auto
    //   text-align:center
    //   vertical-align:middle
    //   .no_wrap
    //     width:200px
    //     inline()
    //     mt(200px)
    //     img, p, button
    //       inline()
    //     p
    //       margin: 10px 0
</style>
