<template>
  <div class="wechatContent">
    <!-- 主菜单 -->
    <div class="weixin-menu-detail weixin-nodone" v-if="contentParams.level===0 || contentParams.level===-1">
      <div class="content-center" v-if="contentParams.level===0">
        点击左侧菜单进行编辑操作
      </div>
      <div class="content-center" v-if="contentParams.level===-1">
        请通过拖拽左边的菜单进行排序
      </div>
    </div>
    <!-- 主菜单 -->
    <div class="weixin-menu-detail" v-if="contentParams.level===1">
        <div class="menu-title">
            <div class="menu-name">{{contentParams.menu.button[contentParams.selectedMenuIndex].name}}</div>
            <div class="menu-del" @click="openDelModal">删除菜单</div>
        </div>
        <div class="menu-content">
          <div class="menu-input-group">
            <div class="menu-label">菜单名称</div>
            <div class="menu-input">
                <Input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="contentParams.menu.button[contentParams.selectedMenuIndex].name" @on-change="checkMenuName(contentParams.menu.button[contentParams.selectedMenuIndex].name)">
                </Input>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 2">字数超过上限</p>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 3">请输入菜单名称</p>
                <p class="menu-tips">字数不超过4个汉字或8个字母</p>
            </div>
          </div>
          <template v-if="contentParams.menu.button[contentParams.selectedMenuIndex].sub_button.length==0">
              <div class="menu-input-group">
                  <div class="menu-label">菜单内容</div>
                  <div class="menu-input menu-radio">
                    <RadioGroup v-model="menuType">
                      <Radio label="1">发送消息</Radio>
                      <Radio label="2">跳转网页</Radio>
                    </RadioGroup>
                  </div>
              </div>
              <div class="menu-content-type">
                <MenuContentType @sendType="setType"></MenuContentType>
              </div>
          </template>
        </div>
    </div>
    <!-- 子菜单 -->
    <div class="weixin-menu-detail" v-if="contentParams.level===2">
      <div class="menu-title">
          <div class="menu-name">{{contentParams.menu.button[contentParams.selectedMenuIndex].sub_button[contentParams.selectedSubMenuIndex].name}}</div>
          <div class="menu-del" @click="openDelModal">删除子菜单</div>
      </div>
      <div class="menu-content">
        <div class="menu-input-group">
            <div class="menu-label">子菜单名称</div>
            <div class="menu-input">
                <Input type="text" placeholder="请输入子菜单名称" class="menu-input-text" v-model="contentParams.menu.button[contentParams.selectedMenuIndex].sub_button[contentParams.selectedSubMenuIndex].name" @on-change="checkMenuName(contentParams.menu.button[contentParams.selectedMenuIndex].sub_button[contentParams.selectedSubMenuIndex].name)">
                </Input>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 2">字数超过上限</p>
                <p class="menu-tips" style="color: #f56c6c;" v-show="contentParams.menuNameBounds === 3">请输入子菜单名称</p>
                <p class="menu-tips">字数不超过8个汉字或16个字母</p>
            </div>
        </div>
        <div class="menu-input-group">
            <div class="menu-label">子菜单内容</div>
            <div class="menu-input menu-radio">
              <RadioGroup v-model="menuType">
                <Radio label="1">发送消息</Radio>
                <Radio label="2">跳转网页</Radio>
              </RadioGroup>
            </div>
        </div>
        <div class="menu-content-type">
          <MenuContentType @sendType="setType"></MenuContentType>
        </div>
      </div>
    </div>
    <div class="done-btn">
      <Button class="save-btn" type="primary" @click="saveAndIssue">保存并发布</Button>
      <Button class="watch-btn" type="ghost">预览</Button>
    </div>
    <NewModal v-model="delModal" header="删除菜单" content="删除后“菜单名称”菜单下设置的内容将被删除，确定删除菜单吗？" @ok="delOk"></NewModal>
    <NewModal v-model="saveModal" header="确认发布" content="发布成功后会覆盖原版本，且将在24小时内对所有用户生效，确认发布？" @ok="handle"></NewModal>
  </div>
</template>
<script>
/* eslint-disable */
import MenuContentType from './menuContentType'
export default {
  name: 'wechatContent',
  props: {
    contentParams: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  watch: {},
  data() {
    return {
      menuType: '1',
      delModal: false,
      saveModal: false,
      menuSelectType: ''
    }
  },
  mounted() {},
  methods: {
    setType(val) {
      console.log(val)
      this.menuSelectType = val
    },
    handle() {},
    openDelModal() {
      this.delModal = true
    },
    delOk() {
      this.delMenu()
    },
    saveAndIssue() {
      this.saveModal = true
    },
    // 删除菜单
    delMenu: function() {
      if (this.contentParams.level === 1) {
        if (this.contentParams.selectedMenuIndex === 0) {
          this.contentParams.menu.button.splice(
            this.contentParams.selectedMenuIndex,
            1
          )
          // this.contentParams.selectedMenuIndex = 0
        } else {
          this.contentParams.menu.button.splice(
            this.contentParams.selectedMenuIndex,
            1
          )
          // this.contentParams.selectedMenuIndex -= 1
        }
        if (this.contentParams.menu.button.length === 0) {
          // this.contentParams.selectedMenuIndex = ''
        }
        this.contentParams.selectedMenuIndex = ''
        this.contentParams.level = 0
      } else if (this.contentParams.level === 2) {
        if (this.contentParams.selectedSubMenuIndex === 0) {
          this.contentParams.menu.button[this.contentParams.selectedMenuIndex].sub_button.splice(this.contentParams.selectedSubMenuIndex, 1)
          // this.contentParams.selectedSubMenuIndex = 0
        } else {
          this.contentParams.menu.button[this.contentParams.selectedMenuIndex].sub_button.splice(this.contentParams.selectedSubMenuIndex, 1)
          // this.contentParams.selectedSubMenuIndex -= 1
        }
        if (
          this.contentParams.menu.button[this.contentParams.selectedMenuIndex]
            .sub_button.length === 0
        ) {
          // this.contentParams.selectedSubMenuIndex = ''
        }
        this.contentParams.selectedSubMenuIndex = ''
        this.contentParams.level = 0
      }
    },
    // 获取菜单类型 1. view网页类型，2. media_id类型和view_limited类型 3. click点击类型，4.miniprogram表示小程序类型
    selectedMenuType: function() {
      if (
        this.contentParams.level === 1 &&
        this.contentParams.menu.button[this.contentParams.selectedMenuIndex]
          .sub_button.length === 0
      ) {
        // 主菜单
        switch (this.contentParams.menu.button[this.contentParams.selectedMenuIndex].type) {
          case 'view':
            return 1
          case 'media_id':
            return 2
          case 'view_limited':
            return 2
          case 'click':
            return 3
          case 'scancode_push':
            return 3
          case 'scancode_waitmsg':
            return 3
          case 'pic_sysphoto':
            return 3
          case 'pic_photo_or_album':
            return 3
          case 'pic_weixin':
            return 3
          case 'location_select':
            return 3
          case 'miniprogram':
            return 4
        }
      } else if (this.contentParams.level === 2) {
        // 子菜单
        switch (this.contentParams.menu.button[this.contentParams.selectedMenuIndex].sub_button[this.contentParams.selectedSubMenuIndex].type) {
          case 'view':
            return 1
          case 'media_id':
            return 2
          case 'view_limited':
            return 2
          case 'click':
            return 3
          case 'scancode_push':
            return 3
          case 'scancode_waitmsg':
            return 3
          case 'pic_sysphoto':
            return 3
          case 'pic_photo_or_album':
            return 3
          case 'pic_weixin':
            return 3
          case 'location_select':
            return 3
          case 'miniprogram':
            return 4
        }
      } else {
        return 1
      }
    },
    // 检查菜单名称长度
    checkMenuName: function(val) {
      if (this.getMenuNameLen(val) === 0) {
        this.contentParams.menuNameBounds = 3
      } else if (
        this.contentParams.level === 1 &&
        this.getMenuNameLen(val) <= 8
      ) {
        this.contentParams.menuNameBounds = 1
      } else if (
        this.contentParams.level === 2 &&
        this.getMenuNameLen(val) <= 16
      ) {
        this.contentParams.menuNameBounds = 1
      } else {
        this.contentParams.menuNameBounds = 2
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
    }
  },
  components: {
    MenuContentType
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.wechatContent
  position relative
  .weixin-menu-detail
    height 620px
    border solid 1px #e3e4e5
    position relative
    &.weixin-nodone
      border none
      .content-center
        position absolute
        left 50%
        top 50%
        color #979899
        transform translate(-50%, -50%)
    .menu-title
      clear()
      height 50px
      line-height 50px
      border-bottom solid 1px #e3e4e5
      .menu-name
        float left
        margin-left 20px
      .menu-del
        color #409fff
        float right
        margin-right 20px
        cursor pointer
    .menu-content
      padding 30px 30px 0
      .menu-input-group
        clear()
        &:nth-of-type(1)
          margin-bottom 27px
        .menu-label
          line-height 40px
          float left
        .menu-radio
          line-height 38px
        .menu-input
          margin-left 30px
          float left
          .menu-tips
            margin-top 10px
            color #979899
            font-size 12px
  .done-btn
    margin-top 20px
    text-align center
    .save-btn
      width 170px
    .watch-btn
      margin-left 60px
      width 110px
</style>
