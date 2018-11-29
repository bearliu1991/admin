<template>
    <div class="video-temp">
      <div class="audio_wrap">
        <div class="tabel-cell wrap icon play" @click="play()">&#xe69d;</div>

        <div class="tabel-cell discription">
          <p>{{audio.name}}</p>
          <span>{{audio.length}}</span>
        </div>

        <div class="tabel-cell user_detail">
          <i>{{audio.time}}</i>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: "videoType",
  data() {
      return {
      }
  },
  props: {
    audio: {
      type: Object,
      default: () => { return {} }
    }
  },
  methods: {
    play() {
      // this.audio
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@/assets/stylus/index'
    .video-temp
      cursor()
      relative()
      height 80px
      width: 100%
      padding 22px 30px
      .audio_wrap
        display table-row
        &.active
          border:1px solid text_color
        .tabel-cell
          display table-cell
          vertical-align top
        .discription
          width 390px
          padding 0 10px
          p
            margin-bottom  10px
        .wrap
          margin:0 10px
          radius(50%)
          fn(36px)
          color(#ac8ce0)
          mr(10px)
          cursor()
        .user_detail
          width 200px
          text-align right
</style>
