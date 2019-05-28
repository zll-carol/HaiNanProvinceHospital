<template lang="pug">
  form(@submit="showXz", report-submit="true")
    .registered_box
      .bg
        .pay-tip(v-show="activeDisplay") {{tipShow}}
        .main(v-if="num == 1")
          .registered(v-if="show")
            .peopleInfo
              .text 就诊人
              .text-1 {{choose}}
              picker.text-2(@change="bindPickerChange" :value="index1" :range="peopleArray") 更换就诊人
              .jump-info
            .box
              img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_search.png")
              input.input(type="text" placeholder="搜索医生" @input="search")
            .cardInfo
              .box-item(v-if="num1 == 1" v-for="(item,index) in list" @tap="next(item.districtName)" :class="(index+1)==list.length?'box-last':''")
                .text {{item.districtShowName}}
                .jump-info
              .box-item-1(v-if="num1 == 2" v-for="(item,index) in doctorList" @tap="next(item)" :class="(index+1)==doctorList.length?'box-last':''")
                .text-1 {{item.doctorName}}({{item.sectionName}})
                .jump-info-1
            .xuzhi
              button.text(formType= "submit") 预约须知
            .xuzhi-1
              button.text-1(@tap="thcx()") 挂号查询
        .main-1(v-else-if="num == 2")
          .box-top
          .box
            .title 挂号须知
            scroll-view.text(scroll-y="true")
              .text-content 一、预约挂号:
              .text-content-1 1、预约方式：微信小程序、微信公众号、支付宝、智慧医院APP、现场预约、诊间预约、自助机预约、电话预约（68642547）。
              .text-content-1 2、实行一周预约制，可以提前一周预约全部可预约号源，包括普通号和专家号，周末及节假日不安排预约号；诊间预约可提前3个月。
              .text-content 二、实名制注册：
              .text-content-1 预约挂号采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证号码）、手机号码等有效基本信息，系统将通过人脸识别+公安比对校验实名信息。
              .text-content 三、预约就诊流程：
              .text-content-1 预约缴费成功后，秀英院区的患者请您于就诊当日提前30分钟到医院对应诊区分诊台签到，就诊顺序以现场呼叫为准。
              .text-content 四、温馨提示：
              .text-content-1 1、所有挂号“当次半天有效，过期作废”。如不能如约就诊，请至少在就诊前一工作日00:00前通过网络预约挂号点击挂号查询，选择该预约挂号信息根据消息提示操作退号。超过半天未来就诊，则当次挂号作废并不予退挂号费。
              .text-content-1 2、遇特殊情况医生临时停诊，工作人员将及时以短信方式通知您，请您留意在本院注册门诊号留存的手机号码短信信息。停诊“退号”后可预约其它时间或其他医生号源，如有疑问请咨询工作人员（电话：68642547），给您带来不便敬请谅解！如您不能接受此特殊情况，建议您不做预约，可选择现场挂号等方式。
              .text-content-1 3、同一患者实名（有效证件号）在同一就诊日、同一科室只能预约1次；在同一就诊日的预约总量不可超过3次。
              .text-content-1 4、如预约成功后患者未能按预约时段就诊且不取消预约号的视为爽约，爽约后系统将实施号源自动取消并不予退费。无故爽约累计达到3次将进入系统爽约名单，此后3个月内将无法享受预约挂号服务。
            <!--.btn(@tap="showYq()")-->
            .btn
              .btn_left(@tap="toSetAgree()" v-if="agree==0") 同意
              .btn_right(@tap="disagree()" v-if="agree==0") 不同意
              .btn_cent(@tap="iknow()" v-if="agree==1") 我知道了
          .box-btm
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        peopleArray: [],
        show: false,
        choose: '',
        list: [],
        doctorList: [],
        peopleDate: {},
        peopleList: [],
        num: 1,
        num1: 1,
        agree: 0
      }
    },

    computed: {},

    components: {},
    methods: {
      thcx() {
        wx.navigateTo({
          url: '../guahaoRecord-list/main?type=2&outpatientNo=' + this.peopleDate.outpatientNo + '&name=' + this.peopleDate.name + '&patientId=' + this.peopleDate.patientId
        })
      },
      search(event) {
        console.log(event.mp.detail.value)
        let keyword = event.mp.detail.value
        if (keyword) {
          this.num1 = 2
          this.searchDoctor(keyword)
        } else {
          this.num1 = 1
        }
      },
      async searchDoctor(keyword) {
        this.doctorList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listDoctorByName',
            data: {
              patientId: this.peopleDate.patientId,
              keyword: keyword,
              type: '1'
            }
          })
          console.log('success')
          console.log(res)
          this.doctorList = res.data.doctorList
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      showXz(event) {
        console.log(event)
        this.num = 2
        this.saveFormId(event.mp.detail.formId)
      },
      // showYq() {
      //   this.num = 1
      // },
      iknow() {
        this.num = 1
      },
      toSetAgree() {
        this.num = 1
        this.setAgree()
      },
      disagree() {
        // this.num = 1
        wx.navigateBack({
          delta: 1
        })
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/templatemsg/submitFormId',
            data: {
              formId: formId
            },
            type: 1
          })
          console.log(res)
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      bindPickerChange(event) {
        this.choose = this.peopleArray[event.mp.detail.value]
        this.index = event.mp.detail.value
        console.log(this.index)
        this.peopleDate = this.peopleList[this.index]
        this.tosetMr(this.peopleDate)
      },
      next(districtName) {
        if (this.num1 === 1) {
          let peopleDate = JSON.stringify(this.peopleDate)
          wx.navigateTo({
            url: '../registered-choose-department/main?districtName=' + districtName + '&peopleDate=' + peopleDate
          })
        } else {
          console.log(1111)
          let address = ''
          if (districtName.address) {
            address = districtName.address
          }
          wx.navigateTo({
            url: '../registered-choose-doctor-1/main?name=' + districtName.doctorName + '&address=' + address + '&deptId=' + districtName.sectionId + '&doctorId=' + districtName.doctorId
          })
        }
      },
      setpeopleArray() {
        let self = this
        self.peopleArray = []
        self.peopleList = wx.getStorageSync('getHealthCardList')
        self.peopleDate = self.peopleList[0]
        self.choose = self.peopleDate.name + '(' + self.peopleDate.outpatientNo + ')'
        console.log(self.choose)
        for (let i = 0, length = self.peopleList.length; i < length; i++) {
          self.peopleArray.push(self.peopleList[i].name + '(' + self.peopleList[i].outpatientNo + ')')
        }
      },
      async listDistrict() {
        console.log('xxxxxxxxxxx this.peopleDate.patientId:')
        console.log(this.peopleDate.patientId)
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listDistrict',
            data: {
              patientId: this.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          this.list = res.data.districtList
          this.show = true
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async tosetMr(item) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/setDefault',
            data: {
              cardId: item.id
            }
          })
          console.log('success')
          console.log(res)
          // self.listHealthCardRequest()
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async setAgree() {
        // let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/agreement/agree',
            data: {
              agreementName: 'registration_notice'
            }
          })
          console.log('success')
          console.log(res)
          this.num = 1
          this.agree = 1
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async getAgreement() {
        // let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/agreement/getAgreement',
            data: {
              agreementName: 'registration_notice'
            }
          })
          console.log('success')
          console.log(res)
          this.agree = res.agree
          if (this.agree === 0) {
            this.num = 2
          } else {
            this.num = 1
          }
          this.setpeopleArray()
          this.listDistrict()
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async listHealthCardRequest() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listHealthCard',
            data: {
            }
          })
          console.log('success')
          console.log(res)
          try {
            wx.setStorageSync('getHealthCardList', self.list)
            console.log('xxxxxxxxxxxxx setStorage xxxxxx success')
            self.setpeopleArray()
          } catch (err) {
            console.log(err)
          }
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            this.tipShow = err.errmsg
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      }
    },
    onShow() {
    },
    onLoad() {
      // 判断是否同意过须知
      this.getAgreement()
      // if (a === 0) {
      //   this.num = 2
      // } else {
      //   this.num = 1
      // }
      this.num1 = 1
    },
    created() {
      // wx.clearStorage()
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx

  rpx = rpxf()

  page
    height 100%
    background #19C1DE
    form
      .registered_box
        width 750 * rpx
        height 100%
        background #F0EFF5
        .bg
          height 320 * rpx
          background linear-gradient(#19C1DE,#F0EFF5)
          .pay-tip
            width 720 * rpx
            overflow hidden
            position fixed
            text-align center
            top 0
            left 0
            height 58 * rpx
            background-color #FF000D
            font-size 28 * rpx
            color #FFFFFF
            line-height 58 * rpx
            z-index 999
          .main
            width 100%
            position absolute
            top 16 * rpx
            .registered
              .peopleInfo
                margin-top 16 * rpx
                width 720 * rpx
                height 96 * rpx
                background #fff
                border-radius 8px
                margin-left 16 * rpx
                -webkit-box-align center
                -webkit-align-items center
                align-items center
                position relative
                display flex
                .text
                  font-size 16px
                  margin-left 32 * rpx
                  line-height 96 * rpx
                .text-1
                  width 350 * rpx
                  font-size 16px
                  margin-left 40 * rpx
                  line-height 96 * rpx
                  font-weight bold
                .text-2
                  font-size 14px
                  margin-left 32 * rpx
                  line-height 96 * rpx
                  color #C7C7CC
                .jump-info
                  padding-right 15px
                  position absolute
                  margin-left 672 * rpx
                  color #808080
                  font-size 16px
                  &:after
                    content ' '
                    display inline-block
                    height 6px
                    width 6px
                    border-width 2px 2px 0 0
                    border-color #C8C8CD
                    border-style solid
                    -webkit-transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                    transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                    position relative
                    top -2px
                    position absolute
                    top 50%
                    margin-top -6 * rpx
                    right 2px
              .box
                margin-top 16 * rpx
                width 720 * rpx
                height 80 * rpx
                background #fff
                border-radius 16 * rpx
                margin-left 16 * rpx
                box-shadow:0px 6px 12px rgba(0,0,0,0.05);
                .icon
                  width 40 * rpx
                  height 40 * rpx
                  margin-top 25 * rpx
                  margin-left 36 * rpx
                .input
                  width 625 * rpx
                  float right
                  font-size 16px
                  margin-top 18 * rpx
              .cardInfo
                margin-top 16 * rpx
                width 720 * rpx
                background #fff
                border-radius 8px
                margin-left 16 * rpx
                .box-item
                  margin-left 32 * rpx
                  width 648 * rpx
                  height 96 * rpx
                  border-bottom 2 * rpx solid #E5E5E5
                  -webkit-box-align center
                  -webkit-align-items center
                  align-items center
                  position relative
                  display flex
                  .text
                    font-size 16px
                    line-height 96 * rpx
                  .jump-info
                    position absolute
                    right 0
                    color #808080
                    font-size 32 * rpx
                    &:after
                      content ' '
                      display inline-block
                      height 12 * rpx
                      width 12 * rpx
                      border-width 2px 2px 0 0
                      border-color #C8C8CD
                      border-style solid
                      -webkit-transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                      transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                      position relative
                      top -2px
                      position absolute
                      top 50%
                      margin-top -6 * rpx
                      right 2px
                .box-item-1
                  margin-left 32 * rpx
                  width 648 * rpx
                  height 96 * rpx
                  border-bottom 2 * rpx solid #E5E5E5
                  -webkit-box-align center
                  -webkit-align-items center
                  align-items center
                  position relative
                  display flex
                  .text-1
                    font-size 16px
                    line-height 96 * rpx
                  .jump-info-1
                    position absolute
                    right 0
                    color #808080
                    font-size 32 * rpx
                    &:after
                      content ' '
                      display inline-block
                      height 12 * rpx
                      width 12 * rpx
                      border-width 2px 2px 0 0
                      border-color #C8C8CD
                      border-style solid
                      -webkit-transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                      transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                      position relative
                      top -2px
                      position absolute
                      top 50%
                      margin-top -6 * rpx
                      right 2px
                .box-last
                  border-bottom 0
              .xuzhi
                display flex
                margin-top 32 * rpx
                width 720 * rpx
                margin-left 20 * rpx
                .text
                  margin-right 16 * rpx
                  font-size 32 * rpx
                  color #19C1DE
                  background #F0EFF5
                  &:after
                    border 0
              .xuzhi-1
                display flex
                width 720 * rpx
                margin-left 20 * rpx
                .text-1
                  margin-right 16 * rpx
                  font-size 32 * rpx
                  color #19C1DE
                  background #F0EFF5
                  &:after
                    border 0
          .main-1
            width 100%
            text-align center
            height auto
            background black
            opacity 0.5
            .box-top
              width 100%
              height 48 * rpx
              background black
              opacity 0.5
            .box
              display inline-block
              border-radius 16 * rpx
              width 656 * rpx
              height auto
              background white
              .title
                font-size 36 * rpx
                height 80 * rpx
                line-height 80 * rpx
                text-align center
                border-bottom 2 * rpx solid #E5E5E5
              .text
                display inline-block
                margin-top 32 * rpx
                text-align left
                padding-bottom 24 * rpx
                width 576 * rpx
                height 850 * rpx
                .text-content
                  font-weight bold
                  color black
                  font-size 28 * rpx
                .text-content-1
                  text-indent 55 * rpx
                  color black
                  font-size 28 * rpx
              .btn
                height 96 * rpx
                line-height 96 * rpx
                width 656 * rpx
                // position fixed
                text-align center
                font-size 38 * rpx
                display flex
                display -webkit-flex
                border-top 2 * rpx solid #E5E5E5
                .btn_left
                  color #19C1DE
                  width 325 * rpx
                  display inline-block
                .btn_right
                  width 325 * rpx
                  display inline-block
                  border-left 2 * rpx solid #E5E5E5
                .btn_cent
                  color #19C1DE
                  width 650 * rpx
            .box-btm
              width 100%
              height 48 * rpx
              background black
              opacity 0.5
</style>
