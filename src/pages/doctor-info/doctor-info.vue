<template lang="pug">
  .main
    .bg
    .top
      .list
        .imgUrl
          img(:src="data.doctorImage" @tap="showImg(data.doctorImage)")
        .doctor
          .doctorName {{data.doctorName}}
          .money
            img(@tap="sc", mode="widthFix", :src="scNum==0?'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star-qx.png':'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star.png'")
            <!--.doctorType-->
              <!--.typeName 专家-->
          .doctorLevel {{data.doctorJobTitle}}
      .line
      .list-doctor-info
        <!--.text {{data.doctorGoodat}}-->
        .info-btn(@tap="open") 挂号
        button.share(open-type="share") 推荐给朋友
    .info
      .info-box
        .info_text-1 {{inforDoctor1}}
        .info-text-2  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp{{doctorIntro1}}
        .info_text-1(style="margin-top:16px") {{inforDoctor2}}
        .info-text-2  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp{{doctorIntro2}}
    .backIndex(@tap="navigateToIndex") 返回首页
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        scNum: 0,
        a: '0',
        data: '',
        inforDoctor1: '',
        inforDoctor2: '',
        doctorIntro1: '',
        doctorIntro2: '',
        dept: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      open() {
        let self = this
        wx.navigateTo({
          url: '../registered-choose-doctor-1/main?name=' + self.data.doctorName + '&address=' + self.dept.address + '&deptId=' + self.dept.deptId + '&doctorId=' + self.data.doctorId
        })
      },
      navigateToIndex() {
        wx.navigateTo({
          url: '../index/main'
        })
      },
      showImg(imgUrl) {
        wx.previewImage({
          current: imgUrl, // 当前显示图片的http链接
          urls: [imgUrl] // 需要预览的图片http链接列表
        })
      },
      sc() {
        let self = this
        if (self.scNum === 0) {
          wx.showModal({
            content: '您是否要收藏此医生？',
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#19C1DE',
            cancelColor: '#000000',
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log('用户点击确定')
                let data = {}
                data.address = ''
                data.deptId = self.dept.deptId
                data.deptName = self.dept.deptName
                data.doctorId = self.data.doctorId
                data.doctorName = self.data.doctorName
                data.doctorImage = self.data.doctorImage
                data.doctorJobTitle = self.data.doctorJobTitle
                console.log(data)
                self.collectDoctor(data)
                self.scNum = 1
              } else {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您是否要取消收藏此医生？',
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#007FFF',
            cancelColor: '#000000',
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log('用户点击确定')
                self.notCollectget(self.data.doctorId)
                self.scNum = 0
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      async notCollectget() {
        await RPC.notCollectget(this.data.doctorId)
        RPC.toShow('取消成功！')
      },
      async collectDoctor(data) {
        await RPC.collectDoctor(data)
        RPC.toShow('收藏成功！')
      },
      async click() {
        this.scNum = await RPC.collectgetOrNot(this.data.doctorId)
      }
    },
    onLoad(event) {
      console.log(event)
      this.data = JSON.parse(event.data)
      console.log(this.data)
      this.dept = JSON.parse(event.dept)
      console.log(this.dept)
      let arr = []
      this.inforDoctor1 = ''
      this.doctorIntro1 = ''
      this.inforDoctor2 = ''
      this.doctorIntro2 = ''
      if (this.data.doctorIntro) {
        arr = this.data.doctorIntro.split('|')
      }
      console.log(arr)
      if (arr.length > 0) {
        this.inforDoctor1 = arr[0].substr(0, 5)
        this.doctorIntro1 = arr[0].substr(5, arr[0].length)
        this.inforDoctor2 = arr[1].substr(0, 5)
        this.doctorIntro2 = arr[1].substr(5, arr[1].length)
      }
      console.log(this.inforDoctor1)
      console.log(this.doctorIntro1)
      console.log(this.inforDoctor2)
      console.log(this.doctorIntro2)
      this.click()
    },
    onReady() {
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
      width 750 * rpx
      padding-bottom 54 * rpx
      background #F0EFF5
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-bottom 16 * rpx
      .top
        position absolute
        top 16 * rpx
        width 720 * rpx
        height auto
        border-radius 16 * rpx
        box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
        margin-left 16 * rpx
        background #fff
        .list
          border-top-right-radius 16 * rpx
          border-top-left-radius 16 * rpx
          height 160 * rpx
          background #fff
          display flex
          position relative
          -webkit-box-align center
          -webkit-align-items center
          align-items center
          .imgUrl
            margin-left 32 * rpx
            width 118 * rpx
            height 176 * rpx
            margin-top 68 * rpx
            margin-right 36 * rpx
            img
              width 118 * rpx
              height 176 * rpx
              overflow hidden
          .doctor
            margin-left 16 * rpx
            .doctorName
              font-size 18px
              font-weight bold
              height 50 * rpx
              display inline-block
            .money
              position absolute
              right 32 * rpx
              width 48 * rpx
              height 48 * rpx
              display inline-block
              img
                width 100%
                height 100%
              .doctorType
                background-color red
                border-radius 24 * rpx
                width 80 * rpx
                height 50 * rpx
                display inline-block
                margin-left 20 * rpx
                .typeName
                  margin-left 18 * rpx
                  font-size 22 * rpx
                  color #FFFFFF
                  line-height 50 * rpx
            .doctorLevel
              margin-top 12 * rpx
              font-size 28 * rpx
              color #707070
        .line
          width 496 * rpx
          height 2 * rpx
          background-color #E5E5E5
          position absolute
          right 32 * rpx
        .list-doctor-info
          margin-left 32 * rpx
          background #fff
          .text
            width 544 * rpx
            margin-left 93 * rpx
            font-size 24 * rpx
            color #707070
            padding-bottom 16 * rpx
          .info-btn
            display inline-block
            background-color #19C1DE
            border-radius 16 * rpx
            width 160 * rpx
            height 64 * rpx
            line-height 64 * rpx
            margin-top 16 * rpx
            margin-bottom 16 * rpx
            float right
            margin-right 32 * rpx
            text-align center
            right 46 * rpx
            color  #FFFFFF
            font-size 32 * rpx
          .share
            display inline-block
            height 64 * rpx
            line-height 64 * rpx
            margin-top 16 * rpx
            margin-bottom 16 * rpx
            float right
            margin-right 32 * rpx
            background #19C1DE
            color #FFFFFF
            font-size 28 * rpx
            text-align center
            border-radius 16 * rpx
      .info
        width 720 * rpx
        background #fff
        border-radius 16 * rpx
        margin-left 16 * rpx
        margin-top -52 * rpx
        .info-box
          width 720 * rpx
          padding 20 * rpx 32 * rpx 32 * rpx
          .info_text-1
            width 720 * rpx
            height 80 * rpx
            line-height 80 * rpx
            font-size 32 * rpx
            font-weight bold
            text-align left
          .info-text-2
            width 656 * rpx
            font-size 28 * rpx
          .info-text-3
            font-size 32 * rpx
            font-weight bold
            margin-top 32 * rpx
          .info-text-4
            width 656 * rpx
            font-size 28 * rpx
            text-indent 55 * rpx
            margin-top 16 * rpx
      .backIndex
        text-align center
        margin-left 32 * rpx
        margin-top 280 * rpx
        margin-bottom 54 * rpx
        width 690 * rpx
        height 88 * rpx
        line-height 88 * rpx
        color #FFFFFF
        font-size 36 * rpx
        background #19C1DE
        box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
        border-radius 44 * rpx
</style>
