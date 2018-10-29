<template>
  <div id="survey">
    <scroll-bar>
      <data-loading :data-satau="corpInfoData.loadingDataStatu">
        <div class="scroll-common">
          <div class="tip-wrapper" v-show="showTips&&!tipCondition">
            <div v-for="(item, index) in tipsData" :key="index" class="tip-item">
              <div class="numImg">
                <img class="img" :src="item.tipsNum" alt="">
              </div>
              <div class="tip-text">
                <div class="text">{{item.text}}</div>
                <div class="link" @click="toSteps(index)">
                  {{item.link}}
                  <Icon type="ios-arrow-right"></Icon>
                </div>
              </div>
              <Icon class="tip-icon" type="ios-arrow-right" v-show="index!=4"></Icon>
            </div>
            <div class="close">
              <Icon class="hover-color" size="19" @click="closeTips" type="android-close"></Icon>
            </div>
          </div>
          <div class="survey-wrapper">
            <div class="survey-main">
              <data-loading :data-satau="corpInfoData.loadingDataStatu">
                <div class="survey-item">
                  <Row :gutter="16">
                      <Col span="18" class="part-1">
                        <Row>
                          <Col span="8" >
                            <div class="statistics">
                              <div class="statistics-left">
                                <img src="@/assets/images/survey/statistics1.png" alt="">
                              </div>
                              <div class="statistics-right">
                                <div class="title">公众号数量</div>
                                <div class="num">{{corpInfoData.appidNum || 0}}</div>
                                <div class="tipsNum">当前套餐限<span>{{corpInfoData.packAppidNum || 0}}</span>个</div>
                              </div>
                            </div>
                          </Col>
                          <Col span="8" >
                            <div class="statistics">
                              <div class="statistics-left">
                                <img src="@/assets/images/survey/statistics2.png" alt="">
                              </div>
                              <div class="statistics-right">
                                <div class="title">员工人数</div>
                                <div class="num">{{corpInfoData.eeNum || 0}}</div>
                                <div class="tipsNum">当前套餐限<span>{{corpInfoData.packEeNum || 0}}</span>个</div>
                              </div>
                            </div>
                          </Col>
                          <Col span="8" >
                            <div class="statistics">
                              <div class="statistics-left">
                                <img src="@/assets/images/survey/statistics3.png" alt="">
                              </div>
                              <div class="statistics-right">
                                <div class="title">坐席人数</div>
                                <div class="num">{{corpInfoData.seatNum || 0}}</div>
                                <div class="tipsNum">当前套餐限<span>{{corpInfoData.packSeatNum || 0}}</span>个</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span="6" class="part-1 part-2">
                        <div class="count">
                          <div class="title">
                            用户总数
                          </div>
                          <div class="num">
                            {{corpInfoData.fansNum || 0}}
                          </div>
                        </div>
                      </Col>
                  </Row>
                </div>
              </data-loading>
              
              <div class="survey-part">
                <div class="part-title">
                  <div class="title-left">
                    关键指标
                  </div>
                  <div class="title-right">
                    <div class="today" :class="{active: selectTime==0}" @click="changeDate(0)">今日</div>
                    <div class="yestoday" :class="{active: selectTime==1}" @click="changeDate(1)">昨日</div>
                  </div>
                </div>
                <data-loading :data-satau="keyIndicatorsData.loadingDataStatu">
                  <div class="part-content">
                    <div class="part-float">
                      <div class="part-center">
                        <div class="part-tit">在线客服</div>
                        <div class="part-num">{{keyIndicatorsData.onLineKFNum || 0}}</div>
                      </div>
                    </div>
                    <div class="part-float">
                      <div class="part-center">
                        <div class="part-tit">总会话数</div>
                        <div class="part-num">{{keyIndicatorsData.totalConversation || 0}}</div>
                      </div>
                    </div>
                    <div class="part-float">
                      <div class="part-center">
                        <div class="part-tit">会话人次</div>
                        <div class="part-num">{{keyIndicatorsData.visitorNum || 0}}</div>
                      </div>
                    </div>
                    <div class="part-float">
                      <div class="part-center">
                        <div class="part-tit">首次会话人数</div>
                        <div class="part-num">{{keyIndicatorsData.firstVisitor || 0}}</div>
                      </div>
                    </div>
                    <div class="part-float">
                      <div class="part-center">
                        <div class="part-tit">独立会话人数</div>
                        <div class="part-num">{{keyIndicatorsData.independentVisitor || 0}}</div>
                      </div>
                    </div>
                  </div>
                </data-loading>
              </div>
              <div class="survey-part">
                <div class="part-title">
                  <div class="title-left">
                    常用功能
                  </div>
                </div>
                <div class="part-content part-service">
                  <div class="part-float">
                    <div class="part-center ">
                      <div class="part-tit">
                        <img src="@/assets/images/survey/dys1.png" alt="">
                      </div>
                      <div class="part-num">客服中心</div>
                    </div>
                  </div>
                  <div class="part-float">
                    <div class="part-center">
                      <div class="part-tit">
                        <img src="@/assets/images/survey/dys2.png" alt="">
                      </div>
                      <div class="part-num">营销活动</div>
                    </div>
                  </div>
                  <div class="part-float">
                    <div class="part-center">
                      <div class="part-tit">
                        <img src="@/assets/images/survey/dys3.png" alt="">
                      </div>
                      <div class="part-num">统计分析</div>
                    </div>
                  </div>
                  <div class="part-float">
                    <div class="part-center">
                      <div class="part-tit">
                        <img src="@/assets/images/survey/dys4.png" alt="">
                      </div>
                      <div class="part-num">素材管理</div>
                    </div>
                  </div>
                  <div class="part-float">
                    <div class="part-center">
                      <div class="part-tit">
                        <img src="@/assets/images/survey/dys5.png" alt="">
                      </div>
                      <div class="part-num">群发管理</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="left">
              <div class="left-wrapper info">
                <div class="name">{{saveloginCompany.corpName}}</div>
                <div class="date">
                  <div>{{saveloginCompany.currPackageName}}</div>
                  <div>{{corpPackageData.endDate}} 到期</div>
                </div>
                <!-- <div class="tips-info" v-show="corpPackageData.packageName=='免费'">
                  当前为免费试用版，升级套餐，享更多特权服务
                </div> -->
                <div class="tips-info">
                  当前套餐为{{saveloginCompany.currPackageName}}，升级套餐，享更多特权服务
                </div>
                <div class="butn" @click="upgrade">
                  立即升级
                </div>
              </div>
              <div class="left-wrapper">
                <div class="tit">
                  <div class="tit-left">公告通知</div>
                  <div class="tit-right">更多</div>
                </div>
                <div class="con">
                  <div class="con-item">
                    <div class="item-left">商品分析支持“知识付费商品”</div>
                    <div class="item-right">08/02</div>
                  </div>
                  <div class="con-item">
                    <div class="item-left">知识付费支持公众号海报裂变</div>
                    <div class="item-right">08/02</div>
                  </div>
                  <div class="con-item">
                    <div class="item-left">多网点支持生成网点及商品二维码多网点二维码多网点...</div>
                    <div class="item-right">08/02</div>
                  </div>
                </div>
              </div>
              <div class="left-wrapper">
                <div class="tit">
                  <div class="tit-left">使用帮助</div>
                  <div class="tit-right">更多</div>
                </div>
                <div class="con">
                  <div class="con-item">
                    <div class="item-left">如何添加员工和坐席</div>
                  </div>
                  <div class="con-item">
                    <div class="item-left">如何使用群发功能</div>
                  </div>
                  <div class="con-item">
                    <div class="item-left">多种营销方式详解</div>
                  </div>
                </div>
              </div>
              <div class="left-wrapper">
                <div class="tit">
                  <div class="tit-left">在线客服</div>
                </div>
                <div class="con">
                  <div class="concent">
                    <div class="code">
                      <img src="@/assets/images/survey/erweima.png" alt="">
                    </div>
                    <div class="end">
                      <div>微信扫码在线咨询</div>
                      <div>咨询电话：400-8556-888</div>
                      <div>在线时间：周一到周六 9:00-21:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <common-modal ref="addTencent" header="套餐不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
        </div>
      </data-loading>
    </scroll-bar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getToken, setCookie, getCookie } from '@/utils/cookies'
import { getKeyIndicators, checkAppIdNum, getAuthUrl } from '@/api/query'

export default {
  name: 'survey',
  data() {
    return {
      tipsData: [
        {
          tipsNum: require('@/assets/images/survey/step1.png'),
          text: '添加公众号并授权企业',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step2.png'),
          text: '为企业添加员工',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step3.png'),
          text: '邀请已添加员工',
          link: '去邀请'
        },
        {
          tipsNum: require('@/assets/images/survey/step4.png'),
          text: '为企业添加坐席',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step5.png'),
          text: '完成并使用销大师',
          link: '使用帮助'
        }
      ],
      userInfo: getToken() || null,
      selectTime: 0,
      showTips: true,
      fansNum: '',
      content: '',
      thirdplatUrl: '',
      isAddTencent: false
    }
  },
  computed: {
    tipCondition() {
      return (
        this.corpInfoData.eeNum > 0 &&
        this.corpInfoData.seatNum > 0 &&
        this.corpInfoData.appidNum > 0
      )
    },
    ...mapGetters({
      corpPackageData: 'survey/getCorpPackage',
      corpInfoData: 'survey/getCorpInfo',
      keyIndicatorsData: 'survey/getKeyIndicators',
      saveloginCompany: 'survey/getSaveloginCompany'
    })
  },
  created() {
    this.$root.Bus.$on('changeCurrentCorp', value => {
      this.selectTime = 0
      // this.getAuthUrl()
      // this.checkAppIdNum()
    })
    // this.$root.Bus.$on('hideFullPageDrawer', value => {
    //   this.showFullPage = value
    // })
    // this.getAuthUrl()
    // this.checkAppIdNum()
  },
  mounted() {},
  methods: {
    // 获得关键指标
    getKeyIndicators(date) {
      let obj = {
        time: date,
        appAccountId: this.userInfo.defaultWechatAccountid
      }
      this.setKeyIndicators({loadingDataStatu: 1})
      getKeyIndicators(obj).then(data => {
        let keyIndicatorsData = data.data || {}
        if (data.code === 1) {
          keyIndicatorsData.loadingDataStatu = 2
          this.setKeyIndicators(Object.assign({}, this.keyIndicatorsData, keyIndicatorsData))
        } else {
          keyIndicatorsData.loadingDataStatu = 3
          this.setKeyIndicators(Object.assign({}, this.keyIndicatorsData, keyIndicatorsData))
        }
      }).catch(() => {
        this.setKeyIndicators({loadingDataStatu: 3})
      })
    },
    getAuthUrl() {
      let params = {
        redirectUrl: this.constRedirectUrl,
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
          location.href = this.thirdplatUrl
          setCookie('preAuthCode', data.data.preAuthCode)
        }
      })
    },
    checkAppIdNum() {
      checkAppIdNum().then(data => {
        switch (data.code) {
          case 1:
            if (data.data) {
              // this.isAddTencent = true
              this.getAuthUrl()
            } else {
              // this.isAddTencent = false
              this.content = `当前套餐版本最多支持${this.corpInfoData.packAppidNum}个公众号，如需更多服务请升级。`
              this.$refs.addTencent.showModal()
            }
            break
          case 3503:
            break
          default:
            break
        }
      })
    },
    toSteps(index) {
      switch (index) {
        case 0:
          this.addTencent()
          break
        case 1:
          this.$router.push({name: 'stuff'})
          break
        case 2:
          this.$router.push({name: 'stuff'})
          break
        case 3:
          this.$router.push({name: 'seats'})
          break 
        case 4:
          this.$router.push({name: 'home'})
          break        
        default:
          break
      }
    },
    addTencent() {
      this.checkAppIdNum()
      // if (this.isAddTencent) {
        // let newLink = document.createElement('a')
        // newLink.href = this.thirdplatUrl
        // newLink.target = '_blank'
        // document.body.appendChild(newLink)
        // newLink.click()
        // document.body.removeChild(newLink)
      // } else {
        // this.content = `当前套餐版本最多支持${this.corpInfoData.packAppidNum}个公众号，如需更多服务请升级。`
        // this.$refs.addTencent.showModal()
      // }
    },
    upgrade() {
      let corpId = getCookie('currentCorp').applyId
      let corpName = getCookie('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    changeDate(val) {
      if (this.selectTime === val) {
        return
      }
      this.selectTime = val
      this.getKeyIndicators(val)
    },
    closeTips() {
      this.showTips = false
    },
    ...mapActions({
      setKeyIndicators: 'survey/setKeyIndicators',
      setPayStatu: 'pay/setPayStatu'
    })
  },
  components: {},
  beforeDestroy() {
    this.$root.Bus.$off('changeCurrentCorp')
    // this.$root.Bus.$off('hideFullPageDrawer')
  }
}
</script>
<style lang="stylus">
@import './survey.styl'
</style>


