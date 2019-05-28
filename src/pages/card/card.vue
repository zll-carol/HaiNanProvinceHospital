<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .card_box
      .box-1
        .text 温馨提示：选择健康卡，更换当前生效的就诊人。
      .box(@tap='gotoCardInfo(item)', v-for="(item,index) in list", :style="item.isDefault==1 ? bgimg : index==(list.length - 1) ? displayMargin : ''")
        .card-gou
          .gou(@tap.stop="tosetMr(item)")
            img(:src="item.isDefault==1?'https://nontax-cdn.yuluoo.com/hospital-card-gou.png':'https://nontax-cdn.yuluoo.com/hospital-card-not.png'")
        .card-text
          .name-rav
            .name {{item.name}}
            .rav （{{bindTypeList[item.relationship]}}）
            .now(v-if="item.type==1") 调试
          .num 门诊号 {{item.outpatientNo}}
        .card-btn
          .btn-1(@tap.stop="delCard(item)")
            img(src="https://nontax-cdn.yuluoo.com/hospital-card-del.png")
      .btn-class
        button(@tap="gotoCard")
          .btm 在线建档
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        displayMargin: 'margin-bottom:340px',
        bgimg: 'background-image: url(https://nontax-cdn.yuluoo.com/hospital-card-background.png)',
        bindTypeList: {},
        list: [],
        login: false,
        name: '',
        userCenter: '个人中心'
      }
    },

    computed: {},

    components: {},
    methods: {
      showTip() {
        this.activeDisplay = true
      },
      hideTip() {
        this.activeDisplay = false
      },
      gotoCard() {
        let url = ''
        if (this.list.length > 0) {
          url = '../card-new/main'
        } else {
          url = '../card-new-1/main'
        }
        wxAsync.navigateTo({
          url: url
        })
      },
      async tosetMr(item) {
        let self = this
        if (item.isDefault === 0) {
          try {
            let res = await RPC.request({
              url: '/HospitalFormApi/archive/setDefault',
              data: {
                cardId: item.id,
                type: item.type
              },
              type: 1
            })
            console.log('success')
            console.log(res)
            RPC.toShow('就诊人切换为' + item.name + '(' + item.outpatientNo + ')')
            self.listHealthCardRequest()
          } catch (err) {
            console.log(err)
            if (err.errcode === 400) {
              RPC.toShow(err.errmsg)
              // this.tipShow = err.errmsg
              // setTimeout(
              //   this.hideTip,
              //   3000
              // )
              // this.showTip()
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
      setMr(item) {
        let self = this
        wx.showModal({
          title: '设置默认就诊人',
          content: '是否确定设置默认就诊人？',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            console.log(res)
            if (res.confirm) {
              console.log('用户点击确定')
              self.tosetMr(item)
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      delCard(item) {
        let self = this
        wx.showModal({
          title: '解绑健康卡',
          content: '删除后将不再显示健康卡，是否确定解绑？',
          confirmText: '确认',
          cancelText: '取消',
          confirmColor: '#19C1DE',
          cancelColor: '#000000',
          success(res) {
            console.log(res)
            if (res.confirm) {
              console.log('用户点击确定')
              self.todelCard(item)
            } else {
              console.log('用户点击取消')
            }
          }
        })
      },
      gotoCardInfo(item) {
        wxAsync.navigateTo({
          url: '../card-info/main?data=' + JSON.stringify(item)
        })
      },
      async todelCard(item) {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/unbindHealthCard',
            data: {
              cardId: item.id,
              type: item.type
            }
          })
          console.log('success')
          console.log(res)
          wx.showToast({title: '解绑成功！'})
          self.listHealthCardRequest()
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listHealthCard',
            data: {
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          self.list = res.data.archivesList
          try {
            wx.setStorageSync('getHealthCardList', self.list)
            wx.setStorageSync('doctorInfo', res.data.doctorInfo)
            console.log('xxxxxxxxxxxxx setStorage xxxxxx success')
          } catch (err) {
            console.log(err)
          }
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
      async loadRelation() {
        let self = this
        // 读取关系表
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listRelationship',
            data: {
            }
          })
          console.log('success')
          console.log(res)
          let bindType = res.data.bindTypeList
          for (let i = 0, len = bindType.length; i < len; i++) {
            self.bindTypeList[bindType[i].code] = bindType[i].name
          }
          self.listHealthCardRequest()
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // this.tipShow = err.errmsg
            // setTimeout(
            //   this.hideTip,
            //   3000
            // )
            // this.showTip()
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
      this.loadRelation()
    },
    onLoad() {
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
    height 100%
    background #19C1DE
    .main
      width 100%
      height 100%
      overflow hidden
      background #F0EFF5
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
      .card_box
        position absolute
        top 16 * rpx
        .box-1
          margin-top 16 * rpx
          width 720 * rpx
          height 64 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          background-size 100% 100%
          display flex
          .text
            margin-top 16 * rpx
            margin-left 32 * rpx
            font-size 24 * rpx
            color #037E93
        .box
          margin-top 16 * rpx
          width 720 * rpx
          height 160 * rpx
          background #fff
          border-radius 8px
          margin-left 16 * rpx
          background-size 100% 100%
          display flex
          .card-gou
            height 160 * rpx
            width 96 * rpx
            display inline-block
            .gou
              margin-left 16 * rpx
              margin-top 48 * rpx
              width 64 * rpx
              height 64 * rpx
              img
                width 100%
                height 100%
          .card-text
            height 160 * rpx
            width 600 * rpx
            display inline-block
            .name-rav
              margin-top 34 * rpx
              margin-left 16 * rpx
              .name
                display inline-block
                font-size 19px
                font-weight bold
              .rav
                display inline-block
                font-size 12px
              .now
                margin-left 16 * rpx
                display inline-block
                font-size 12px
                color #19C1DE
            .num
              margin-top 10 * rpx
              margin-left 16 * rpx
              font-size 12 px
          .card-btn
            width 160 * rpx
            height 160 * rpx
            display inline-block
            .btn-1
              margin-top 64 * rpx
              margin-right 46 * rpx
              float right
              width 32 * rpx
              height 32 * rpx
              img
                width 100%
                height 100%
        .btn-class
          width 690 * rpx
          height 88 * rpx
          position fixed
          bottom 54 * rpx
          left 32 * rpx
          button
            width 690 * rpx
            height 88 * rpx
            position fixed
            bottom 54 * rpx
            left 32 * rpx
            border-radius 88 * rpx
            background #19C1DE
            line-height:88 * rpx
            .btm
              color white
</style>
