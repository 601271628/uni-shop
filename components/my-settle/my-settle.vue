<template>
    <view>
       <van-submit-bar
         :price="price * 100"
         button-text="结算"
         @submit="onClickButton"
        >
            <radio :checked="isCheck" color="#1989fa" @click="clickChooseAll" :disabled="disabled"/><text>全选</text>
       </van-submit-bar>
    </view>
</template>

<script>
    export default {
        name:"my-settle",
        props:{
            price:{
                type:Number,
                default:0
            },
            isCheck:{
                type:Boolean,
                default:false
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            clickChooseAll(){
                this.$emit("chooseAll",!this.isCheck)  
            },
            onClickButton(){
                 this.$emit("settle")  
            }
        }
    }
</script>

<style lang="scss">

</style>