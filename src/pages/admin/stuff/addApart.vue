<template>
    <div id="addApart">
        <ul v-if="isAdd">
            <li>
                <p>所属上级</p><span>{{apartName}}</span>
            </li>
            <li>
                <p>部门名称</p><Input class="input" :class="{'error': inputErr}" v-model="inputVal" width="200px"/>
                <i class="err_color" v-show="inputErr">部门名称不能为空且不能超过40个字符</i>
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
                inputVal: '',
                inputErr: false
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
          dealInput() {
              if (!this.inputVal || this.inputVal.length > 40) {
                  this.inputErr = true
                  return false
              }
              return this.inputVal
          },
          saveApart() {
              let key = this.currApart.id
              let parentId = this.currApart.parentId
              let inputCont = this.dealInput()
              if (!inputCont) return false
              let param = !this.isModifyApart ? {
                  deptParentLink: key, 
                  name: inputCont, 
                  isSys: 0
              } : {
                  deptParentLink: parentId,
                  id: key, 
                  name: inputCont, 
                  isSys: 0,
              }
              this.addApart(param).then((res) => {
                  if (res.code === 1) {
                      this._BUS.$emit('addAparts', this.inputVal, res.data.id, this.isModifyApart)
                      this.handle('goback')
                  } else {
                      this.$Message.error(res.message)
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
        relative()
        padt(30px)
        fn(16px)
        p
          fl()
          width:120px
        i
          absolute()
          top:62px
          left: 140px
          fn(12px)
        .input
          fl()
          mt(-10px)
          width:300px
          &.error
            input
              border-color:err_color
</style>
