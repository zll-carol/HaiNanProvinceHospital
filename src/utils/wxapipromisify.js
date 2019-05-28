function promisify(method, options = {}) {
  return new Promise((resolve, reject) => {
    // 将options对象赋值 然后再传给下面调用的方法中
    options.success = resolve
    options.fail = err => reject(err)
    wx[method](options)
  })
}

function genWxPromiseApi() {
  let apis = {}
  for (let funcName in wx) {
    apis[funcName] = options => promisify(funcName, options)
  }
  return apis
}

export default genWxPromiseApi()
