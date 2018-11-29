<template>
  <div id="seats">
    <scroll-bar>
      <data-loading @reload="reload" :data-satau='loadingStatu'>
        <div class="scroll-common-content">
          <div class="seats-main">
            <div class="common-title">
              坐席管理 <span class="common-tips">(共{{totalCount}}个坐席)</span>
            </div>
            <div class="noseats-wrapper" v-show="showNoData">
              <no-seats @upgrade="upgrade" @addSeats="addSeats"></no-seats>
            </div>
            <div class="operation-wrapper" v-show="!showNoData">
              <div class="operation">
                <div class="add-staff">
                  <Button type="primary" @click="addSeats">添加坐席</Button>
                </div>
                <div class="basic-operation">
                  <div class="operation-item">
                    <Input style="width: 160px" v-model="searchParams.seatNo" @on-keydown.enter="enterSearchList" @on-click="searchSeatsList" placeholder="填写坐席编号搜索" icon="ios-search-strong"></Input>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="handleFilter">&#xe748;</div>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="exportCsv">&#xe66c;</div>
                  </div>
                  <div class="operation-item">
                    <div class="icon operation-icon" @click="refresh">&#xe62b;</div>
                  </div>
                  <div class="operation-item">
                    <Poptip placement="right-start">
                      <div class="icon operation-icon size-same">&#xe633;</div>
                      <div class="api" slot="content">
                        <div class="title">选择项目</div>
                        <div class="content">
                          <CheckboxGroup v-model="setting" @on-change="settingChange">
                            <Checkbox :label="item.key" v-if="item.title" :key="index" v-for="(item, index) in deepColumns">{{item.title}}</Checkbox>
                          </CheckboxGroup>
                        </div>
                      </div>
                    </Poptip>  
                  </div>
                </div>
              </div>
              <div class="table-list">
                <Table ref="table" :loading="beginIntoLoading === 1" @on-row-click="currentChange" @on-selection-change="selectionChange" :highlight-row="true" :columns="columns" :data="seatListData">
                </Table>
              </div>
              <div class="page-batch">
                <div class="batch">
                  <div class="batch-item">
                    <Checkbox @on-change="allSelectList" :disabled="totalCount <= 0" v-model="single"><span class="text">全选</span></Checkbox>
                  </div>
                  <div class="batch-item">
                    <Button type="ghost" size="small" @click="batchStop">批量停用</Button>
                  </div>
                  <div class="batch-item">
                    <Button type="ghost" size="small" @click="batchSetLimit">批量设置权限</Button>
                  </div>
                </div>
                <div class="page">
                  <Page :total="totalCount" v-show="totalCount > 10" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
                </div>
              </div>
            </div>
          </div>
        </div>
      </data-loading> 
    </scroll-bar>
    <drawer v-model="showFilter">
      <div slot="content">
        <div class="content-wrapper">
          <div class="content-item">
            <div class="content-left">
              坐席状态
            </div>
            <div class="content-right">
              <Button class="btn-item" v-for="(item, index) in seatStatus" :key="index" :class="{active:seatsStatuIdx==index}" @click="selectSeatsStatu(index, item.itemValue)" size="small" type="ghost">{{item.itemName}}</Button>
            </div>
          </div>
          <div class="content-item">
            <div class="content-left">
              在线状态
            </div>
            <div class="content-right">
              <Button class="btn-item" v-for="(item, index) in onlineStatus" :key="index" :class="{active:onlineStatuIdx==index}" @click="selectOnlineStatu(index ,item.itemValue)" size="small" type="ghost">{{item.itemName}}</Button>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <Button class="footer-btn" type="primary" @click="filterComfirm">确定</Button>
          <Button class="footer-btn" type="ghost"  @click="filterCancel">取消</Button>
        </div>
      </div>
    </drawer>
    <drawer :isScroll="false" v-model="showBatchLimit" titleTips="批量设置权限">
      <div class="batch-limit-wrapper" slot="content">
        <div class="noseatDate" v-show="accountList.length<=0">
          <div class="item img"><img src="@/assets/images/admin/icon.png" alt=""></div>
          <div class="item tip">您还没有绑定公众号</div>
          <div class="item btn"><Button type="primary" @click="addAccount">添加公众号</Button></div>
        </div>
        <scroll-bar v-show="accountList.length>0">
          <seatsLimit ref="seatsLimit" :isAdd="true"></seatsLimit>
        </scroll-bar>
        <!-- <seatsLimit ref="seatsLimit" :isAdd="true"></seatsLimit> -->
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button class="footer-btn" @click="saveSeatsInfo" type="primary">保存</Button>
        <Button class="footer-btn" @click="back" type="ghost">返回</Button>
      </div>
    </drawer>
    <add-seats :createSeat="createSeat" @isJixuAdd="addSeats" ref="addSeats"></add-seats>
    <seats-info @openModal="openModal" :editTabsVal = "editTabsVal"  @editInfoSeats="editInfo" ref="seatsInfo"></seats-info>
    <edit-seats @editInfoSeat="editInfoSeat" :tabsVal="tabsVal" ref="editSeats"></edit-seats>
    <common-modal ref="deallocate" header="解除分配" content="您正在解除该坐席的员工分配，解除后该坐席无法为企业提供服务，需重新分配客服后才能使用该坐席，确定解除分配吗？" @ok="deallocate"></common-modal>
    <common-modal ref="stopSeats" header="停用" content="您正在停用该坐席，停用后该坐席无法为企业提供服务，需重新启用坐席后才能使用该坐席功能，确定停用吗？" @ok="stopSeats"></common-modal>
    <common-modal ref="batchStopSeats" header="批量停用" content="您正在批量停用坐席，停用后的坐席无法为企业提供服务，需重新启用坐席后才能使用该坐席功能，确定停用吗？" @ok="batchStopSeats"></common-modal>
    <common-modal ref="start" header="启用" content="确定启用该坐席吗？" @ok="startSeats"></common-modal>
    <common-modal ref="addseatsTips" header="坐席数量不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
  </div>
</template>

<script>
import {
  getIntoSeatList,
  saveSeatNo,
  getSeatList,
  getSeatDetail,
  updateSeatStatus,
  updateSeatAuthByBatch,
  getPublicAccountList
} from '@/api/query'
import { mapActions, mapGetters } from 'vuex'
import noSeats from './noSeats'
import addSeats from './addSeats'
import seatsInfo from './seatsInfo'
import editSeats from './editSeats'
import seatsLimit from './seatsLimit'
import ConstCommon from '@/utils/const'
export default {
  data() {
    return {
      tencentRules: ConstCommon.tencentRules,
      updateAuthBatchParams: {
        seatIds: null,
        appAccountIds: null,
        authIds: null
      },
      accountList: this.getCookie('accountList') || [],
      beginIntoLoading: 1,
      ids: '',
      operationStatus: '',
      createSeat: {},
      content: '',
      showNoData: false,
      loadingStatu: 1,
      intoSeatTotalCount: 0,
      intoList: [],
      totalCount: 0,
      searchParams: {
        offset: 0,
        limit: 10,
        seatNo: null,
        status: null,
        onlineStatus: null
      },
      showBatchLimit: false,
      tabsVal: '1',
      editTabsVal: '1',
      selectListData: [],
      onlineStatuIdx: 0,
      seatsStatuIdx: 0,
      seatsStatu: '',
      onlineStatu: '',
      showFilter: false,
      setting: [],
      single: false,
      deepColumns: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '坐席编号',
          key: 'seatNo',
          render: (h, params) => {
            return h('div', params.row.seatNo || '--')
          }
        },
        {
          title: '坐席备注',
          key: 'remark',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.remark
                }
              },
              params.row.remark || '--'
            )
          }
        },
        {
          title: '坐席状态',
          key: 'status',
          render: (h, params) => {
            let statu = params.row.status
            statu =
              statu === 1
                ? '正常'
                : statu === 2 ? '停用' : statu === 3 ? '禁用' : '未分配'
            return h('div', statu || '--')
          }
        },
        {
          title: '在线状态',
          key: 'onlineStatu',
          render: (h, params) => {
            let statu = params.row.onlineStatu
            statu =
              statu === 1
                ? '在线'
                : statu === 2 ? '忙碌' : statu === 3 ? '离开' : '离线'
            return h('div', statu || '--')
          }
        },
        {
          title: '员工姓名',
          key: 'eeName',
          render: (h, params) => {
            return h('div', params.row.eeName || '--')
          }
        },
        {
          title: '手机号',
          key: 'mobile',
          render: (h, params) => {
            return h('div', params.row.mobile || '--')
          }
        },
        {
          title: '部门',
          key: 'deptName',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.deptName
                }
              },
              params.row.deptName || '--'
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h(
              'div',
              {
                on: {
                  click: e => {
                    e.stopPropagation()
                  }
                }
              },
              [
                h(
                  'Poptip',
                  {
                    props: {
                      placement: 'left-start',
                      'popper-class': 'seat'
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'more',
                        size: '18'
                      },
                      attrs: {
                        title: '操作'
                      },
                      style: {
                        cursor: 'pointer'
                      },
                      on: {
                        click() {
                          document.body.click()
                        }
                      }
                    }),
                    h(
                      'div',
                      {
                        slot: 'content'
                      },
                      [
                        h(
                          'ul',
                          {
                            class: {
                              'ul-list': true
                            }
                          },
                          [
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: false
                                },
                                on: {
                                  click: () => {
                                    this.getSeatDetail(
                                      params.row.id,
                                      'seatsInfo'
                                    )
                                    document.body.click()
                                  }
                                }
                              },
                              '详细'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status === 3
                                },
                                on: {
                                  click: () => {
                                    this.getSeatDetail(
                                      params.row.id,
                                      'editSeats'
                                    )
                                    document.body.click()
                                  }
                                }
                              },
                              '修改'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction:
                                    params.row.status !== 1 &&
                                    params.row.status !== 2
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'REMOVE'
                                    this.selectAction('deallocate')
                                    document.body.click()
                                  }
                                }
                              },
                              '解除'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status !== 1
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'BLOCK_UP'
                                    this.selectAction('stopSeats')
                                    document.body.click()
                                  }
                                }
                              },
                              '停用'
                            ),
                            h(
                              'li',
                              {
                                class: {
                                  'li-item': true,
                                  isHideAction: params.row.status !== 2
                                },
                                on: {
                                  click: () => {
                                    this.ids = [params.row.id]
                                    this.operationStatus = 'ACTIVE'
                                    this.selectAction('start')
                                    document.body.click()
                                  }
                                }
                              },
                              '启用'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            )
          }
        }
      ],
      seatListData: [],
      seatStatus: [
        {
          itemValue: null,
          itemName: '全部'
        }
      ],
      onlineStatus: [
        {
          itemValue: null,
          itemName: '全部'
        }
      ]
    }
  },
  created() {
    this.getItemValue('XDS_SEAT_STATUS')
    this.getItemValue('XDS_SEAT_ON_LINE_STATUS')
    this.$root.Bus.$on('refreshList', () => {
      this.getSeatList()
    })
    this.$root.Bus.$on('drawerClose', () => {
      this.$refs.table.clearCurrentRow()
    })
    this.deepColumns = this.columns.slice()
    let chooseObj =
      localStorage && JSON.parse(localStorage.getItem(this.installName('seat')))
    if (chooseObj) {
      this.setting = chooseObj
      this.settingChange()
    } else {
      this.checkSettingArr(this.deepColumns)
    }
    this.getIntoSeatList()
  },
  computed: {
    ...mapGetters({
      corpInfoData: 'survey/getCorpInfo'
    })
  },
  mounted() {

  },
  methods: {
    openModal(name, ids, operationStatus) {
      this.ids = ids
      this.operationStatus = operationStatus
      this.selectAction(name)
    },
    // 获取公众号列表
    getPublicAccountList(name) {
      let params = {
        corpId: this.getCookie('currentCorp').applyId
      }
      getPublicAccountList(params).then(data => {
        if (data.code === 1) {
          let tencentData = data.data
          let cookieTencentData = this.transformData(tencentData, this.tencentRules)
          this.setCookie('accountList', cookieTencentData || [])
          this.$refs[name].showDrawer()
        } else {
          this.$Message.error('获取公众号列表失败')
        }
      })
    },
    editInfoSeat(id, name, val) {
      this.getSeatList()
      this.getSeatDetail(id, name, val)
    },
    updateSeatAuthByBatch() {
      updateSeatAuthByBatch(this.updateAuthBatchParams).then(data => {
        if (data.code === 1) {
          this.single = false
          this.showBatchLimit = false
          this.$Message.success('保存成功')
          this.getSeatList()
        }
      })
    },
    addAccount() {
      this.$router.push({ name: 'tencentManage' })
    },
    updateSeatStatus(params) {
      // let params = {
      //   operationStatus: this.operationStatus
      // }
      params = Object.assign(
        {},
        { operationStatus: this.operationStatus },
        { ids: params }
      )
      updateSeatStatus(params)
        .then(data => {
          if (data.code === 1) {
            this.getSeatList()
            if (params.ids.length === 1 && this.operationStatus !== 'BATCH_BLOCK_UP') {
              this.getSeatDetail(params.ids[0])
            }
            this.single = false
            switch (this.operationStatus) {
              case 'ACTIVE':
                this.$Message.success('启用坐席成功')
                break
              case 'BLOCK_UP':
                this.$Message.success('停用坐席成功')
                break
              case 'REMOVE':
                this.$Message.success('解除分配成功')
                break
              case 'BATCH_BLOCK_UP':
                
                this.$Message.success('批量停用坐席成功')
                break
              default:
                break
            }
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(() => {
          this.$Message.error('操作超时')
        })
    },
    getSeatDetail(param, name, val) {
      let params = {
        id: param
      }
      getSeatDetail(params).then(data => {
        if (data.code === 1) {
          this.setCookie('seatsInfo', data.data)
          this.setSeatsInfo(data.data)
          if (val) {
            this.tabsVal = '1'
            this.editTabsVal = val
          }
          if (name) {
            return name
          }
        } else {
          this.$Message.error('获取详情失败')
        }
      }).then((data) => {
        if (data) {
          this.getPublicAccountList(data)
        }
      }).catch(() => {
        this.$Message.error('获取详情失败')
      })
    },
    // 获取坐席筛选的状态
    getItemValue(key) {
      let obj = {
        itemKey: key
      }
      this.queryTItemValueByPager(obj).then(data => {
        switch (data.code) {
          case 1:
            switch (key) {
              case 'XDS_SEAT_STATUS':
                this.seatStatus = this.seatStatus.concat(data.data.sort(this.sortBy('itemIdx')))
                break
              case 'XDS_SEAT_ON_LINE_STATUS':
                this.onlineStatus = this.onlineStatus.concat(data.data.sort(this.sortBy('itemIdx')))
                break
              default:
                break
            }
            break

          default:
            break
        }
      })
    },
    getIntoSeatList() {
      let params = {
        offset: 0,
        limit: 10
      }
      getIntoSeatList(params).then(data => {
        if (data.code === 1) {
          this.getSeatList()
          this.intoList = data.data.records
          this.intoSeatTotalCount = data.data.totalCount
          if (this.intoSeatTotalCount > 0 && this.intoList.length <= 0) {
            this.showNoData = true
          } else {
            this.showNoData = false
          }
        }
      })
    },
    saveSeatNo() {
      saveSeatNo().then(data => {
        if (data.code === 1) {
          this.createSeat = {
            id: data.data.id,
            seatNo: data.data.seatNo
          }
          this.getPublicAccountList('addSeats')
        } else {
          this.content = `当前套餐版本最多支持${
            this.corpInfoData.packSeatNum
          }个坐席，如需更多服务请升级。`
          this.$refs.addseatsTips.showModal()
        }
      })
    },
    reload() {
      this.getSeatList()
    },
    getSeatList() {
      this.beginIntoLoading = 1
      getSeatList(this.searchParams)
        .then(data => {
          if (data.code === 1) {
            this.loadingStatu = 2
            this.beginIntoLoading = 2
            this.seatListData = data.data.records
            this.totalCount = data.data.totalCount
            // if (this.totalCount > 0 && this.seatListData.length <= 0) {
            //   this.showNoData = true
            // } else {
            //   this.showNoData = false
            // }
          } else {
            this.loadingStatu = 3
          }
        })
        .catch(() => {
          this.loadingStatu = 3
        })
    },
    pageChange(val) {
      this.searchParams.offset = this.searchParams.limit * (val - 1)
      this.getSeatList()
    },
    pageSizeChange(val) {
      this.searchParams.limit = val
      this.getSeatList()
    },
    refresh() {
      this.getSeatList()
    },
    settingChange() {
      let arr = []
      arr.push(this.deepColumns[0])
      for (let j = 0; j < this.deepColumns.length; j++) {
        let deepColKey = this.deepColumns[j]
        for (let index = 0; index < this.setting.length; index++) {
          let settingKey = this.setting[index]
          if (settingKey === deepColKey.key) {
            arr.push(deepColKey)
            break
          }
        }
      }
      this.$set(this, 'columns', arr)
      let key = this.installName('seat')
      localStorage && localStorage.setItem(key, JSON.stringify(this.setting))
    },
    checkSettingArr(arr) {
      arr.forEach(item => {
        item.title && this.setting.push(item.key)
      })
    },
    saveSeatsInfo() {
      this.updateAuthBatchParams.seatIds = []
      this.selectListData.forEach(item => {
        this.updateAuthBatchParams.seatIds.push(item.id)
      })
      let param = this.$refs['seatsLimit'].isGoNext()
      if (param) {
        this.updateAuthBatchParams.appAccountIds = param.appAccountIds || null
        this.updateAuthBatchParams.authIds = param.authIds || null
        this.updateSeatAuthByBatch()
      }
    },
    back() {
      this.showBatchLimit = false
    },
    editInfo(val) {
      this.editTabsVal = '1'
      this.tabsVal = '1'
      setTimeout(() => {
        this.tabsVal = val
        this.getPublicAccountList('editSeats')
      }, 1)
    },
    currentChange(currentRow, oldCurrentRow) {
      this.getSeatDetail(currentRow.id, 'seatsInfo')
    },
    searchSeatsList() {
      this.getSeatList()
    },
    enterSearchList() {
      this.getSeatList()
    },
    upgrade() {
      let corpId = this.getCookie('currentCorp').applyId
      let corpName = this.getCookie('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    selectAction(name) {
      this.$refs[name].showModal()
    },
    addSeats() {
      // if (
      //   (this.intoSeatTotalCount > 0 && this.intoList.length <= 0) ||
      //   this.intoSeatTotalCount < this.corpInfoData.packSeatNum
      // ) {
      this.setCookie('seatsInfo', {})
      this.setSeatsInfo({})
      this.saveSeatNo()
      // } else {
      //   this.content = `当前套餐版本最多支持${
      //     this.corpInfoData.packSeatNum
      //   }个坐席，如需更多服务请升级。`
      //   this.$refs.addseatsTips.showModal()
      // }
    },

    deallocate() {
      this.updateSeatStatus(this.ids)
    },
    stopSeats() {
      this.updateSeatStatus(this.ids)
    },
    batchStopSeats() {
      this.updateSeatStatus(this.ids)
    },
    startSeats() {
      this.updateSeatStatus(this.ids)
    },
    exportCsv() {
      this.$refs.table.exportCsv({
        filename: '用户数据.excel',
        columns: this.columns,
        data: this.seatListData
      })
    },
    batchStop() {
      if (this.selectListData.length === 0) {
        this.$Message.error('至少选择一项')
      } else {
        this.operationStatus = 'BATCH_BLOCK_UP'
        let arr = []
        this.selectListData.forEach(item => {
          arr.push(item.id)
        })
        this.ids = arr
        this.$refs.batchStopSeats.showModal()
      }
    },
    batchSetLimit() {
      if (this.selectListData.length === 0) {
        this.$Message.error('至少选择一项')
      } else {
        this.setSeatsInfo({})
        this.showBatchLimit = true
      }
    },
    allSelectList(val) {
      this.$refs.table.selectAll(val)
    },
    hideFilter() {
      this.showFilter = false
    },
    handleFilter() {
      this.showFilter = true
    },
    selectSeatsStatu(idx, value) {
      this.seatsStatuIdx = idx
      this.searchParams.status = value
    },
    selectOnlineStatu(idx, value) {
      this.onlineStatuIdx = idx
    },
    filterComfirm() {
      this.hideFilter()
      this.getSeatList()
    },
    filterCancel() {
      this.hideFilter()
    },
    selectionChange(arr) {
      if (this.seatListData.length === arr.length) {
        this.single = true
      } else {
        this.single = false
      }
      this.selectListData = arr
    },
    // 公用方法，组装localStorage中存储的列表头显示数据的名称，为“用户id_公司id_页面名称”
    installName(pageName) {
      let userId = this.getCookie('token').userId
      let applyId = this.getCookie('currentCorp').applyId
      return userId + '_' + applyId + '_' + pageName
    },
    ...mapActions({
      setSeatsInfo: 'seats/setSeatsInfo',
      setPayStatu: 'pay/setPayStatu'
    })
  },
  destroyed() {
    this.$root.Bus.$off('refreshList')
    this.$root.Bus.$off('drawerClose')
  },
  components: {
    noSeats,
    addSeats,
    seatsInfo,
    editSeats,
    seatsLimit
  }
}
</script>

<style lang="stylus">
@import './seats.styl'
</style>


