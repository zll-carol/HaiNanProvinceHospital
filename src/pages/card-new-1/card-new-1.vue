<template lang="pug">
  .main
    .tip(v-show="activeDisplay") {{tipShow}}
    .bg
      .box
        .box-relation
          .name 方式
          picker.picker(@change="bindPickerChange1" :value="index1" :range="array1") {{choose1}}
      .box-1
        .box-relation
          .name {{name}}
          input.picker-1(v-model="data.name" placeholder="请输入姓名")
          <!--<input class="picker-1" v-model="data.name" placeholder="请输入姓名"/>-->
        .box-relation(:style="chooseType==2?'':'border:none'")
          .name 身份证号
          input.picker-1(type="idcard" v-model="data.cardNo" placeholder="请输入身份证号码")
          <!--<input class="picker-1" type="idcard" v-model="data.cardNo" placeholder="请输入身份证号码"/>-->
        .box-relation(:style="chooseType==2?'':'border:none'" v-if="chooseType==2")
          .name 手机号码
          input.picker-11(type="number" v-model="data.phone" placeholder="请输入手机号码")
          <!--<input class="picker-11" type="number" v-model="data.phone" placeholder="请输入手机号码"/>-->
          .phoneNum(@tap="getNum()" :class="checkNum?'txtblue':'txtgray'") {{getNumName}}
        <!--.box-relation-->
          <!--.name 手机号码-->
          <!--<input class="picker-12" type="number" disabled="true" v-model="data.phone1"/>-->
          <!--<button class="phoneNum-1" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权手机号码</button>-->
        .box-relation(style="border:none" v-if="chooseType==2")
          .name 验证码
          input.picker-1(type="number" v-model="data.verifyCode" placeholder="请输入短信验证码")
          <!--<input class="picker-1" type="number" v-model="data.verifyCode" placeholder="请输入短信验证码"/>-->
      .tips 温馨提示：
      .tips-one 1.首次必须绑定本人的健康卡；
      .tips-one 2.人脸识别方式，通过实名认证后可在线新建或关联已建的档案进行绑定；
      .tips-one 3.验证手机号方式，通过手机号验证后可关联对应已建档的档案进行绑定。
      .btn-class
        button(@tap="next")
          .btm 下一步
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
        array1: ['验证手机号绑定', '人脸识别绑定'],
        array: ['有身份证的就诊人', '无身份证的就诊人'],
        choose: '有身份证的就诊人',
        choose1: '人脸识别绑定',
        data: {
          cardNo: '',
          phone: '',
          phone1: '',
          name: '',
          nameChild: '',
          bindType: '1', // 绑定类型  0：手机号   1：人脸
          hasIdCard: '1', // 有无身份证 0：无身份证  1：有身份证
          verifyCode: '' // 短信验证码
        },
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
      getPhoneNumber(event) {
        let self = this
        console.log(event)
        if (event.mp.detail.errMsg === 'getPhoneNumber:ok') {
          self.decipher(event.mp.detail.encryptedData, event.mp.detail.iv)
        }
      },
      async decipher(encryptedData, iv) {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/login/decipher',
            data: {
              encryptedData: encryptedData,
              iv: iv
            }
          })
          console.log('success')
          console.log(res.data)
          let data = JSON.parse(res.data)
          console.log(data.purePhoneNumber)
          self.data.phone1 = data.purePhoneNumber
        } catch (err) {
          console.log('fail')
        }
      },
      timer() {
        this.time = 120
        this.myInterval = setInterval(
          this.sendTextMessage,
          1000
        )
      },
      sendTextMessage() {
        this.time--
        if (this.time >= 0) {
          this.getNumName = '还剩余' + this.time + '秒'
        } else {
          clearInterval(this.myInterval)
          this.getNumName = '获取验证码'
          this.checkNum = true
        }
      },
      async getNum() {
        let self = this
        console.log(self.data.phone)
        // 获取验证码
        if (self.checkNum) {
          if (self.data.phone && self.data.phone.length === 11) {
            wxAsync.showLoading({title: '数据加载中', mask: true})
            try {
              let res = await RPC.request({
                url: '/HospitalFormApi/verifycode/create',
                data: {
                  phone: self.data.phone
                }
              })
              console.log('success')
              console.log(res)
              // 发送验证码成功，禁止按钮点击
              wx.showToast({title: '发送成功'})
              self.checkNum = false
              self.timer()
            } catch (err) {
              // self.tipStatus = 10
              // setTimeout(
              //   self.hideTip,
              //   3000
              // )
              self.showTip(12)
              console.log('fail')
            }
            wxAsync.hideLoading()
          } else {
            // self.tipStatus = 5
            // setTimeout(
            //   self.hideTip,
            //   3000
            // )
            self.showTip(5)
          }
        }
      },
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
      bindPickerChange1(event) {
        this.choose1 = this.array1[event.mp.detail.value]
        this.index1 = event.mp.detail.value
        console.log(event.mp.detail.value)
        if (event.mp.detail.value === '1') {
          // 人脸识别
          this.isShow1 = true
          this.data.bindType = 1
          this.chooseType = 1
        } else {
          // 手机验证码添加
          this.chooseType = 2
          this.data.bindType = 0
          this.isShow = false
          this.isShow1 = false
        }
      },
      async listArchives() {
        // 验证是否已经存在档案
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listArchives',
            data: {
              cardNo: self.data.cardNo,
              cardType: '1'
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.archivesList.length > 0) {
            // 已经有档案
            console.log('已有档案')
            wx.navigateTo({
              url: '../card-file-list/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&type=1'
            })
          } else {
            // 没有档案
            console.log('没有档案')
            if (self.data.bindType === 0) {
              // 提示没有档案
              wx.showModal({
                title: '提示',
                content: '没有档案，请通过人脸识别建档！',
                confirmText: '确认',
                cancelText: '取消',
                confirmColor: '#007FFF',
                cancelColor: '#000000',
                success(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              // 人脸识别
              wx.navigateTo({
                url: '../card-info-final/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&key=1&type=1'
              })
            }
          }
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.showTip(10)
          }
        }
      },
      async listArchives1() {
        // 验证是否已经存在档案
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listArchives',
            data: {
              cardNo: self.data.cardNo + ';' + self.data.phone,
              cardType: '3'
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.archivesList.length > 0) {
            // 已经有档案
            console.log('已有档案')
            wx.navigateTo({
              url: '../card-file-list/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&type=1&k=2'
            })
          } else {
            // 没有档案
            console.log('没有档案')
            if (self.data.bindType === 0) {
              // 提示没有档案
              wx.showModal({
                title: '提示',
                content: '没有档案，或者输入信息有误，请通过人脸识别建档！',
                confirmText: '确认',
                cancelText: '取消',
                confirmColor: '#007FFF',
                cancelColor: '#000000',
                success(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              // 人脸识别
              wx.navigateTo({
                url: '../card-info-final/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&key=1&type=1'
              })
            }
          }
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.showTip(10)
          }
        }
      },
      async verifyRequest() {
        // 校验手机验证码
        let self = this
        wxAsync.showLoading({title: '数据加载中', mask: true})
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/verifycode/verify',
            data: {
              phone: self.data.phone,
              verifyCode: self.data.verifyCode
            }
          })
          wxAsync.hideLoading()
          console.log('success')
          console.log(res + ',' + res.errcode)
          self.listArchives1()
          // 现在版本选择人脸识别不需要短信验证
          // if (self.chooseType === 2) {
          //   self.listArchives()
          // } else {
          //   // 进入人脸认证
          //   console.log(self.data.name + '+' + self.data.cardNo)
          //   wx.startFacialRecognitionVerify({
          //     name: self.data.name,
          //     idCardNumber: self.data.cardNo,
          //     success(res) {
          //       console.log('success')
          //       console.log(res)
          //       // 暂时去掉人脸识别二次验证
          //       self.checkFace(res.verifyResult)
          //       // self.listArchives()
          //     },
          //     fail(res) {
          //       console.log('fail')
          //       console.log(res)
          //       console.log(res.errCode)
          //     }
          //   })
          // }
        } catch (err) {
          wx.showToast({title: err.errmsg, icon: 'none'})
          console.log(err)
          console.log('fail')
        }
      },
      next() {
        let self = this
        if (self.chooseType === 0) {
          self.showTip(8)
        } else if (self.data.name === '') {
          self.showTip(0)
        } else if (self.data.cardNo === '' || (self.data.cardNo.length !== 15 && self.data.cardNo.length !== 18)) {
          self.showTip(2)
        } else if ((self.data.phone === '' || self.data.phone.length !== 11) && self.chooseType === 2) {
          self.showTip(5)
        } else if (self.data.verifyCode === '' && self.chooseType === 2) {
          self.showTip(6)
        } else {
          if (self.chooseType === 2) {
            // 开始验证手机号
            self.verifyRequest()
          } else {
            // 校验是否支持人脸识别
            self.check()
            // 方便测试，直接进入建档流程
            // self.listArchives()
          }
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
                // 暂时去掉人脸识别二次验证
                self.checkFace(res.verifyResult)
                // self.listArchives()
              },
              fail(res) {
                RPC.toShow('识别错误！请稍后再试')
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
              verifyResult: verifyResult
            }
          })
          console.log('success')
          console.log(res)
          // 验证通过
          self.listArchives()
        } catch (err) {
          RPC.toShow('识别错误！请稍后再试')
          console.log('fail')
        }
      }
    },
    onShow() {
    },
    onLoad() {
      this.index1 = 1
      this.isShow1 = true
      this.data.bindType = 1
      this.chooseType = 1
      this.choose1 = '人脸识别绑定'
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
            margin-left 32 * rpx
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
          color #707070
        .tips-one
          width 624 * rpx
          margin-top 22 * rpx
          margin-left 48 * rpx
          font-size 12px
          color #707070
        .btn-class
          margin-top 96 * rpx
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
