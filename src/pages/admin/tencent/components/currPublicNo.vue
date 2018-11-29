<template>
  <div id="public-no">
    <Dropdown trigger="click" :transfer="false" @on-click="getcurrent" >
      <div class="public-no" :class="{zhengchang: currentPublicNo.status == 1, jingyong: currentPublicNo.status == 2}">
        <div class="item">
          <img :src="currentPublicNo.logo" alt="">
        </div>
        <div class="item">
          <span class="name">{{currentPublicNo.name}}</span>
          <span class="badge"></span>
        </div>
        <div class="item btn" >
          <span class="icon">&#xe7d6;</span>
        </div>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem class="drop-down-item" v-for="(item, index) in publicList" :name="index" :key="index" :disabled="item.status == 2">
          <div class="public-no" :class="{zhengchang: item.status == 1, jingyong: item.status == 2}">
            <div class="item">
              <img :src="item.logo" alt="">
            </div>
            <div class="item">
              <span class="name">{{item.name}}</span>
              <span class="badge"></span>
            </div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>

</template>
<script>

export default {
  name: 'currentPublicNumbuer',
  data() {
    return {
      currentPublicNo: {},
      classList: {
        1: "zhengchang",
        2: "jingyong"
      },
      publicList: [
        {logo: 'http://xingke100.com/logo.png', name: '正点财经', status: 1},
        {logo: 'http://xingke100.com/logo.png', name: '正点财经正点财经正点财经正点财经', status: 1},
        {logo: 'http://xingke100.com/logo.png', name: '正点财经正点财经正', status: 1},
        {logo: 'http://xingke100.com/logo.png', name: '正点财经正点财经', status: 1},
        {logo: 'http://xingke100.com/logo.png', name: '正点财经3', status: 2}
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.currentPublicNo = this.publicList[0]
    },
    getcurrent(name) {
      this.currentPublicNo = this.publicList[name]
      this.$emit('update', this.currentPublicNo)
    }
  }
}
</script>
<style lang="stylus">
#public-no
  .drop-down-item:hover
    background #f2f4f5 !important
  .ivu-select-dropdown
    left: 3px !important
  .public-no
    display table-row
  .item
    vertical-align: top;
    padding-right 10px
    display table-cell
    height 24px
    line-height 24px
    .name
      height 24px
      line-height 24px
      display inline-block
      max-width 114px
      font-size 14px
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
  .btn
    padding-left 5px
  img
    width: 24px;
    height: 24px;
    border-radius: 3px;
  .zhengchang
    display inline-block
    color #303133
  .jingyong
    display inline-block
    color #979899
  .zhengchang .badge, .jingyong .badge
      position relative
      top: -7px;
      display inline-block
      height 16px
      line-height 16px
      width 32px
      text-align center
      border-radius 3px
      font-size 10px
      color #ffffff
      background #329800
      &:after
        display inline-block
        transform scale(0.8)
        content '正常'
  .jingyong
    .badge
      background #b1b2b3
      &:after
        content '禁用'
</style>
