<template>
  <div class="upload">
    <div class="container" ref="upLoadImg">
      <img :src="uploadSrc" alt="" class="img" v-if="!isIframe">
      <div class="img" v-html="htmlStr" v-if="isIframe"></div>
      <input v-if="isUpload" type="file" title=" " accept="image/*" @change="getFile" ref="file" class="file-ipt">
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
      default: '',
      type: String
    },
    fileType: {
      default: 'image',
      type: String
    }
  },
  data() {
    return {
      isIframe: true,
      htmlStr: '',
      uploadSrc: this.imgSrc
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showImg(this.uploadSrc)
    })
  },
  methods: {
    showImg(url) {
      var frameid = 'frameimg' + Math.random()
      window.img = '<img id="img" style="width:60px;height:60px;position:relative;left:-8px;top:-8px;" src=\'' + url + '?' + Math.random() + '\' /><script>window.onload = function() { parent.document.getElementById(\'' + frameid + '\').height = 60+\'px\';}<' + '/script>'
      this.htmlStr = ('<iframe id="' + frameid + '" src="javascript:parent.img;" frameBorder="0" scrolling="no" width="60px" height="60px"></iframe>')
    },
    getFile(e) {
      let files = e.target.files[0]
      if (files.type && files.type.indexOf(this.fileType) < 0) {
        this.$emit('errorFileType')
        this.$Message.error('请上传正确的图片格式')
        return false
      }
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = () => {
        this.isIframe = false
        this.uploadSrc = reader.result
        let uploadSrc = reader.result.replace(/^.*?,/,'')
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

