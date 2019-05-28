<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
      <!--.box-->
        <!--img.search(src="https://nontax-cdn.yuluoo.com/hainanhospital_news_icon_search.png")-->
        <!--<input type="text" class="input" placeholder="搜索就医指南" />-->
      .none(v-if="list.length == 0") 暂无相关信息
      .list
        .cardInfo(@tap="cardInfo(item)",v-for="(item,index) in list",:class="(index+1)==list.length?'last':''")
          .text {{item.title}}
          .text-1 {{item.author}}
          .text-2 {{item.publishTime}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        list: [],
        login: false,
        num: 1,
        type: ''
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
      cardInfo(item) {
        wx.navigateTo({
          url: '../article-info/main?url=' + encodeURIComponent(item.url)
        })
      },
      async article() {
        let self = this
        self.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/article/list',
            data: {
              type: self.type,
              pageSize: 50,
              page: 1
            }
          })
          console.log('success')
          console.log(res)
          self.list = res.data
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
    onLoad(event) {
      let self = this
      self.list = []
      console.log(event)
      // 1是新闻公告, 2是就医导诊, 4是使用帮助
      self.type = event.type
      if (self.type === '2') {
        console.log(11111)
        wx.setNavigationBarTitle({
          title: '就医指南'
        })
      } else if (self.type === '4') {
        wx.setNavigationBarTitle({
          title: '使用帮助'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '新闻公告'
        })
      }
      self.article()
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
        padding-top 16 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        /*.box
          margin-top 16 * rpx
          width 720 * rpx
          height 80 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          box-shadow:0px 6px 12px rgba(0,0,0,0.05);
          .search
            width 40 * rpx
            height 40 * rpx
            margin-top 20 * rpx
            margin-left 36 * rpx
          .input
            width 600 * rpx
            float right
            font-size 16px
            margin-top 18 * rpx*/
        .none
          color #9999
          position absolute
          top 50%
          width 100%
          text-align center
        .list
          margin-top 16 * rpx
          width 720 * rpx
          height auto
          border-radius 8px
          position absolute
          background #fff
          margin-left 16 * rpx
          .cardInfo
            margin-top 32 * rpx
            margin-left 32 * rpx
            padding-bottom 32 * rpx
            width 648 * rpx
            background #fff
            align-items center
            border-bottom 2 * rpx dashed #E5E5E5
            .text
              font-size 16px
              font-weight bold
            .text-1
              display inline-block
              font-size 24 * rpx
              color #707070
            .text-2
              display inline-block
              margin-left 32 * rpx
              font-size 24 * rpx
              color #707070
          .last
            border-bottom 0
</style>
