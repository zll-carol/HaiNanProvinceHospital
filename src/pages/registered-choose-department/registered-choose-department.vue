<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .registered(v-if="show")
      .peopleInfo
        .text 就诊人
        .text-1 {{name}}
      .part
        .btn-list
          .btn(@tap="change2(index)" :class="numTime==index?'color-2':'color-1'" v-for="(item, index) in list")
            .btn-text(:class="numTime==index?'txt-color-1':'txt-color-2'") {{item.deptType}}
        .doctor-list
          .doctor(@tap="next(item)", v-for="(item, index) in list1", :class="index==list1.length-1?'last':''")
            .text {{item.name}}
            .jump-info
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        show: false,
        login: false,
        peopleDate: '',
        name: '',
        list: [],
        list1: [],
        numTime: 0
      }
    },

    computed: {},

    components: {},
    methods: {
      search(event) {
        console.log(event.mp.detail.value)
        let keyword = event.mp.detail.value
        if (keyword) {
          this.searchDoctor(keyword)
        }
      },
      change2(id) {
        this.numTime = id
        this.list1 = this.list[id].sections
      },
      async searchDoctor(keyword) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listDoctorByName',
            data: {
              keyword: keyword,
              type: '1'
            }
          })
          console.log('success')
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
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      next(item) {
        let data = JSON.stringify(item)
        let peopleDate = JSON.stringify(this.peopleDate)
        wx.navigateTo({
          url: '../registered-choose-doctor/main?data=' + data + '&peopleDate=' + peopleDate
        })
      },
      async listSection(districtName) {
        let self = this
        let date = RPC.getTime(new Date())
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listSection',
            data: {
              districtName: districtName,
              registerType: '',
              date: date,
              start: '1',
              requestQty: '100',
              patientId: self.peopleDate.patientId
            }
          })
          console.log('success')
          console.log(res)
          self.list = res.data.sectionList
          self.list1 = res.data.sectionList[0].sections
          self.show = true
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
    onLoad(event) {
      this.numTime = 0
      this.show = false
      this.peopleDate = JSON.parse(event.peopleDate)
      this.name = this.peopleDate.name + '(' + this.peopleDate.outpatientNo + ')'
      this.listSection(event.districtName)
    },
    created() {
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
      .registered
        position absolute
        top 16 * rpx
        .peopleInfo
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
            margin-left 40 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-left 280 * rpx
            line-height 96 * rpx
            color #C7C7CC
        .part
          width auto
          height auto
          .btn-list
            width 192 * rpx
            height auto
            display inline-block
            position fixed
            left 10 * rpx
            .btn
              margin-top 16 * rpx
              background-color white
              border-radius 88 * rpx
              width 192 * rpx
              height 80 * rpx
              text-align center
              .btn-text
                font-size 32 * rpx
                line-height 80 * rpx
                width 180 * rpx
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
            .color-1
              background-color white
            .color-2
              background-color #19C1DE
            .txt-color-1
              color white
            .txt-color-2
              color black
          .doctor-list
            border-radius 8px
            background #fff
            width 512 * rpx
            height auto
            display inline-block
            margin-top 16 * rpx
            margin-bottom 112 * rpx
            position absolute
            right 4 * rpx
            .doctor
              width 448 * rpx
              height 96 * rpx
              background #fff
              margin-left 32 * rpx
              -webkit-box-align center
              -webkit-align-items center
              align-items center
              display flex
              border-bottom 2 * rpx solid #E5E5E5
              .text
                font-size 16px
                width 400 * rpx
                line-height 96 * rpx
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
              .jump-info
                position absolute
                right 32 * rpx
                color #808080
                font-size 32 * rpx
                &:after
                  content ' '
                  display inline-block
                  height 12 * rpx
                  width 12 * rpx
                  border-width 4 * rpx 4 * rpx 0 0
                  border-color #C8C8CD
                  border-style solid
                  -webkit-transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                  transform matrix(0.71, 0.71, -0.71, 0.71, 0, 0)
                  top -2px
                  position absolute
                  top 50%
                  margin-top -6 * rpx
                  right 2px
            .last
              border-bottom 0
</style>


