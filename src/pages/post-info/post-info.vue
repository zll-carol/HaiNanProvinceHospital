<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .box
      .top
        .top-item-1(:style="data.status == 1?'background: #6B7FA4':data.status == 2?'background: #FCA103':data.status == 3?'background: #0AD403':data.status == 4?'background: #707070':data.status == 5?'background: #FF5353':''")
          .text {{data.statusName1}}
          img(mode="widthFix", :src="data.status == 1?'https://nontax-cdn.yuluoo.com/hospital-post-djcf.png':data.status == 2?'https://nontax-cdn.yuluoo.com/hospital-post-dfh.png':data.status == 3?'https://nontax-cdn.yuluoo.com/hospital-post-psz.png':data.status == 4?'https://nontax-cdn.yuluoo.com/hospital-post-yqs.png':data.status == 5?'https://nontax-cdn.yuluoo.com/hospital-post-yqx.png':''")
        .top-item-2(@tap="showInfoList()" v-if="data.status != 1 && data.status != 5")
          img(mode="widthFix", src="https://nontax-cdn.yuluoo.com/hospital-post-sf.png")
          .text
            .text-1 {{route.remark}}
            .text-2 {{route.accept_time}}
          .jump-info
        .top-item-2(v-if="data.status == 1 || data.status == 5")
          .text-btn
            .text-1(v-if="data.status == 1") 请将您的处方交至配送服务窗口！
            .text-1(v-if="data.status == 5") 您的配送已取消，请及时到药房窗口取药！
          .btn(@tap="qx()" v-if="data.status == 1")
            .btn-text 取消配送
      .center
        .top-text
          .text 药品信息
        .center-box(v-for="item in orderInfo.prescriptionList")
          .text-1
            .text-11 处方单号
            .text-12(@tap="gotoInfo(item)") {{item.prescriptionNo}}
            .text-13 {{item.drugType}}
          .text-2
            .text-21 就诊医生
            .text-22 {{item.doctorName}}（{{item.doctorName}}）
      .bottom
        .top-text 订单详情
        .center-text(style="margin-top: 16px")
          .text-1 订单号
          .text-2 {{orderInfo.orderNo}}
        .center-text
          .text-1 预计费用
          .text-2 {{orderInfo.fee}}元
        .center-text
          .text-1 收货人
          .text-2 {{orderInfo.receiver}}（{{orderInfo.receiverPhone}}）
        .center-text
          .text-1 配送地址
          .text-2 {{orderInfo.address}}
        .center-text
          .text-1 下单时间
          .text-2 {{orderInfo.billTime}}
      .canvasBox(v-if="data.status === 1")
        canvas.QRcode(canvas-id="QRcode")
        .QRcode_text 订单号二维码
</template>

<script>
  import RPC from '../../utils/request'
  import wxAsync from '../../utils/wxapipromisify'
  import QRcode from '../../utils/qrcode'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        num: 1,
        data: '',
        route: '',
        routeList: [],
        orderInfo: '',
        patientId: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      createQrCode(url, canvasId, cavW, cavH) {
        QRcode.api.draw(url, canvasId, cavW, cavH) // 调用插件中的draw方法，绘制二维码图片
      },
      qx() {
        let self = this
        wx.showModal({
          content: '您是否要取消配送？',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            console.log(res)
            if (res.confirm) {
              self.cancel()
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      async cancel() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/cancel',
            data: {
              orderNo: this.data.orderNo,
              patientId: this.patientId
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          wx.navigateBack()
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      gotoInfo(item) {
        wxAsync.navigateTo({
          url: '../drug-info/main?data=' + JSON.stringify(item) + '&patientId=' + this.patientId
        })
      },
      showInfoList() {
        console.log(this.data.status)
        if (this.data.status === 2 || this.data.status === 3 || this.data.status === 4) {
          wx.navigateTo({
            url: '../post-info-sf/main?routeList=' + JSON.stringify(this.routeList)
          })
        } else {
          RPC.toShow('暂无配送消息！')
        }
      },
      async drugDispatchOrderSearch() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/orderSearch',
            data: {
              orderNo: this.data.orderNo,
              patientId: this.patientId
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          this.orderInfo = res.data.orderInfo
          if (this.data.status === 2 || this.data.status === 3 || this.data.status === 4) {
            this.drugDispatchRouteSearch()
          }
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async drugDispatchRouteSearch() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/routeSearch',
            data: {
              orderNo: this.data.orderNo,
              patientId: this.patientId
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          this.routeList = res.data.routeList[0]
          console.log(this.routeList)
          this.route = this.routeList.routeList[0]
          console.log(this.route)
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      this.routeList = []
      this.route = ''
      this.data = JSON.parse(event.data)
      if (this.data.status === 1) {
        this.createQrCode(this.data.orderNo, 'QRcode', 250, 250)
      }
      this.patientId = event.patientId
      console.log(this.data)
      this.drugDispatchOrderSearch()
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
      .box
        position absolute
        top 16 * rpx
        padding-bottom 70 * rpx
        .top
          width 720 * rpx
          border-radius 8px
          margin-left 16 * rpx
          overflow hidden
          .top-item-1
            height 176 * rpx
            display flex
            .text
              width 250 * rpx
              display inline-block
              margin-left 32 * rpx
              margin-top 32 * rpx
              font-size 20px
              color white
              font-weight bold
            img
              margin-left 290 * rpx
              margin-top 32 * rpx
              display inline-block
              width 112 * rpx
              height 112 * rpx
          .top-item-2
            display flex
            padding-bottom 12 * rpx
            background white
            align-items center
            img
              margin-left 32 * rpx
              display inline-block
              width 80 * rpx
              height 80 * rpx
            .text
              width 540 * rpx
              margin-left 32 * rpx
              line-height 1.8
              display inline-block
              .text-1
                font-size 28 * rpx
                margin-top 12 * rpx
              .text-2
                font-size 12px
                color #707070
            .text-btn
              width 686 * rpx
              margin-left 32 * rpx
              margin-top 32 * rpx
              margin-bottom 32 * rpx
              line-height 1.8
              display inline-block
              .text-1
                font-size 28 * rpx
            .btn
              width 225 * rpx
              height 64 * rpx
              margin-right 32 * rpx
              background-color #19C1DE
              border-radius 32 * rpx
              text-align center
              .btn-text
                padding 0 10 * rpx 0 10 * rpx
                font-size 28 * rpx
                color white
                line-height 64 * rpx
            .jump-info
              position absolute
              right 32 * rpx
              top 220 * rpx
              color #808080
              font-size 16px
              &:after
                content ' '
                display inline-block
                border-width 2px 2px 0 0
                border-color #C8C8CD
                border-style solid
                height 8px
                width 8px
                -webkit-transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                top -2px
                top 50%
                margin-top -6 * rpx
                right 2px
        .center
          padding 32 * rpx 0 36 * rpx 0
          margin-top 16 * rpx
          width 720 * rpx
          border-radius 8px
          margin-left 16 * rpx
          background white
          .top-text
            width 648 * rpx
            height 56 * rpx
            margin-left 32 * rpx
            .text
              font-size 20px
              font-weight bold
          .center-box
            margin-top 32 * rpx
            margin-left 32 * rpx
            .text-1
              margin-top 32 * rpx
              display flex
              display -webkit-flex
              .text-11
                color #707070
                display inline-block
                font-size 16px
              .text-12
                width 350 * rpx
                color #005DFF
                margin-left 32 * rpx
                display inline-block
                font-size 16px
              .text-13
                width 124 * rpx
                height 48 * rpx
                line-height 48 * rpx
                text-align center
                border-radius 16 * rpx
                border 2 * rpx solid rgba(112,112,112,1)
                color #707070
                display inline-block
                font-size 16px
            .text-2
              margin-top 20 * rpx
              .text-21
                color #707070
                display inline-block
                font-size 16px
              .text-22
                margin-left 32 * rpx
                display inline-block
                font-size 16px
        .bottom
          width 720 * rpx
          margin-top 16 * rpx
          padding 32 * rpx 0 36 * rpx 0
          border-radius 8px
          margin-left 16 * rpx
          background white
          .top-text
            margin-left 32 * rpx
            font-size 20px
            font-weight bold
          .center-text
            margin-top 16 * rpx
            margin-left 32 * rpx
            margin-right 32 * rpx
            padding-bottom 28 * rpx
            display flex
            display -webkit-flex
            justify-content space-around
            .text-1
              width 154 * rpx
              display inline-block
              font-size 14px
              color #707070
            .text-2
              display inline-block
              font-size 14px
              width 512 * rpx
        .canvasBox
          text-align center
          padding-bottom 100 * rpx
          .QRcode
            display inline-block
            margin-top 28 * rpx
            width 500 * rpx
            height 500 * rpx
          .QRcode_text
            margin-top 20 * rpx
            font-size 28 * rpx
            color #707070
</style>
