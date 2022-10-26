<template>
    <view >
        <!-- 收货地址 -->
        <my-address></my-address>
        
       <!-- 标题 -->
       <view class="cart-title">
             <uni-icons type="shop" size="18"></uni-icons>
             <text class="cart-title-text">购物车</text>
       </view>
       <!-- 购物车列表 -->
       <block v-for="(goods, index) in cart" :key="index">
            <uni-swipe-action>
                <uni-swipe-action-item :options="options"  @click="swipeActionClickHandler(goods)">
                    <my-goods :goods="goods" :showRadio="true" :showNum="true" 
                            @radio-change="radioChange" @num-change="numChange"></my-goods>
                </uni-swipe-action-item>
            </uni-swipe-action>
       </block>
       
       <!-- 删除确认框 -->
       <van-dialog id="van-dialog" />
    </view>
</template>

<script>
    import badgeMix from '@/mixins/tabbar-badge.js'
    import {mapState,mapMutations,mapGetters} from "vuex"
    import Dialog from "@/wxcomponents/vant/dist/dialog/dialog.js"
    
    export default {
        // 混入设置购物车数字的mixins
         mixins: [badgeMix],
         computed:{
             ...mapState('cart',['cart']),
             ...mapGetters('cart',['goodsNum'])
         },
         data(){
             return {
                options:[
                    {
                       text: '删除', // 显示的文本内容
                       style: { backgroundColor: '#b80000'} // 按钮的背景颜色 
                    }
                ],
             }
         },
        methods: { 
            ...mapMutations('cart',['checkedGood','goodNumChange','deleteGood']),
            // 修改购物车选中状态
           radioChange(e){
               // console.log(e);
               // 调用vuex函数修改goods_state
               this.checkedGood(e)
           },
           numChange(e){
               // console.log(e);
                // 调用vuex函数修改goods_count
                this.goodNumChange(e)
                // 修改购物车图标上的数字(this.goodsNum 混入进来的)
                uni.setTabBarBadge({
                    index:2,
                    text:''+this.goodsNum
                })
           },
           swipeActionClickHandler(goods){
               console.log(goods);
               // dialog
               Dialog.confirm({
                 title: '确定删除该商品？',
               }).then(() => {
                   // 删除
                   this.deleteGood(goods.goods_id)
                   // 获取新数目
                   uni.setTabBarBadge({
                       index:2,
                       text:''+this.goodsNum
                   })
                   uni.showToast({
                       title:"删除成功",
                       icon:"none"
                   })
                })
                 .catch(() => {
                   // on cancel
                });
           }
        }
	}
</script>

<style lang="scss">
    .cart-title {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        padding-left: 10rpx;
        border-bottom: 2rpx solid #efefef;
        
        .cart-title-text {
            margin-left: 10px;
        }
    }
</style>
