<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .pay-list(v-show="activeDisplay1")
    .pay-list
      .cardInfo
        .patient_row
          .text 就诊人
          .text-1 {{data.name}}({{data.outpatientNo}})
      .table_box
        .row_box
          .box(@click="selectTab(1)")
            .des 门诊
            .line(v-if="selectTab1")
          .box(@click="selectTab(2)")
            .des 住院
            .line(v-if="selectTab2")
      .none(v-if="paymentListMsg === 0 && selectTab1") 暂无相关信息
      .department(v-if="selectTab1",v-for="(item,index) in paymentList" :key="index" :class="[index%2 !== 0 ? 'activeBackground' : '']")
        form(@submit="navigateToCaseDetail(item)", :data-id="item.id")
          button.btn(formType= "submit",plain="true")
            .pay-item
              .left1 挂号单号
              .left2 {{item.RegisterNo}}
              .right1 {{item.JZTime}}
            .pay-item_content
              .content_list
                .left 医生
                .right {{item.Doctor}} ({{item.DepartMent}})
              .content_list
                .right2 {{item.Cost}}
              .content_list
                .left 诊断
                .right {{item.Diagnosis}}
      .none(v-if="listPreVisitArrMsg === 0 && selectTab2") 暂无相关信息
      .inHospital(v-if="selectTab2")
        .inHospital_box(v-for="(item, index) in listPreVisitArr", :class="[index%2 !== 0 ? 'activeBackground' : '']", @tap="goInfo(item)")
          .row_top
            .left {{item.inDate}} → {{item.outDate}}
            .center （{{item.inDays}}天/第{{item.visitId}}次）
            .right(:class="[item.state === '住院' ? 'activeBorderColor' : '']") {{item.state}}
          .row_bottom
            .left_box
              .leftRow
                .name 科室
                .content {{item.deptName}}
              .leftRow
                .name 诊断
                .content {{item.diagnosis}}
            .right_box {{item.cost}} 元
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'

  export default {
    data() {
      return {
        paymentListMsg: '',
        listPreVisitArrMsg: '',
        selectTab1: true,
        selectTab2: false,
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: false,
        tipStatus: '',
        paymentList: [],
        patientId: '',
        RequestQty: 10,
        Start: 1,
        loadType: true,
        data: {},
        listPreVisitArr: []
      }
    },
    computed: {
    },
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
      selectTab(index) {
        if (index === 1) {
          this.paymentList = []
          this.selectTab2 = false
          this.selectTab1 = true
          this.loadType = true
          this.Start = 1
          this.getBillPayedRequest()
        } else {
          this.listPreVisitArr = []
          this.selectTab1 = false
          this.selectTab2 = true
          this.loadType = true
          this.Start = 1
          this.listPreVisitRequest()
        }
      },
      navigateToCaseDetail(item) {
        wxAsync.navigateTo({
          url: '/pages/visitingHistory-detail/main?data=' + JSON.stringify(item) + '&patientData=' + JSON.stringify(this.data)
        })
      },
      goInfo(item) {
        wxAsync.navigateTo({
          url: '/pages/visitingHistory-detail-zy/main?data=' + JSON.stringify(item) + '&patientData=' + JSON.stringify(this.data)
        })
      },
      async getBillPayedRequest() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/seeDoctor/getHisList',
            data: {
              PatientID: that.patientId,
              // PatientID: 9415048,
              // PatientID: 7631414,
              // PatientID: 2531,
              Start: that.Start,
              RequestQty: that.RequestQty
            }
          })
          console.log('getBillPayedRequest xxxxxxxxxxxx res:')
          console.log(res.data)
          console.log(res.data.length)
          if (res.data.length === 0) {
            that.MsgStatus = '0'
          }
          that.showPage()
          if (res.data) {
            if (res.data.length === that.RequestQty) {
              that.Start = that.Start + 1
            } else {
              that.loadType = false
            }
            if (res.data.length !== 0) {
              for (let i = 0; i < res.data.length; i++) {
                let cost = res.data[i].Cost.split('.')
                if (cost[0] === '') {
                  cost[0] = '0'
                  cost = cost.join('.')
                  res.data[i].Cost = cost
                }
                that.paymentList.push(res.data[i])
              }
              console.log('xxxxxxxxxxxxxxxxxx that.paymentList:')
              console.log(that.paymentList)
            } else {
              that.paymentListMsg = 0
            }
          } else {
            that.loadType = false
          }
        } catch (err) {
          that.paymentListMsg = 0
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
      async listPreVisitRequest() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/listPreVisit',
            data: {
              patientId: that.patientId,
              // patientId: 8330819,
              pageNo: that.Start,
              pageSize: that.RequestQty
            }
          })
          if (res.data.length === 0) {
            that.MsgStatus = '0'
          }
          that.showPage()
          if (res.data.prepayedList.length) {
            if (res.data.length === this.RequestQty) {
              this.Start = this.Start + 1
            } else {
              this.loadType = false
            }
            if (res.data.prepayedList.length !== 0) {
              that.listPreVisitArr = res.data.prepayedList
              for (let i = 0; i < that.listPreVisitArr.length; i++) {
                that.listPreVisitArr[i].inDate = that.listPreVisitArr[i].inDate.substr(0, 10)
                that.listPreVisitArr[i].outDate = that.listPreVisitArr[i].outDate.substr(0, 10)
              }
            } else {
              that.listPreVisitArrMsg = 0
            }
          } else {
            that.loadType = false
          }
        } catch (err) {
          that.listPreVisitArrMsg = 0
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            that.tipShow = '网络异常，请稍后再试'
            setTimeout(
              that.hideTip,
              3000
            )
            that.showTip()
          }
        }
      }
    },
    onReachBottom() {
      if (this.selectTab1) {
        if (this.loadType) {
          this.getBillPayedRequest()
        } else {
          wx.showToast({
            title: '没有更多数据！',
            icon: 'none'
          })
        }
      }
      if (this.selectTab2) {
        if (this.loadType) {
          this.listPreVisitRequest()
        } else {
          wx.showToast({
            title: '没有更多数据！',
            icon: 'none'
          })
        }
      }
    },
    onLoad(event) {
      let that = this
      that.hidePage()
      that.paymentListMsg = ''
      that.listPreVisitArrMsg = ''
      that.selectTab1 = true
      that.selectTab2 = false
      that.RequestQty = 10
      that.Start = 1
      that.paymentList = []
      that.listPreVisitArr = []
      that.loadType = true
      // 就诊人信息
      console.log(event)
      if (event.data) {
        that.data = JSON.parse(event.data)
      }
      that.patientId = that.data.patientId
      that.getBillPayedRequest()
      console.log(that.data)
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx
  rpx = rpxf()

  page
    background-color #19C1DE
    height 100%
    .main
      width 750 * rpx
      height 100%
      background #F0EFF5
      overflow hidden
      .bg
        height 700 * rpx
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
      .pay-list
        text-align center
        position absolute
        top 16 * rpx
        left 16 * rpx
        .cardInfo
          width 720 * rpx
          background #fff
          border-radius 8px
          display inline-block
          margin-bottom 16 * rpx
          position relative
          text-align left
          .patient_row
            height 96 * rpx
            line-height 96 * rpx
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
        .table_box
          margin-bottom 16 * rpx
          height 96 * rpx
          line-height 96 * rpx
          .row_box
            display flex
            display -webkit-flex
            justify-content space-around
            .box
              width 366 * rpx
              text-align center
              .des
                font-size 30 * rpx
                color #FFFFFF
                height 82 * rpx
              .line
                width 110 * rpx
                height 8 * rpx
                border-radius 8 * rpx
                margin-left 128 * rpx
                background #FFFFFF
        .department
          margin-bottom 16  * rpx
          display inline-block
          width 720  * rpx
          background-color #EFFDFF
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0, 0, 0, 0.05)
          border-radius 16 * rpx
          form
            .btn
              border none
              .pay-item
                margin-top 14 * rpx
                text-align left
                width 656  * rpx
                font-size 28 * rpx
                color #707070
                .left1
                  display inline-block
                  position absolute
                  margin-right 32 * rpx
                .left2
                  display inline-block
                  margin-left 144 * rpx
                .right1
                  color #707070
                  font-size 24 * rpx
                  display inline-block
                  position absolute
                  right 32 * rpx
              .pay-item_content
                margin-bottom 16 * rpx
                padding-top 14 * rpx
                border-top 2 * rpx solid rgba(229,229,229,1)
                text-align left
                width 656  * rpx
                font-size 28  * rpx
                color #707070
                .content_list
                  .left
                    display inline-block
                    position absolute
                    left 32 * rpx
                  .right
                    display inline-block
                    width 368 * rpx
                    margin-left 85 * rpx
                    line-height 45 * rpx
                    color #000000
                  .right2
                    position absolute
                    bottom 45 * rpx
                    right 32 * rpx
                    color #FF0000
                    font-size 28 * rpx
                  .status
                    width 104 * rpx
                    height 48 * rpx
                    text-align center
                    line-height 48 * rpx
                    display inline-block
                    float right
                    color #ffffff
                    border-radius 24 * rpx
        .activeBackground
          background-color #fff
        .inHospital
          display inline-block
          .inHospital_box
            margin-bottom 16  * rpx
            display inline-block
            width 720  * rpx
            background-color #EFFDFF
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0, 0, 0, 0.05)
            border-radius 16 * rpx
            .row_top
              width 656  * rpx
              height 96 * rpx
              line-height 96 * rpx
              margin-left 32 * rpx
              display flex
              display -webkit-flex
              justify-content row
              font-size 28 * rpx
              .left
                color #000000
              .center
                color #707070
                margin-right 64 * rpx
              .right
                position absolute
                right 32 * rpx
                margin-top 20 * rpx
                color #707070
                font-size 24 * rpx
                width 96 * rpx
                text-align center
                height 50 * rpx
                line-height 50 * rpx
                border 2 * rpx solid rgba(112,112,112,1)
                border-radius 16 * rpx
              .activeBorderColor
                color #0AD403
                border 2 * rpx solid rgba(10,212,3,1)
            .row_bottom
              display flex
              display -webkit-flex
              justify-content space-between
              padding-top 24 * rpx
              padding-bottom 24 * rpx
              width 656  * rpx
              margin-left 32 * rpx
              border-top 2 * rpx solid rgba(229,229,229,1)
              .left_box
                display inline-block
                .leftRow
                  display flex
                  display -webkit-flex
                  font-size 28 * rpx
                  margin-bottom 16 * rpx
                  .name
                    color #707070
                    margin-right 32 * rpx
                    display inline-block
                  .content
                    width 345 * rpx
                    text-align left
                    color #000000
                    display inline-block
              .right_box
                color #FF0000
                font-size 28 * rpx
        .activeBackground
          background-color #fff
</style>
