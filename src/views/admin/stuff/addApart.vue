<template>
    <div id="addApart">
        <ul v-if="isAdd">
            <li>
                <p>所属上级</p><span>{{apartName}}</span>
            </li>
            <li>
                <p>部门名称</p><Input class="input" v-model="inputVal" width="200px"/>
            </li>
        </ul>
        <div class="handles">
            <i-button type="primary" class="width_bg" @click="saveApart">保存</i-button>
            <i-button @click="handle('goback')">取消</i-button>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'addApart',
        data() {
            return {
                inputVal: ''
            }
        },
        computed: {
            ...mapGetters({
                currApart: "stuff/getCurrApart"
            }),
            apartName() {
                if (!this.currApart.parentLabel) {
                    return this.currApart.title
                }
                return this.isModifyApart ? this.currApart.parentLabel : this.currApart.title
            }
        },
        props: ['isAdd', 'isModifyApart'],
        created() {
            this.init()
        },
        components: {},
        methods: {
            init() {
                this.inputVal = this.isModifyApart ? this.currApart.title : ''
            },
            handle(key) {
                this._BUS.$emit('handle', key)
            },
            saveApart() {
                let key = this.currApart.id
                let parentId = this.currApart.parentId
                let param = !this.isModifyApart ? {
                    deptParentLink: key, 
                    name: this.inputVal, 
                    isSys: 0
                } : {
                    deptParentLink: parentId,
                    id: key, 
                    name: this.inputVal, 
                    isSys: 0,
                }
                this.addApart(param).then((res) => {
                    if (res.code === 1) {
                        this._BUS.$emit('getTreeData')
                        this.handle('goback')
                    }
                })
            }
        }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
    #addApart
        height:100%
        relative()
        ul
            li
                padding: 20px
                fn(16px)
                p
                    fl()
                    width:120px
                .input
                    fl()
                    width:300px
</style>
