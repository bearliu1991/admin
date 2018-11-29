<template>
  <div class="wechatMenu">
    <!-- 预览窗 -->
    <div class="weixin-preview">
      <div class="weixin-hd">
        <div class="weixin-title">{{weixinTitle}}</div>
      </div>
      <div class="weixin-bd">
        <!-- <ul class="weixin-menu" id="weixin-menu">
          <li v-for="(btn, i) in menu.button" class="menu-item" :style="menuItemWidth" :key="i" :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1}" @click="selectedMenu(i,$event)">
            <div class="menu-item-title">
                <i class="icon_menu_dot" v-if="btn.sub_button.length>0"></i>
                <span>{{ btn.name }}</span>
            </div>
            <ul class="weixin-sub-menu" v-show="selectedMenuIndex===i">
              <li v-for="(sub, i2) in btn.sub_button" v-bind:key="i2" class="menu-sub-item" :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2}"  @click.stop="selectedSubMenu(i2,$event)">
                <div class="menu-item-title">
                    <span>{{sub.name}}</span>
                </div>
              </li>
              <li v-if="btn.sub_button.length<5" class="menu-sub-item" @click.stop="addMenu(2)">
                <div class="menu-item-title">
                    <i class="icon icon14_menu_add">&#xe623;</i>
                </div>
              </li>
              <i class="menu-arrow arrow_out"></i>
              <i class="menu-arrow arrow_in"></i>
            </ul>
          </li>
          <li class="menu-item" :style="menuItemWidth" v-if="menu.button.length<3" @click="addMenu(1)"> <i class="icon icon14_menu_add">&#xe623;</i></li>
        </ul> -->
        <!-- https://github.com/Jexordexan/vue-slicksort -->
        <SlickList axis="x" v-model="menu.button" class="weixin-menu" id="weixin-menu"
        @sort-start="sortStart" @sort-end="sortEnd"
        :transitionDuration="200" :pressDelay="1000" :distance="10" :pressThreshold="10" hideSortableGhost>
          <SlickItem v-for="(btn, i) in menu.button" :index="i" :key="i" class="menu-item" :style="menuItemWidth"  :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1&&!beginOrder}" @click.native="selectedMenu(i,$event)">
            <div class="menu-item-title">
                <i class="icon_menu_dot" v-if="btn.sub_button.length>0&&!beginOrder"></i>
                <i class="icon_menu_dot" v-if="beginOrder"></i>
                <span>{{ btn.name }}</span>
            </div>
            <ul class="weixin-sub-menu" v-if="selectedMenuIndex===i" :class="{unactive: clearBottom}">
              <li v-for="(sub, i2) in btn.sub_button" v-bind:key="i2" class="menu-sub-item" :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2&&!beginOrder}"  @click.stop="selectedSubMenu(i2,$event)">
                <div class="menu-item-title">
                    <i class="icon_menu_dot" v-if="beginOrder"></i>
                    <span>{{sub.name}}</span>
                </div>
              </li>
              <li v-if="btn.sub_button.length<5&&!beginOrder" class="menu-sub-item" @click.stop="addMenu(2)">
                <div class="menu-item-title">
                    <i class="icon icon14_menu_add">&#xe623;</i>
                </div>
              </li>
              <i class="menu-arrow arrow_out"></i>
              <i class="menu-arrow arrow_in"></i>
            </ul>
          </SlickItem>
          <li class="menu-item" :style="menuItemWidth" :class="{noMenu: menu.button.length === 0}" v-if="menu.button.length<3&&!beginOrder" @click="addMenu(1)"> <i class="icon icon14_menu_add">&#xe623;<span v-if="menu.button.length === 0" class="add-menu">添加菜单</span></i></li>
        </SlickList>
        <span class="keyboard">
          <span class="icon">&#xe84e;</span>
        </span>
      </div>
    </div>
    <div class="order-menu">
      <Button class="btn" type="ghost" v-if="menu.button.length>1&&!beginOrder" @click="menuOrder">菜单排序</Button>
      <div class="disable-btn" v-if="menu.button.length<=1">菜单排序</div>
      <Button class="btn" type="ghost" v-if="beginOrder" @click="doneOrder">完成</Button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import getMenuAPI from './test_menu'
import { SlickList, SlickItem } from 'vue-slicksort'
export default {
  name: 'wechatmenu',
  components: {
    SlickList,
    SlickItem
  },
  props: {
    menuParams: {
      default: () => {
        return {
          leave: 0,
          Level: 0
        }
      },
      type: Object
    }
  },
  data() {
    return {
      beginOrder: false,
      weixinTitle: '111',
      menu: getMenuAPI.data.menu, // 当前菜单
      selectedMenuIndex: '', // 当前选中菜单索引
      selectedSubMenuIndex: '', // 当前选中子菜单索引
      clearBottom: false,
      material: {
        title: '',
        url: '',
        thumb_url: ''
      },
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8'
      ]
    }
  },
  watch: {
    menuParams: {
      handler(val) {
        this.selectedMenuIndex = this.menuParams.selectedMenuIndex
        this.selectedSubMenuIndex = this.menuParams.selectedSubMenuIndex
      },
      deep: true
    }
  },
  mounted() {
    this.calcChecked(this.menu, 'sub_button')
  },
  computed: {
    menuItemWidth() {
      let len = (this.menu.button && this.menu.button.length) || 0
      let width
      if (len === 0) {
        width = 100
      } else if (len === 3 || this.beginOrder) {
        width = 100 / len
      } else {
        width = 100 / (len + 1)
      }
      return {
        width: `${width}%`
      }
    }
  },
  methods: {
    //添加菜单
    addMenu: function(level) {
      if (level == 1 && this.menu.button.length < 3) {
        this.menu.button.push({
          type: 'view',
          name: '菜单名称',
          sub_button: [],
          url: ''
        })
        this.selectedMenuIndex = this.menu.button.length - 1
        this.selectedSubMenuIndex = ''
        // 向主菜单传递事件
        this.menuParams.level = 1
        this.menuParams.menu = this.menu
        this.menuParams.selectedMenuIndex = this.selectedMenuIndex
        this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
      }
      if (
        level == 2 &&
        this.menu.button[this.selectedMenuIndex].sub_button.length < 5
      ) {
        this.menu.button[this.selectedMenuIndex].sub_button.push({
          type: 'view',
          name: '子菜单名称',
          url: ''
        })
        this.selectedSubMenuIndex =
          this.menu.button[this.selectedMenuIndex].sub_button.length - 1
        // 向主菜单传递事件
        this.menuParams.level = 2
        this.menuParams.menu = this.menu
        this.menuParams.selectedMenuIndex = this.selectedMenuIndex
        this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
      }
    },
    // 选中菜单级别
    selectedMenuLevel: function() {
      if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
        // 主菜单
        // this.menuParams.level = 1
        return 1
      } else if (
        
        this.selectedMenuIndex !== '' &&
        this.selectedSubMenuIndex !== ''
      ) {
        // this.menuParams.level = 2
        // 子菜单
        return 2
      } else {
        // this.menuParams.level = 0
        // 未选中任何菜单
        return 0
      }
    },
    // 选中主菜单
    selectedMenu: function(i, event) {
      if (this.beginOrder) {
        return
      }
      this.selectedSubMenuIndex = ''
      this.selectedMenuIndex = i
      var selectedMenu = this.menu.button[this.selectedMenuIndex]
      // 清空选中media_id 防止再次请求
      if (
        selectedMenu.media_id != undefined &&
        selectedMenu.media_id != '' &&
        this.selectedMenuType() == 2
      ) {
        // this.getMaterial(selectedMenu.media_id)
      }
      // 检查名称长度
      this.checkMenuName(selectedMenu.name)
      // 向主菜单传递事件
      this.menuParams.level = 1
      this.menuParams.menu = this.menu
      this.menuParams.selectedMenuIndex = this.selectedMenuIndex
      this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
      this.menuParams.aaa = 1
    },
    // 选中子菜单
    selectedSubMenu: function(i, event) {
      if (this.beginOrder) {
        return
      }
      this.selectedSubMenuIndex = i
      var selectedSubMenu = this.menu.button[this.selectedMenuIndex].sub_button[
        this.selectedSubMenuIndex
      ]
      if (
        selectedSubMenu.media_id != undefined &&
        selectedSubMenu != '' &&
        this.selectedMenuType() == 2
      ) {
        this.getMaterial(selectedSubMenu.media_id)
      }
      // 向主菜单传递事件
      this.menuParams.level = 2
      this.menuParams.menu = this.menu
      this.menuParams.selectedMenuIndex = this.selectedMenuIndex
      this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
      this.checkMenuName(selectedSubMenu.name)
    },
    // 检查菜单名称长度
    checkMenuName: function(val) {
      if (this.getMenuNameLen(val) === 0) {
        this.menuParams.menuNameBounds = 3
      } else if (this.selectedMenuLevel() == 1 && this.getMenuNameLen(val) <= 8) {
        this.menuParams.menuNameBounds = 1
      } else if (
        this.selectedMenuLevel() == 2 &&
        this.getMenuNameLen(val) <= 16
      ) {
        console.log(this.menuParams.menuNameBounds)
        this.menuParams.menuNameBounds = 1
      } else {
        console.log(this.menuParams.menuNameBounds)
        this.menuParams.menuNameBounds = 2
      }
    },
    // 获取菜单名称长度
    getMenuNameLen: function(val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1)
      }
      return len
    },
    // 拖动前触发
    sortStart(event, node, index, collection) {
      console.log('1')
      this.$set(this, 'selectedMenuIndex', '')
    },
    // 拖动结束时触发
    sortEnd(event, newIndex, oldIndex, collection) {
      console.log('2')
    },
    // 菜单排序
    menuOrder() {
      this.beginOrder = true
      this.menuParams.level = -1
      // 点击菜单排序后如果选中的子菜单length为0 则清除子菜单样式
      if (this.menu.button[this.selectedMenuIndex].sub_button.length === 0) {
        this.clearBottom = true
      } else {
        this.clearBottom = false
      }
      // this.selectedMenuIndex = ''
      // this.selectedSubMenuIndex = ''
      // this.menuParams.selectedMenuIndex = this.selectedMenuIndex
      // this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
    },
    doneOrder() {
      this.beginOrder = false
      this.clearBottom = false
      this.calcChecked(this.menu, 'sub_button')
    },
    calcChecked(obj, str) {
      if (obj.button.length > 0) {
        if (obj.button[0][str].length > 0) {
          this.menuParams.level = 2
          this.menuParams.menu = this.menu
          this.selectedMenuIndex = 0
          this.selectedSubMenuIndex = 0
          this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
        } else {
          this.menuParams.level = 1
          this.menuParams.menu = this.menu
          this.selectedMenuIndex = 0
          this.selectedSubMenuIndex = ''
          this.menuParams.selectedMenuIndex = this.selectedMenuIndex
          this.menuParams.selectedSubMenuIndex = this.selectedSubMenuIndex
        }
      }
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.wechatMenu
  width 100%
  height 100%
  .weixin-preview
    position relative
    height 620px
    border 1px solid #e7e7eb
    .weixin-hd
      position relative
      text-align center
      color #fff
      height 54px
      background transparent url('../../../../assets/images/tencent/menu_head.png') no-repeat 0 0
      .weixin-title
        position absolute
        bottom 10px
        width 100%
    .weixin-bd
      position absolute
      bottom 0
      left 0
      right 0
      height 56px
      border-top 1px solid #e7e7e7
      background-position 0 0
      background-repeat no-repeat
      padding-left 47px
      margin-bottom 0px
      .keyboard
        position absolute
        text-align center
        height 100%
        width 47px
        left 0
        top 0
        .icon
          font-size 30px
          display inline-block
          vertical-align middle
          line-height 56px
          color rgb(113, 117, 123)
      .weixin-menu
        position relative
        .icon14_menu_add
          color #cacbcc
        .menu-item-title
          width 100%
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          box-sizing border-box
          .icon_menu_dot
            background url('../../../../assets/images/tencent/index_z354723.png') 0px -36px no-repeat
            width 7px
            height 7px
            vertical-align middle
            display inline-block
            margin-right 2px
            margin-top -2px
        .menu-item
          position relative
          float left
          line-height 56px
          height 56px
          text-align center
          width 33.33%
          border-left 1px solid #e7e7e7
          cursor pointer
          color #616161
          &.noMenu
            border 1px solid #409fff
            .icon
              color #409fff
              .add-menu
                margin-left 10px
                color #409fff
          &.current
            border 1px solid #409fff
            background #fff
            color #409fff
            &:hover
              background #fff
              color #409fff
          &:hover
            color #000
          .weixin-sub-menu
            position absolute
            bottom 63px
            left 0
            right 0
            border-top 1px solid #d0d0d0
            margin-bottom 0px
            background #fafafa
            display block
            padding 0
            &.unactive
              display none
            &.show
              display block
            .menu-sub-item
              line-height 56px
              height 56px
              text-align center
              width 100%
              border 1px solid #d0d0d0
              border-top-width 0px
              cursor pointer
              position relative
              color #616161
              &.current
                border 1px solid #409fff
                background #fff
                color #409fff
                &:hover
                  background #fff
              &:hover
                background #eee
              .menu-item-title
                padding-left 5px
                padding-right 5px  
            .menu-arrow
              position absolute
              left 50%
              margin-left -6px
            .arrow_in
              bottom -4px
              display inline-block
              width 0px
              height 0px
              border-width 6px 6px 0px
              border-style solid dashed dashed
              border-color #fafafa transparent transparent
            .arrow_out
              bottom -5px
              display inline-block
              width 0px
              height 0px
              border-width 6px 6px 0px
              border-style solid dashed dashed
              border-color #d0d0d0 transparent transparent
  .order-menu
    margin-top 20px
    text-align center
    .btn
      width 110px
    .disable-btn
      display inline-block
      cursor not-allowed
      width: 110px
      height: 40px
      line-height 40px
      background-color: #e3e4e5
      border-radius: 3px
      border: solid 1px #e3e4e5
</style>
