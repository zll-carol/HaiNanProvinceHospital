<template lang="pug">
  .submitSuccess_box
    img.successIcon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_success.png")
    .successText 提交成功
    .tipContent
      .tip 请及时将您的配送处方单交至
      .tip 【新门诊西药房 17 号窗口】
      .tip 否则无法进行配送！
    .confirm(@click="gotoDrugList") 确定
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      gotoDrugList() {
        wx.navigateTo({
          url: '../drug-post/main'
        })
      }
    },
    onShow() {
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
    height 100%
    background #ffffff
    .submitSuccess_box
      text-align center
      .successIcon
        width 200 * rpx
        height 200 * rpx
        margin-top 126 * rpx
      .successText
        color #000000
        font-size 38 * rpx
        font-weight bold
        margin-top 50 * rpx
      .tipContent
        margin-top 126 * rpx
        font-size 36 * rpx
        color #FF4040
        font-weight bold
        .tip
          margin-top 8 * rpx
      .confirm
        position absolute
        bottom 118 * rpx
        left 208 * rpx
        width 336 * rpx
        height 66 * rpx
        line-height 66 * rpx
        text-align center
        font-size 36 * rpx
        color #19C1DE
        border 2 * rpx solid rgba(25,193,222,1)
        border-radius 8 * rpx
</style>
