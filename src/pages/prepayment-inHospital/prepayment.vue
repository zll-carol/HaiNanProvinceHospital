<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .payment
      .cardInfo
        .text 就诊人
        .text-1 {{choose}}
        picker.text-2(@change="bindPickerChange" :value="index1" :range="peopleArray") 更换就诊人
        .jump-info
      .box-table
        .box_today(@click="selected",:data-key="1")
          .table_today 住院预缴
          .line(v-if="type === 1")
        .box_today(@click="selected",:data-key="2")
          .table_today 历史预缴
          .line(v-if="type === 2")
        .box_today(@click="selected",:data-key="3")
          .table_today 结账退款
          .line(v-if="type === 3")
      .prepayment_box(v-if="type === 1")
        .none(v-if="data.sex === 'undefined'") 暂无相关信息
        .content_box(v-if="data.length !== 0")
          .content_box1
            .content_row
              .left 性别
              .left_content {{data.sex}}
              .right 年龄
              .right_content {{data.age}}
            .content_row
              .left 住院号
              .left_content {{data.adno}}
              .right 入院日期
              .right_content {{data.inDate}}
            .content_row
              .left 床位号
              .left_content {{data.bed}}
              .right 住院次数
              .right_content {{data.visitId}}
            .content_row
              .left 住院科室
              .left_content {{data.deptName}}
            .content_row
              .left 住院费用
              .left_content {{data.totAmt}}元
            .content_row
              .left 预缴金额
              .left_content {{data.deposit}}元
            .content_row
              .left 已结金额
              .left_content {{data.fAmt}}元
            .content_row
              .left 剩余金额
              .left_content(style="color: #FF9100") {{data.balance}}元
          .content_box2
            .left 预缴金额
            .right
              input.feeInput(@input="changeBtnColor", v-model="prepaymentFee", type="number", placeholder="请输入预缴金额")
              .unit 元
          .btn_box(:style="{opacity: activeOpacity}" @tap="pay" v-if="payShow") 立即预缴
      .historyPayment_box(v-if="type === 2")
        .none(v-if="list.length === 0") 暂无相关信息
        .content_box(v-if="list.length !== 0", v-for="item in list")
          .content_row1
            .left
              .num 预缴单号
              .num_content {{item.advanceNo}}
            .right {{item.payTime}}
          .content_row2
            .row
              .left
                .inHospital 住院次数
                .inHospital_content {{item.visitId}}
              .right(style="color:#FF0000") {{item.deposit}}元
            .row
              .left
                .inHospital 住院科室
                .inHospital_content {{item.deptName}}
              .right(style="font-size:11px") {{item.payMode}}预缴
      .refund_box(v-if="type === 3")
        .refund_content
          .row_box
            .left 账号户名
            input.right(type="text", :disabled="disabled", placeholder="请输入退款账号户名", v-model="refundName")
          .row_box
            .left 银行账号
            input.right(type="number", :disabled="disabled",@blur="getBankName", placeholder="请输入退款银行账号", v-model="bankAccount")
          .row_box
            .left 开户行
            input.right(type="text", :disabled="disabled", placeholder="请输入开户行", v-model="bankName")
          .row_box
            .left 姓名
            input.right(type="text", :disabled="disabled", placeholder="请输入操作人姓名", v-model="idName")
          .row_box
            .left 身份证号
            input.right(type="idcard", :disabled="disabled", placeholder="请输入操作人身份证号码", v-model="idCard")
          .row_box(style="border:none")
            .left 手机号码
            input.right(type="number", :disabled="disabled", placeholder="请输入操作人手机号码", v-model="phoneNum")
        .tips_box
          .row(style="font-weight:bold") 温馨提示：
          .row 请确认账号信息准确无误，出院结算后剩余押金将退款至该银行账号。
        .btn_box(v-if="btnType === 1", @click="save") 保存
        .btn_box(v-if="btnType === 2",@click="revise") 修改
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        data: {}, // 住院信息
        list: [], // 历史列表
        prepaymentFee: '', // 缴费金额
        activeDisplay: false,
        tipShow: '',
        activeOpacity: 0.4,
        outpatientNo: '',
        patientId: '',
        listHealthCard: [],
        type: 1,
        loginType: false,
        peopleArray: [],
        choose: '',
        payShow: true,
        refundName: '',
        bankAccount: '',
        bankName: '',
        name: '',
        idName: '',
        idCard: '',
        phoneNum: '',
        btnType: 1,
        disabled: false
      }
    },

    computed: {
      // 6210812550001813006
    },

    components: {},
    methods: {
      getBankName() {
        this.getBankInfoRequest()
      },
      revise() {
        this.refundName = ''
        this.bankAccount = ''
        this.bankName = ''
        this.idName = ''
        this.idCard = ''
        this.phoneNum = ''
        this.btnType = 1
        this.disabled = false
      },
      save() {
        if (this.refundName === '') {
          this.showTip(15)
        } else if (this.bankAccount === '') {
          this.showTip(16)
        } else if (this.bankName === '') {
          this.showTip(17)
        } else if (this.idCard === '') {
          this.showTip(14)
        } else if (this.idCard.length !== 15 && this.idCard.length !== 18) {
          this.showTip(2)
        } else if (this.phoneNum === '') {
          this.showTip(4)
        } else if (!/^1[34578]\d{9}$/.test(this.phoneNum)) {
          this.showTip(5)
        } else {
          // this.check()
          this.saveBankCardInfoRequest()
        }
      },
      showTip(index) {
        this.tipShow = RPC.tipShowText(index)
        this.activeDisplay = true
        setTimeout(
          this.hideTip,
          3000
        )
      },
      hideTip() {
        this.activeDisplay = false
      },
      changeBtnColor(event) {
        console.log(event)
        console.log(Number(this.prepaymentFee))
        if (event.mp.detail.value !== '') {
          this.activeOpacity = 1
        } else {
          this.activeOpacity = 0.4
        }
      },
      bindPickerChange(event) {
        this.choose = this.peopleArray[event.mp.detail.value]
        this.index = event.mp.detail.value
        console.log(this.index)
        this.peopleDate = this.peopleList[this.index]
        this.patientId = this.peopleDate.patientId
        this.name = this.peopleDate.name
        this.tosetMr(this.peopleDate)
        if (this.type === 1) {
        } else if (this.type === 2) {

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
          this.listHealthCardRequest()
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.showTip(10)
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
      selected(event) {
        console.log(event)
        console.log(event.currentTarget.dataset.key)
        if (event.currentTarget.dataset.key === 1) {
          this.type = 1
          this.hospitalPrepayList()
        }
        if (event.currentTarget.dataset.key === 2) {
          this.type = 2
          this.hospitalPrepayListPayed()
        }
        if (event.currentTarget.dataset.key === 3) {
          this.type = 3
          console.log('xxxxx:' + this.data.visitId)
          this.getBankCardNoRequest()
        }
      },
      pay() {
        if (this.activeOpacity === 1) {
          this.activeOpacity = 0.4
          if (Number(this.prepaymentFee) === 0) {
            RPC.toShow('请输入正确的金额！')
          } else {
            this.toPay()
          }
        }
      },
      async toPay() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/hospitalPrepay',
            data: {
              patientName: that.data.patientName,
              bed: that.data.bed,
              deposit: that.data.deposit,
              totAmt: that.data.totAmt,
              outdate: that.data.outdate,
              deptId: that.data.deptId,
              inDate: that.data.inDate,
              adno: that.data.adno,
              deptName: that.data.deptName,
              balance: that.data.balance,
              age: that.data.age,
              fAmt: Number(that.prepaymentFee),
              visitId: that.data.visitId,
              patientId: this.patientId
            }
          })
          console.log('success')
          console.log(res)
          RPC.JHpay(res.data.wxCallbackUrl, Number(that.prepaymentFee), res.data.orderNo, 3, this.patientId)
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async hospitalPrepayList() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        that.data = {}
        that.prepaymentFee = ''
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/list',
            data: {
              patientId: that.patientId
              // patientId: '7308067'
            }
          })
          console.log('success')
          console.log(res)
          that.data = res.data.prepayInfo
          that.data.inDate = that.data.inDate.substring(0, 10)
          that.payShow = true
          console.log('xxxxxxx data:')
          console.log(that.data)
        } catch (err) {
          console.log(err)
          that.payShow = false
          RPC.toShow(err.errmsg)
        }
      },
      async hospitalPrepayListPayed() {
        console.log('xxxxxxxxxx patientId:')
        console.log(this.patientId)
        let that = this
        that.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/listPayed',
            data: {
              patientId: that.patientId,
              // patientId: '7308067',
              pageNo: '1',
              pageSize: '10'
            }
          })
          console.log('success')
          console.log(res)
          that.list = res.data.prepayedList
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async getBankInfoRequest() { // 查询卡号所属银行名称
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/getBankInfo',
            data: {
              cardNo: that.bankAccount
            }
          })
          console.log('success')
          console.log(res)
          that.bankName = res.cardBin.bankName
        } catch (err) {
          console.log(err)
        }
      },
      async getBankCardNoRequest() { // 查询之前是否填写过相关信息
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/getBankCardNo',
            data: {
              patientId: that.patientId,
              // patientId: '7308067'
              visitId: that.data.visitId
            }
          })
          console.log('success')
          console.log(res)
          that.refundName = res.data.BankAccount
          if (typeof res.data.AccountNO === 'string') {
            that.bankAccount = res.data.AccountNO
          } else {
            that.bankAccount = '"' + res.data.AccountNO + '"'
          }
          if (typeof res.data.OperatorCardNO === 'string') {
            that.idCard = res.data.OperatorCardNO
          } else {
            that.idCard = '"' + res.data.OperatorCardNO + '"'
          }
          that.bankName = res.data.BankName
          that.idName = res.data.Operator
          that.phoneNum = res.data.MobilePhone
          that.btnType = 2
          that.disabled = true
        } catch (err) {
          console.log(err)
        }
      },
      async saveBankCardInfoRequest() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/saveBankCardInfo',
            data: {
              patientId: that.patientId,
              visitId: that.data.visitId,
              name: that.refundName, // 账户名
              bankCardNo: that.bankAccount, // 银行卡号
              bankbName: that.bankName, // 银行名称
              idName: that.idName, // 姓名
              idCardNo: that.idCard, // 身份证号
              mobileNo: that.phoneNum // 手机号
            }
          })
          console.log('success')
          console.log(res)
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          that.btnType = 2
        } catch (err) {
          console.log(err)
          this.showTip(10)
        }
      },
      async wxChcekIsSupportFacialRecognition() {
        return new Promise((resolve, reject) => {
          wx.checkIsSupportFacialRecognition({
            success(errCode) {
              resolve(errCode)
            },
            fail(errCode) {
              reject(errCode)
            }
          })
        })
      },
      async check() {
        let that = this
        try {
          let res = await that.wxChcekIsSupportFacialRecognition()
          console.log(res)
          let okMsg = 'checkIsSupportFacialRecognition:ok'
          if (res.errMsg === okMsg) {
            setTimeout(
              function () {
                that.goCheck()
              },
              1000)
          } else {
            wxAsync.showToast({
              title: '该设备暂不支持人脸识别',
              icon: 'none',
              duration: 3000,
              mask: true
            })
          }
        } catch (err) {
          console.log(err)
        }
      },
      goCheck() {
        let that = this
        wx.startFacialRecognitionVerify({
          name: that.idName,
          idCardNumber: that.idCard,
          checkAliveType: 2,
          success(res) {
            console.log('xxxxxxxxxxxx 人脸识别成功:')
            console.log(res)
            console.log(res.verifyResult)
            that.checkFace(res.verifyResult)
          },
          fail(res) {
            console.log('fail')
            console.log(res)
            console.log(res.errCode)
          }
        })
      },
      async checkFace(verifyResult) {
        // 验证人脸识别真实性
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/verifyFaceAgain',
            data: {
              name: that.idName,
              idCardNo: that.idCard,
              verifyResult: verifyResult
            }
          })
          console.log('success')
          console.log(res)
          that.saveBankCardInfoRequest()
        } catch (err) {
          RPC.toShow('识别错误！请稍后再试')
          console.log('fail')
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
              that.hospitalPrepayList()
            } else {
              that.hospitalPrepayListPayed()
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
            this.showTip(10)
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
      that.prepaymentFee = ''
      that.activeOpacity = 0.4
      if (that.loginType) {
        that.listHealthCardRequest()
      }
    },
    created() {
    },
    onLoad() {
      let that = this
      that.type = 1
      that.prepaymentFee = ''
      that.activeOpacity = 0.4
      that.refundName = ''
      that.bankAccount = ''
      that.idName = ''
      that.idCard = ''
      that.phoneNum = ''
      that.btnType = 1
      that.disabled = false
      if (!that.loginType) {
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
        height 570 * rpx
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
        text-align center
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
        .prepayment_box
          display inline-block
          .none
            color #9999
            margin-top 115%
            text-align center
          .content_box
            display inline-block
            .content_box1
              width 720 * rpx
              padding 26 * rpx 0 26 * rpx 0
              margin-bottom 16 * rpx
              display inline-block
              background rgba(255,255,255,1)
              box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
              border-radius 16 * rpx
              .content_row
                width 720 * rpx
                height 64 * rpx
                line-height 64 * rpx
                font-size 32 * rpx
                .left
                  display inline-block
                  color #707070
                  position absolute
                  left 48 * rpx
                .left_content
                  display inline-block
                  color #000000
                  position absolute
                  left 208 * rpx
                .right
                  color #707070
                  display inline-block
                  position absolute
                  left 352 * rpx
                .right_content
                  color #000000
                  display inline-block
                  position absolute
                  left 512 * rpx
            .content_box2
              width 720 * rpx
              height 96 * rpx
              line-height 96 * rpx
              background rgba(255,255,255,1)
              box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
              border-radius 16 * rpx
              font-size 32 * rpx
              color #707070
              text-align left
              .left
                width 200 * rpx
                display inline-block
                margin-left 32 * rpx
              .right
                width 430 * rpx
                display inline-block
                position absolute
                right 46 * rpx
                .feeInput
                  width 350 * rpx
                  display inline-block
                  text-align right
                  margin-bottom -14 * rpx
                  margin-right 20 * rpx
                .unit
                  right 16 * rpx
                  position absolute
                  display inline-block
                  color #000000
            .btn_box
              width 690 * rpx
              height 88 * rpx
              line-height 88 * rpx
              text-align center
              position absolute
              bottom 54 * rpx
              left 32 * rpx
              background #19C1DE
              box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
              opacity 0.4
              border-radius 44 * rpx
              font-size 36 * rpx
              color #FFFFFF
        .historyPayment_box
          display inline-block
          .none
            color #9999
            margin-top 115%
            text-align center
          .content_box
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            font-size 28 * rpx
            .content_row1
              width 720 * rpx
              height 96 * rpx
              line-height 96 * rpx
              display flex
              display -webkit-flex
              justify-content space-between
              .left
                display inline-block
                margin-left 32 * rpx
                .num
                  display inline-block
                  color #707070
                  margin-right 32 * rpx
                .num_content
                  display inline-block
                  color #000000
              .right
                display inline-block
                color #707070
                font-size 24 * rpx
                margin-right 32 * rpx
            .content_row2
              width 656 * rpx
              padding 16 * rpx 0
              border-top 2 * rpx solid rgba(229,229,229,1)
              display inline-block
              .row
                height 56 * rpx
                line-height 56 * rpx
                display flex
                display -webkit-flex
                justify-content space-between
                .left
                  display inline-block
                  .inHospital
                    display inline-block
                    color #707070
                    margin-right 32 * rpx
                  .inHospital_content
                    display inline-block
                    color #000000
                .right
                  display inline-block
                  color #000000
                  font-size 28 * rpx
        .refund_box
          display inline-block
          text-align center
          .refund_content
            display inline-block
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            opacity 1
            border-radius 16 * rpx
            .row_box
              display flex
              display -webkit-flex
              margin-left 32 * rpx
              width 656 * rpx
              height 96 * rpx
              line-height 96 * rpx
              font-size 32 * rpx
              border-bottom 2 * rpx solid rgba(229,229,229,1)
              .left
                display inline-block
              .right
                height 96 * rpx
                text-align left
                display inline-block
                position absolute
                left 208 * rpx
          .tips_box
            margin-top 32 * rpx
            font-size 28 * rpx
            color #B81C24
            display inline-block
            .row
              width 656 * rpx
              text-align left
              margin-bottom 12 * rpx
          .btn_box
            position absolute
            left 32 * rpx
            bottom 54 * rpx
            width 690 * rpx
            height 88 * rpx
            line-height 88 * rpx
            background #19C1DE
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
            opacity 1
            border-radius 44 * rpx
            font-size 36 * rpx
            color #FFFFFF
</style>
