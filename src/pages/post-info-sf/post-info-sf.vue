<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .box
      .top
        .top-box
          .text-1
            .text-left-1 快递公司
            .text-right-1 顺丰速运
          .text-2
            .text-left-2 物流单号
            .text-right-2 {{routeList.mailno}}
        .bottom-box
          .bottom-text(@tap="phone()") 联系客服
          .img
            img(src="https://nontax-cdn.yuluoo.com/hospital-post-lxkf.png")
      .center
        .center-box
          .box-item(v-for="(item,index) in showList")
            .item-time
              .time-text {{item.accept_time}}
            .item-line(:class="[index === (showList.length-1) ? 'item-line2' : index != 0 ? 'item-line1' : '']")
              .line-q-1(v-if="index == 0")
              .line-q-2(v-if="index != 0")
              .item-text {{item.accept_address}} {{item.remark}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        num: 1,
        data: '',
        route: '',
        routeList: '',
        showList: []
      }
    },

    computed: {},

    components: {},
    methods: {
      phone() {
        RPC.phone('95338')
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      this.routeList = JSON.parse(event.routeList)
      this.showList = this.routeList.routeList
      // let list = this.routeList.routeList
      console.log(this.showList)
      for (let i = 0; i < this.showList.length; i++) {
        if (this.showList[i].accept_time) {
          this.showList[i].accept_time = this.showList[i].accept_time.substring(5, 16)
        }
      }
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
        .top
          width 720 * rpx
          display flex
          justify-content space-between
          padding 12 * rpx 0 12 * rpx 0
          border-radius 8px
          margin-left 16 * rpx
          background-color white
          .top-box
            margin-left 32 * rpx
            display inline-block
            .text-1
              height 64 * rpx
              .text-left-1
                line-height 64 * rpx
                font-size 28 * rpx
                color #707070
                display inline-block
              .text-right-1
                margin-left 32 * rpx
                line-height 64 * rpx
                font-size 28 * rpx
                color #000000
                display inline-block
            .text-2
              height 64 * rpx
              .text-left-2
                line-height 64 * rpx
                font-size 28 * rpx
                color #707070
                display inline-block
              .text-right-2
                margin-left 32 * rpx
                line-height 64 * rpx
                font-size 28 * rpx
                color #000000
                display inline-block
          .bottom-box
            display inline-block
            margin-right 32 * rpx
            margin-top 15 * rpx
            height 96 * rpx
            .img
              width 48 * rpx
              height 48 * rpx
              float right
              margin-right 16 * rpx
              margin-top 24 * rpx
              img
                width 48 * rpx
                height 48 * rpx
            .bottom-text
              line-height 96 * rpx
              font-size 28 * rpx
              float right
        .center
          padding 32 * rpx 0 36 * rpx 0
          margin-top 16 * rpx
          width 720 * rpx
          border-radius 8px
          margin-left 16 * rpx
          background white
          .center-box
            .box-item
              display flex
              margin-left 32 * rpx
              width 720 * rpx
              .item-time
                width 125 * rpx
                margin-bottom 20 * rpx
                .time-text
                  font-size 28 * rpx
              .item-line
                position relative
                border-left 2 * rpx solid #19C1DE
                padding-bottom 60 * rpx
                .line-l-1
                  margin-left 14 * rpx
                  width 0
                  height 5 * rpx
                  border-right 2 * rpx solid #19C1DE
                .line-l-0
                  margin-left 14 * rpx
                  width 0
                  height 5 * rpx
                  border-right 2 * rpx solid #E5E5E5
                .line-q-1
                  position absolute
                  top -2 * rpx
                  left -16 * rpx
                  border-radius 50%
                  width 32 * rpx
                  height 32 * rpx
                  background #19C1DE
                .line-q-2
                  position absolute
                  top -2 * rpx
                  left -16 * rpx
                  border-radius 50%
                  width 32 * rpx
                  height 32 * rpx
                  background #E5E5E5
                .line-l-2
                  margin-left 14 * rpx
                  width 0
                  border-right 2 * rpx solid #19C1DE
                .line-l-3
                  margin-left 14 * rpx
                  width 0
                  border-right 2 * rpx solid #E5E5E5
                .item-text
                  width 515 * rpx
                  margin-left 32 * rpx
                  margin-top -6 * rpx
                  line-height 1.5
                  font-size 28 * rpx
              .item-line1
                border-left 2 * rpx solid #E5E5E5
              .item-line2
                border none
</style>
