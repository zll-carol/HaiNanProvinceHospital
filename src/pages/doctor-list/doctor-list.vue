<template lang="pug">
  .main
    .bg
      <!--.box-->
        <!--<icon type="search" class="icon"></icon>-->
        <!--<input type="text" class="input" placeholder="搜索医生" />-->
      .part
        .btn-list
          .btn(@tap="change2(index)" :class="numTime==index?'color-2':'color-1'" v-for="(item, index) in list")
            .btn-text(:class="numTime==index?'txt-color-1':'txt-color-2'") {{item.deptName}}
        .doctor-list
          .doctor-1(@tap="next(item)" :class="index==list1.length-1?'last':''" v-for="(item, index) in list1")
            .text {{item.doctorName}}
            .jump-info
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        numTime: 0,
        num: 1,
        name: '',
        list: [],
        list1: [],
        dept: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      change2(id) {
        this.numTime = id
        this.dept = this.list[id]
        this.getDoctor(this.dept.deptId)
      },
      next(item) {
        console.log(this.dept)
        item.doctorUrl = ''
        this.dept.deptUrl = ''
        let dept = {}
        dept.deptId = this.dept.deptId
        dept.deptName = this.dept.deptName
        wx.navigateTo({
          url: '../doctor-info/main?data=' + JSON.stringify(item) + '&dept=' + JSON.stringify(dept)
        })
      },
      async getDept() {
        let self = this
        self.list = []
        self.list1 = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital/getDept',
            data: {
              branchId: ''
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.length > 0) {
            self.list = res.data
            self.dept = self.list[0]
            self.getDoctor(self.dept.deptId)
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getDoctor(deptId) {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital/getDoctor',
            data: {
              deptId: deptId
            }
          })
          console.log('success')
          console.log(res)
          self.list1 = res.data
        } catch (err) {
          console.log(err)
        }
      }
    },
    onShow() {
    },
    onLoad() {
      this.getDept()
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
      background #F0EFF5
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-top 16 * rpx
        .box
          width 720 * rpx
          height 80 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          box-shadow:0px 6px 12px rgba(0,0,0,0.05);
          .icon
            width 40 * rpx
            height 40 * rpx
            margin-top 20 * rpx
            margin-left 36 * rpx
          .input
            width 600 * rpx
            float right
            font-size 16px
            margin-top 18 * rpx
        .part
          margin-top 16 * rpx
          width auto
          height auto
          .btn-list
            width 256 * rpx
            height auto
            display inline-block
            margin-left 16 * rpx
            .btn
              margin-top 16 * rpx
              background-color white
              border-radius 88 * rpx
              width 256 * rpx
              height 80 * rpx
              text-align center
              .btn-text
                font-size 16px
                line-height 80 * rpx
                width 250 * rpx
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
            width 440 * rpx
            height auto
            display inline-block
            margin-top 16 * rpx
            margin-left 16 * rpx
            position absolute
            .doctor
              width 384 * rpx
              height 96 * rpx
              background #fff
              margin-left 16 * rpx
              -webkit-box-align center
              -webkit-align-items center
              align-items center
              display flex
              border-bottom 2 * rpx solid #E5E5E5
              .text
                font-size 16px
                margin-left 32 * rpx
                line-height 96 * rpx
              .jump-info
                position absolute
                margin-left 400 * rpx
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
                  position absolute
                  top 50%
                  margin-top -6 * rpx
                  right 2px
            .doctor-1
              width 384 * rpx
              height 96 * rpx
              background #fff
              margin-left 16 * rpx
              -webkit-box-align center
              -webkit-align-items center
              align-items center
              display flex
              border-bottom 2 * rpx solid #E5E5E5
              .text
                font-size 16px
                margin-left 32 * rpx
                line-height 96 * rpx
              .jump-info
                position absolute
                margin-left 400 * rpx
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
                  position absolute
                  top 50%
                  margin-top -6 * rpx
                  right 2px
            .last
              border-bottom 0
</style>
