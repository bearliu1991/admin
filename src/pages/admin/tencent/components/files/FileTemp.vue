<template>
    <div class="file-temp">
      <div class="file_wrap" v-if="file.name">
        <div class="tabel-cell wrap play" @click="play()">
          <!-- ppt -->
          <i class="icon" style="color: #ff8939" v-if="file.name.includes('.ppt')">&#xe763;</i>
          <!-- word -->
          <i class="icon" style="color: #2c96ff" v-else-if="file.name.includes('.doc')">&#xe764;</i>
          <!-- pdf -->
          <i class="icon" style="color: #fd5754" v-else-if="file.name.includes('.pdf')">&#xe766;</i>
          <!-- zip -->
          <i class="icon" style="color: #4856ff" v-else-if="file.name.includes('.zip')">&#xe768;</i>
          <!-- 未知格式 -->
          <i class="icon" style="color: " v-else>&#xeaac;</i>
        </div>

        <div class="tabel-cell discription">
          <p>{{file.name}}</p>
          <span>{{file.size}}</span>
        </div>

        <div class="tabel-cell user_detail">
          <i>{{file.time}}</i>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'videoType',
  data() {
      return {}
  },
  props: {
    file: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    play() {
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
.file-temp
  cursor()
  relative()
  height 80px
  width 100%
  padding 22px 30px
  .file_wrap
    display table-row
    &.active
      border 1px solid text_color
    .tabel-cell
      display table-cell
      vertical-align top
    .discription
      width 390px
      padding 0 10px
      p
        margin-bottom 10px
    .wrap
      margin 0 10px
      radius(50%)
      color(#ac8ce0)
      mr(10px)
      cursor()
      i
        fn(36px)
    .user_detail
      width 200px
      text-align right
      color #979899
</style>
