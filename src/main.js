import Vue from 'vue'
import App from './App'
import WxApiPromisify from './utils/wxapipromisify'

Vue.prototype.$wx = WxApiPromisify
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData
