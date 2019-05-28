<template lang="pug">
  .main
    .bg
    .drug_box(v-if="!showPopup")
      .cardInfo(@click="choosePeople")
        .text 就诊人
        .text-1 {{peopleData.name}}({{peopleData.outpatientNo}})
      .box-table
        .box_today(@tap="selected(1)",v-show="type === 1")
          .table_today 药品配送
          .line(v-if="type === 1")
        .box_hist(@tap="selected(2)",v-show="type === 2")
          .table_hist 历史配送
          .line(v-if="type === 2")
      .box-list(v-if="type === 1")
        .box-tips
          .text
            .text-1 您有{{list.length}}张处方， {{list.length - deliveryList.length}}张不符合配送，请注意操作！
          .btn(@click="deliveryBtn")
            .text-2 {{deliveryMsg}}
        .none(v-if="list.length == 0 && deliveryMsg === '显示可配送'") 暂无相关信息
        .box(v-if="deliveryMsg === '显示可配送'", v-for="(item, index) in list", @tap="goInfo(item)")
          .item-1(v-if="item.state === '0'", @tap.stop="selectItem(index)")
            img(mode="widthFix", :src="list[index].click?'https://nontax-cdn.yuluoo.com/hospital-post-gou1.png':'https://nontax-cdn.yuluoo.com/hospital-choose-not.png'")
          .item-1(v-if="item.state === '1'")
            img(mode="widthFix", :src="'https://nontax-cdn.yuluoo.com/hainanhospital_icon_nondelivery.png'")
          .item-2
            .item-box-1
              .item-text-1 处方单号
              .item-text-2 就诊医生
              .item-text-2 开单时间
            .item-box-2
              .item-text-3 {{item.prescriptionNo}}
              .item-text-4 {{item.doctorName}}
              .item-text-4 {{item.billTime}}
          .item-3
            .item-3-txt {{item.drugType}}
          .item-3-tip(v-if="item.state === '1'") 不可配送
        .none(v-if="deliveryList.length == 0 && deliveryMsg === '显示全部'") 暂无相关信息
        .box(v-if="deliveryMsg === '显示全部'", v-for="(item, index) in deliveryList", @tap="goInfo(item)")
          .item-1(@tap.stop="selectItem(index)")
            img(mode="widthFix", :src="deliveryList[index].click?'https://nontax-cdn.yuluoo.com/hospital-post-gou1.png':'https://nontax-cdn.yuluoo.com/hospital-choose-not.png'")
          .item-2
            .item-box-1
              .item-text-1 处方单号
              .item-text-2 就诊医生
              .item-text-2 开单时间
            .item-box-2
              .item-text-3 {{item.prescriptionNo}}
              .item-text-4 {{item.doctorName}}
              .item-text-4 {{item.billTime}}
      .box-list-1(v-if="type === 2")
        .none(v-if="list.length == 0") 暂无相关信息
        .box-tips1(v-if="list.length !== 0")
          .text 请将【待交处方】状态的处方单交至新门诊西药房17号窗口！
        .box(v-for="(item, index) in list")
          .box-text
            .text-1 订单号
            .text-2 {{item.orderNo}}
            .text-3(:style="item.status == 1?'border: 1px solid #6B7FA4':item.status == 2?'border: 1px solid #FCA103':item.status == 3?'border: 1px solid #0AD403':item.status == 4?'border: 1px solid #707070':item.status == 5?'border: 1px solid #FF5353':''")
              .text-3-t(:style="item.status == 1?'color: #6B7FA4':item.status == 2?'color: #FCA103':item.status == 3?'color: #0AD403':item.status == 4?'color: #707070':item.status == 5?'color: #FF5353':''") {{item.statusName}}
          .deliveryBox
            .leftBox(@tap="goInfo(item)")
              .box-text-1
                .text-1 就诊人
                .text-2 {{item.receiver}}
              .box-text-2
                .text-1 处方单号
                .text-2
                  .text-21(v-for="(item1, index1) in item.prescriptions") {{item1}}
              .box-text-3
                .text-1 下单时间
                .text-2 {{item.createTime}}
            .rightBox(v-if="item.status === 1")
              canvas(:canvas-id="item.orderNo")
              <!--img.QRcode(@tap="previewImg", :src="list.QRcodeList[index].imagePath", :data-src="list.QRcodeList[index].imagePath")-->
          .item-3
            .item-3-txt {{item.drugType}}
            .item-box-2
              .item-text-3 {{item.prescriptionNo}}
              .item-text-4 {{item.doctorName}}
              .item-text-4 {{item.billTime}}
      .pay-btn(v-if="type === 1")
        img(@tap="chooseAll" mode="widthFix", :src="click?'https://nontax-cdn.yuluoo.com/hospital-post-gou1.png':'https://nontax-cdn.yuluoo.com/hospital-choose-not.png'")
        .text 全选
        .text-btn(@tap="submit", :class="[isSelected ? 'selectedColor' : '']")
          .text-3 配送
    .popup_box(v-if="showPopup")
      .mask_box
      .content_box
        .content_top 配送须知
        .content_center
          .row_box 为确保药品供应质量，保障广大人民群众用药安全有效，本着平等互利的原则，经双方协商一致，达成如下配送协议:
          .row_box 一、乙方严格按照国家有关法律法规的规定，对甲方所需的药品进行配送。
          .row_box 二、乙方应按甲方的供货要求将所需药品及时直接配送到甲方，在配送药品时甲方应当附上随货清单，清单上应标明药品名称、生产厂商、批号、数量、有效期、价格等内容。乙方应该安排专门的人员对所配送的药品进行配送。
          .row_box 三、乙方提供的药品质量应当符合国家标准，包装等应当规范并符合运输要求，整件药品应符合格证,配送进口药品及生物制品时应当附上相关证明文件及资料，储运冷藏药品时需冷链运输，确保药品质量。甲方对不符合国家药品标准的药品、包装破损、进口药品及生物制品缺少相关证明资料的、未按冷链运输的药品可以拒收。
        .content_bottom
          .row_box 甲方：收货人
          .row_box 乙方：顺丰速运
        .btn_box
          .left(@click="cancel") 取消
          .right(@click="agree") 同意
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  import QRcode from '../../utils/qrcode'
  export default {
    data() {
      return {
        chooseList: [],
        list: [],
        click: false,
        isSelected: false,
        showPopup: false,
        peopleData: {},
        type: 1,
        deliveryMsg: '显示可配送',
        deliveryList: []
      }
    },

    computed: {},

    components: {},
    methods: {
      selected(num) {
        if (num === 1) {
          this.type = 1
          this.drugDispatchList()
        }
        if (num === 2) {
          this.type = 2
          this.drugDispatchListDispatch()
        }
      },
      deliveryBtn() {
        if (this.deliveryMsg === '显示可配送') {
          this.deliveryMsg = '显示全部'
        } else {
          this.deliveryMsg = '显示可配送'
        }
      },
      goInfo(item) {
        let url = ''
        if (this.type === 1) {
          url = '../drug-info/main?data='
        } else {
          url = '../post-info/main?data='
        }
        wxAsync.navigateTo({
          url: url + JSON.stringify(item) + '&patientId=' + this.peopleData.patientId
        })
      },
      submit() {
        this.showPopup = true
        if (this.chooseList.length === 0) {
          RPC.toShow('请选择需要配送的药品！')
        } else {
        }
      },
      cancel() {
        this.showPopup = false
      },
      agree() {
        wxAsync.navigateTo({
          url: '../drug-post-info/main?chooseList=' + JSON.stringify(this.chooseList) + '&patientId=' + this.peopleData.patientId + '&deliveryNum=' + this.list.length + '&nonDeliveryNum=' + this.deliveryList.length
        })
      },
      selectItem(index) {
        // 多选
        let self = this
        if (self.list[index].click) {
          self.list[index].click = false
          self.chooseList.splice(index, 1)
          for (let i = 0; i < self.chooseList.length; i++) {
            if (self.chooseList[i].prescriptionNo === self.list[index].prescriptionNo) {
              self.chooseList.splice(i, 1)
            }
          }
        } else {
          self.list[index].click = true
          self.isSelected = true
          self.chooseList.push(self.list[index])
        }
        if (self.chooseList.length === 0) {
          self.isSelected = false
        }
        console.log(self.chooseList)
      },
      // 全选
      chooseAll() {
        let self = this
        if (self.click) {
          self.click = false
          self.isSelected = false
          self.chooseList = []
        } else {
          self.click = true
          self.isSelected = true
          self.chooseList = self.deliveryList
        }
        for (let i = 0, len = self.list.length; i < len; i++) {
          self.list[i].click = self.click
        }
        console.log(self.chooseList)
      },
      async drugDispatchListDispatch() {
        this.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/listDispatch',
            data: {
              // patientId: '9044970',
              patientId: this.peopleData.patientId,
              pageNo: 1,
              pageSize: 50
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          // let obj = {}
          let list = res.data.dispatchList
          // obj.QRcodeList = []
          console.log(list.length)
          for (let i = 0; i < list.length; i++) {
            if (list[i].status === 1) {
              this.createQrCode(list[i].orderNo, list[i].orderNo, 100, 100, i)
              // QRcodeList.push(list[i])
              list[i].statusName = '待交处方'
              list[i].statusName1 = '待交处方'
            } else if (list[i].status === 2) {
              list[i].statusName = '待发货'
              list[i].statusName1 = '药品待发货'
            } else if (list[i].status === 3) {
              list[i].statusName = '已发货'
              list[i].statusName1 = '药品已发货'
            } else if (list[i].status === 4) {
              list[i].statusName = '已签收'
              list[i].statusName1 = '药品已签收'
            } else if (list[i].status === 5) {
              list[i].statusName = '已取消'
              list[i].statusName1 = '已取消'
            } else {
              list[i].statusName = ''
            }
          }
          this.list = list
          console.log('xxxx this.QRcodeList:')
          console.log(this.list)
          // for (let i = 0; i < this.list.QRcodeList.length; i++) {
          //   console.log('xxxx orderNo:')
          //   console.log(this.list.QRcodeList[i].orderNo)
          //   this.createQrCode(this.list.QRcodeList[i].orderNo, this.list.QRcodeList[i].orderNo, 100, 100, i)
          // }
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      async drugDispatchList() {
        let that = this
        that.list = []
        that.deliveryList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/drugDispatch/list',
            data: {
              // patientId: '9044970',
              patientId: that.peopleData.patientId,
              pageNo: 1,
              pageSize: 50
            }
          })
          console.log('xxxxxxxxx getPaymentListRequest:')
          console.log(res)
          let list = res.data.dispatchList
          for (let i = 0; i < list.length; i++) {
            list[i].click = false
          }
          that.list = list
          console.log('xxxxxx全部：')
          console.log(that.list)
          for (let i = 0; i < that.list.length; i++) {
            if (that.list[i].state === '0') {
              that.deliveryList.push(that.list[i])
            }
          }
          console.log('xxxxx可配送：')
          console.log(that.deliveryList)
        } catch (err) {
          console.log(err)
          RPC.toShow(err.errmsg)
        }
      },
      // 生成二维码：
      createQrCode(url, canvasId, cavW, cavH, index) {
        console.log('xxxxx二维码')
        console.log('xxxx url:')
        console.log(url)
        QRcode.api.draw(url, canvasId, cavW, cavH) // 调用插件中的draw方法，绘制二维码图片
        setTimeout(() => {
          this.canvasToTempImage(index, canvasId)
        }, 500)
      },
      /**
       * 获取临时缓存照片路径，存入data中
       */
      canvasToTempImage(index, canvasId) {
        let that = this
        // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          destWidth: 100,
          destHeight: 100,
          fileType: 'jpg',
          quality: 0.9,
          canvasId: canvasId,
          success(res) {
            let tempFilePath = res.tempFilePath
            console.log('xxxxxxxximagePath:')
            console.log(tempFilePath)
            // let imagePath = tempFilePath
            // that.imgArr.push(imagePath)
            // that.list.QRcodeList[index].imagePath = imagePath
            // console.log('xxxxxx  that.QRcodeList:')
            // console.log(that.list)
          },
          fail(res) {
            console.log(res)
          }
        }, that)
      },
      previewImg(event) { // 点击图片进行预览
        wx.previewImage({
          current: event.currentTarget.dataset.src, // 当前显示图片的http链接
          urls: this.imgArr // 需要预览的图片http链接列表
        })
      }
    },
    onShow() {
      this.showPopup = false
      this.chooseList = []
      this.click = false
      this.imgArr = []
      // 是否是缴费成功之后返回此页面
      if (this.$mp.page.data.data) {
        this.type = 2
      }
      if (this.type === 1) {
        this.drugDispatchList()
      } else {
        this.drugDispatchListDispatch()
      }
      // QRcode.clear()
    },
    created() {
    },
    onLoad() {
      this.type = 1
      this.isSelected = false
      this.imgArr = []
      this.peopleData = wx.getStorageSync('getHealthCardList')[0]
      console.log(this.peopleData)
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
      width 100%
      height 100%
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
        padding-bottom 16 * rpx
      .drug_box
        position absolute
        top 16 * rpx
        left 16 * rpx
        height 100%
        .cardInfo
          width 720 * rpx
          height 96 * rpx
          background #fff
          border-radius 8px
          -webkit-box-align center
          -webkit-align-items center
          align-items center
          display flex
          .text
            font-size 16px
            margin-left 32 * rpx
            line-height 96 * rpx
          .text-1
            font-size 16px
            margin-left 40 * rpx
            line-height 96 * rpx
            font-weight bold
          .text-2
            font-size 14px
            margin-left 280 * rpx
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
        .box-table
          width 720 * rpx
          margin-bottom 28 * rpx
          display flex
          display -webkit-flex
          justify-content space-around
          .box_today
            color #fff
            font-size 32 * rpx
            display inline-block
            padding-top 32 * rpx
            .table_today
              display inline-block
            .line
              height 8 * rpx
              width 110 * rpx
              margin-left 10 * rpx
              margin-top 10 * rpx
              background #FFFFFF
              border-radius 16 * rpx
          .box_hist
            color #fff
            font-size 32 * rpx
            padding-top 32 * rpx
            display inline-block
            .table_hist
              display inline-block
            .line
              height 8 * rpx
              width 110 * rpx
              margin-top 10 * rpx
              margin-left 10 * rpx
              background #FFFFFF
              border-radius 16 * rpx
        .none
          color #9999
          padding-top 50%
          text-align center
        .box-list
          width 720 * rpx
          overflow-y auto
          overflow-x hidden
          padding-bottom 294 * rpx
          .box-tips
            margin-top 16 * rpx
            width 720 * rpx
            height 80 * rpx
            background-color #fff
            border-radius 8 * rpx
            .text
              margin-left 32 * rpx
              display inline-block
              width 474 * rpx
              .text-1
                line-height 80 * rpx
                font-size 22 * rpx
                color #F10000
            .btn
              margin-left 32 * rpx
              display inline-block
              width 150 * rpx
              height 48 * rpx
              background-color #19C1DE
              border-radius 24 * rpx
              text-align center
              .text-2
                line-height 48 * rpx
                font-size 22 * rpx
                color #FFFFFF
          .none
            color #9999
            padding-top 50%
            text-align center
          .box
            width 720 * rpx
            height 208 * rpx
            margin-top 16 * rpx
            border-radius 16 * rpx
            background-color #fff
            display flex
            position relative
            .item-1
              display inline-block
              width 64 * rpx
              height 64 * rpx
              margin-left 16 * rpx
              margin-top 16 * rpx
              img
                width 100%
                height 100%
            .item-2
              display inline-block
              width auto
              height auto
              margin-top 8 * rpx
              .item-box-1
                display inline-block
                .item-text-1
                  margin-top 24 * rpx
                  font-size 28 * rpx
                  color #707070
                .item-text-2
                  margin-top 16 * rpx
                  font-size 28 * rpx
                  color #707070
              .item-box-2
                display inline-block
                margin-left 64 * rpx
                .item-text-3
                  margin-top 24 * rpx
                  font-size 28 * rpx
                .item-text-4
                  margin-top 16 * rpx
                  font-size 28 * rpx
            .item-3
              display inline-block
              position absolute
              width 124 * rpx
              height 48 * rpx
              right 32 * rpx
              margin-top 20 * rpx
              border 2 * rpx solid #707070
              border-radius 16 * rpx
              text-align center
              .item-3-txt
                line-height 48 * rpx
                color #707070
                font-size 28 * rpx
            .item-3-tip
              color #FF5454
              font-size 22 * rpx
              position absolute
              top 96 * rpx
              right 48 * rpx
        .box-list-1
          width 100%
          margin-top 26 * rpx
          padding-bottom 70 * rpx
          .box-tips1
            margin-top 16 * rpx
            width 720 * rpx
            background-color #fff
            border-radius 8 * rpx
            .text
              margin 20 * rpx  0  20 * rpx 32 * rpx
              display inline-block
              line-height 1.5
              font-size 25 * rpx
              color #F10000
          .none
            color #9999
            padding-top 50%
            text-align center
          .box
            margin-top 16 * rpx
            width 720 * rpx
            height auto
            background white
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .box-text
              height 96 * rpx
              width 648 * rpx
              margin-left 32 * rpx
              border-bottom 2 * rpx solid #E5E5E5
              line-height 96 * rpx
              display flex
              display -webkit-flex
              justify-content space-between
              .text-1
                display inline-block
                font-weight bold
                font-size 30 * rpx
              .text-2
                display inline-block
                font-weight bold
                font-size 30 * rpx
              .text-3
                display inline-block
                margin-top 22 * rpx
                height 50 * rpx
                border 2 * rpx solid #FCA103
                border-radius 16 * rpx
                text-align center
                .text-3-t
                  padding 0 12 * rpx 0 12 * rpx
                  line-height 50 * rpx
                  font-size 24 * rpx
                  color #FCA103
            .deliveryBox
              display flex
              display -webkit-flex
              position relative
              .leftBox
                display inline-block
                .box-text-1
                  height 88 * rpx
                  width 648 * rpx
                  margin-left 32 * rpx
                  line-height 88 * rpx
                  position relative
                  .text-1
                    display inline-block
                    font-size 14px
                    color #707070
                  .text-2
                    position absolute
                    left 176 * rpx
                    top 5 * rpx
                    display inline-block
                    font-size 14px
                    color #707070
                .box-text-2
                  height auto
                  width 648 * rpx
                  margin-left 32 * rpx
                  display flex
                  position relative
                  .text-1
                    display inline-block
                    font-size 14px
                    color #707070
                  .text-2
                    margin-left 62 * rpx
                    display inline-block
                    .text-21
                      font-size 14px
                      color #707070
                .box-text-3
                  height 96 * rpx
                  width 648 * rpx
                  margin-left 32 * rpx
                  line-height 96 * rpx
                  position relative
                  .text-1
                    display inline-block
                    font-size 14px
                    color #707070
                  .text-2
                    position absolute
                    left 176 * rpx
                    top 5 * rpx
                    display inline-block
                    font-size 14px
                    color #707070
              .rightBox
                display inline-block
                position absolute
                right 32 * rpx
                top 12 * rpx
                .QRcode
                  width 200 * rpx
                  height 200 * rpx
                canvas
                  width 200 * rpx
                  position absolute
                  top 0
                  right -22 * rpx
        .pay-btn
          width 750 * rpx
          height 112 * rpx
          background-color #fff
          display flex
          position fixed
          margin-top 422 * rpx
          bottom 0
          left 0
          z-index 999
          img
            display inline-block
            width 64 * rpx
            height 64 * rpx
            margin-left 32 * rpx
            margin-top 26 * rpx
          .text
            line-height 112 * rpx
            display inline-block
            font-size 16px
          .text-1
            line-height 112 * rpx
            color #707070
            display inline-block
            font-size 16px
            margin-left 96 * rpx
          .text-2
            line-height 112 * rpx
            color #006FFF
            display inline-block
            font-size 16px
          .text-btn
            display inline-block
            width 192 * rpx
            height 80 * rpx
            position absolute
            top 16 * rpx
            right 30 * rpx
            text-align center
            border-radius 16 * rpx
            background-color #19C1DE
            opacity 0.5
            pointer-events none
            .text-3
              color white
              line-height 80 * rpx
              font-size 32 * rpx
          .selectedColor
            opacity 1
            pointer-events auto
      .popup_box
        width 100%
        height 100%
        position absolute
        top 0
        text-align center
        .mask_box
          background #000000
          opacity 0.5
          width 100%
          height 1350 * rpx
        .content_box
          width 656 * rpx
          position absolute
          top 98 * rpx
          left 48 * rpx
          display inline-block
          background rgba(255,255,255,1)
          border-radius 16 * rpx
          .content_top
            width 576 * rpx
            height 126 * rpx
            line-height 126 * rpx
            font-size 40 * rpx
            font-weight bold
            color #000000
            display inline-block
            text-align left
          .content_center
            display inline-block
            font-size 28 * rpx
            color #000000
            .row_box
              width 576 * rpx
              text-align left
              line-height 1.5
          .content_bottom
            width 576 * rpx
            text-align left
            margin-top 16 * rpx
            margin-bottom 32 * rpx
            display inline-block
            .row_box
              font-size 28 * rpx
              line-height 1.5
          .btn_box
            width 656 * rpx
            height 112 * rpx
            line-height 112 * rpx
            font-size 36 * rpx
            border-top 2 * rpx solid rgba(229,229,229,1)
            .left
              width 320 * rpx
              color #000000
              display inline-block
              border-right 2 * rpx solid rgba(229,229,229,1)
            .right
              width 320 * rpx
              color #19C1DE
              display inline-block
</style>
