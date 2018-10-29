<template>
    <div class="ykt-suff-tree">
        <!-- @select="getCurTreeNode" -->
        <Treelist root noRootBorder :noTag='noTag'
            :treeData="TreeData"
            :operations="treeOperations"
            :width="width"
            tagName="total"
            :noOperation="noOperation"
            @hoverChange="treeHoverChange"
            @operation="treeOperationsFn"
            @select="treeSelection"
            >
            </Treelist>
        <BulletBox :position="position" v-if="showBulletBox">
            <ul slot="bullet-box-content" @mouseleave="showBulletBox = false">
                <li class="bullet-box-item"
                    v-for="(_item, _index) in treeOperations" :key="_index"
                    @click.stop="treeCurrentNodeOperations(null, _item.type)">{{_item.title}}</li>
            </ul>
        </BulletBox>
    </div>
</template>

<script>
import Treelist from '@/components/treelist/treelist.vue'
import BulletBox from '@/components/BulletBox.vue'
export default {
    name: "createUnit",
    components: {Treelist, BulletBox},
    data () {
        return {
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
            ],
            treeOperationsNode: null,
            showBulletBox: false,
            noTag: false,
            position: {x: 0, y: 0}
        }
    },
    props: ['width', 'noOperation', 'datas'],
    computed: {
        TreeData() {
            return this.datas
        }
    },
    methods: {
        treeCurrentNodeOperations(val, type) {
            this.showBulletBox = false
            if (type === 'addChild') {
                this.addTreeNode(this.treeOperationsNode)
            } else if (type === 'modify') {
                this.modifyTreeNode(this.treeOperationsNode)
            } else if (type === 'delete') {
                this.deleteTreeNode(this.treeOperationsNode)
            } else if (type === 'moveup') {
                this.moveupTreeNode(this.treeOperationsNode)
            } else if (type === 'movedown') {
                this.movedownTreeNode(this.treeOperationsNode)
            } else {
                this.currVal = val
                this.$emit("getCurrentNode", val)
            }
        },
        treeHoverChange(val) {
            this.showBulletBox = false
        },
        treeOperationsFn(val) {
            this.treeOperationsNode = val
            this.showBulletBox = true
            this.$set(this, "position", {
                x: val.position.x + val.position.w + 11,
                y: val.position.y - 8
            })
        },
        treeSelection(val) {
            this.currVal = val
            this.$emit("getCurrentNode", val)
        },
        addTreeNode(val) {
            let currentChildren = val.currentNode.children || []
            // 取消当节点选中状态
            this._BUS.$on('addApartScucess', (name, depthId) => {
                this.$set(val.currentNode, 'selected', false)
                // 选中新建的节点
                this.$set(val.currentNode, 'expand', true)
                let childNode = {
                    expand: false,
                    children: null,
                    number: 0,
                    parentId: val.currentNode.id,
                    parentLabel: val.currentNode.title,
                    title: name,
                    order: -1,
                    total: 0,
                    selected: true,
                    id: depthId,
                    value: name
                }
                currentChildren.push(childNode)
                this.$set(val.currentNode, 'children', currentChildren)
                this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(childNode))
                this.$emit("getCurrentNode", childNode)
                this._BUS.$emit('getUsers')
            })
            this._BUS.$emit('apartProcess', 'addApart')
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
            let currIndex = val.parentNode.findIndex((item) => {
                return item.id === val.currentNode.id
            })
            if (val.parentNode[currIndex - 1]) {
                let currOrder = this.deepCopy(val.currentNode)
                let perOrder = this.deepCopy(val.parentNode[currIndex - 1])
                this.$get(this.Path.moveApart, {upDeptId: currOrder.id, downDeptId: perOrder.id}).then((res) => {
                    if (res.code === 1) {
                        for (let key of Object.keys(val.currentNode)) {
                            this.$set(val.currentNode, key, perOrder[key])
                            this.$set(val.parentNode[currIndex - 1], key, currOrder[key])
                        }
                    } else {
                        this.$Message.error('部门移动失败！')
                    }
                })
            } else {
                this.$Message.warning('此部门无法上移!')
            }
        },
        movedownTreeNode(val) {
            let currIndex = val.parentNode.findIndex((item) => {
                return item.id === val.currentNode.id
            })
            if (val.parentNode[currIndex + 1]) {
                let currOrder = this.deepCopy(val.currentNode)
                let perOrder = this.deepCopy(val.parentNode[currIndex + 1])
                this.$get(this.Path.moveApart, {upDeptId: currOrder.id, downDeptId: perOrder.id}).then((res) => {
                    if (res.code === 1) {
                        for (let key of Object.keys(val.currentNode)) {
                            this.$set(val.currentNode, key, perOrder[key])
                            this.$set(val.parentNode[currIndex + 1], key, currOrder[key])
                        }
                    } else {
                        this.$Message.error('部门移动失败！')
                    }
                })
            } else {
                this.$Message.warning('此部门无法下移!')
            }
        }
    }
}
</script>

<style lang="stylus">
.ykt-suff-tree
    .bullet-box-item
        width 80px
        height 30px
        line-height 30px
        text-align center
        cursor pointer
        &:hover
            background #409eff
            color: #fff
</style>
