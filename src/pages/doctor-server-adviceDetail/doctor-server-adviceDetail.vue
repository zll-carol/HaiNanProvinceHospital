<template lang="pug">
  .main
    .bg
    .adviceDetail_box
      .row_box
        .content_box
          .title 病人姓名
          .content(v-if="adviceItem.list[0].childNo === 0") {{patientName}}
          .content(v-if="adviceItem.list[0].childNo !== 0") {{patientName}}婴{{arr[(adviceItem.list[0].childNo - 1)]}}
        .content_box
          .title 医嘱期效
          .content {{adviceItem.list[0].adviceType}}嘱
      .row_box
        .content_box
          .title 医嘱状态
          .content {{adviceState}}
        .content_box(v-if="adviceItem.list[0].urg !== ''")
          .title 紧急标志
          .content(v-if="adviceItem.list[0].urg === '0'") 普通
          .content(v-if="adviceItem.list[0].urg === '1'") 紧急
          .content(v-if="adviceItem.list[0].urg === '2'") 补录
      .row_box
        .content_box
          .title 开嘱医生
          .content1 {{adviceItem.list[0].adviceDoctor}} {{adviceItem.list[0].adviceTime}}
      .row_box
        .content_box
          .title 医嘱内容
      .adviceContent_box
        .content
          .content1(v-for="(item, index1) in adviceItem.list", :class="[index1 === 0 ? 'activeBorder' : '']") {{item.adviceContent}}
      .row_box
        .content_box
          .title 用法用量
          .content1 {{adviceItem.list[0].dosage}}
      .row_box
        .content_box
          .title 执行时间
          .content1 {{adviceItem.list[0].executeTime}}
      .row_box
        .content_box
          .title 医生嘱托
          .content1 {{adviceItem.list[0].adviceAttach}}
      .row_box
        .content_box
          .title 停嘱医生
          .content1 {{adviceItem.list[0].disContinueDoctor}} {{adviceItem.list[0].disContinueTime}}
</template>

<script>
  export default {
    data() {
      return {
        adviceItem: [],
        adviceState: '',
        patientName: '',
        arr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
          'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
          'V', 'W', 'X', 'Y', 'Z'] // 对应相应的婴儿1、婴儿2、婴儿3.....
      }
    },

    computed: {},

    components: {},
    methods: {
    },
    onShow() {
    },
    onLoad(event) {
      console.log(event)
      this.adviceState = ''
      if (event.item) {
        this.adviceItem = JSON.parse(event.item)
        this.adviceItem.list[0].childNo = Number(this.adviceItem.list[0].childNo)
        if (this.adviceItem.list[0].adviceState === '1') { // 新开
          this.adviceState = '新开'
        }
        if (this.adviceItem.list[0].adviceState === '2') { // 疑问
          this.adviceState = '疑问'
        }
        if (this.adviceItem.list[0].adviceState === '3') { // 校对
          this.adviceState = '校对'
        }
        if (this.adviceItem.list[0].adviceState === '4') { // 作废
          this.adviceState = '作废'
        }
        if (this.adviceItem.list[0].adviceState === '5') { // 重整，目前为默认值
          this.adviceState = '重整'
        }
        if (this.adviceItem.list[0].adviceState === '6') { // 暂停
          this.adviceState = '暂停'
        }
        if (this.adviceItem.list[0].adviceState === '7') { // 启用
          this.adviceState = '启用'
        }
        if (this.adviceItem.list[0].adviceState === '8') { // 停止
          this.adviceState = '停止'
        }
        if (this.adviceItem.list[0].adviceState === '9') { // 确认停止
          this.adviceState = '确认停止'
        }
        if (this.adviceItem.list[0].adviceState === '90') { // 发送
          this.adviceState = '发送'
        }
        if (this.adviceItem.list[0].adviceState === '91') { // 未用
          this.adviceState = '未用'
        }
      }
      if (event.patientName) {
        this.patientName = event.patientName
      }
      console.log(this.adviceItem)
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
      .adviceDetail_box
        display inline-block
        position absolute
        top 16 * rpx
        left 16 * rpx
        width 720 * rpx
        padding-top 16 * rpx
        padding-bottom 16 * rpx
        background rgba(255,255,255,1)
        box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
        opacity 1
        border-radius 16 * rpx
        .row_box
          width 656 * rpx
          margin-left 32 * rpx
          display flex
          display -webkit-flex
          justify-content space-between
          padding-top 12 * rpx
          padding-bottom 12 * rpx
          line-height 1.5
          .content_box
            text-align left
            font-size 28 * rpx
            display flex
            .title
              display inline-block
              color #707070
              margin-right 32 * rpx
            .content
              width 140 * rpx
              display inline-block
              color #000000
            .content1
              display inline-block
              color #000000
              width 462 * rpx
        .adviceContent_box
          display inline-block
          width 720 * rpx
          background #E1FBFF
          font-size 28 * rpx
          color #0098B3
          .content
            width 656 * rpx
            text-align left
            display inline-block
            margin-top 20 * rpx
            margin-bottom 20 * rpx
            .content1
              width 656 * rpx
              text-align left
              display inline-block
              border-top 2 * rpx dashed rgba(25,193,222,1)
              padding-top 20 * rpx
              padding-bottom 20 * rpx
              line-height 1.5
            .activeBorder
              border none
</style>
