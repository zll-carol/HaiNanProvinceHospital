<template lang="pug">
  .main
    .bg
    .none(v-if="doctorList.length === 0")
      .img
        img(src="https://nontax-cdn.yuluoo.com/hospital-doctor-none.png")
        .text 您还没有收藏的医生
    .top(v-if="doctorList.length > 0")
      .box(v-for="item in doctorList")
        .list
          .imgUrl
            img.user-avatar(:src="item.doctorImage")
          .doctor
            .doctorName
             .text {{item.doctorName}}
            .money-1
              img(@tap="cancel(item)")(mode="widthFix", :src="scNum==0?'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star.png':'https://nontax-cdn.yuluoo.com/hainanhospital-registered-star-qx.png'")
            .doctorLevel
              .text-1 {{item.doctorJobTitle}}({{item.deptName}})
        .line
        .list-doctor-info
          .info-btn(@click="open(item)") 挂号
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        scNum: 0,
        doctorList: [],
        peopleData: {},
        pageNo: 1,
        pageSize: 5,
        loadType: true
      }
    },

    computed: {},

    components: {},
    methods: {
      open(item) {
        wx.navigateTo({
          url: '../registered-choose-doctor-1/main?name=' + item.doctorName + '&address=' + item.address + '&deptId=' + item.deptId + '&doctorId=' + item.doctorId
        })
      },
      async collectDoctorList() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/collectDoctor/list',
            data: {
              patientId: self.peopleData.patientId,
              pageNo: this.pageNo,
              pageSize: this.pageSize
            }
          })
          console.log('success')
          console.log(res)
          let list = res.data.collectDoctorList
          if (list) {
            for (let i = 0; i < list.length; i++) {
              self.doctorList.push(list[i])
            }
          }
          if (list.length < self.pageSize) {
            self.loadType = false
          }
          this.pageNo++
        } catch (err) {
          console.log(err)
        }
      },
      cancel(item) {
        let self = this
        wx.showModal({
          content: '是否确认取消收藏该医生？',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              self.notCollectget(item.doctorId)
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      async notCollectget(doctorId) {
        await RPC.notCollectget(doctorId)
        this.pageNo = 1
        this.doctorList = []
        this.collectDoctorList()
      }
    },
    onReachBottom() {
      if (this.loadType) {
        this.collectDoctorList()
      } else {
        wx.showToast({
          title: '没有更多数据！',
          icon: 'none'
        })
      }
    },
    onReady() {
    },
    created() {
    },
    onLoad() {
      this.loadType = true
      this.doctorList = []
      this.pageNo = 1
      this.collectDoctorList()
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
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
      overflow hidden
      background #F0EFF5
      text-align center
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .none
        position absolute
        top 0
        height 100%
        width 100%
        .img
          width 260 * rpx
          margin 50% auto
          img
            height 144 * rpx
            width 144 * rpx
          .text
            margin-top 32 * rpx
            font-size 28 * rpx
            font-weight bold
            color #707070
      .top
        position absolute
        top 0
        .box
          width 720 * rpx
          margin-top 16 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          border-radius 16 * rpx
          margin-left 16 * rpx
          background #fff
          .list
            border-top-right-radius 16 * rpx
            border-top-left-radius 16 * rpx
            height 160 * rpx
            background #fff
            display flex
            position relative
            -webkit-box-align center
            -webkit-align-items center
            align-items center
            .imgUrl
              margin-left 32 * rpx
              width 96 * rpx
              height 128 * rpx
              background rgba(0, 0, 0, 0)
              border 0.5px solid rgba(237, 237, 237, 1)
              border-radius 50%
              .user-avatar
                width 96 * rpx
                height 128 * rpx
                border-radius 8 * rpx
                border 4 * rpx solid #B3E5FC
                overflow hidden
            .doctor
              margin-left 16 * rpx
              .doctorName
                width 500 * rpx
                height 50 * rpx
                display inline-block
                text-align left
                .text
                  font-size 36 * rpx
                  font-weight bold
              .money-1
                display inline-block
                position absolute
                right 32 * rpx
                width 48 * rpx
                height 48 * rpx
                img
                  width 100%
                  height 100%
              .doctorLevel
                width 500 * rpx
                margin-top 12 * rpx
                text-align left
                .text-1
                  font-size 28 * rpx
                  color #707070
          .line
            width 544 * rpx
            height 2 * rpx
            background-color #E5E5E5
            position absolute
            right 32 * rpx
          .list-doctor-info
            margin-left 32 * rpx
            width 650 * rpx
            height 96 * rpx
            background #fff
            align-items center
            display flex
            .info-btn
              background-color #19C1DE
              border-radius 32 * rpx
              width 160 * rpx
              height 64 * rpx
              line-height 64 * rpx
              text-align center
              position absolute
              right 32 * rpx
              color  #FFFFFF
              font-size 32 * rpx
</style>
