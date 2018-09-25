<template>
  <div class="common-modal">
    <Modal v-model="modal" @on-cancel="close" :styles="{top: '50%', marginTop: '-8%'}">
      <p slot="header">
        <span>{{header}}</span>
      </p>
      <div>
        <p>{{content}}</p>
      </div>
      <div slot="footer" v-show="showFooter">
        <Button type="primary" @click.stop="ok">{{confrim}}</Button>
        <Button type="ghost" @click.stop="cancal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    confrim: {
      type: String,
      default: '确定'
    },
    content: {
      type: String,
      default: '确定要删除么？'
    },
    header: {
      type: String,
      default: '解绑企业'
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      modal: false
    }
  },
  methods: {
    showModal() {
      this.modal = true
    },
    cancal() {
      this.modal = false
      this.$emit('cancal')
    },
    ok() {
      this.modal = false
      this.$emit('ok')
    },
    close() {
      this.modal = false
      this.$emit('cancal')
    }
  }
}
</script>

<style lang="stylus">
</style>


