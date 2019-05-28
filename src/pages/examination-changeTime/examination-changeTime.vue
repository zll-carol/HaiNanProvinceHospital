<template lang="pug">
  form(@submit="changeTime", report-submit="true")
    .main(v-if="chooseType==0")
      .pay-tip(v-show="activeDisplay") {{tipShow}}
      .box
        .box-relation
          .name 就诊人
          .value {{peopleData.name}}
        .box-relation
          .name 医生
          .value {{data.doctorName}}（{{data.sectionName}}）
        .box-relation
          .name 检查项目
          .value {{data.advice}}
        .box-relation
          .name 当前时间
          .value {{data.oldTime}}
        .box-relation(style="border-bottom: 0",@tap="chooseDate()")
          .name 选择日期
          <input class="value-1" v-model="chooseTime" placeholder="请选择要调整的日期" disabled="true"/>
          .jump-info
      .box-1
        .text 可调整时间
        .box-list
          <!--.box-time-->
            <!--img(mode="widthFix", src="https://nontax-cdn.yuluoo.com/hainanhospital-registered-time.png")-->
            <!--.box-time-text 2018/09/30-->
          .time-btn(v-for="(item,index) in timeList" @tap="change2(index)" :class="numTime==index?'color-2':'color-1'")
            .btn-text(:class="numTime==index?'txt-color-1':'txt-color-2'") {{item.time}}
      .btn-class(v-show="isShow")
        button(formType= "submit")
          .btm 调整时间
    .main-1(v-else-if="chooseType==1")
      .time-box(v-for='(card,index) in allDataList')
        .time-m
          .text {{card.title}}
        .time-w
          .time-w-text
            .text 日
          .time-w-text
            .text 一
          .time-w-text
            .text 二
          .time-w-text
            .text 三
          .time-w-text
            .text 四
          .time-w-text
            .text 五
          .time-w-text
            .text 六
        .time-d
          .time-w-text(v-for="(item,itemIndex) in card.riqiList" @tap="chooseTimeBtn(item)" :style="item.timeNum==chooseTime?'background: #19C1DE':''")
            .d-text(:style="item.type==0?'color: #E5E5E5':item.timeNum==chooseTime?'color: #FFFFFF':''") {{item.date}}
            .d-num(:style="item.type==3?'color: #FF0000':item.timeNum==chooseTime?'color: #FFFFFF':item.type==0?'color: #E5E5E5':''") {{item.num}}
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        numTime: 0,
        isShow: true,
        data: {},
        peopleData: {},
        chooseTime: '',
        chooseNow: '',
        chooseType: 0,
        allDataList: [],
        adjustableList: [],
        timeList: []
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
      chooseTimeBtn(item) {
        this.timeList = []
        this.listAdjustablePeriodByDate(item.timeNum)
        // this.numTime = 0
        // this.chooseType = 0
        // this.chooseTime = item.timeNum
        // if (this.adjustableList[item.timeNum].dateList) {
        //   this.timeList = this.adjustableList[item.timeNum].dateList
        // } else {
        //   this.timeList = []
        // }
      },
      async listAdjustablePeriodByDate(time) {
        console.log(time)
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listAdjustablePeriodByDate',
            data: {
              queueId: self.data.queueId,
              queueType: self.data.queueType,
              date: time,
              patientId: self.peopleData.patientId
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.adjustableList) {
            self.timeList = res.data.adjustableList
            self.numTime = 0
            self.chooseType = 0
            self.chooseTime = time
          }
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
      change2(id) {
        this.numTime = id
      },
      async adjustTime() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/adjustTime',
            data: {
              queueId: self.data.queueId,
              queueType: self.data.queueType,
              date: self.chooseTime + ' ' + self.timeList[self.numTime].time,
              visitName: self.peopleData.name,
              appointmentName: self.data.advice,
              address: self.data.address,
              patientId: self.peopleData.patientId
            }
          })
          console.log('success')
          console.log(res)
          // 调整成功返回
          wx.showToast({title: '调整成功！'})
          setTimeout(
            wxAsync.navigateBack({
              delta: 1
            }), 2000
          )
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
      async listAdjustableCollect() {
        wxAsync.showLoading({title: '请耐心等待', mask: true})
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listAdjustableCollect',
            data: {
              queueId: self.data.queueId,
              queueType: self.data.queueType,
              patientId: self.peopleData.patientId
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          wxAsync.hideLoading()
          self.adjustableList = []
          let dataList = res.data.adjustableList
          for (let i = 0, length = dataList.length; i < length; i++) {
            self.adjustableList[dataList[i].date] = dataList[i].count
          }
          console.log(self.adjustableList)
          if (self.allDataList.length === 0) {
            self.getDare()
          }
        } catch (err) {
          wxAsync.hideLoading()
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
      chooseDate() {
        this.listAdjustableCollect()
        this.chooseType = 1
      },
      changeTime(event) {
        let self = this
        console.log(self.chooseTime)
        self.saveFormId(event.mp.detail.formId)
        if (self.chooseTime === '' || self.timeList.length === 0) {
          wx.showToast({
            title: '请选择日期和时间',
            icon: 'none'
          })
        } else {
          wx.showModal({
            title: '只允许预约调整一次!',
            content: '检查时间调整为' + self.chooseTime + ' ' + self.timeList[self.numTime].time,
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#007FFF',
            cancelColor: '#000000',
            success(res) {
              if (res.confirm) {
                self.adjustTime()
              } else {
              }
            }
          })
        }
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/templatemsg/submitFormId',
            data: {
              formId: formId
            },
            type: 1
          })
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      },
      getDare() {
        let self = this
        // 获取12个月份
        // 获取这个月份的一号
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        for (let i = 0; i < 12; i++) {
          let allData = {}
          let newDate = new Date(year, month + i, 1)
          allData.title = newDate.getFullYear() + '年' + (newDate.getMonth() + 1) + '月'
          let riqiList = []
          for (let k = 0; k < newDate.getDay(); k++) {
            let riqi = {}
            riqi.title = ''
            riqi.num = ''
            riqi.timeNum = '0'
            riqiList.push(riqi)
          }
          for (let m = 0; m < new Date(year, month + i + 1, 0).getDate(); m++) {
            let riqi = {}
            riqi.date = m + 1
            riqi.num = ''
            let timeNum = RPC.getTime(new Date(year, month + i, m + 1))
            riqi.timeNum = timeNum
            if (self.adjustableList[timeNum]) {
              riqi.num = '余号' + self.adjustableList[timeNum]
              // 正常显示
              riqi.type = 2
            } else {
              riqi.num = '余号0'
              // 标红
              riqi.type = 3
            }
            if (i === 0 && m < new Date().getDate() - 1) {
              // 不能选择
              riqi.type = 0
              riqi.num = '--'
            }
            riqiList.push(riqi)
          }
          allData.riqiList = riqiList
          self.allDataList.push(allData)
          console.log(self.allDataList)
        }
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad(event) {
      let self = this
      self.data = JSON.parse(event.data)
      self.peopleData = JSON.parse(event.peopleData)
      // 初始化数据
      self.chooseType = 0
      self.timeList = []
      self.chooseTime = ''
      self.allDataList = []
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
      margin-top 14 * rpx
      width 100%
      height 100%
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
      .box
        width 720 * rpx
        height auto
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        align-items center
        .box-relation
          border-bottom 2 * rpx solid #E5E5E5
          margin-left 36 * rpx
          width 648 * rpx
          height 96 * rpx
          background #fff
          display flex
          .name
            width 150 * rpx
            display inline-block
            margin-left 30 * rpx
            line-height 96 * rpx
            color #707070
            font-size 16px
          .value
            width 450 * rpx
            margin-right 34 * rpx
            font-size 16px
            line-height 96 * rpx
            text-align right
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
          .value-1
            margin-top 20 * rpx
            width 450 * rpx
            margin-right 34 * rpx
            font-size 16px
            text-align right
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
          .jump-info
            margin-top 48 * rpx
            position absolute
            margin-left 640 * rpx
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
              position relative
              top -2px
              position absolute
              top 50%
              margin-top -6 * rpx
              right 2px
      .box-1
        width 720 * rpx
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        margin-top 16 * rpx
        align-items center
        .text
          font-size 20px
          font-weight bold
          margin-left 32 * rpx
          line-height  88 * rpx
        .box-list
          margin-top 50 * rpx
          margin-left 32 * rpx
          width 648 * rpx
          height auto
          .box-time
            display flex
            img
              display inline-block
              width 48 * rpx
              height 48 * rpx
            .box-time-text
              margin-left 24 * rpx
              display inline-block
              font-size 16px
          .time-btn
            display inline-block
            margin-top 16 * rpx
            margin-left 32 * rpx
            background-color white
            border-radius 88 * rpx
            border 2 * rpx solid #19C1DE
            width 180 * rpx
            height 64 * rpx
            text-align center
            .btn-text
              font-size 14px
              line-height 64 * rpx
          .color-1
            background-color white
          .color-2
            background-color #19C1DE
          .txt-color-1
            color white
          .txt-color-2
            color #19C1DE
      .btn-class
        margin-top 32 * rpx
        button
          margin-bottom 32 * rpx
          width 690 * rpx
          height 88 * rpx
          border-radius 88 * rpx
          background #19C1DE
          line-height:88rpx
          box-shadow:0px 6px 12px rgba(0,0,0,0.1)
          .btm
            color white
    .main-1
      margin-top 14 * rpx
      width 100%
      height 100%
      .time-box
        margin-top 16 * rpx
        width 720 * rpx
        height auto
        margin-left 16 * rpx
        border-radius 16 * rpx
        background white
        box-shadow:0px 6px 12px rgba(0,0,0,0.05);
        .time-m
          width 648 * rpx
          height 96 * rpx
          margin-left 32 * rpx
          background white
          text-align center
          border-bottom 2 * rpx solid #E5E5E5
          .text
            font-size 36 * rpx
            font-weight bold
            line-height 96 * rpx
        .time-w
          margin-left 32 * rpx
          width 648 * rpx
          height 80 * rpx
          border-bottom 2 * rpx solid #E5E5E5
          .time-w-text
            width 92.5 * rpx
            text-align center
            display inline-block
            .text
              font-size 28 * rpx
              font-weight bold
              line-height 80 * rpx
        .time-d
          margin-top 4 * rpx
          margin-left 32 * rpx
          width 648 * rpx
          height auto
          .time-w-text
            margin-top 12 * rpx
            width 92.5 * rpx
            height 80 * rpx
            text-align center
            display inline-block
            .d-text
              height 40 * rpx
              font-size 28 * rpx
            .d-num
              height 38 * rpx
              color #19C1DE
              font-size 22 * rpx
</style>
