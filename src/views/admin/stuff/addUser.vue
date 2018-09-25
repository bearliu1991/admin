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
            <AddInput v-show="curId === 0" ref="addInput"></AddInput>
            <RightSet :systems="systems" :isEdit="true" v-show="curId === 1" ref="rightSet"></RightSet>
            <WeCode v-show="curId === 2" ref="weCode" :datas="weCodeData" :curApart="curApart">
                <p>账号创建成功!</p>
                <p>将二维码截图或保存后发送给员工,员工可用微信扫码加入企业</p>
            </WeCode>
        </data-loading>
    </div>
    <div class="handles save_data">
      <i-button type="primary" @click="goNext" v-show="curId === 0 || (curId === 1)" class="width_bg">保存并下一步</i-button>
      <i-button type="primary" @click="addMore" v-show="curId === 2" class="width_bg">完成并继续添加</i-button>
      <i-button type="primary" @click="cancel" v-show="curId === 2" class="width_bg">完成</i-button>
      <i-button @click="preStep" v-show="curId === 1 || (curId === 2)">上一步</i-button>
      <i-button @click="cancel">取消</i-button>
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
      weCodeData: {}
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
    },
    goNext() {
        if (this.curId === 0) {
            this.inputVals = this.$refs['addInput'].getParams()
            if (!this.inputVals) {
                return false
            }
            this.dataSatau = 1
            this.isAddUserAvail().then((res) => {
                this.dataSatau = 2
                if (res.code === 1) {
                    this.curId = 1
                    this.getGroupData()
                } else {
                    this.$Message.error(res.message)
                }
            })
        } else if (this.curId === 1) {
            let obj = this.inputVals
            let ids = this.$refs['rightSet'].getSysId()
            let obj1 = {'addRoleIds': ids, deptId: this.curApart.id}
            let param = {...{}, ...obj, ...obj1}
            this.dataSatau = 1
            this.addUser(param).then((res) => {
                if (res.code === 1) {
                    this.dataSatau = 2
                    this.curId = 2
                    this._BUS.$emit('getUsers')
                    let eeId = res.data.eeId
                    this.formWecode({id: eeId}).then((response) => {
                        if (response.code === 1) {
                            this.weCodeData = response.data
                            this.$Message.success('添加员工成功')
                        } else {
                            this.$Message.error(response.message)
                        }
                    })
                }
            })
        }
    },
    cancel() {
      this._BUS.$emit('handle', 'goback')
    },
    saveData() {

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
</style>
