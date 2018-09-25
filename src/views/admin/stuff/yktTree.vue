<template>
    <Treelist root noBorder noTag
    :treeData="TreeData" 
    :sparkLine="sparkLine" 
    :operations="treeOperations"
    :width="width"
    :noOperation="noOperation"
    @select="getCurTreeNode">
    </Treelist>
</template>

<script>
import Treelist from '@/components/treelist/treelist.vue'
export default {
    name: "createUnit",
    components: {Treelist},
    data () {
        return {
            sparkLine: {height: 10, width: 10, top: 11, left: -18},
            treeOperations: [
                { title: '添加子部门', type: "addChild" },
                { title: '修改', type: "modify" },
                { title: '删除', type: "delete" },
                { title: '上移', type: "moveup" },
                { title: '下移', type: "movedown" }
            ],
            currVal: {},
            data5: [
                {
                    title: '杭州',
                    order: 1,
                    id: 0,
                    expand: true
                }
            ]          
        }
    },
    props: ['width', 'noOperation', 'datas'],
    computed: {
        TreeData() {
            return this.datas
        }
    },
    methods: {
        getCurTreeNode(val, type) {
            if (type === 'addChild') {
                this.addTreeNode(val)
            } else if (type === 'modify') {
                this.modifyTreeNode(val)
            } else if (type === 'delete') {
                this.deleteTreeNode(val)
            } else if (type === 'moveup') {
                this.moveupTreeNode(val)
            } else if (type === 'movedown') {
                this.movedownTreeNode(val)
            } else {                
                this.currVal = val
                this.$emit("getCurrentNode", val)
            }
        },
        addTreeNode(val) {
            let childNode = {
                    title: 'new',
                    order: -1
                }
            let currentChildren = val.currentNode.children || []
            currentChildren.push(childNode)
            this._BUS.$emit('apartProcess', 'addApart')
            // this.$set(val.currentNode, 'children', currentChildren)
        },
        modifyTreeNode(val) {
            this._BUS.$emit('apartProcess', 'modifyApart')
        },
        deleteTreeNode(val) {
            this._BUS.$emit('apartProcess', 'delApart')
            // let currIndex = val.currentIndex
            // val.parentNode.splice(currIndex, 1)
        },
        moveupTreeNode(val) {
            let currIndex = val.currentIndex
            if (currIndex === 0) {
                // 弹窗提示当前为第一个节点
            } else {
                let currOrder = val.currentNode.order
                let perOrder = val.parentNode[currIndex - 1].order
                this.$set(val.currentNode, 'order', perOrder)
                this.$set(val.parentNode[currIndex - 1], 'order', currOrder)
            }            
        },
        movedownTreeNode(val) {
            let currIndex = val.currentIndex
            if (currIndex === val.parentNode.length - 1) {
                // 弹窗提示当前为最后一个节点^
            } else {
                let currOrder = val.currentNode.order
                let nextOrder = val.parentNode[currIndex + 1].order
                this.$set(val.currentNode, 'order', nextOrder)
                this.$set(val.parentNode[currIndex + 1], 'order', currOrder)
            }
        }
    }
}
</script>
