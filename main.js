import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// axios
// import "./util/request.js"

// 老师的http
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://www.uinav.com'
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  wx.showLoading({
    title: '数据加载中...',
  })
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
}

// toast
uni.$showMessage = function(title="网络错误",duration=800){
    uni.showToast({
        title,
        duration,
        icon:'none'
    })
}
                        
const app = new Vue({
	...App
})
app.$mount()
