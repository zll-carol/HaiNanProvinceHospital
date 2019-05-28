<template lang="pug">
  .main
    .tip(v-show="activeDisplay") {{tipShow}}
    .bg
      .card
        .box
          .box-relation(:class="isShow1?'bom':''")
            .name 方式
            picker.picker(@change="bindPickerChange1" :value="index1" :range="array1") {{choose1}}
          <!--.box-relation(:class="isShow1?'bom':''")-->
            <!--.name 所在地-->
            <!--picker.picker(@change="bindPickerChange2" mode="region") {{choose1}}-->
          .box-relation(v-show="isShow1")(:class="isShow?'bom':''")
            .name 类型
            picker.picker(@change="bindPickerChange" :value="index" :range="array") {{choose}}
          .box-relation-1(v-if="isShow")
            .name-1 儿童姓名
            input.picker-1(v-model="data.nameChild" placeholder="请输入儿童姓名")
        .box-1
          .box-relation
            .name {{name}}
            input.picker-1(v-model="data.name" placeholder="请输入姓名")
          .box-relation(v-if="data.hasIdCard==0")
            .name 手机号码
            input.picker-11(type="number" v-model="data.phone" placeholder="请输入手机号码")
          .box-relation(v-if="data.hasIdCard==0")
            .name 地址
            input.picker-11(v-model="data.address" placeholder="请输入地址")
          .box-relation(:style="chooseType==1?'':'border-bottom: none'")
            .name 身份证号
            input.picker-1(type="idcard" v-model="data.cardNo" placeholder="请输入身份证号码")
          .box-relation(v-if="chooseType==1" :style="chooseType==1?'':'border-bottom: none'")
            .name 手机号码
            input.picker-11(type="number" v-model="data.phone" placeholder="请输入手机号码")
            .phoneNum(@tap="getNum()" :class="checkNum?'txtblue':'txtgray'") {{getNumName}}
          .box-relation(style="border:none" v-if="chooseType==1")
            .name 验证码
            input.picker-1(type="number" v-model="data.verifyCode" placeholder="请输入短信验证码")
        .box-2
          .tips 温馨提示：
          .tips-one 1.人脸识别方式，通过实名认证后可在线新建或关联已建的档案进行绑定；
          .tips-one 2.人脸识别方式，「有身份证的就诊人」类型，由其本人人脸识别后绑定；
          .tips-one 3.人脸识别方式，「无身份证的就诊人」类型，即未办理居民身份证的小孩，由监护人人脸识别后对被监护人档案进行绑定；
          .tips-one 4.验证手机号方式，通过手机号验证后可关联对应已建档的档案进行绑定。
          .btn-class
            button(@click="next")
              .btm {{btnName}}
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'

  // const reginCode = require('../../utils/regincode')

  export default {
    data() {
      return {
        btnName: '就诊人人脸识别',
        name: '就诊人姓名',
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
          name: '',
          nameChild: '',
          bindType: 1, // 绑定类型  0：手机号   1：人脸
          hasIdCard: 1, // 有无身份证 0：无身份证  1：有身份证
          verifyCode: '', // 短信验证码
          address: ''
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
      // 可以继续获取验证码
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
              // self.getNumTime()
            } catch (err) {
              // self.tipStatus = 10
              // setTimeout(
              //   self.hideTip,
              //   3000
              // )
              self.showTip(12)
              console.log('fail')
            }
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
      bindPickerChange2(event) {
        console.log(event.mp.detail)
      },
      bindPickerChange1(event) {
        this.choose1 = this.array1[event.mp.detail.value]
        this.index1 = event.mp.detail.value
        if (event.mp.detail.value === '1') {
          this.isShow1 = true
          this.data.bindType = 1
          this.data.hasIdCard = -1
          // 未选择就诊人状态
          this.chooseType = 4
          this.choose = '请选择要绑定的就诊人类型'
        } else {
          // 手机验证码添加
          this.chooseType = 1
          this.data.bindType = 0
          this.data.hasIdCard = 1
          this.isShow = false
          this.isShow1 = false
          this.name = '就诊人姓名'
          this.btnName = '下一步'
        }
      },
      bindPickerChange(event) {
        this.choose = this.array[event.mp.detail.value]
        this.index = event.mp.detail.value
        this.chooseType = parseInt(event.mp.detail.value) + 1
        if (event.mp.detail.value === '1') {
          // 无身份证的人
          this.data.hasIdCard = 0
          this.chooseType = 2
          this.isShow = true
          this.name = '监护人姓名'
          this.btnName = '监护人人脸识别'
        } else {
          // 有身份证的人
          this.data.hasIdCard = 1
          this.chooseType = 3
          this.isShow = false
          this.name = '就诊人姓名'
          this.btnName = '就诊人人脸识别'
        }
      },
      async noIdCard() {
        // 小孩建档
        let self = this
        console.log(self.data)
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/bindHealthCard',
            data: {
              linkName: self.data.name,
              name: self.data.nameChild,
              bindType: self.data.bindType,
              hasIdCard: self.data.hasIdCard,
              verifyCode: self.data.verifyCode,
              phone: self.data.phone,
              idCardNo: self.data.cardNo,
              relationship: 8,
              patientId: '',
              address: self.data.address
            }
          })
          console.log('success')
          console.log(res)
          wx.showToast({title: '建档成功！'})
          wx.navigateBack({
            delta: 1
          })
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipStatus = 11
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
          } else if (err.errcode === 500) {
            // this.tipStatus = 11
            // this.tipShow = '网络异常，请稍后再试'
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            this.showTip(10)
          }
        }
      },
      async phoneCek() {
        // 通过手机号绑定
        let self = this
        if (self.data.name === '') {
          // self.tipStatus = 0
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(0)
        } else if (self.data.cardNo === '') {
          // self.tipStatus = 1
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(2)
        } else if (self.data.phone === '') {
          // self.tipStatus = 4
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(4)
        } else if (self.data.verifyCode === '') {
          // self.tipStatus = 6
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(6)
        } else {
          self.verifyRequest()
        }
      },
      async verifyRequest() {
        // 校验手机验证码
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/verifycode/verify',
            data: {
              phone: self.data.phone,
              verifyCode: self.data.verifyCode
            }
          })
          console.log('success')
          console.log(res + ',' + res.errcode)
          self.tofile1()
          // 现在版本人脸识别不需要验证手机号
          // if (self.chooseType === 1) {
          //   self.tofile()
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
          //       // if (self.data.hasIdCard === 0) {
          //       //   self.noIdCard()
          //       // } else {
          //       //   self.tofile()
          //       // }
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
        console.log(self.chooseType)
        if (self.chooseType === 1) {
          // 根据不同选项，跳转不同页面
          // 手机验证码添加
          self.phoneCek()
        } else if (self.chooseType === 2) {
          // 无身份证
          self.check()
          // 方便测试，直接跳过人脸识别
          // self.noIdCard()
        } else if (self.chooseType === 3) {
          // 有身份证的人，直接人脸识别
          self.check()
          //  方便测试，直接跳过人脸识别
          // self.tofile()
        } else if (self.chooseType === 0) {
          // self.tipStatus = 8
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(8)
        } else {
          // self.tipStatus = 9
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(9)
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
            self.goCheck()
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
      goCheck() {
        let self = this
        if (self.data.name === '') {
          // self.tipStatus = 0
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(0)
        } else if (self.data.cardNo === '' || (self.data.cardNo.length !== 15 && self.data.cardNo.length !== 18)) {
          // self.tipStatus = 1
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(2)
        } else if ((self.data.phone === '' || self.data.phone.length !== 11) && self.data.hasIdCard === 0) {
          // self.tipStatus = 4
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(4)
        } else if (self.data.address === '' && self.data.hasIdCard === 0) {
          // self.tipStatus = 12
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(11)
        } else if ((self.data.phone === '' || self.data.phone.length !== 11) && self.chooseType === 1) {
          // self.tipStatus = 4
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(4)
        } else if (self.data.verifyCode === '' && self.chooseType === 1) {
          // self.tipStatus = 6
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(6)
        } else if (self.chooseType === 2 && self.data.nameChild === '') {
          // self.tipStatus = 3
          // setTimeout(
          //   self.hideTip,
          //   3000
          // )
          self.showTip(3)
        } else {
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
              // if (self.data.hasIdCard === 0) {
              //   self.noIdCard()
              // } else {
              //   self.tofile()
              // }
            },
            fail(res) {
              RPC.toShow('识别错误！请稍后再试')
              console.log('fail')
              console.log(res)
              console.log(res.errCode)
            },
            checkAliveType: 2
          })
          // 现在版本人脸识别不需要短信验证
          // self.verifyRequest()
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
          console.log('222222222222222222222222222')
          if (self.data.hasIdCard === 0) {
            self.noIdCard()
          } else {
            self.tofile()
          }
        } catch (err) {
          RPC.toShow('识别错误！请稍后再试')
          console.log('fail')
        }
      },
      async tofile() {
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
              url: '../card-file-list/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&type=2'
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
                confirmColor: '#19C1DE',
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
                url: '../card-info-final/main?key=1&cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode
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
      async tofile1() {
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
              url: '../card-file-list/main?cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode + '&type=2'
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
                confirmColor: '#19C1DE',
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
                url: '../card-info-final/main?key=1&cardNo=' + self.data.cardNo + '&name=' + self.data.name + '&phone=' + self.data.phone + '&bindType=' + self.data.bindType + '&hasIdCard=' + self.data.hasIdCard + '&verifyCode=' + self.data.verifyCode
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
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad() {
      // 默认选择人脸识别
      this.index1 = 1
      this.isShow1 = true
      this.data.bindType = 1
      this.choose1 = '人脸识别绑定'
      this.choose = '有身份证的就诊人'
      // 默认选择有身份证
      this.data.hasIdCard = 1
      this.chooseType = 3
      this.isShow = false
      this.name = '就诊人姓名'
      this.btnName = '就诊人人脸识别'
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
        .card
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
                width 400 * rpx
                display inline-block
                margin-lift 32 * rpx
                font-size 16px
                line-height 96 * rpx
            .box-relation-1
              margin-top 1 * rpx
              width 648 * rpx
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
                width 400 * rpx
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
              .phoneNum
                display inline-block
                margin-lift 32 * rpx
                font-size 16px
                line-height 96 * rpx
                color #005DFF
              .txtblue
                color #005DFF
              .txtgray
                color #707070
          .box-2
            .tips
              margin-top 16 * rpx
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
              margin-top 112 * rpx
              margin-bottom 54 * rpx
              button
                width 690 * rpx
                height 88 * rpx
                border-radius 88 * rpx
                background #19C1DE
                line-height 88 * rpx
                .btm
                  color white
</style>
