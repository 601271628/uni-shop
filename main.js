import Vue from 'vue'
import App from './App'
import store from "./store/store.js"

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
    console.log(options);
    wx.showLoading({
        title: '数据加载中...',
    })
    // 判断请求的是否为有权限的 API 接口
    console.log("权限：",options.url.indexOf('/my/') !== -1);
    if (options.url.indexOf('/my/') !== -1) {
        // 为请求头添加身份认证字段
        options.header = {
          // 字段的值可以直接从 vuex 中进行获取
          Authorization: store.state.user.token,
        }
    }

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
	...App,
    store
})
app.$mount()
