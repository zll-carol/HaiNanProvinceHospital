/**
 * Created by scottleung on 2018/10/16.
 */
import wxAsync from './wxapipromisify'
import Utils from './index'
import CONFIG from './config'
import barcode from './barcode'

const {VERSION, APPID, DOMAIN, CODE_2_SESSIONKEY_URL, REQUEST_RETRY_TIME, SESSION_KEY_NAME, SESSION_EXPIRED_ERRCODE, SHOWTIPARRAY} = CONFIG
// 登录锁，成功登录后解除
let loginLock = false
let hasLogin = false
async function checkLoginLock() {
  /* eslint-disable */
  while (loginLock) {
    await Utils.timer(50)
  }
  return true
}

// 请求微信登录
async function login(self) {
  console.log('req login')
  await checkLoginLock()
  // 队列中等待的，一旦登录后全部返回正常
  if (hasLogin) {
    return true
  }
  loginLock = true
  try {
    let res = await wxAsync.login()
    console.log('微信请求login成功+code='+res.code)
    await sendCode(res.code)
    loginLock = false
    // 修改登录态
    hasLogin = true
    return true
  } catch (err) {
    self.hidePage()
    console.log('调起微信登录失败')
    loginLock = false
    throw err
  }
}

// 发送登录code到后台换取sessionKey
async function sendCode(code) {
  try {
    let res = await request({
      url: CODE_2_SESSIONKEY_URL,
      data: {
        appid: APPID,
        code: code
      },
      needLogin: false
    })

    if (res.errcode === 0) {
      console.log(`send code res:`, res)
      Utils.setGlobalData(SESSION_KEY_NAME, res[SESSION_KEY_NAME], true)
      return res
    } else {
      let msg = 'code2session sendCode fail - errcode != 0'
      console.log(msg)
      throw new Error(msg)
    }
  } catch (err) {
    console.log('code2session fail', err)
    throw err
  }
}

// 登录态
async function loginState() {
  console.log('check loginState')
  let sessionKey = Utils.getGlobalData(SESSION_KEY_NAME)
  // let sessionKey = ''
  if (!sessionKey) {
    console.log('loginState no sessionKey', sessionKey)
    await login()
  }
  return true
}

async function request(param) {
  // 传type=1进来不显示等待框
  if(param.type){
  }else{
    wxAsync.showLoading({title: '数据加载中', mask: true})
  }
  let reqData = JSON.parse(JSON.stringify(param))
  // let page = getCurrentPages()
  // console.log('当前页面：' + page[page.length-1].route)
  if (!reqData.data) {
    reqData.data = {}
  }
  if (!reqData.url) {
    throw new Error('request required url')
  }
  let diyDomain = false
  if (reqData.url.indexOf('https://') !== 0) {
    reqData.url = DOMAIN + reqData.url
  } else {
    diyDomain = true
  }
  reqData.method = reqData.method || 'POST'
  reqData.data.appid = APPID
  reqData.data.version = VERSION

  param._time = (param._time + 1) || 1

  if (param._time > REQUEST_RETRY_TIME) {
    throw new Error('request over retry times')
  }

  if (param.needLogin !== false) {
    await loginState()
    // 需要重新设置一下sessionKey
    if (!reqData.header) {
      reqData.header = {}
    }
    reqData.header[SESSION_KEY_NAME] = Utils.getGlobalData(SESSION_KEY_NAME)
    reqData.data[SESSION_KEY_NAME] = Utils.getGlobalData(SESSION_KEY_NAME)
    // reqData.header[SESSION_KEY_NAME] = 2
    // reqData.data[SESSION_KEY_NAME] = 2
    // reqData.data.session_iv = Utils.getGlobalData('sessionIv')
  }

  let selfThrow = false
  console.log('reqData, param:', reqData, param)
  try {
    let res = await wxAsync.request(reqData)
    console.log('请求成功', res)
    if(param.type){
    }else{
      wxAsync.hideLoading()
    }
    // 如果是自定义域名，返回一律自行处理
    if (diyDomain) {
      return res
    }
    if (res.statusCode && res.statusCode !== 200) {
      console.log('statusCode is ' + res.statusCode)
      // 调用微信api报错
      await wxAsync.showModal({
        confirmColor: '#19C1DE',
        title: '网络错误',
        content: '请稍后重试'
      })
      throw new Error(`status code error: ${res.statusCode}`)
    }
    if (res.data.errcode === SESSION_EXPIRED_ERRCODE) {
      // 未登录
      console.log('session_key expired')
      // 修改登录状态
      hasLogin = false
      Utils.delGlobalData(SESSION_KEY_NAME)
      return request(param)
    } else if (res.data.errcode === 404) {
      // 过期，重新请求微信登陆
      // 修改登录状态
      hasLogin = false
      await login()
      // return request(param)
      // let pages = getCurrentPages()
      // let page = pages[pages.length-1].route
      // 如果在首页，就返回首页，不在首页就不做操作，避免用户感知重新登陆
      // if (page === 'pages/index/main') {
      //   return await wxAsync.reLaunch({
      //     url: '/pages/index/main'
      //   })
      // }
    }
    if (res.data.errcode !== 0) {
      selfThrow = true
      // 请求返回值不是正常
      throw res.data
    }
    return res.data
  } catch (e) {
    if(param.type){
    }else{
      wxAsync.hideLoading()
    }
    if (selfThrow) {
      throw e
    } else {
      toShow('请求失败,请稍后再试！')
      console.log('请求失败', e)
      // return request(param)
    }
  }
}

async function uploadFile(param) {
  let reqData = JSON.parse(JSON.stringify(param))
  if (!reqData.url) {
    throw new Error('request required url')
  }
  let diyDomain = false
  if (reqData.url.indexOf('https://') !== 0) {
    reqData.url = DOMAIN + reqData.url
  } else {
    diyDomain = true
  }
  reqData.method = reqData.method || 'POST'

  param._time = (param._time + 1) || 1

  if (param._time > REQUEST_RETRY_TIME) {
    throw new Error('request over retry times')
  }

  if (param.needLogin !== false) {
    await loginState()
    // 需要重新设置一下sessionKey
    if (!reqData.header) {
      reqData.header = {}
    }
    reqData.header[SESSION_KEY_NAME] = Utils.getGlobalData(SESSION_KEY_NAME)
    // reqData.data.session_iv = Utils.getGlobalData('sessionIv')
  }

  console.log('reqData, param:', reqData, param)
  try {
    let res = await wxAsync.uploadFile(reqData)
    res.data = JSON.parse(res.data)
    console.log('请求成功', res)
    // 如果是自定义域名，返回一律自行处理
    if (diyDomain) {
      return res
    }
    if (res.statusCode && res.statusCode !== 200) {
      console.log('statusCode is ' + res.statusCode)
      // 调用微信api报错
      await wxAsync.showModal({
        confirmColor: '#19C1DE',
        title: '网络错误',
        content: '请稍后重试'
      })
      throw new Error(`status code error: ${res.statusCode}`)
    }
    if (res.data.errcode === SESSION_EXPIRED_ERRCODE) {
      // 未登录
      console.log('session_key expired')
      // 修改登录状态
      hasLogin = false
      Utils.delGlobalData(SESSION_KEY_NAME)
      return uploadFile(param)
    } else if (res.data.errcode === 403) {
      // 登陆过期
      return await wxAsync.reLaunch({
        url: '/pages/login/main'
      })
    }
    if (res.data.errcode !== 0) {
      // 请求返回值不是正常
      throw res.data
    }
    return res.data
  } catch (e) {
    console.log('请求失败', e)
    // return uploadFile(param)
    throw e
  }
}

function wxLocation (name, address, lat, lon) {
  wx.openLocation({//​使用微信内置地图查看位置。
    latitude: Number(lat),//要去的纬度-地址
    longitude: Number(lon),//要去的经度-地址
    name: name,
    address: address
  })
}

// 把数字转换成条形码
function toBarcode (canvasId, code, width, height) {
  barcode.code128(wx.createCanvasContext(canvasId), code, width, height);
}

// 提示his返回的错误信息
function toShow (message) {
  if(message){
    wx.showModal({
      title: '提示',
      content: message,
      confirmText: '确认',
      confirmColor: '#19C1DE',
      showCancel: false,
      success(res) {
        console.log(res)
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
}

// 格式化时间 yyyy-MM-dd
function getTime (time) {
  let yue = time.getMonth() + 1
  let ri = ''
  if (yue < 10) {
    yue = '0' + yue
  }
  if (time.getDate() < 10) {
    ri = '0' + time.getDate()
  } else {
    ri = time.getDate()
  }

  let date = time.getFullYear() + '-' + yue + '-' + ri
  return date
}

// 建行支付
async function JHpay(wxCallbackUrl, price, orderNo, type, patientId) {
  // url = '/HospitalFormApi/bill/prepay' 商户支付
  // url = '/HospitalFormApi/ccb/order'  建行支付
  wxAsync.showLoading({title: '请求支付，请稍后', mask: true})
  console.log(DOMAIN + '/HospitalFormApi')
  try {
    let res = await request({
      url: '/HospitalFormApi/ccb/order',
      data: {
        // payment: 0.01,
        payment: price,
        orderNo: orderNo,
        // orderNo: '12345678',
        patientId: patientId
      }
    })
    console.log('success')
    console.log(res)
    wxPay(res.data.prepayInfo, orderNo, type)
  } catch (err) {
    wxAsync.showModal({
      confirmColor: '#19C1DE',
      title: '支付异常',
      content: '请稍后重试'
    })
    console.log(err)

  }
  wxAsync.hideLoading()
}

// 请求后台订单数据
async function pay(wxCallbackUrl, price, orderNo, type, patientId) {
  // url = '/HospitalFormApi/bill/prepay' 商户支付
  // url = '/HospitalFormApi/ccb/order'  建行支付
  wxAsync.showLoading({title: '请求支付，请稍后', mask: true})
  console.log(DOMAIN + '/HospitalFormApi')
  try {
    let res = await request({
      url: '/HospitalFormApi/bill/prepay',
      data: {
        notify_url: DOMAIN + '/HospitalFormApi' + wxCallbackUrl,
        source: '',
        // total_fee: 0.01,
        total_fee: price,
        orderNo: orderNo,
        patientId: patientId
      }
    })
    console.log('success')
    console.log(res)
    wxPay(res.data, orderNo, type)
  } catch (err) {
    wxAsync.showModal({
      confirmColor: '#19C1DE',
      title: '支付异常',
      content: '请稍后重试'
    })
    console.log(err)

  }
  wxAsync.hideLoading()
}

// 拉起支付
// type=1是挂号  2是门诊缴费  3是住院预缴 4是药品配送
function wxPay(data, orderNo, type) {
  // console.log(data.signType)
  wx.requestPayment({
    timeStamp: data.timeStamp,
    // timeStamp: '1552889891',
    nonceStr: data.nonceStr,
    // nonceStr: 'YgzybBDxZS2C4XITVZaMCIdhRfJlnuwE',
    package: data.package,
    // package: 'prepay_id=wx181418117829434221b56a0d0202662602',
    // signType: 'RSA',
    signType: data.signType,
    paySign: data.paySign,
    // paySign: 'Cj9SEPil9rSPHRROrjvFYCVShFHNjcfE2l+B1V9jvbC5RpSI0QfDlKnzRiRr6Nsg5LjXJuIYXLXqfADYznyNP+pvFY2+xG8T+7sinQbdgZNheBBlFyYRjlFqCHKkXiUiII5YoX3rdrt07p5EMDSaMAYx0KY1/p2WkmNkyUoPsek8rFechno5y4999yyFu28hf35+naS9UplTtINvei406Itkegdq3ArCkpAPMtGWeKoV/FvjlBM7xm5mPkW/wX79ofUfBth0ebc5kdbQauaNKa19c++P7NIovSs9lZ7SxsivkfMiB23c+Zx7AqP/CUtZyO2wcsvhT8p993yMr6qtYw==',
    success: function (res) {
      // success
      console.log(res)
      let param = {}
      param.orderNo = orderNo
      if (type === 1) {
        // 跳转详情页面
        wx.redirectTo({
          url: '/pages/guahaoRecord-detail/main?param=' + JSON.stringify(param)
        })
      } else if (type === 2) {
        // 返回缴费记录列表页面
        wx.showToast({title: '缴费成功！'})
        wxAsync.redirectTo({
          url: '/pages/paymentRecord-list/main'
        })
      } else if (type === 3){
        toShow('缴费成功！')
      } else if (type === 4) {
        // 返回上一个页面,并传值
        toPageData(1)
      } else {
        wx.navigateBack()
      }
    },
    fail: function (res) {
      // fail
      console.log(res)
    }
  })
}

// 获取传入day的具体日期，day为天数
function getDay(day){
  let today = new Date()
  let targetday_milliseconds=today.getTime() + 1000*60*60*24*day
  today.setTime(targetday_milliseconds)
  let tYear = today.getFullYear()
  let tMonth = today.getMonth()
  let tDate = today.getDate()
  tMonth = doHandleTime(tMonth + 1)
  tDate = doHandleTime(tDate)
  return tYear+'-'+tMonth+'-'+tDate
}
function doHandleTime(param){
  let time = param
  if(param.toString().length == 1){
    time = '0' + param
  }
  return time
}
// 保留两位小数
function toDecimal2(x) {
  let f = parseFloat(x)
  if (isNaN(f)) {
    return false
  }
  let f1 = Math.round(x*100)/100
  let s = f1.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

// 传值给上一个页面
function toPageData(data) {
  let pages = getCurrentPages()
  let prevPage = pages[pages.length - 2]
  console.log(prevPage)
  prevPage.setData({data: data})
  wx.navigateBack()
  // 获取方法 this.$mp.page.data.data
}

// 收藏医生
async function collectDoctor(data) {
  try {
    let res = await request({
      url: '/HospitalFormApi/collectDoctor/collect',
      data: data
    })
    console.log('success')
    console.log(res)
    return 1
  } catch (err) {
    console.log(err)
    return 0
  }
}
// 是否收藏
async function collectgetOrNot(id) {
  try {
    let res = await request({
      url: '/HospitalFormApi/collectDoctor/getByDoctorId',
      data: {
        doctorId: id
      }
    })
    console.log('success')
    console.log(res)
    return 1
  } catch (err) {
    console.log(err)
    return 0
  }
}
// 取消收藏
async function notCollectget(id) {
  try {
    let res = await request({
      url: '/HospitalFormApi/collectDoctor/cancelCollect',
      data: {
        doctorId: id
      }
    })
    console.log('success')
    console.log(res)
    return 1
  } catch (err) {
    return 0
    console.log(err)
  }
}

function phone(num){
  wx.makePhoneCall({
    phoneNumber: num,
    success: function () {
    },
    fail: function () {
    }
  })
}

// 头部提示
// index=0 请输入姓名  1请选择关系  2请输入正确的身份证号码  3请输入小孩姓名   4请输入手机号    5请输入正确的手机号   6请输入验证码
// 7请输入正确的验证码  8请选择绑定方式  9请选择就诊人类型    10网络异常，请稍后再试    11请输入地址   12发送验证码失败 13请完善监护人信息
// 14请输入身份证号码  15请输入退款账号户名  16请输入退款银行账号  17请输入开户行
function tipShowText(index){
  return SHOWTIPARRAY[index]
}

function autoUpdate() {
  console.log('zzzzzzz aotoupdate')
  let self = this
  // 获取小程序更新机制兼容
  if (wx.canIUse('getUpdateManager')) {
    let updateManager = wx.getUpdateManager()
    //1. 检查小程序是否有新版本发布
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        wx.showModal({
          title: '更新提示',
          content: '检测到新版本，是否下载新版本并重启小程序？',
          confirmColor: '#19C1DE',
          success: function (res) {
            if (res.confirm) {
              //2. 用户确定下载更新小程序，小程序下载及更新静默进行
              self.downLoadAndUpdate(updateManager)
            } else if (res.cancel) {
              //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗
              wx.showModal({
                title: '温馨提示',
                content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦',
                showCancel: false,
                confirmText: "确定更新",
                confirmColor: '#19C1DE',
                success: function (res) {
                  if (res.confirm) {
                    //下载新版本，并重新应用
                    self.downLoadAndUpdate(updateManager)
                  }
                }
              })
            }
          }
        })
        updateManager.onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}
function downLoadAndUpdate(updateManager){
  wx.showLoading()
  //静默下载更新小程序新版本
  updateManager.onUpdateReady(function () {
    wx.hideLoading()
    //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.applyUpdate()
  })
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
    wx.showModal({
      title: '提示',
      content: '新版本已上线，但下载失败，请检查网络设置或删除当前小程序，重新搜索打开哟',
    })
  })
}

export default {
  phone,
  JHpay,
  notCollectget,
  collectgetOrNot,
  collectDoctor,
  toPageData,
  tipShowText,
  toShow,
  toDecimal2,
  getDay,
  pay,
  wxPay,
  getTime,
  toBarcode,
  wxLocation,
  request,
  login,
  sendCode,
  loginState,
  uploadFile,
  autoUpdate,
  downLoadAndUpdate
}
