<template>
  <div class="banner">
    <carousel :slides="slides" :inv="invTime"></carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      invTime: 4000,
      slides: [
        {
          src: require('@/assets/images/1.jpg'),
          title: 'xxx1'
        },
        {
          src: require('@/assets/images/2.jpg'),
          title: 'xxx2'
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
.banner
  height 500px
  overflow hidden
  img
    width 100%
</style>
