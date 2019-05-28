<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tips}}
    .payment(v-show="activeDisplay1")
      .cardInfo
        .text 就诊人
        .text-1 {{choose}}
        picker.text-2(@change="bindPickerChange" :value="index1" :range="peopleArray") 更换就诊人
        .jump-info
      .box-table
        .box_today(@tap="selected",:data-key="1")
          .table_today 今日待缴
          .line(v-if="type === 1")
        .box_hist(@tap="selected",:data-key="2")
          .table_hist 历史待缴
          .line(v-if="type === 2")
        .box_hist(@tap="selected",:data-key="3")
          .table_hist 历史已缴
          .line(v-if="type === 3")
      .none(v-if="list.length === 0") 暂无相关信息
      .box-list(v-if="list.length > 0")
        .box(@tap="goInfo(item)",v-for="(item, index) in list",:class="[index%2 !== 0 ? 'activeBackground' : '']")
          .item-1(@tap.stop="selectItem(index)")
            img(v-if="type != 3", mode="widthFix", :src="list[index].click?'https://nontax-cdn.yuluoo.com/hospital-post-gou1.png':'https://nontax-cdn.yuluoo.com/hospital-choose-not.png'")
          .item-2
            .item-box-1
              .item-text-1 挂号单号
              .item-text-1 就诊医生
              .item-text-1 就诊科室
              .item-text-1 就诊时间
            .item-box-2
              .item-text-2 {{item.list.RegisterNo}}
              .item-text-2 {{item.list.Doctor}}
              .item-text-2 {{item.list.PatDep}}
              .item-text-2 {{item.list.Date}}
          .item-3
            .item-3-txt ￥{{item.list.fee}}
          .item-4(v-if="item.list.InsureType === '1'")
            .item-4-txt 新农合
      .pay-btn(v-if="type != 3")
        .sum
          .text-1 合计:
          .text-2 ￥{{sum}}
        .text-btn(:class="[ isSelected ? 'selectedColor' : '']",@tap="pay()")
          .text-3 结算
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        activeDisplay1: true,
        isSelected: false,
        tipStatus: '',
        wxCallbackUrl: '',
        orderNo: '',
        name: '',
        list: [],
        outpatientNo: '',
        patientId: '',
        sum: 0.00,
        payDetail: [],
        listHealthCard: [],
        type: 1,
        loginType: false,
        peopleArray: [],
        choose: '',
        RegisterNo: '',
        InsureType: '',
        item: ''
      }
    },

    computed: {
      tips() {
        if (this.tipStatus === 1) {
          return '请先选择缴费项目'
        }
        if (this.tipStatus === 2) {
          return '网络异常，请稍后重试'
        }
      }
    },

    components: {},
    methods: {
      bindPickerChange(event) {
        this.choose = this.peopleArray[event.mp.detail.value]
        this.index = event.mp.detail.value
        console.log(this.index)
        this.peopleDate = this.peopleList[this.index]
        this.patientId = this.peopleDate.patientId
        this.name = this.peopleDate.name
        this.tosetMr(this.peopleDate)
        if (this.type === 1) {
          this.paymentListRequest()
        } else if (this.type === 2) {
          this.getHistListRequest()
        } else {
          this.getPaymentListRequest()
        }
      },
      async tosetMr(item) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/setDefault',
            data: {
              cardId: item.id
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          // self.listHealthCardRequest()
        } catch (err) {
          console.log('fail')
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
      },
      setpeopleArray() {
        let self = this
        self.peopleArray = []
        self.peopleList = self.listHealthCard
        self.peopleDate = self.peopleList[0]
        self.choose = self.peopleDate.name + '(' + self.peopleDate.outpatientNo + ')'
        self.name = self.peopleDate.name
        console.log(self.choose)
        for (let i = 0, length = self.peopleList.length; i < length; i++) {
          self.peopleArray.push(self.peopleList[i].name + '(' + self.peopleList[i].outpatientNo + ')')
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
      hidePage() {
        this.activeDisplay1 = false
      },
      selected(event) {
        console.log(event)
        console.log(event.currentTarget.dataset.key)
        if (event.currentTarget.dataset.key === 1) {
          this.sum = RPC.toDecimal2(0.00)
          this.payDetail = []
          this.type = 1
          this.paymentListRequest()
        }
        if (event.currentTarget.dataset.key === 2) {
          this.sum = RPC.toDecimal2(0.00)
          this.payDetail = []
          this.type = 2
          this.getHistListRequest()
        }
        if (event.currentTarget.dataset.key === 3) {
          this.sum = RPC.toDecimal2(0.00)
          this.payDetail = []
          this.type = 3
          this.getPaymentListRequest()
        }
      },
      goInfo(item) {
        wx.navigateTo({
          url: '../pay-detail/main?item=' + JSON.stringify(item) + '&name=' + this.name + '&patientId=' + this.patientId + '&type=' + this.type + '&RegisterNo=' + item.RegisterNo + '&InsureType=' + item.InsureType
        })
      },
      pay() {
        console.log('xxxxx this.RegisterNo:')
        console.log(this.RegisterNo)
        if (this.sum === '0.00') {
          this.tipStatus = 1
          setTimeout(
            this.hideTip,
            3000
          )
          this.showTip()
        } else {
          // wxAsync.navigateTo({
          //   url: '../pay-list-info/main?itemName=' + JSON.stringify(this.payDetail) + '&name=' + this.name + '&patientId=' + this.patientId + '&fee=' + this.sum + '&RegisterNo=' + this.RegisterNo + '&InsureType=' + this.InsureType
          // })
          wxAsync.navigateTo({
            url: '../pay-list-info/main?item=' + JSON.stringify(this.item) + '&name=' + this.name + '&patientId=' + this.patientId + '&fee=' + this.sum + '&RegisterNo=' + this.RegisterNo + '&InsureType=' + this.InsureType
          })
        }
      },
      // selectItem(index) {
      //   // 多选
      //   // type不为3才执行
      //   let that = this
      //   if (that.type !== 3) {
      //     that.list[index].click = !that.list[index].click
      //     if (that.list[index].click) {
      //       console.log('xxxxxxxxx click=true:')
      //       // 选择时按钮颜色的变化
      //       that.isSelected = true
      //       // 存入明细
      //       for (let i = 0; i < 1; i++) {
      //         that.payDetail.push(that.list[index].list.Items)
      //         // 计算总额
      //         that.sumArr.push(parseFloat(that.list[index].list.fee))
      //       }
      //       // 计算总额
      //       console.log(that.sumArr)
      //       if (that.sumArr.length === 1) {
      //         that.sum = RPC.toDecimal2(that.sumArr[0])
      //       } else {
      //         that.sum = that.sumArr[0]
      //         console.log(that.sum)
      //         for (let i = 0; i < that.sumArr.length - 1; i++) {
      //           console.log(that.sumArr[i + 1])
      //           that.sum += that.sumArr[i + 1]
      //           that.sum = Math.round(that.sum * 100) / 100
      //         }
      //       }
      //     } else {
      //       // 存入明细
      //       for (let i = 0; i < that.payDetail.length; i++) {
      //         if (that.payDetail[i] === that.list[index].list.Items) {
      //           that.payDetail.splice(i, 1)
      //           break
      //         }
      //       }
      //       // 计算总额
      //       console.log(that.list[index].list.fee)
      //       console.log(that.sumArr)
      //       for (let i = 0; i < that.sumArr.length; i++) {
      //         if (that.sumArr[i] === parseFloat(that.list[index].list.fee)) {
      //           console.log('xxxxxxxxx fee:')
      //           that.sumArr.splice(i, 1)
      //           console.log(that.sumArr)
      //           if (that.sumArr.length === 0) {
      //             console.log('xxxxxxxxx click=false:')
      //             // 未选择时按钮颜色的变化
      //             that.isSelected = false
      //             that.sum = RPC.toDecimal2(0.00)
      //           } else {
      //             that.sum = 0.00
      //             for (let k = 0; k < that.sumArr.length; k++) {
      //               that.sum += that.sumArr[k]
      //               that.sum = Math.round(that.sum * 100) / 100
      //             }
      //           }
      //         }
      //       }
      //     }
      //     console.log(that.sum)
      //     console.log(that.list[index].list.Items)
      //     console.log(that.payDetail)
      //   }
      // },
      selectItem(index) {
        // 单选
        // type不为3才执行
        let that = this
        that.RegisterNo = that.list[index].list.RegisterNo
        that.InsureType = that.list[index].list.InsureType
        that.item = that.list[index]
        if (that.type !== 3) {
          that.list[index].click = !that.list[index].click
          for (let i = 0; i < that.list.length; i++) {
            if (index !== i) {
              that.list[i].click = false
            }
          }
          if (that.list[index].click) {
            that.payDetail = []
            console.log('xxxxxxxxx click=true:')
            // 选择时按钮颜色的变化
            that.isSelected = true
            that.payDetail = that.list[index].list.Items
            that.sum = RPC.toDecimal2(parseFloat(that.list[index].list.fee))
          } else {
            that.isSelected = false
            that.payDetail = []
            that.sum = RPC.toDecimal2(0.00)
          }
          console.log(that.sum)
          console.log('xxxxx Items:')
          console.log(that.list[index].list.Items)
          console.log('xxxxx that.payDetail:')
          console.log(that.payDetail)
        }
      },
      async paymentListRequest() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        that.list = []
        // that.hidePage()
        that.hideTip()
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/getList',
            data: {
              PatientId: '10083150',
              // PatientId: that.patientId,
              DayStart: RPC.getDay(-1),
              DayEnd: RPC.getDay(1)
            }
          })
          console.log('success')
          console.log(res.List)
          if (res.List.length !== 0) {
            let arr = []
            arr = res.List
            for (let i = 0; i < arr.length; i++) {
              let obj = {}
              obj.click = false
              obj.list = arr[i]
              that.list.push(obj)
            }
            // this.showPage()
            console.log('xxxxxxxxx that.list:')
            console.log(that.list)
          }
        } catch (err) {
          console.log(err)
          this.tipStatus = 2
          setTimeout(
            this.hideTip,
            3000
          )
          this.showTip()
        }
      },
      async listHealthCardRequest() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listHealthCard',
            data: {
            }
          })
          console.log('success')
          console.log(res)
          that.listHealthCard = res.data.archivesList
          if (that.listHealthCard.length > 0) {
            try {
              wx.setStorageSync('getHealthCardList', that.listHealthCard)
              console.log('xxxxxxxxxxxxx setStorage xxxxxx success')
            } catch (err) {
              console.log(err)
            }
            that.patientId = that.listHealthCard[0].patientId
            that.setpeopleArray()
            if (that.type === 1) {
              that.paymentListRequest()
            } else if (that.type === 2) {
              that.getHistListRequest()
            } else {
              that.getPaymentListRequest()
            }
          } else {
            wx.showModal({
              title: '提示！',
              content: '请先绑定您的健康卡！',
              confirmText: '去绑定',
              cancelText: '返回首页',
              confirmColor: '#19C1DE',
              cancelColor: '#000000',
              success(res) {
                console.log(res)
                if (res.confirm) {
                  wxAsync.navigateTo({
                    url: '/pages/card-new-1/main'
                  })
                } else {
                  wxAsync.reLaunch({
                    url: '/pages/index/main'
                  })
                }
              }
            })
          }
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipStatus = 2
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      // 查询前7天待缴费
      async getHistListRequest() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        that.list = []
        that.hideTip()
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/getList',
            data: {
              // PatientId: '10083150',
              PatientId: that.patientId,
              // PatientId: '9044750',
              DayStart: RPC.getDay(-31),
              DayEnd: RPC.getDay(-1)
            }
          })
          console.log('success')
          console.log(res.List)
          if (res.List.length !== 0) {
            let arr = []
            arr = res.List
            for (let i = 0; i < arr.length; i++) {
              let obj = {}
              arr[i].fee = Number(arr[i].fee)
              obj.click = false
              obj.list = arr[i]
              that.list.push(obj)
            }
            console.log('xxxxxxxxx that.listHist:')
            console.log(that.list)
          }
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipStatus = 2
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async getPaymentListRequest() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        that.list = []
        that.hideTip()
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/getBillPayed',
            data: {
              PatientID: that.patientId,
              // PatientID: '9044750',
              // PatientID: 8548306,
              // PatientID: 7631414,
              // StartDate: '2018-12-27',
              // EndDate: '2019-1-12'
              StartDate: RPC.getDay(-365),
              EndDate: RPC.getDay(0)
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          if (res.List.length !== 0) {
            let arr = []
            arr = res.List
            for (let i = 0; i < arr.length; i++) {
              let obj = {}
              arr[i].fee = Number(arr[i].fee)
              obj.click = false
              obj.list = arr[i]
              that.list.push(obj)
            }
            console.log('xxxxxxxxx that.listHist:')
            console.log(that.list)
          }
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipStatus = 2
            setTimeout(
              this.hideTip,
              3000
            )
            this.showTip()
          }
        }
      },
      async login() {
        let self = this
        self.loginType = await RPC.login()
        if (self.loginType) {
          self.listHealthCardRequest()
        }
      }
    },
    onShow() {
      let that = this
      if (that.loginType) {
        that.sum = RPC.toDecimal2(0.00)
        that.sumArr = []
        that.isSelected = false
        that.payDetail = []
        that.list = []
        that.listHealthCardRequest()
      }
    },
    created() {
    },
    onLoad() {
      let that = this
      that.type = 1
      if (!that.loginType) {
        that.sum = RPC.toDecimal2(0.00)
        that.sumArr = []
        that.payDetail = []
        that.list = []
        that.isSelected = false
        that.type = 1
        that.login()
      }
    }
  }
</script>

<style lang="stylus">
  rpxf()
    1rpx
  rpx = rpxf()

  page
    height 100%
    background  #F0EFF5
    .main
      width 750 * rpx
      height 100%
      overflow hidden
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
      .payment
        height 100%
        width 100%
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
            position absolute
            left 168 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-left 400 * rpx
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
              position relative
              top -2px
              position absolute
              top 50%
              margin-top -6 * rpx
              right 2px
        .box-table
          width 720 * rpx
          margin-left 16 * rpx
          margin-bottom 28 * rpx
          display flex
          display -webkit-flex
          justify-content space-around
          .box_today
            color #fff
            font-size 32 * rpx
            display inline-block
            padding-top 32 * rpx
            .table_today
              display inline-block
            .line
              height 8 * rpx
              width 110 * rpx
              margin-left 10 * rpx
              margin-top 10 * rpx
              background #FFFFFF
              border-radius 16 * rpx
          .box_hist
            color #fff
            font-size 32 * rpx
            padding-top 32 * rpx
            display inline-block
            .table_hist
              display inline-block
            .line
              height 8 * rpx
              width 110 * rpx
              margin-top 10 * rpx
              margin-left 10 * rpx
              background #FFFFFF
              border-radius 16 * rpx
        .none
          color #9999
          padding-top 50%
          text-align center
        .box-list
          width 720 * rpx
          padding-bottom 294 * rpx
          margin-left 16 * rpx
          .box
            width 720 * rpx
            padding-bottom 24 * rpx
            margin-top 16 * rpx
            border-radius 8px
            background-color rgba(239,253,255,1)
            display flex
            display -webkit-flex
            position relative
            .item-1
              display inline-block
              width 64 * rpx
              height 64 * rpx
              margin-left 16 * rpx
              margin-top 16 * rpx
              img
                width 100%
                height 100%
            .item-2
              display flex
              display -webkit-flex
              justify-content space-around
              width auto
              height auto
              margin-top 8 * rpx
              .item-box-1
                display inline-block
                .item-text-1
                  margin-top 16 * rpx
                  font-size 14px
                  color #707070
              .item-box-2
                margin-left 64 * rpx
                display inline-block
                .item-text-2
                  margin-top 16 * rpx
                  font-size 14px
            .item-3
              display inline-block
              position absolute
              right 32 * rpx
              .item-3-txt
                color #FF9100
                margin-top 16 * rpx
                font-size 16px
            .item-4
              display inline-block
              width 106 * rpx
              height 40 * rpx
              line-height 40 * rpx
              text-align center
              border 2 * rpx solid rgba(109,186,20,1)
              border-radius 24 * rpx
              position absolute
              right 32 * rpx
              top 75 * rpx
              .item-4-txt
                color #6DBA14
                font-size 22 * rpx
          .tips
            width 652 * rpx
            display inline-block
            color #B81C24
            margin-left 48 * rpx
            .left
              display inline-block
              text-align left
              font-size 28 * rpx
            .right
              display inline-block
              font-size 28 * rpx
          .activeBackground
            background-color #fff
        .pay-btn
          width 750 * rpx
          height 112 * rpx
          line-height 112 * rpx
          text-align center
          background-color #fff
          margin-top 422 * rpx
          display flex
          position fixed
          bottom 0
          left 0
          z-index 999
          .sum
            margin-left 32 * rpx
            .text-1
              color #707070
              display inline-block
              font-size 32 * rpx
              margin-right 12 * rpx
            .text-2
              line-height 112 * rpx
              color #19C1DE
              font-weight bold
              display inline-block
              font-size 32 * rpx
          .text-btn
            position absolute
            right 30 * rpx
            display inline-block
            margin-top 18 * rpx
            width 160 * rpx
            height 80 * rpx
            border-radius 8px
            background-color #19C1DE
            opacity 0.5
            pointer-events none
            .text-3
              color white
              line-height 80 * rpx
              font-size 16px
          .selectedColor
            opacity 1
            pointer-events auto
</style>
