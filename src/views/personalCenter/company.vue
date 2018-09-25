<template>
  <div id="company">
    <div class="title">我的企业</div>
    <div class="table-list">
      <table class="table">
        <tr class="tr-item">
          <th class="th-item">企业名称</th>
          <th class="th-item">公众号</th>
          <th class="th-item">绑定手机号</th>
          <th class="th-item">您的身份</th>
          <th class="th-item">套餐版本</th>
          <th class="th-item">套餐有效时间</th>
          <th class="th-item">套餐状态</th>
          <th class="th-item">操作</th>
        </tr>
        <tr class="loading-item" v-show="loadingImg">
          <th colspan="7" class="loading">
            <Spin fix>
              <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
              <div>loading</div>
            </Spin>
          </th>
        </tr>
        <tr class="tr-item tr-td-item" v-for="(item ,index) in corpData" :key="index">
          <td class="td-item">
            <div class="default-name" v-show="idx!=index">
              <!-- <Tooltip placement="top">
                <span class="span tooltip-span">浙江省杭州拱墅区星客互联科技有限责任公司...</span>
                <div slot="content" class="c-tooltip">
                  <span>浙江省杭州拱墅区星客互联科技有限责任公司...111</span>
                </div>
              </Tooltip> -->
              <span class="span company-name" :title="item.corpName">{{item.corpName}}</span>
              <span class="span dingWidth">
                <Icon class="edit-icon handle" title="修改" size="18" @click="nameEdit(index,item.corpName)" type="edit"></Icon>
              </span>
            </div>
            <div class="edit" v-show="idx==index">
              <Input v-model="companyName" placeholder="请输入企业名称" style="width: 315px"></Input>
              <span class="span handle" @click="saveEdit(item.applyId)">保存</span>
              <span class="span handle" @click="cancalEdit">取消</span>
            </div>
          </td>
          <td class="td-item">
           {{item.appidNum}}
          </td>
          <td class="td-item">
           {{item.mobile}}
          </td>
          <td class="td-item">
           <span v-show="item.identity==1">管理员</span>
           <span v-show="item.identity==0">普通员工</span>
          </td>
          <td class="td-item">
            <span>{{item.version}}</span>
            <span class="span handle" v-show="item.version!=='钻石版'">升级</span>
          </td>
          <td class="td-item">
           <span class="span">{{item.startTime.substring(0,10)}}至{{item.endTime.substring(0,10)}}</span>
          </td>
          <td class="td-item">
            <span v-show="item.packStatus=='ACTIVE'">正常</span>
            <span v-show="item.packStatus=='DISABLE'">停用</span>
            <span v-show="item.packStatus=='EXPIRE'">已过期</span>
          </td>
          <td class="td-item">
           <Button type="primary" @click="goCorp(item.packStatus, item)">进入管理</Button>
           <Button @click="exitCorp(item.applyId)" v-show="item.identity!==1">退出企业</Button>
          </td>
        </tr>
      </table>
      <div class="page">
        <!-- <Page :total="40" size="small" @on-change="changePage"></Page> -->
      </div>
      <div>
        <Button @click="createCompany()" type="primary">创建新企业</Button>
      </div>
    </div>
    <div class="footer-banner">
      <img src="@/assets/images/footer-banner.png" alt="">
    </div>
    <common-modal ref="addCompany" header="创建提示" content="请先将未添加公众号的企业添加公众号。" :showFooter="false"></common-modal>
    <common-modal ref="exitCorp" header="解绑企业" content="解绑后您将无法继续位该公司下的公众号提供管理和服务。" @ok="asyncOK"></common-modal>
    <common-modal ref="expire" header="已过期提示" confrim="立即升级" content="该企业套餐已过期，请升级后继续使用。如有问题，请咨询迎客通客
服人员，谢谢。" @ok="upgrade" ></common-modal>
    <common-modal ref="disabled" header="停用提示" content="该企业已被停用，请联系您的销售顾问。如有问题，也可咨询迎客通客服人员，谢谢。" :showFooter="false"></common-modal>
  </div>
</template>

<script>
import {
  getUserCorpAuthMulti,
  updateCorpName,
  savelogoutCompany,
  checkCreateCorpApply
} from '@/api/query'
import { setCookie } from '@/assets/js/cookies'
export default {
  data() {
    return {
      // 点击修改企业名称的索引值
      idx: -1,
      companyName: '',
      modal6: false,
      loading: true,
      corpData: [],
      applyId: '',
      offset: 0,
      loadingImg: false,
      loadingCount: 0,
      isAddCrop: false
    }
  },
  mounted() {
    this.getUserCorpAuthMulti()
    this.checkCreateCorpApply()
  },
  methods: {
    // 获得公司列表
    getUserCorpAuthMulti() {
      // let params = {
      //   offset: this.offset,
      //   limit: 10,
      //   // ASC
      //   order: 'ASC'
      // }
      if (this.loadingCount === 0) {
        this.loadingImg = true
      }
      this.loadingCount++
      getUserCorpAuthMulti().then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          this.corpData = data.data
        }
      })
    },
    checkCreateCorpApply() {
      checkCreateCorpApply().then(data => {
        switch (data.code) {
          case 1:
            this.isAddCrop = false
            break
          case 3529:
            this.isAddCrop = true
            break  
          default:
            break
        }
      })
    },
    changePage(page) {
      this.loadingImg = true
      this.offset = (page - 1) * 10
      // this.getUserCorpAuthMulti()
    },
    updateCorpName(params) {
      updateCorpName(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('修改成功')
            this.getUserCorpAuthMulti()
            break
          case 3515:
            break
          case 3520:
            this.$Message.success('公司不存在或不可用')
            break
          default:
            break
        }
      })
    },
    savelogoutCompany(params) {
      savelogoutCompany(params).then(data => {
        if (data.code === 1) {
          this.getUserCorpAuthMulti()
        }
      })
    },
    nameEdit(idx, name) {
      this.idx = idx
      this.companyName = name
    },
    saveEdit(applyId) {
      this.idx = -1
      let params = {
        applyId,
        corpName: this.companyName
      }
      this.updateCorpName(params)
    },
    exitCorp(applyId) {
      this.$refs.exitCorp.showModal()
      this.applyId = applyId
    },
    goCorp(status, item) {
      switch (status) {
        case 'EXPIRE':
          this.$refs.expire.showModal()
          break
        case 'DISABLE':
          this.$refs.disabled.showModal()
          break
        default:
          setCookie('currentCorp', item, 0.5)
          this.$router.push({ name: 'survey' })
          break
      }
    },
    cancalEdit() {
      this.idx = -1
    },
    asyncOK() {
      this.savelogoutCompany({ corpId: this.applyId })
    },
    upgrade() {},
    createCompany() {
      if (this.isAddCrop) {
        this.$refs.addCompany.showModal()
        return
      }
      this.$router.push({ name: 'createCompany' })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#company
  position relative
  padding 42px 43px 160px
  .title
    font-size 20px
  .table-list
    min-height 400px
    position relative
    margin-top 30px
    .table
      text-align left
      width 100%
      .tr-item
        height 60px
        line-height 60px
        border-bottom solid 1px #e9eaec
        .th-item
          color #848484
          text-align left
        .td-item
          &:nth-of-type(1)
            width 400px
          .default-name
            padding-right 25px
            position relative
            .edit-icon
              position absolute
              right 20px
              top 20px
              width 20px
              height 20px
              display none
          .handle
            margin-left 6px
            color #409eff
            cursor pointer
          .span
            line-height 1
            display inline-block
            &.company-name
              width 325px
              no-wrap()
          .dingWidth
            width 18.25px
          .c-tooltip
            white-space normal
      .loading-item
        .loading
          position relative
          height 300px
      .tr-td-item .td-item:hover
        .default-name
          .edit-icon
            display inline-block
    .page
      margin-top 50px
      clear()
      .ivu-page
        float right
  .footer-banner
    position absolute
    bottom 20px
    img
      width 100%
</style>


