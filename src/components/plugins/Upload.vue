/**
 *   limitSize:     // 单位： M
 *   uploadServer:  // 接受文件的服务器 node服务器
 *   uploadUrl:     // 上传接口
 *   overviewUrl:   // 读取图片接口
 *   uploadSucess:  // 上传成功事件
 *   uploadFail:    // 上传失败事件
 */
<template>
<div class="owly-upload">
    <Icon class="close-btn" v-if="isShowBigImg" @click="delImg" type="close-circled"></Icon>

    <div class="owly-upload-content">
        <div class="owly-upload-img" @click="showBigImg">
            <img v-if="blob" :src="blob" @click="showBigImg"/>
        </div>
        <input class="owly-upload-input" accept="image/*" type="file" ref="upload" id="owly-upload">
        <div class="owly-upload-img-left">
            <div class="owly-upload-info" v-if="!uploadErr">图片不大于{{limitSize}}M</div>
            <div class="owly-upload-info upload-error" v-else>上传失败，图片大小不能超过{{limitSize}}M</div>
            <FileUpload class="owly-upload-button"  v-if="ie9"
                :url="uploadServer"
                @ploadSuccess="ie9UploadSuccess" @uploadFail="ie9UploadFail"></FileUpload>
            <Button class="owly-upload-button" @click="selectFile" v-else>{{changeText}}</Button>
        </div>
    </div>
    <Modal
        class="big-img"
        v-model="modal"
        title="付款凭证"
        style="z-index: 10001;position: fixed;"
        width="800">
        <img width='100%' height="500" :src="blob" />
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>
import FileUpload from '@/components/webuploader/upload'
const ROOT = process.env.API_ROOT
export default {
  name: 'uploadfile',
  components: {
    FileUpload
  },
  props: {
    limitSize: {
      // 单位： M
      type: Number,
      default: 3
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
      fileId: '',
      blob: '',
      uploadErr: false,
      modal: false,
      changeText: '上传图片',
      isShowBigImg: false,
      ie9: this.ltIE10()
    }
  },
  methods: {
    selectFile() {
      let owlyUpload = document.getElementById('owly-upload')
      owlyUpload.addEventListener('change', () => {
        this.submit()
      })
      owlyUpload.click()
    },
    submit() {
      if (this.fileId) {
        // 跟换图片是删除之前的那张
        this.$get(this.deleteuploadfile, { fileId: this.fileId }).then(res => {
          console.log(res)
        })
      }
      let file = this.$refs['upload']
      let formData = new FormData()
      let uploadfile = file.files[0]
      if (uploadfile.size > this.limitSize * 1024 * 1024) {
        this.uploadErr = true
        return
      }
      if (!uploadfile) return
      formData.append('logo', uploadfile)
      this.$post(this.uploadUrl, formData)
        .then(res => {
          if (res.data.code === 1) {
            this.isShowBigImg = true
            this.fileId = res.data.data
            this.readImage(res.data.data)
            this.uploadSucess(res.data.data)
          } else {
            this.uploadFail(res.data)
          }
        })
        .catch(err => {
          this.uploadFail(err)
        })
    },
    showBigImg() {
      if (this.isShowBigImg) {
        this.modal = true
        this.blob && (this.modal = true)
      }
    },
    readImage(path) {
      this.$get(this.overviewUrl, {
        fileId: path
      }).then(res => {
        if (!res.data) {
          return
        }
        let path = res.data.base64
        this.blob = path
      })
    },
    delImg() {
      let file = this.$refs['upload']
      if (this.isIE()) {
        file.outerHTML = file.outerHTML
      } else {
        file.value = ''
      }
      this.isShowBigImg = false
      this.changeText = '上传图片'
      this.blob = ''
      this.$emit('uploadSucess', '')
      this.$get(this.deleteuploadfile, { fileId: this.fileId }).then(res => {
        console.log(res)
      })
    },
    uploadSucess(data) {
      this.changeText = '更换图片'
      this.$emit('uploadSucess', data)
    },
    uploadFail(data) {
      this.$emit('uploadFail', data)
    },
    ie9UploadSuccess(file, data) {
      this.readImage(data.data)
      this.$emit('uploadSucess', data.data)
    },
    ie9UploadFail(file) {
      this.$emit('uploadFail', file)
    }
  }
}
</script>

<style lang="stylus">
.owly-upload
  position relative
  .close-btn
    position absolute
    left 170px
    top -13px
    font-size 20px
    color #cacbcc
    border-radius 50%
    cursor pointer
  .owly-upload-content
    position relative
    overflow hidden
    .owly-upload-img
      width 178px
      height 100px
      overflow hidden
      float left
      cursor pointer
      border-radius 3px
      background-color #e3e4e6
      background-image url('../../../static/icon/bg-img.jpg')
      background-position center
      background-repeat no-repeat
      img
        width 100%
    .owly-upload-img-left
      float left
      height 100px
    .owly-upload-info
      font-size 12px
      padding 10px
      color #979899
    .upload-error
      color #f00
    .owly-upload-button
      margin-left 10px
      margin-top 34px
      width 70px
      height 28px
      padding 0
      background-color #409eff
      border-radius 3px
      color #fff
    .owly-upload-input
      display none
.big-img
  .ivu-modal-header
    border-bottom 0px solid #e3e8ee
  .ivu-modal-footer
    border-top 0px solid #e3e8ee
</style>
