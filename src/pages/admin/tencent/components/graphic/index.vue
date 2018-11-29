<template>
  <div id="graphic" v-if="graphicShow">
    <modelFrame>
      <template slot="header">
        <span class="title">选择图文</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>
      <template slot="label">
        <li :class="{active: index === 0}" v-for="(label, index) in labelList" :key="index">
            {{label.label}}({{label.number}})
        </li>
      </template>
      <template slot="action">
        <Button class="upload" size="small" type="primary">上传图文</Button>
      </template>
      <template slot="main">
        <linkList @on-change="getPicText"></linkList>
      </template>
      <template slot="footer">
        <Button size="small" type="primary" @click="submit">确定</Button>
        <Button class="cancel" size="small" @click="cancel">取消</Button>
      </template>
    </modelFrame>
  </div>
</template>
<script>
import modelFrame from '../modelFrame/index'
import searchinput from './searchInput'
import linkList from './linkList'
  export default {
    name: 'graphic',
    components: {
      modelFrame,
      searchinput,
      linkList
    },
    model: {
      prop: "graphicShow",
      event: "close"
    },
    props: ['graphicShow'],
    data() {
      return {
        graphic: {},
        labelList: [
          {label: "全部", number: 20},
          {label: "人文2", number: 20},
          {label: "我是图文分组名称", number: 20},
          {label: "节日", number: 20},
        ]
      }
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      submit() {
        this.$emit('submit', this.graphic)
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
        // 得到选中的图文
        this.graphic = picText
        console.log(picText)
      }
    }
  }
</script>
<style lang="stylus">
@import "~@/assets/stylus/index.styl"
#graphic
  width: 885px;
  height: 740px;
  background-color: #ffffff;
  box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: solid 1px #cacbcc;
  padding 20px
  css3Middle()
</style>

