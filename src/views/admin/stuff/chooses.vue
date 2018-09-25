<template>
  <div id="chooses">
    <div class="choose_all">选择项目</div>
    <ul>
        <li v-for="(item, idx) in Columns" v-if="item.title" :key="idx">
            <Checkbox v-model="item.show"  @on-change="setting"></Checkbox>{{item.title}}
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Columns: []
    }
  },
  props: {
    columns: {
      default: () => { return [] },
      type: Array
    }
  },
  created() {
    this.Columns = this.columns.slice()
  },
  methods: {
    setting() {
      // 配置要列选项
      let arr = []
      this.Columns.forEach((item, index) => {
        item.show && arr.push(item)
      })
      this._BUS.$emit('setColumn', arr)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/index'

#chooses
  height 100%
  width 100%
  ul
    li
      margin:10px 0
      label
        fn(12px)
        mr(5px)
</style>
