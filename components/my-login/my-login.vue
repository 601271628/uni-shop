<template>
    <view class="login-container">
        <!-- 提示登录的图标 -->
        <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
        <!-- 登录按钮 -->
        <button class="btn-login" @click="handlerLogin">一键登录</button>
        <!-- 登录提示 -->
        <view class="tips-text">登录后尽享更多权益</view>
    </view>
</template>

<script>
    import { mapMutations } from 'vuex'
    export default {
        name:"my-login",
        methods:{
            ...mapMutations('user', ['updateUserInfo','updateToken']),
            handlerLogin(){
                // 获取微信信息的登录api (await async也行)
                uni.getUserProfile({
                    desc:'获取微信用户的昵称与头像',
                    success:(res)=>{
                        console.log(res);
                        // 将用户的基本信息存储到 vuex 中
                        this.updateUserInfo(res.userInfo)
                        
                         // 登录login获取token
                         this.getToken(res) //传入用户信息数据
                     },
                     fail:(err)=>{
                         uni.$showMessage('您取消了登录授权！')
                     }
                })
            },
           async getToken(userInfo){
                 // 调用微信登录接口 过去登陆成功的code
                uni.login({
                    success: (loginRes) => {
                        console.log(loginRes);
                        // 准备userinfo参数
                        const query = {
                             code: loginRes.code,
                             encryptedData: userInfo.encryptedData,
                             iv: userInfo.iv,
                             rawData: userInfo.rawData,
                             signature: userInfo.signature
                        }
                        // 小程序内部的方法获取openid（token）
                        // wx.request({
                        //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=xxx&secret=xxx&js_code=' + loginRes.code + '&grant_type=authorization_code',
                        //     success: res => {
                        //         console.log(res);
                        //         console.log("用户的openid:" + res.data.openid); //ozYDE5QVLkrJlYtzMROXlNJVg14Q
                        //         app.globalData.openid= res.data.openid;
                        //     }
                        // })
                        // 根据query生成token（这个接口坏了）
                       uni.$http.post('/api/public/v1/users/wxlogin', query).then(tokenRes=>{
                           // console.log(tokenRes);
                           this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
                           uni.$showMessage('登录成功！')
                       })
                    },
                    fail: (err) => {
                        uni.$showMessage('登陆失败！')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .login-container {
      // 登录盒子的样式
      height: 750rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
      position: relative;
      overflow: hidden;
    
      // 绘制登录盒子底部的半椭圆造型
      &::after {
        content: ' ';
        display: block;
        position: absolute;
        width: 100%;
        height: 80rpx;
        left: 0;
        bottom: 0;
        background-color: white;
        border-radius: 100%;
        transform: translateY(50%);
      }
    
      // 登录按钮的样式
      .btn-login {
        width: 90%;
        border-radius: 200rpx;
        margin: 30rpx 0;
        color: #f8f8f8;
        background-color: #c00000;
      }
    
      // 按钮下方提示消息的样式
      .tips-text {
        font-size: 24rpx;
        color: gray;
      }
    }
</style>