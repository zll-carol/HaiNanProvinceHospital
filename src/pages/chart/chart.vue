<template lang="pug">
  .main
    .bg
    .none(v-if="MsgStatus === '0'") 暂无相关信息
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .history_box(v-show="activeDisplay1")
      .itemName {{jyData.itemName}}({{sampleType}})
      .chart_box
        .selected_time
          picker.weui-btn(mode="date", v-model="date", :start="start1", :end="end1", @change="startDateChange")
            button
              .time
                .time_left 起始日期
                .time_right
                  .year {{startYear}}年
                  .day {{startMonth}}月{{startDay}}日
          .line
          picker.weui-btn(mode="date", v-model="date",:start="start2", :end="end2", @change="endDateChange")
            button
              .time(style="text-align:right")
                .time_right
                  .year {{endYear}}年
                  .day {{endMonth}}月{{endDay}}日
                .time_left(style="margin-right:0") 截止日期
        .table_box(v-if="historyStrData.length != 0")
          .list_box
            .list_title
              .titleName(style="left:26px") 日期
              .titleName(style="left:130px") 结果
              .titleName(style="right:70px") 参考值
            .list_content(v-for="(item, index) in historyStrData", :class="[index%2 !== 0 ? 'activeBackground' : '']")
              .date {{item.time}}
              .result
                .value {{item.value}}
                img.arrow(v-if="itemFlag == '3'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_up_1.png")
                img.arrow(v-if="itemFlag == '5'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_down_1.png")
              .reference {{item.reference}}
        .chart_content(v-if="historyData.length != 0")
          .chart_table
            .left_box(@click="activeChart(1)",:class="chartNum == 1 ? '' : 'tableColor'")
              .table_left 曲线
              .line(v-if="chartNum == 1")
            .right_box(@click="activeChart(2)",:class="chartNum == 2 ? '' : 'tableColor'")
              .table_right 列表
              .line(v-if="chartNum == 2")
          .chart(v-if="chartNum == 1")
            canvas.canvas(canvas-id="lineCanvas", disable-scroll="true")
          .list_box(v-if="chartNum == 2")
            .list_title
              .titleName(style="left:26px") 日期
              .titleName(style="left:130px") 结果
              .titleName(style="right:70px") 参考值
            .list_content(v-for="(item, index) in historyNumData", :class="[index%2 !== 0 ? 'activeBackground' : '']")
              .date {{item.reportTime}}
              .result
                .value {{item.itemValue}}
                img.arrow(v-if="item.itemFlag == '3'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_up_1.png")
                img.arrow(v-if="item.itemFlag == '6'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_up_1.png")
                img.arrow(v-if="item.itemFlag == '2'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_down_1.png")
                img.arrow(v-if="item.itemFlag == '5'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_down_1.png")
              .reference {{item.reference}}
</template>

<script>
  import Charts from '../../utils/wxcharts'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        activeDisplay1: false,
        tipShow: '',
        MsgStatus: '',
        chartNum: 1,
        imageWidth: '',
        windowW: '',
        patientId: '',
        start1: '',
        end1: '',
        start2: '',
        end2: '',
        startYear: '',
        startMonth: '',
        startDay: '',
        endYear: '',
        endMonth: '',
        endDay: '',
        jyData: [],
        timeArr: [],
        historyNumData: [],
        historyData: [],
        historyLowData: [],
        historyHeightData: [],
        historyStrData: [],
        itemValue: '',
        maxValue: '',
        minValue: '',
        num: 5,
        flag: 1,
        startDate: '',
        reportDate: '',
        date: '',
        sampleType: '',
        itemFlag: '',
        startDate1: '',
        endDate: '',
        type: '',
        deptId: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      activeChart(chartNum) {
        if (chartNum === 1) {
          this.chartNum = 1
          this.inspectionHistoryRequest()
        }
        if (chartNum === 2) {
          this.chartNum = 2
        }
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      // lineCanvas
      /* eslint-disable no-new */
      charts() {
        new Charts({
          canvasId: 'lineCanvas',
          type: 'line',
          // categories: ['2016-1', '2017-1', '2018-1', '2019-1', '2020-1', '2021-1', '2022-1', '2023-1', '2024-1', '2025-1', '2026-1'],
          categories: this.timeArr,
          animation: true,
          background: '#F0EFF5',
          series: [{
            name: '检查值',
            // data: [16, 12, 15, 11, 13, 17, 18, 16, 15, 14],
            data: this.historyData,
            format: function (val, name) {
              return val
            }
          }, {
            name: '参考最低值',
            // data: [16, 12, 15, 11, 13, 17, 18, 16, 15, 14],
            data: this.historyLowData,
            format: function (val, name) {
              return val
            }
          }, {
            name: '参考最高值',
            // data: [16, 12, 15, 11, 13, 27, 18, 16, 15, 24],
            data: this.historyHeightData,
            format: function (val, name) {
              return val
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '',
            format: function (val) {
              return val.toFixed(2)
            },
            min: this.minValue
          },
          width: (375 * this.windowW),
          height: (200 * this.windowW),
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        })
      },
      startDateChange(e) {
        console.log(e)
        console.log(e.mp.detail.value)
        this.num = 10000
        this.flag = 2
        this.startDate = e.mp.detail.value
        this.startDate1 = new Date(this.startDate).getTime()
        console.log(this.startDate1)
        this.startYear = this.startDate.substring(0, 4)
        this.startMonth = this.startDate.substring(5, 7)
        this.startDay = this.startDate.substring(8, 10)
        if (this.startDate1 <= this.endDate) {
          this.inspectionHistoryRequest()
        } else {
          RPC.toShow('请选择正确的时间段')
        }
        console.log(this.startYear)
        console.log(this.startMonth)
        console.log(this.startDay)
        console.log(this.end1)
      },
      endDateChange(e) {
        console.log(e)
        console.log(e.mp.detail.value)
        // this.start2 = e.mp.detail.value
        this.end2 = e.mp.detail.value
        this.num = 10000
        this.flag = 2
        this.reportDate = e.mp.detail.value
        this.endDate = new Date(this.reportDate).getTime()
        console.log(this.endDate)
        this.endYear = this.reportDate.substring(0, 4)
        this.endMonth = this.reportDate.substring(5, 7)
        this.endDay = this.reportDate.substring(8, 10)
        if (this.startDate1 <= this.endDate) {
          this.inspectionHistoryRequest()
        } else {
          RPC.toShow('请选择正确的时间段')
        }
        console.log(this.endYear)
        console.log(this.endMonth)
        console.log(this.endDay)
      },
      async inspectionHistoryRequest() {
        let that = this
        that.historyNumData = []
        that.historyData = []
        that.historyLowData = []
        that.historyHeightData = []
        that.historyStrData = []
        that.timeArr = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/inspectionHistory',
            data: {
              // patientId: 7631414,
              // patientId: 2531,
              patientId: wx.getStorageSync('getHealthCardList')[0].patientId,
              itemCode: that.jyData.itemCode,
              // itemCode: '65',
              itemName: that.jyData.itemName,
              // itemName: '白细胞',
              // startDate: RPC.getDay(-365 * 2),
              startDate: that.startDate,
              flag: that.flag,
              num: that.num,
              endDate: that.reportDate,
              type: that.type,
              patientIdDoctor: that.patientId,
              deptId: that.deptId
            }
          })
          console.log('getBillPayedRequest xxxxxxxxxxxx res:')
          if (!res.data.inspectionHistoryList) {
            that.MsgStatus = '0'
          }
          that.historyNumData = res.data.inspectionHistoryList
          console.log('xxxxxxxxxxx that.historyNumData:')
          console.log(that.historyNumData)
          let data = res.data.inspectionHistoryList
          console.log(data)
          if (data) {
            that.itemValue = data[0].itemValue
            that.maxValue = data[0].referenceHigh
            that.minValue = data[0].referenceLow
            if ((typeof that.itemValue) !== 'number') {
              for (let i = 0; i < data.length; i++) {
                console.log('str')
                let obj = {}
                obj.value = data[data.length - 1 - i].itemValue
                obj.time = data[data.length - 1 - i].reportTime
                if (data[0].reference === '') {
                  obj.reference = '无'
                } else {
                  obj.reference = data[data.length - 1 - i].reference
                }
                that.historyStrData.push(obj)
                that.activeDisplay1 = true
              }
            }
            let k = ''
            if (data.length <= 5) {
              k = data.length
            } else {
              k = 5
            }
            for (let i = 0; i < k; i++) {
              // 开始日期：最后一个点所在的日期
              if (that.flag === 1) {
                that.end1 = data[k - 1].reportTime
                that.startDate = data[k - 1].reportTime
                that.start2 = data[k - 1].reportTime
                that.startYear = that.end1.substring(0, 4)
                that.startMonth = that.end1.substring(5, 7)
                that.startDay = that.end1.substring(8, 10)
              }
              that.timeArr.push(data[k - i - 1].reportTime)
              if ((typeof that.itemValue) === 'number') {
                console.log('number')
                that.historyData.push(data[k - i - 1].itemValue)
                console.log(Number(data[k - i - 1].referenceLow))
                that.historyHeightData.push(Number(data[k - i - 1].referenceHigh))
                if (data[0].referenceLow !== '') {
                  that.historyLowData.push(Number(data[k - i - 1].referenceLow))
                } else {
                  that.historyLowData = []
                }
                console.log(that.historyLowData)
                console.log(that.historyHeightData)
                that.charts()
                that.activeDisplay1 = true
              }
            }
          }
          console.log(that.historyNumData)
          console.log(that.timeArr)
          console.log(that.historyLowData)
          console.log(that.historyHeightData)
          console.log(that.historyData)
          console.log(that.historyStrData)
        } catch (err) {
          console.log(err)
          that.MsgStatus = ''
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            that.tipShow = '网络异常，请稍后再试'
            setTimeout(
              that.hideTip,
              3000
            )
            this.showTip()
          }
        }
      }
    },
    onShow() {
    },
    onLoad(event) {
      console.log(event)
      let that = this
      that.MsgStatus = ''
      that.activeDisplay1 = false
      that.historyNumData = []
      that.historyData = []
      that.historyLowData = []
      that.historyHeightData = []
      that.historyStrData = []
      that.timeArr = []
      that.chartNum = 1
      that.num = 5
      that.startDate = ''
      that.reportDate = ''
      that.startDate1 = ''
      that.endDate = ''
      that.end1 = ''
      // 上个页面传过来的值
      that.jyData = JSON.parse(event.data)
      that.sampleType = event.sampleType
      // 结束日期
      that.reportDate = event.reportDate
      that.end2 = event.reportDate
      that.start2 = event.reportDate
      that.endDate = new Date(that.reportDate).getTime()
      if (this.flag === 1) {
        that.endYear = that.reportDate.substring(0, 4)
        that.endMonth = that.reportDate.substring(5, 7)
        that.endDay = that.reportDate.substring(8, 10)
      }
      // let tYear = new Date().getFullYear()
      // let tMonth = new Date().getMonth() + 1
      // let tDate = new Date().getDate()
      // that.end2 = tYear + '-' + tMonth + '-' + tDate
      console.log(that.end2)
      // 屏幕宽度
      that.imageWidth = wx.getSystemInfoSync().windowWidth
      console.log(that.imageWidth)
      // 计算屏幕宽度比列
      that.windowW = that.imageWidth / 375
      that.type = event.type
      console.log(that.type + '22222222222222222222222222222' + event.patientId)
      // 是否是医生查看病人的报告
      if (that.type === '1') {
        console.log('医生查看病人')
        that.patientId = event.patientId
        that.deptId = event.deptId
      } else {
        console.log('查看自己的报告')
        that.patientId = wx.getStorageSync('getHealthCardList')[0].patientId
      }
      that.inspectionHistoryRequest()
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
      .none
        color #9999
        padding-top 50%
        text-align center
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
      .history_box
        position absolute
        top 16 * rpx
        left 16 * rpx
        .itemName
          font-size 36 * rpx
          font-weight bold
          width 720 * rpx
          padding-top 32 * rpx
          padding-bottom 30 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 16 * rpx
        .chart_box
          position absolute
          top 128 * rpx
          padding 32 * rpx 0 30 * rpx 0
          width 720 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 16 * rpx
          .selected_time
            display flex
            display -webkit-flex
            width 656 * rpx
            border-bottom 2 * rpx dashed rgba(229,229,229,1)
            padding-bottom 32 * rpx
            margin-left 32 * rpx
            .weui-btn
              width 320 * rpx
              button
                padding-left 0
                background #FFFFFF
                &:after
                  border none
                .time
                  width 320 * rpx
                  line-height 1.5
                  text-align left
                  display inline-block
                  .time_left
                    text-align center
                    width 80 * rpx
                    padding 10 * rpx 0 10 * rpx 0
                    margin-right 16 * rpx
                    background #19C1DE
                    border-radius 16 * rpx
                    color #E1FBFF
                    font-size 28 * rpx
                    display inline-block
                  .time_right
                    width 162 * rpx
                    text-align left
                    display inline-block
                    .year
                      font-size 28 * rpx
                      color #000000
                    .day
                      font-size 36 * rpx
                      font-weight bold
            .line
              width 0
              height 48 * rpx
              margin-top 20 * rpx
              display inline-block
              border 2 * rpx solid rgba(229,229,229,1)
          .table_box
            display inline-block
            .table
              width 720 * rpx
              border-radius 16 * rpx
              border 6 * rpx solid rgba(229,229,229,1)
              .table_itemDes
                text-align left
                font-size 32 * rpx
                position relative
                border-bottom 6 * rpx solid rgba(229,229,229,1)
                .itemDes_left
                  display inline-block
                  position absolute
                  top 26 * rpx
                  left 16 * rpx
                  text-align center
                .itemDes_right
                  display inline-block
                  width 420 * rpx
                  margin-left 210 * rpx
                  padding 26 * rpx 0 26 * rpx 16 * rpx
                  border-left 6 * rpx solid rgba(229,229,229,1)
                  text-align center
            .list_box
              margin-top 32 * rpx
              .list_title
                width 656 * rpx
                background #EFFDFF
                height 80 * rpx
                line-height 80 * rpx
                .titleName
                  display inline-block
                  font-size 28 * rpx
                  font-weight bold
                  position absolute
              .list_content
                width 656 * rpx
                padding 20 * rpx 0
                font-size 28 * rpx
                color #707070
                text-align left
                display flex
                display -webkit-flex
                justify-content space-around
                .date
                  display inline-block
                  width 176 * rpx
                .result
                  display flex
                  display -webkit-flex
                  width 176 * rpx
                  .value
                    display inline-block
                  .arrow
                    width 56 * rpx
                    height 56 * rpx
                    margin-top -10 * rpx
                    display inline-block
                .reference
                  display inline-block
                  width 176 * rpx
              .activeBackground
                background #EFFDFF
          .chart_content
            .chart_table
              display flex
              display -webkit-flex
              justify-content space-around
              .left_box
                display inline-block
                text-align center
                color #19C1DE
                .table_left
                  font-size 32 * rpx
                  margin-top 26 * rpx
                  margin-bottom 10 * rpx
                .line
                  width 136 * rpx
                  height 10 * rpx
                  background rgba(25,193,222,1)
                  border-radius 6 * rpx
              .right_box
                display inline-block
                text-align center
                color #19C1DE
                .table_right
                  font-size 32 * rpx
                  margin-top 26 * rpx
                  margin-bottom 10 * rpx
                .line
                  width 136 * rpx
                  height 10 * rpx
                  background rgba(25,193,222,1)
                  border-radius 6 * rpx
              .tableColor
                color #000000
            .chart
              width 100%
              height 100%
              margin-top 32 * rpx
              .canvas
                width 720 * rpx
                height 420 * rpx
                background #EFFDFF
                // transform: scale(0.5)
            .list_box
              margin-top 32 * rpx
              .list_title
                width 656 * rpx
                margin-left 32 * rpx
                background #EFFDFF
                height 80 * rpx
                line-height 80 * rpx
                .titleName
                  display inline-block
                  font-size 28 * rpx
                  font-weight bold
                  position absolute
              .list_content
                width 656 * rpx
                margin-left 32 * rpx
                padding 20 * rpx 0
                font-size 28 * rpx
                color #707070
                text-align left
                display flex
                display -webkit-flex
                justify-content space-around
                .date
                  display inline-block
                  width 176 * rpx
                .result
                  display flex
                  display -webkit-flex
                  width 176 * rpx
                  .value
                    display inline-block
                  .arrow
                    width 56 * rpx
                    height 56 * rpx
                    margin-top -10 * rpx
                    display inline-block
                .reference
                  display inline-block
                  width 176 * rpx
              .activeBackground
                background #EFFDFF
</style>
