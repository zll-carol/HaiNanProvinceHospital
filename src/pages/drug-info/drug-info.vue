<template lang="pug">
  .main
    .bg
      .fee
        .fee-list
          .fee-item(style="bottom 16 * rpx")
            .item_row
              .item_left 处方单号
              .item_right {{data.prescriptionNo}}
            .item_row
              .item_left 临床诊断
              .item_right {{data.diagnosis}}
          .display_show(style="padding-bottom:0")
            .show_item
              .show_name
                .title(style="width: 182px") 药品
                .title 单量
                .title 规格
                .title(style="width:50px") 用量
            .show_box(v-for="(item,index) in dispatchList")
              .show_dug
                .dug_des(style="width: 182px") {{item.drugName}}
                .dug_des {{item.drugPerunit}}
                .dug_des {{item.drugSpec}}
                .dug_des(style="width:50px") {{item.drugTotal}}
              .dug_methods
                .left_methods 用法用量：
                .right_methods {{item.drugDosage}}, {{item.drugFrequency}}
          .fee-item-bom
            .item_row-bom
              .item_left-bom 就诊医生
              .item_right-bom {{data.doctorName}}
            .item_row-bom
              .item_left-bom 开单时间
              .item_right-bom {{data.billTime}}
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        dispatchList: [],
        data: {},
        numTime: 1
      }
    },

    computed: {},

    components: {},
    methods: {
      open() {
        if (this.numTime === 1) {
          this.numTime = 2
        } else {
          this.numTime = 1
        }
      },
      submit() {
        wxAsync.navigateTo({
          url: '../pay-detail/main'
        })
      },
      async drugDispatchDetail() {
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/detail',
            data: {
              // patientId: '9044708',
              patientId: that.patientId,
              prescriptionNo: that.data.prescriptionNo
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          this.dispatchList = res.data.dispatchList
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      }
    },
    onShow() {
    },
    created() {
    },
    onLoad(event) {
      this.data = []
      this.dispatchList = []
      this.data = JSON.parse(event.data)
      this.patientId = event.patientId
      console.log(this.data)
      this.drugDispatchDetail()
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
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        .fee
          text-align center
          padding-bottom 32 * rpx
          .fee-list
            display inline-block
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow:0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .fee-item_fee
              display inline-block
              padding-bottom 40 * rpx
              .title_tag
                width 656 * rpx
                text-align left
                margin-top 40 * rpx
                .tag_left
                  color #19C1DE
                  display inline-block
                  margin-left 100 * rpx
                  margin-right 200 * rpx
                  .des
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_left
                  color #000000
                .tag_right
                  color #19C1DE
                  display inline-block
                  .menu
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_right
                  color #000000
              .tagLeft_content
                .total_fee
                  margin-top 22 * rpx
                  text-align left
                  height 96 * rpx
                  line-height 96 * rpx
                  background #EFFDFF
                  font-size 32 * rpx
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .left
                    color #005DFF
                    margin-left 32 * rpx
                  .right
                    margin-right 32 * rpx
                    color #005DFF
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
                      width 165 * rpx
                      margin-left 145 * rpx
                      text-align right
                      word-wrap break-word
                      word-break break-all
              .tagRight_content
                display inline-block
                width 720 * rpx
                .total_fee
                  width 720 * rpx
                  margin-top 22 * rpx
                  text-align left
                  height 96 * rpx
                  line-height 96 * rpx
                  background #EFFDFF
                  font-size 32 * rpx
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .left
                    color #005DFF
                    margin-left 32 * rpx
                  .right
                    margin-right 80 * rpx
                    color #005DFF
                    display inline-block
                .fee-menu
                  .menu-item
                    font-size 32 * rpx
                    height 80 * rpx
                    line-height 80 * rpx
                    white-space nowrap
                    display flex
                    display -webkit-flex
                    justify-content space-between
                    .left
                      text-align left
                      width 400 * rpx
                      overflow  hidden
                      text-overflow  ellipsis
                      color #707070
                      display inline-block
                      margin-left 32 * rpx
                    .right
                      color #000000
                      display inline-block
                      margin-right 80 * rpx
                    .arrow
                      width 20 * rpx
                      height 20 * rpx
                      position absolute
                      right 52 * rpx
                      margin-top 30 * rpx
                  .display_show_fee
                    width 656 * rpx
                    padding-top 16 * rpx
                    display inline-block
                    text-align center
                    border-bottom 2 * rpx solid rgba(229,229,229,1)
                    border-top 2 * rpx solid rgba(229,229,229,1)
                    color #707070
                    font-size 28 * rpx
                    .list_fee
                      width 656 * rpx
                      margin-bottom 18 * rpx
                      text-align left
                      position relative
                      font-size 28 * rpx
                      .left
                        display inline-block
                        width 455 * rpx
                        padding-left 32 * rpx
                      .right
                        display inline-block
                        position absolute
                        right 48 * rpx
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
              border-top 2 * rpx solid rgba(159,218,229,1)
              border-bottom 2 * rpx solid rgba(159,218,229,1)
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
                border-top 2 * rpx solid rgba(159,218,229,1)
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
