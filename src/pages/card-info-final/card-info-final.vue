<template lang="pug">
  .main
    .tip(v-show="activeDisplay") {{tipShow}}
    .bg
    .box
      .box-relation(v-if="relationshipShow==1")
        .name 关系
        .value(v-if="key==0") {{choose}}
        picker.picker(v-if="key!=0" @change="bindPickerChange" :range="relationshipArray") {{choose}}
      .box-relation(v-if="num==1")
        .name 门诊号
        .value {{data.outpatientNo}}
      .box-relation
        .name 姓名
        .value {{data.name}}
      .box-relation
        .name 身份证号
        .value {{cardNo}}
      .box-relation
        .name 生日
        .value {{data.birthDate}}
      .box-relation
        .name 性别
        .value {{data.sexName}}
      .box-relation
        .name 手机号
        .value(v-if="key != 1") {{data.phone}}
        input.picker-1(v-if="key == 1" v-model="data.phone" placeholder="请输入手机号")
      .box-relation(v-if="key == 1")
        .name 地区信息
        picker.picker(@change="bindPickerChange1" mode="region") {{chooseArea}}
      .box-relation1
        .name1 地址详情
        .right
          textarea.picker-11(maxlength="40",v-if="key != 1",v-model="data.address", disabled="true")
          textarea.picker-11(maxlength="40",v-if="key == 1",v-model="data.address", placeholder="请输入详细地址")
    .box-1(v-if="young")
      .box-relation
        .name 监护人姓名
        input.picker-1(v-model="data.relationName" placeholder="请输入姓名")
      .box-relation
        .name 监护人身份证
        input.picker-1(v-model="data.relationCardNo" placeholder="请输入身份证号" type="idcard")
      .box-relation
        .name 监护人手机号
        input.picker-1(v-model="data.relationPhone" placeholder="请输入手机号码" type="number")
      .box-relation
        .name 监护关系
        picker.picker(@change="bindPickerChange2" :range="relationshipArray1") {{chooseRelation}}
    .btn-class(v-if="isShow" :style="young?'bottom: -150rpx':'bottom: 32rpx'")
      button(@click="submit")
        .btm {{btmName}}
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        type: '', // 是否第一次建档时使用
        key: '', // 打开页面的类型
        relationshipShow: 1,
        num: 0,
        bindTypeList: {},
        choose: '请选择关系',
        chooseArea: '请选择地区',
        chooseRelation: '请选择关系',
        relationshipArray: ['本人', '父母', '子女', '夫妻', '朋友', '同事', '其他', '被监护人'],
        relationshipArray1: ['亲人', '父子', '父女', '母子', '母女', '兄弟', '兄妹', '姐弟', '姐妹', '其他'],
        relationshipArrayCode: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '98'],
        tipShowArray: ['请输入地址', '请选择关系', '请输入正确的身份证号码', '请输入小孩姓名', '请输入手机号', '请输入正确的手机号', '请输入验证码', '请输入正确的验证码', '请选择绑定方式', '请选择就诊人类型', '网络异常，请稍后再试'],
        index: 0,
        isShow: false,
        btmName: '新建并绑定',
        cardNo: '', // 带星号的身份证
        data: {
          relationship: '',
          patientId: '',
          phone: '',
          address: '',
          relationCardNo: '',
          relationName: '',
          relation: '',
          relationPhone: '',
          areaCode: ''
        },
        activeDisplay: false,
        tipStatus: '', // 提示状态
        tipShow: '',
        young: false
      }
    },

    computed: {
    },

    components: {},
    methods: {
      showTip(index) {
        this.tipShow = RPC.tipShowText(index)
        this.activeDisplay = true
        setTimeout(
          this.hideTip,
          3000
        )
      },
      hideTip() {
        this.activeDisplay = false
      },
      bindPickerChange(event) {
        this.choose = this.relationshipArray[event.mp.detail.value]
        this.index = event.mp.detail.value
        this.data.relationship = parseInt(event.mp.detail.value) + 1
      },
      bindPickerChange1(event) {
        let detail = event.mp.detail
        this.chooseArea = detail.value[0] + detail.value[1] + detail.value[2]
        this.data.areaCode = detail.code[2]
        console.log(this.chooseArea + this.data.areaCode)
      },
      bindPickerChange2(event) {
        this.chooseRelation = this.relationshipArray1[event.mp.detail.value]
        // this.data.relation = this.relationshipArrayCode[event.mp.detail.value]
        this.data.relation = this.relationshipArray1[event.mp.detail.value]
      },
      async submit() {
        let self = this
        console.log(self.data)
        console.log(self.key === 1)
        if (self.data.relationship === '') {
          self.showTip(1)
        } else if ((self.data.phone === '' || self.data.phone.length !== 11) && self.key === '1') {
          self.showTip(5)
        } else if ((self.data.address === '' || self.data.areaCode === '') && self.key === '1') {
          self.showTip(11)
        } else if (self.young && (self.data.relationCardNo === '' || self.data.relationName === '' || self.data.relation === '' || self.data.relationPhone === '')) {
          self.showTip(13)
        } else {
          // 建档
          console.log(self.data)
          self.data.idCardNo = self.data.cardNo
          if (self.data.areaCode) {
            self.data.address = self.chooseArea + self.data.address
          }
          try {
            let res = await RPC.request({
              url: '/HospitalFormApi/archive/bindHealthCard',
              data: self.data
            })
            console.log('success')
            console.log(res)
            if (res.errcode === 0) {
              wx.showToast({title: '建档成功！'})
              // 根据不同页面进入建卡，返回不同的页面
              // type为1时是首页进入，跳转到健康卡列表，type为2时，返回健康卡列表
              if (self.type === '1') {
                wx.navigateBack({
                  delta: 10
                })
              } else {
                if (self.key === '1') {
                  // 新建并绑定,有2级页面
                  wx.navigateBack({
                    delta: 2
                  })
                }
                if (self.key === '2') {
                  // 绑定卡，有3级页面
                  wx.navigateBack({
                    delta: 3
                  })
                }
              }
            }
          } catch (err) {
            console.log('fail')
            if (err.errcode === 400) {
              RPC.toShow(err.errmsg)
            } else if (err.errcode === 500) {
              this.showTip(10)
            }
          }
        }
      },
      async loadRelation() {
        let self = this
        // 查询缓存，是否存在关系表，没有则后台读取
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
            self.relationshipArray1[bindType[i].code] = bindType[i].name
          }
          console.log(self.relationshipArray)
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.showTip(10)
          }
        }
      },
      async loadData(patientId, outpatientNo) {
        let self = this
        self.list = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/archive/listArchives',
            data: {
              cardNo: patientId,
              cardType: '2',
              patientId: patientId
            }
          })
          console.log('success')
          console.log(res)
          let list = res.data.archivesList
          for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].outpatientNo === outpatientNo) {
              console.log(list[i])
              self.data = list[i]
              self.data.cardNo = list[i].idCardNo
              if (self.data.cardNo.length === 15) {
                self.cardNo = self.data.cardNo.substring(0, 6) + '******' + self.data.cardNo.substring(12, 15)
              } else {
                self.cardNo = self.data.cardNo.substring(0, 6) + '********' + self.data.cardNo.substring(14, 18)
              }
              if (list[i].sex === 0) {
                self.data.sexName = '男'
              } else {
                self.data.sexName = '女'
              }
            }
          }
        } catch (err) {
          console.log('fail')
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.showTip(10)
          }
        }
      }
    },
    onShow() {
    },
    created() {
      // wx.clearStorage()
    },
    onLoad(event) {
      let self = this
      // 进来默认显示关系
      self.relationshipShow = 1
      // 初始化某些数值
      self.data.relationship = ''
      self.data.phone = ''
      self.data.address = ''
      self.type = event.type
      self.choose = '请选择关系'
      self.data.areaCode = ''
      // 是否是有身份证的小孩数据初始化
      self.young = false
      self.data.relationCardNo = ''
      self.data.relationName = ''
      self.data.relation = ''
      self.data.relationPhone = ''
      // self.loadRelation()
      console.log(event)
      // 分两种情况，医院内部是否有档案，有就绑定，没有就新建并绑定
      // key=1成人建档  key=2绑定 key=0查看
      self.key = event.key
      if (self.key === '0') {
        // 查看详情
        // 不能编辑
        self.num = 1
        self.isShow = false
        self.choose = self.relationshipArray[event.relationship - 1]
        console.log(event.patientId)
        self.loadData(event.patientId, event.outpatientNo)
      } else {
        // 新建绑定
        self.isShow = true
        if (self.key === '1') {
          if (event.type === '1') {
            console.log(11111111111111111111111111)
            self.data.relationship = '1'
            self.relationshipShow = 0
          }
          console.log(222222222222222222222)
          self.btmName = '新建并绑定'
          self.data.cardNo = event.cardNo
          self.data.name = event.name
          self.data.phone = event.phone
          self.data.bindType = event.bindType
          self.data.hasIdCard = event.hasIdCard
          self.data.verifyCode = event.verifyCode
          // 根据身份证号码计算出生日期，性别
          let birthday = ''
          if (self.data.cardNo.length === 15) {
            birthday = '19' + self.data.cardNo.substr(6, 6)
          } else if (self.data.cardNo.length === 18) {
            birthday = self.data.cardNo.substr(6, 8)
          }
          birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
          self.data.birthDate = birthday
          self.data.sexName = self.data.cardNo.slice(14, 17) % 2 ? '男' : '女'
          self.data.sex = self.data.cardNo.slice(14, 17) % 2 ? '0' : '1'
          // 计算年龄
          let bDate = new Date(birthday)
          let newData = new Date()
          self.data.age = newData.getFullYear() - bDate.getFullYear()
          // 有身份证的就诊人小于14周岁的情况下，需要多填写一些数据
          if (self.data.age < 15) {
            self.young = true
          }
          console.log(self.data)
        } else {
          // 直接绑定
          // 根据type判断是否是本人第一次新建  1为本人第一次  2为帮别人新建
          // 不能编辑
          if (event.type === '1') {
            self.data.relationship = '1'
            self.relationshipShow = 0
          }
          self.btmName = '确认绑定'
          self.num = 1
          self.data.cardNo = event.cardNo
          self.data.name = event.name
          self.data.phone = event.phone
          self.data.bindType = event.bindType
          self.data.hasIdCard = event.hasIdCard
          self.data.verifyCode = event.verifyCode
          self.data.outpatientNo = event.outpatientNo
          self.data.address = event.address
          self.data.patientId = event.patientId
          // 根据身份证号码计算出生日期，性别
          let birthday = ''
          if (self.data.cardNo.length === 15) {
            birthday = '19' + self.data.cardNo.substr(6, 6)
          } else if (self.data.cardNo.length === 18) {
            birthday = self.data.cardNo.substr(6, 8)
          }
          birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
          self.data.birthDate = birthday
          self.data.sexName = self.data.cardNo.slice(14, 17) % 2 ? '男' : '女'
          self.data.sex = self.data.cardNo.slice(14, 17) % 2 ? '0' : '1'
          // 计算年龄
          let bDate = new Date(birthday)
          let newData = new Date()
          self.data.age = newData.getFullYear() - bDate.getFullYear()
          console.log(self.data)
        }
        // 身份证显示带星号
        if (self.data.cardNo.length === 15) {
          self.cardNo = self.data.cardNo.substring(0, 6) + '******' + self.data.cardNo.substring(12, 15)
        } else {
          self.cardNo = self.data.cardNo.substring(0, 6) + '********' + self.data.cardNo.substring(14, 18)
        }
      }
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
      overflow hidden
      background #F0EFF5
      height 100%
      .tip
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
      .box
        width 720 * rpx
        position absolute
        top 16 * rpx
        height auto
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        .box-relation1
          margin-top 26 * rpx
          margin-left 36 * rpx
          padding-bottom 26 * rpx
          width 648 * rpx
          background #fff
          .name1
            display inline-block
            position absolute
            color #707070
            font-size 16px
          .right
            text-align right
            .value1
              width 450 * rpx
              display inline-block
              font-size 32 rpx
              text-align right
            .picker-11
              text-align right
              width 450 * rpx
              height 125 * rpx
              display inline-block
              font-size 32 * rpx
        .box-relation
          border-bottom 2 * rpx solid #E5E5E5
          margin-left 36 * rpx
          width 648 * rpx
          height 96 * rpx
          background #fff
          .name
            display inline-block
            line-height 96 * rpx
            color #707070
            font-size 16px
          .picker
            display inline-block
            float right
            font-size 16px
            line-height 96 * rpx
          .value
            width 450 * rpx
            display inline-block
            float right
            font-size 16px
            line-height 96 * rpx
            text-align right
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
          .picker-1
            margin-top 20 * rpx
            float right
            width 450 * rpx
            display inline-block
            font-size 16px
            text-align right
      .box-1
        width 720 * rpx
        position absolute
        bottom -20 * rpx
        height auto
        background #fff
        border-radius 8px
        margin-left 16 * rpx
        .box-relation1
          margin-top 26 * rpx
          margin-left 36 * rpx
          padding-bottom 26 * rpx
          width 648 * rpx
          background #fff
          .name1
            display inline-block
            position absolute
            color #707070
            font-size 16px
          .right
            text-align right
            .value1
              width 450 * rpx
              display inline-block
              font-size 32 rpx
              text-align right
            .picker-11
              width 450 * rpx
              height 125 * rpx
              display inline-block
              font-size 32 * rpx
        .box-relation
          border-bottom 2 * rpx solid #E5E5E5
          margin-left 36 * rpx
          width 648 * rpx
          height 96 * rpx
          background #fff
          .name
            display inline-block
            line-height 96 * rpx
            color #707070
            font-size 16px
          .picker
            display inline-block
            float right
            font-size 16px
            line-height 96 * rpx
          .value
            width 450 * rpx
            display inline-block
            float right
            font-size 16px
            line-height 96 * rpx
            text-align right
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
          .picker-1
            margin-top 20 * rpx
            float right
            width 450 * rpx
            display inline-block
            font-size 16px
            text-align right
      .btn-class
        position absolute
        width 100%
        bottom 32 * rpx
        button
          width 690 * rpx
          height 88 * rpx
          border-radius 88 * rpx
          background #19C1DE
          line-height:88rpx
          box-shadow:0px 6px 12px rgba(0,0,0,0.1)
          .btm
            color white
</style>
