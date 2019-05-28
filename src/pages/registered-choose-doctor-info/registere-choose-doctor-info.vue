<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .selectd_box_info
      .peopleInfo
        .text 就诊人
        .text-1 {{name}}
      .list
        .imgUrl
          img(:src="doctorData.doctorHeadImg" @tap="showImg(doctorData.doctorHeadImg)")
        .doctor
          .doctorName {{doctorData.name}}
            .doctorType
              .typeName {{doctorData.registerType}}
          .doctorLevel {{doctorData.doctorLevel}}
        .money
          .money-1
            img(@tap="sc", mode="widthFix", :src="scNum==0?'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star-qx.png':'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star.png'")
          .num ￥{{doctorData.price}}
      .list-doctor-w
        .list-doctor-info
          .info-btn(@click="open") 医生简介
          .jump-info-1(:class="numTime==1?'jump-info-2':'jump-info-1'")
        .info(v-show="numTime==2")
          .info-box
            .info-text-1 {{inforDoctor1}}
            .info-text-2 {{doctorIntro1}}
            .info-text-3 {{inforDoctor2}}
            .info-text-4 {{doctorIntro2}}
      .box
        .text-data
          .text-1(v-for="(item,index) in list" @click="change1(item,index)" :id="index" :class="num==index?'text-111':'text-222'")
            .text-11 {{item.data}}
            .text-12 {{item.time}}
            .text-13 余号{{weekNumList[index].num}}
      .time-list
        .time-list-item(v-for="item in periodList" :style="(index+1)==periodList.length?'border-bottom: 0':''")
          .img
            img(mode="widthFix", src="https://nontax-cdn.yuluoo.com/hainanhospital-registered-time.png")
          .time-list-item-txt {{item.timeValue}}
          .time-list-item-btn(@tap="sh(item)" class="red")
            .content 预约
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        scNum: 0,
        numTime: 1,
        num: 0,
        activeColor: '',
        peopleDate: '',
        name: '',
        list: [],
        periodList: [], // 号源
        a: '0',
        departmentData: {}, // 上个页面传来的科室数据
        doctorData: {}, // 上个页面传来的医生数据
        weekNumList: [{num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}], // 余号
        chooseDataString: '', // 当前选择的日期
        tipStatus: '',
        tipShow: '',
        onShowFlag: 0,
        inforDoctor1: '',
        inforDoctor2: '',
        doctorIntro1: '',
        doctorIntro2: ''
      }
    },

    computed: {
    },

    components: {},
    methods: {
      showImg(imgUrl) {
        // 退出查看图片不需要重新加载数据
        this.onShowFlag = 1
        wx.previewImage({
          current: imgUrl, // 当前显示图片的http链接
          urls: [imgUrl] // 需要预览的图片http链接列表
        })
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      // 拉取7天余号
      async listNum() {
        let self = this
        // 初始化数据
        self.periodList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listNum',
            data: {
              asRowid: self.doctorData.asRowid,
              patientId: self.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.weekNumList) {
            self.weekNumList = res.data.weekNumList
            self.listPeriod()
          }
        } catch (err) {
          // 查询失败，初始化数据
          self.weekNumList = [{num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}, {num: '0'}]
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
      // 拉取号源
      async listPeriod() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listPeriod',
            data: {
              asRowid: self.doctorData.asRowid,
              date: self.chooseDataString,
              start: 1,
              requestQty: 100,
              patientId: self.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          self.periodList = res.data.periodList
          if (res.data.weekNumList) {
            self.weekNumList = res.data.weekNumList
          }
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
      sc() {
        let self = this
        console.log(self.departmentData)
        console.log(self.doctorData)
        if (self.scNum === 0) {
          wx.showModal({
            title: '提示',
            content: '您是否要收藏' + self.doctorData.name + '医生？',
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#19C1DE',
            cancelColor: '#000000',
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log('用户点击确定')
                let data = {}
                data.address = self.departmentData.address
                data.deptId = self.departmentData.id
                data.deptName = self.departmentData.name
                data.doctorId = self.doctorData.id
                data.doctorName = self.doctorData.name
                data.doctorImage = self.doctorData.doctorHeadImg
                data.doctorJobTitle = self.doctorData.doctorLevel
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
            content: '您是否要取消收藏' + self.doctorData.name + '医生？',
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#19C1DE',
            cancelColor: '#000000',
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log('用户点击确定')
                self.notCollectget()
                self.scNum = 0
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      async notCollectget() {
        await RPC.notCollectget(this.doctorData.id)
        RPC.toShow('取消成功！')
      },
      async collectDoctor(data) {
        await RPC.collectDoctor(data)
        RPC.toShow('收藏成功！')
      },
      change1(item, id) {
        this.num = id
        this.chooseDataString = item.timeString
        this.listNum()
      },
      // 确定锁号
      async sh(data) {
        let self = this
        wx.showModal({
          title: '预约时段',
          content: self.chooseDataString + ' ' + data.timeValue,
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            console.log(res)
            if (res.confirm) {
              console.log('用户点击确定')
              self.createRegisteredNo(data)
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      // 锁号
      async createRegisteredNo(data) {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/createRegisteredNo',
            data: {
              date: self.chooseDataString,
              timePeriod: data.timeValue,
              timePeriodNum: data.sn,
              asRowid: self.doctorData.asRowid,
              amount: data.price,
              address: self.departmentData.address,
              doctorLevel: self.doctorData.doctorLevel,
              doctorName: self.doctorData.name,
              sectionName: self.departmentData.name,
              patientId: self.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          wxAsync.navigateTo({
            url: '../registered-confirm/main?orderNo=' + res.data.orderNo + '&wxCallbackUrl=' + res.data.wxCallbackUrl + '&chooseDataString=' + self.chooseDataString + '&price=' + data.price + '&doctorData=' + JSON.stringify(self.doctorData) + '&departmentData=' + JSON.stringify(self.departmentData) + '&peopleDate=' + JSON.stringify(self.peopleDate) + '&hData=' + JSON.stringify(data)
          })
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          } else if (err.errcode === 401) {
            wx.showModal({
              title: '提示！',
              content: '存在未支付订单，支付完成后才能继续挂号',
              confirmText: '去支付',
              cancelText: '取消',
              confirmColor: '#19C1DE',
              cancelColor: '#000000',
              success(res) {
                console.log(res)
                if (res.confirm) {
                  wxAsync.navigateTo({
                    url: '../guahaoRecord-list/main?type=1'
                  })
                } else {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      },
      open() {
        if (this.numTime === 1) {
          this.numTime = 2
        } else {
          this.numTime = 1
        }
      },
      async click() {
        this.scNum = await RPC.collectgetOrNot(this.doctorData.id)
      }
    },
    onShow() {
      if (this.onShowFlag === 1) {
        this.onShowFlag = 0
      } else {
        this.listNum()
      }
    },
    onLoad(event) {
      let self = this
      this.peopleDate = JSON.parse(event.peopleDate)
      this.departmentData = JSON.parse(event.departmentData)
      this.name = this.peopleDate.name + '(' + this.peopleDate.outpatientNo + ')'
      self.doctorData = JSON.parse(event.data)
      self.chooseDataString = event.chooseDataString
      self.num = event.chooseNum
      wx.setNavigationBarTitle({
        title: self.doctorData.name
      })
      console.log(self.doctorData)
      console.log(self.num)
      this.list = []
      let b = new Date()
      let a = {}
      a.time = (b.getMonth() + 1) + '/' + b.getDate()
      a.data = '今日'
      a.timeString = RPC.getTime(b)
      this.list.push(a)
      for (let i = 1; i < 7; i++) {
        let data = new Date()
        data.setTime(data.getTime() + i * 24 * 60 * 60 * 1000)
        let item = {}
        item.time = (data.getMonth() + 1) + '/' + data.getDate()
        if (data.getDay() === 0) {
          item.data = '周日'
        }
        if (data.getDay() === 1) {
          item.data = '周一'
        }
        if (data.getDay() === 2) {
          item.data = '周二'
        }
        if (data.getDay() === 3) {
          item.data = '周三'
        }
        if (data.getDay() === 4) {
          item.data = '周四'
        }
        if (data.getDay() === 5) {
          item.data = '周五'
        }
        if (data.getDay() === 6) {
          item.data = '周六'
        }
        item.timeString = RPC.getTime(data)
        this.list.push(item)
      }
      // this.listPeriod(2)
      // this.listNum()
      let arr = []
      if (self.doctorData.desc) {
        arr = self.doctorData.desc.split('|')
        console.log(arr)
        self.inforDoctor1 = arr[0].substr(0, 5)
        self.doctorIntro1 = arr[0].substr(5, arr[0].length)
        self.inforDoctor2 = arr[1].substr(0, 5)
        self.doctorIntro2 = arr[1].substr(5, arr[1].length)
      }
      this.click()
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
      background #F0EFF5
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
      .selectd_box_info
        position absolute
        top 16 * rpx
        .peopleInfo
          margin-top 16 * rpx
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
        .list
          margin-top 16 * rpx
          width 720 * rpx
          height 160 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          position relative
          display flex
          -webkit-box-align center
          -webkit-align-items center
          align-items center
          .imgUrl
            margin-left 32 * rpx
            width 64 * rpx
            height 96 * rpx
            background rgba(0, 0, 0, 0)
            border 0.5px solid rgba(237, 237, 237, 1)
            img
              width 64 * rpx
              height 96 * rpx
              overflow hidden
          .doctor
            margin-left 16 * rpx
            .doctorName
              font-size 18px
              font-weight bold
              height 50 * rpx
              .doctorType
                float right
                background-color #19C1DE
                border-radius 12px
                width 80 * rpx
                height 50 * rpx
                display inline-block
                margin-left 20 * rpx
                .typeName
                  margin-left 18 * rpx
                  font-size 11px
                  line-height 50 * rpx
                  color white
            .doctorLevel
              margin-top 12 * rpx
              font-size 14px
              color #707070
          .money
            margin-left 320 * rpx
            .money-1
              position absolute
              float right
              top 32 * rpx
              width 48 * rpx
              height 48 * rpx
              img
                width 100%
                height 100%
            .num
              position absolute
              right 32 * rpx
              margin-top 18 * rpx
              font-size 32 * rpx
              color #19C1DE
        .list-doctor-w
          margin-top 16 * rpx
          margin-left 16 * rpx
          padding-bottom 36 * rpx
          background #fff
          width 720 * rpx
          height auto
          border-radius 16 * rpx
          .list-doctor-info
            width 656 * rpx
            margin-left 32 * rpx
            height 80 * rpx
            line-height 80 * rpx
            background #fff
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            position relative
            display flex
            .info-btn
              color #19C1DE
              font-size 14px
              position absolute
              right 32 * rpx
            .jump-info-1
              position absolute
              right 0
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
                -webkit-transform matrix(0.71, -0.71, 0.71, 0.71, 0, 0)
                transform matrix(0.71, -0.71, 0.71, 0.71, 0, 0)
                position relative
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
            .jump-info-2
              position absolute
              right 0
              top 36 * rpx
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
                -webkit-transform matrix(0.71, 0.71, 0.71, -0.71, 0, 0)
                transform matrix(0.71, 0.71, 0.71, -0.71, 0, 0)
                position relative
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
          .info
            width 648 * rpx
            height auto
            background #fff
            margin-left 32 * rpx
            .info-box
              width 648 * rpx
              height auto
              .info-text-1
                font-size 16px
                font-weight bold
              .info-text-2
                font-size 14px
                width 648 * rpx
                text-indent 55 * rpx
                margin-top 16 * rpx
              .info-text-3
                font-size 16px
                font-weight bold
                margin-top 32 * rpx
              .info-text-4
                width 648 * rpx
                font-size 14px
                text-indent 55 * rpx
                margin-top 16 * rpx
      .box
        margin-top 16 * rpx
        width 720 * rpx
        height auto
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        box-shadow:0px 6px 12px rgba(0,0,0,0.05);
        .text-data
          width 720 * rpx
          height 160 * rpx
          text-align center
          .text-111
            color #19C1DE
          .text-222
            color black
          .text-1
            width 102.8 * rpx
            margin-top 12 * rpx
            display inline-block
            .text-11
              margin-top 16 * rpx
              font-size 32 * rpx
            .text-12
              margin-top 4 * rpx
              font-size 22 * rpx
            .text-13
              margin-top 8 * rpx
              font-size 22 * rpx
        .btn
          margin-top 48 * rpx
          .btn-1
            width 208 * rpx
            height 80 * rpx
            border-radius 20px
            background-color white
            display inline-block
            margin-left 16 * rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.05);
            .txt-1
              text-align center
              font-size 18px
              line-height 80 * rpx
          .btn-2
            width 208 * rpx
            height 80 * rpx
            border-radius 20px
            background-color white
            display inline-block
            margin-left 32 * rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.05);
            .txt-2
              text-align center
              font-size 18px
              line-height 80 * rpx
          .color-1
            background-color white
          .color-2
            background-color #0077FF
          .txt-color-1
            color white
          .txt-color-2
            color black
      .time-list
        width 720 * rpx
        height auto
        border-radius 8px
        background white
        margin-left 16 * rpx
        margin-top 16 * rpx
        margin-bottom 38 * rpx
        box-shadow 0 * rpx 12 * rpx 24 * rpx rgba(0,0,0,0.05)
        .time-list-item
          margin-left 32 * rpx
          width 648 * rpx
          height 112 * rpx
          background #fff
          display flex
          border-bottom 2 * rpx solid #E5E5E5
          .img
            margin-top 32 * rpx
            display inline-block
            width 48 * rpx
            height 48 * rpx
            img
              width 100%
              height 100%
          .time-list-item-txt
            width 190 * rpx
            line-height 112 * rpx
            display inline-block
            font-size 16px
            margin-left 32 * rpx
          .time-list-item-btn
            margin-top 32 * rpx
            margin-left 263 * rpx
            display inline-block
            width 112 * rpx
            height 48 * rpx
            background #19C1DE
            border-radius 8px
            .content
              margin-left 32 * rpx
              line-height 48 * rpx
              color white
              font-size 12px
            .blue
              color #19C1DE
            .red
              color #F10000
</style>
