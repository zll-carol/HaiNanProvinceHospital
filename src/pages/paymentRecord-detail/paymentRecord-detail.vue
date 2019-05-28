<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .payRecord(v-show=" activeDisplay1")
      .content
        .content-list
          .item
            .left 缴费单号
            .right {{list.billNo}}
          .item
            .left 缴费时间
            .right {{list.Date}}
          .item
            .left 就诊人
            .right {{list.patientName}}
          .item
            .left 应缴金额
            .right ￥{{list.fee}}
        .content-list
          .payment_item(style="border:none")
            .item_top 缴费项目
            .item_bottom(@tap="showItem(index)" v-for="(item, index) in detailList" :style="index==(detailList.length-1)?'border-bottom: 0':''")
              .text
                .text-left {{item.groupName}}
                .text-right {{item.actualMoney}} 元
                img.arrow(v-if="item.objList.length>1||(item.objList.length==1&&item.groupName!=item.objList[0].itemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png'")
              .bottom(v-for="(item1, index1) in item.objList" v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.groupName!=item.objList[0].itemName))")
                .item_row
                  .item_name {{item1.itemName}}
                  .item_num x {{item1.num}} {{item1.unit}}
                  .item_money ￥{{item1.actualMoney}}
</template>
<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        open: true,
        open1: false,
        open2: false,
        open3: false,
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: true,
        name: '',
        detailList: [],
        list: [],
        showNum: -1
      }
    },
    computed: {},
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
      showPage() {
        this.activeDisplay1 = true
      }
    },
    created() {
    },
    onLoad(event) {
      console.log(event)
      this.list = JSON.parse(event.item)
      this.detailList = []
      this.name = event.name
      let list = this.list.Items
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        // console.log(i)
        let flag = false
        for (let m = 0; m < this.detailList.length; m++) {
          if (this.detailList[m].groupId === list[i].groupId && this.detailList[m].groupName === list[i].groupName) {
            flag = true
            this.detailList[m].actualMoney = RPC.toDecimal2(Number(this.detailList[m].actualMoney) + Number(list[i].actualMoney))
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
          a.groupName = list[i].groupName
          a.groupId = list[i].groupId
          a.actualMoney = list[i].actualMoney
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
      // this.showPage()
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
      height 100%
      overflow hidden
      text-align center
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
        padding-bottom 16 * rpx
      .payRecord
        position absolute
        top 0
        left 16 * rpx
        padding-bottom 82 * rpx
        .content
          width 720  * rpx
          margin-bottom 16  * rpx
          display inline-block
          background rgba(255, 255, 255, 1)
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.05)
          opacity 1
          border-radius 16px
          .content-list
            .item
              display inline-block
              text-align left
              width 656  * rpx
              height 96  * rpx
              line-height 96  * rpx
              border-bottom 2  * rpx solid rgba(229, 229, 229, 1)
              font-size 32  * rpx
              .left
                color #707070
                display inline-block
              .left1
                display inline-block
                font-size 24 * rpx
                color #707070
              .right
                float right
                display inline-block
          .content-list
            .payment_item
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
          .pay_item
            width 656 * rpx
            position relative
            display inline-block
            margin-left 32 * rpx
            height 64 * rpx
            line-height 64 * rpx
            font-size 28 * rpx
            color #707070
            .left
              display inline-block
              margin-right 392 * rpx
              position absolute
              left 0
            .right
              display inline-block
              margin-right 22 * rpx
              position absolute
              right 32 * rpx
            .arrow
              width 20 * rpx
              height 20 * rpx
              position absolute
              right 12 * rpx
              top 35%
          .display_show
            width 624 * rpx
            display inline-block
            border-radius 16 * rpx
            text-align center
            background #F9F9F9
            color #000000
            font-size 24 * rpx
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
          .item_tips
            padding-top 22  * rpx
            margin-bottom 32  * rpx
            display inline-block
            text-align left
            width 656  * rpx
            font-size 24  * rpx
            color #007FFF
            .left
              display inline-block
              margin-top 14  * rpx
            .right
              display inline-block
              margin-left 8 * rpx
</style>

