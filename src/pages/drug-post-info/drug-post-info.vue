<template lang="pug">
  .main
    .bg
    .msgBox
      .box-address(v-if="num==1")(@tap="c")
        .address-text 请选择收货地址
        .jump-info
      .box-address(v-if="num==2")(@tap="c")
        .name-text
          .name {{address.userName}} {{address.telNumber}}
          .address {{address.provinceName}} {{address.cityName}} {{address.countyName}} {{address.detailInfo}}
        .jump-info
      .box-tips
        .text
          .text-1(style="margin-bottom:8px;font-weight:800") 温馨提示：配送范围为海南省内，预计当日或次日送达。
      .box-postType(style="display: none")
        .post-choose
          .post-type
            .item-1 配送类型
            .item-2(@tap="gou(1)")
              img(mode="widthFix", :src="chooseNum==1?'https://nontax-cdn.yuluoo.com/hospital-post-gou.png':''")
            .item-3 普通
            .item-2(@tap="gou(2)")
              img(mode="widthFix", :src="chooseNum==2?'https://nontax-cdn.yuluoo.com/hospital-post-gou.png':''")
            .item-5 加急
          .post-info 海口同城配送 4 小时到达，省内其余市县次日到达
      .content_box
        .box-drugInfo(@tap="gotoInfo(item)", v-for="item in chooseList")
          .box
            .drug 药品信息
          .box-1
            .item-2
              .item-box-1
                .item-text-1 处方单号
                .item-text-1 就诊医生
              .item-box-2
                .item-text-2(style="color:#005dff") {{item.prescriptionNo}}
                .item-text-2 {{item.doctorName}}({{item.deptName}})
            .item-3
              .item-3-txt {{item.drugType}}
      .pay-btn
        .text 运费：
        .money ￥15
        .text-btn(@tap="submitPay")
          .text-3 提交
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        address: {userName: '', telNumber: '', provinceName: '', cityName: '', countyName: '', detailInfo: '', nationalCode: '', postalCode: ''},
        num: 1,
        chooseNum: 1,
        chooseList: [],
        patientId: '',
        deliveryNum: '',
        nonDeliveryNum: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      gotoInfo(item) {
        wx.navigateTo({
          url: '../drug-info/main?data=' + JSON.stringify(item) + '&patientId=' + this.patientId
        })
      },
      gou(e) {
        if (this.chooseNum !== e) {
          this.chooseNum = e
        }
      },
      c() {
        let that = this
        wx.chooseAddress({
          success(res) {
            that.num = 2
            that.address = res
            console.log(res.userName)
            console.log(res.postalCode)
            console.log(res.provinceName)
            console.log(res.cityName)
            console.log(res.countyName)
            console.log(res.detailInfo)
            console.log(res.nationalCode)
            console.log(res.telNumber)
            if (that.address.provinceName !== '海南省') {
              RPC.toShow('配送范围仅为海南省内')
              that.address = ''
            }
          }
        })
      },
      submitPay(event) {
        let that = this
        that.saveFormId(event.mp.detail.formId)
        if (that.address.telNumber) {
          wx.showModal({
            title: '提示',
            content: '您有' + that.deliveryNum + '张处方，' + (that.deliveryNum - that.nonDeliveryNum) + '张不符合配送，\n是否确定配送？',
            confirmColor: '#19C1DE',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.submitDispatch()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          RPC.toShow('请选择地址')
        }
      },
      async submitDispatch() {
        let that = this
        let prescriptions = []
        for (let i = 0; i < that.chooseList.length; i++) {
          prescriptions.push(that.chooseList[i])
        }
        console.log(prescriptions)
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/submitDispatch',
            data: {
              prescriptions: JSON.stringify(prescriptions),
              province: that.address.provinceName,
              city: that.address.cityName,
              county: that.address.countyName,
              address: that.address.detailInfo,
              amount: 1,
              receiver: that.address.userName,
              receivePhone: that.address.telNumber,
              // patientId: '9044708',
              patientId: that.patientId,
              sendType: 0
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          // if (res.errcode === 0) {
          //   wx.navigateTo({
          //     url: '../drug-submitSuccess/main'
          //   })
          // }
          RPC.pay(res.data.wxCallbackUrl, 18, res.data.orderNo, 4, that.patientId)
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
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
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad(event) {
      this.num = 1
      this.address = {userName: '', telNumber: '', provinceName: '', cityName: '', countyName: '', detailInfo: '', nationalCode: '', postalCode: ''}
      this.chooseList = JSON.parse(event.chooseList)
      this.patientId = event.patientId
      this.deliveryNum = event.deliveryNum
      this.nonDeliveryNum = event.nonDeliveryNum
      console.log(this.chooseList)
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
      .bg
        height 500 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .msgBox
        position absolute
        top 16 * rpx
        padding-bottom 70 * rpx
        .box-address
          margin-top 16 * rpx
          width 720 * rpx
          height 224 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          display flex
          align-items center
          .address-text
            font-size 16px
            color #707070
            margin-left 32 * rpx
          .name-text
            width auto
            height auto
            margin-left 32 * rpx
            .name
              font-size 18px
              font-weight bold
            .address
              width 624 * rpx
              margin-top 22 * rpx
              font-size 14px
              color #707070
          .jump-info
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
        .box-tips
          margin-top 16 * rpx
          width 720 * rpx
          background-color #fff
          border-radius 8 * rpx
          margin-left 16 * rpx
          .text
            margin-left 32 * rpx
            display inline-block
            padding-top 16 * rpx
            .text-1
              width 720 * rpx
              line-height 1.5
              font-size 24 * rpx
              color #FF4D4D
        .box-postType
          width 720 * rpx
          height 160 * rpx
          background #fff
          border-radius 8px
          margin-top 16 * rpx
          margin-left 16 * rpx
          display flex
          align-items center
          .post-choose
            width auto
            .post-type
              display flex
              align-items center
              margin-left 32 * rpx
              .item-1
                display inline-block
                font-size 16px
                color #707070
              .item-2
                border 2 * rpx solid #E5E5E5
                margin-left 64 * rpx
                width 32 * rpx
                height 32 * rpx
                display inline-block
                line-height 32 * rpx
                img
                  width 100%
                  height 100%
              .item-3
                display inline-block
                font-size 16px
                margin-left 16 * rpx
              .item-5
                display inline-block
                font-size 16px
                margin-left 16 * rpx
            .post-info
              margin-top 20 * rpx
              font-size 12px
              color #B81C24
              margin-left 32 * rpx
        .content_box
          padding-bottom 200 * rpx
          .box-drugInfo
            width 720 * rpx
            height auto
            background #fff
            border-radius 8px
            margin-left 16 * rpx
            margin-top 16 * rpx
            .box
              margin-left 32 * rpx
              width 648 * rpx
              height 100 * rpx
              background #fff
              .drug
                line-height 100 * rpx
                font-size 20px
                font-weight bold
            .box-1
              margin-left 32 * rpx
              width 648 * rpx
              height 160 * rpx
              background #fff
              display flex
              .item-2
                display inline-block
                width auto
                height auto
                margin-top 8 * rpx
                .item-box-1
                  display inline-block
                  .item-text-1
                    margin-top 16 * rpx
                    font-size 32 * rpx
                    color #707070
                .item-box-2
                  display inline-block
                  margin-left 64 * rpx
                  .item-text-2
                    margin-top 16 * rpx
                    font-size 32 * rpx
              .item-3
                display inline-block
                position absolute
                width 124 * rpx
                height 48 * rpx
                right 52 * rpx
                border 2 * rpx solid #707070
                margin-top 16 * rpx
                border-radius 16 * rpx
                text-align center
                .item-3-txt
                  line-height 48 * rpx
                  color #707070
                  font-size 28 * rpx
        .pay-btn
          width 100%
          height 112 * rpx
          background-color #fff
          line-height 112 * rpx
          bottom 0 * rpx
          position fixed
          .text
            margin-left 32 * rpx
            font-size 14px
            color #707070
            display inline-block
          .money
            font-size 22px
            color #19C1DE
            display inline-block
          .text-btn
            float right
            display inline-block
            margin-top 16 * rpx
            margin-right 32 * rpx
            width 160 * rpx
            height 80 * rpx
            border-radius 8px
            background-color #19C1DE
            .text-3
              margin-left 44 * rpx
              color white
              line-height 80 * rpx
              font-size 16px
</style>
