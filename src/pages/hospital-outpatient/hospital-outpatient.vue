<template lang="pug">
  .main
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .bg
    .part
      .btn-list
        .btn(@click="change2(5)" :class="numTime==5?'color-2':'color-1'")
          .btn-text(:class="numTime==5?'txt-color-1':'txt-color-2'") 秀英分院
        .btn(@click="change2(4)" :class="numTime==4?'color-2':'color-1'")
          .btn-text(:class="numTime==4?'txt-color-1':'txt-color-2'") 龙华分院
        .btn(@click="change2(1)" :class="numTime==1?'color-2':'color-1'")
          .btn-text(:class="numTime==1?'txt-color-1':'txt-color-2'") 省委门诊部
      .box(v-show="numTime==1")
        .box-1
          .text-1 地址
          .text-2(@tap="showMap('省委门诊部','海口市美兰区海府路49号省委大院内','20.031340','110.355250')") 海口市美兰区海府路49号省委大院内   <!--20.031340,110.355250-->
        .box-2
          .text-1 简介
          .text-2 省委门诊，设在海口市海府路旧省直机关大院内，目前隶属于海南省人民医院医疗保健中心特诊部，主要任务为干部保健工作，兼门诊、急诊等工作。
          .text-3 目前对外开展的门诊、急诊工作主要有：
          .text-3 1、内科疾病的诊治：24小时内科急诊、每周一至周五正常工作时间（上午8:00-12:00；下午2:30-5:30，下同）内科门诊。
          .text-3 2、输液室工作：输注在我院（海南省人民医院）就诊的病人（出院病人及各门诊病人）带来的由我院药房调配的注射用药。
          .text-3 3、物理治疗（理疗）：目前有磁疗、超短波、红外线、电脑中频、拨罐等理疗方法，对颈肩腰腿痛、神经炎、神经痛、内脏急慢炎症、丹毒、急慢性软组织挫伤、咽喉炎等病症有良好疗效。每周一至周五正常工作时间开诊。节假日休息。
          .text-3 4、检验：每周一至周五正常工作时间，在本门诊可做血常规、尿常规、粪便常规、快速法测血糖等检查。上午8：00-9：00期间可为就诊或体检人员抽血，血液标本送到龙华门诊或秀英总部行各项检查。节假日停抽血。
      .box(v-show="numTime==2")
        .box-1
          .text-1 地址
          .text-2(@tap="showMap('南沙分院','南沙路88号地矿局门口附近','20.004474','110.323724')") 南沙路88号地矿局门口附近   <!--20.004474,110.323724-->
        .box-2
          .text-1 简介
          .text-2 海南省人民医院南沙分院门诊部已于2012年2月1日正式开业运营。门诊部设有内科、外科、妇产科、儿科、中医科、眼科、耳鼻喉颈科、口腔科、皮肤科和计免等临床科室，设有放射、检验、心电图、B超和理疗等医技科室。配置有500mA-X光机、电子胃镜和喉镜、全自动生化仪、心电图、B超等先进医疗设备。
          .text-2 南沙分院位于海口市金地路（原海南省地质医院），占地面积3.5亩，业务用房4500㎡，可设置病床100张。是以康复医学和综合门诊为基本定位的大专科小综合的专科性医院。
          <!--.text-2 导诊台电话：66825318-->
      .box(v-show="numTime==3")
        .box-1
          .text-1 地址
          .text-2
        .box-2
          .text-1 简介
          .text-2 位于海南岛西部的洋浦经济开发区医院海南省人民医院（洋浦分院），是洋浦经济开发区管理局于2005年投资兴建，由海南省人民医院负责运营管理的二级医院，于2009年10月正式营业。
          .text-2 当改革的春风在中国沿海地区吹起，中国经济的改革之路便越走越宽。1988年，这股春风终于吹到了远在中国最南边的洋浦湾，这一年，海南省委省政府将洋浦规划为一个港口工业城市。四年之后，中国伟大经济总设计师邓小平同志亲自批示，1992年3月，洋浦经济开发区被国务院批准设为国家级开发区。洋浦经济开发区位于中国海南西北部的洋浦半岛上，面积31平方公里，规划面积69平方公里，是海南岛西部工业走廊的龙头，对外开放的排头兵。洋浦湾，350多平方公里，150公里的海岸线，越来越多的人涌向大踏步向前进的洋浦，投入到经济大开发的浪潮中去。
          .text-2 经过三年多时间的投资建设，洋浦经济开发区医院于2009年9月底开始正式运营。洋浦经济开发区医院按二级综合性医院规模设计及标准建设，占地面积50亩，目前建筑面积15000平方米，住院病床120张，门诊部面积4500平米，内饰高雅，视觉开阔，窗明几净。科室分导清晰，分诊便捷有序。每月门急诊3400人次。整体建设布局绿化覆盖率53％，院内草坪葱郁，四季常青，体现了优美与健康一体的生命本色。
          .text-2 医院目前已开放了内科、外科、妇产科、儿科、急救门诊业务，由省医院定期派遣专家出诊。近期已进行病房开放筹备工作，将陆续开放内科、外科、妇产科、儿科病房，并筹建预防保健、五官科、康复科等门诊。
          .text-2 医院医疗器械装备齐全，现拥有西门子双排螺旋CT、DRX光机、西门子彩超机、全自动生化分析仪、全自动血常规机、进口呼吸机等先进的医疗设备，还将陆续配备一批先进设备，包括电子测听仪、胃肠窥镜、纤维支气管镜、动脉硬化检测仪等，满足洋浦地区人民健康需求。
          .text-2 医院计划建成集医疗、急救、预防、保健、疾病控制、康复为一体的二级综合性医院，住院病床120张，全部按一房两床配置，病床配置为半自动升降床，每床独立供氧、吸氧、电子呼叫系统。带标准卫生间，24小时热水、开水供应。住院部分设内科、外科、儿科、妇产科病室，层流手术室，中心供氧室、中心供应室。
      .box(v-show="numTime==4")
        .box-1
          .text-1 地址
          .text-2(@tap="showMap('龙华分院','海口市龙华路8号','20.040380','110.335920')") 海口市龙华路8号     <!--20.040380,110.335920-->
        .box-2
          .text-1 简介
          .text-2 龙华院区位于海口市龙华路8号，是全省规模最大的综合门诊部，可容纳5000人次就诊量。设有近40个临床专科和医技科室，其特点是分科细，专业化，每天有几十名主任医师、教授、副主任医师、副教授应诊，开展专家、专科门诊，解决危重疑难病例。还设有心理咨询、哮喘病、过敏性疾病等专病门诊，以及急救中心病房、产科病房、儿科病房、皮肤科病房和中医科病房。
          .text-2 龙华院区拥有全身型CT机、光电子内窥镜、美国美肤激光治疗仪、体外振波碎石机、美国博利24小时动态心电图仪、意大利牙科综合治疗椅、陶瓷机、多功能呼吸机、心电监护仪、生化分析仪、PCR检测仪、彩色B超机、脑电地形图机、脑血流图机、800毫安X光机等一大批先进医疗设备，可开展种类齐全的检查、治疗、手术等服务项目。
          .text-2 龙华院区便民服务特色：多媒体电脑划价收费取药一条龙服务;电脑挂号;触摸式多媒体查询系统;设立咨询服务台，专人坐班，接受咨询、导诊、导医等服务;免挂号费为病人开非处方用药和检查单;门诊部出资免费为病人邮寄检查、检验报告单;凭复诊联免挂号复诊一次;免费提供矿泉水饮用;急诊病人的检验和各种仪器检查在0.5—1小时内出报告单;开展病人选择“您最满意的医师”就诊服务项目;大屏幕电脑显示屏不间断滚动介绍门诊医师资料、病人挂号就诊情况;专职导诊员导医导诊服务。
          <!--.text-2 咨询电话：66225933  66101401-->
      .box(v-show="numTime==5")
        .box-1
          .text-1 地址
          .text-2(@tap="showMap('秀英分院','海南省海口市秀英区秀华路19号','20.004427','110.287115')") 海口市秀英区秀华路19号     <!--110.294165,20.011119-->
        .box-2
          .text-1 简介
          .text-2 秀英院区位于海口市秀英区秀华路19号
          .text-2 医院既承担全省老百姓疾病的治疗及预防工作，又承担全省高级干部的医疗保健任务和省内举办的各类大型赛事的保健任务。当前全年门急诊量突破160万人次，日均门急诊量6274人次，年住院量达56200人次，年手术量48921人次。
          .text-2 海南省人民医院在微创手术、器官移植、急危重症救治、介入治疗等方面成绩显著。微创手术覆盖神经外科的所有治疗领域；心血管内科在心脏介入性诊断和治疗领域是全省唯一全部心血管介入诊疗技术符合卫生部准入条件、能够全天候独立开展所有介入心脏病学技术的单位，也是全省唯一的国家级心血管临床药理基地；重症医学科实行全封闭式管理，开展心电、血流动力学、呼吸、体温、凝血功能、动脉血乳酸、体液代谢等床边监测技术，以及有创和无创呼吸支持、床边血液净化、亚低温治疗、肠外肠内营养支持治疗技术；普通外科分为三区，是全省医学界唯一具备博士研究生指导资格的专业学科；儿科基础研究以儿童营养为突破口，儿科临床以儿科急救为重点的专科专业发展方向，成为全省儿科疑难病例诊治中心。医院的心血管内科、神经外科、重症医学科3个专科被卫生部确定为2011年度国家临床重点建设专科；神经外科、普通外科、心血管病学、儿科、重症医学、神经内科学、急诊医学和血液病学8个学科被省卫生厅确定为海南省医学重点学科。医院充分利用综合医疗优势，并孵化出肝病学、医学影像诊断学、腔镜诊断技术等优势学科群，使医疗技术水平日益提高。
          .text-2 目前医院装备有价值5亿多元人民币的医疗设备和精密贵重仪器，有大型设备256排、64排及多排螺旋CT、双梯度核磁共振成像仪、体部X刀、细胞刀、心血管影像诊断仪、直线加速器、伽玛刀、PET-CT、3.0T核磁共振、体外循环机、摆药机、心变监护系统等；信息化建设更上一新平台，自主研发或合作开发覆盖全院的病案管理、财务管理、超声影像、病理图文、内窥镜影像、隔离病房电视会诊、手术室电视转播及示教、医学影像信息、临床检验、物流管理、医生工作站、办公自动化等医院信息系统，全力打造以电子病历为核心的医院数字化建设，为临床医疗技术的开展提供了强有力的保障。
          <!--.text-2 咨询电话：68642548-->
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeDisplay: false,
        tipShow: '',
        numTime: 5,
        num: 1,
        name: ''
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
      change2(id) {
        this.numTime = id
      },
      showMap(name, address, lat, lon) {
        RPC.wxLocation(name, address, lat, lon)
      },
      cardInfo() {
        wx.navigateTo({
          url: '../card-info-final/main?key=0'
        })
      }
    },
    onShow() {
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
      width 100%
      height 100%
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
      .part
        position absolute
        top 16 * rpx
        width auto
        height 80 * rpx
        .btn-list
          width auto
          height 80 * rpx
          .btn
            display inline-block
            margin-top 16 * rpx
            margin-left 32 * rpx
            background-color white
            border-radius 88 * rpx
            width 192 * rpx
            height 80 * rpx
            text-align center
            .btn-text
              font-size 16px
              line-height 80 * rpx
          .color-1
            background-color white
          .color-2
            background-color #0077FF
          .txt-color-1
            color white
          .txt-color-2
            color black
      .box
        width 720 * rpx
        height auto
        margin-top 50 * rpx
        border-radius 8px
        background-color white
        margin-left 16 * rpx
        .box-1
          width 656 * rpx
          height 112 * rpx
          margin-left 32 * rpx
          border-bottom 2 * rpx dashed #E5E5E5
          .text-1
            font-size 16px
            font-weight bold
            display inline-block
            line-height 112 * rpx
          .text-2
            float right
            font-size 16px
            color #005DFF
            display inline-block
            line-height 112 * rpx
        .box-2
          width 656 * rpx
          margin-left 32 * rpx
          .text-1
            font-size 16px
            font-weight bold
          .text-2
            font-size 14px
            text-indent 55 * rpx
          .text-3
            margin-top 64 * rpx
            font-size 14px
</style>
