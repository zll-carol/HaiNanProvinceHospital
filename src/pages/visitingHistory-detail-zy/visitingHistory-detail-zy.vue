<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
    .visitingHistory(v-show=" activeDisplay1")
      .top
        .item(@tap="activeColor(1)",:class="num == 1 ? 'color1' : 'color2'") 基本信息
        .item(@tap="activeColor(3)",:class="num == 3 ? 'color1' : 'color2'") 费用信息
        .item(@tap="activeColor(4)",:class="num == 4 ? 'color1' : 'color2'") 检验检查
      .fee(v-if="num == 1")
        .fee-list
          .fee-item_fee(style="padding-bottom:16px")
            .tagLeft_content
              .total_fee_row
                .total_fee_details(style="margin-left:16px")
                  .left 病人姓名
                  .right {{jcData.patientName}}
                .total_fee_details(style="margin-left:16px")
                  .left 住院号
                  .right {{jcData.adno}}
                .total_fee_details(style="margin-left:16px")
                  .left 住院床号
                  .right {{jcData.bed}}
                .total_fee_details(style="margin-left:16px")
                  .left 住院次数
                  .right {{jcData.visitId}}
              .total_fee
                .left 住院科室
                .right {{jcData.deptName}}
              .total_fee
                .left 临床诊断
                .right {{jcData.diagnosis}}
              .total_fee
                .left 入院日期
                .right {{jcData.inDate}}
              .total_fee
                .left 出院时间
                .right {{jcData.outDate}}
        .fee-list
          .fee-item_fee(style="padding-bottom:16px")
            .feeX-1(v-for="item in balanceList")
              .textLeft-x-1 {{item.payType}}
              .textRigth-x-1 {{item.balance}}元
      .fee(v-if="num == 3")
        .fee-list
          .fee-item_fee(style="padding-bottom:16px")
            .title_tag
              .tag_left(@click="activeFee(0)",:class="feeNum == 0 ? '' : 'tag_left-1'")
                .des 费用概况
                .line(v-if="feeNum == 0")
              .tag_right(@click="activeFee(1)",:class="feeNum == 1 ? '' : 'tag_right-1'")
                .menu 每日清单
                .line(v-if="feeNum == 1")
            .tagLeft_content(v-if="feeNum == 0")
              .chooseType
                .forFee(@tap="chooseFee(0)", :class="chooseNum==0?'': 'feeColor-1'")
                  .feeText(:class="chooseNum==0?'': 'textColor-1'") 按费目
                .forData(@tap="chooseFee(1)", :class="chooseNum==1?'feeColor-2': ''")
                  .dataText(:class="chooseNum==1?'textColor-2': ''") 按日期
              .feeShow
                .feeZ
                  .textLeft-z 总费用
                  .textRigth-z {{zFee1}}元
                .feeX(v-for="item in listFee", v-if="chooseNum==0")
                  .textLeft-x {{item.key}}
                  .textRigth-x {{item.value}}元
                .feeX(v-for="item in listDate", v-if="chooseNum==1")
                  .textLeft-x {{item.key}}
                  .textRigth-x {{item.value}}元
            .tagRight_content(v-if="feeNum == 1")
              .chooseTime
                .upDate(v-if="!minShow")
                .upDate(v-if="minShow", @tap="up()")
                  .img
                    img(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow_left.png")
                  .upText 前一天
                .chooseTime
                  picker.chooseText(@change="bindPickerChange" mode="date" :start="minDate" :end="maxDate") {{chooseText}}
                .nextDate(v-if="!maxShow")
                .nextDate(v-if="maxShow", @tap="next()")
                  .nextText 后一天
                  .img
                    img(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
              .feeShow-2
                .feeZ-2
                  .textLeft-z-2 总费用
                  .textRigth-z-2 {{zFee2}}元
                .feeX-2(v-for="(item, index1) in prepayedList", @tap="showItem(index1)")
                  .show-HZ
                    .textLeft-x-2 {{item.type}}
                    .img
                      img(:src="index1 == showNum?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png':'https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png'")
                    .textRigth-x-2 {{item.money}}元
                  .show-SQ(v-for="item1 in item.object", v-if="index1 == showNum")
                    .text-1
                      .text-11 {{item1.feeName}}
                    .text-2
                      .text-22 {{item1.count}}
                    .text-3
                      .text-33 {{item1.unitPrice}}元
                    .text-4
                      .text-44 {{item1.money}}元
      .fee(v-if="num == 4")
        .fee-list(@tap="navigateToDetail(item)" style="padding-bottom:16px" v-for="(item, index) in inspectionReportList" :class="[index%2 === 0 ? 'activeBackground' : '']")
          .fee-item
            .report {{item.name}}
            .time
              .time-left 检查时间
              .time-right {{item.time}}
</template>
<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: true,
        num: 1,
        feeNum: 0,
        showNum: -1,
        totalList: [],
        totalList1: [],
        cfList: [],
        inspectionReportList: [],
        peopleList: '',
        peopleData: '',
        listData: '',
        totalFee: 0,
        jcData: '',
        chooseNum: 0,
        listFee: [],
        listDate: [],
        type: 1,
        balanceList: [],
        minDate: '',
        maxDate: '',
        minDateValue: '',
        maxDateValue: '',
        chooseText: '',
        minShow: 0,
        maxShow: 0,
        prepayedList: [],
        zFee1: '',
        zFee2: ''
      }
    },
    computed: {},
    methods: {
      chooseFee(num) {
        if (num === 0) {
          this.chooseNum = 0
          if (this.listFee.length === 0) {
            this.preVisitCollect()
          }
        }
        if (num === 1) {
          this.chooseNum = 1
          if (this.listDate.length === 0) {
            this.preVisitCollect()
          }
        }
      },
      activeFee(feeNum) {
        if (this.feeNum !== feeNum) {
          this.feeNum = feeNum
          if (this.feeNum === 1 && this.prepayedList.length === 0) {
            this.preVisitFeeList()
          }
        }
      },
      // 日期选择器
      bindPickerChange(event) {
        console.log(event.mp.detail.value)
        this.chooseText = event.mp.detail.value
        let date = new Date(this.chooseText)
        if (date.getTime() < this.maxDateValue) {
          console.log('11111111111111')
          console.log(date.getTime())
          console.log(this.maxDateValue)
          this.maxShow = 1
        } else {
          console.log('22222222222222222')
          this.maxShow = 0
        }
        if (date.getTime() > this.minDateValue) {
          this.minShow = 1
        } else {
          this.minShow = 0
        }
        this.preVisitFeeList()
      },
      // 选择上一天
      up() {
        let date = new Date(this.chooseText)
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000)
        this.chooseText = RPC.getTime(date)
        if (date.getTime() < this.maxDateValue) {
          this.maxShow = 1
        } else {
          this.maxShow = 0
        }
        if (date.getTime() > this.minDateValue) {
          this.minShow = 1
        } else {
          this.minShow = 0
        }
        this.preVisitFeeList()
      },
      // 选择下一天
      next() {
        let date = new Date(this.chooseText)
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
        this.chooseText = RPC.getTime(date)
        if (date.getTime() < this.maxDateValue) {
          this.maxShow = 1
        } else {
          this.maxShow = 0
        }
        if (date.getTime() > this.minDateValue) {
          this.minShow = 1
        } else {
          this.minShow = 0
        }
        this.preVisitFeeList()
      },
      // 就诊费用清单
      async preVisitFeeList() {
        this.prepayedList = []
        this.zFee2 = ''
        let startDate = this.chooseText + ' ' + '00:00:00'
        let endDate = this.chooseText + ' ' + '23:59:59'
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/preVisitFeeList',
            data: {
              patientId: this.peopleData.patientId,
              // patientId: 8330819,
              visitId: this.listData.visitId,
              startDate: startDate,
              endDate: endDate
            }
          })
          console.log('success')
          console.log(res)
          this.zFee2 = res.data.totalCost
          let list = res.data.prepayedList
          let a = []
          for (let i = 0; i < list.length; i++) {
            let flag = false
            for (let k = 0; k < a.length; k++) {
              if (a[k].type === list[i].type) {
                a[k].money = a[k].money + Number(list[i].money)
                a[k].money = parseInt(a[k].money * 100) / 100
                // console.log(a[k].money)
                // a[k].money = RPC.toDecimal2(a[k].money)
                a[k].object.push(list[i])
                flag = true
              }
            }
            if (!flag) {
              let b = {}
              b.type = list[i].type
              b.money = Number(list[i].money)
              b.object = []
              b.object.push(list[i])
              a.push(b)
            }
          }
          this.prepayedList = a
          console.log(this.prepayedList)
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
      activeColor(num) {
        this.cfList = []
        this.showNum = -1
        this.inspectionReportList = []
        if (num === 1) {
          this.num = 1
        }
        if (num === 3) {
          this.preVisitCollect()
          this.num = num
        }
        if (num === 4) {
          this.num = num
          if (this.inspectionReportList.length === 0) {
            this.listInspectionReport()
          }
        }
      },
      showItem(index) {
        console.log(index)
        if (this.showNum === index) {
          this.showNum = -1
        } else {
          this.showNum = index
        }
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      showPage() {
        this.activeDisplay1 = true
      },
      navigateToDetail(item) {
        wx.navigateTo({
          url: '../examination-detail/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData)
        })
      },
      // 对选择时间的大小进行处理
      getTime() {
        this.minDate = RPC.getTime(new Date(this.listData.inDate))
        this.minDateValue = new Date(this.minDate).getTime()
        if (this.listData.outDate) {
          this.maxDate = RPC.getTime(new Date(this.listData.outDate))
          this.maxDateValue = new Date(this.maxDate).getTime()
        } else {
          this.maxDate = RPC.getTime(new Date())
          this.maxDateValue = new Date(this.maxDate).getTime()
        }
        this.chooseText = this.maxDate
        // 初始化显示，默认显示最后一天，隐藏后一天按钮
        this.maxShow = 0
        if (this.minDateValue < this.maxDateValue) {
          this.minShow = 1
        } else {
          this.minShow = 0
        }
        console.log(this.minDate)
        console.log(this.maxDate)
      },
      // 基本情况
      async prepayPreVisitDetail() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/preVisitDetail',
            data: {
              patientId: this.peopleData.patientId,
              // patientId: 8330819,
              visitId: this.listData.visitId
            }
          })
          console.log('success')
          console.log(res)
          this.jcData = res.data.preVisitInfo
          // 处理时间信息
          this.getTime()
          this.prepayPreVisitSettle()
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
      // 费用总览
      async prepayPreVisitSettle() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/preVisitSettle',
            data: {
              patientId: this.peopleData.patientId,
              // patientId: 8330819,
              visitId: this.listData.visitId
            }
          })
          console.log('success')
          console.log(res)
          this.balanceList = res.data.balanceList
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
      // 排序的数组
      compare(property, type) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (type === 1) {
            return value2 - value1
          } else {
            return value1 - value2
          }
        }
      },
      // 费用信息：
      async preVisitCollect() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/preVisitCollect',
            data: {
              patientId: that.peopleData.patientId,
              // patientId: 8330819,
              visitId: that.listData.visitId,
              type: this.chooseNum
            }
          })
          console.log('success')
          console.log(res)
          this.zFee1 = res.data.totalCost
          if (this.chooseNum === 0) {
            that.listFee = res.data.preVisitCollect
          } else {
            that.listDate = res.data.preVisitCollect
          }
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              that.hideTip,
              3000
            )
            that.showTip()
          }
        }
      },
      async listInspectionReport() {
        let that = this
        that.inspectionReportList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/listInspection',
            data: {
              patientId: that.peopleData.patientId,
              // patientId: 8330819,
              visitId: that.listData.visitId,
              pageNo: 1,
              pageSize: 100,
              type: ''
            }
          })
          console.log('success')
          console.log(res)
          that.inspectionReportList = res.data.inspectionReportList
        } catch (err) {
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
    created() {
    },
    onLoad(event) {
      console.log(event)
      this.totalList = []
      // 就诊人信息
      this.peopleData = JSON.parse(event.patientData)
      // 住院信息
      this.listData = JSON.parse(event.data)
      this.totalFee = 0
      this.chooseNum = 0
      this.feeNum = 0
      this.listFee = []
      this.listDate = []
      this.num = 1
      this.showNum = -1
      this.prepayPreVisitDetail()
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx

  rpx =  rpxf()

  page
    background-color  #F0EFF5
    height 100%
    .main
      width 750 * rpx
      height 100%
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
        background linear-gradient(#19C1DE,#F0EFF5)
      .visitingHistory
        text-align center
        position absolute
        top 16 * rpx
        .top
          width 750 * rpx
          height 96 * rpx
          line-height 96 * rpx
          font-size 32 * rpx
          display flex
          display -webkit-flex
          justify-content space-around
          .color1
            color #fff
            border-bottom 8 * rpx  #fff solid
          .color2
            color #fff
            border-bottom none
          .item
            display inline-block
        .fee
          text-align center
          padding-bottom 32 * rpx
          margin-top 32 * rpx
          .fee-list
            display inline-block
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow:0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .fee-item_fee
              display inline-block
              padding-bottom 34 * rpx
              .feeX-1
                margin-top 34 * rpx
                width 720 * rpx
                height 80 * rpx
                background-color #ffffff
                .textLeft-x-1
                  text-align left
                  margin-left 32 * rpx
                  line-height 80 * rpx
                  font-size 32 * rpx
                  color #707070
                  float left
                .textRigth-x-1
                  margin-right 32 * rpx
                  line-height 80 * rpx
                  font-size 32 * rpx
                  float right
              .title_tag
                width 720 * rpx
                margin-top 40 * rpx
                .tag_left
                  text-align center
                  width 360 * rpx
                  color #19C1DE
                  display inline-block
                  .des
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    margin-left 112 * rpx
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_left-1
                  color #000000
                .tag_right
                  text-align center
                  width 360 * rpx
                  color #19C1DE
                  display inline-block
                  .menu
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    margin-left 112 * rpx
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_right-1
                  color #000000
              .tagLeft_content
                .chooseType
                  margin-top 38 * rpx
                  width 720 * rpx
                  height 64 * rpx
                  .forFee
                    display inline-block
                    width 144 * rpx
                    height 64 * rpx
                    text-align center
                    background-color #19C1DE
                    border-radius 16 * rpx
                    border #19C1DE solid 1 * rpx
                    .feeText
                      line-height 64 * rpx
                      font-size 26 * rpx
                      color #FFFFFF
                    .textColor-1
                      color #9FDAE5
                  .feeColor-1
                    background-color #ffffff
                  .feeColor-2
                    background-color #19C1DE
                  .forData
                    display inline-block
                    width 144 * rpx
                    height 64 * rpx
                    text-align center
                    border-radius 16 * rpx
                    border #19C1DE solid 1 * rpx
                    .dataText
                      line-height 64 * rpx
                      font-size 26 * rpx
                      color #9FDAE5
                    .textColor-2
                      color #FFFFFF
                .feeShow
                  .feeZ
                    margin-top 32 * rpx
                    width 720 * rpx
                    height 80 * rpx
                    background-color #E1FBFF
                    .textLeft-z
                      margin-left 32 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      color #19C1DE
                      float left
                    .textRigth-z
                      margin-right  32 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      color #19C1DE
                      float right
                  .feeX
                    width 720 * rpx
                    height 80 * rpx
                    background-color #ffffff
                    .textLeft-x
                      margin-left 32 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      color #707070
                      float left
                    .textRigth-x
                      margin-right  32 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      float right
                .total_fee
                  text-align left
                  height 96 * rpx
                  line-height 96 * rpx
                  font-size 32 * rpx
                  display -webkit-flex
                  .left
                    width 128 * rpx
                    color #707070
                    margin-left 32 * rpx
                  .right
                    margin-left 32 * rpx
                    color #000000
                    display inline-block
                .total_fee_row
                  margin-top 34 * rpx
                  text-align left
                  display flex
                  display -webkit-flex
                  flex-wrap wrap
                  .total_fee_details
                    width 320 * rpx
                    display inline-block
                    margin-bottom 50 * rpx
                    font-size 32 * rpx
                    .left
                      width 128 * rpx
                      color #707070
                      display inline-block
                      position absolute
                      overflow  hidden
                      text-overflow  ellipsis
                      display -webkit-box //作为弹性伸缩盒子模型显示。
                      -webkit-box-orient vertical  //设置伸缩盒子的子元素排列方式--从上到下垂直排列
                      -webkit-line-clamp 2  //显示的行
                    .right
                      color #000000
                      display inline-block
                      width 160 * rpx
                      margin-left 160 * rpx
                      word-wrap break-word
                      word-break break-all
              .tagRight_content
                .chooseTime
                  width 720 * rpx
                  height 128 * rpx
                  text-align center
                  .upDate
                    display inline-block
                    width 160 * rpx
                    height 128 * rpx
                    float left
                    .img
                      margin-top 4 * rpx
                      display inline-block
                      width 18 * rpx
                      height 28 * rpx
                      img
                        width 18 * rpx
                        height 28 * rpx
                    .upText
                      margin-left 14 * rpx
                      display inline-block
                      line-height 128 * rpx
                      font-size 26 * rpx
                      color #C7C7CC
                  .chooseTime
                    display inline-block
                    width 216 * rpx
                    height 128 * rpx
                    .chooseText
                      line-height 128 * rpx
                      font-size 36 * rpx
                      color #19C1DE
                  .nextDate
                    display inline-block
                    width 160 * rpx
                    height 128 * rpx
                    float right
                    .nextText
                      display inline-block
                      line-height 128 * rpx
                      font-size 26 * rpx
                      color #C7C7CC
                    .img
                      margin-top 4 * rpx
                      margin-left 14 * rpx
                      display inline-block
                      width 18 * rpx
                      height 28 * rpx
                      img
                        width 18 * rpx
                        height 28 * rpx
                .feeShow-2
                  background-color #E1FBFF
                  .feeZ-2
                    width 720 * rpx
                    height 80 * rpx
                    background-color #19C1DE
                    .textLeft-z-2
                      margin-left 32 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      color #FFFFFF
                      float left
                    .textRigth-z-2
                      margin-right  80 * rpx
                      line-height 80 * rpx
                      font-size 32 * rpx
                      color #FFFFFF
                      float right
                  .feeX-2
                    width 720 * rpx
                    .show-HZ
                      width 720 * rpx
                      height 80 * rpx
                      background-color #E1FBFF
                      border-bottom white solid 2 * rpx
                      .textLeft-x-2
                        margin-left 32 * rpx
                        line-height 80 * rpx
                        font-size 32 * rpx
                        color #0098B3
                        float left
                      .textRigth-x-2
                        margin-right  28 * rpx
                        line-height 80 * rpx
                        font-size 32 * rpx
                        color #0098B3
                        float right
                      .img
                        width 20 * rpx
                        height 20 * rpx
                        line-height 70 * rpx
                        float right
                        margin-right  32 * rpx
                        img
                          width 20 * rpx
                          height 20 * rpx
                    .show-SQ
                      width 720 * rpx
                      height auto
                      padding-top 28 * rpx
                      padding-bottom 32 * rpx
                      display flex
                      display -webkit-flex
                      justify-content space-between
                      background-color white
                      text-align left
                      .text-1
                        display inline-block
                        margin-left 32 * rpx
                        width 260 * rpx
                        word-wrap break-word
                        .text-11
                          font-size 26 * rpx
                          color #707070
                      .text-2
                        margin-left 26 * rpx
                        display inline-block
                        width 50 * rpx
                        word-wrap break-word
                        .text-22
                          font-size 26 * rpx
                          color #707070
                      .text-3
                        margin-left 40 * rpx
                        display inline-block
                        width 120 * rpx
                        word-wrap break-word
                       .text-33
                         font-size 26 * rpx
                         color #707070
                      .text-4
                        margin-left 40 * rpx
                        display inline-block
                        width 120 * rpx
                        word-wrap break-word
                        .text-44
                          font-size 26 * rpx
                          color #707070
            .history-item
              text-align left
              width 656 * rpx
              margin-left 32 * rpx
              margin-top 26 * rpx
              border-bottom 2 * rpx solid rgba(229,229,229,1)
              .history_row
                padding-bottom 26 * rpx
                font-size 32 * rpx
                .history_left
                  display inline-block
                  position absolute
                  color #707070
                .history_right
                  display inline-block
                  width 368 * rpx
                  margin-left 200 * rpx
                  line-height 45 * rpx
                  color #000000
          .fee-list
            display inline-block
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow:0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            background #ffff
            .fee-item
              width 656 * rpx
              text-align left
              position relative
              display inline-block
              font-size 32 * rpx
              color #707070
              .item_row
                margin-top 26 * rpx
                margin-bottom 26 * rpx
                .item_left
                  display inline-block
                  position absolute
                .item_right
                  display inline-block
                  width 330 * rpx
                  margin-left 192 * rpx
                  line-height 44 * rpx
              .item_des
                text-align left
                color #000000
                font-size 32 * rpx
                font-weight bold
                height 80 * rpx
                line-height 80 * rpx
              .content
                text-align left
                width 656 * rpx
                color #707070
                font-size 32 * rpx
                margin-bottom 22 * rpx
                line-height 62 * rpx
              .report
                width 656 * rpx
                padding-top 28 * rpx
                padding-bottom 24 * rpx
                color #000000
                font-weight bold
                font-size 32 * rpx
                text-align left
                line-height 62 * rpx
                border-bottom 2 * rpx solid rgba(229,229,229,1)
              .time
                width 656 * rpx
                color #707070
                text-align left
                font-size 28 * rpx
                height 96 * rpx
                line-height 96 * rpx
                .time-left
                  display inline-block
                .time-right
                  margin-left 32 * rpx
                  display inline-block
              .left
                display inline-block
              .right
                display inline-block
                position absolute
                right 50 * rpx
                color #000000
              .arrow
                width 20 * rpx
                height 20 * rpx
                position absolute
                right 12 * rpx
                top 42%
            .display_show
              width 720 * rpx
              display inline-block
              text-align center
              background #EFFDFF
              color #707070
              margin-bottom 26 * rpx
              border-top 4 * rpx solid rgba(159,218,229,1)
              border-bottom 4 * rpx solid rgba(159,218,229,1)
              font-size 28 * rpx
              .show_item
                width 656 * rpx
                height 96 * rpx
                line-height 96 * rpx
                background #EFFDFF
                margin-left 32 * rpx
                .show_name
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .title
                    display inline-block
                    width 200 * rpx
                    font-weight bold
                    font-size 32 * rpx
                    color #000000
                    text-align left
              .show_box
                border-top 4 * rpx solid rgba(159,218,229,1)
                width 656 * rpx
                display inline-block
                .show_dug
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  border-bottom 2 * rpx dashed rgba(159,218,229,1)
                  width 656 * rpx
                  padding-bottom 32 * rpx
                  padding-top 32 * rpx
                  text-align left
                  .dug_des
                    width 200 * rpx
                    color black
                    font-size 28 * rpx
                    display inline-block
                .dug_methods
                  width 656 * rpx
                  height 96 * rpx
                  line-height 96 * rpx
                  color #19C1DE
                  margin-left 32 * rpx
                  font-size 28 * rpx
                  text-align right
                  .left_methods
                    display inline-block
                  .right_methods
                    display inline-block
                    margin-left 10 * rpx
                    margin-right 32 * rpx
            .fee-item-bom
              width 656 * rpx
              position relative
              display inline-block
              font-size 32 * rpx
              color #707070
              .item_row-bom
                font-size 32 * rpx
                margin-bottom 26 * rpx
                text-align left
                .item_left-bom
                  display inline-block
                  position absolute
                  color #707070
                .item_right-bom
                  display inline-block
                  width 330 * rpx
                  margin-left 192 * rpx
                  line-height 44 * rpx
                  color #000000
              .hiddenBorder
                border none
            .showImg
              width 688 * rpx
              height 32 * rpx
              margin-bottom 10 * rpx
            .display_none
              display none
            .list
              width 560 * rpx
              height 64 * rpx
              line-height 64 * rpx
              position relative
              .left
                display inline-block
                position absolute
                left 32 * rpx
              .right
                display inline-block
                position absolute
                right -32 * rpx
          .activeBackground
            background-color #EFFDFF
</style>

