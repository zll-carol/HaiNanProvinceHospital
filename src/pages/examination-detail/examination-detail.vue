<template lang="pug">
  .main
    .bg
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .examination(v-show="activeDisplay1")
      .examination-top
        .item {{jyData.reportType}}
        .item-time {{reportDate}}
      .examination-bottom
        .detail_left(@click="selected",:data-key="1")
          .result(:class="[ isSelected1 ? 'selectedColor' : '']") 检查结果
          .line(v-if="isSelected1")
          .result_box(v-if="isSelected1 && num ==1")
            .img_part(:style="listImg.list.length==0?'display: none':''")
              .img_box(v-for="(item, index) in listImg.list")
                img.result_img(:src="item",@tap="showImge(index)",v-if="listImg.type == 1")
                img.result_img(src="https://nontax-cdn.yuluoo.com/hainanhospital_xdt_new_1.png",@tap="showImge(index)",v-if="listImg.type == 2")
              <!--.text_box(v-for="(item, index) in listImg.list" v-if="listImg.type == 2" @tap="showImge(index)")-->
                <!--img.text-img(src="https://nontax-cdn.yuluoo.com/hainanhospital_xdt.png")-->
                <!--.text 点击查看-->
            .result_part
              .top {{exResultData[0].title}}
              .bottom {{exResultData[0].content}}
            .result_part1
              .top1
                .left {{exResultData[1].title}}
                .right_box(v-if="data.imageLink === '1'" @tap="showYun()")
                  .right 查看影像
                  img.arrowLeft(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
              .bottom1(style="height:100%;line-height:178%;width:322px") {{exResultData[1].content}}
            .result_part(style="margin-top:8px")
              .top {{exResultData[2].title}}
              .bottom {{exResultData[2].content}}
          .unusual_box(v-if="data.reportClass === '1'", @tap="showUnusual")
            .unusual(v-show="unusual") 显示异常项
            .unusual(v-show="unusual === false") 显示全部
          .jy_box(v-if="isSelected1 && num ==2")
            .jy_part(v-for="(item,index) in jyResultData" :key="index" :style="item.itemFlag==3 || item.itemFlag==6?'background:#FDE9E9':item.itemFlag==2 || item.itemFlag==5?'background:#EFFEF1':''")
              .box(:class="[index === 0 ? 'activeBorder' : '']")
                .item_name {{item.itemName}}
                .item_value
                  .value_left
                    .part_up
                      .value {{item.itemValue}}
                      .unit(v-if="item.unit") ({{item.unit}})
                      img.arrow(v-if="item.itemFlag == '3'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_up_1.png")
                      img.arrow(v-if="item.itemFlag == '6'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_up_1.png")
                      img.arrow(v-if="item.itemFlag == '2'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_down_1.png")
                      img.arrow(v-if="item.itemFlag == '5'", src="https://nontax-cdn.yuluoo.com/hainanhospital_jy_icon_down_1.png")
                    .reference 参考值：{{item.reference}}
                  .value_right(@tap="navigateToHisDetail(item)") 历史结果
        .detail_right(@click="selected",:data-key="2")
          .infor(:class="[ isSelected2 ? 'selectedColor' : '']") 基本信息
          .line(v-if="isSelected2")
          .infor_box(v-if="isSelected2")
            .item
              .left 报告编号
              .right {{jyData.sampleNo}}
            .item
              .left 姓名
              .right {{jyData.patientName}}
            .item
              .left 性别
              .right {{jyData.patientSex}}
            .item
              .left 年龄
              .right {{jyData.patientAge}}
            .item
              .left 检查时间
              .right {{jyData.testDate}}
            .item
              .left 报告时间
              .right {{jyData.reportDate}}
            .item
              .left 申请科室
              .right {{jyData.applySection}}
            .item
              .left 申请医生
              .right {{jyData.sendDoctor}}
            .item
              .left 申请时间
              .right {{jyData.sendDate}}
            .item
              .left 报告技师
              .right {{jyData.reportDoctor}}
            .item
              .left 审核技师
              .right {{jyData.checkDoctor}}
            .item
              .left 机器编码
              .right {{jyData.machineCode}}
            .item
              .left 报告来源
              .right {{jyData.reportOrigin}}
            .item
              .left 检查科室
              .right {{jyData.reportSection}}
</template>

<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        activeDisplay1: false,
        tipShow: '',
        isSelected1: true,
        isSelected2: false,
        num: 2,
        listImg: {list: []},
        data: {},
        exResultData: [],
        jyResultData: [],
        jyData: {},
        sampleType: '',
        peopleData: {},
        reportDate: '',
        unusual: true,
        type: '',
        deptId: ''
      }
    },
    computed: {},
    components: {},
    methods: {
      async showYun() {
        // 查看云胶片
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/getPortraitUrl',
            data: {
              reportId: self.data.id,
              patientId: self.peopleData.patientId
            }
          })
          console.log('xxxxxxxxx  检验报告:')
          console.log(res)
          wx.navigateTo({
            url: '../article-info/main?url=' + encodeURIComponent(res.url)
          })
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
      showImge(index) {
        let self = this
        if (self.listImg.type === 1) {
          wx.previewImage({
            current: self.listImg.list[index], // 当前显示图片的http链接
            urls: self.listImg.list // 需要预览的图片http链接列表
          })
        } else {
          // 1
          // wx.navigateTo({
          //   url: '../article-info/main?url=' + encodeURIComponent(index)
          // })
          // console.log(self.listImg.list[index])
          wxAsync.showLoading({title: '加载中...', mask: true})
          wx.downloadFile({
            url: self.listImg.list[index],
            // filePath: 'wxfile://tmp_1.pdf',
            success: function (res) {
              console.log(res)
              // 返回的文件临时地址，用于后面打开本地预览所用
              let Path = res.tempFilePath
              console.log(Path)
              wxAsync.hideLoading()
              wx.openDocument({
                filePath: Path,
                success: function (res) {
                  console.log('打开成功')
                }
              })
            },
            fail: function (res) {
              wxAsync.hideLoading()
              console.log(res)
            }
          })
        }
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
      showUnusual() {
        this.unusual = !this.unusual
        this.listInspectionDetail()
      },
      navigateToHisDetail(item) {
        wxAsync.navigateTo({
          url: '/pages/chart/main?data=' + JSON.stringify(item) + '&reportDate=' + this.reportDate + '&sampleType=' + this.sampleType + '&type=' + this.type + '&patientId=' + this.peopleData.patientId + '&deptId=' + this.deptId
        })
      },
      selected(event) {
        console.log(event)
        console.log(event.currentTarget.dataset.key)
        if (event.currentTarget.dataset.key === 1) {
          this.isSelected1 = true
          this.isSelected2 = false
        }
        if (event.currentTarget.dataset.key === 2) {
          this.isSelected1 = false
          this.isSelected2 = true
        }
      },
      async listInspectionDetail() {
        let self = this
        self.hidePage()
        self.jyResultData = []
        let patientId = ''
        if (self.type === '1') {
          patientId = wx.getStorageSync('getHealthCardList')[0].patientId
        } else {
          patientId = self.peopleData.patientId
        }
        console.log('xxxxxxxxxx检验报告接口')
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listInspectionDetail',
            data: {
              reportId: self.data.id,
              reportClass: self.data.reportClass,
              reportSubClass: self.data.reportSubClass,
              patientId: patientId,
              type: self.type,
              deptId: self.deptId,
              patientIdDoctor: self.peopleData.patientId
            }
          })
          console.log('xxxxxxxxx  检验报告:')
          console.log(res)
          // 检验报告
          self.jyData = res.data.detail
          self.sampleType = res.data.detail.sampleType
          let data = res.data.inspectionReportList
          if (!self.unusual) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].itemFlag === '3' || data[i].itemFlag === '6' || data[i].itemFlag === '2' || data[i].itemFlag === '5') {
                self.jyResultData.push(data[i])
              }
            }
            console.log('xxxxxxxxxxxxx异常:')
            console.log(self.jyResultData)
          } else {
            self.jyResultData = res.data.inspectionReportList
          }
          // 头部显示报告时间
          self.reportDate = self.jyData.reportDate.substring(0, 10)
          console.log(self.jyData)
          self.num = 2
          self.showPage()
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
      async listCheckDetail() {
        let self = this
        self.hidePage()
        let patientId = ''
        if (self.type === '1') {
          patientId = wx.getStorageSync('getHealthCardList')[0].patientId
        } else {
          patientId = self.peopleData.patientId
        }
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listCheckDetail',
            data: {
              // reportId: '30908475',
              reportId: self.data.id,
              reportClass: self.data.reportClass,
              reportSubClass: self.data.reportSubClass,
              patientId: patientId,
              type: self.type,
              deptId: self.deptId,
              patientIdDoctor: self.peopleData.patientId
            }
          })
          console.log('xxxxxxxxx 检查报告:')
          console.log(res)
          // 检查报告
          self.jyData = res.data.detail
          // 头部显示报告时间
          self.reportDate = self.jyData.reportDate.substring(0, 10)
          self.exResultData = res.data.checkReportList
          if (res.data.reportImgList && res.data.reportImgList.length > 0) {
            let type = 0
            if (res.data.reportImgList[0].indexOf('jpg') > 0) {
              type = 1
            } else {
              type = 2
            }
            self.listImg.type = type
            self.listImg.list = res.data.reportImgList
          }
          console.log('xxxxxx reportDate:')
          // console.log(self.reportDate)
          // console.log(self.jyData)
          console.log(self.listImg)
          self.num = 1
          self.showPage()
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
    onLoad(event) {
      console.log(event)
      this.activeDisplay = false
      this.activeDisplay1 = false
      this.tipShow = ''
      this.isSelected1 = true
      this.isSelected2 = false
      this.num = 2
      this.listImg = {list: []}
      this.data = {}
      this.exResultData = []
      this.jyResultData = []
      this.jyData = {}
      this.peopleData = {}
      this.reportDate = ''
      if (event.data) {
        this.data = JSON.parse(event.data)
        console.log(this.data)
      }
      if (event.peopleData) {
        this.peopleData = JSON.parse(event.peopleData)
        this.peopleData.name = '*' + this.peopleData.name.substring(1, this.peopleData.name.length)
      }
      // type:0 病人查看报告  type：1 医生查看报告
      this.type = event.type
      if (this.type === '1') {
        this.deptId = event.deptId
      }
      if (this.data.reportClass === '1') {
        // 检验报告
        console.log('xxxxxxxx检验报告详情:')
        this.listInspectionDetail()
      } else {
        // 检查报告
        this.listCheckDetail()
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
  page
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
    .examination
      position absolute
      top 16 * rpx
      left 16 * rpx
      padding-bottom 54 * rpx
      .examination-top
        text-align center
        padding-top 24 * rpx
        padding-bottom 24 * rpx
        display inline-block
        width 720 * rpx
        background rgba(255,255,255,1)
        box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
        border-radius 16 * rpx
        .item
          font-size 36 * rpx
          font-weight bold
          margin-left 16 * rpx
          margin-right 16 * rpx
        .item-time
          width 656 * rpx
          margin-top 16 * rpx
          color #707070
          font-size 22 * rpx
          text-align right
      .examination-bottom
        position relative
        text-align center
        margin-top 16 * rpx
        padding-bottom 28 * rpx
        width 720 * rpx
        display flex
        display -webkit-flex
        background rgba(255,255,255,1)
        box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
        border-radius 16 * rpx
        .detail_left
          display inline-block
          width 328 * rpx
          line-height 112 * rpx
          .result
            font-size 32 * rpx
          .selectedColor
            color #19C1DE
          .line
            width 136 * rpx
            height 8 * rpx
            margin-left 95 * rpx
            margin-top -30 * rpx
            border-radius 6 * rpx
            background rgba(25,193,222,1)
          .result_box
            width 720 * rpx
            margin-top 38 * rpx
            .img_part
              display inline-block
              width 656 * rpx
              text-align left
              .img_box
                width 200 * rpx
                height 200 * rpx
                display inline-block
                border-radius 16 * rpx
                margin-right 12 * rpx
                .result_img
                  width 200 * rpx
                  height 200 * rpx
                  border-radius 16 * rpx
              .text_box
                width 200 * rpx
                height 200 * rpx
                display inline-block
                border-radius 16 * rpx
                margin-right 12 * rpx
                background #E5E5E5
                text-align center
                .text-img
                  width 80 * rpx
                  height 80 * rpx
                .text
                  color #FF5722
                  line-height 96 * rpx
                  height 96 * rpx
            .result_part
              text-align left
              .top
                display flex
                display -webkit-flex
                justify-content space-between
                font-size 32 * rpx
                font-weight bold
                padding-left 32 * rpx
                height 70 * rpx
                line-height 70 * rpx
                display inline-block
              .bottom
                font-size 28 * rpx
                color #707070
                padding-left 32 * rpx
                line-height 50 * rpx
            .result_part1
              text-align left
              .top1
                display flex
                display -webkit-flex
                justify-content space-between
                font-size 32 * rpx
                font-weight bold
                margin-left 32 * rpx
                height 80 * rpx
                line-height 80 * rpx
                .left
                  display inline-block
                .right_box
                  display inline-block
                  margin-right 32 * rpx
                  .right
                    color #0042B5
                    font-size 32 * rpx
                    display inline-block
                  .arrowLeft
                    width 20 * rpx
                    height 20 * rpx
              .bottom1
                font-size 28 * rpx
                color #707070
                padding-left 32 * rpx
                line-height 50 * rpx
          .unusual_box
            width 720 * rpx
            height 60 * rpx
            line-height 60 * rpx
            .unusual
              width 150 * rpx
              float right
              margin-right 86 * rpx
              margin-top 22 * rpx
              font-size 26 * rpx
              border-radius 16 * rpx
              border 2 * rpx solid grey
              text-align center
          .jy_box
            width 720 * rpx
            margin-top 38 * rpx
            .jy_part
              .box
                width 656 * rpx
                padding-top 10 * rpx
                padding-bottom 32 * rpx
                display inline-block
                border-top 2 * rpx solid rgba(229,229,229,1)
                .item_name
                  color #0042B5
                  height 64 * rpx
                  line-height 64 * rpx
                  font-size 32 * rpx
                  font-weight bold
                  text-align left
                .item_value
                  display flex
                  display -webkit-flex
                  .value_left
                    display inline-block
                    .part_up
                      display flex
                      display -webkit-flex
                      flex-direction row
                      height 64 * rpx
                      line-height 64 * rpx
                      .value
                        font-size 32 * rpx
                        font-weight bold
                        display inline-block
                      .unit
                        display inline-block
                        margin-left 12 * rpx
                        font-size 22 * rpx
                        color #707070
                      .arrow
                        width 56 * rpx
                        height 56 * rpx
                        display inline-block
                    .reference
                      font-size 22 * rpx
                      color #707070
                      height 32 * rpx
                      line-height 32 * rpx
                      text-align left
                  .value_right
                    display inline-block
                    position absolute
                    right 32 * rpx
                    width 128 * rpx
                    height 52 * rpx
                    line-height 52 * rpx
                    font-size 22 * rpx
                    color #FFFFFF
                    background rgba(25,193,222,1)
                    border-radius 44 * rpx
                    text-align center
              .activeBorder
                border none
        .detail_right
          display inline-block
          width 328 * rpx
          line-height 112 * rpx
          .infor
            margin-left 132 * rpx
            font-size 32 * rpx
          .selectedColor
            color #19C1DE
          .line
            width 136 * rpx
            height 8 * rpx
            margin-top -30 * rpx
            margin-left 164 * rpx
            background rgba(25,193,222,1)
            border-radius 6 * rpx
          .infor_box
            width 720 * rpx
            padding-top 38 * rpx
            position absolute
            left 0
            margin-bottom 64 * rpx
            background rgba(255,255,255,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-bottom-left-radius 16 * rpx
            border-bottom-right-radius 16 * rpx
            .item
              text-align center
              line-height 96 * rpx
              font-size 32 * rpx
              width 656 * rpx
              margin-left 32 * rpx
              border-top 2 * rpx solid rgba(229,229,229,1)
              display flex
              display -webkit-flex
              justify-content space-between
              .right
                width 476 * rpx
                line-height 51 * rpx
                text-align right
                padding-top 22 * rpx
</style>
