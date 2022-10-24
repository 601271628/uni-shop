<template>
    <view class="search" :style="{'background-color': bgc}">
        <view class="input" :style="{'border-radius':radius}"></view>
        <view class="tip">
            <uni-icons type="search" size="17"></uni-icons>
            <text>搜索</text>
        </view>
    </view>
</template>

<script>
    export default {
        name:"my-search",
        data() {
            return {};
        },
        props:{
            bgc:{
                type:String,
                default:"#b80000"
            },
            radius:{
                type:String,
                default:'30rpx'
            }
        }
    }
</script>

<style lang="scss">
    .search{
        position: relative;
        width: 100%;
        height: 100rpx;
        // background-color: #b80000;
        text-align: center;
            
        .input{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            height: 72rpx;
            width: 720rpx;
            background-color: #ffffff;
            // border-radius: 30rpx;
        }
        .tip {
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            color: gray;
            z-index: 1;
            
            uni-icons{
                margin-right:10rpx ;
            }
        }
    }
</style>