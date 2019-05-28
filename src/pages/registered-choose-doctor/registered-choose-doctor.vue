<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .selected_box
      .peopleInfo
        .text 就诊人
        .text-1 {{name}}
      .box
        .text-data
          .text-1(v-for="(item,index) in list" @tap="change1(item,index)" :id="index" :class="num==index?'text-111':'text-222'")
            .text-11 {{item.data}}
            .text-12 {{item.time}}
      .listView
        .list(@tap="gotoInfo(item)" v-for="(item,index) in doctorList" :style="(index+1)==doctorList.length?'border-bottom: 0':''")
          .imgUrl
            img(:src="item.doctorHeadImg" @tap.stop="showImg(item.doctorHeadImg)")
          .doctor
            .doctorName {{item.name}}
              .doctorType
                .typeName {{item.registerType}}
            .doctorLevel {{item.doctorLevel}}
          .money
            .money-1
              .text {{item.price}}元
            .num
              .text-num {{item.timePeriod}}余号：{{item.num}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        numTime: 1,
        num: 0,
        activeColor: '',
        list: [],
        doctorList: [],
        a: '0',
        chooseDataString: '',
        chooseNum: 0,
        peopleDate: '',
        name: '',
        data: {},
        onShowFlag: 0
      }
    },

    computed: {},

    components: {},
    methods: {
      showImg(imgUrl) {
        // 退出查看图片后不重新加载数据
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
      change1(item, id) {
        this.num = id
        console.log(item.timeString)
        this.chooseDataString = item.timeString
        this.chooseNum = id
        this.listDoctor()
      },
      gotoInfo(data) {
        let self = this
        let peopleDate = JSON.stringify(this.peopleDate)
        let departmentData = JSON.stringify(this.data)
        wx.navigateTo({
          url: '../registered-choose-doctor-info/main?data=' + JSON.stringify(data) + '&chooseDataString=' + self.chooseDataString + '&chooseNum=' + self.chooseNum + '&peopleDate=' + peopleDate + '&departmentData=' + departmentData
        })
      },
      async listDoctor() {
        let self = this
        self.doctorList = []
        if (self.chooseDataString === '') {
          let b = new Date()
          self.chooseDataString = RPC.getTime(b)
        }
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listDoctor',
            data: {
              sectionId: self.data.id,
              registerType: '',
              date: self.chooseDataString,
              start: 1,
              requestQty: 100,
              patientId: self.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          let list = res.data.doctorList
          for (let i = 0, length = list.length; i < length; i++) {
            list[i].timePeriod = list[i].timePeriod.substring(0, 2)
          }
          self.doctorList = list
        } catch (err) {
          console.log(err)
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
      setWeekData() {
        let self = this
        self.list = []
        let b = new Date()
        let a = {}
        a.time = (b.getMonth() + 1) + '/' + b.getDate()
        a.data = '今日'
        a.timeString = RPC.getTime(b)
        // 初始化日期选择
        self.chooseDataString = a.timeString
        self.chooseNum = 0
        self.num = 0
        self.list.push(a)
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
          self.list.push(item)
        }
      }
    },
    onShow() {
      if (this.onShowFlag === 1) {
        this.onShowFlag = 0
      } else {
        this.listDoctor()
      }
    },
    onLoad(event) {
      this.peopleDate = JSON.parse(event.peopleDate)
      this.name = this.peopleDate.name + '(' + this.peopleDate.outpatientNo + ')'
      this.data = JSON.parse(event.data)
      wx.setNavigationBarTitle({
        title: this.data.name
      })
      this.setWeekData()
      // this.listDoctor()
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
      .selected_box
        position absolute
        top 16 * rpx
        .peopleInfo
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
        .box
          margin-top 16 * rpx
          width 720 * rpx
          height 112 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          box-shadow:0px 6px 12px rgba(0,0,0,0.05);
          .text-data
            width 720 * rpx
            text-align center
            .text-111
              color #19C1DE
            .text-222
              color black
            .text-1
              width 102.8 * rpx
              margin-top 16 * rpx
              display inline-block
              .text-11
                font-size 32 * rpx
              .text-12
                margin-top 4 * rpx
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
            background-color #19C1DE
          .txt-color-1
            color white
          .txt-color-2
            color black
        .listView
          width 720 * rpx
          margin-top 32 * rpx
          background #fff
          border-radius 16 * rpx
          margin-left 16 * rpx
          margin-bottom 88 * rpx
          .list
            width 648 * rpx
            height 160 * rpx
            background #fff
            margin-left 32 * rpx
            position relative
            display flex
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            border-bottom 2 * rpx solid #E5E5E5
            .imgUrl
              width 64 * rpx
              height 96 * rpx
              background rgba(0, 0, 0, 0)
              border 0.5px solid rgba(237, 237, 237, 1)
              img
                width 64 * rpx
                height 96 * rpx
                overflow hidden
            .doctor
              width 400 * rpx
              margin-left 16 * rpx
              .doctorName
                width 236 * rpx
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
                    font-size 22 * rpx
                    line-height 50 * rpx
                    color white
              .doctorLevel
                margin-top 12 * rpx
                font-size 28 * rpx
                color #707070
            .money
              width 350 * rpx
              .money-1
                float right
                width 200 * rpx
                .text
                  float right
                  font-size 32 * rpx
                  color #19C1DE
              .num
                float right
                width 200 * rpx
                margin-top 18 * rpx
                .text-num
                  float right
                  font-size 28 * rpx
                  color #707070
</style>
