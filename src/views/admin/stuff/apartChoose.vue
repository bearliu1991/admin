<template>
    <Modal :title="title" v-model="showModal">
        <YktTree @getCurrentNode="getCurrentNode" :noOperation="true" :datas="datas" :width="490"></YktTree>
        <div slot="footer">
            <div class="footer_wrap">
                <div class='chooseVal'>
                    <p>当前选中部门</p>
                    <span>{{selectApart && selectApart.title}}</span>
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
    import {mapGetters} from 'vuex'
    import YktTree from './yktTree.vue'
    export default {
        name: 'apartChoose',
        data() {
            return {
                title: '部门',
                showModal: false,
                selectApart: null
            }
        },
        created() {
            this._BUS.$on('showApart', () => {
                this.showModal = true
            })
        },
        computed: {
            ...mapGetters({
                trees: 'stuff/getTrees'
            }),
            datas() {
                return this.deepCopy(this.trees)
            }
        },
        components: {YktTree},
        methods: {
            getCurrentNode(val) {
                this.selectApart = val
            },
            chooseApart() {
                if (this.selectApart) {
                    this.showModal = false
                    this._BUS.$emit('apartChoosed', this.selectApart)
                } else {
                    this.$Message.info('请选择至少一个部门')
                }
            }
        }
    }
</script>
<style>
    .ivu-modal-footer .footer_wrap{
        display:flex;
        justify-content: space-between
    }
    .ivu-modal-footer .footer_wrap .chooseVal{
        display:flex;
        justify-content: flex-start;
    }
    .ivu-modal-footer .footer_wrap .chooseVal span{
        color: skyblue;
        margin-left:10px
    }
</style>
<style lang="stylus">
@import '~@/assets/stylus/index'
    #apartChoose
        height:500px
        width:500px
        
</style>
