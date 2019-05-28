<template lang="pug">
  .main
    <!--.box-->
      <!--<icon type="search" class="icon"></icon>-->
      <!--<input type="text" class="input" placeholder="搜索医生" />-->
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .part
      .btn-list
        .btn(@tap="change2(index)" :class="numTime==index?'color-2':'color-1'" v-for="(item, index) in list")
          .btn-text(:class="numTime==index?'txt-color-1':'txt-color-2'") {{item.hosName}}
      .doctor-list
        .doctor(@tap="next(item)", v-for="(item, index) in list1", :class="index==list1.length-1?'last':''")
          .text {{item.deptName}}
          .jump-info
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        numTime: 0,
        num: 1,
        name: '',
        list: [],
        list1: []
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
      change2(id) {
        this.numTime = id
        this.getDept(this.list[id].branchId)
      },
      next(item) {
        wx.navigateTo({
          url: '../hospital-department-info/main?deptName=' + item.deptName + '&deptIntro=' + item.deptIntro
        })
      },
      async getDept(branchId) {
        let self = this
        self.list1 = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital/getDept',
            data: {
              branchId: branchId
            }
          })
          console.log('success')
          console.log(res)
          self.list1 = res.data
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
      },
      async getHospital() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital/getHospital',
            data: {
            }
          })
          console.log('success')
          console.log(res)
          self.list = res.data
          self.getDept(self.list[0].branchId)
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
    onLoad() {
      this.getHospital()
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
        margin-top 16 * rpx
        width 720 * rpx
        height 80 * rpx
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        box-shadow 0px 6px 12px rgba(0,0,0,0.05)
        .icon
          width 40 * rpx
          height 40 * rpx
          margin-top 20 * rpx
          margin-left 36 * rpx
        .input
          width 600 * rpx
          float right
          font-size 16px
          margin-top 18 * rpx
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
      .part
        position absolute
        top 16 * rpx
        width auto
        height auto
        .btn-list
          width 192 * rpx
          height auto
          display inline-block
          margin-left 16 * rpx
          .btn
            margin-top 16 * rpx
            background-color white
            border-radius 88 * rpx
            width 192 * rpx
            height 80 * rpx
            text-align center
            .btn-text
              font-size 32 * rpx
              line-height 80 * rpx
              width 180 * rpx
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
          .color-1
            background-color white
          .color-2
            background-color #19C1DE
          .txt-color-1
            color white
          .txt-color-2
            color black
        .doctor-list
          border-radius 8px
          background #fff
          width 512 * rpx
          height auto
          display inline-block
          margin-top 16 * rpx
          margin-left 16 * rpx
          position absolute
          .doctor
            width 448 * rpx
            height 96 * rpx
            background #fff
            margin-left 32 * rpx
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            display flex
            border-bottom 2 * rpx solid #E5E5E5
            .text
              font-size 16px
              width 400 * rpx
              line-height 96 * rpx
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
            .jump-info
              position absolute
              margin-left 432 * rpx
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
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
          .doctor-1
            width 384 * rpx
            height 96 * rpx
            background #fff
            margin-left 16 * rpx
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            display flex
            border-bottom 2 * rpx solid #E5E5E5
            .text
              font-size 16px
              margin-left 32 * rpx
              line-height 96 * rpx
            .jump-info
              position absolute
              margin-left 400 * rpx
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
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
          .last
            border-bottom 0
</style>
