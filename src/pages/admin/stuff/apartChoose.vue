<template>
    <Modal :title="title" v-model="showModal" class-name='modal-apart-modal'>
        <div class="tree_wrap">
          <scroll-bar>
          <YktTree @getCurrentNode="getCurrentNode" v-if="showModal" :noOperation="true" :datas="datas" :width="490"></YktTree>
          </scroll-bar>
        </div>
        <div slot="footer">
            <div class="footer_wrap">
                <div class='chooseVal'>
                    <p>当前选中部门</p>
                    <span>{{curSelectApart && curSelectApart.title}}</span>
                </div>
                <div class="btns">
                    <i-button type="primary" size="large" @click='chooseApart'>确定</i-button>
                    <i-button size="large" @click="showModal = false">取消</i-button>
                </div>
            </div>
        </div>
    </Modal>
</template>
<script>
    import { mapGetters } from 'vuex'
    import YktTree from './yktTree.vue'
    export default {
        name: 'apartChoose',
        data() {
            return {
                title: '部门',
                showModal: false,
                selectApart: null,
                datas: null,
                stateArr: [],
                curDeptId: null,
                trueExist: false
            }
        },
        computed: {
            ...mapGetters({
                currApart: 'stuff/getCurrApart',
            }),
            curSelectApart() {
                return this.selectApart || this.currApart
            }
        },
        created() {
            this._BUS.$on('reciveDatas', (param) => {
                this.datas = this.deepCopy(param)
            })
            this._BUS.$on('showApart', () => {
                this._BUS.$emit('getDatas')
                this.showModal = true
            })
        },
        components: {YktTree},
        methods: {
            iterateCurrNode(val) {
                if (val.currentNode) {
                    return this.iterateCurrNode(val.currentNode)
                } else {
                    return val
                }
            },
            getCurrentNode(val) {
                let node = this.iterateCurrNode(val)
                this.selectApart = node
            },
            chooseApart() {
                if (this.selectApart) {
                    this.showModal = false
                    this._BUS.$emit('apartChoosed', this.selectApart)
                } else {
                    this.$Message.error('请选择至少一个部门')
                }
            }
        }
    }
</script>
<style>
  .modal-apart-modal.ivu-modal-wrap{
    height: 550px;
    overflow:hidden;
    top:50%;
    transform: translateY(-50%)
  }
  .ivu-modal-footer .footer_wrap{
    display:flex;
    justify-content: space-between
  }
  .ivu-modal-footer .footer_wrap .chooseVal{
    float:left;
    justify-content: flex-start;
  }
  .ivu-modal-footer .footer_wrap .chooseVal p, .ivu-modal-footer .footer_wrap .chooseVal span{
    margin-top:10px;
    float:left;
  }
  .ivu-modal-footer .footer_wrap .chooseVal span{
    color: #409eff;
    margin-left:10px;
    max-width: 200px;
    text-align: left;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>
<style lang="stylus">
@import '~@/assets/stylus/index'
  .tree_wrap
    height:300px
</style>
