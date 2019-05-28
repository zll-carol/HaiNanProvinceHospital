/**
 * Created by leungs_leon on 2018/10/15.
 */
// const dev = { // 省医院测试appid
//   APPID: 'wxaf523e92543fbcd6',
//   // DOMAIN: 'https://team.yuluoo.com'
//   // 10.2.12.80
//   // DOMAIN: 'http://f1707n6052.51mypc.cn:30852'
//   DOMAIN: 'https://hnsyy.yuluoo.com'
//   // DOMAIN: 'https://hnyy-test.yuluoo.com'
//   // DOMAIN: 'http://10.2.12.159:8100'
//   // DOMAIN: 'http://10.2.12.73:8100'
//   // DOMAIN: 'https://minipro.phhp.com.cn'
// }

const JHdev = { // 玉螺测试appid
  APPID: 'wx38b54a0b2583fd54',
  // DOMAIN: 'https://team.yuluoo.com'
  // 10.2.12.80
  // DOMAIN: 'http://f1707n6052.51mypc.cn:30852'
  DOMAIN: 'https://hnsyy.yuluoo.com'
  // DOMAIN: 'https://hnyy-test.yuluoo.com'
  // DOMAIN: 'http://10.2.12.159:8100'
  // DOMAIN: 'http://10.2.12.73:8100'
  // DOMAIN: 'https://minipro.phhp.com.cn'
}

const prd = {
  APPID: 'wx5de169bfa1adc42c',
  DOMAIN: 'https://minipro.phhp.com.cn'
}

// let mode = 'dev'
// let info = mode === 'dev' ? dev : prd

let mode = 'JHdev'
let info = mode === 'JHdev' ? JHdev : prd

export default {
  ...info,
  CODE_2_SESSIONKEY_URL: '/HospitalFormApi/login/wxlogin',
  POST_USER_INFO_URL: '/session/save-user-info',
  NAME: '海南省人民医院',
  REQUEST_RETRY_TIME: 1,
  SESSION_KEY_NAME: 'sessionKey',
  SESSION_EXPIRED_ERRCODE: 402,
  VERSION: 'v0.0.1',
  SHOWTIPARRAY: ['请输入姓名', '请选择关系', '请输入正确的身份证号码', '请输入小孩姓名',
    '请输入手机号', '请输入正确的手机号', '请输入验证码', '请输入正确的验证码', '请选择绑定方式',
    '请选择就诊人类型', '网络异常，请稍后再试', '请输入地址', '发送验证码失败', '请完善监护人信息',
    '请输入身份证号码', '请输入退款账号户名', '请输入退款银行账号', '请输入开户行']
}
