<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
      .box(@tap="cardInfo")(v-for="item in list")
        .card-text
          .name-rav
            .name {{item.name}}
          .num 门诊号 &nbsp;&nbsp;&nbsp;&nbsp;{{item.outpatientNo}}
          .num 状&nbsp;&nbsp;&nbsp;态 &nbsp;&nbsp;&nbsp;&nbsp;{{item.status==0?'未绑定':'已绑定'}}
        .card-btn(v-if='item.status==0')(@tap="card(item)")
          .btn-bom 立即绑定
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        list: [],
        login: false,
        name: '',
        userCenter: '个人中心',
        bindType: '',
        hasIdCard: '',
        phone: '',
        verifyCode: '',
        type: ''// 1为本人新建，2为帮别人新建
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
      card(item) {
        let self = this
        // 有档案，未绑定情况
        wx.navigateTo({
          url: '../card-info-final/main?key=2&cardNo=' + item.idCardNo + '&name=' + item.name + '&phone=' + item.phone + '&bindType=' + self.bindType + '&hasIdCard=' + self.hasIdCard + '&verifyCode=' + self.verifyCode + '&address=' + item.address + '&outpatientNo=' + item.outpatientNo + '&patientId=' + item.patientId + '&type=' + self.type
        })
      },
      async loadData(cardNo) {
        let self = this
        self.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listArchives',
            data: {
              cardNo: cardNo,
              cardType: '1',
              patientId: ''
            }
          })
          console.log('success')
          console.log(res)
          self.list = res.data.archivesList
        } catch (err) {
          console.log('fail')
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
      }
    },
    onLoad(event) {
      this.bindType = event.bindType
      this.hasIdCard = event.hasIdCard
      this.phone = event.phone
      this.verifyCode = event.verifyCode
      this.type = event.type
      this.loadData(event.cardNo)
    },
    created() {
      // wx.clearStorage()
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
      width 750 * rpx
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
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-top 16 * rpx
        .box
          margin-top 16 * rpx
          padding-bottom 14 * rpx
          width 688 * rpx
          height 208 * rpx
          background #fff
          border-radius 8px
          margin-left 32 * rpx
          display flex
          .card-text
            width 500 * rpx
            display inline-block
            .name-rav
              margin-top 34 * rpx
              margin-left 36 * rpx
              .name
                display inline-block
                font-size 19px
                font-weight bold
              .rav
                display inline-block
                font-size 12px
            .num
              margin-top 16 * rpx
              margin-left 36 * rpx
              font-size 14 px
              color #707070
          .card-btn
            width 160 * rpx
            height 64 * rpx
            margin-top 72 * rpx
            border-radius 44 * rpx
            background #19C1DE
            display inline-block
            .btn-bom
              line-height 64 * rpx
              margin-left 24 * rpx
              color white
              font-size 28 * rpx
</style>
