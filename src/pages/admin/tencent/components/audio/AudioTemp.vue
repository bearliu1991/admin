<template>
    <div class="audioType">
      <div class="audio_wrap">
        <div class="tabel-cell wrap icon play" @click.stop="pause" v-show="isPlaying">&#xe714;</div>
        <div class="tabel-cell wrap icon pause" @click.stop="play" v-show="isPause">&#xe61c;</div>
        <div class="tabel-cell wrap icon end" @click.stop="play" v-show="isEnd">&#xe6f0;</div>

        <div class="tabel-cell discription">
          <p>{{audio.name}}</p>
          <span>{{audio.length}}</span>
        </div>

        <div class="tabel-cell user_detail">
          <i>{{audio.time}}</i>
        </div>
      </div>
      <audio ref="audio" :src="audio.source"></audio>
    </div>
</template>
<script>
export default {
  name: "audioType",
  data() {
      return {
          audioDom: null,
          isPlaying: false,
          isPause: false,
          isEnd: true
      }
  },
  props: {
    audio: {
      type: Object,
      default: () => { return {} }
    }
  },
  mounted() {
      let self = this
      this.audioDom = this.$refs.audio
      this.audioDom.addEventListener('ended', () => {
        self.isEnd = true
        self.isPlaying = false
        self.isPause = false
      })
  },
  methods: {
    endPlay() {
      this.isEnd = true
      this.isPause = false
      this.isPlaying = false
    },
    play() {
      this.isPlaying = true
      this.isPause = false
      this.isEnd = false
      this.audioDom.play()
    },
    pause() {
      this.isPause = true
      this.isPlaying = false
      this.isEnd = false
      this.audioDom.pause()
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~@/assets/stylus/index'
    .audioType
      cursor()
      relative()
      height 80px
      width: 100%
      padding 22px 30px
      audio
          display:none

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
          color(text_color)
          mr(10px)
          cursor()
        .user_detail
          width 200px
          text-align right
</style>
