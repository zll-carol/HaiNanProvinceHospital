/**
 * Created by leungs_leon on 2018/10/15.
 */
import wxAsync from './wxapipromisify'
import CONFIG_INFO from './config'

// const CONFIG_INFO = wx.getExtConfigSync()
// 小程序配置信息
const CODE_2_SESSIONKEY_URL = CONFIG_INFO.CODE_2_SESSIONKEY_URL
// const DOMAIN = CONFIG_INFO.domain
const DOMAIN = CONFIG_INFO.domain

// 小程序版本号
// const VERSION = CONFIG_INFO.version
// 小程序名称
const APPID = CONFIG_INFO.appid
const PORT = CONFIG_INFO.port

// 积分商城货架id
// const SHELF_ID = CONFIG_INFO.shelfId
const REQUEST_RETRY_TIME = 3

// 登录锁，成功登录后解除
let loginLock = false

// 请求队列，当需要登录但登录信息未返回时，进入队列，检测到返回完毕后，执行队列中请求
let requestQueue = []

// 全局数据
let globalData = {
  facadeId: ''
}

// 队列监听者
function requestQueueWatcher() {
  // console.log(requestQueue.length)
  if (!loginLock && requestQueue.length > 0) {
    let callback = requestQueue.splice(0, 1)
    while (callback.length > 0 && !!callback[0]) {
      console.log('requestQueueWatcher callback ok')
      callback[0].resolve()
      callback = requestQueue.splice(0, 1)
    }
  }
  setTimeout(requestQueueWatcher, 50)
}

// 设置全局数据
function setGlobalData(key, data, saveStorage = false) {
  globalData[key] = data
  if (saveStorage) {
    wx.setStorage({
      key,
      data
    })
  }
}

// 获取全局数据
function getGlobalData(key) {
  let data = globalData[key]
  if (data) {
    return data
  } else {
    data = wx.getStorageSync(key)
    if (data) {
      setGlobalData(key, data)
    }
    return data
  }
}

// 删除全局数据
function delGlobalData(key) {
  delete globalData[key]
  wx.removeStorageSync(key)
}

// 请求微信登录
function login() {
  console.log('req login')
  return new Promise(async (resolve, reject) => {
    requestQueue.push({
      resolve,
      reject
    })
    if (loginLock) {
      console.log('loginLock, return false')
      return false
    }
    // 登录信息锁锁上
    loginLock = true
    try {
      let res = await wxAsync.login()
      console.log('微信请求login成功')
      try {
        await sendCode(res.code)
        console.log('send code suc - callback')
      } catch (err) {
        console.log('send code fail - callback')
      }
    } catch (err) {
      console.log('调起微信登录失败')
      reject(err)
    } finally {
      console.log('set loginLock = false')
      loginLock = false
    }
  })
}

// 发送登录code到后台换取sessionKey
function sendCode(code) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await request({
        url: CODE_2_SESSIONKEY_URL,
        data: {
          _port: '11157',
          appid: APPID,
          code: code
        },
        needLogin: false
      })

      if (res.errcode === 0) {
        console.log(res)
        setGlobalData('sessionKey', res.session_key, true)
        resolve(res)
      } else {
        let msg = 'code2session sendCode fail - errcode != 0'
        console.log(msg)
        reject(msg)
      }
    } catch (err) {
      console.log('code2session fail', err)
      reject(err)
    }
  })
}

// 登录态
async function loginState() {
  return new Promise(async (resolve, reject) => {
    let sessionKey = getGlobalData('sessionKey')
    if (sessionKey) {
      console.log('loginState has sessionKey')
      resolve()
    } else {
      console.log('loginState no sessionKey', sessionKey)
      try {
        await login()
        console.log('loginState try login suc')
        resolve()
      } catch (err) {
        console.log('loginState try login fail')
        reject(err)
      }
    }
  })
}

// rpc
async function request(param) {
  // 处理参数到interface
  // let reqData = JSON.parse(JSON.stringify(param))
  let reqData = param
  // 防止data对象不存在
  reqData.data = reqData.data || {}
  console.log('url =>', reqData.url)
  // if (reqData.data._uri !== reqData.url) {
  //   reqData.data._uri = reqData.url
  //   reqData.url = DOMAIN + CODE_2_SESSIONKEY_URL
  // }
  reqData.url = DOMAIN + reqData.url

  reqData.header = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  // if (reqData.url.indexOf(CODE_2_SESSIONKEY_URL) !== -1) {
  //   reqData.url = DOMAIN + reqData.url
  // }
  reqData.method = reqData.method || 'POST'
  reqData.data.appid = APPID
  // reqData.data.facade_id = getGlobalData('facadeId') || ''
  // reqData.data.facadeid = getGlobalData('facadeId') || ''
  // reqData.data.shelf_id = SHELF_ID
  // reqData.data.version = VERSION
  reqData.data._port = reqData.data._port || PORT
  // reqData.data.session_key = getGlobalData('sessionKey')

  param._time = param._time ? param._time + 1 : 1

  if (param._time > REQUEST_RETRY_TIME) {
    return new Promise((resolve, reject) => {
      reject(new Error())
    })
  }

  console.log(reqData)

  return new Promise(async (resolve, reject) => {
    if (param.needLogin !== false) {
      try {
        await loginState()
        // 需要重新设置一下sessionKey
        reqData.data.session_key = getGlobalData('sessionKey')
        // reqData.data.session_iv = getGlobalData('sessionIv')
      } catch (err) {
        reject(err)
        return false
      }
    }

    try {
      let res = await wxAsync.request(reqData)
      console.log('请求成功', res)
      if (res.statusCode && res.statusCode !== 200) {
        console.log('statusCode is ' + res.statusCode)
        // 调用微信api报错
        await wxAsync.showModal({
          title: '网络错误',
          content: '请稍后重试'
        })
        reject(res)
        return false
      }
      if (res.data.errcode === 401) {
        // 未登录
        console.log('session_key expired')
        delGlobalData('sessionKey')
        try {
          await loginState(true)
          try {
            let res = await request(param)
            resolve(res)
          } catch (res) {
            reject(res)
          }
        } catch (err) {
          reject(err)
        }
        return false
      }
      if (res.data.errcode !== 0) {
        // 请求返回值不是正常
        reject(res.data)
        return false
      }
      resolve(res.data)
    } catch (e) {
      console.log('请求失败', e)
      try {
        let res = await request(param)
        resolve(res)
      } catch (res) {
        reject(res)
      }
    }
  })
}

function getItemByList(list, key, value) {
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][key] === value) {
        return list[i]
      }
    }
  }
  return null
}

// 执行轮询
requestQueueWatcher()

// 无法比较1.1.0以下的版本
class SDKVersion {
  systemInfo = {}

  constructor() {
    this.systemInfo = wx.getSystemInfoSync()
  }

  isEqual(version) {
    return this.systemInfo.SDKVersion === version
  }

  isLessThan(version) {
    let version1 = this.systemInfo.SDKVersion
    let version2 = version
    // 如果systeminfo里没有该字段，证明在1.1.0以下，无法比较，默认返回true
    if (!version1) {
      return true
    }
    version1 = version1.split('.')
    version2 = version2.split('.')
    for (let i = 0; i < 3; i++) {
      if (version1[i] * 1 < version2[i] * 1) {
        return true
      } else if (version1[i] * 1 > version2[i] * 1) {
        return false
      }
    }
    return false
  }

  isGreaterThan(version) {
    return !(this.isLessThan(version) || this.isEqual(version))
  }
}

export default {
  request,
  login,
  setGlobalData,
  getGlobalData,
  delGlobalData,
  getItemByList,
  SDKVersion: new SDKVersion()
}
