<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .none(v-if="messageList.length === 0") 暂无相关信息
    .examination-list
      .box-list-1(v-if="messageList.length > 0")
        .box(v-for="(item, index) in messageList",:class="[index%2 !== 0 ? 'activeBackground' : '']")
          .box-relation
            .name {{item.title}}
            .time
              .text {{item.createTime}}
          .box-relation-1
            .content(v-if="item.type == '1'") {{item.content}}
            .content(v-if="item.type == '3'") {{item.content.MessageContent}}
            .content-box(v-if="item.type == '3'",v-for="(item1, index1) in item.content.SubList")
              .name {{item1.SubTitle}}
              .value {{item1.SubContent}}
</template>

<script>
  // import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: true,
        click: false,
        MsgStatus: '',
        messageList: [],
        show: true,
        peopleData: {},
        loadType: true,
        pageNo: 1,
        pageSize: 50
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
      showPage() {
        this.activeDisplay1 = true
      },
      hidePage() {
        this.activeDisplay1 = false
      },
      async listMessage() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/message/listMessage',
            data: {
              patientId: self.peopleData.patientId,
              pageNo: this.pageNo,
              pageSize: this.pageSize
            }
          })
          console.log('success')
          console.log(res)
          let list = res.data.messageList
          for (let i = 0, length = list.length; i < length; i++) {
            if (list[i].type === '3') {
              console.log(list[i])
              list[i].content = JSON.parse(list[i].content)
            }
            self.messageList.push(list[i])
          }
          if (list.length < self.pageSize) {
            self.loadType = false
          }
          this.pageNo++
          // self.messageList = res.data.messageList
          // self.show = true
          // self.showPage()
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
    // onReachBottom() {
    //   if (this.loadType) {
    //     this.listMessage()
    //   } else {
    //     wx.showToast({
    //       title: '没有更多数据！',
    //       icon: 'none'
    //     })
    //   }
    // },
    onLoad() {
      this.pageNo = 1
      this.messageList = []
      this.listMessage()
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
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
    height 100%
    background #F0EFF5
    .main
      width 750 * rpx
      overflow hidden
      background #F0EFF5
      text-align center
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
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
      .none
        color #9999
        padding-top 25%
        text-align center
      .examination-list
        padding-bottom 54 * rpx
        position absolute
        top 16 * rpx
        .cardInfo
          width 720 * rpx
          height 96 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          -webkit-box-align center
          -webkit-align-items center
          align-items center
          position relative
          display flex
          .text
            font-size 16px
            margin-left 32 * rpx
            line-height 96 * rpx
          .text-1
            font-size 16px
            margin-left 40 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-left 280 * rpx
            line-height 96 * rpx
            color #C7C7CC
          .jump-info
            padding-right 15px
            position absolute
            margin-left 672 * rpx
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
              top 50%
              margin-top -6 * rpx
              right 2px
        .box-list-1
          width 720 * rpx
          height auto
          margin-left 16 * rpx
          .box
            width 720 * rpx
            margin-top 16 * rpx
            padding-bottom 16 * rpx
            border-radius 16 * rpx
            background-color #EFFDFF
            text-align left
            .box-relation
              margin-left 36 * rpx
              width 648 * rpx
              .name
                display inline-block
                font-weight bold
                padding-top 26 * rpx
                padding-bottom 24 * rpx
                font-size 32 * rpx
                color #19C1DE
              .time
                padding-top 26 * rpx
                width 300 * rpx
                float right
                display inline-block
                .text
                  float right
                  font-size 28 * rpx
                  color #707070
            .box-relation-1
              margin-left 36 * rpx
              width 648 * rpx
              .content
                padding-bottom 16 * rpx
                font-size 28 * rpx
                color #000000
              .content-box
                padding-bottom 16 * rpx
                width 648 * rpx
                display flex
                .name
                  display inline-block
                  font-size 28 * rpx
                  font-weight bold
                .value
                  overflow hidden
                  display inline-block
                  font-size 28 * rpx
          .activeBackground
            background-color #fff
</style>
