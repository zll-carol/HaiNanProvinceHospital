<template lang="pug">
  form(@submit="navigateToPay", report-submit="true")
    .main
      .bg
      .pay-tip(v-show="activeDisplay") {{tipShow}}
      .pay-info
        .box
          .box-relation
            .name(style="color:black") 就诊人
            .value(style="font-weight:bold") {{name}}
          .totalFee_box
            .left 总费用
            .right {{fee}} 元
          .details_type_box(@tap="showItem(index)", v-for="(item, index) in detailList",:style="index===detailList.length -1 ? 'padding-bottom:8rpx' : ''")
            .type_box
              .typeName {{item.GroupName}}
              .right_box
                .fee {{item.ActualMoney}} 元
                img.arrow(v-if="item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_icon_upArrow.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_icon_downArrow.png'")
            .des_box
              .row_box(v-for="(item1, index1) in item.objList", :style="index1=== item.objList.length - 1 ? 'padding-bottom:20rpx' : ''", v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName))")
                .name {{item1.ItemName}}
                .time {{item1.Num}} {{item1.Unit}}
                .money {{item1.ActualMoney}} 元
                .type {{item1.ReimburseType}}
        .reduceFee_box
          .row_title
            .title_left 报销金额
            .title_right_box
              .title_fee 190.00 元
              img.title_arrow(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_upArrow1.png")
          .row_content
            .row
              .content_left 农合补偿
              .content_right 140.00 元
            .row
              .content_left 民政补偿
              .content_right 140.00 元
            .row
              .content_left 医院负担
              .content_right 140.00 元
            .row
              .content_left 大病补偿
              .content_right 140.00 元
            .row
              .content_left 商业补偿
              .content_right 140.00 元
            .row
              .content 兜底补偿
              .content 140.00 元
          <!--.pay_item-->
            <!--.item_top 缴费项目-->
            <!--&lt;!&ndash;.item_bottom(@tap="showItem(index)" v-for="(item, index) in detailList" :style="index==(detailList.length-1)?'border-bottom: 0':''")&ndash;&gt;-->
            <!--.item_bottom(@tap="showItem(index)" v-for="(item, index) in detailList")-->
              <!--.text-->
                <!--.text-left {{item.GroupName}}-->
                <!--.text-right {{item.ActualMoney}} 元-->
                <!--img.arrow(v-if="item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png'")-->
              <!--.bottom(v-for="(item1, index1) in item.objList" v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName))")-->
                <!--.item_row-->
                  <!--.item_name {{item1.ItemName}}-->
                  <!--.item_num x {{item1.Num}} {{item1.Unit}}-->
                  <!--.item_money ￥{{item1.ActualMoney}}-->
        .box1
          .left 应缴费用
          .right ￥{{fee}}
        button.pay(formType= "submit" :style="clickType==false?'opacity: 0.2':''") 确认支付
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        clickType: true,
        activeDisplay: false,
        tipShow: '',
        name: '',
        patientId: '',
        fee: 0.00,
        detailList: [],
        detailList1: [],
        arr: [],
        wxCallbackUrl: '',
        orderNo: '',
        showNum: -1,
        RegisterNo: '',
        InsureType: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      showItem(index) {
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
      navigateToPay(event) {
        console.log(this.clickType + '11111111111111111111111111')
        if (this.clickType) {
          this.clickType = false
          setTimeout(
            this.setClick,
            120000
          )
          console.log(event)
          this.saveFormId(event.mp.detail.formId)
          let gopay = true
          this.selfServicePayRequest(gopay)
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
      async selfServicePayRequest(gopay) {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/selfServicePay',
            data: {
              InsureType: that.InsureType,
              RegisterNo: that.RegisterNo,
              Items: that.detailList1,
              totalAmt: that.fee,
              PatientId: that.patientId
            }
          })
          console.log('success')
          console.log(res)
          that.wxCallbackUrl = res.notify_url
          that.orderNo = res.orderNo
          console.log(that.orderNo)
          if (gopay && that.wxCallbackUrl && that.orderNo) {
            RPC.JHpay(that.wxCallbackUrl, that.fee, that.orderNo, 2, that.patientId)
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
      getData(list) {
        for (let i = 0; i < list.length; i++) {
          let flag = false
          for (let m = 0; m < this.detailList.length; m++) {
            if (this.detailList[m].GroupID === list[i].GroupID && this.detailList[m].GroupName === list[i].GroupName) {
              flag = true
              this.detailList[m].ActualMoney = RPC.toDecimal2(Number(this.detailList[m].ActualMoney) + Number(list[i].ActualMoney))
              if (this.detailList[m].objList === undefined) {
                this.detailList[m].objList = []
                this.detailList[m].objList.push(list[i])
              } else {
                this.detailList[m].objList.push(list[i])
              }
            }
          }
          if (!flag) {
            let a = {}
            a.GroupName = list[i].GroupName
            a.GroupID = list[i].GroupID
            a.ActualMoney = list[i].ActualMoney
            // console.log(a.GroupName)
            if (a.objList === undefined) {
              a.objList = []
              a.objList.push(list[i])
            } else {
              a.objList.push(list[i])
            }
            this.detailList.push(a)
          }
        }
        console.log(this.detailList)
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      console.log(event)
      this.clickType = true
      this.detailList = []
      this.detailList1 = []
      this.showNum = -1
      this.fee = 0
      this.name = event.name
      this.patientId = event.patientId
      let listObj = {}
      listObj = JSON.parse(event.item)
      this.arr = listObj.list
      this.RegisterNo = event.RegisterNo
      this.InsureType = event.InsureType
      this.fee = RPC.toDecimal2(event.fee)
      console.log('xxxxx this.arr:')
      console.log(this.arr)
      let list = listObj.list.Items
      for (let i = 0; i < list.length; i++) {
        this.detailList1.push(list[i])
      }
      this.getData(list)
      // this.arr = JSON.parse(event.itemName)
      // this.detailList = this.arr
      // for (let i = 0; i < this.arr.length; i++) {
      //   this.detailList1.push(this.arr[i])
      // }
      // for (let i = 0; i < this.arr.length; i++) {
      //   for (let f = 0; f < this.arr[i].length; f++) {
      //     this.detailList1.push(this.arr[i][f])
      //   }
      // }
      // for (let i = 0; i < this.arr.length; i++) {
      //   for (let f = 0; f < this.arr[i].length; f++) {
      //     let flag = false
      //     for (let m = 0; m < this.detailList.length; m++) {
      //       if (this.detailList[m].GroupID === this.arr[i][f].GroupID && this.detailList[m].GroupName === this.arr[i][f].GroupName) {
      //         flag = true
      //         this.detailList[m].ActualMoney = RPC.toDecimal2(Number(this.detailList[m].ActualMoney) + Number(this.arr[i][f].ActualMoney))
      //         if (this.detailList[m].objList === undefined) {
      //           this.detailList[m].objList = []
      //           this.detailList[m].objList.push(this.arr[i][f])
      //         } else {
      //           this.detailList[m].objList.push(this.arr[i][f])
      //         }
      //       }
      //     }
      //     if (!flag) {
      //       let a = {}
      //       a.GroupName = this.arr[i][f].GroupName
      //       a.GroupID = this.arr[i][f].GroupID
      //       a.ActualMoney = this.arr[i][f].ActualMoney
      //       if (a.objList === undefined) {
      //         a.objList = []
      //         a.objList.push(this.arr[i][f])
      //       } else {
      //         a.objList.push(this.arr[i][f])
      //       }
      //       this.detailList.push(a)
      //     }
      //   }
      // }
      console.log('aaaaaaaaaaaaaa')
      console.log(this.fee)
      console.log(this.detailList)
      console.log(this.detailList1)
      this.selfServicePayRequest()
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
      .pay-info
        position absolute
        top 16 * rpx
        .box1
          width 720 * rpx
          height 96 * rpx
          line-height 96 * rpx
          background #fff
          border-radius 16 * rpx
          margin-left 16 * rpx
          .left
            font-size 32 * rpx
            display inline-block
            position absolute
            left 46 * rpx
          .right
            font-size 32 * rpx
            font-weight bold
            color #FF0000
            display inline-block
            position absolute
            right 65 * rpx
        .box
          width 720 * rpx
          height auto
          margin-bottom 16 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          .box-relation
            margin-left 36 * rpx
            width 648 * rpx
            height 112 * rpx
            line-height 112 * rpx
            background #fff
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            position relative
            display flex
            .name
              width 128 * rpx
              display inline-block
              color #707070
              font-size 16px
            .value
              width 520 * rpx
              display inline-block
              font-size 16px
              line-height 96 * rpx
              text-align right
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
          .totalFee_box
            width 720 * rpx
            height 112 * rpx
            line-height 112 * rpx
            display flex
            display -webkit-flex
            justify-content space-between
            background #17A5BD
            font-size 32 * rpx
            color #FFFFFF
            .left
              margin-left 32 * rpx
            .right
              margin-right 32 * rpx
          .details_type_box
            width 720 * rpx
            background #E1FBFF
            border-bottom-left-radius 16 * rpx
            border-bottom-right-radius 16 * rpx
            .type_box
              width 656 * rpx
              height 80 * rpx
              line-height 80 * rpx
              margin-left 32 * rpx
              display flex
              display -webkit-flex
              justify-content space-between
              color #19C1DE
              font-size 32 * rpx
              .typeName
                display inline-block
              .right_box
                display flex
                display -webkit-flex
                justify-content space-between
                width 200 * rpx
                .fee
                  margin-right 22 * rpx
                .arrow
                  width 20 * rpx
                  height 20 * rpx
                  margin-top 30 * rpx
            .des_box
              width 720 * rpx
              background #FFFFFF
              .row_box
                width 656 * rpx
                padding-top 12 * rpx
                padding-bottom 12 * rpx
                line-height 1.5
                margin-left 32 * rpx
                display flex
                display -webkit-flex
                justify-content space-between
                color #707070
                font-size 28 * rpx
                .name
                  width 224 * rpx
                .time
                  width 80 * rpx
                .money
                  width 128 * rpx
                .type
                  width 56 * rpx
              .row_box1
                padding-bottom 20 * rpx
          .activePadding
            padding-bottom 8 * rpx
        .reduceFee_box
          width 720 * rpx
          height auto
          padding-bottom 16 * rpx
          margin-bottom 16 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          .row_title
            width 656 * rpx
            height 96 * rpx
            line-height 96 * rpx
            margin-left 32 * rpx
            display flex
            display -webkit-flex
            justify-content space-between
            color #000000
            font-size 32 * rpx
            .title_left
              display inline-block
            .title_right_box
              display flex
              display -webkit-flex
              justify-content space-between
              .title_fee
                margin-right 22 * rpx
              .title_arrow
                width 20 * rpx
                height 20 * rpx
                margin-top 38 * rpx
          .row_content
            width 720 * rpx
            .row
              width 656 * rpx
              height 64 * rpx
              line-height 64 * rpx
              display flex
              display -webkit-flex
              justify-content space-between
              margin-left 32 * rpx
              color #707070
              font-size 28 * rpx
              .content
                display inline-block
            .click-btn-1
              position absolute
              margin-left 646 * rpx
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
                -webkit-transform matrix(0.71, -0.71, 0.71, 0.71, 0, 0)
                transform matrix(0.71, -0.71, 0.71, 0.71, 0, 0)
                position relative
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
            .click-btn-2
              position absolute
              margin-left 646 * rpx
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
                -webkit-transform matrix(0.71, 0.71, 0.71, -0.71, 0, 0)
                transform matrix(0.71, 0.71, 0.71, -0.71, 0, 0)
                position relative
                top -2px
                position absolute
                top 50%
                margin-top -6 * rpx
                right 2px
          .pay_item
            width 648 * rpx
            margin-left 32 * rpx
            .item_top
              color #707070
              font-size 32 * rpx
              text-align left
              height 96 * rpx
              line-height 96 * rpx
              border-bottom 2 * rpx solid rgba(229,229,229,1)
            .item_bottom
              margin-top 16 * rpx
              width 656 * rpx
              font-size 28 * rpx
              color #707070
              .text
                width 656 * rpx
                height 80 * rpx
                display flex
                .text-left
                  text-align left
                  line-height 80 * rpx
                  display inline-block
                  margin-left 32 * rpx
                  font-size 30 * rpx
                  width 400 * rpx
                  overflow  hidden
                  text-overflow  ellipsis
                  color #707070
                .text-right
                  line-height 80 * rpx
                  display inline-block
                  color #707070
                  position absolute
                  right 90 * rpx
                .arrow
                  text-align center
                  width 20 * rpx
                  height 20 * rpx
                  position absolute
                  right 52 * rpx
                  margin-top 30 * rpx
              .bottom
                margin-left 16 * rpx
                .item_row
                  height 64 * rpx
                  line-height 64 * rpx
                  display flex
                  display -webkit-flex
                  .item_name
                    display inline-block
                    margin-left 32 * rpx
                    width 385 * rpx
                    font-size 26 * rpx
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    text-align left
                  .item_num
                    display inline-block
                    margin-left 12 * rpx
                    font-size 26 * rpx
                    color #707070
                  .item_money
                    font-size 26 * rpx
                    display inline-block
                    position absolute
                    right 72 * rpx
          .box-info
            width 656 * rpx
            border-radius 16 * rpx
            margin-left 32 * rpx
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            .name-1
              margin-top 16 * rpx
              margin-left 30 * rpx
              font-size 30 * rpx
            .box_detail
              display flex
              display -webkit-flex
              .name
                display inline-block
                width 370 * rpx
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
                margin-left 30 * rpx
                line-height 64 * rpx
                color #707070
                font-size 28 * rpx
              .num
                margin-top 16 * rpx
                margin-left 10 * rpx
                display inline-block
                font-size 28 * rpx
                color #707070
              .value
                display inline-block
                color #707070
                position absolute
                right 72 * rpx
                font-size 28 * rpx
                line-height 64 * rpx
        .btn-class
          position absolute
          width 100%
          bottom 54 * rpx
          button
            width 690 * rpx
            height 88 * rpx
            border-radius 88 * rpx
            background #0077FF
            line-height:88rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.1)
            .btm
              color white
        .pay
          width 690 * rpx
          height 88 * rpx
          margin-top 42 * rpx
          position absolute
          left 32 * rpx
          margin-bottom 54 * rpx
          display inline-block
          line-height 88 * rpx
          color #FFFFFF
          background #19C1DE
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.05)
          border-radius 44px
</style>
