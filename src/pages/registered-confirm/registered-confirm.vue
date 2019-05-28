<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .confirm_box
      .cardInfo(@click="choosePeople")
        .text 就诊人
        .text-1 {{peopleDate.name}}({{peopleDate.outpatientNo}})
      .box
        .box-relation
          .name 挂号费用
          .value {{doctorData.price}}元
        .box-relation
          .name 就诊科室
          .value {{departmentData.name}}
        .box-relation
          .name 就诊医生
          .value {{doctorData.name}}（{{doctorData.registerType}}）
        .box-relation
          .name 就诊时间
          .value {{chooseDataString}} {{hData.timeValue}}
        .box-relation(style="border-bottom:0")
          .name 就诊地点
          .value {{departmentData.address}}
      .box-2
        .tips 温馨提示：
        .tips-one 请在两分钟内进行支付，超时将自动释放号源，需要重新预约。
      .btn-class
      form(@submit="goPay",report-submit="true")
        button(formType= "submit" :style="clickType==false?'opacity: 0.2':''")
          .btm {{time}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        clickType: true,
        activeDisplay: false,
        tipShow: '',
        wxCallbackUrl: '',
        orderNo: '',
        price: '',
        peopleDate: {},
        doctorData: {},
        departmentData: {},
        hData: {},
        chooseDataString: '',
        time: '立即支付'
      }
    },

    computed: {},

    components: {},
    methods: {
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      timer() {
        this.globalData.time = 120
        this.myInterval = setInterval(
          this.sendTextMessage,
          1000
        )
      },
      sendTextMessage() {
        this.globalData.time--
        this.time = '立即支付（' + this.globalData.time + '秒）'
        if (this.globalData.time < 1) {
          clearInterval(this.myInterval)
          this.time = '返回'
        }
      },
      goPay(event) {
        console.log(event)
        let self = this
        if (this.globalData.time < 1) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          // self.saveFormId(event.mp.detail.formId)
          console.log(this.clickType + '11111111111111111111111111')
          if (this.clickType) {
            this.clickType = false
            setTimeout(
              this.setClick,
              120000
            )
            console.log(event)
            this.saveFormId(event.mp.detail.formId)
            RPC.JHpay(self.wxCallbackUrl, self.price, self.orderNo, 1, self.peopleDate.patientId)
          }
        }
      },
      setClick() {
        this.clickType = true
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/templatemsg/submitFormId',
            data: {
              formId: formId
            }
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
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      this.clickType = true
      if (this.myInterval) {
        clearInterval(this.myInterval)
        this.timer()
      } else {
        this.timer()
      }
      console.log(event)
      this.orderNo = event.orderNo
      this.wxCallbackUrl = event.wxCallbackUrl
      this.price = event.price
      this.peopleDate = JSON.parse(event.peopleDate)
      this.departmentData = JSON.parse(event.departmentData)
      this.hData = JSON.parse(event.hData)
      this.doctorData = JSON.parse(event.doctorData)
      this.chooseDataString = event.chooseDataString
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx

  rpx = rpxf()

  page
    height 100%
    background #F0EFF5
    .main
      width 100%
      height 100%
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .pay-tip
        width 100%
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
      .confirm_box
        position absolute
        top 16 * rpx
        .cardInfo
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
            font-size 16px
            margin-left 40 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-left 280 * rpx
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
          width 720 * rpx
          margin-top 16 * rpx
          margin-left 16 * rpx
          background #fff
          border-radius 8px
          .box-relation
            width 648 * rpx
            height 96 * rpx
            margin-left 32 * rpx
            background #fff
            border-bottom 2 * rpx solid #E5E5E5
            .name
              display inline-block
              line-height 96 * rpx
              color #707070
              font-size 16px
            .value
              width 450 * rpx
              display inline-block
              float right
              margin-right 34 * rpx
              font-size 16px
              line-height 96 * rpx
              text-align right
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
        .box-2
          .tips
            margin-top 16 * rpx
            margin-left 48 * rpx
            font-size 12px
            color #B81C24
          .tips-one
            width 624 * rpx
            margin-top 22 * rpx
            margin-left 48 * rpx
            font-size 12px
            color #B81C24
        .btn-class
          width 100%
        form
          button
            width 690 * rpx
            height 88 * rpx
            bottom 54 * rpx
            position fixed
            left 32 * rpx
            border-radius 88 * rpx
            background #19C1DE
            line-height:88rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.1)
            .btm
              color white
</style>
