<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay2") {{tips}}
    .peopleInfo(v-if="type=='1'")
      .text 就诊人
      .text-1 {{choose}}
    .none(v-if="registerOrderList.length == 0") 暂无相关信息
    .pay-list(v-show="activeDisplay" :style="type=='2'?'top:16rpx':''")
      .item(v-for="(item,index) in registerOrderList" :key="index")
        form(@submit="navigateToGuahaoRecordDetail(item)",report-submit="true", :data-id="item.id")
          button.btn(formType= "submit",plain="true")
            .pay-item_content
              .content_list
                .left 挂号单号
                .right {{item.registerNo}}
                .status(:style="item.status == 1?'color:#FCA103':'color:#F10000'") {{item.startStr}}
              .content_list
                .left 就诊人
                .right {{item.visitName}}
              .content_list
                .left 就诊医生
                .right {{item.visitDoctor}} ({{item.sectionName}})
              .content_list
                .left 就诊时间
                .right {{item.visitTime}}
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'

  export default {
    data() {
      return {
        activeDisplay: true,
        MsgStatus: '',
        activeDisplay2: false,
        activeBackground: '',
        tipStatus: '',
        registerOrderList: [],
        cdate: '',
        index: '',
        reviseId: '',
        type: '1',
        choose: '',
        array: [],
        peopleList: [],
        patientId: '',
        pageNo: 1,
        pageSize: 10,
        loadType: true
      }
    },
    computed: {
      tips() {
        if (this.tipStatus === 0) {
          return '网络异常，请稍后重试'
        }
      }
    },
    components: {},
    methods: {
      bindPickerChange(event) {
        this.choose = this.array[event.mp.detail.value]
        this.index = event.mp.detail.value
        this.pageNo = 1
        this.registerOrderList = []
        this.registerRecordRequest(this.peopleList[this.index].patientId)
      },
      setArray() {
        let self = this
        self.array = []
        self.choose = ''
        self.peopleList = wx.getStorageSync('getHealthCardList')
        for (let i = 0, length = self.peopleList.length; i < length; i++) {
          self.array.push(self.peopleList[i].name + '(' + self.peopleList[i].outpatientNo + ')')
        }
      },
      showPage1() {
        this.activeDisplay = true
      },
      showTip2() {
        this.activeDisplay2 = true
      },
      hideTip2() {
        this.activeDisplay2 = false
      },
      navigateToGuahaoRecordDetail(item) {
        console.log('navigateToGuahaoRecordDetail xxxxxxxxxxxxx event:')
        let param = JSON.stringify(item)
        wxAsync.navigateTo({
          url: '/pages/guahaoRecord-detail/main?param=' + param
        })
      },
      async registerRecordRequest(patientId) {
        let that = this
        // that.registerOrderList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listRegister',
            data: {
              patientId: patientId,
              // patientId: 7631414,
              pageNo: this.pageNo,
              pageSize: this.pageSize
            }
          })
          console.log('registerRecordRequest xxxxxxxxxxxx res:')
          console.log(res.data.registerOrderList)
          console.log(res.data.registerOrderList.length)
          that.showPage1()
          if (res.data.registerOrderList) {
            if (res.data.registerOrderList.length === this.pageSize) {
              this.pageNo++
            } else {
              this.loadType = false
            }
            for (let i = 0; i < res.data.registerOrderList.length; i++) {
              that.registerOrderList.push(res.data.registerOrderList[i])
            }
          } else {
            this.loadType = false
          }
        } catch (err) {
          this.MsgStatus = ''
          this.tipStatus = 0
          setTimeout(
            this.hideTip2,
            3000
          )
          this.showTip2()
          console.log(err)
        }
      },
      async registerRecordHisRequest(patientId) {
        let that = this
        that.registerOrderList = []
        let date = new Date()
        let yest = date.getTime() - 1000 * 60 * 60 * 24 * 30 * 24
        let yestDate = new Date()
        yestDate.setTime(yest)
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/register/listHisRegister',
            data: {
              patientId: patientId,
              // patientId: 7631414,
              // patientId: 2531,
              startDate: RPC.getTime(yestDate),
              endDate: RPC.getTime(date)
            }
          })
          console.log('registerRecordHisRequest xxxxxxxxxxxx res:')
          console.log(res.data.registerOrderList)
          console.log(res.data.registerOrderList.length)
          that.showPage1()
          that.registerOrderList = res.data.registerOrderList
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              this.hideTip2,
              3000
            )
            this.showTip2()
          }
        }
      }
    },
    created() {
    },
    // onPullDownRefresh() {
    //   if (this.type === '1') {
    //     wx.startPullDownRefresh()
    //     this.registerOrderList = []
    //     this.registerRecordRequest()
    //     wx.stopPullDownRefresh()
    //   } else {
    //     wx.stopPullDownRefresh()
    //   }
    // },
    onReachBottom() {
      if (this.type === '1') {
        if (this.loadType) {
          this.registerRecordRequest('')
        } else {
          wx.showToast({
            title: '没有更多数据！',
            icon: 'none'
          })
        }
      }
    },
    onShow() {
      if (this.type === '1') {
        this.peopleList = wx.getStorageSync('getHealthCardList')
        this.pageNo = 1
        this.loadType = true
        this.registerOrderList = []
        this.choose = this.peopleList[0].name + '(' + this.peopleList[0].outpatientNo + ')'
        this.registerRecordRequest(this.peopleList[0].patientId)
        // this.setArray()
      } else {
        this.registerRecordHisRequest(this.patientId)
      }
    },
    onLoad(event) {
      console.log(event)
      this.type = event.type
      if (this.type === '2') { // type=2,则是健康卡进入的挂号记录
        wx.setNavigationBarTitle({
          title: event.name + '的挂号记录'
        })
        this.patientId = event.patientId
      }
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx
  rpx = rpxf()

  page
    background-color #EFEFF4
    .main
      width 750 * rpx
      overflow hidden
      background #F0EFF5
      text-align center
      padding-bottom 54 * rpx
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
      .peopleInfo
        position absolute
        top 16 * rpx
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
          font-size 16px
          margin-left 32 * rpx
          line-height 96 * rpx
        .text-1
          width 350 * rpx
          font-size 16px
          margin-left 40 * rpx
          line-height 96 * rpx
          font-weight bold
        .text-2
          font-size 14px
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
      .none
        color #9999
        text-align center
      .pay-list
        position absolute
        top 128 * rpx
        left 16 * rpx
        text-align center
        .item
          margin-bottom 18  * rpx
          width 720  * rpx
          background-color #FFFFFF
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.05)
          border-radius 16px
          text-align center
          form
            .btn
              border none
              line-height 1.5
              .pay-item_content
                margin-bottom 20 * rpx
                display inline-block
                text-align left
                padding-top 28 * rpx
                width 656  * rpx
                font-size 28  * rpx
                .content_list
                  padding-bottom 16  * rpx
                  position relative
                  .left
                    width 135 * rpx
                    color #707070
                    display inline-block
                  .right
                    display inline-block
                    margin-left 32 * rpx
                  .status
                    position absolute
                    right 0
                    width 160 * rpx
                    height 50 * rpx
                    text-align center
                    line-height 48 * rpx
                    display inline-block
                    border-radius 24 * rpx
</style>
