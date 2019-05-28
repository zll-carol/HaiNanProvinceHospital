<template lang="pug">
  .common
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .box(v-if="activeDisplay1")
      .homepage_bgd
        .homepage_card
          swiper(indicator-dots="true" autoplay="true" interval="5500" duration="1000" indicator-color="#FFFFFF" indicator-active-color="#19C1DE")
            block(v-for="image in imgUrls" :key="image")
              swiper-item
                image.slide-image(:src="image" mode="aspectFit")
      .homepage_user_box
        .homepage_user_infor
          .homepage_user_infor_top(@tap="navigateToSecondPage('../usercenter/main?doctorType='+doctorType)")
            .user_infor_left
              .avatar
                .user-avatar
                  open-data(type="userAvatarUrl")
              .name(v-if="doctorType === 0")
                open-data(type="userNickName")
              .name(v-if="doctorType === 1") {{doctorInfo.doctorName}}
            .user_infor_right
              .usercenter 个人中心
              img.arrow(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
          .homepage_user_infor_bottom(@tap="navigateToSecondPage('../message/main')")
            .warn_left
              img.warn_icon(:src="messageNum==0?'https://nontax-cdn.yuluoo.com/hainanhospital-index-message-no.png':'https://nontax-cdn.yuluoo.com/hainanhospital-index-message-red.png'")
              .warn_des(:style="messageNum==0?'color: #707070':''") {{message}}
            .warn_right
              img.warn_arrow(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
      .homepage_label
        img.homepage_label_img(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_service1.png")
        .homepage_label_des 就医服务
      .homepage_service
        .homepage_service_row
        form(@submit="navigateToSecondPageNew",report-submit="true")
          .service_box
            button.homepage_service_item(formType= "submit", style="margin-top:0")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_onlineCard.png")
              .homepage_service_item_text 在线建档
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../card/main')", style="margin-top:0")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_card.png")
              .homepage_service_item_text 健康卡管理
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../registered-choose-hospital/main')", style="margin-top:0")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_guahao1.png")
              .homepage_service_item_text 预约挂号
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../pay-list/main')", style="margin-top:0")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_pay1.png")
              .homepage_service_item_text 门诊缴费
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../examination-list/main?type=2')")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_examination1.png")
              .homepage_service_item_text 检查调整
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../examination-list/main?type=1')")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_report1.png")
              .homepage_service_item_text 检查报告
          .service_box
            .homepage_service_item(@tap="toAi()")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_AI.png")
              .homepage_service_item_text 智能导诊
          .service_box
            .homepage_service_item(@tap="navigateToVisitHistory")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_visitHistory.png")
              .homepage_service_item_text 历次就诊
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../prepayment-inHospital/main')")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_prepayment1.png")
              .homepage_service_item_text 住院预缴
          .service_box
            .homepage_service_item(@tap="navigateToSecondPage('../drug-post/main')")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_address1.png")
              .homepage_service_item_text 药品配送
          .service_box(@click="showModal")
            .homepage_service_item
              img.homepage_service_item_iqcon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_index_contact.png")
              .homepage_service_item_text 用药咨询
          .service_box
            button.homepage_service_item(open-type="share")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_index_share.png")
              .homepage_service_item_text 分享小程序
      .homepage_label(v-if="doctorType === 1")
        img.homepage_label_img(src="https://nontax-cdn.yuluoo.com/hainanhospital_ysfw.png")
        .homepage_label_des 医生服务
      .homepage_service(v-if="doctorType === 1")
        .homepage_service_row
        form(@submit="brgl",report-submit="true")
          .service_box
            button.homepage_service_item(formType= "submit")
              img.homepage_service_item_icon(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_patientMsg.png")
              .homepage_service_item_text 病人管理
      .homepage_label
        img.homepage_label_img(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_station2.png")
        .homepage_label_des 医院微站
      .homepage_station
        .homepage_station_row
          .homepage_station_item(@tap="navigateToIntroductionPage('../hospital-introduction/main')")
            .homepage_station_item_text 医院简介
          .homepage_station_item(@tap="navigateToIntroductionPage('../hospital-outpatient/main')")
            .homepage_station_item_text 门诊介绍
          .homepage_station_item(@tap="navigateToIntroductionPage('../hospital-department/main')")
            .homepage_station_item_text(style="border:none")  科室介绍
        .homepage_station_row(style="text-align:left")
          .homepage_station_item(@tap="navigateToIntroductionPage('../doctor-list/main')")
            .homepage_station_item_text 名医专家
          .homepage_station_item(@tap="navigateToIntroductionPage('../hospital-guide-list/main?type=2')")
            .homepage_station_item_text 就医指南
      .homepage_label
        img.homepage_label_img(src="https://nontax-cdn.yuluoo.com/hainanhospital_index_icon_news1.png")
        .homepage_label_des 新闻公告
      .homepage_news
        .homepage_new_row(@tap="newInfo(item)",style="padding-top:8px",v-for="item in articleList")
          .homepage_new_item_left {{item.title}}
          text.homepage_new_item_date {{item.publishTime}}
          img.homepage_new_item_arrow(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
        .homepage_new_row_last(@tap="navigateToIntroductionPage('../hospital-guide-list/main?type=1')",:class="[articleList.length==0 ? 'activeClass' : '']")
          .homepage_new_item_last  {{newsMore}}
          .homepage_new_item_last(style="font-size:16px;color:#707070") {{newsTip}}
      .copyright 中国建设银行海南省分行©2018海南玉螺技术支持
    .showModal_box(v-show="showMask")
      .mask_box
      .contact_box
        .top_box
          .content 咨询服务时间为
          .content 9:00-11:00、15:00-17:00
        .bottom_box
          .cancel(@tap="showMaskCancel") 取消
          button.confirm(@tap="showMaskConfirm", open-type="contact", @contact="handleContact") 确定
      .box-1(v-if="!activeDisplay1 && !showMask")
        .bg
        .none
          img(src="https://nontax-cdn.yuluoo.com/hospital-none.png")
          .text 网络开小差了，请稍后重试
          .btm(@tap="allLoad()")
            .text 点击重试
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        showMask: false,
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: true,
        // imgUrls: [
        //   'https://nontax-cdn.yuluoo.com/hainanhospital_xct.png',
        //   'https://nontax-cdn.yuluoo.com/hainanhospital_jh_new_1.png',
        //   'https://nontax-cdn.yuluoo.com/hainanhospital_index_swiper2.png',
        //   'https://nontax-cdn.yuluoo.com/hainanhospital_index_swiper1.png'
        // ],
        imgUrls: [],
        articleList: [],
        listHealthCard: [],
        message: '暂无新消息',
        messageNum: 0,
        newsMore: '',
        newsTip: '',
        shareTicket: '',
        loginType: false,
        doctorType: 0,
        doctorInfo: {}
      }
    },

    computed: {},

    components: {},
    methods: {
      // 网络异常，重新加载
      allLoad() {
        wxAsync.reLaunch({
          url: '/pages/index/main'
        })
      },
      brgl(event) {
        this.saveFormId(event.mp.detail.formId)
        wx.navigateTo({
          url: '../doctor-sever-list/main?doctorInfo=' + JSON.stringify(this.doctorInfo)
        })
      },
      toZf() {
        // 跳转政府服务
        wx.navigateToMiniProgram({
          appId: 'wx1f422bf3ba3cc163',
          path: '/pages/login-xin/login-xin',
          extraData: {
            foo: 'bar'
          },
          envVersion: 'release',
          success(res) {
            // 打开成功
          }
        })
      },
      toAi() {
        // 测试代码，模拟AI导诊打开挂号页面12
        // RPC.JHpay(1, 0.01, '12345687901', 4, this.listHealthCard[0].patientId)
        // 跳转Ai导诊小程序
        wx.navigateToMiniProgram({
          appId: 'wx9a540b5057985f00',
          path: '/pages/index?appid=wx48f009202d9f96a7',
          extraData: {
            foo: 'bar'
          },
          envVersion: 'release',
          success(res) {
            // 打开成功
          }
        })
      },
      newInfo(item) {
        wx.navigateTo({
          url: '../article-info/main?url=' + encodeURIComponent(item.url)
        })
      },
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      showPage() {
        this.activeDisplay1 = true
      },
      hidePage() {
        this.activeDisplay1 = false
      },
      navigateToIndex(event) {
        console.log(event)
      },
      showModal() {
        this.showMask = true
      },
      showMaskConfirm() {
        this.showMask = false
      },
      showMaskCancel() {
        this.showMask = false
      },
      navigateToSecondPageNew(event) {
        console.log(event)
        this.saveFormId(event.mp.detail.formId)
        if (this.listHealthCard.length === 0) {
          wxAsync.navigateTo({
            url: '/pages/card-new-1/main'
          })
        } else {
          wxAsync.navigateTo({
            url: '/pages/card-new/main'
          })
        }
      },
      async saveFormId(formId) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/templatemsg/submitFormId',
            data: {
              formId: formId
            }
          })
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
      navigateToSecondPage(url) {
        if (this.listHealthCard.length === 0) {
          this.openConfirm()
        } else {
          // 住院预缴需要先校验病人是否符合预缴条件
          if (url === '../prepayment-inHospital/main') {
            // 校验
            this.check(url)
          } else {
            wxAsync.navigateTo({
              url: url
            })
          }
          // wxAsync.navigateTo({
          //   url: url
          // })
        }
      },
      navigateToVisitHistory() {
        if (this.listHealthCard.length === 0) {
          this.openConfirm()
        } else {
          wx.navigateTo({
            url: '../visitingHistory-list/main?data=' + JSON.stringify(this.listHealthCard[0])
          })
        }
      },
      navigateToIntroductionPage(url) {
        wxAsync.navigateTo({
          url: url
        })
      },
      async check(url) {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/hospital_prepay/check',
            data: {
              patientId: this.listHealthCard[0].patientId
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.ret === 1) {
            wxAsync.navigateTo({
              url: url
            })
          } else {
            RPC.toShow('您不符合住院预缴条件！')
          }
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async identificationRequest() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/login/wxlogin',
            data: {
            }
          })
          console.log('xxxxxxxx identificationRequest xxxxxxxxxxx res:')
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
      async listHealthCardRequest() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listHealthCard',
            data: {
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          this.listHealthCard = res.data.archivesList
          this.doctorInfo = res.data.doctorInfo
          if (this.doctorInfo.doctorId) {
            console.log(this.doctorInfo)
            this.doctorType = 1
          } else {
            this.doctorType = 0
          }
          try {
            wx.setStorageSync('getHealthCardList', this.listHealthCard)
            wx.setStorageSync('doctorInfo', this.doctorInfo)
            console.log('xxxxxxxxxxxxx setStorage xxxxxx success')
          } catch (err) {
            console.log(err)
          }
          // this.showPage()
        } catch (err) {
          this.hidePage()
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
      async findLatest() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/message/findLatest',
            data: {
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          this.article()
          if (res.data) {
            if (res.data.type === '1') {
              this.message = '【' + res.data.title + '】' + res.data.content
            } else if (res.data.type === '3') {
              this.message = '【' + res.data.title + '】' + JSON.parse(res.data.content).MessageContent
            } else {
            }
            this.messageNum = 1
          } else {
            this.message = '暂无新消息'
            this.messageNum = 0
          }
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
      async openConfirm() {
        try {
          let res = await this.$wx.showModal({
            title: '绑卡提示',
            content: '首次使用请先绑定本人健康卡！',
            confirmText: '去绑卡',
            confirmColor: '#19C1DE',
            cancelText: '取消'
          })
          console.log(res)
          if (res.confirm) {
            // 首次绑卡限制绑定本人的健康卡
            wxAsync.navigateTo({
              url: '/pages/card-new-1/main'
            })
          } else {
            console.log('用户点击取消')
          }
        } catch (err) {
          console.error(err)
        }
      },
      async login() {
        let self = this
        self.loginType = await RPC.login(self)
        if (self.loginType) {
          this.showPage()
          self.listHealthCard = wx.getStorageSync('getHealthCardList')
          self.doctorInfo = wx.getStorageSync('doctorInfo')
          // 获取是否是医生
          if (self.doctorInfo.doctorId) {
            console.log(self.doctorInfo)
            self.doctorType = 1
          } else {
            self.doctorType = 0
          }
          if (self.listHealthCard.length > 0 && self.listHealthCard) {
            console.log('已有健康卡')
          } else {
            self.listHealthCardRequest()
          }
          self.findLatest()
        } else {
          this.hidePage()
        }
      },
      async article() {
        let self = this
        self.articleList = []
        self.newsMore = ''
        self.newsTip = ''
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/article/list',
            data: {
              pageSize: 3,
              page: 1
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          let list = res.data
          for (let i = 0, length = list.length; i < length; i++) {
            list[i].publishTime = list[i].publishTime.substring(5, 10)
          }
          self.articleList = list
          if (self.articleList.length === 0) {
            self.newsTip = '暂无新闻'
          } else {
            self.newsTip = ''
            self.newsMore = '查看更多'
          }
        } catch (err) {
          console.log(err)
          self.newsTip = '暂无新闻'
          self.newsMore = ''
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
      async getBannerRequest() {
        this.imgUrls = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/setting/getBanner',
            data: {
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          for (let i = 0; i < res.list.length; i++) {
            this.imgUrls.push(res.list[i].img)
          }
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
      async getShareRequest() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/setting/getShare',
            data: {
            },
            type: 1
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
      }
    },
    onShow() {
      this.getBannerRequest()
      console.log('onShow')
      let self = this
      if (self.loginType) {
        self.listHealthCard = wx.getStorageSync('getHealthCardList')
        self.doctorInfo = wx.getStorageSync('doctorInfo')
        // 获取是否是医生
        if (self.doctorInfo.doctorId) {
          console.log(self.doctorInfo)
          self.doctorType = 1
        } else {
          self.doctorType = 0
        }
        if (self.listHealthCard.length > 0 && self.listHealthCard) {
          console.log('已有健康卡')
          console.log(self.doctorType)
        } else {
          self.listHealthCardRequest()
        }
        self.findLatest()
      }
    },
    onLoad() {
      this.showMask = false
      this.login()
      wx.showShareMenu({
        withShareTicket: true
      })
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
    background-color #F0EFF5
    position relative
    .common
      margin-top 0
      background-color #F0EFF5
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
      .box
        .copyright
          position absolute
          width 100%
          bottom 32 * rpx
          margin-top 48 * rpx
          text-align center
          color #888C8F
          font-size 22 * rpx
        .homepage_bgd
          height 320 * rpx
          background-color #19C1DE
          .homepage_card
            width 720 * rpx
            display inline-block
            swiper
              height 400 * rpx
              .slide-image
                width 720 * rpx
                height 400 * rpx
            .wx-swiper-dots
              margin-bottom 68 * rpx
        .homepage_user_box
          width 100%
          display inline-block
          text-align center
          margin-top 28 * rpx
          position relative
        .homepage_user_infor
            width 688 * rpx
            display inline-block
            background rgba(255,255,255,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 20 * rpx
            .homepage_user_infor_top
              display inline-block
              position relative
              width 688 * rpx
              height 128 * rpx
              .user_infor_left
                text-align left
                width 432 * rpx
                height 128 * rpx
                margin-top 24 * rpx
                margin-left 32 * rpx
                position absolute
                .avatar
                  size = 80 * rpx
                  width size
                  height size
                  font-size 0
                  display inline-block
                  background rgba(0, 0, 0, 0)
                  border 2 * rpx solid rgba(112,112,112,1)
                  box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
                  border-radius 50%
                  .user-avatar
                    width 80 * rpx
                    height 80 * rpx
                    border-radius 50%
                    overflow hidden
                .name
                  height 44 * rpx
                  margin-top 24 * rpx
                  position absolute
                  display inline-block
                  margin-left 32 * rpx
                  font-size 36 * rpx
                  font-weight bold
                  line-height 44 * rpx
                  color rgba(0,0,0,1)
                  overflow hidden
                  white-space nowrap
                  text-overflow ellipsis
              .user_infor_right
                display inline-block
                height 128 * rpx
                line-height 128 * rpx
                margin-right 32 * rpx
                position absolute
                right 0
                .usercenter
                  font-size 32 * rpx
                  display inline-block
                .arrow
                  width 32 * rpx
                  height 32 * rpx
                  display inline-block
                  margin-bottom -4 * rpx
            .homepage_user_infor_bottom
              display inline-block
              text-align left
              border-top 2 * rpx solid rgba(229,229,229,1)
              width 688 * rpx
              height 64 * rpx
              .warn_left
                display inline-block
                margin-left 32 * rpx
                height 64 * rpx
                margin-top 12 * rpx
                .warn_icon
                  margin-top 4 * rpx
                  display inline-block
                  width 32 * rpx
                  height 32 * rpx
                .warn_des
                  width 490 * rpx
                  margin-left 24 * rpx
                  overflow hidden
                  white-space nowrap
                  text-overflow ellipsis
                  display inline-block
                  font-size 28 * rpx
                  color #FF0000
              .warn_right
                display inline-block
                width 32 * rpx
                height 64 * rpx
                position absolute
                right 64 * rpx
                .warn_arrow
                  margin-top 16 * rpx
                  width 32 * rpx
                  height 32 * rpx
                  display inline-block
        .homepage_label
          width 720 * rpx
          height 96 * rpx
          line-height 96 * rpx
          margin-top 32 * rpx
          text-align left
          display inline-block
          .homepage_label_img
            width 48 * rpx
            height 48 * rpx
            margin-left 16 * rpx
            margin-bottom -6 * rpx
            margin-right 16 * rpx
          .homepage_label_des
            color #000000
            font-size 36 * rpx
            font-weight 800
            display inline-block
        .homepage_service
          width 718 * rpx
          display inline-block
          background rgba(255,255,255,1)
          text-align left
          border-radius 20 * rpx
          padding-bottom 48 * rpx
          .homepage_service_row
            width 720 * rpx
            display inline-block
          form
            button
              border-radius 0
              background #fff
              line-height 1
              padding 0
              &:after
                border none
            .service_box
              display inline-block
              .homepage_service_item
                width 160 * rpx
                margin-top 48 * rpx
                text-align center
                display inline-block
                margin-left 16 * rpx
                img
                  width 112 * rpx
                  height 112 * rpx
                .homepage_service_item_icon1
                  -webkit-filter grayscale(100%)
                  -moz-filter grayscale(100%)
                  -ms-filter grayscale(100%)
                  -o-filter grayscale(100%)
                  filter grayscale(100%)
                  filter gray
                .homepage_service_item_text
                  margin-top 16 * rpx
                  font-size 24 * rpx
        .homepage_station
          width 720 * rpx
          height 208 * rpx
          display inline-block
          background rgba(255,255,255,1)
          border-radius 20 * rpx
          .homepage_station_row
            width 720 * rpx
            margin-top 36 * rpx
            display inline-block
            .homepage_station_item
              width 224 * rpx
              height 44 * rpx
              margin-left 16 * rpx
              text-align center
              display inline-block
              .homepage_station_item_text
                width 224 * rpx
                height 44 * rpx
                line-height 44 * rpx
                font-size 32 * rpx
                border-right 2 * rpx solid rgba(229,229,229,1)
        .homepage_news
          width 720 * rpx
          height auto
          margin-bottom 104 * rpx
          background rgba(255,255,255,1)
          border-radius 20 * rpx
          text-align center
          display inline-block
          .homepage_new_row
            width 656 * rpx
            height 96 * rpx
            line-height 96 * rpx
            display flex
            display -webkit-flex
            justify-content space-around
            margin-left 32 * rpx
            border-bottom 2 * rpx solid rgba(229,229,229,1)
            .homepage_new_item_left
              width 476 * rpx
              margin-right 50 * rpx
              font-size 28 * rpx
              text-align left
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
            .homepage_new_item_date
              font-size 28 * rpx
              color #707070
              display inline-block
              margin-right 16 * rpx
            .homepage_new_item_arrow
              width 32 * rpx
              height 32 * rpx
              margin-top 30 * rpx
          .homepage_new_row_last
            width 656 * rpx
            height 80 * rpx
            bottom 32 * rpx
            line-height 68 * rpx
            text-align center
            display inline-block
            .homepage_new_item_last
              color #005DFF
              font-size 24 * rpx
              margin-top 10 * rpx
              display inline-block
          .activeClass
            pointer-events none
      .showModal_box
        width 100%
        height 100%
        position absolute
        top 0
        text-align center
        .mask_box
          background #000000
          opacity 0.5
          width 100%
          height 100%
          text-align center
        .contact_box
          border-radius 16 * rpx
          width 642 * rpx
          position fixed
          top 50%
          left 0
          margin-left 54 * rpx
          display inline-block
          background #ffffff
          .top_box
            width 642 * rpx
            margin-bottom 50 * rpx
            margin-top 50 * rpx
            text-align center
            .content
              font-size 32 * rpx
              color #6E6E6E
              margin-top 10 * rpx
          .bottom_box
            display flex
            display -webkit-flex
            height 114 * rpx
            line-height 114 * rpx
            border-top 2 * rpx solid #E5E5E5
            .cancel
              width 320 * rpx
              color #000000
              display inline-block
              border-right 2 * rpx solid #E5E5E5
            .confirm
              width 322 * rpx
              color #19C1DE
              display inline-block
              &:after
                border 0
      .box-1
        .bg
          height 320 * rpx
          background linear-gradient(#19C1DE,#F0EFF5)
        .none
          color #9999
          text-align center
          img
            width 322 * rpx
            height 320 * rpx
          .text
            font-size 32 * rpx
            color #707070
          .btm
            display inline-block
            background-color #19C1DE
            margin-top 84 * rpx
            width 238 * rpx
            height 88 * rpx
            border-radius 44 * rpx
            .text
              font-size 36 * rpx
              color white
              line-height 88 * rpx
</style>
