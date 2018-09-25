<template>
  <div id="createCompany">
    <div class="title">创建新企业</div>
    <div class="form">
      <third-step type="go-on"></third-step>
    </div>
  </div>
</template>

<script>
import thirdStep from '@/views/register/thirdStep'
export default {
  components: {
    thirdStep
  }
}
</script>

<style lang="stylus">
#createCompany
  padding 42px 43px 20px 43px
  .title
    font-size 20px
  .form
    margin-top 75px  
</style>


