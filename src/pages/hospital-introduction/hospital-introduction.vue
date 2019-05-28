<template lang="pug">
  .main
    .bg
    .box
      .box-1
        img(mode="widthFix", src="https://nontax-cdn.yuluoo.com/hospital-photo.png")
        .address-text 地址
        .address-text-1
          .address-text-11 秀英区：
          .address-text-12(@tap="showMap('秀英分院','海南省海口市秀英区秀华路19号','20.004427','110.287115')") 海口市秀英区秀华路19号
        .address-text-1
          .address-text-11 龙华区：
          .address-text-12(@tap="showMap('龙华分院','海口市龙华路8号','20.040380','110.335920')") 海南省海口市龙华区龙华路 8 号
      .box-2
        .address-text 公交
        .address-text-21
          .address-text-211 外地患者：火车站路线:乘坐28路在省医院留医部下车，步行至医院;
        .address-text-21
          .address-text-211 本地患者：乘坐公交1路、 2路、 3路、17路、 28路、 33路、 39路、55路、62路、208路，旅游6线在省医院留医部下车，步行至医院。
      <!--.box-3-->
        <!--.address-text 电话-->
        <!--.address-text-1-->
          <!--.address-text-11 咨询电话：-->
          <!--.address-text-12(@tap="phone('0898-68642548')") 0898-6864 2548-->
        <!--.address-text-1-->
          <!--.address-text-11 预约电话：-->
          <!--.address-text-12(@tap="phone('0898-60825656')") 0898-6082 5656-->
      .box-4
        .txt-1 海南省人民医院是省直属的综合性三级甲等医院，其前身是教会医院——海口福音医院，由美国牧师创建于1881年。1951年，海口福音医院与始创于1927年的海南医院合并成立广东省海南行政区医院；1988年海南建省医院升格更名为海南省人民医院，历史悠久却是最年轻的省人民医院。
        .txt-1 目前医院占地面积近400亩，建筑面积34万平方米。在职职工4313人，其中卫生技术人员3561人。开放床位3000张。门诊量180.7万人次，出院病人8.5万人次，手术量6万多台。呈2个院区、1个分院，5个门诊部布局。中心院区地处国境之南、海岛之北的美丽椰城海口市内。
        .txt-1 作为全省疑难急危重症研治中心，集中发展高精尖诊疗技术。在腔镜手术、微创技术、肝脏移植、肾移植、器官复苏、急危重症院前救治、肿瘤介入、血管介入等方面成绩突出，年开展大型危重手术2万台。微创手术覆盖神经外科的所有治疗领域；省心血管病医院在心脏介入性诊断和治疗领域，是全省唯一的全部介入诊疗技术符合准入条件，能全天候开展全部介入心脏病学技术的单位，是全省最早的国家级心血管临床药理基地；重症医学科开展心电、血流动力学、体液代谢呼吸支持、床边血液净化、亚低温治疗、肠外肠内营养支持治疗技术；儿科为全省儿科疑难病例诊治中心。设备先进，总值7亿元，有PET-CT、3.0T磁共振2台、1.5T磁共振1台）、256排CT、64排CT、SPECT、DSA 3台、直线加速器、伽玛刀、X—刀、细胞刀等大型和专科设备。
        .txt-1 紧急救援中心网络医院，全国文明单位，全国卫生系统先进集体，“全国医院文化建设先进集体”、“全国五一巾帼标兵岗”等，医院党委被中央组织部授予“全国争先创优先进基层党组织”称号。
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        list: [],
        login: false,
        num: 1
      }
    },

    computed: {},

    components: {},
    methods: {
      showMap(name, address, lat, lon) {
        RPC.wxLocation(name, address, lat, lon)
      },
      phone(num) {
        RPC.phone(num)
      }
    },
    onLoad(event) {
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
    background #F0EFF5
    .main
      width 100%
      height 100%
      .bg
        height 320 * rpx
        background linear-gradient(#19C1DE,#F0EFF5)
      .box
        width 720 * rpx
        margin-bottom 32 * rpx
        background-color white
        top 16 * rpx
        margin-left 16 * rpx
        border-radius 8px
        position absolute
        .box-1
          width 648 * rpx
          height 608 * rpx
          background-color white
          margin-top 32 * rpx
          margin-left 32 * rpx
          border-radius 8px
          border-bottom 2 * rpx dashed #E5E5E5
          img
            width 656 * rpx
            height 100%
          .address-text
            font-size 16 px
            font-weight bold
            margin-left 48 * rpx
            margin-top 48 * rpx
          .address-text-1
            margin-top 16 * rpx
            margin-left 48 * rpx
            .address-text-11
              display inline-block
              font-size 14px
            .address-text-12
              display inline-block
              font-size 14px
              color #005DFF
        .box-2
          width 648 * rpx
          height 368 * rpx
          background-color white
          margin-top 32 * rpx
          margin-left 32 * rpx
          border-radius 8px
          border-bottom 2 * rpx dashed #E5E5E5
          .address-text
            font-size 16 px
            font-weight bold
            margin-left 48 * rpx
            margin-top 48 * rpx
          .address-text-21
            margin-top 16 * rpx
            margin-left 48 * rpx
            .address-text-211
              display inline-block
              font-size 14px
        .box-3
          width 648 * rpx
          height 208 * rpx
          background-color white
          margin-top 32 * rpx
          margin-left 32 * rpx
          border-radius 8px
          border-bottom 2 * rpx dashed #E5E5E5
          .address-text
            font-size 16 px
            font-weight bold
            margin-left 48 * rpx
            margin-top 48 * rpx
          .address-text-1
            margin-top 16 * rpx
            margin-left 48 * rpx
            .address-text-11
              display inline-block
              font-size 14px
            .address-text-12
              display inline-block
              font-size 14px
              color #005DFF
        .box-4
          width 648 * rpx
          height auto
          margin-bottom 32 * rpx
          background-color white
          margin-left 32 * rpx
          border-radius 8px
          .txt-1
            margin-top 32 * rpx
            font-size 14px
            text-indent 55 * rpx

</style>
