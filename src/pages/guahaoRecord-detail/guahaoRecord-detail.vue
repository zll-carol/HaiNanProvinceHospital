<template lang="pug">
  form(@submit="clickPay", report-submit="true")
    .main
      .bg
      .pay-tip(v-show="activeDisplay") 网络异常，请稍后重试
      .payRecord
        .content
          .item
            .left 就诊状态
            .right {{data.startStr}}
          .item
            .left 挂号单号
            .right {{data.registerNo}}
          .item
            .left 就诊人
            .right {{data.visitName}}
          .item
            .left 挂号费用
            .right {{data.fee}}元
          .item
            .left 就诊科室
            .right {{data.sectionName}}
          .item
            .left 就诊医生
            .right {{data.visitDoctor}}
          .item
            .left 就诊时间
            .right {{data.visitTime}}
          .item
            .left 就诊序号
            .right {{data.jzNo}}
          .item(style="border:none")
            .left 就诊地点
            .right {{data.address}}
        .item_tips(v-if="data.status == '0'")
          .left 温馨提示：
          .right 未支付挂号订单，超过 2 分钟将自动取消。
        <!--.pay(@tap="navigateToResult('../visitingHistory-list/main')",v-if="data.startStr == '已就诊'") 就诊结果-->
        button.pay(formType= "submit",v-if="data.status == '0'" :style="clickType==false?'opacity: 0.2':''") {{timeText}}
    .backIndex(@tap="th()",v-if="data.canRefund == '1'") 退号
    .backIndex(@tap="gotoIndex()",v-if="data.status == '1'") 返回首页
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        clickType: true,
        activeDisplay: false,
        timeText: '立即支付',
        time: '',
        item: {},
        data: {},
        peopleData: {},
        num: 0
      }
    },
    computed: {},
    methods: {
      gotoIndex() {
        // 返回首页
        wxAsync.reLaunch({
          url: '/pages/index/main'
        })
      },
      timer() {
        if (this.globalData.time) {
          this.time = this.globalData.time
        }
        console.log(this.globalData.time)
        this.myInterval = setInterval(
          this.sendTextMessage,
          1000
        )
      },
      sendTextMessage() {
        this.timeText = '立即支付（' + this.time + '秒）'
        if (this.time < 1) {
          // 已超时
          clearInterval(this.myInterval)
          this.timeText = '返回'
        }
        this.time--
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      navigateToResult(url) {
        wxAsync.navigateTo({
          url: url
        })
      },
      navigateToPay(event) {
        console.log(event)
        console.log(event.mp.detail.formId)
        this.saveFormId(event.mp.detail.formId)
        wxAsync.navigateBack({
          delta: 200
        })
      },
      th() {
        let self = this
        wx.showModal({
          title: '退号',
          content: '是否确定退号？',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            console.log(res)
            if (res.confirm) {
              console.log('用户点击确定')
              self.withdrawNo()
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      async clickPay(event) {
        let self = this
        console.log(this.clickType + '11111111111111111111111111')
        if (this.clickType) {
          this.clickType = false
          setTimeout(
            this.setClick,
            120000
          )
          console.log(event)
          // this.saveFormId(event.mp.detail.formId)
          if (this.time < 1) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            try {
              let res = await RPC.request({
                url: '/HospitalFormApi/register/getRegisterByOrderNo',
                data: {
                  orderNo: self.item.orderNo,
                  patientId: self.peopleData.patientId
                }
              })
              console.log(res)
              if (res.data.status === 0) {
                self.saveFormId(event.mp.detail.formId)
                RPC.JHpay(self.item.wxCallbackUrl, self.item.fee, self.item.orderNo, 1, self.peopleData.patientId)
              } else {
                // 已超时
                self.data = res.data
              }
            } catch (err) {
              console.log(err)
              setTimeout(
                this.hideTip,
                3000
              )
              this.showTip()
            }
          }
        }
      },
      setClick() {
        this.clickType = true
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/templatemsg/submitFormId',
            data: {
              formId: formId
            }
          })
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      },
      async loadData() {
        let self = this
        if (self.num === 0) {
          wxAsync.showLoading({title: '数据加载中', mask: true})
        }
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/getRegisterByOrderNo',
            data: {
              orderNo: self.item.orderNo,
              patientId: self.peopleData.patientId
            },
            type: 1
          })
          console.log(res)
          self.data = res.data
          if (self.data.status === 0) {
            wxAsync.hideLoading()
            if (this.myInterval) {
              clearInterval(this.myInterval)
              this.timer()
            } else {
              this.timer()
            }
          }
          if (self.data.status === 1 && !self.data.registerNo && self.num < 3) {
            // 123 没有挂上号，再次请求，重复请求3次
            self.num++
            console.log(self.num)
            setTimeout(
              this.loadData,
              1000
            )
          } else {
            wxAsync.hideLoading()
            // if (self.data.status === 3) {
            //   RPC.toShow('本次挂号失败，如没退款，请联系医院客服！')
            // }
          }
        } catch (err) {
          wxAsync.hideLoading()
          console.log(err)
          setTimeout(
            this.hideTip,
            3000
          )
          this.showTip()
        }
      },
      async withdrawNo() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/withdrawNo',
            data: {
              terminalNo: '退号',
              patientId: this.item.patientId,
              asid: this.item.asid,
              registerNo: this.item.registerNo,
              payAmt: this.item.fee,
              payNo: this.item.payNo,
              payCardNo: this.item.payCardNo,
              payNote: '退号',
              lotNo: this.item.lotNo,
              sysRefNo: this.item.sysRefNo,
              asRowid: this.item.asRowid,
              tradeSno: this.item.tradeSno
            }
          })
          console.log(res)
          wx.showToast({
            title: '已退号',
            icon: 'success',
            duration: 2000
          })
          // 返回首页
          wxAsync.reLaunch({
            url: '/pages/index/main'
          })
        } catch (err) {
          console.log(err)
          setTimeout(
            this.hideTip,
            3000
          )
          this.showTip()
        }
      }
    },
    created() {
    },
    onLoad(event) {
      this.num = 0
      this.clickType = true
      this.item = JSON.parse(event.param)
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
      console.log(this.item)
      if (this.item.orderNo) {
        console.log(1111)
        this.loadData()
      } else {
        console.log(22222)
        this.data = this.item
      }
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx

  rpx =  rpxf()

  page
    background-color #EFEFF4
    .main
      width 750 * rpx
      overflow hidden
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
      .payRecord
        position absolute
        top 16 * rpx
        left 16 * rpx
        .content
          width 720  * rpx
          background rgba(255, 255, 255, 1)
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.05)
          opacity 1
          border-radius 16px
          .item
            display inline-block
            text-align left
            width 656  * rpx
            line-height 96  * rpx
            border-bottom 2  * rpx solid rgba(229, 229, 229, 1)
            font-size 32  * rpx
            .left
              color #707070
              display inline-block
              position absolute
            .right
              width 400 * rpx
              text-align right
              margin-left 245 * rpx
              margin-top 26 * rpx
              line-height 1.5
              display inline-block
        .item_tips
          margin-top 32  * rpx
          margin-bottom 38 * rpx
          display inline-block
          text-align left
          width 656  * rpx
          font-size 24  * rpx
          color #FF0000
          .left
            margin-bottom 22 * rpx
        .pay
          width 690 * rpx
          height 88 * rpx
          display inline-block
          line-height 88 * rpx
          color #FFFFFF
          background #19C1DE
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
          border-radius 44 * rpx
    .backIndex
      width 690 * rpx
      height 88 * rpx
      line-height 88 * rpx
      position absolute
      left 32 * rpx
      bottom 54 * rpx
      text-align center
      display inline-block
      color #FFFFFF
      background #19C1DE
      box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
      border-radius 44 * rpx
</style>
