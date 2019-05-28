// import wxAsync from './wxapipromisify'

// 全局数据
let globalData = {}

// 设置全局数据
function setGlobalData(key, data, saveStorage = false) {
  globalData[key] = data
  if (saveStorage) {
    wx.setStorageSync(key, data)
  }
}

// 获取全局数据
function getGlobalData(key) {
  console.log(globalData)
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

function timer(mSec) {
  return new Promise(resolve => setTimeout(resolve, mSec))
}

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
  setGlobalData,
  getGlobalData,
  delGlobalData,
  timer,
  SDKVersion: new SDKVersion()
}
