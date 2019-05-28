<template lang="pug">
  .main
    .bg(:style="{display: activeHidden}")
    .pay-tip(v-show="activeDisplay") {{tipShow}}
    .examination-list(:style="{display: activeHidden}")
      .top_box
        .cardInfo
          .row_top
            .left_box
              .text 病人
              .text-1(v-if="peopleData.bed !== ''") {{peopleData.patientName}}({{peopleData.bed}})
              .text-1(v-if="peopleData.bed === ''") {{peopleData.patientName}}
            picker.right_box(:value="index", :range="visitArray", @change="bindVisitNumChange")
              .left 住院次数: {{visitId}}
              img.rightImg(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
          .row_bottom
            .department 科室
            .content {{deptName}}
        .table_box
          .table(@click="changeTable(1)")
            .table_des 医嘱信息
            .table_line(v-if="activeShow1")
          .table(@click="changeTable(2)")
            .table_des 电子病历
            .table_line(v-if="activeShow2")
          .table(@click="changeTable(3)")
            .table_des 检查检验
            .table_line(v-if="activeShow3")
        .title_box(v-if="activeShow1 && adviceListSameId.length !== 0")
          .box
            .title 开嘱时间
            .title 内容
            .title 用法用量
      .patientMsg_box(:class="[activeShow1 ? 'visitMsg_box' : '']")
        .none(v-if="adviceListMsg === 0 && activeShow1") 暂无相关信息
        .doctorAdvice_box(v-if="activeShow1 && adviceListSameId.length !== 0")
          .msg_box(v-for="(item, index) in adviceListSameId", @click="navigateToAdviceDetail(item)")
            .box1(:class="[item.list[0].adviceState === '1' ? 'activeColor1' : item.list[0].adviceState === '2' ? 'activeColor2' : item.list[0].adviceState === '3' ? 'activeColor3' : item.list[0].adviceState === '4' ? 'activeDelete' : item.list[0].adviceState === '5' ? 'activeColor5' : item.list[0].adviceState === '6' ? 'activeColor6' : item.list[0].adviceState === '7' ? 'activeColor7' : item.list[0].adviceState === '8' ? 'activeColor8' : item.list[0].adviceState === '9' ? 'activeColor9' : item.list[0].adviceState === '90' ? 'activeColor90' : item.list[0].adviceState === '91' ? 'activeColor91' : '']")
              img.leftIcon(:src="(item.list[0].urg === '0' && item.list[0].adviceState === '91') ? 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_wrong.png' : item.list[0].urg === '1' ? 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_notice.png' : item.list[0].urg === '2' ? 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_write.png' : ''")
              .time {{item.list[0].adviceTime}} ({{item.list[0].adviceType}})
              .content
                .content1(v-for="(item, index1) in item.list", :class="[index1 === 0 ? 'activeBorder' : '']") {{item.adviceContent}}
              .methods {{item.list[0].dosage}}
              img.rightArrow(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_arrow.png")
        .none(v-if="medicalHistoryListMsg === 0 && activeShow2") 暂无相关信息
        .EMR_box(v-if="activeShow2 && medicalHistoryList.length !== 0")
          .content_box(v-for="(item, index) in medicalHistoryList", :class="[index%2 !== 0 ? 'activeBackground' : '']", @tap="navigateToDetail(item)")
            .row_top {{item.title}}
            .bottom_box
              .row_bottom
                .row
                  .word(style="color:#707070") 创建人
                  .word {{item.creator}}
                  .word {{item.creatTime}}
              .row_bottom
                .row
                  .word(style="color:#707070") 编辑人
                  .word {{item.editor}}
                  .word {{item.editTime}}
        .none(v-if="inspectionReportListMsg === 0 && activeShow3") 暂无相关信息
        .examination_box(v-if="activeShow3 && inspectionReportList.length !== 0")
          .box(v-for="(item, index) in inspectionReportList",:class="[index%2 !== 0 ? 'activeBackground' : '']",@tap="goInfo(item)")
            .box-relation
              .name {{item.name}}
            .box-relation-1
              .name 报告时间: {{item.time}}
      .filter_box(@tap="openAlert", v-if="activeShow1 || activeShow3")
        img.filterImg(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_filter.png")
        .filter 筛选
    .showFilter(v-show="activeAlert")
      .selected_box(@tap="cancel")
      .tag_box
        .btn_box
          .left 筛选条件
          img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_delete1.png", @tap="cancel")
        .type_box
          .row_top 分类
          .row_bottom
            .row
              .btn(@click="selected(1)", :class="[isSelected1 ? 'activeColor' : '']") 全部
              .btn(@click="selected(2)", :class="[isSelected2 ? 'activeColor' : '']") 在用医嘱
        .type_box
          .row_top 开嘱时间
          .row_bottom
            .row
              .btn(@click="selected(6)", :class="[isSelected6 ? 'activeColor' : '']") 全部
              .btn(@click="selected(7)", :class="[isSelected7 ? 'activeColor' : '']") 当天
              .btn(@click="selected(8)", :class="[isSelected8 ? 'activeColor' : '']") 自定义
        .selectDate_box(v-if="isSelected8")
          picker.weui_btn(mode="date", :value="date", :start="start", :end="end", @change="bindStartDateChange")
            button.btn(type="default", :class="[startDate !== '起始时间' ? 'activeColor' : '']") {{startDate}}
            img.arrowImg(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_down.png")
          .line
          picker.weui_btn(mode="date", :value="date", :start="start", :end="end", @change="bindEndDateChange")
            button.btn(type="default", :class="[endDate !== '截止时间' ? 'activeColor' : '']") {{endDate}}
            img.arrowImg(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_down.png")
        .type_box(v-if="childArr.length !== 0")
          .row_top 病人
          .row_bottom
            .row
              .btn(@click="selectedPatient('全部')", :class="[isPatient1 ? 'activeColor' : '']") 全部
              .btn(@click="selectedPatient('本人')", :class="[isPatient2 ? 'activeColor' : '']") 本人
              .btn(v-for="(item, index) in childArr", @click="selectedPatient(index)", :class="[item.click ? 'activeColor' : '']") 婴儿{{item.num}}
        .type_box
          .row_top 期效
          .row_bottom
            .row
              .btn(@click="selected(3)", :class="[isSelected3 ? 'activeColor' : '']") 全部
              .btn(@click="selected(4)", :class="[isSelected4 ? 'activeColor' : '']") 长嘱
              .btn(@click="selected(5)", :class="[isSelected5 ? 'activeColor' : '']") 临嘱
        .type_box
          .row_top 类型
          .row_bottom
            .row
              .btn(@click="selectedMul('全部')", :class="[clickAll ? 'activeColor' : '']") 全部
              .btn(v-for="(item, index) in typeArr", @click="selectedMul(index)", :class="[item.click ? 'activeColor' : '']") {{item.typeName}}
      .btn_bottomBox
        .reset(@tap="reset") 重置
        .confirmed(@tap="confirmed") 确定
    .showFilter(v-show="activeAlert1")
      .selected_box(@tap="cancel")
      .tag_box(style="height:175px; bottom:0")
        .btn_box
          .left 筛选条件
          img.right(src="https://nontax-cdn.yuluoo.com/hainanhospital_icon_delete1.png", @tap="cancel")
        .type_box
          .row_top 分类
          .row_bottom
            .row
              .btn(@click="selectedReport(1)", :class="[isSelectedReport1 ? 'activeColor' : '']") 全部
              .btn(@click="selectedReport(2)", :class="[isSelectedReport2 ? 'activeColor' : '']") 检验报告
              .btn(@click="selectedReport(3)", :class="[isSelectedReport3 ? 'activeColor' : '']") 检查报告
      .btn_bottomBox
        .reset(@tap="reset") 重置
        .confirmed(@tap="confirmed") 确定
</template>

<script>
  import RPC from '../../utils/request'
  export default {
    data() {
      return {
        activeHidden: '',
        activeAlert: false,
        activeAlert1: false,
        adviceListMsg: '',
        inspectionReportListMsg: '',
        medicalHistoryListMsg: '',
        iconImg1: 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_wrong.png',
        iconImg2: 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_write.png',
        iconImg3: 'https://nontax-cdn.yuluoo.com/hainanhospital_docterServe_icon_notice.png',
        isPatient1: true,
        isPatient2: false,
        isSelected1: true,
        isSelected2: false,
        isSelected3: true,
        isSelected4: false,
        isSelected5: false,
        isSelected6: true,
        isSelected7: false,
        isSelected8: false,
        isSelectedReport1: true,
        isSelectedReport2: false,
        isSelectedReport3: false,
        activeShow1: true,
        activeShow2: false,
        activeShow3: false,
        activeDisplay: false,
        tipShow: '',
        MsgStatus: '',
        num: '',
        list: [{click: false}, {click: false}],
        click: false,
        peopleData: {},
        inspectionReportList: [], // 检查报告列表
        type: '',
        deptId: '',
        index: 0,
        visitArray: [],
        start: '',
        end: RPC.getDay(0),
        date: '',
        stateColor: '',
        typeArr: [
          {click: false, typeName: '卫材', type: 4}, {click: false, typeName: '西成药', type: 5},
          {click: false, typeName: '中成药', type: 6}, {click: false, typeName: '中草药', type: 7}, {click: false, typeName: '配方', type: 8},
          {click: false, typeName: '成套', type: 9}, {click: false, typeName: '检验', type: 'C'}, {click: false, typeName: '检查', type: 'D'},
          {click: false, typeName: '治疗', type: 'E'}, {click: false, typeName: '手术', type: 'F'}, {click: false, typeName: '麻醉', type: 'G'},
          {click: false, typeName: '护理', type: 'H'}, {click: false, typeName: '膳食', type: 'I'}, {click: false, typeName: '输血', type: 'K'},
          {click: false, typeName: '输氧', type: 'L'}, {click: false, typeName: '材料', type: 'M'}, {click: false, typeName: '其他', type: 'Z'}
        ],
        clickAll: true,
        Arr: [],
        strArr: 0, // 0、全部
        inUse: 0, // 0、全部医嘱  1、在用医嘱
        stage: 2, // 0、长嘱 1、临嘱  2、所有医嘱
        isDate: 0, // 0、所有时间  1、自定义时间
        visitId: '', // 住院次数
        startDate: '起始时间',
        endDate: '截止时间',
        childNo: -1,
        childArr: [],
        adviceListSameId: [],
        medicalHistoryList: [],
        totalCount: '',
        doctorId: '',
        deptName: '',
        reportType: ''
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
      // 弹出筛选框：
      bindVisitNumChange(event) {
        this.index = Number(event.mp.detail.value)
        this.visitId = Number(event.mp.detail.value) + 1
        console.log(Number(event.mp.detail.value))
        this.getSectionInfoRequest()
        if (this.activeShow1) {
          this.viewAdviceRequest()
        }
        if (this.activeShow2) {
          this.medicalHistoryRequest()
        }
        if (this.activeShow3) {
          this.inspectionReportList = []
          this.listInspectionReport()
        }
      },
      bindStartDateChange(event) {
        console.log(event)
        console.log(event.mp.detail.value)
        this.startDate = event.mp.detail.value
        if (this.startDate !== '起始时间' || this.endDate !== '截止时间') { // 等于的时候说明还没有选择具体日期
          this.isDate = 1
        } else {
          this.isDate = 0
        }
      },
      bindEndDateChange(event) {
        console.log(event)
        console.log(event.mp.detail.value)
        this.endDate = event.mp.detail.value
        if (this.startDate !== '起始时间' || this.endDate !== '截止时间') { // 等于的时候说明还没有选择具体日期
          this.isDate = 1
        } else {
          this.isDate = 0
        }
      },
      showAlert() {
        if (this.activeShow1) {
          this.activeAlert = true
          this.activeAlert1 = false
          this.activeHidden = 'none'
          if (this.startDate === '') { // 等于的时候说明还没有选择具体日期
            this.startDate = '起始时间'
          }
          if (this.endDate === '') {
            this.endDate = '截止时间'
          }
        } else {
          this.activeAlert = false
          this.activeAlert1 = true
          this.activeHidden = 'none'
        }
      },
      closeAlert() {
        this.activeAlert = false
        this.activeAlert1 = false
        this.activeHidden = ''
      },
      openAlert() {
        this.showAlert()
      },
      confirmed() {
        this.closeAlert()
        if (this.activeShow1) {
          if (this.startDate === '起始时间') {
            this.startDate = ''
          }
          if (this.endDate === '截止时间') {
            this.endDate = ''
          }
          this.viewAdviceRequest()
        } else {
          this.listInspectionReport()
        }
      },
      reset() {
        this.childNo = -1
        this.inUse = 0
        this.stage = 2
        this.isDate = 0
        this.strArr = 0
        this.isPatient1 = true
        this.isPatient2 = false
        for (let i = 0; i < this.childArr.length; i++) {
          this.childArr[i].click = false
        }
        this.isSelected1 = true
        this.isSelected2 = false
        this.isSelected3 = true
        this.isSelected4 = false
        this.isSelected5 = false
        this.isSelected6 = true
        this.isSelected7 = false
        this.isSelected8 = false
        for (let i = 0; i < this.typeArr.length; i++) {
          this.typeArr[i].click = false
        }
        this.clickAll = true
        this.Arr = []
        this.strArr = 0
        this.inUse = 0
        this.stage = 2
        this.isDate = 0
        this.startDate = '起始时间'
        this.endDate = '截止时间'
        this.isSelectedReport1 = true
        this.isSelectedReport2 = false
        this.isSelectedReport3 = false
        this.reportType = ''
      },
      cancel() {
        this.closeAlert()
      },
      selectedPatient(index) {
        if (index === '全部') {
          this.childNo = -1
          this.isPatient1 = true
          this.isPatient2 = false
          for (let i = 0; i < this.childArr.length; i++) {
            this.childArr[i].click = false
          }
        }
        if (index === '本人') {
          this.childNo = 0
          this.isPatient1 = false
          this.isPatient2 = true
          for (let i = 0; i < this.childArr.length; i++) {
            this.childArr[i].click = false
          }
        }
        if (index !== '全部' && index !== '本人') {
          this.childNo = index + 1
          this.isPatient1 = false
          this.isPatient2 = false
          for (let i = 0; i < this.childArr.length; i++) {
            if (index !== i) { // 单选
              this.childArr[i].click = false
            } else {
              this.childArr[index].click = true
            }
          }
        }
      },
      selected(num) {
        if (num === 1) {
          this.inUse = 0
          this.isSelected1 = true
          this.isSelected2 = false
        }
        if (num === 2) {
          this.inUse = 1
          this.isSelected2 = true
          this.isSelected1 = false
        }
        if (num === 3) {
          this.stage = 2
          this.isSelected3 = true
          this.isSelected4 = false
          this.isSelected5 = false
        }
        if (num === 4) {
          this.stage = 0
          this.isSelected4 = true
          this.isSelected3 = false
          this.isSelected5 = false
        }
        if (num === 5) {
          this.stage = 1
          this.isSelected5 = true
          this.isSelected3 = false
          this.isSelected4 = false
        }
        if (num === 6) {
          this.isDate = 0
          this.startDate = ''
          this.endDate = ''
          this.isSelected6 = true
          this.isSelected7 = false
          this.isSelected8 = false
        }
        if (num === 7) {
          this.isDate = 1
          this.startDate = RPC.getDay(0)
          this.endDate = RPC.getDay(0)
          this.isSelected7 = true
          this.isSelected6 = false
          this.isSelected8 = false
        }
        if (num === 8) {
          this.startDate = '起始时间'
          this.endDate = '截止时间'
          this.isSelected8 = true
          this.isSelected6 = false
          this.isSelected7 = false
        }
      },
      selectedMul(index) {
        if (index === '全部') {
          this.Arr = []
          this.strArr = 0
          for (let i = 0; i < this.typeArr.length; i++) {
            this.typeArr[i].click = false
          }
          this.clickAll = true
        } else {
          this.clickAll = false
          this.typeArr[index].click = !this.typeArr[index].click
          if (this.typeArr[index].click) {
            this.Arr.push(this.typeArr[index].type)
            this.strArr = this.Arr.join(',')
            console.log(this.strArr)
          } else {
            for (let i = 0; i < this.Arr.length; i++) {
              if (this.Arr[i] === this.typeArr[index].type) {
                this.Arr.splice(i, 1)
                break
              }
            }
            this.strArr = this.Arr.join(',')
            console.log(this.strArr)
          }
        }
      },
      selectedReport(num) {
        if (num === 1) {
          this.isSelectedReport1 = true
          this.isSelectedReport2 = false
          this.isSelectedReport3 = false
          this.reportType = ''
        }
        if (num === 2) {
          this.isSelectedReport1 = false
          this.isSelectedReport2 = true
          this.isSelectedReport3 = false
          this.reportType = 1
        }
        if (num === 3) {
          this.isSelectedReport1 = false
          this.isSelectedReport2 = false
          this.isSelectedReport3 = true
          this.reportType = 2
        }
      },
      changeTable(num) {
        if (num === 1) {
          this.activeShow1 = true
          this.activeShow2 = false
          this.activeShow3 = false
          this.viewAdviceRequest()
        }
        if (num === 2) {
          this.activeShow2 = true
          this.activeShow1 = false
          this.activeShow3 = false
          this.medicalHistoryRequest()
        }
        if (num === 3) {
          this.activeShow3 = true
          this.activeShow1 = false
          this.activeShow2 = false
          this.loadType = true
          this.listInspectionReport()
        }
      },
      navigateToAdviceDetail(item) {
        wx.navigateTo({
          url: '../doctor-server-adviceDetail/main?item=' + JSON.stringify(item) + '&patientName=' + this.peopleData.patientName
        })
      },
      navigateToDetail(item) {
        console.log(item)
        try {
          wx.setStorageSync('item', item)
        } catch (e) {
          console.log(e)
        }
        wx.navigateTo({
          url: '../doctor-server-patientMsg-detail/main?patientName=' + this.peopleData.patientName
        })
      },
      goInfo(item) {
        this.peopleData.name = this.peopleData.patientName
        wx.navigateTo({
          url: '../examination-detail/main?data=' + JSON.stringify(item) + '&peopleData=' + JSON.stringify(this.peopleData) + '&type=1' + '&deptId=' + this.deptId + '&doctorId=' + this.doctorId
        })
      },
      async getSectionInfoRequest() { // 查询科室
        let self = this
        self.deptName = ''
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/getSectionInfo',
            data: {
              patientId: self.peopleData.patientId,
              visitId: self.visitId
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          self.deptName = res.data.deptName
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
      async viewAdviceRequest() { // 医嘱
        wx.showLoading({title: '数据加载中', mask: true})
        let self = this
        self.adviceListMsg = ''
        self.adviceListSameId = []
        if (self.startDate === '起始时间' && self.endDate === '截止时间') {
          self.startDate = ''
          self.endDate = ''
        }
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/viewAdvice',
            data: {
              patientId: self.peopleData.patientId,
              visitId: self.visitId,
              // visitId: 1,
              // patientId: 9441233, //正式
              // patientId: 362488, // 测试
              type: self.strArr, // 0、全部
              inUse: self.inUse, // 0、全部医嘱  1、在用医嘱
              stage: self.stage, // 0、长嘱 1、临嘱  2、所有医嘱
              isDate: self.isDate, // 0、所有时间  1、自定义时间
              startDate: self.startDate,
              endDate: self.endDate,
              childNo: self.childNo // -1全部，0本人，1婴儿1，2婴儿2 。。。依次类推
            },
            type: 1
          })
          console.log('success')
          console.log(res)
          let adviceList = []
          adviceList = res.data.adviceList
          if (adviceList.length !== 0) {
            for (let i = 0; i < adviceList.length; i++) { // 根据adviceId合并医嘱内容
              let flag = false
              adviceList[i].adviceTime = adviceList[i].adviceTime.substr(2, adviceList[i].adviceTime.length - 1)
              adviceList[i].disContinueTime = adviceList[i].disContinueTime.substr(2, adviceList[i].disContinueTime.length - 1)
              if (adviceList[i].adviceRelateId !== '') {
                for (let k = 0; k < self.adviceListSameId.length; k++) {
                  if (self.adviceListSameId[k].adviceRelateId !== '') {
                    if (self.adviceListSameId[k].adviceRelateId === adviceList[i].adviceRelateId) {
                      flag = true
                      self.adviceListSameId[k].list.push(adviceList[i])
                    }
                  }
                }
                if (!flag) {
                  let a = {}
                  a.adviceRelateId = adviceList[i].adviceRelateId
                  a.list = []
                  a.list.push(adviceList[i])
                  self.adviceListSameId.push(a)
                }
              } else {
                let b = {}
                b.adviceRelateId = adviceList[i].adviceRelateId
                b.list = []
                b.color = ''
                b.list.push(adviceList[i])
                self.adviceListSameId.push(b)
              }
            }
            // console.log('xxxxxxxxxxxxx self.adviceListSameId:')
            // console.log(self.adviceListSameId)
          } else {
            self.adviceListMsg = 0
          }
        } catch (err) {
          console.log(err)
          self.adviceListMsg = 0
          if (err.errcode === 400) {
            RPC.toShow(err.errmsg)
          } else if (err.errcode === 500) {
            this.tipShow = '网络异常，请稍后再试'
            setTimeout(
              self.hideTip,
              3000
            )
            self.showTip()
          }
        }
        wx.hideLoading()
      },
      async medicalHistoryRequest() { // 电子病历
        let self = this
        self.medicalHistoryListMsg = ''
        self.medicalHistoryList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/medicalHistory/list',
            data: {
              patientID: self.peopleData.patientId,
              // patientID: 362488,
              visitID: self.visitId
            }
          })
          console.log('success')
          console.log(res)
          if (res.data.length !== 0) {
            self.medicalHistoryList = res.data
          } else {
            self.medicalHistoryListMsg = 0
          }
        } catch (err) {
          console.log(err)
          self.medicalHistoryListMsg = 0
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
      async listInspectionReport() { // 检查报告
        let self = this
        self.inspectionReportListMsg = ''
        self.inspectionReportList = []
        try {
          let res = await RPC.request({
            url: '/HospitalFormApi/doctorCertified/listInspection',
            data: {
              patientId: self.peopleData.patientId,
              visitId: self.visitId,
              // patientId: 7631414,
              // patientId: 2842359,
              // patientId: 2531,
              pageNo: 1,
              pageSize: 100,
              type: self.reportType
            }
          })
          console.log('success')
          console.log(res)
          self.totalCount = res.data.totalCount
          let datalist = res.data.inspectionReportList
          if (datalist.length !== 0) {
            for (let i = 0; i < datalist.length; i++) {
              self.inspectionReportList.push(datalist[i])
            }
          } else {
            self.inspectionReportListMsg = 0
          }
        } catch (err) {
          console.log(err)
          self.inspectionReportListMsg = 0
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
    onShow() {
    },
    onLoad(event) {
      let self = this
      self.inspectionReportList = []
      self.adviceListMsg = ''
      self.inspectionReportListMsg = ''
      self.medicalHistoryListMsg = ''
      self.activeShow1 = true
      self.activeShow2 = false
      self.activeShow3 = false
      self.activeAlert = false
      self.activeAlert1 = false
      self.activeHidden = ''
      self.activeShow = true
      self.activeShow2 = false
      self.activeShow = false
      self.type = ''
      self.num = '1'
      self.deptId = event.deptId
      self.reportType = ''
      self.inspectionReportList = []
      self.visitArray = []
      self.start = ''
      self.end = RPC.getDay(0)
      self.date = ''
      self.stateColor = ''
      self.clickAll = true
      self.Arr = []
      self.strArr = 0
      self.inUse = 0
      self.stage = 2
      self.isDate = 0
      self.visitId = ''
      self.startDate = '起始时间'
      self.endDate = '截止时间'
      self.childNo = -1
      self.childArr = []
      // 初始化筛选框
      self.isPatient1 = true
      self.isPatient2 = false
      for (let i = 0; i < self.childArr.length; i++) {
        self.childArr[i].click = false
      }
      for (let i = 0; i < self.typeArr.length; i++) {
        self.typeArr[i].click = false
      }
      self.isSelected1 = true
      self.isSelected2 = false
      self.isSelected3 = true
      self.isSelected4 = false
      self.isSelected5 = false
      self.isSelected6 = true
      self.isSelected7 = false
      self.isSelected8 = false
      self.isSelectedReport1 = true
      self.isSelectedReport2 = false
      self.isSelectedReport3 = false
      if (event.data) {
        self.peopleData = JSON.parse(event.data)
        self.visitId = Number(self.peopleData.visitId)
        self.index = self.visitId - 1
        self.getSectionInfoRequest()
        for (let i = 1; i < self.visitId + 1; i++) {
          self.visitArray.push(i)
        }
        let childNum = Number(self.peopleData.childNo)
        for (let i = 0; i < childNum; i++) {
          let obj = {}
          obj.click = false
          obj.num = i + 1
          self.childArr.push(obj)
        }
      }
      console.log('xxxxxxx childArr:')
      console.log(self.childArr)
      if (event.doctorId) {
        this.doctorId = event.doctorId
      }
      if (!self.isSelected8) { // isSelected8为true的时候是弹出日期选择框,在没有选择日期前请求时this.startDate和this.endDate需为空。
        this.startDate = ''
        this.endDate = ''
        self.viewAdviceRequest()
      } else {
        this.startDate = '起始时间'
        this.endDate = '截止时间'
      }
      console.log(self.peopleData)
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
        height 200 * rpx
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
      .examination-list
        padding-bottom 54 * rpx
        position absolute
        top 0 * rpx
        .top_box
          display inline-block
          background linear-gradient(#19C1DE,#F0EFF5)
          position fixed
          z-index 999
          height 280 * rpx
          .cardInfo
            width 720 * rpx
            background #fff
            border-radius 8px
            margin-left 16 * rpx
            padding-bottom 14 * rpx
            .row_top
              display flex
              display -webkit-flex
              justify-content space-between
              .left_box
                height 96 * rpx
                line-height 96 * rpx
                .text
                  font-size 16px
                  margin-left 32 * rpx
                  width 64 * rpx
                  text-align left
                  display inline-block
                .text-1
                  font-size 16px
                  margin-left 26 * rpx
                  font-weight bold
                  display inline-block
              .right_box
                height 96 * rpx
                line-height 96 * rpx
                position relative
                margin-right 32 * rpx
                .left
                  display inline-block
                  margin-right 16 * rpx
                  font-size 28 * rpx
                  color #C7C7CC
                  &:after
                    border 0
                .rightImg
                  width 16 * rpx
                  height 25 * rpx
                  position absolute
                  top 41 * rpx
            .row_bottom
              text-align left
              font-size 24 * rpx
              color #707070
              width 720 * rpx
              border-top 2 * rpx solid rgba(229,229,229,1)
              padding-top 16 * rpx
              .department
                display inline-block
                margin 0 48 * rpx 0 32 * rpx
              .content
                display inline-block
                font-weight bold
          .table_box
            width 750 * rpx
            margin-top 16 * rpx
            display flex
            display -webkit-flex
            justify-content space-between
            .table
              width 248 * rpx
              height 96 * rpx
              line-height 65 * rpx
              .table_des
                color #FFFFFF
                font-size 32 * rpx
              .table_line
                width 110 * rpx
                height 8 * rpx
                margin-left 68 * rpx
                background #FFFFFF
          .title_box
            display inline-block
            width 720 * rpx
            background-color #E1FBFF
            border-top-left-radius 16 * rpx
            border-top-right-radius 16 * rpx
            .box
              width 656 * rpx
              margin-left 32 * rpx
              display flex
              display -webkit-flex
              justify-content space-between
              height 80 * rpx
              line-height 80 * rpx
              .title
                color #000000
                font-size 24 * rpx
                font-weight bold
        .patientMsg_box
          display inline-block
          width 750 * rpx
          position absolute
          top 280 * rpx
          .none
            color #9999
            padding-top 50%
            text-align center
          .doctorAdvice_box
            width 720 * rpx
            background rgba(255,255,255,1)
            padding-bottom 16 * rpx
            margin-bottom 16 * rpx
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
            opacity 1
            border-bottom-right-radius 16 * rpx
            border-bottom-left-radius 16 * rpx
            display inline-block
            .msg_box
              display inline-block
              .box1
                width 720 * rpx
                text-align left
                padding-top 16 * rpx
                padding-bottom 16 * rpx
                font-size 22 * rpx
                color #000000
                display flex
                display -webkit-flex
                justify-content row
                align-items center
                border-top 2 * rpx solid rgba(159,218,229,1)
                .leftIcon
                  width 16 * rpx
                  height 16 * rpx
                  margin-left 12 * rpx
                  margin-right 4 * rpx
                .time
                  width 112 * rpx
                .content
                  .content1
                    font-size 26 * rpx
                    width 400 * rpx
                    text-align center
                    padding-top 8 * rpx
                    padding-bottom 8 * rpx
                    border-top 2 * rpx dashed rgba(159,218,229,1)
                    margin-right 16 * rpx
                  .activeBorder
                    border none
                .methods
                  width 112 * rpx
                  margin-right 16 * rpx
                  text-align center
                .rightArrow
                  width 18 * rpx
                  height 25 * rpx
                  margin-right 10 * rpx
              .activeColor1
                color #F7931E
              .activeColor2
                color #840000
              .activeColor3
                color #0000C6
              .activeDelete
                color #848284
                text-decoration line-through
              .activeColor5
                color #000000
              .activeColor6
                color #008200
              .activeColor7
                color #0082A5
              .activeColor8
                color #848284
              .activeColor9
                color #848284
              .activeColor90
                color #0082A5
              .activeColor91
                color #848284
          .none
            color #9999
            padding-top 50%
            text-align center
          .EMR_box
            display inline-block
            padding-bottom 38 * rpx
            .content_box
              width 720 * rpx
              display inline-block
              margin-bottom 16 * rpx
              background rgba(239,253,255,1)
              box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.05)
              opacity 1
              border-radius 16 * rpx
              .row_top
                width 656 * rpx
                font-size 36 * rpx
                display inline-block
                padding-top 22 * rpx
                padding-bottom 24 * rpx
                color #000000
                font-weight bold
                text-align left
                border-bottom 2 * rpx solid rgba(229,229,229,1)
              .bottom_box
                padding-top 24 * rpx
                padding-bottom 10 * rpx
                .row_bottom
                  margin-bottom 16 * rpx
                  .row
                    display flex
                    display -webkit-flex
                    text-align left
                    padding-left 32 * rpx
                  .word
                    color #000000
                    font-size 28 * rpx
                    margin-right 28 * rpx
            .activeNone
              display none
            .activeBackground
              background-color #fff
          .none
            color #9999
            padding-top 50%
            text-align center
          .examination_box
            display inline-block
            padding-bottom 38 * rpx
            .box
              width 720 * rpx
              margin-top 16 * rpx
              border-radius 8px
              background-color #EFFDFF
              text-align left
              .box-relation
                margin-left 36 * rpx
                width 648 * rpx
                border-bottom 2 * rpx solid #E5E5E5
                .name
                  font-weight bold
                  padding-top 28 * rpx
                  padding-bottom 24 * rpx
                  font-size 16px
              .box-relation-1
                margin-left 36 * rpx
                width 648 * rpx
                height 96 * rpx
                .name
                  line-height 96 * rpx
                  font-size 14px
                  color #707070
            .activeBackground
              background-color #fff
        .visitMsg_box
          top 348 * rpx
        .filter_box
          width 112 * rpx
          height 112 * rpx
          background rgba(25,193,222,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.16)
          border-radius 50%
          opacity 1
          text-align center
          position fixed
          bottom 28 * rpx
          right 30 * rpx
          .filterImg
            width 44 * rpx
            height 48 * rpx
            display inline-block
            margin-top 16 * rpx
          .filter
            color #FFFFFF
            font-size 22 * rpx
      .showFilter
        .selected_box
          position fixed
          left 0
          right 0
          top 0
          bottom 0
          opacity 0.5
          background-color rgba(0,0,0,1)
        .tag_box
          position absolute
          padding-bottom 90 * rpx
          width 750 * rpx
          background rgba(255,255,255,1)
          box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.16)
          height 1300 * rpx
          overflow-y scroll
          overflow-x hidden
          border-top-left-radius 32 * rpx
          border-top-right-radius 32 * rpx
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  // 滚动条的宽高
}
::-webkit-scrollbar-thumb {
  background: #999999;
  //滚动条颜色
  border-radius: 4px;
}
          .btn_box
            height 90 * rpx
            line-height 90 * rpx
            padding-left 30 * rpx
            padding-right 30 * rpx
            margin-bottom 22 * rpx
            display flex
            display -webkit-flex
            justify-content space-between
            align-items center
            font-size 32 * rpx
            .left
              color #000000
              font-size 36 * rpx
              font-weight bold
            .right
              width 32 * rpx
              height 32 * rpx
          .type_box
            font-size 28 * rpx
            margin-bottom 32 * rpx
            .row_top
              color #707070
              width 750 * rpx
              margin-left 32 * rpx
              margin-top 24 * rpx
              margin-bottom 24 * rpx
              text-align left
            .row_bottom
              text-align left
              width 750 * rpx
              padding-left 16 * rpx
              font-size 32 * rpx
              .row
                width 750 * rpx
                margin-bottom 16 * rpx
                .btn
                  display inline-block
                  margin-bottom 16 * rpx
                  width 160 * rpx
                  height 64 * rpx
                  line-height 64 * rpx
                  margin-left 16 * rpx
                  text-align center
                  color #000000
                  background rgba(242,242,242,1)
                  border none
                  border-radius 32 * rpx
                .activeColor
                  border 2 * rpx solid rgba(25,193,222,1)
                  width 160 * rpx
                  box-sizing border-box
                  color #19C1DE
                  background rgba(25,193,222,0.05)
          .selectDate_box
            width 720 * rpx
            padding 32 * rpx 0 32 * rpx 0
            margin-left 16 * rpx
            margin-bottom 32 * rpx
            background rgba(233,252,255,1)
            display flex
            display -webkit-flex
            justify-content space-around
            .weui_btn
              border 2 * rpx solid rgba(229,229,229,1)
              display inline-block
              width 288 * rpx
              height 64 * rpx
              line-height 64 * rpx
              border-radius 32 * rpx
              position relative
              .btn
                display inline-block
                width 288 * rpx
                height 64 * rpx
                line-height 64 * rpx
                border-radius 32 * rpx
                background #FFFFFF
                color #707070
                &:after
                  border 0
              .activeColor
                color #000000
              .arrowImg
                width 32 * rpx
                height 32 * rpx
                position absolute
                top 16 * rpx
                right 16 * rpx
            .line
              width 32 * rpx
              height 2 * rpx
              display inline-block
              margin-top 32 * rpx
              background  rgba(25,193,222,1)
        .btn_bottomBox
          width 750 * rpx
          background #fafafa
          position fixed
          bottom 0 * rpx
          display flex
          display -webkit-flex
          justify-content space-around
          font-size 36 * rpx
          height 128 * rpx
          line-height 128 * rpx
          .reset
            width 320 * rpx
            height 88 * rpx
            line-height 88 * rpx
            margin-top 24 * rpx
            margin-bottom 24 * rpx
            color #000000
            background rgba(255,255,255,1)
            border 2 * rpx solid rgba(229,229,229,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
            opacity 1
            border-radius 44 * rpx
          .confirmed
            width 320 * rpx
            height 88 * rpx
            line-height 88 * rpx
            margin-top 24 * rpx
            margin-bottom 24 * rpx
            margin-left 48 * rpx
            color #FFFFFF
            background #19C1DE
            border 2 * rpx solid rgba(229,229,229,1)
            box-shadow 0 * rpx 6 * rpx 12 * rpx rgba(0,0,0,0.1)
            opacity 1
            border-radius 44 * rpx
</style>
