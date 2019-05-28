<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
    .visitingHistory(v-show=" activeDisplay1")
      .top
        .item(@click="activeColor(1)",:class="num == 1 ? 'color1' : 'color2'") 费用
        <!--.item(@click="activeColor(2)",:class="num == 2 ? 'color1' : 'color2'") 病历-->
        .item(@click="activeColor(3)",:class="num == 3 ? 'color1' : 'color2'") 处方
        .item(@click="activeColor(4)",:class="num == 4 ? 'color1' : 'color2'") 检验检查
      .fee(v-if="num == 1")
        .fee-list
          .fee-item_fee(style="padding-bottom:16px")
            .title_tag
              .tag_left(@click="activeFee(1)",:class="feeNum == 1 ? '' : 'tag_left2'")
                .des 费用概况
                .line(v-if="feeNum == 1")
              .tag_right(@click="activeFee(2)",:class="feeNum == 2 ? '' : 'tag_right'")
                .menu 费用清单
                .line(v-if="feeNum == 2")
            .tagLeft_content(v-if="feeNum == 1")
              .total_fee
                .left 总费用
                .right {{totalFee}}元
              .total_fee_row
                .total_fee_details(v-for="(item,index3) in totalList" style="margin-left:16px")
                  .left {{item.ReceiptName}}
                  .right {{item.typeTotalFee}} 元
            .tagRight_content(v-if="feeNum == 2")
              .total_fee
                .left 总费用
                .right {{totalFee}} 元
              .fee-menu(@tap="showItem(index)" v-for="(item,index) in totalList1")
                .menu-item
                  .left {{item.GroupName}}
                  .right {{item.ActualMoney}} 元
                  img.arrow(v-if="totalList1[index].objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName)" :src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png': 'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png'")
                .display_show_fee(v-if="index==showNum&&(item.objList.length>1||(item.objList.length==1&&item.GroupName!=item.objList[0].ItemName))")
                  .list_fee(v-for="(item1,index1) in item.objList")
                    .left {{item1.ItemName}}
                    .right {{item1.ActualMoney}} 元
      <!--.fee(v-if="num == 2")-->
        <!--.fee-list(style="margin-top:8px;padding-bottom:32px")-->
          <!--.history-item-->
            <!--.history_row-->
              <!--.history_left 医生-->
              <!--.history_right {{listData.Doctor}}-->
            <!--.history_row-->
              <!--.history_left 就诊时间-->
              <!--.history_right {{listData.JZTime}}-->
          <!--.fee-item-->
            <!--.item_des 主诉：-->
            <!--.content {{content0}}-->
            <!--.item_des 现病史：-->
            <!--.content {{content1}}-->
            <!--.item_des 既往史：-->
            <!--.content {{content2}}-->
            <!--.item_des 家族史：-->
            <!--.content {{content3}}-->
            <!--.item_des 体格检查：-->
            <!--.content {{content4}}-->
            <!--.item_des 处理：-->
            <!--.content {{content5}}-->
            <!--.item_des 诊断：-->
            <!--.content {{listData.Diagnosis}}-->
      .fee(v-if="num == 3")
        .fee-list(v-for="(item,index) in cfList")
          .fee-item(style="bottom 16 * rpx")
            .item_row
              .item_left 处方单号
              .item_right {{item.PrescriptionNo}}
            .item_row
              .item_left 临床诊断
              .item_right {{listData.Diagnosis}}
          <!--.fee-item(@tap="showItem(index)" style="margin-top:13px;border-top:1px solid rgba(229,229,229,1);text-align:left")-->
            <!--.left(style="font-weight:bold;color:#000000") 处方详情-->
            <!--img.arrow(:src="showNum==index?'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_down.png':'https://nontax-cdn.yuluoo.com/hainanhospital_usercenter_icon_arrow_up.png'")-->
          .display_show(style="padding-bottom:0")
            .show_item
              <!--.title(style="margin-right:74px;margin-left:0") 药品-->
              <!--.title(style="margin-right:55px") 单量-->
              <!--.title(style="margin-right:30px ") 规格-->
              <!--.title(style="margin-right:0") 用量-->
              .show_name
                .title(style="width: 182px") 药品
                .title 单量
                .title 规格
                .title(style="width:50px") 用量
            .show_box(v-for="(item1,index1) in item.list" :class="index1===0 ? 'hiddenBorder' : ''")
              .show_dug(v-for="(item2,index2) in item1.list")
                .dug_des(style="width: 182px") {{item2.DrugName}}
                .dug_des {{item2.DrugPerUnit}}
                .dug_des {{item2.DrugSpec}}
                .dug_des(style="width:50px") {{item2.DrugTotal}}
              .dug_methods
                .left_methods 用法用量：
                .right_methods {{item1.DrugDosage}}, {{item1.DrugFrequency}}, {{item1.DrugDays}}
          .fee-item-bom
            .item_row-bom
              .item_left-bom 医生
              .item_right-bom {{item.Doctor}}
            .item_row-bom
              .item_left-bom 就诊时间
              .item_right-bom {{item.OrderTime}}
          <!--img.showImg(v-if="index==showNum" src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_wave.png")-->
      .fee(v-if="num == 4")
        .fee-list(@tap="navigateToDetail(item)" style="padding-bottom:16px" v-for="(item, index) in inspectionReportList" :class="[index%2 === 0 ? 'activeBackground' : '']")
          .fee-item
            .report {{item.name}}
            .time
              .time-left 检查时间
              .time-right {{item.time}}
</template>
<script>
  import wxAsync from '../../utils/wxapipromisify'
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        activeDisplay1: true,
        num: 1,
        feeNum: 1,
        showNum: -1,
        totalList: [],
        totalList1: [],
        content0: '',
        content1: '',
        content2: '',
        content3: '',
        content4: '',
        content5: '',
        cfList: [],
        inspectionReportList: [],
        peopleList: '',
        peopleData: '',
        listData: [],
        totalFee: 0
      }
    },
    computed: {},
    methods: {
      activeFee(feeNum) {
        if (feeNum === 1) {
          this.feeNum = 1
        }
        if (feeNum === 2) {
          this.feeNum = 2
        }
      },
      activeColor(num) {
        this.cfList = []
        this.showNum = -1
        this.content0 = ''
        this.content1 = ''
        this.content2 = ''
        this.content3 = ''
        this.content4 = ''
        this.content5 = ''
        this.inspectionReportList = []
        if (num === 1) {
          this.num = 1
        }
        if (num === 2) {
          this.getCRF()
        }
        if (num === 3) {
          this.getRecipe()
          this.num = num
        }
        if (num === 4) {
          this.listInspectionReport()
          this.num = num
        }
      },
      showItem(index) {
        if (this.showNum === index) {
          this.showNum = -1
        } else {
          this.showNum = index
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
      navigateToDetail(item) {
        wx.navigateTo({
          url: '../examination-detail/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData)
        })
      },
      // 费用：
      async getFeeHis() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/bill/getBillPayed',
            data: {
              PatientID: this.peopleData.patientId,
              // PatientID: 9415048,
              // PatientID: 7631414,
              // PatientID: 2531,
              RegisterNo: this.listData.RegisterNo
            }
          })
          console.log('success')
          console.log(res)
          let data = res.List
          // let dataList = []
          let fee = 0
          // for (let i = 0; i < data.length; i++) {
          //   // console.log(data[i].fee)
          //   fee += Number(data[i].fee)
          //   this.totalFee = RPC.toDecimal2(fee)
          //   dataList.push(data[i].Items)
          //   for (let k = 0; k < dataList[i].length; k++) {
          //     this.totalList.push(dataList[i][k])
          //     // console.log(dataList[i])
          //   }
          // }
          // 处理数据，组成新的列表
          // 费用概况列表   按照ReceiptName区分 [ReceiptName:'';objList:[]]
          let a = []
          // 费用清单列表   按照GroupID区分 GroupName 格式[GroupName:'';objList:[]]
          let b = []
          for (let i = 0; i < data.length; i++) {
            fee += Number(data[i].fee)
            this.totalFee = RPC.toDecimal2(fee)
            let data1 = data[i].Items
            for (let k = 0; k < data1.length; k++) {
              let flag1 = false
              for (let m = 0; m < a.length; m++) {
                if (a[m].ReceiptName === data1[k].ReceiptName) {
                  flag1 = true
                  // 计算总金额
                  a[m].typeTotalFee = RPC.toDecimal2(Number(a[m].typeTotalFee) + Number(data1[k].typeTotalFee))
                  if (a[m].objList === undefined) {
                    a[m].objList = []
                    a[m].objList.push(data1[k])
                  } else {
                    a[m].objList.push(data1[k])
                  }
                }
              }
              if (!flag1) {
                let a1 = {}
                a1.ReceiptName = data1[k].ReceiptName
                a1.typeTotalFee = data1[k].typeTotalFee
                if (a1.objList === undefined) {
                  a1.objList = []
                  a1.objList.push(data1[k])
                } else {
                  a1.objList.push(data1[k])
                }
                a.push(a1)
              }
              // 继续处理b数组
              let data2 = data1[k].FeeList
              for (let n = 0; n < data2.length; n++) {
                let flag2 = false
                for (let p = 0; p < b.length; p++) {
                  if (b[p].GroupID === data2[n].GroupID && b[p].GroupName === data2[n].GroupName) {
                    flag2 = true
                    b[p].ActualMoney = RPC.toDecimal2(Number(b[p].ActualMoney) + Number(data2[n].ActualMoney))
                    if (b[p].objList === undefined) {
                      b[p].objList = []
                      b[p].objList.push(data2[n])
                    } else {
                      b[p].objList.push(data2[n])
                    }
                  }
                }
                if (!flag2) {
                  let b1 = {}
                  b1.GroupName = data2[n].GroupName
                  b1.GroupID = data2[n].GroupID
                  b1.ActualMoney = data2[n].ActualMoney
                  if (b1.objList === undefined) {
                    b1.objList = []
                    b1.objList.push(data2[n])
                  } else {
                    b1.objList.push(data2[n])
                  }
                  b.push(b1)
                }
              }
            }
          }
          console.log('xxxxxx a  b 数组:')
          // a数组按照typeTotalFee来排序
          // b数组按照GroupID来排序
          // if (a.length > 0) {
          //   let a = {}
          //   for (let i = 0; i < a.length; i++) {
          //
          //   }
          //   let a1 = a[0].typeTotalFee
          // }
          a.sort(this.compare('typeTotalFee', 1))
          b.sort(this.compare('GroupID', 2))
          this.totalList = a
          this.totalList1 = b
          console.log(a)
          console.log(b)
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
      // 排序的数组
      compare(property, type) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (type === 1) {
            return value2 - value1
          } else {
            return value1 - value2
          }
        }
      },
      // 病历：
      async getCRF() {
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/seeDoctor/getCRF',
            data: {
              PatientID: this.peopleData.patientId,
              // PatientID: 7631414,
              // PatientID: 2531,
              RegisterNo: this.listData.RegisterNo
            }
          })
          console.log('success')
          console.log(res)
          this.content0 = res.data[0].Content
          this.content1 = res.data[1].Content
          this.content2 = res.data[2].Content
          this.content3 = res.data[3].Content
          this.content4 = res.data[4].Content
          this.content5 = res.data[5].Content
          this.num = 2
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
      // 检查报告：
      async getRecipe() {
        let that = this
        wxAsync.showLoading({ title: '数据加载中', mask: true })
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/seeDoctor/getRecipe',
            data: {
              PatientID: that.peopleData.patientId,
              // PatientID: 9415048,
              // PatientID: 7631414,
              // PatientID: 2531,
              RegisterNo: that.listData.RegisterNo
            }
          })
          console.log('success')
          console.log(res)
          that.cfList = res.data
          for (let i = 0; i < that.cfList.length; i++) {
            that.cfList[i].list = []
            for (let f = 0; f < that.cfList[i].usage.length; f++) {
              let flag = false
              for (let m = 0; m < that.cfList[i].list.length; m++) {
                if (that.cfList[i].list[m].RelateID === that.cfList[i].usage[f].RelateID) {
                  flag = true
                  if (that.cfList[i].list[m].list === undefined) {
                    that.cfList[i].list[m].list = []
                    that.cfList[i].list[m].list.push(that.cfList[i].usage[f])
                  } else {
                    that.cfList[i].list[m].list.push(that.cfList[i].usage[f])
                  }
                }
              }
              if (!flag) {
                let a = {}
                a.RelateID = that.cfList[i].usage[f].RelateID
                a.DrugFrequency = that.cfList[i].usage[f].DrugFrequency
                a.DrugDays = that.cfList[i].usage[f].DrugDays
                a.DrugDosage = that.cfList[i].usage[f].DrugDosage
                if (a.list === undefined) {
                  a.list = []
                  a.list.push(that.cfList[i].usage[f])
                } else {
                  a.list.push(that.cfList[i].usage[f])
                }
                that.cfList[i].list.push(a)
              }
            }
          }
          console.log('xxxxxxxxxx cfList:')
          console.log(that.cfList)
          console.log(that.list)
        } catch (err) {
          console.log(err)
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
            // that.tipShow = err.errmsg
            // setTimeout(
            //   that.hideTip,
            //   3000
            // )
            // this.showTip()
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              that.hideTip,
              3000
            )
            that.showTip()
          }
        }
      },
      async listInspectionReport() {
        let self = this
        self.inspectionReportList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/inspection/listInspectionReport',
            data: {
              patientId: self.peopleData.patientId,
              // PatientID: 9415048,
              // patientId: 7631414,
              // patientId: 2531,
              registerNo: self.listData.RegisterNo,
              pageNo: 1,
              pageSize: 50
            }
          })
          console.log('success')
          console.log(res)
          self.inspectionReportList = res.data.inspectionReportList
        } catch (err) {
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
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
    created() {
    },
    onLoad(event) {
      console.log(event)
      this.totalList = []
      // 就诊人信息
      this.peopleData = JSON.parse(event.patientData)
      this.listData = []
      this.totalFee = 0
      this.feeNum = 1
      this.num = 1
      this.showNum = -1
      this.listData = JSON.parse(event.data)
      this.getFeeHis()
      console.log('xxxxxxxxxxxxcfList')
      console.log(this.peopleData)
    }
  }
</script>
<style lang="stylus">
  rpxf()
    1rpx

  rpx =  rpxf()

  page
    background-color  #F0EFF5
    height 100%
    .main
      width 750 * rpx
      height 100%
      overflow hidden
      background #F0EFF5
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
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .visitingHistory
        text-align center
        position absolute
        top 16 * rpx
        .top
          width 750 * rpx
          height 96 * rpx
          line-height 96 * rpx
          font-size 32 * rpx
          display flex
          display -webkit-flex
          justify-content space-around
          .color1
            color #fff
            border-bottom 8 * rpx  #fff solid
          .color2
            color #fff
            border-bottom none
          .item
            display inline-block
        .fee
          text-align center
          padding-bottom 32 * rpx
          margin-top 32 * rpx
          .fee-list
            display inline-block
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow:0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            .fee-item_fee
              display inline-block
              padding-bottom 40 * rpx
              .title_tag
                width 656 * rpx
                text-align left
                margin-top 40 * rpx
                .tag_left
                  color #19C1DE
                  display inline-block
                  margin-left 100 * rpx
                  margin-right 200 * rpx
                  .des
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_left
                  color #000000
                .tag_right
                  color #19C1DE
                  display inline-block
                  .menu
                    font-size 32 * rpx
                    margin-bottom 10 * rpx
                  .line
                    width 136 * rpx
                    height 10 * rpx
                    background rgba(25,193,222,1)
                    border-radius 6 * rpx
                .tag_right
                  color #000000
              .tagLeft_content
                .total_fee
                  margin-top 22 * rpx
                  text-align left
                  height 96 * rpx
                  line-height 96 * rpx
                  background #EFFDFF
                  font-size 32 * rpx
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .left
                    color #005DFF
                    margin-left 32 * rpx
                  .right
                    margin-right 32 * rpx
                    color #005DFF
                    display inline-block
                .total_fee_row
                  margin-top 34 * rpx
                  text-align left
                  display flex
                  display -webkit-flex
                  flex-wrap wrap
                  .total_fee_details
                    width 320 * rpx
                    display inline-block
                    margin-bottom 50 * rpx
                    font-size 32 * rpx
                    .left
                      color #707070
                      display inline-block
                      position absolute
                      overflow  hidden
                      text-overflow  ellipsis
                      display -webkit-box //作为弹性伸缩盒子模型显示。
                      -webkit-box-orient vertical  //设置伸缩盒子的子元素排列方式--从上到下垂直排列
                      -webkit-line-clamp 2  //显示的行
                    .right
                      color #000000
                      display inline-block
                      width 165 * rpx
                      margin-left 145 * rpx
                      text-align right
                      word-wrap break-word
                      word-break break-all
              .tagRight_content
                display inline-block
                width 720 * rpx
                .total_fee
                  width 720 * rpx
                  margin-top 22 * rpx
                  text-align left
                  height 96 * rpx
                  line-height 96 * rpx
                  background #EFFDFF
                  font-size 32 * rpx
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .left
                    color #005DFF
                    margin-left 32 * rpx
                  .right
                    margin-right 80 * rpx
                    color #005DFF
                    display inline-block
                .fee-menu
                  .menu-item
                    font-size 32 * rpx
                    height 80 * rpx
                    line-height 80 * rpx
                    white-space nowrap
                    display flex
                    display -webkit-flex
                    justify-content space-between
                    .left
                      text-align left
                      width 400 * rpx
                      overflow  hidden
                      text-overflow  ellipsis
                      color #707070
                      display inline-block
                      margin-left 32 * rpx
                    .right
                      color #000000
                      display inline-block
                      margin-right 80 * rpx
                    .arrow
                      width 20 * rpx
                      height 20 * rpx
                      position absolute
                      right 52 * rpx
                      margin-top 30 * rpx
                  .display_show_fee
                    width 656 * rpx
                    padding-top 16 * rpx
                    display inline-block
                    text-align center
                    border-bottom 2 * rpx solid rgba(229,229,229,1)
                    border-top 2 * rpx solid rgba(229,229,229,1)
                    color #707070
                    font-size 28 * rpx
                    .list_fee
                      width 656 * rpx
                      margin-bottom 18 * rpx
                      text-align left
                      position relative
                      font-size 28 * rpx
                      .left
                        display inline-block
                        width 455 * rpx
                        padding-left 32 * rpx
                      .right
                        display inline-block
                        position absolute
                        right 48 * rpx
            .history-item
              text-align left
              width 656 * rpx
              margin-left 32 * rpx
              margin-top 26 * rpx
              border-bottom 2 * rpx solid rgba(229,229,229,1)
              .history_row
                padding-bottom 26 * rpx
                font-size 32 * rpx
                .history_left
                  display inline-block
                  position absolute
                  color #707070
                .history_right
                  display inline-block
                  width 368 * rpx
                  margin-left 200 * rpx
                  line-height 45 * rpx
                  color #000000
          .fee-list
            display inline-block
            margin-top 16 * rpx
            width 720 * rpx
            background rgba(255,255,255,1)
            box-shadow:0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            border-radius 16 * rpx
            background #ffff
            .fee-item
              width 656 * rpx
              text-align left
              position relative
              display inline-block
              font-size 32 * rpx
              color #707070
              .item_row
                margin-top 26 * rpx
                margin-bottom 26 * rpx
                .item_left
                  display inline-block
                  position absolute
                .item_right
                  display inline-block
                  width 330 * rpx
                  margin-left 192 * rpx
                  line-height 44 * rpx
              .item_des
                text-align left
                color #000000
                font-size 32 * rpx
                font-weight bold
                height 80 * rpx
                line-height 80 * rpx
              .content
                text-align left
                width 656 * rpx
                color #707070
                font-size 32 * rpx
                margin-bottom 22 * rpx
                line-height 62 * rpx
              .report
                width 656 * rpx
                padding-top 28 * rpx
                padding-bottom 24 * rpx
                color #000000
                font-weight bold
                font-size 32 * rpx
                text-align left
                line-height 62 * rpx
                border-bottom 2 * rpx solid rgba(229,229,229,1)
              .time
                width 656 * rpx
                color #707070
                text-align left
                font-size 28 * rpx
                height 96 * rpx
                line-height 96 * rpx
                .time-left
                  display inline-block
                .time-right
                  margin-left 32 * rpx
                  display inline-block
              .left
                display inline-block
              .right
                display inline-block
                position absolute
                right 50 * rpx
                color #000000
              .arrow
                width 20 * rpx
                height 20 * rpx
                position absolute
                right 12 * rpx
                top 42%
            .display_show
              width 720 * rpx
              display inline-block
              text-align center
              background #EFFDFF
              color #707070
              margin-bottom 26 * rpx
              border-top 4 * rpx solid rgba(159,218,229,1)
              border-bottom 4 * rpx solid rgba(159,218,229,1)
              font-size 28 * rpx
              .show_item
                width 656 * rpx
                height 96 * rpx
                line-height 96 * rpx
                background #EFFDFF
                margin-left 32 * rpx
                .show_name
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  .title
                    display inline-block
                    width 200 * rpx
                    font-weight bold
                    font-size 32 * rpx
                    color #000000
                    text-align left
              .show_box
                border-top 4 * rpx solid rgba(159,218,229,1)
                width 656 * rpx
                display inline-block
                .show_dug
                  display flex
                  display -webkit-flex
                  justify-content space-between
                  border-bottom 2 * rpx dashed rgba(159,218,229,1)
                  width 656 * rpx
                  padding-bottom 32 * rpx
                  padding-top 32 * rpx
                  text-align left
                  .dug_des
                    width 200 * rpx
                    color black
                    font-size 28 * rpx
                    display inline-block
                .dug_methods
                  width 656 * rpx
                  height 96 * rpx
                  line-height 96 * rpx
                  color #19C1DE
                  margin-left 32 * rpx
                  font-size 28 * rpx
                  text-align right
                  .left_methods
                    display inline-block
                  .right_methods
                    display inline-block
                    margin-left 10 * rpx
                    margin-right 32 * rpx
            .fee-item-bom
              width 656 * rpx
              position relative
              display inline-block
              font-size 32 * rpx
              color #707070
              .item_row-bom
                font-size 32 * rpx
                margin-bottom 26 * rpx
                text-align left
                .item_left-bom
                  display inline-block
                  position absolute
                  color #707070
                .item_right-bom
                  display inline-block
                  width 330 * rpx
                  margin-left 192 * rpx
                  line-height 44 * rpx
                  color #000000
              .hiddenBorder
                border none
            .showImg
              width 688 * rpx
              height 32 * rpx
              margin-bottom 10 * rpx
            .display_none
              display none
            .list
              width 560 * rpx
              height 64 * rpx
              line-height 64 * rpx
              position relative
              .left
                display inline-block
                position absolute
                left 32 * rpx
              .right
                display inline-block
                position absolute
                right -32 * rpx
          .activeBackground
            background-color #EFFDFF
</style>

