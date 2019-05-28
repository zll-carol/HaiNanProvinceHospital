<template lang="pug">
  <view class='login'>
    <form class='login-form' @submit='formSubmit' report-submit='true'>
       <view class='weui-cells '>
          <view class="weui-cell weui-cell_input">
            <view class= "weui-cell__hd">
              <view class="weui-label"> 姓名 </view>
            </view>
            <view class="weui-cell__bd">
              <input class="weui-input" type='text' v-model.lazy='name' placeholder="请输入姓名"/>
            </view>
          </view>
          <view class="line"></view>
          <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">身份证号</view>
            </view>
            <view class="weui-cell__bd" >
              <input class="weui-input" type='idcard' v-model.lazy='personalId' placeholder="请输入身份证号"/>
            </view>
          </view>
       </view>
       <view class='weui-tips'>
        <input type="" placeholder="" name="">
          <text> 温馨提示：</text>
          <text style="margin-top:7px"> 实名登录有效期为 7 天，超出后再次进入需重新进行实名登录。</text>
       </view>
       <button formType="submit" hover-class="none" class="btn">下一步</button>
    </form>
    <view class='bottom'>
       <text>文昌法院©2018海南玉螺技术支持</text>
    </view>
  </view>
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        name: null,
        personalId: null
      }
    },

    components: {},

    methods: {
      goCheck(param) {
        let that = this
        let userMsg = param
        console.log(param)
        wx.startFacialRecognitionVerify({
          name: userMsg.name,
          idCardNumber: userMsg.personalId,
          success(res) {
            let obj = {
              name: userMsg.name,
              idCardNumber: userMsg.personalId,
              verify_result: res.errCode
            }
            console.log('success')
            console.log(res)
            console.log(res.errCode)
            that.loginRequest(res.errCode)
            if (res.errCode === 0) {
              wx.setStorageSync('objMsg', obj)
              wxAsync.navigateTo({
                url: '../index/main'
              })
            }
          },
          fail(res) {
            console.log('fail')
            console.log(res)
            console.log(res.errCode)
          }
        })
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/onlinecourt/user/saveFormId',
            data: {
              formId: formId
            }
          })
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      },
      formSubmit(event) {
        // console.log(e.detail)
        // console.log(e.detail.formId)
        this.saveFormId(event.mp.detail.formId)
        let obj = {
          name: this.name,
          personalId: this.personalId
        }
        console.log(obj.name)
        this.check(obj)
      },
      async loginRequest(code) {
        try {
          let res = await RPC.request({
            url: '/onlinecourt/identification/bind',
            data: {
              'name': this.name,
              'id_card_number': this.personalId,
              'verify_result': code
            }
          })
          console.log('success')
          console.log(res)
        } catch (err) {
          console.log('fail')
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
      async check(params) {
        let that = this
        try {
          let res = await this.wxChcekIsSupportFacialRecognition()
          console.log(res)
          let okMsg = 'checkIsSupportFacialRecognition:ok'
          if (res.errMsg === okMsg) {
            setTimeout(
              function () {
                that.goCheck(params)
              },
              1000)
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
      }
    },

    created() {
    }
  }
</script>

<style lang="stylus">
   rpxf()
     1rpx

   rpx = rpxf()

  page {
    background-color: #EFEFF4;
  }

  .login {
    background-color: #EFEFF4;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .weui-cells {
    width: 720  * rpx;
    height: 192  * rpx;
    margin: 16 * rpx auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 16  * rpx;
    box-shadow: 0  * rpx 6  * rpx 12  * rpx rgba(0, 0, 0, 0.05);
    line-height: 1.41176471;
    font-size: 17px;
  }

  .weui-cells::before {
    border: none;
  }

  .weui-cells::after {
    border: none;
  }

  .weui-cells .line {
    width: 656  * rpx;
    height: 0;
    border: 1  * rpx solid #E5E5E5;
    margin: 0 auto;

  }

  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-top: -6 * rpx;
  }

  .weui-label {
    width: 105px;
    word-wrap: break-word;
    word-break: break-all;
  }

  .weui-cell_input {
    padding-top: 0;
    padding-bottom: 0;
  }

  input {
    display: block;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    font-family: UICTFontTextStyleBody;
  }

  .weui-tips {
    color: #007FFF;
    font-size: 24  * rpx;
    position: absolute;
    top: 200  * rpx;
    left: 32  * rpx;
  }

  .weui-tips input {
    display: none;
  }

  .weui-tips text {
    display: block;
    margin-top: 32  * rpx;
  }

  .weui-cell_input {
    line-height: 96  * rpx;
  }

  .login-form .btn {
    background-color: #007FFF;
    width: 720  * rpx;
    height: 88  * rpx;
    color: #FFFFFF;
    margin-top: 150  * rpx;
    border-radius: 44  * rpx;
  }

  .login .bottom {
    font-size: 22  * rpx;
    color: #888C8F;
    text-align: center;
    position: absolute;
    bottom: 20  * rpx;
    left: 201  * rpx;
  }
</style>
