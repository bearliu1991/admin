<template>
  <div class="picCard">
    <div class="img_type">
      <div class="img_wrap">
        <img :src="picture.src" >
      </div>
      <div class="img_span">{{picture.name}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'picCard',
    data() {
        return {}
    },
    props: {
      picture: {
        type: Object,
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index.styl'
  .picCard
    padding 5px
    .img_type
      text-align center
      .img_wrap
        position relative
        width: 209px;
        height: 129px;
        line-height 129px
        border-radius: 3px;
        img
          max-width: 100%
          max-height: 100%
          vertical-align: middle;
      .img_span
        padding 5px
        height 23px
</style>
