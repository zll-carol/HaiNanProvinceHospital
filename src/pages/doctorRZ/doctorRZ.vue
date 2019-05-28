<template lang="pug">
  .main
    .tip(v-show="activeDisplay") {{tipShow}}
    .bg
      .box-1
        .box-relation
          .name 姓名
          input.picker-1(v-model="data.name" placeholder="请输入姓名")
        .box-relation(:style="chooseType==2?'':'border:none'")
          .name 身份证号
          input.picker-1(type="idcard" v-model="data.cardNo" placeholder="请输入身份证号码")
      .tips 温馨提示：
      .tips-one 医生通过人脸识别进行认证后，即可在首页的医生服务中查看所管辖住院患者的检查报告信息。
      .btn-class
        button(@tap="next")
          .btm 人脸识别
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        name: '本人姓名',
        activeDisplay: false,
        isShow1: false,
        isShow: false,
        index: 0,
        index1: 1,
        data: {
          cardNo: '',
          name: ''
        },
        peopleData: {},
        tipStatus: '', // 提示状态
        tipShow: '',
        chooseType: 0,
        getNumName: '获取验证码',
        time: 120,
        checkNum: true,
        myInterval: ''
      }
    },

    computed: {
    },

    components: {},
    methods: {
      showTip(index) {
        this.tipShow = RPC.tipShowText(index)
        this.activeDisplay = true
        setTimeout(
          this.hideTip,
          3000
        )
      },
      hideTip() {
        this.activeDisplay = false
      },
      async doctorCertifiedCertify() {
        // 验证医生信息
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/certify',
            data: {
              // idCardNo: '430104198109210210',
              // idCardNo: '410105195906101622',
              // idCardNo: '622301197910200063',
              idCardNo: self.data.cardNo,
              patientId: self.peopleData.patientId,
              name: self.data.name
              // name: '刘飒华',
              // name: '茹美艳'
              // name: '盛莉'
            }
          })
          console.log('success')
          console.log(res)
          // wx.setStorageSync('doctorInfo', 1)
          RPC.toShow('认证成功！')
          wx.setStorageSync('doctorInfo', res.data)
          wx.navigateBack({
            delta: 10
          })
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            RPC.toShow(err.errmsg)
          }
        }
      },
      next() {
        let self = this
        console.log(self.data.cardNo)
        console.log(self.data.cardNo.length)
        if (self.data.name === '') {
          self.showTip(0)
        } else if (self.data.cardNo === '' || (self.data.cardNo.length !== 15 && self.data.cardNo.length !== 18)) {
          self.showTip(2)
        } else {
          // 方便测试，跳过人脸识别
          self.check()
          // self.doctorCertifiedCertify()
        }
      },
      async wxChcekIsSupportFacialRecognition() {
        return new Promise((resolve, reject) => {
          wx.checkIsSupportFacialRecognition({
            success(errCode) {
              resolve(errCode)
            },
            fail(errCode) {
              reject(errCode)
            }
          })
        })
      },
      async check() {
        let self = this
        try {
          let res = await self.wxChcekIsSupportFacialRecognition()
          console.log(res)
          let okMsg = 'checkIsSupportFacialRecognition:ok'
          if (res.errMsg === okMsg) {
            // 支持人脸识别
            // 不需要短信验证
            // self.verifyRequest()
            // 进入人脸认证
            console.log(self.data.name + '+' + self.data.cardNo)
            wx.startFacialRecognitionVerify({
              name: self.data.name,
              idCardNumber: self.data.cardNo,
              success(res) {
                console.log('success')
                console.log(res)
                self.checkFace(res.verifyResult)
                // self.doctorCertifiedCertify()
              },
              fail(res) {
                console.log('fail')
                console.log(res)
                console.log(res.errCode)
              },
              checkAliveType: 2
            })
          } else {
            wxAsync.showToast({
              title: '该设备暂不支持人脸识别',
              icon: 'none',
              duration: 3000,
              mask: true
            })
          }
        } catch (err) {
          console.log(err)
        }
      },
      async checkFace(verifyResult) {
        // 验证人脸识别真实性
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/verifyFaceAgain',
            data: {
              name: self.data.name,
              idCardNo: self.data.cardNo,
              verifyResult: verifyResult,
              patientId: self.peopleData.patientId
            }
          })
          console.log('success')
          console.log(res)
          // 验证通过
          self.doctorCertifiedCertify()
        } catch (err) {
          console.log('fail')
          RPC.toShow(err.errmsg)
        }
      }
    },
    onShow() {
    },
    onLoad() {
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
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
    background #19C1DE
    .main
      width 750 * rpx
      height 100%
      overflow hidden
      background #F0EFF5
      .tip
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
          width 720 * rpx
          height auto
          border-radius 8px
          background #fff
          margin-left 16 * rpx
          .bom
            border-bottom 2 * rpx solid #E5E5E5
          .box-relation
            width 648 * rpx
            height 96 * rpx
            background #fff
            .name
              display inline-block
              width 180 * rpx
              line-height 96 * rpx
              font-size 16px
              color #707070
            .picker
              display inline-block
              margin-lift 32 * rpx
              font-size 16px
              line-height 96 * rpx
          .box-relation-1
            margin-top 1 * rpx
            width 648 * rpx
            height 96 * rpx
            background #fff
            margin-left 32 * rpx
            display flex
            .name-1
              width 180 * rpx
              display inline-block
              line-height 96 * rpx
              font-size 16px
              color #707070
            .picker-1
              margin-top 20 * rpx
              display inline-block
              margin-lift 32 * rpx
              font-size 16px
              line-height 96 * rpx
        .box-1
          margin-top 16 * rpx
          width 720 * rpx
          height auto
          border-radius 8px
          background #fff
          margin-left 16 * rpx
          .box-relation
            width 648 * rpx
            height 96 * rpx
            background #fff
            margin-left 32 * rpx
            border-bottom 2 * rpx solid #E5E5E5
            display flex
            .name
              width 180 * rpx
              display inline-block
              line-height 96 * rpx
              font-size 16px
              color #707070
            .picker-1
              width 400 * rpx
              margin-top 20 * rpx
              display inline-block
              margin-lift 32 * rpx
              font-size 16px
              line-height 96 * rpx
            .picker-11
              width 240 * rpx
              margin-top 20 * rpx
              display inline-block
              margin-lift 32 * rpx
              font-size 16px
              line-height 96 * rpx
            .picker-12
              width 208 * rpx
              margin-top 20 * rpx
              display inline-block
              margin-lift 32 * rpx
              font-size 16px
              line-height 96 * rpx
            .phoneNum
              display inline-block
              font-size 16px
              line-height 96 * rpx
              color #005DFF
            .phoneNum-1
              display inline-block
              margin-lift 36 * rpx
              font-size 16px
              line-height 96 * rpx
              border 0
              color #005DFF
            .txtblue
              color #005DFF
            .txtgray
              color #707070
        .tips
          margin-top 48 * rpx
          margin-left 48 * rpx
          font-size 12px
          color #006C80
        .tips-one
          width 624 * rpx
          margin-top 22 * rpx
          margin-left 48 * rpx
          font-size 12px
          color #0098B3
        .btn-class
          bottom 54 * rpx
          position absolute
          width 100%
          button
            width 690 * rpx
            height 88 * rpx
            border-radius 88 * rpx
            background #19C1DE
            line-height:88rpx
            box-shadow:0px 6px 12px rgba(0,0,0,0.1)
            .btm
              color white
</style>
