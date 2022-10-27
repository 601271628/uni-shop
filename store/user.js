export default{
    namespaced :true,
    state:{
        address:JSON.parse(uni.getStorageSync("address") || '{}'),
        token:'',
        // 用户的基本信息
        userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}')
    },
    mutations:{
        updateAddress(state,address){
            state.address = address
            // 保存本地
            this.commit("user/saveAddressToStorage")
        },
        // 保存本地
        saveAddressToStorage(state) {
            uni.setStorageSync('address', JSON.stringify(state.address))
        },
        // 更新用户的基本信息
        updateUserInfo(state, userinfo) {
          state.userinfo = userinfo
          // 将 userinfo 对象持久化存储到本地
          this.commit('user/saveUserInfoToStorage')
        },
        // 将 userinfo 持久化存储到本地
        saveUserInfoToStorage(state) {
          uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
        },
        // 更新 token 字符串
        updateToken(state, token) {
            state.token = token
            // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
            this.commit('user/saveTokenToStorage')
        },
        
        // 将 token 字符串持久化存储到本地
        saveTokenToStorage(state) {
            uni.setStorageSync('token', state.token)
        }
    },
    getters:{
        addStr(state,getters){
           // 拼接 省，市，区，详细地址 的字符串并返回给用户
           return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
        }
    }
}