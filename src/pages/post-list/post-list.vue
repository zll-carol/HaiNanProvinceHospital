<template lang="pug">
  .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .main
      .top
        .tab(@tap="change(1)")
          .tab-name(:class="num==1?'tab-color-1':''") 全部
          .tab-btm(:class="num==1?'tab-color-2':''")
        .tab(@tap="change(2)")
          .tab-name(:class="num==2?'tab-color-1':''") 待发货
          .tab-btm(:class="num==2?'tab-color-2':''")
        .tab(@tap="change(3)")
          .tab-name(:class="num==3?'tab-color-1':''") 已发货
          .tab-btm(:class="num==3?'tab-color-2':''")
        .tab(@tap="change(4)")
          .tab-name(:class="num==4?'tab-color-1':''") 已签收
          .tab-btm(:class="num==4?'tab-color-2':''")
      .box-list
        .box(@tap="gotoInfo")
          .box-text
            .text-1 快递单号
            .text-2 23425234453
            .text-3 待发货
          .box-text-1
            .text-1 就诊人
            .text-2 卓一
          .box-text-2
            .text-1 处方号
            .text-2
              .text-21 2018083023423523
              .text-21 2018083023423523
              .text-21 2018083023423523
          .box-text-3
            .text-1 下单时间
            .text-2 2018-08-30
</template>

<script>
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        num: 1
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
      change(a) {
        this.num = a
      },
      gotoInfo() {
        wx.navigateTo({
          url: '../post-info/main'
        })
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
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
    .bg
      height 320 * rpx
      background linear-gradient(#19C1DE,#F0EFF5)
      padding-top 16 * rpx
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
      .main
        width 750 * rpx
        overflow hidden
        .top
          margin-top 26 * rpx
          width 100%
          height 96 * rpx
          .tab
            display inline-block
            width 25%
            height 96 * rpx
            .tab-name
              text-align center
              line-height 94 * rpx
              color #FFFFFF
            .tab-btm
              margin-left 22 * rpx
              width 142 * rpx
              height 8 * rpx
              border-radius 8 * rpx
            .tab-color-1
              color #FFFFFF
            .tab-color-2
              background #FFFFFF
        .box-list
          width 100%
          height 100%
          .box
            width 720 * rpx
            height auto
            background white
            margin-left 16 * rpx
            margin-top 48 * rpx
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .box-text
              height 96 * rpx
              width 648 * rpx
              margin-left 32 * rpx
              border-bottom 2 * rpx solid #E5E5E5
              line-height 96 * rpx
              .text-1
                display inline-block
                font-weight bold
                font-size 16px
              .text-2
                margin-left 32 * rpx
                display inline-block
                font-weight bold
                font-size 16px
              .text-3
                float right
                display inline-block
                font-size 12px
                color #FCA103
            .box-text-1
              height 96 * rpx
              width 648 * rpx
              margin-left 32 * rpx
              line-height 96 * rpx
              .text-1
                display inline-block
                font-size 14px
                color #707070
              .text-2
                margin-left 60 * rpx
                display inline-block
                font-size 14px
                color #707070
            .box-text-2
              height auto
              width 648 * rpx
              margin-left 32 * rpx
              display flex
              .text-1
                display inline-block
                font-size 14px
                color #707070
              .text-2
                margin-left 60 * rpx
                display inline-block
                .text-21
                  font-size 14px
                  color #707070
            .box-text-3
              height 96 * rpx
              width 648 * rpx
              margin-left 32 * rpx
              line-height 96 * rpx
              .text-1
                display inline-block
                font-size 14px
                color #707070
              .text-2
                margin-left 32 * rpx
                display inline-block
                font-size 14px
                color #707070
</style>
