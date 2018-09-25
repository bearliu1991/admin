<template>
  <div id="createUnit">
    <div class="wrapper">
        <div class="left">
            <div class="title">
                <span class="icon">&#xe748;</span>组织架构
            </div>
            <div class="unit">
                <data-loading :dataSatau="dataSatau">
                    <YktTree :datas="datas" @getCurrentNode="getCurrentNode"></YktTree>
                </data-loading>
            </div>
        </div>
        <div class="right">
            <StuffData></StuffData>
        </div>
    </div>
  </div>
</template>

<script>
import YktTree from './yktTree.vue'
import StuffData from './StuffData'
import {mapGetters} from 'vuex'

const sortTreeNode = (treeData = []) => {
    treeData.sort((item1, item2) => {
        if (Array.isArray(item1.children)) {
            sortTreeNode(item1.children)
        }
        return item1.order > item2.order
    })
}
export default {
    name: "createUnit",
    data () {
        return {
            buttonProps: {
                type: 'default',
                size: 'small'
            },
            dataSatau: 1,
            datas: [
                {
                    title: '',
                    order: 1,
                    id: 0,
                    expand: true
                }
            ]     
        }
    },
    components: {
        StuffData,
        YktTree
    },
    computed: {
        ...mapGetters({
            corInfo: 'survey/getCorpPackage'
        })
    },
    created() {
        this._BUS.$on('getTreeData', () => {
            this.getTreeData()
        })
        this.getTreeData()
    },
    methods: {
        transforData(data) {
            let rules = {
                'key': 'id',
                'label': 'title',
                'value': 'value',
                'parentId': 'parentId',
                'extItem': 'extItem',
                'parentLabel': 'parentLabel',
                'total': 'total',
                'eeNum': 'eeNum',
                'children': 'children'
            }
            data = data.map(item => this._transformData(item, rules, false, 'children'))
            return data
        },
        getUser(key) {
            // this.$store.commit('stuff/SET_CORP_KEY', this.deepCopy(key))
            this._BUS.$emit('getUsers')
        },
        getTreeData() {
           this.getTree().then((res) => {
               if (res.code === 1) {
                let rules = {parentLabel: 'label', _parentId: 'key', total: 'eeNum'}
                let obj = res.data.map((item) => this._computedTreeTotal(item, rules, 'children', 'total'))
                let finalRes = this.transforData(obj)
                this.$set(this, 'datas', finalRes)
                this.dataSatau = 2
                this.$store.commit('stuff/SET_TREE', this.deepCopy(finalRes))
                this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(finalRes[0]))
                this.getUser()
               } else {
                   this.dataSatau = 3
               }
           })
        },
        getCurrentNode(val) {
            this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(val))
            this.getUser()
        }
    }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/fun'
#createUnit
    height 100%
    .wrapper
        display flex
        height 100%
        .left
            fl()
            inline()
            width 20%
            height 100%
            bgColor()
            .title
                vertical(56px)
                padl 10px
                border-bottom 1px solid #ddd
                .icon
                    padr(10px)
        .right
            fr()
            height 100%
            width: 78%
            ml(2%)
            bgColor()
            padding 20px 10px 10px 10px
</style>
