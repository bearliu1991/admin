<template>
  <div id="addUser">
    <div class="top_step">
        <Steps :current="curId">
            <Step title="基本信息"></Step>
            <Step title="权限设置"></Step>
            <Step title="邀请加入"></Step>
        </Steps>
    </div>
    <div class="component">
        <data-loading :dataSatau="dataSatau">
            <AddInput v-show="curId === 0" ref="addInput" :height='height'></AddInput>
            <RightSet :systems="systems" :isEdit="true" class="right_set" :style="{height: height + 'px'}" v-show="curId === 1" ref="rightSet"></RightSet>
            <WeCode v-show="curId === 2" ref="weCode" :datas="weCodeData" :curApart="curApart">
                <p><span class="icon suc_color">&#xe688;</span> 员工创建成功!</p>
                <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
            </WeCode>
        </data-loading>
    </div>
    <div class="handles save_data">
      <i-button type="primary" @click="goNext" v-show="curId === 0" class="width_bg">保存并下一步</i-button>
      <i-button type="primary" @click="goNext" v-show="curId === 1" class="width_bg">完成并邀请</i-button>
      <i-button type="primary" @click="cancel" v-show="curId === 2" class="width_bg">完成</i-button>
      <i-button type="primary" @click="addMore" v-show="curId === 2" class="width_bg">继续添加</i-button>
      <i-button @click="preStep" v-show="curId === 1">上一步</i-button>
      <i-button @click="cancel" v-show="curId === 0 || (curId === 1)">取消</i-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AddInput from './addInput'
import WeCode from './weCode'
import RightSet from './rightSet'
import Const from './const'
export default {
  data() {
    return {
      curId: 0,
      dataSatau: 2,
      systems: [],
      eeId: null,
      inviteCode: null,
      inputVals: null,
      weCodeData: {},
      height: 0,
      isChatRight: false
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters({
        curApart: 'stuff/getCurrApart'
    }),
  },
  components: { AddInput, WeCode, RightSet },
  mounted() {
      let val = document.getElementById('addUser').getBoundingClientRect().height
      this.height = val - 97 > 0 ? val - 97 : 0
  },
  methods: {
    init() {
        this.systems = this.deepCopy(Const.systems)
    },
    preStep() {
        this.curId--
    },
    addMore() {
        this.curId = 0
        this.$refs['addInput'].init()
    },
    ajaxData(key, index) {
        this.getRightsList({platformType: key}).then((res) => {
            let obj = {}
            if (res.code === 1) {
                this.dataSatau = 2
                for (let item of res.data) {
                    obj[item.groupName] = obj[item.groupName] || {}
                    obj[item.groupName].name = item.groupName
                    obj[item.groupName].data = obj[item.groupName].data || []
                    obj[item.groupName].data.push({
                        cont: item.roleName,
                        id: item.roleId,
                        groupName: item.groupName,
                        isSelect: false
                    })
                }
            }
            this.systems[index].obj = obj
            this.$set(this, 'systems', this.deepCopy(this.systems))
        })
    },
    getGroupData() {
        this.ajaxData('PC_WEB_ADMIN', 0)
        this.ajaxData('PC_WEB_CHAT', 1)
        // 如果坐席权限没开，则聊天权限不能选择
        if (this.isChatRight) {
            this.systems.length === 1 && this.systems.push({name: '聊天管理系统', obj: {}})
            this.ajaxData('PC_WEB_CHAT', 1)
        } else {
            this.systems = this.systems.slice(0, 1)
        }
    },
    goNext() {
        if (this.curId === 0) {
            this.inputVals = this.$refs['addInput'].getParams()
            if (!this.inputVals) {
                return false
            }
            this.isChatRight = !!this.inputVals.seatNo
            this.curId = 1
            this.getGroupData()
            // this.isAddUserAvail().then((res) => {
            //     this.dataSatau = 2
            //     if (res.code === 1) {
            //         this.curId = 1
            //         this.getGroupData()
            //     } else if (res.code === 3539) {
            //         this.$Message.error(`当前套餐版本最多支持${this.pageTotal}个员工，如需更多服务请升级`)
            //     } else {
            //         this.$Message.error(res.message)
            //     }
            // })
        } else if (this.curId === 1) {
            let obj = this.inputVals
            let ids = this.$refs['rightSet'].getSysId()
            if (!ids || !ids.length) {
                this.$Message.error('请至少选择一个权限')
                return false
            }
            let obj1 = {'addRoleIds': ids, deptId: this.curApart.id}
            let param = {...{}, ...obj, ...obj1}
            this.dataSatau = 1
            this.addUser(param).then((res) => {
                this.dataSatau = 2
                if (res.code === 1) {
                    this.curId = 2
                    this._BUS.$emit('getUsers', 'addUser')
                    this._BUS.$emit('refreshTreeUser')
                    let eeId = res.data.eeId
                    this.$Message.success('添加员工成功')
                    this.formWecode({id: eeId}).then((response) => {
                        if (response.code === 1) {
                            this.weCodeData = response.data
                        } else {
                            this.$Message.error(response.message)
                        }
                    })
                } else {
                    this.$Message.error(res.message)
                    return false
                }
            })
        }
    },
    cancel() {
      this._BUS.$emit('handle', 'goback')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#addUser
    height:100%
    relative()
    .top_step
        .ivu-steps-title
            mb(0)
            mr(4px)
        >div
            padt(30px)
            padl(50px)
            padb(20px)
    .component
        height:80%
        .right_set
            overflow-y: auto
</style>
