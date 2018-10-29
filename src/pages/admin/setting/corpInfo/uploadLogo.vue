<template>
  <div class="uploadLogo">
    <div class="owly-upload-img" :class="{isUpload: isUpload}">
      <img class="img" v-if="blob" :src="blob"/>
      <div class="upload-again" @click="selectFile">重新上传</div>
    </div>
    <input v-if="isUpload" ref="upload" class="owly-upload-input" @change="getFile" title=" " accept="image/*" type="file">
    <FileUpload v-if="ie9" class="ie9-upload-button"
                :url="uploadServer"
                @uploadSuccess="ie9UploadSuccess" @uploadFail="ie9UploadFail"></FileUpload>
  </div>
</template>
<script>
import FileUpload from './upload'
const ROOT = process.env.API_ROOT
export default {
  name: 'uploadLogo',
  props: {
    limitSize: {
      // 单位： M
      type: Number,
      default: 3
    },
    isUpload: {
      default: true,
      type: Boolean
    },
    imgSrc: {
      default: '',
      type: String
    },
    uploadServer: {
      // 接受文件的服务器 node
      type: String,
      default: ROOT
    },
    uploadUrl: {
      // 上传接口
      type: String,
      default: ROOT + '/upload'
    },
    overviewUrl: {
      // 读取接口
      type: String,
      default: ROOT + '/overview'
    }
  },
  data() {
    return {
      defaultBlob: this.imgSrc || 'http://xingke100.com/logo.png',
      blob: '',
      fileId: this.imgSrc || '',
      ie9: this.ltIE10()
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.defaultBlob && this.defaultBlob !== 'http://xingke100.com/logo.png') {
        this.readImage(this.defaultBlob)
      } else {
        this.blob = 'http://xingke100.com/logo.png'
      }
    })
  },
  methods: {
    selectFile() {
      let owlyUpload = this.$refs.upload
      owlyUpload.click()
    },
    getFile(e) {
      // if (this.fileId) {
      //   // 跟换图片是删除之前的那张
      //   this.$get(this.deleteuploadfile, { fileId: this.fileId }).then(res => {
      //     console.log(res)
      //   })
      // }
      let uploadfile = e.target.files[0]
      let formData = new FormData()
      if (uploadfile.size > this.limitSize * 1024 * 1024) {
        this.$Message.warning(`文件大小不能超过${this.limitSize}M`)
        return
      }
      if (!uploadfile) return
      formData.append('logo', uploadfile)
      this.$post(this.uploadUrl, formData)
        .then(res => {
          if (res.data.code === 1) {
            this.fileId = res.data.data
            let obj = {
              logo: res.data.data
            }
            this.$get(this.fylPath.updateCorpLogo, obj).then(data => {
              if (data.code === 1) {
                this.readImage(res.data.data)
                this.uploadSucess(res.data.data)
              } else {
                this.uploadFail(data.message)
              }
            })
          } else {
            this.uploadFail(res.data)
          }
        })
        .catch(err => {
          this.uploadFail(err)
        })
    },
    readImage(path) {
      // this.$get(this.overviewUrl, {
      //   fileId: path
      // }).then(res => {
      //   if (!res.data) {
      //     return
      //   }
      //   let path = res.data.base64
      //   this.blob = path
      // })
      this.blob = this.getUploadUrl + path
    },
    uploadSucess(data) {
      this.$emit('uploadSucess', data)
    },
    uploadFail(data) {
      this.$emit('uploadFail', data)
    },
    ie9UploadSuccess(file, data) {
      let obj = {
        logo: data.data
      }
      this.$get(this.fylPath.updateCorpLogo, obj).then(res => {
        if (res.code === 1) {
          this.readImage(data.data)
          this.uploadSucess(data.data)
        } else {
          this.uploadFail(data.message)
        }
      })
    },
    ie9UploadFail(file) {
      this.$emit('uploadFail', file)
    }
  },
  components: {
    FileUpload
  }
}
</script>
<style lang="stylus">
.uploadLogo
  width 100%
  height 100%
  cursor pointer
  position relative
  .isUpload:hover
    .upload-again
      opacity 1
  .owly-upload-img
    width 100%
    height 100%
    position relative
    .img
      width 100%
      height 100%
    .upload-again
      position absolute
      transition all 0.2s
      width 100%
      height 100%
      left 0
      top 0
      text-align center
      line-height 60px
      opacity 0
      background-color rgba(0, 0, 0, 0.3)
      border-radius 3px
      color #ffffff
      font-size 12px
  .owly-upload-input
    display none
  .ie9-upload-button
    position absolute
    width 100%
    height 100%
    left 0
    top 0
</style>


