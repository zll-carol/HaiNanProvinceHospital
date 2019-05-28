<template lang="pug">
  .main
    .bg
      .box(style="background-image: url(https://nontax-cdn.yuluoo.com/hainanhospital_healthCard.png")
        .text-1
          .text-11 {{name}}
          .text-12 {{idCardNo}}
        view.img
          canvas(canvas-id="barcode")
        .text-2
          .text-11 门诊号
          .text-12 {{outpatientNo}}
      .cardInfo-box
        .cardInfo(@tap="cardInfo")
          img.img_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_card_icon_msg.png")
          .text 个人信息
          .jump-info
        .cardInfo(@tap="visitingHisRecordList")
          img.img_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_card_icon_jiuzhen.png")
          .text 历次就诊
          .jump-info
        .cardInfo(@tap="guahaoRecordList",style="border-bottom: 0")
          img.img_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_card_icon_guahao.png")
          .text 挂号记录
          .jump-info
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        login: false,
        name: '',
        outpatientNo: '',
        idCardNo: '',
        relationship: '',
        patientId: '',
        data: {}
      }
    },

    computed: {},

    components: {},
    methods: {
      gotoCard() {
        wx.navigateTo({
          // url: '../booking/main'
        })
      },
      cardInfo() {
        wx.navigateTo({
          url: '../card-info-final/main?key=0&idCardNo=' + this.idCardNo + '&outpatientNo=' + this.outpatientNo + '&relationship=' + this.relationship + '&patientId=' + this.patientId
        })
      },
      visitingHisRecordList() {
        wx.navigateTo({
          url: '../visitingHistory-list/main?data=' + JSON.stringify(this.data)
        })
      },
      guahaoRecordList() {
        wx.navigateTo({
          url: '../guahaoRecord-list/main?type=2&outpatientNo=' + this.outpatientNo + '&name=' + this.name + '&patientId=' + this.patientId
        })
      }
    },
    onLoad(event) {
      this.data = JSON.parse(event.data)
      console.log(this.data)
      this.name = this.data.name
      this.idCardNo = this.data.idCardNo
      this.outpatientNo = this.data.outpatientNo
      this.relationship = this.data.relationship
      this.patientId = this.data.patientId
      RPC.toBarcode('barcode', this.outpatientNo, 180, 50)
    },
    onShow() {
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
    .main
      width 750 * rpx
      height 100%
      background #F0EFF5
      text-align center
      .bg
        height 320 * rpx
        padding-top 16 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        .box
          width 600 * rpx
          height 339 * rpx
          border-radius 16 * rpx
          margin-left 76 * rpx
          background-size 100% 100%
          display flex
          .text-1
            margin-top 112 * rpx
            margin-left 32 * rpx
            .text-11
              display inline-block
              font-size 34 * rpx
              color #1A1311
              margin-left 8 * rpx
            .text-12
              display inline-block
              font-size 18 * rpx
              color #1A1311
          .img
            position absolute
            width 312 * rpx
            height 94 * rpx
            margin-left 30 * rpx
            margin-top 186 * rpx
            background white
          .text-2
            position absolute
            margin-top 280 * rpx
            margin-left 28 * rpx
            .text-11
              display inline-block
              font-size 22 * rpx
              color #1A1311
            .text-12
              display inline-block
              font-size 22 * rpx
              color #1A1311
              margin-left 18 * rpx
        .cardInfo-box
          margin-top 26 * rpx
          width 720 * rpx
          margin-left 16 * rpx
          border-radius 16 * rpx
          background #fff
          .cardInfo
            border-bottom 2 * rpx solid #E5E5E5
            margin-left 32 * rpx
            width 648 * rpx
            height 96 * rpx
            background #fff
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            position relative
            display flex
            .img_icon
              width 48 * rpx
              height 48 * rpx
              display inline-block
              margin-right 24 * rpx
            .text
              font-size 16px
              width 128 * rpx
              line-height 96 * rpx
            .jump-info
              padding-right 15px
              position absolute
              right 0
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
</style>
