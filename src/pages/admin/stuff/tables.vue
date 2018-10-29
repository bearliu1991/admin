<template>
    <div id="table">
        <div v-if="(currApart && currApart.total) || datas.length">
          <div class="middle">
            <i-button @click="addUser" type="primary">添加员工</i-button>
            <div class="right_pro">
              <div class="search_input">
                <input v-model="searchInput" @change="setInputVal" placeholder="输入姓名/手机号"/>
                <i class="icon" @click="getParams">&#xe634;</i>
              </div>
              <span class="icon" @click="setFilter">&#xe748;</span>
              <span class="icon" @click="exportCsv">&#xe66c;</span>
              <span class="icon" @click="refresh">&#xe62b;</span>
              <Poptip placement="left-start">
                  <span class="icon cursor pop_span">&#xe633;</span>
                  <div slot="content">
                    <Chooses :columns="columns"></Chooses>
                  </div>
              </Poptip>
            </div>
          </div>
          <div class="table">
            <!-- <data-loading :dataSatau="dataSatau"> -->
              <Table ref="table" :loading="loading" @on-row-click="rowClick" :columns="columns" :data="datas" @on-selection-change="selectionChange"></Table>
            <!-- </data-loading> -->
          </div>
          <div class="common_pro">
            <div class="left_pro">
              <div class="checkbox">
                  <i @click="setAllChoose"><Checkbox v-model="isAllChoosed"></Checkbox></i> 全选
              </div>
              <i-button size="small" @click="handle('delete')">批量删除</i-button>
              <i-button size="small" @click="handle('stop')">批量停用</i-button>
            </div>
            <div class="pages" v-if="pageTotal > pageSize">
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
        <div v-else class="no_data">
          <div class="no_wrap">
            <img src="@/assets/images/imgs/stuff/no_data.png"/>
            <p>当前部门尚未添加员工</p>
            <i-button @click="addUser" type="primary">添加员工</i-button>
          </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import Chooses from './chooses'
    export default {
      name: 'tables',
      data() {
          return {
            searchInput: '',
            corId: -1,
            timer: null,
            currPage: 1,
            pagination: true,
            pageSize: 10,
            loading: false,
            isAllChoosed: false,
            processData: null,
            pageParam: {}
          }
      },
      props: {
        columns: {
          type: Array,
          default: () => { return [] }
        },
        datas: {
          type: Array,
          default: () => { return [] }
        },
        pageTotal: {
          type: Number,
          default: 0
        }
      },
      created() {
        this._BUS.$on('tableLoading', (loadParam) => {
          loadParam && (this.loading = loadParam)
          if (!loadParam) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.loading = loadParam
            }, 300)
          }
        })
        this.pageParam = {
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
      },
      computed: {
        ...mapGetters({
          currApart: 'stuff/getCurrApart'
        })
      },
      components: {Chooses},
      watch: {
        currPage() {
          this.getParams()
        },
        pageSize() {
          this.getParams()
        }
      },
      methods: {
        getParams() {
          this.pageParam = {
            offset: (this.currPage - 1) * this.pageSize,
            limit: this.pageSize
          }
          this._BUS.$emit('getUsers')
        },
        addUser() {
          this.isAddUserAvail().then((res) => {
            if (res.code === 1) {
              this._BUS.$emit('addUser')
            } else {
              this.$Message.error(res.message)
            }
          })
        },
        rowClick(val) {
          this._BUS.$emit('handle', 'show', val.eeId)
        },
        setInputVal() {
          this.$store.commit('stuff/SET_FILTE_NAME', this.searchInput)
        },
        // 刷新数据
        refresh() {
          this._BUS.$emit('getUsers')
        },
        // 导出数据
        exportCsv() {
          this.$refs.table.exportCsv({
            filename: '用户数据.excel',
            columns: this.columns,
            data: this.datas
          })
        },
        setFilter() {
          this._BUS.$emit('showFilter', {nowCompo: "Filters", drawerTitle: '筛选'})
        },
        
        setAllChoose() {
          this.isAllChoosed = !this.isAllChoosed
          this.$refs.table.selectAll(this.isAllChoosed)
        },
        pageChange(page) {
          if (page !== this.currPage) {
            this.currPage = page
          }
        },
        pageSizeChange(pageSize) {
          if (this.pageSize !== pageSize) {
            this.pageSize = pageSize
          }
        },
        changeOrder(param) {
          let arg = {
            key: param.key,
            order: param.order
          }
          this._BUS.$emit('sortChange', arg)
        },
        selectionChange(selection) {
          this.isAllChoosed = selection.length === this.pageSize
          this.$store.commit('stuff/SET_SELECT_ROWS', this.deepCopy(selection))
        },
        handle(key) {
          this._BUS.$emit('handle', key)
        }
      }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #table
    .like_a
      border:1px solid text_color
      inline()
      center()
      width: 50px
      radius(3px)
      height:24px
      line-height:22px
      color:#409eff
    .ivu-table th
      bort(1px solid #e3e4e6)
      borb(0)
    .ivu-table-cell
      padr(5px)
      padl(5px)
      overflow visible
    .process_btn
      inline()
      padding:15px
      fn(22px)
      font-weight:bold
    .mr10
      inline()
      mr(8px)
    .img_portrait
      fl()
      width: 20px
      height: 20px
      mr(5px)
    .wechat_name
      fl()
      mt(2px)
    .ivu-spin-fix
      bgColor(hsla(0,0%,100%,.9))

  #table
    .middle
      setBetween()
      mb(20px)
      .right_pro
        fr()
        .search_input
          fl()
          border_()
          vertical(40px)
          radius(3px)
          relative()
          width:200px
          mr(10px)
          input
            absolute()
            left:10px
            top:0
            height:100%
            bottom:0
            right:20px
          i
            absolute()
            right:0
            width:28px
            cursor()
            fn(20px)
            color(#aaa)
        >.ivu-icon
          cursor()
          width 30px
          height 30px
          fn(14px)
          text-align center
          border 1px solid #ddd
        >span, .pop_span
          fl()
          margin:0 10px
          mt(10px)
          cursor()
          fn(18px)
          &:hover
            color(text_color)
        .pop_span
          mt(8px)
          fn(24px)
        .pop_span:hover
          color(text_color)
    .common_pro
      setBetween()
      mt(20px)
      .left_pro
        fl()
        button
          fl()
          margin:0 5px
          bgColor()
        .checkbox
          mt(8px)
          fl()
          mr(20px)
      .pages
        fr()
        mt(-5px)
    .no_data
      margin:0 auto
      text-align:center
      vertical-align:middle
      .no_wrap
        width:200px
        inline()
        mt(200px)
        img, p, button
          inline()
        p
          margin: 10px 0
</style>
