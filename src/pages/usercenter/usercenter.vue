<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
      .usercenter_top
        .personal_info
          .avatar
            .user-avatar
              open-data(type="userAvatarUrl")
          .name(v-if="doctorType === '0'")
            open-data(type="userNickName")
          .name(v-if="doctorType === '1'") {{doctorInfo.doctorName}}
          .btn(@tap="doctorRZ()")
            .text {{btnName}}
      .usercenter_content
        .row_first(@tap="navigateToSecondPage('../card/main')")
          .left_first
            img.icon_first(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_card.png")
            .des_first 健康卡管理
          .right_first
            img.arrow_first(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
        .row(@tap="navigateToSecondPage('../guahaoRecord-list/main?type=1')")
          .left
            img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_guahao1.png")
            .des 挂号记录
          .right
            img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
        <!--.row(@tap="navigateToSecondPage('../paymentRecord-list/main')")-->
          <!--.left-->
            <!--img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_paymentRecord1.png")-->
            <!--.des 缴费记录-->
          <!--.right-->
            <!--img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")-->
        <!--.row(@tap="navigateToSecondPage('../post-list/main')")-->
          <!--.left-->
            <!--img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_deliver1.png")-->
            <!--.des 配送记录-->
          <!--.right-->
            <!--img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")-->
        .row(@tap="navigateToSecondPage('../collectDoctor/main')")
          .left
            img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_collect.png")
            .des 收藏医生
          .right
            img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
        <!--.row-->
          <!--.left-->
            <!--img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_address.png")-->
            <!--.des 地址管理-->
          <!--.right-->
            <!--img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")-->
        .row(@tap="navigateToSecondPage('../contact/main')")
          .left
            img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_concat.png")
            .des 联系客服
          .right
            img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
        button.row(open-type="feedback")
          .left
            img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_userAddvice.png")
            .des 用户反馈
          .right
            img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
        .row(@tap="navigateToSecondPage('../hospital-guide-list/main?type=' + '4')", style="border:none")
          .left
            img.icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_useHelp.png")
            .des 使用帮助
          .right
            img.arrow(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_arrow.png")
      .copyright 中国建设银行海南省分行©2018海南玉螺技术支持
</template>
<script>
  import RPC from '../../utils/request'
  import wxAsync from '../../utils/wxapipromisify'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        btnName: '',
        doctorType: 0,
        doctorInfo: {}
      }
    },

    computed: {},

    components: {},
    methods: {
      doctorRZ() {
        if (this.doctorType === '1') {
          console.log('取消认证')
          this.cancelCertify()
        } else {
          wxAsync.navigateTo({
            url: '../doctorRZ/main'
          })
        }
      },
      async cancelCertify() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/cancelCertify',
            data: {
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          // 取消认证成功
          RPC.toShow('取消成功！')
          wx.setStorageSync('doctorInfo', '')
          wx.navigateBack({
            delta: 1
          })
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      navigateToSecondPage(url) {
        wxAsync.navigateTo({
          url: url
        })
      }
    },
    onShow() {
    },
    onLoad(event) {
      this.doctorType = event.doctorType
      console.log(event)
      if (this.doctorType === '1') {
        this.btnName = '取消认证'
        this.doctorInfo = wx.getStorageSync('doctorInfo')
      } else {
        this.btnName = '医生认证'
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx
  rpx = rpxf()
  page
    background-color #F0EFF5
    .main
      width 750 * rpx
      background #F0EFF5
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
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        .copyright
          position absolute
          width 100%
          bottom 20 * rpx
          text-align center
          color rgba(136,140,143,1)
          font-size 22 * rpx
        .usercenter_top
          margin-top 16 * rpx
          width 720 * rpx
          height 128 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 20 * rpx
          display inline-block
          .personal_info
            text-align left
            top 50%
            margin-top 24 * rpx
            margin-left 32 * rpx
            .avatar
              size = 80 * rpx
              width size
              height size
              font-size 0
              display inline-block
              background rgba(0, 0, 0, 0)
              border 2 * rpx solid rgba(112,112,112,1)
              box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
              border-radius 50%
              .user-avatar
                width 80 * rpx
                height 80 * rpx
                border-radius 50%
                overflow hidden
            .name
              height 44 * rpx
              margin-top 24 * rpx
              position absolute
              display inline-block
              margin-left 32 * rpx
              font-size 36 * rpx
              font-weight bold
              line-height 44 * rpx
              color rgba(0,0,0,1)
            .btn
              margin-top 12 * rpx
              margin-right 32 * rpx
              float right
              display inline-block
              width 192 * rpx
              height 64 * rpx
              text-align center
              background-color #E1FBFF
              border-radius 42 * rpx
              .text
                font-size 28 * rpx
                color #0098B3
                line-height 64 * rpx
        .usercenter_content
          width 720 * rpx
          margin-top 16 * rpx
          display inline-block
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 16 * rpx
          .row_first
            height 96 * rpx
            line-height 96 * rpx
            display inline-block
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            .left_first
              display inline-block
              margin-right 405 * rpx
              .icon_first
                width 48 * rpx
                height 48 * rpx
                margin-bottom -11 * rpx
                display inline-block
              .des_first
                height 44 * rpx
                font-size 32 * rpx
                margin-left 32 * rpx
                display inline-block
                font-weight 400
                line-height 44 * rpx
                color rgba(0,0,0,1)
            .right_first
              text-align right
              display inline-block
              .arrow_first
                width 16 * rpx
                height 25 * rpx
          .row
            height 96 * rpx
            line-height 96 * rpx
            background-color white
            display inline-block
            text-align left
            padding 0 0
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            &:after
              border 0
            .left
              display inline-block
              margin-right 436 * rpx
              .icon
                width 48 * rpx
                height 48 * rpx
                margin-bottom -11 * rpx
                display inline-block
              .des
                height 44 * rpx
                font-size 32 * rpx
                margin-left 32 * rpx
                display inline-block
                font-weight 400
                line-height 44 * rpx
                color rgba(0,0,0,1)
            .right
              text-align right
              display inline-block
              .arrow
                width 16 * rpx
                height 25 * rpx
</style>
