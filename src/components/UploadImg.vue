<template>
  <div class="upload">
    <div class="container">
      <img :src="uploadSrc" alt="" class="img">
      <input v-if="isUpload" type="file" title=" " @change="getFile" ref="file" class="file-ipt">
    </div>
  </div>
</template>

<script>
export default {
  name: 'upload',
  props: {
    isUpload: {
      default: true,
      type: Boolean
    },
    idx: {
      default: 0,
      type: Number
    },
    imgSrc: {
      default: require('@/assets/images/wechat.png'),
      type: String
    }
  },
  data() {
    return {
      uploadSrc: this.imgSrc
    }
  },
  mounted() {
  },
  methods: {
    getFile(e) {
      let files = e.target.files[0]
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = () => {
        console.log(files.name)
        this.uploadSrc = reader.result
        let uploadSrc = reader.result.replace(/^.*?,/,'')
        console.log(uploadSrc)
        this.$emit('fileBoob', uploadSrc, files.name, this.idx)
      }
    }
  }
}
</script>

<style lang="stylus">
.upload
  display inline-block
  .container
    position relative
    width 60px
    height 60px
    .img
      width 100%
      height 100%
    .file-ipt
      cursor pointer
      position absolute
      opacity 0
      width 100%
      height 100%
      left 0
      top 0
</style>

