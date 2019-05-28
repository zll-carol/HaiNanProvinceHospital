<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .examination-list(v-show="activeDisplay1")
      .cardInfo
        .patient_row
          .text 就诊人
          .text-1 {{peopleData.name}}({{peopleData.outpatientNo}})
        picker.selected_row(v-if="num=='1'" @change="bindPickerChange" :value="index1" :range="rangeArray")
          .left {{typeDes}}
          img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png")
      .box-list-1(v-if="num=='1'&&show")
        .none(v-if="inspectionReportList.length == 0") 暂无相关信息
        .box(v-for="(item, index) in inspectionReportList",:class="[index%2 !== 0 ? 'activeBackground' : '']",@tap="goInfo(item)")
          .box-relation
            .name {{item.name}}
          .box-relation-1
            .name 报告时间: {{item.time}}
      .box-list-2(v-if="num=='2'&&show")
        .box(v-for="(item, index) in checkAppointmentList")(@tap="goInfo(item)")
          .box-relation
            .name {{item.title}}
          .box-relation-1
            .doctor-name
              .name-1 医生:
              .name-2 {{item.doctorName}}（{{item.sectionName}}）
            .time-name-1
              .name-1 检查部位:
              .name-2 {{item.advice}}
            .time-name
              .name-1 预约时间:
              .name-2 {{item.oldTime}}
            .btn(:style="item.state=='0'?'':'opacity: 0.4'", @tap.stop="changeTime(item)")
              .text(:style="item.state=='0'?'':'opacity: 0.6'") 调整时间
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        activeDisplay1: false,
        tipShow: '',
        MsgStatus: '',
        num: '',
        list: [{click: false}, {click: false}],
        click: false,
        peopleData: {},
        checkAppointmentList: [], // 检查调整列表
        inspectionReportList: [], // 检查报告列表
        show: false,
        pageNo: 1,
        pageSize: 10,
        loadType: true,
        typeDes: '全部报告',
        rangeArray: [ '全部报告', '检验报告', '检查报告' ],
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
      showPage() {
        this.activeDisplay1 = true
      },
      hidePage() {
        this.activeDisplay1 = false
      },
      bindPickerChange(event) {
        console.log(event)
        console.log(event.mp.detail.value)
        this.inspectionReportList = []
        this.pageNo = 1
        this.type = event.mp.detail.value
        this.typeDes = this.rangeArray[this.type]
        this.listInspectionReport()
      },
      changeTime(item) {
        // wx.navigateTo({
        //   url: '../examination-changeTime/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData)
        // })
        if (item.state === '0') {
          wx.navigateTo({
            url: '../examination-changeTime/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData)
          })
        }
      },
      goInfo(item) {
        if (this.num === '2') {
          wx.navigateTo({
            url: '../examination-list-info/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData)
          })
        } else {
          wx.navigateTo({
            url: '../examination-detail/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData) + '&type=0'
          })
        }
      },
      async listCheckAppointment() {
        let self = this
        self.MsgStatus = ''
        self.hidePage()
        self.checkAppointmentList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listCheckAppointment',
            data: {
              patientId: self.peopleData.patientId,
              // patientId: 7631414,
              // patientId: 2531,
              pageNo: 1,
              pageSize: 50
            }
          })
          console.log('success')
          console.log(res)
          self.show = true
          self.showPage()
          let datalist = res.data.checkAppointmentList
          if (datalist) {
            for (let i = 0; i < datalist.length; i++) {
              self.checkAppointmentList.push(datalist[i])
            }
          }
          if (datalist.length < self.pageSize) {
            self.loadType = false
          }
          this.pageNo++
          self.show = true
          self.showPage()
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
      async listInspectionReport() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listInspectionReport',
            data: {
              patientId: self.peopleData.patientId,
              // patientId: 7631414,
              // patientId: 2842359,
              // patientId: 2531,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              type: this.type
            }
          })
          console.log('success')
          console.log(res)
          self.show = true
          self.showPage()
          let datalist = res.data.inspectionReportList
          if (datalist) {
            for (let i = 0; i < datalist.length; i++) {
              self.inspectionReportList.push(datalist[i])
            }
          }
          if (datalist.length < self.pageSize) {
            self.loadType = false
          }
          this.pageNo++
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
      }
    },
    onReachBottom() {
      if (this.loadType) {
        if (this.num === '2') {
          this.listCheckAppointment()
        } else {
          this.listInspectionReport()
        }
      } else {
        wx.showToast({
          title: '没有更多数据！',
          icon: 'none'
        })
      }
    },
    onShow() {
      if (this.num === '2') {
        this.pageNo = 1
        this.loadType = true
        this.checkAppointmentList = []
        this.listCheckAppointment()
      }
    },
    onLoad(event) {
      let self = this
      self.type = ''
      self.num = event.type + ''
      self.pageNo = 1
      self.loadType = true
      let title = ''
      self.peopleList = wx.getStorageSync('getHealthCardList')
      self.peopleData = self.peopleList[0]
      console.log(self.num)
      // type=1 为检查报告   type=2 为检查检验
      if (self.num === '1') {
        title = '检查报告'
        self.inspectionReportList = []
        self.listInspectionReport()
      } else {
        title = '检查调整'
      }
      wx.setNavigationBarTitle({
        title: title
      })
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
      height 100%
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
      .examination-list
        padding-bottom 54 * rpx
        position absolute
        top 16 * rpx
        .cardInfo
          width 720 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          position relative
          text-align left
          .patient_row
            height 96 * rpx
            line-height 96 * rpx
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            .text
              font-size 16px
              margin-left 32 * rpx
              width 112 * rpx
              text-align left
              display inline-block
            .text-1
              font-size 16px
              margin-left 26 * rpx
              font-weight bold
              display inline-block
          .selected_row
            padding-top 12 * rpx
            padding-bottom 22 * rpx
            .left
              display inline-block
              margin-left 32 * rpx
              margin-right 518 * rpx
              font-size 28 * rpx
              color #707070
            .right
              display inline-block
              width 20 * rpx
              height 20 * rpx
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
          .none
            color #9999
            padding-top 50%
            text-align center
          .box
            width 720 * rpx
            margin-top 16 * rpx
            border-radius 8px
            background-color #EFFDFF
            text-align left
            .box-relation
              margin-left 36 * rpx
              width 648 * rpx
              border-bottom 2 * rpx solid #E5E5E5
              .name
                font-weight bold
                padding-top 28 * rpx
                padding-bottom 24 * rpx
                font-size 16px
            .box-relation-1
              margin-left 36 * rpx
              width 648 * rpx
              height 96 * rpx
              .name
                line-height 96 * rpx
                font-size 14px
                color #707070
          .activeBackground
            background-color #fff
        .box-list-2
          width 720 * rpx
          height auto
          margin-left 16 * rpx
          .box
            width 720 * rpx
            height 300 * rpx
            margin-top 16 * rpx
            border-radius 8px
            background-color #fff
            text-align left
            .box-relation
              margin-left 36 * rpx
              width 648 * rpx
              height 96 * rpx
              border-bottom 2 * rpx solid #E5E5E5
              .name
                display inline-block
                font-weight bold
                line-height 96 * rpx
                font-size 16px
              .text
                float right
                display inline-block
                color #006FFF
                font-size 14px
                line-height 96 * rpx
            .box-relation-1
              margin-left 36 * rpx
              width 648 * rpx
              height 100 * rpx
              .doctor-name
                .name-1
                  display inline-block
                  width 120 * rpx
                  margin-top 16 * rpx
                  font-size 14px
                  color #707070
                .name-2
                  display inline-block
                  margin-top 16 * rpx
                  margin-left 24 * rpx
                  font-size 14px
                  color #707070
                  white-space nowrap
                  overflow hidden
                  text-overflow ellipsis
              .time-name-1
                .name-1
                  display inline-block
                  width 120 * rpx
                  margin-top 16 * rpx
                  font-size 14px
                  color #707070
                .name-2
                  width 500 * rpx
                  display inline-block
                  margin-top 16 * rpx
                  margin-left 24 * rpx
                  font-size 14px
                  color #707070
                  white-space nowrap
                  overflow hidden
                  text-overflow ellipsis
              .time-name
                display inline-block
                .name-1
                  display inline-block
                  width 120 * rpx
                  margin-top 16 * rpx
                  font-size 14px
                  color #707070
                .name-2
                  display inline-block
                  margin-top 16 * rpx
                  margin-left 24 * rpx
                  font-size 14px
                  color #707070
              .btn
                margin-left 36 * rpx
                display inline-block
                width 144 * rpx
                height 52 * rpx
                background #19C1DE
                border-radius 32 * rpx
                .text
                  color white
                  font-size 24 * rpx
                  line-height 52 * rpx
                  margin-left 24 * rpx
</style>
