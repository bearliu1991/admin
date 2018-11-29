<template>
  <div id="createUnit">
    <div class="wrapper">
        <div class="left">
            <div class="title">
                <span class="icon">&#xe622;</span>组织架构
            </div>
            <div class="tree_wrap">
                <scroll-bar>
                    <div class="unit">
                        <data-loading :dataSatau="dataSatau">
                            <YktTree :datas="datas" @getCurrentNode="getCurrentNode"></YktTree>
                        </data-loading>
                    </div>
                </scroll-bar>
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

const sortTreeNode = (arr = []) => {
    arr.sort((item1, item2) => { return item1.deptOrder - item2.deptOrder })
    arr.forEach(item => {
        if (Array.isArray(item.children)) {
            sortTreeNode(item.children)
        }
    })
    return arr
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
            datas: [],
            curNodeObj: null,
            apartCount: 0,
            stateArr: []
        }
    },
    components: {
        StuffData,
        YktTree
    },
    computed: {
        ...mapGetters({
            corInfo: 'survey/getSaveloginCompany'
        })
    },
    created() {
        this._BUS.$on('apartCount', () => {
            this.apartCount = 0
            this.iterateChild(this.datas)
            this.$store.commit('stuff/SET_APART_COUNT', this.apartCount)
        })
        this._BUS.$on('getDatas', () => {
            this._BUS.$emit('reciveDatas', this.datas)
        })
        this._BUS.$on('treeUserNumDel', (depthIdList) => {
            for (let val of depthIdList) {
                this.treeUserDel(val)
            }
        })
        this._BUS.$on('refreshTreeUser', () => {
            this.treeUser()
        })
        this._BUS.$on('getTreeData', () => {
            this.getTreeData()
        })
        this._BUS.$on('addAparts', (name, depthId, type) => {
            this.addTreeNode(name, depthId, type)
        })
        this._BUS.$on('userNum', (num) => {
            this.setUserNum(num)
        })
        this._BUS.$on('delAparts', (name, depthId) => {
            this.delTreeNode(this.curNodeObj)
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
                'deptOrder': 'deptOrder',
                'parentLabel': 'parentLabel',
                'total': 'total',
                'eeNum': 'number',
                'children': 'children',
                'expand': 'expand',
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
                let obj = this._computedTreeTotal(res.data, rules, 'children', 'total')
                console.log(obj)
                let finalRes = this.transforData(obj)
                console.log(finalRes)
                sortTreeNode(finalRes)
                this.$set(this, 'datas', finalRes)
                this.dataSatau = 2
                this.$store.commit('stuff/SET_TREE', this.deepCopy(finalRes))
                // this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(finalRes[0]))
                // this.getUser()
               } else {
                   this.dataSatau = 3
               }
           })
        },
        iterateChild(data) {
            for (let val of data) {
                this.apartCount += 1
                val.children && this.iterateChild(val.children)
            }
        },
        iterateParentNode(val) {
            if (val.currentNode) {
                if (val.currentNode.currentNode.id !== undefined) {
                    return val
                } else if (val.currentNode.currentNode.currentNode) {
                    return this.iterateParentNode(val.currentNode)
                }
            } else {
                return false
            }
        },
        iterateDelNode(val) {
            if (val.currentNode) {
                if (val.currentNode.id !== undefined) {
                    return val
                } else if (val.currentNode.currentNode) {
                    return this.iterateDelNode(val.currentNode)
                }
            } else {
                return false
            }
        },
        iterateCurrNode(val) {
            if (val.currentNode) {
               return this.iterateCurrNode(val.currentNode)
            } else {
               return val
            }
        },
        iteraterDatas(arr, depthId) {
            let isAll = true
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === depthId) {
                    isAll = false
                    this.stateArr.push(i)
                    this.iteraterDatas(this.datas, arr[i].parentId)
                    return false
                }
            }
            if (isAll) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].children) {
                        this.iteraterDatas(arr[i].children, depthId)
                    }
                }
            }
        },
        treeUserDel(depthId) {
            this.stateArr = []
            this.iteraterDatas(this.datas, depthId)
            let arr = this.datas
            let idArr = this.stateArr
            for (let i = idArr.length - 1; i >= 0; i--) {
                this.delUserIterate(arr, idArr[i])
                arr = arr[idArr[i]].children
            }
        },
        delUserIterate(arr, idx) {
            this.$set(arr[idx], 'total', arr[idx].total - 1)
        },
        treeUser(type, num) {
            let val = this.iterateCurrNode(this.curNodeObj)
            let len = null
            if (this.curNodeObj && this.curNodeObj.currentNode && this.curNodeObj.currentNode.currentNode) {
                if (val.flag && val.flag.match(/-/g)) {
                    len = val.flag.match(/-/g).length
                }
                this.freshApartNum(len, val.parentId, type, num)
            }
        },
        setUserNum(num) {
            let val = this.iterateCurrNode(this.curNodeObj)
            this.$set(val, 'total', num)
            this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(val))
        },
        freshApartNum(len, parentId, type, num) {
            if (!len) {
                return false
            } else {
                for (let i = len - 1; i >= 0; i--) {
                    let obj = this.iterateObj(i)
                    for (let item of obj.parentNode) {
                        if (item.id === parentId) {
                            let number = type ? item.total - num : item.total - 0 + 1
                            this.$set(item, 'total', number)
                            this.freshApartNum(i, item.parentId, type, num)
                        }
                    }
                }
            }
        },
        iterateObj(len) {
            let objs = this.curNodeObj
            for (let i = 0; i < len; i++) {
                objs = objs.currentNode
            }
            return objs
        },
        addTreeNode(name, depthId, isModify) {
            let val = this.iterateCurrNode(this.curNodeObj)
            if (!isModify) {
                let currentChildren = val.children || []
                // 取消当节点选中状态
                this.$set(val, 'selected', false)
                // 选中新建的节点
                this.$set(val, 'expand', true)
                let childNode = {
                    expand: false,
                    children: null,
                    number: 0,
                    parentId: val.id,
                    parentLabel: val.title,
                    title: name,
                    order: -1,
                    total: 0,
                    selected: true,
                    id: depthId,
                    value: name,
                    flag: val.flag + '-0'
                }
                currentChildren.push(childNode)
                this.$set(val, 'children', currentChildren)

                let obj = {
                    currentIndex: currentChildren.length - 1,
                    currentNode: childNode,
                    parentNode: currentChildren,
                    rootNode: false
                }
                let node = this.installCurNode(this.curNodeObj)
                this.$set(node, 'currentNode', obj)
                this.$set(this.curNodeObj, 'rootNode', false)
                // console.error(node)
                // console.error(this.curNodeObj)
                this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(childNode))
                this._BUS.$emit('getUsers')
            } else {
                this.$set(val, 'title', name)
                this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(val))
                this.$emit("getCurrentNode", val)
            }
        },
        // 用于增加节点后重置curObj
        installCurNode(val) {
            if (val.currentNode && val.currentNode.currentNode) {
               return this.installCurNode(val.currentNode)
            } else {
               return val
            }
        },
        delTreeNode(value) {
            let val = this.iterateDelNode(value)
            let node = this.iterateParentNode(value)
            let curId = val.currentNode && val.currentNode.id
            let key = 0
            for (let i = val.parentNode.length - 1; i >= 0; i--) {
                if (val.parentNode[i] && (val.parentNode[i].id === curId)) {
                    key = i
                }
            }
            val.parentNode.splice(key, 1)
            let parentId = node.currentNode.currentNode.parentId
            for (let item of node.parentNode) {
                if (item.id === parentId) {
                    this.$set(item, 'selected', true)
                    this.$set(node, 'currentNode', item)
                    parentId === 32 && (this.$set(node, 'rootNode', true))
                    this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(item))
                }
            }
        },
        getCurrentNode(val) {
            this.curNodeObj = val
            this.$store.commit('stuff/SET_FILTE_OPT', null)
            this.$store.commit('stuff/SET_Filter_DATA', null)
            let node = this.iterateCurrNode(val)
            node.isRoot = val.rootNode = true && !val.currentNode.currentNode
            val && this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(node))
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
        overflow:hidden
        .left
            fl()
            inline()
            width 14%
            height 100%
            min-width:200px
            bgColor()
            .title
                vertical(56px)
                padl 10px
                border-bottom 1px solid #ddd
                .icon
                    padr(10px)
            .tree_wrap
                height: calc(100% - 57px)
        .right
            fr()
            height 100%
            width: 85%
            ml(1%)
            bgColor()
            padding 20px 10px 10px 10px
</style>
