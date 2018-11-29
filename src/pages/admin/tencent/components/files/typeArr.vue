<template>
  <div class="audioplayer">
    <div class="video_type">
      <AudioType :url="audio.source"></AudioType>
    </div>
  </div>
</template>
<script>
import AudioType from './AudioType'
  export default {
    name: 'audioplayer',
    components: {AudioType},
    data() {
        return {}
    },
    props: {
      audio: {
        type: Object,
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index.styl'
  .audioplayer
    padding 5px
    .video_type
      setBetween()
      .video_wrap
        setStart()
        &.active
          border:1px solid text_color
        video
          display:none
        .wrap
          margin:0 10px
          radius(50%)
          fn(20px)
          color(text_color)
          mr(10px)
          cursor()
    .user_detail
      mt(-20px)
</style>
