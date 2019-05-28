<template lang="pug">
  form(@submit="navigateToPay", report-submit="true")
    .main
      .bg
      .pay-tip(v-show="activeDisplay") {{tipShow}}
      .payment_box
        .payment_detail
          .detail_item
            .left 挂号单号
            .right {{arr.RegisterNo}}
          .detail_item
            .left 就诊人
            .right {{name}}
          .detail_item
            .left 就诊医生
            .right {{arr.Doctor}}
          .detail_item
            .left 就诊科室
            .right {{arr.PatDep}}
          .detail_item
            .left 就诊时间
            .right {{arr.Date}}
          .detail_item(v-if="type === '2' || type === '1'")
            .left 应缴金额
            .right {{fee}}
          .detail_item(v-if="type === '3'")
            .left 已缴金额
            .right {{fee}}
          .pay_item
            .item_top 缴费项目
            .item_bottom(v-if="type === '2' || type === '1'" @tap="showItem(index)" v-for="(item, index) in detailList" :style="index==(detailList.length-1)?'border-bottom: 0':''")
              .text
                .text-left {{item.GroupName}}
                .text-right {{item.ActualMoney}} 元
                img.arrow(v-if="item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png'")
              .bottom(v-for="(item1, index1) in item.objList" v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName))")
                .item_row
                  .item_name {{item1.ItemName}}
                  .item_num x {{item1.Num}} {{item1.Unit}}
                  .item_money ￥{{item1.ActualMoney}}
            .item_bottom(v-if="type === '3'" @tap="showItem(index)" v-for="(item, index) in detailList" :style="index==(detailList.length-1)?'border-bottom: 0':''")
              .text
                .text-left {{item.GroupName}}
                .text-right {{item.ActualMoney}} 元
                img.arrow(v-if="item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png'")
              .bottom(v-for="(item1, index1) in item.objList" v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName))")
                .item_row
                  .item_name {{item1.ItemName}}
                  .item_num x {{item1.Num}} {{item1.Unit}}
                  .item_money ￥{{item1.ActualMoney}}
        <!--button.pay(formType= "submit") 立即支付-->
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        name: '',
        patientId: '',
        fee: 0.00,
        arr: [],
        detailList1: [],
        detailList: [],
        wxCallbackUrl: '',
        orderNo: '',
        showNum: -1,
        type: ''
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
        console.log(event)
        this.saveFormId(event.mp.detail.formId)
        wxAsync.navigateTo({
          url: '../pay-list-info/main?itemName=' + JSON.stringify(this.detailList1) + '&name=' + this.name + '&patientId=' + this.patientId + '&fee=' + this.fee
        })
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
      },
      getData1(list) {
        let b = []
        for (let i = 0; i < list.length; i++) {
          let data2 = list[i].FeeList
          for (let n = 0; n < data2.length; n++) {
            let flag2 = false
            for (let p = 0; p < b.length; p++) {
              if (b[p].GroupID === data2[n].GroupID && b[p].GroupName === data2[n].GroupName) {
                flag2 = true
                b[p].ActualMoney = RPC.toDecimal2(Number(b[p].ActualMoney) + Number(data2[n].ActualMoney))
                if (b[p].objList === undefined) {
                  b[p].objList = []
                  b[p].objList.push(data2[n])
                } else {
                  b[p].objList.push(data2[n])
                }
              }
            }
            if (!flag2) {
              let b1 = {}
              b1.GroupName = data2[n].GroupName
              b1.GroupID = data2[n].GroupID
              b1.ActualMoney = data2[n].ActualMoney
              if (b1.objList === undefined) {
                b1.objList = []
                b1.objList.push(data2[n])
              } else {
                b1.objList.push(data2[n])
              }
              b.push(b1)
            }
          }
        }
        this.detailList = b
        console.log(this.detailList)
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      console.log(event)
      this.showNum = -1
      this.detailList = []
      this.detailList1 = []
      this.fee = RPC.toDecimal2(0.00)
      this.name = event.name
      this.patientId = event.patientId
      let listObj = {}
      listObj = JSON.parse(event.item)
      this.arr = listObj.list
      console.log(this.arr)
      this.fee = RPC.toDecimal2(this.arr.fee)
      this.detailList1.push(listObj.list.Items)
      let list = listObj.list.Items
      console.log(list)
      this.type = event.type
      if (this.type === '2' || this.type === '1') {
        this.getData(list)
      } else {
        this.getData1(list)
        wx.setNavigationBarTitle({
          title: '已缴费详情'
        })
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
    background #F0EFF5
    form
      .main
        width 750 * rpx
        height 100%
        overflow hidden
        text-align center
        background #F0EFF5
        .bg
          height 320 * rpx
          background linear-gradient(#19C1DE,#F0EFF5)
          padding-bottom 16 * rpx
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
        .payment_box
          position absolute
          left 16 * rpx
          top 16 * rpx
          padding-bottom 38 * rpx
          .payment_detail
            width 720 * rpx
            display inline-block
            background rgba(255,255,255,1)
            padding-bottom 16 * rpx
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .detail_item
              width 656 * rpx
              height 96 * rpx
              margin-left 32 * rpx
              line-height 96 * rpx
              border-bottom 2 * rpx solid rgba(229,229,229,1)
              display flex
              display -webkit-flex
              justify-content space-between
              font-size 32 * rpx
              .left
                display inline-block
                color #707070
              .right
                display inline-block
            .pay_item
              width 656 * rpx
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
          .pay
            width 690 * rpx
            height 88 * rpx
            color #FFFFFF
            margin-top 216 * rpx
            margin-bottom 54 * rpx
            display inline-block
            background linear-gradient(90deg,rgba(25,193,222,1) 0%,rgba(25,193,222,1) 100%)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
            border-radius 44 * rpx
</style>
