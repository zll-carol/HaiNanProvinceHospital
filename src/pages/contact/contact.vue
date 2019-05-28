<template lang="pug">
  .main
    .bg
      .contact
        .first(@tap="contact1")
          .left 致电客服1
          img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
        .first(@tap="contact2", style="border:none")
          .left 致电客服2
          img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
        <!--.second-->
          <!--<button class="btn" open-type="contact" @contact="handleContact">联系客服</button>-->
          <!--img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")-->
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'

  export default {
    data() {
      return {
      }
    },
    computed: {
    },
    components: {},
    methods: {
      contact1() {
        wxAsync.makePhoneCall({
          phoneNumber: '089868622887'
        })
      },
      contact2() {
        wxAsync.makePhoneCall({
          phoneNumber: '18789682681'
        })
      }
    },
    created() {
    },
    onLoad() {
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
      text-align center
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-top 16 * rpx
        .contact
          width 720 * rpx
          font-size 32 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 16 * rpx
          display inline-block
          text-align center
          .first
            width 656 * rpx
            height 96 * rpx
            line-height 96 * rpx
            display inline-block
            position relative
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            .left
              display inline-block
              position absolute
              left 0
            .right
              display inline-block
              width 16 * rpx
              height 25 * rpx
              position absolute
              right 0
              top 35%
          .second
            width 656 * rpx
            height 96 * rpx
            display inline-block
            position relative
            line-height 96 * rpx
            .btn
              width 680 * rpx
              background-color rgba(255,255,255,1)
              font-size 32 * rpx
              text-align left
              padding-left 0
              height 96 * rpx
              line-height 96 * rpx
              color black
              &:after
                border none
            .right
              width 16 * rpx
              height 25 * rpx
              position absolute
              right 0
              top 35%
</style>
