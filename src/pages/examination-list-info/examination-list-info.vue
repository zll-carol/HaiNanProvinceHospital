<template lang="pug">
  .main
    .bg
      .box
        .box-relation
          .name 检查项目
          .value {{data.title}}
        .box-relation
          .name 检查时间
          .value {{data.oldTime}}
        .box-relation
          .name 就诊人
          .value {{peopleData.name}}
        .box-relation
          .name 医生
          .value {{data.doctorName}}（{{data.sectionName}}）
        .box-relation
          .name 开单时间
          .value {{data.billTime}}
        .box-relation
          .name 检查部位
          .value {{data.advice}}
        .box-relation
          .name 注意事项
          .value {{data.remind}}
        .box-relation(style="border-bottom: 0")
          .name 检查地点
          .value {{data.address}}
      .text
        .text-1 温馨提示：
        .text-2 1. 调整预约时间需要提前一天
        .text-3 2. 检查时间只能调整一次
      <!--.btn-class(v-show="data.state=='0'")-->
        <!--button(@tap="submit")-->
          <!--.btm 调整时间-->
</template>

<script>
  export default {
    data() {
      return {
        isShow: true,
        data: {},
        peopleData: {}
      }
    },

    computed: {},

    components: {},
    methods: {
      bindPickerChange(event) {
        this.choose = this.array[event.mp.detail.value]
        this.index = event.mp.detail.value
      },
      submit() {
        wx.navigateTo({
          url: '../examination-changeTime/main?data=' + JSON.stringify(this.data) + '&peopleData=' + JSON.stringify(this.peopleData)
        })
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad(event) {
      let self = this
      self.data = JSON.parse(event.data)
      self.peopleData = JSON.parse(event.peopleData)
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
      width 750 * rpx
      height 100%
      overflow hidden
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-top 16 * rpx
        .box
          margin-top 16 * rpx
          width 720 * rpx
          height auto
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          .box-relation
            border-bottom 2 * rpx solid #E5E5E5
            margin-left 36 * rpx
            width 648 * rpx
            height 96 * rpx
            background #fff
            .name
              display inline-block
              line-height 96 * rpx
              color #707070
              font-size 16px
            .value
              width 400 * rpx
              display inline-block
              float right
              margin-right 34 * rpx
              font-size 16px
              line-height 96 * rpx
              text-align right
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
        .text
          margin-top 32 * rpx
          margin-left 48 * rpx
          .text-1
            font-weight bold
            font-size 14 px
            color #B81C24
          .text-2
            font-size 14 px
            color #B81C24
          .text-3
            font-size 14 px
            color #B81C24
        .btn-class
          position absolute
          width 100%
          bottom 54 * rpx
          button
            width 690 * rpx
            height 88 * rpx
            border-radius 88 * rpx
            background #19C1DE
            line-height:88rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.1)
            .btm
              color white
</style>
