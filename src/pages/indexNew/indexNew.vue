<template lang="pug">
  .page
    .mycontainer
      .box
        .personal-info
          .avatar
            .user-avatar
              open-data(type="userAvatarUrl")
          .name(v-if="login === false")
            open-data(type="userNickName")
          .userName(v-if="login") {{name}}
          .jump-info(@tap.stop="")
            .usercenter {{usercenter}}
      .box
        .function-container
          .personal-info
            .menuName 就医服务
          .function-list
            .item(@tap='gotoHospital(7)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 预约挂号
            .item(@tap='gotoHospital(11)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 检查报告
            .item(@tap='gotoHospital(12)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 检查调整
          .function-list
            .item(@tap='gotoHospital(9)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 门诊缴费
            .item(@tap='gotoHospital(13)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 药品配送
            .item(@tap='gotoHospital(10)')
              .icon
                img(src="https://nontax-cdn.yuluoo.com/wenchangcourt_icon_add.png")
              .desc 健康卡
      .box
        .function-container
          .personal-info
            .menuName 医院概况
          .function-list
            .item-gk(@tap='gotoHospital(1)')
              .desc 医院简介
            .item-gk(@tap='gotoHospital(2)')
              .desc 门诊介绍
            .item-gk(@tap='gotoHospital(3)')
              .desc 科室介绍
          .function-list
            .item-gk(@tap='gotoHospital(4)')
              .desc 名医专家
            .item-gk(@click='gotoHospital(5)')
              .desc 就医指南
            .item-gk(@tap='gotoHospital(6)')
              .desc 新闻公告
    .copyright 海南省人民医院©2018海南玉螺技术支持
</template>

<script>
  export default {
    data() {
      return {
        login: false,
        name: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      gotoHospital(a) {
        let url = ''
        switch (a) {
          case 1:
            url = '../hospital-introduction/main'
            break
          case 2:
            url = '../hospital-outpatient/main'
            break
          case 3:
            url = '../hospital-department/main'
            break
          case 4:
            url = '../doctor-list/main'
            break
          case 5:
            url = '../hospital-guide-list/main?type=1'
            break
          case 6:
            url = '../hospital-guide-list/main?type=2'
            break
          case 7:
            url = '../registered-choose-hospital/main'
            break
          case 8:
            url = '../card/main'
            break
          case 9:
            url = '../pay-list/main'
            break
          case 10:
            url = '../card/main'
            break
          case 11:
            url = '../examination-list/main?type=1'
            break
          case 12:
            url = '../examination-list/main?type=2'
            break
          case 13:
            url = '../examination-list/main?type=2'
            break
          default:
            break
        }
        wx.navigateTo({
          url: url
        })
      }
    },
    onShow() {
      let objMsg = wx.getStorageSync('objMsg')
      wx.getStorage({
        key: 'objMsg',
        success(res) {
          console.log(res)
        }
      })
      console.log(objMsg)
      if (objMsg.name) {
        this.login = true
        this.name = objMsg.name
        this.usercenter = '个人中心'
        this.loginRequest(objMsg)
      }
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
    background gainsboro

  .page
    .banner
      font-size 0
      img
        width 100%
    .copyright
      position absolute
      width 100%
      bottom 10px
      text-align center
      color black
      font-size 11px
    .mycontainer
      margin-top 10px
      text-align center
      .box
        display inline-block
        width 360px
        background #fff
        border-radius 8px
        margin-top 10px
      .healthcard
        padding 13px
        position relative
        display flex
        -webkit-box-align center
        -webkit-align-items center
        align-items center
        .healthcard-all
          font-size 12px
      .personal-info
        padding 13px
        position relative
        display flex
        -webkit-box-align center
        -webkit-align-items center
        align-items center
        .avatar
          size = 30px
          width size
          height size
          font-size 0
          background rgba(0, 0, 0, 0)
          border 0.5px solid rgba(237, 237, 237, 1)
          box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
          border-radius 50%
          .user-avatar
            width 60 * rpx
            height 60 * rpx
            border-radius 50%
            overflow hidden
        .name
          text-align left
          margin-left 16 * rpx
          font-size 16px
          font-weight bold
          width 192 * rpx
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .menuName
          font-size 16px
          color blue
          text-align left
          margin-left 16 * rpx
          font-weight bold
          width 192 * rpx
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .userName
          font-size 16px
          text-align left
          margin-left 16 * rpx
          font-weight bold
          width 192 * rpx
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .jump-info
          padding-right 15px
          position absolute
          margin-left 512 * rpx
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
          .usercenter
            color #000000
      .function-container
        padding 0 16px 25px 16px
        .function-list
          padding-top 25px
          .item
            margin-left 50px
            display inline-block
            text-align center
            &:first-child
              margin-left 0
            .icon
              margin-bottom 10px
              font-size 0
              size = 32px
              width 100%
              img
                width size
                height size
            .desc
              color blue
              font-size 14px
          .item-gk
            margin-left 22%
            display inline-block
            text-align center
            &:first-child
              margin-left 0
            .desc
              color blue
              font-size 14px
</style>
