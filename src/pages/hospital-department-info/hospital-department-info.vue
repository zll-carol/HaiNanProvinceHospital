<template lang="pug">
  .main
    .bg
    .box
      .title
        .title-name 科室名称：
        .title-value {{deptName}}
      .bottom
        .bottom-name 科室介绍：
        .bottom-value {{deptIntro}}
</template>

<script>
  export default {
    data() {
      return {
        deptName: '',
        deptIntro: ''
      }
    },

    computed: {},

    components: {},
    methods: {
    },
    onShow() {
    },
    onLoad(event) {
      // console.log(event)
      this.deptIntro = event.deptIntro
      this.deptName = event.deptName
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
        width 720 * rpx
        height auto
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        box-shadow 0px 6px 12px rgba(0,0,0,0.05)
        .title
          width 648 * rpx
          margin-left 32 * rpx
          height 96 * rpx
          background #fff
          border-bottom 2 * rpx dashed #E5E5E5
          .title-name
            line-height 96 * rpx
            display inline-block
            font-size 32 * rpx
            font-weight bold
          .title-value
            line-height 96 * rpx
            display inline-block
            font-size 32 * rpx
        .bottom
          width 648 * rpx
          margin-left 32 * rpx
          height auto
          background #fff
          .bottom-name
            margin-top 16 * rpx
            font-size 32 * rpx
            font-weight bold
          .bottom-value
            margin-top 16 * rpx
            padding-bottom 16 * rpx
            font-size 32 * rpx
</style>
