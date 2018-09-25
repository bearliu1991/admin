<template>
    <ul class="owly-tree-content">
        <li class="owly-parent-node"
            v-for="(item, index) in CTreeData" :key="index" v-if="item"
            :class="{'owly-node-has-border': item[children] && !noBorder,
                    'owly-last-node': CTreeData.length <= (index + 1),
                    'owly-tree-root': root,
                    'owly-no-child': !item[children]
                    }">
            <div @hover="handleHover" @click.stop="getCurrentNode(item, index, 'true')" class="owly-title"
                :class="{
                    'owly-select': index === currNodeIndex,                
                    'owly-select': item.selected
                    }">
                     <!-- 'owly-select': index === currNodeIndex, -->
                <span v-if="item[children] && item[children].length"
                    class="display-children-node" 
                    :class="{'owly-child-node-opened' : item.expand}"
                    @click.stop="showChildrenNode(item, index)"></span>

                <span v-else class="no-child-node" 
                :style="{'width': sparkLine.width+'px',
                        'height': sparkLine.height+'px',
                        'top': sparkLine.top+'px',
                        'left': sparkLine.left+'px',
                        }"></span>

                <span class="owly-title-text">{{item[title]}}
                    <span v-if="!noTag">({{item[number]}})</span>
                </span>

                <div v-if="!noOperation" class="owly-operation">
                    <Poptip placement="right-start" width="94" trigger="click"  @mouseleave.native="closePoptip" >
                        <Icon type="android-more-vertical"></Icon>
                        <div slot="content">
                           <div class="owly-operation-item"
                            v-for="(_item, _index) in operations" :key="_index"
                           @click.stop="operation(item, index, _item.type)">{{_item.title}}</div>
                        </div>
                    </Poptip>                
                </div>
                <div class="owly-title-bg" :style="{width: initWidth+'px'}"></div>
            </div>
            <ul v-show="item.expand" v-if="item[children]" class="owly-child-node">
                <TreeList
                :treeData="item[children]"
                @select="getCurrentNode" 
                :noBorder="noBorder"
                :noOperation="noOperation"
                :operations="operations"
                :width="initWidth"
                :allTree="treeData"
                :sparkLine="sparkLine"></TreeList>
            </ul>            
        </li>
    </ul>   
</template>

<script>
export default {
  components: {
    TreeList: () => import('./treelist.vue')
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    root: {
      type: Boolean,
      default: false
    },
    noOperation: {
      type: Boolean,
      default: false
    },
    noTag: {
      type: Boolean,
      default: false
    },
    operations: {
      type: Array,
      default() {
        return []
      }
    },
    children: {
      type: String,
      default: 'children'
    },
    title: {
      type: String,
      default: 'title'
    },
    number: {
      type: String,
      default: 'number'
    },
    width: {
      type: Number,
      default() {
        return 0
      }
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    sparkLine: {
      type: Object,
      default() {
        return { width: 17, height: 27, left: -6 }
      }
    },
    allTree: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currNode: this.treeData[0],
      showChildren: false,
      currNodeIndex: 0,
      showTitleBg: 'none',
      initWidth: this.width,
      refName: null
    }
  },
  computed: {
    CTreeData() {
      console.error(this.treeData)
      let arr = this.deepCopy(this.treeData)
      if (this.root) {
        // this.currNodeIndex = 0
        if (this.treeData && this.treeData.length) {
          arr[0].selected = true
        }
        // this.$set(this.treeData[0], 'selected', true)
      }
      console.error(arr)
      return arr
    }
  },
  created() {},
  mounted() {
    if (!this.initWidth) {
      this.initWidth = document
        .querySelector('.owly-tree-content')
        .getBoundingClientRect().width
    }
  },
  methods: {
    init() {
      if (this.root) {
        this.currNodeIndex = 0
        this.$set(this.treeData[0], 'selected', true)
      }
    },
    selectedNode(arr) {
      arr.forEach(item => {
        this.$set(item, 'selected', false)
        if (Array.isArray(item[this.children])) {
          this.selectedNode(item.children)
        }
      })
    },
    getCurrentNode(item, index, flag) {
      if (flag === 'true') {
        if (this.root) {
          this.selectedNode(this.treeData)
        } else {
          this.selectedNode(this.allTree)
        }
        this.$set(item, 'selected', true)
      }
      this.$emit('select', item, index)
    },
    showChildrenNode(item, index) {
      console.error(item, index)
      this.$set(item, 'expand', true)
      this.showChildren = !this.showChildren
    },
    handleHover() {},
    closePoptip() {
      this.bodyClick()
    },
    operation(item, index, type) {
      let param = {
        currentNode: item,
        currentIndex: index,
        parentNode: this.currNode
      }
      this.$emit('select', param, type)
      this.bodyClick()
    }
  }
}
</script>

<style lang="stylus">
owly-tree-title-height = 40px
owly-border-before-left = 9px
owly-title-before-left = -25px
owly-title-before-top = 11px
owly-title-after-left = -21px
owly-title-after-top = 18px
owly-nochild-before-left = -29px
owly-nochild-before-top = -6px
owly-parent-node-bg = #ffffff
hover-color = #409eff
selected-color = #409eff
line-color = #d8dfe6
.owly-parent-node
    padding-left 30px
    font-size 14px
    background-color owly-parent-node-bg
.owly-no-child
    padding-left 20px
.owly-current-node, .owly-node-has-border
    position relative
.owly-title
    position relative
    z-index 11
    height owly-tree-title-height
    line-height owly-tree-title-height
    .owly-title-bg
        display none
        position absolute
        top 0
        right 0
        z-index -1
        cursor pointer
        height owly-tree-title-height
        width 999px
    .owly-title-text
        display inline-block
    .owly-operation
        display none
        position absolute
        right 10px
        top 0
        font-size 24px
        cursor pointer
        .owly-operation-item
            height 30px
            line-height 30px
            text-align center
            color #222
            &:hover
                color #fff
                background-color hover-color
.owly-title:hover
    color #ffffff
    .owly-title-bg
        display block
        background hover-color
    .owly-operation
        display block
.owly-select
    color #ffffff
    .owly-title-bg
        display block
        background selected-color
.owly-node-has-border:before
    display block
    position absolute
    left owly-border-before-left
    top -10px
    z-index 10
    width 1px
    height 100%
    content ''
    border-left 1px solid line-color
.owly-last-node:before
    height 24px
.owly-tree-root:before
    border-left 1px solid rgba(0, 0, 0, 0)
.display-children-node
    color rgba(0, 0, 0, 0)
    cursor pointer
    &:before
        display block
        position absolute
        left owly-title-before-left
        top owly-title-before-top
        width 16px
        height 16px
        content ''
        background url('./plus.png') no-repeat
        background-position 2px 1px
        background-color owly-parent-node-bg
        z-index 20
    &:after
        display block
        position absolute
        content ''
        width 20px
        height 1px
        left owly-title-after-left
        top owly-title-after-top
        border-top 1px solid line-color
        z-index 10
.owly-select .display-children-node:before
    background-color selected-color !important
.owly-title:hover .display-children-node:before
    background-color hover-color !important
.owly-child-node-opened.display-children-node:before
    background url('./minus.png') no-repeat
    background-position 2px 1px
    background-color owly-parent-node-bg
.no-child-node
    display block
    position absolute
    z-index 10
    left owly-nochild-before-left
    top owly-nochild-before-top
    width 17px
    height 27px
    content ''
    border 1px solid line-color
    border-top none
    border-right none
.owly-tree-root.owly-no-child
    padding-left 30px
    .no-child-node
        display block
        position absolute
        z-index 10
        left owly-nochild-before-left
        top owly-nochild-before-top
        width 17px
        height 27px
        content ''
        border-bottom 1px solid line-color
.owly-operation .ivu-poptip-body
    padding 8px 0px !important
</style>
