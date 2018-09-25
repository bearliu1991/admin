<template>
  <div id="we_code">
    <div class="slot_p">
        <slot></slot>
    </div>
    <div class='code_part' id="postcard">
        <div class="left_p">
            <div>
                <h3>{{datas.nickname}}</h3>
                <p>{{corInfo.corpName}}</p>
            </div>
            <ul>
                <li>
                    <p>手机号码</p>
                    <span>{{datas.mobile}}</span>
                </li>
                <li>
                    <p>所属部门</p>
                    <span>{{curApart.title}}</span>
                </li>
                <li>
                    <p>职务</p>
                    <span>{{datas.postName}}</span>
                </li>
                <li>
                    <p>坐席</p>
                    <span>{{datas.seatNo}}</span>
                </li>
            </ul>
        </div>
        <div class="right_p">
            <div class="img">
                <img :src="datas.url" />
            </div>
            <p>微信扫码加入企业</p>
        </div>
    </div>
    <Button class="save_btn" @click="createImg">保存到本地</Button>
    <!-- <div id="hello" style="float:left; width:98%;height:240px;border:1px solid red"></div> -->
  </div>
</template>

<script>
import axios from 'axios'
import {mapGetters} from 'vuex'
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      curId: 0,
      curCompo: '',
      ext: '',
      form: ''
    }
  },
  computed: {
      ...mapGetters({
        'corInfo': 'survey/getLoginCompany'
      })
  },
  props: ['datas', 'curApart'],
  created() {},
  methods: {
    createImg() {
        html2canvas(document.querySelector("#postcard")).then(canvas => {
            // document.querySelector("#hello").appendChild(canvas)
            const dataURL = canvas.toDataURL("image/" + this.ext)
            this.createForm(dataURL)
            this.submit()
        })
    },
    // createBase64(){
    //     var img = "https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=9e71881537f33a87816d061af65c1018/8d5494eef01f3a2966bddeeb9425bc315c607c99.jpg";//imgurl 就是你的图片路径  

    //     const getBase64Image = (img) =>{  
    //         var canvas = document.createElement("canvas");
    //         canvas.width = 200;  
    //         canvas.height = 200;  
    //         var ctx = canvas.getContext("2d");  
    //             ctx.drawImage(img, 0, 0, 200, 200);  
    //         this.ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
    //         var dataURL = canvas.toDataURL("image/"+ this.ext);
    //         return dataURL;  
    //     }

    //     var image = new Image();
    //     image.crossOrigin = "Anonymous";
    //     image.onload = () => {
    //         var base64 = getBase64Image(image);
    //         document.querySelector("#hello-img").setAttribute('src', base64)
    //     }
    //     image.src = img;
    // },
    // createbase64forIE() {
    //     var url = "https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=9e71881537f33a87816d061af65c1018/8d5494eef01f3a2966bddeeb9425bc315c607c99.jpg";//imgurl 就是你的图片路径  

    //     var self = this;
    //     const getBase64Image = (img) =>{  
    //         var canvas = document.createElement("canvas");
    //         canvas.width = img.width;  
    //         canvas.height = img.height;  
    //         var ctx = canvas.getContext("2d");  
    //             ctx.drawImage(img, 0, 0, img.width, img.height);  
    //         this.ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
    //         var dataURL = canvas.toDataURL("image/"+ this.ext);
    //         return dataURL;
    //     }

    //     var xhr = new XMLHttpRequest();
    //     xhr.onload = function () {
    //         var url = URL.createObjectURL(this.response), img = new Image();
    //         img.onload = function () {
    //             // here you can use img for drawing to canvas and handling
    //             var base64 = getBase64Image(img);
    //             document.querySelector("#postcard-img").setAttribute('src', base64)
    //             // don't forget to free memory up when you're done (you can do this as soon as image is drawn to canvas)
    //             URL.revokeObjectURL(url);
    //         };
    //         img.src = url;
    //     };
    //     xhr.open('GET', url, true);
    //     xhr.responseType = 'blob';
    //     xhr.send();
    // },
    createForm(base64) {
        this.form = new FormData()
        this.form.append("image", base64)
    },
    submit() {
        axios.post('http://localhost:8091/uploadpaste', this.form).then(res => {
            // document.querySelector("#img").setAttribute('src', "http://localhost:8091/" + res.data.store_path)
        })
        return false
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#we_code
    width 100%
    height:100%
    .slot_p
        padding: 40px 24px
        p
            padding:8px 0
    .code_part
        border_()
        padding:20px
        margin:20px
        mb(10px)
        overflow:hidden
        .left_p
            fl()
            div
                mb(10px)
                h3
                    mb(5px)
            ul
                li
                    height:24px
                    p
                        fl()
                        width:100px
                    span
                        fl()
                        alignL()
        .right_p
            fr()
            .img
                width:150px
                height 150px
                bgColor(skyblue)
                mb(5px)
                img
                    width: 100%
                    height: 100%
            p
                center()
    .save_btn
        bgColor(skyblue)
        color()
        fr()
</style>
