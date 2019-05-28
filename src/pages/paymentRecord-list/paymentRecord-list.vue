<template lang="pug">
  .main
    .bg
    .none(v-if="MsgStatus === '0'") 暂无相关信息
    .pay-tip(v-show="activeDisplay2") {{tipShow}}
    .pay-list(v-show="activeDisplay")
      .item(v-for="(item,index) in paymentList" :key="index")
        form(@submit="navigateToPaymentDetail(item)", :data-id="item.id")
          button.btn(formType= "submit",plain="true")
            .pay-item
              .left1 缴费单号
              .left2 {{item.billNo}}
              .right ￥{{item.fee}}
            .pay-item_content
              .content_list
                .left 就诊人
                .right(style="margin-left:30px") {{item.patientName}}
              .content_list
                .left 缴费科室
                .right {{item.PatDep}}
              .content_list
                .left 缴费时间
                .right {{item.Date}}
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'

  export default {
    data() {
      return {
        activeDisplay2: false,
        tipShow: '',
        activeDisplay: false,
        MsgStatus: '',
        paymentList: [],
        name: '',
        patientId: ''
      }
    },
    computed: {
    },
    components: {},
    methods: {
      showPage1() {
        this.activeDisplay = true
      },
      hidePage1() {
        this.activeDisplay = false
      },
      showTip() {
        this.activeDisplay2 = true
      },
      hideTip() {
        this.activeDisplay2 = false
      },
      navigateToPaymentDetail(item) {
        wxAsync.navigateTo({
          url: '/pages/paymentRecord-detail/main?item=' + JSON.stringify(item) + '&name=' + this.name
        })
      },
      async getBillRecordRequest() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/getHistList',
            data: {
              PatientId: that.patientId
            }
          })
          console.log('getBillRecordRequest xxxxxxxxxxxx res:')
          console.log(res.data)
          console.log(res.data.length)
          if (res.data.length === 0) {
            that.MsgStatus = '0'
          }
          if (res.data.length !== 0) {
            that.paymentList = res.data
            that.showPage1()
          }
        } catch (err) {
          console.log(err)
          this.MsgStatus = ''
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
    created() {
    },
    onLoad() {
      let that = this
      that.hidePage1()
      this.getBillRecordRequest()
      wx.getStorage({
        key: 'getHealthCardList',
        success(res) {
          console.log(res.data[0])
          that.name = res.data[0].name
          that.patientId = res.data[0].patientId
        }
      })
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx
  rpx = rpxf()

  page
    background-color #EFEFF4
    .main
      width 750 * rpx
      overflow hidden
      background #F0EFF5
      text-align center
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .none
        color #9999
        padding-top 25%
        text-align center
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
      .pay-list
        text-align center
        position absolute
        top 16 * rpx
        left 16 * rpx
        .item
          margin-bottom 18  * rpx
          display inline-block
          width 720  * rpx
          background-color #FFFFFF
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.05)
          border-radius 16px
          text-align center
          form
            .btn
              border none
              .pay-item
                display inline-block
                text-align left
                width 656  * rpx
                border-bottom 2 * rpx solid rgba(229, 229, 229, 1)
                font-size 32 * rpx
                font-weight bold
                color #000000
                .left1
                  display inline-block
                  margin-right 30 * rpx
                .left2
                  display inline-block
                .right
                  display inline-block
                  color #19C1DE
                  font-size 40 * rpx
                  font-weight bold
                  position absolute
                  top -2 * rpx
                  right 32 * rpx
              .pay-item_content
                margin-bottom 32 * rpx
                display inline-block
                text-align left
                padding-top 18 * rpx
                width 656  * rpx
                font-size 28  * rpx
                color #707070
                .content_list
                  width 656 * rpx
                  .left
                    display inline-block
                  .right
                    display inline-block
                    margin-left 32 * rpx
                  .status
                    width 104 * rpx
                    height 48 * rpx
                    text-align center
                    line-height 48 * rpx
                    display inline-block
                    float right
                    color #ffffff
                    border-radius 24 * rpx
</style>
