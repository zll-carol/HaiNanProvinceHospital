<template lang="pug">
  .main
    .bg
    .drug_box
      .cardInfo(@click="choosePeople")
        .text 科室
        .text-1 {{chooseName}}
        picker.text-2(@change="bindPickerChange" :range="deptList") 更换科室
        .jump-info
      .box-table
        .box_today(@tap="selected",:data-key="0")
          .table_today 全部病人
          .line(v-if="type === 0")
        .box_hist(@tap="selected",:data-key="1")
          .table_hist 我的病人
          .line(v-if="type === 1")
      .box-list-1
        .box(v-for="(item, index) in list",@tap="goInfo(item)")
          .box-text
            .text-1 {{item.patientName}}
            .text-2 ({{item.sex}}/{{item.age}}/{{item.adno}})
            .text-3(v-if="item.bed !== ''")
              .text-3-t {{item.bed}}
          .box-text-1
            .text-1 诊断
            .text-2 {{item.diagnosis}}
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        peopleData: {},
        type: 0,
        doctorInfo: {},
        chooseName: '',
        deptList: [],
        deptInfo: {},
        deptInfoList: [],
        list: []
      }
    },

    computed: {},

    components: {},
    methods: {
      selected(event) {
        if (event.currentTarget.dataset.key !== this.type) {
          this.type = event.currentTarget.dataset.key
          this.listPatients()
        }
      },
      bindPickerChange(event) {
        this.chooseName = this.deptList[event.mp.detail.value]
        let index = event.mp.detail.value
        console.log(index)
        this.deptInfo = this.deptInfoList[index]
        this.listPatients()
      },
      goInfo(item) {
        wxAsync.navigateTo({
          url: '../doctor-server-patientMsg/main?data=' + JSON.stringify(item) + '&deptId=' + this.deptInfo.deptId
        })
      },
      async listPatients() {
        let that = this
        that.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/listPatients',
            data: {
              // patientId: '9044708',
              patientId: that.peopleData.patientId,
              doctorId: that.doctorInfo.doctorId,
              doctorName: that.doctorInfo.doctorName,
              deptId: that.deptInfo.deptId,
              type: that.type
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          that.list = res.data.patientList
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async listDepts() {
        this.list = []
        let that = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/listDepts',
            data: {
              // patientId: '9044708',
              patientId: that.peopleData.patientId,
              doctorId: that.doctorInfo.doctorId,
              doctorName: that.doctorInfo.doctorName
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          that.deptInfoList = res.data.deptList
          that.setArray()
          that.listPatients()
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      setArray() {
        let self = this
        self.deptList = []
        self.deptInfo = self.deptInfoList[0]
        self.chooseName = self.deptInfo.deptName
        console.log(self.choose)
        for (let i = 0, length = self.deptInfoList.length; i < length; i++) {
          self.deptList.push(self.deptInfoList[i].deptName)
        }
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad(event) {
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
      this.doctorInfo = JSON.parse(event.doctorInfo)
      this.listDepts()
      console.log(this.peopleData)
      console.log(this.doctorInfo)
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
        padding-bottom 16 * rpx
      .drug_box
        position absolute
        top 16 * rpx
        padding-bottom 32 * rpx
        .cardInfo
          width 720 * rpx
          height 96 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          -webkit-box-align center
          -webkit-align-items center
          align-items center
          display flex
          .text
            width 70 * rpx
            font-size 16px
            margin-left 32 * rpx
            line-height 96 * rpx
          .text-1
            width 400 * rpx
            font-size 16px
            margin-left 40 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-right 25 * rpx
            line-height 96 * rpx
            color #C7C7CC
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
              background #FFFFFF
              border-radius 16 * rpx
        .none
          color #9999
          padding-top 50%
          text-align center
        .box-list
          width 720 * rpx
          overflow-y auto
          overflow-x hidden
          margin-left 16 * rpx
          padding-bottom 294 * rpx
          .box-tips
            margin-top 16 * rpx
            width 720 * rpx
            height 80 * rpx
            background-color #fff
            border-radius 8 * rpx
            .text
              margin-left 32 * rpx
              display inline-block
              width 474 * rpx
              .text-1
                line-height 80 * rpx
                font-size 22 * rpx
                color #F10000
            .btn
              margin-left 32 * rpx
              display inline-block
              width 150 * rpx
              height 48 * rpx
              background-color #19C1DE
              border-radius 24 * rpx
              text-align center
              .text-2
                line-height 48 * rpx
                font-size 22 * rpx
                color #FFFFFF
          .box
            width 720 * rpx
            height 208 * rpx
            margin-top 16 * rpx
            border-radius 16 * rpx
            background-color #EFFDFF
            display flex
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
              display inline-block
              width auto
              height auto
              margin-top 8 * rpx
              .item-box-1
                display inline-block
                .item-text-1
                  margin-top 16 * rpx
                  font-size 28 * rpx
                  color #707070
              .item-box-2
                display inline-block
                margin-left 64 * rpx
                .item-text-2
                  margin-top 16 * rpx
                  font-size 28 * rpx
            .item-3
              display inline-block
              position absolute
              width 124 * rpx
              height 48 * rpx
              right 52 * rpx
              margin-top 20 * rpx
              border 2 * rpx solid #707070
              border-radius 16 * rpx
              text-align center
              .item-3-txt
                line-height 48 * rpx
                color #707070
                font-size 28 * rpx
          .activeBackground
            background-color #fff
        .box-list-1
          width 100%
          margin-top 26 * rpx
          .box
            margin-top 16 * rpx
            padding-top 24 * rpx
            padding-bottom 16 * rpx
            width 720 * rpx
            height auto
            background white
            margin-left 16 * rpx
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .box-text
              width 656 * rpx
              margin-left 32 * rpx
              align-items center
              .text-1
                color #0098B3
                display inline-block
                font-weight bold
                font-size 36 * rpx
                margin-bottom 20 * rpx
                margin-right 10 * rpx
              .text-2
                display inline-block
                font-weight bold
                font-size 28 * rpx
                color #707070
              .text-3
                position absolute
                right 30 * rpx
                display inline-block
                .text-3-t
                  font-weight bold
                  line-height 44 * rpx
                  font-size 36 * rpx
                  color #FF9100
            .box-text-1
              width 656 * rpx
              margin-left 32 * rpx
              display flex
              .text-1
                display inline-block
                font-size 28 * rpx
                color #707070
                margin-right 56 * rpx
                margin-top 6 * rpx
              .text-2
                width 500 * rpx
                line-height 1.6
                display inline-block
                font-size 28 * rpx
                color #000000
            .box-text-2
              height auto
              width 648 * rpx
              margin-left 32 * rpx
              display flex
              .text-1
                display inline-block
                font-size 14px
                color #707070
              .text-2
                margin-left 60 * rpx
                display inline-block
                .text-21
                  font-size 14px
                  color #707070
            .box-text-3
              height 96 * rpx
              width 648 * rpx
              margin-left 32 * rpx
              line-height 96 * rpx
              .text-1
                display inline-block
                font-size 14px
                color #707070
              .text-2
                margin-left 32 * rpx
                display inline-block
                font-size 14px
                color #707070
          .activeBackground
            background-color #fff
        .pay-btn
          width 750 * rpx
          height 112 * rpx
          background-color #fff
          display flex
          position fixed
          margin-top 422 * rpx
          bottom 0
          left 0
          z-index 999
          img
            display inline-block
            width 64 * rpx
            height 64 * rpx
            margin-left 32 * rpx
            margin-top 26 * rpx
          .text
            line-height 112 * rpx
            display inline-block
            font-size 16px
          .text-1
            line-height 112 * rpx
            color #707070
            display inline-block
            font-size 16px
            margin-left 96 * rpx
          .text-2
            line-height 112 * rpx
            color #006FFF
            display inline-block
            font-size 16px
          .text-btn
            display inline-block
            width 192 * rpx
            height 80 * rpx
            position absolute
            top 16 * rpx
            right 30 * rpx
            text-align center
            border-radius 16 * rpx
            background-color #19C1DE
            .text-3
              color white
              line-height 80 * rpx
              font-size 32 * rpx
</style>
