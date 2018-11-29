<template>
  <div>
    <PublicNo></PublicNo>
    <div id="material">
      <button @click="click">asdfas</button>
      <pictures v-model="picturesShow"></pictures>

    </div>
  </div>
</template>
<script>
import PublicNo from '../components/currPublicNo'
// import pictures from '../components/graphic/'
// import pictures from '../components/pictures/'
// import pictures from '../components/audio/'
// import pictures from '../components/video/'
import pictures from '../components/files/'




export default {
  name: 'meterial',
  components: {
    PublicNo,
    pictures
  },
  data() {
    return {
      picturesShow: true
    }
  },
  methods: {
    click() {
      this.picturesShow = true
    }
  }
}
</script>
<style lang="stylus">
#material
  margin-top 10px
  background-color #ffffff
  border-radius 3px
</style>
