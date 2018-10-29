<template>
  <div id="stuffData">
    <Drawer v-model="drawer" :titleTips="drawerTitle" :isScroll="false" :showFooter="false" ref="Drawer" @close="handle('goback')">
      <div slot="content">
        <UserDetail v-if="filter('UserDetail')" :userId="userId" :isModify='isModify'></UserDetail>
        <Filters ref="filters" v-show="filter('Filters')" :stuffStatus="stuffStatus" :zuoxiStatus="zuoxiStatus"></Filters>
        <AddUser v-if="filter('AddUser')"></AddUser>
        <AddApart v-if="filter('AddApart')" :isAdd="isAdd" :isModifyApart="isModifyApart"></AddApart>
        <div v-if="filter('WeCode')" class="ask_for">
          <WeCode :datas="weCodeData" :curApart="currApart">
            <div>
              <p>立即邀请<span class="text_color"> {{weCodeData && weCodeData.nickname}} ( 手机号 : {{weCodeData && weCodeData.mobile}}) </span>加入企业</p>
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
        <div class="fn18">{{currApart && currApart.title}}({{currApart && currApart.total}})</div>
        <div class="process">
            <span @click="handle('addApart')">添加子部门</span>
            | <span @click="handle('modifyApart')">修改</span>
            | <span @click="handle('delApart')">删除</span>
        </div>
        <div class="border"></div>
        <data-loading :dataSatau="dataSatau">
          <Tables ref="tables" :columns="columns" :datas="datas" :pageTotal='pageTotal'></Tables>
        </data-loading>
    </div>
    <Modal :title="modalTitle" v-model="showModal" class-name="self-center-modal">
        <div v-html="modalCont"></div>
        <div slot="footer">
          <Button type="primary" @click.stop="modalConfirm">确定</Button>
          <Button type="ghost" @click.stop="showModal = false">取消</Button>
        </div>
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
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      // 坐席列表和坐席状态
      stuffStatus: [],
      zuoxiStatus: [],
      pageTotal: 0,
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
      dataSatau: 2,
      actionItems: Const.actionItems,
      isAllChoosed: false,
      datas: [],
      curUserList: [],
      curUserDepthList: [],
      weCodeData: {},
      isModify: false
    }
  },
  computed: {
    ...mapGetters({
      currApart: 'stuff/getCurrApart',
      fitlerOpt: 'stuff/getFitlerOpt',
      fitlerName: 'stuff/getFitlerName',
      selectRows: 'stuff/getSelectRows',
      isTop: 'stuff/getIsTop',
      apartCount: 'stuff/getApartCount'
    })
  },
  created() {
    this.dataSatau = 1
    this.init()
    // 获取筛选列表
    this.getFilterOption()
    // 获取用户列表
    this._BUS.$on('getUsers', (key) => {
      this.getStuffData(key)
    })
    this._BUS.$on('addUser', () => {
      this.handle('addUser')
    })
    this._BUS.$on('showFilter', (param) => {
      this.showFilter(param)
    })
    this._BUS.$on('apartProcess', (key, node) => {
      key === 'addApart' && this.handle(key, node)
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
    getStuffData(key) {
      this._BUS.$emit('tableLoading', true)
      if (this.$refs.tables) {
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
          isTop: Boolean(this.isTop),
          deptId: this.currApart.id || null
        }
        param = {...param, ...pageObj}
        if (this.fitlerOpt) {
          param = Object.assign(param, this.fitlerOpt)
        }
        this.getStuff(param).then((res) => {
          this.dataSatau = 2
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
          this._BUS.$emit('tableLoading', false)
          if (res.code === 1) {
            this.pageTotal = res.data.totalCount
            // 更新树结构中员工数显示
            if (key === 'delUser' || key === 'addUser') {
              this._BUS.$emit('userNum', this.pageTotal)
            }
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
      }
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
          this.clear()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    delCurApart() {
      this.delApart({id: this.currApart.id}).then((res) => {
        if (res.code === 1) {
          this.$Message.success('删除成功')
          this._BUS.$emit('delAparts')
          this.clear()
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
            this._BUS.$emit('treeUserNumDel', this.curUserDepthList)
            this.$Message.success('删除成功')
          } else {
            this.$Message.error(res ? res.message : '删除失败！')
          }
          this.clear('delUser')
        })
      } else if (key === 1) {
        this.startUser(param).then((res) => {
          if (res.code === 1) {
            this.$Message.success('启用成功')
          } else {
            this.$Message.error(res.message)
          }
          this.clear()
        })
      } else if (key === 2) {
        this.stopUser(param).then((res) => {
          if (res.code === 1) {
            this.$Message.success('停用成功')
          } else {
            this.$Message.error(res.message)
          }
          this.clear()
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
          this.curUserDepthList = this.selectRows.map((item) => {
            return item.deptId
          })
        } else {
          this.$Message.info('请至少选择一个用户')
          return false
        }
      }
      return true
    },
    setTops(eeId) {
      this.setTopUser({id: eeId}).then((res) => {
        if (res.code === 1) {
          this.clear()
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
          this.clear()
        }
      })
    },
    clear(key) {
      this.showModal = false
      this.getStuffData(key)
      this.handle('goback')
    },
    upgrade() {
      let obj = {
        corpId: this.getCookie('currentCorp').applyId,
        corpName: this.getCookie('currentCorp').corpName
      }
      this.setPayStatu(obj)
    },
    ...mapActions({
      setPayStatu: 'pay/setPayStatu'
    }),
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
          this.userId = param
          this.isModify = false
          break
        case 'modify':
          this.drawer = true
          this.nowCompo = 'UserDetail'
          this.drawerTitle = '员工详细'
          this.userId = param
          this.isModify = true
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
          if (!this.setParam(param)) return false
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
          if (!this.setParam(param)) return false
          this.curProcess = 'deleteUser'
          this.showModal = true
          cont = Const.delTips
          break
        case 'goback':
          this.isModify = false
          this.drawer = false
          this.nowCompo = ''
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
          this.askForUser(param)
          break
        case 'addApart':
          if (this.currApart.flag && this.currApart.flag.match(/-/g) && (this.currApart.flag.match(/-/g).length > 3)) {
            this.$Message.warning('抱歉，子部门最多只能有4层')
            return false
          }
          this._BUS.$emit('apartCount')
          if (this.apartCount > 100) {
            this.$Message.warning('抱歉，部门总数最多只能100个')
            return false
          }
          this.drawerTitle = "添加子部门"
          this.isModifyApart = false
          this.nowCompo = "AddApart"
          this.drawer = true
          break
        case 'modifyApart':
          if (this.currApart.isRoot) {
            this.$Message.warning('根部门不能修改！')
            return false
          }
          this.drawerTitle = "修改部门"
          this.isModifyApart = true
          this.nowCompo = "AddApart"
          this.drawer = true
          break
        case 'updateMenu': 
          this.drawer = false
          this.upgrade()
          break
        case 'delApart':
          this.curProcess = 'delApart'
          if (this.currApart.isRoot) {
            this.$Message.warning('根部门不能删除！')
            return false
          }
          if (this.currApart.children && this.currApart.children.length) {
            this.$Message.warning(Const.delWithChild)
            return false
          } else if (this.datas.length) {
            this.$Message.warning(Const.delWithUsers)
            return false
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
.self-center-modal.ivu-modal-wrap{
  top:50%;
  transform: translateY(-50%)
}
.action.ivu-poptip-popper {
  width: 100px !important;
  min-width: 100px;
}
.action.ivu-poptip-popper .ivu-poptip-arrow{
  top: 20px;
}
.ivu-poptip-popper .ivu-poptip-body{
  padding:8px 16px
}
.action.ivu-poptip-popper .ivu-poptip-body {
  text-align: center;
  padding: 10px 0;
}
.action.ivu-poptip-popper .ivu-poptip-body .action-item {
  height: 30px;
  line-height:30px;
}
.action.ivu-poptip-popper .ivu-poptip-body .action-item:hover {
  background-color: #409eff;
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
  border-top 1px solid #f0f2f3
  padding 20px 30px
  padb(0)
  center()
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
  .text_color
    color(text_color)

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
    div.fn18
      mb(10px)
    .process
      color(light_color)
      span
        color(text_color)
        cursor()
    .border
      border-bottom 1px solid #dddddd
      margin 20px 0
</style>
