<template lang="pug">
  .main
    .bg
    .none(v-if="medicalHistoryItem.length === 0") 暂时无法查看
    .patientDetail_box(v-if="medicalHistoryItem.length !== 0")
      .top_box
        .row_top {{medicalHistoryItem.title}}
        .row_bottom
          .box(v-for="(item, index) in medicalHistoryItem.header")
            .left {{item.title}}
            .right {{item.text}}
      .content_box(v-if="medicalHistoryItem.section", v-for="(item, index) in medicalHistoryItem.section")
        .box
          .row_title {{item.title}}:
          .content
            .row(v-for="(item1, index1) in item.text") {{item1}}
      .content_box(v-if="medicalHistoryItem.subdoc", v-for="(item, index) in medicalHistoryItem.subdoc")
        .box
          .row_title {{item.title}}:
          .content(v-if="item.sections")
            .row(v-for="(item1, index1) in item.sections")
              .title {{item1.title}}
              .des(v-for="(item2, index2) in item.sections[index1].text") {{item2}}
          .content(v-if="item.text")
            .row(v-for="(item1, index1) in item.text") {{item1}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        medicalHistoryItem: [],
        patientName: ''
      }
    },

    computed: {},

    components: {},
    methods: {
      async listInspectionReport() {
        let self = this
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/listInspection',
            data: {
              patientId: self.peopleData.patientId,
              visitId: self.peopleData.visitId,
              // patientId: 7631414,
              // patientId: 2842359,
              // patientId: 2531,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              type: this.type
            }
          })
          console.log('success')
          console.log(res)
          self.show = true
          self.showPage()
          let datalist = res.data.inspectionReportList
          if (datalist) {
            for (let i = 0; i < datalist.length; i++) {
              self.inspectionReportList.push(datalist[i])
            }
          }
          if (datalist.length < self.pageSize) {
            self.loadType = false
          }
          this.pageNo++
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
    },
    onLoad(event) {
      this.medicalHistoryItem = []
      this.patientName = ''
      try {
        let value = wx.getStorageSync('item')
        if (value) {
          this.medicalHistoryItem = value
          if (this.medicalHistoryItem.section) { // 第一种数据类型: section[{text:[],title:''},{text:[],title:''}...]
            for (let i = 0; i < this.medicalHistoryItem.section.length; i++) {
              let textArr = this.medicalHistoryItem.section[i].text
              for (let k = 0; k < textArr.length; k++) {
                textArr[k] = textArr[k].replace('：', '')
              }
            }
          }
          if (this.medicalHistoryItem.subdoc) { // 第二种数据类型: subdoc[{sections:[text:[],title:''],title:''},{text:[],title:''}...{sections:[text:[],title:''],title:''}...{text:[],title:''}...]
            let subdoc = this.medicalHistoryItem.subdoc
            for (let i = 0; i < subdoc.length; i++) {
              let sections = subdoc[i].sections
              if (sections) {
                for (let k = 0; k < sections.length; k++) {
                  let textArr = sections[k].text
                  for (let f = 0; f < textArr.length; f++) {
                    textArr[f] = textArr[f].replace('：', '')
                  }
                }
              } else {
                let textArr = subdoc[i].text
                for (let n = 0; n < textArr.length; n++) {
                  textArr[n] = textArr[n].replace('：', '')
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
      if (event.patientName) {
        this.patientName = event.patientName
      }
      try {
        wx.removeStorageSync('item')
      } catch (e) {
        console.log(e)
      }
      console.log(this.medicalHistoryItem)
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
    background #F0EFF5
    .main
      width 750 * rpx
      height 100%
      overflow hidden
      background #F0EFF5
      text-align center
      .bg
        height 600 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .none
        color #9999
        position absolute
        left 300 * rpx
        top 50%
        text-align center
      .patientDetail_box
        display inline-block
        position absolute
        top 16 * rpx
        left 16 * rpx
        padding-bottom 32 * rpx
        .top_box
          width 720 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          opacity 1
          border-radius 16 * rpx
          .row_top
            height 112 * rpx
            line-height 112 * rpx
            color #000000
            font-size 36 * rpx
            font-weight bold
            text-align center
          .row_bottom
            padding-bottom 16 * rpx
            margin-left 32 * rpx
            width 656 * rpx
            line-height 1.6
            text-align left
            border-top 2 * rpx solid rgba(229,229,229,1)
            .box
              font-size 28 * rpx
              display inline-block
              margin-right 12 * rpx
              .left
                color #707070
                display inline-block
                margin-right 16 * rpx
              .right
                color #000000
                display inline-block
        .content_box
          width 720 * rpx
          margin-top 16 * rpx
          padding-top 16 * rpx
          padding-bottom 32 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
          opacity 1
          border-radius 16 * rpx
          .box
            display inline-block
            width 656 * rpx
            margin-bottom 16 * rpx
            .row_title
              color #000000
              font-size 32 * rpx
              font-weight bold
              text-align left
              height 80 * rpx
              line-height 80 * rpx
              margin-bottom 12 * rpx
            .content
              font-size 28 * rpx
              color #707070
              .row
                width 656 * rpx
                text-align left
                .title
                  color #000000
                  font-size 28 * rpx
                  font-weight bold
                  margin-top 16 * rpx
                .des
                  width 656 * rpx
                  line-height 1.5
                  margin-top 16 * rpx
</style>
