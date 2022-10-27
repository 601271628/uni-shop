<template>
    <view class="cart">
        <view v-if="cart.length !== 0">
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
           
           <!-- 结算组件 -->
           <my-settle @chooseAll="chooseAll" :price="price" :isCheck="isCheck" @settle="settle" :disabled="disabled"></my-settle>
        </view>
       
        <!-- 空白购物车区域 -->
         <view class="empty-cart" v-else>
           <image src="/static/cart_empty@2x.png" class="empty-img"></image>
           <text class="tip-text">空空如也~</text>
         </view>
       
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
             ...mapGetters('user',['addStr']),
             ...mapState('cart',['cart']),
             ...mapGetters('cart',['goodsNum','getPrice','isCheckAll','cartIsEmpty'])
         },
         data(){
             return {
                options:[
                    {
                       text: '删除', // 显示的文本内容
                       style: { backgroundColor: '#b80000'} // 按钮的背景颜色 
                    }
                ],
                isCheck:false,
                price:0,
                disabled:false
             }
         },
        onShow() {
             // 价格
             this.price = this.getPrice
             // 全选按钮的状态  this.isCheckAll（getters）
             this.isCheck = this.isCheckAll
             // disabled
             this.disabled = this.cartIsEmpty
         },
        methods: { 
            ...mapMutations('cart',['checkedGood','goodNumChange','deleteGood','chooseAllGood']),
            // 修改购物车选中状态
           radioChange(e){
               // console.log(e);
               // 调用vuex函数修改goods_state
               this.checkedGood(e)
               //更改全选状态 this.isCheckAll（getters）
               this.isCheck = this.isCheckAll
               // 价格
               this.price = this.getPrice
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
                // 价格
                this.price = this.getPrice 
           },
           swipeActionClickHandler(goods){
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
                   // 全选
                   this.isCheck = this.isCheckAll
                   // 价格
                   this.price = this.getPrice 
                   // disabled
                   this.disabled = this.cartIsEmpty
                })
                 .catch(() => {
                   // on cancel
                });
           },
           chooseAll(isCheck){
               // 更改全选按钮的状态
               this.isCheck = isCheck
               // true全选
               this.chooseAllGood(isCheck)
               // 价格
               this.price = this.getPrice 
             },
           settle(){
                // 如果没商品 则提示
                if(this.getPrice == 0) return uni.$showMessage('请选择要结算的商品！')
                // 2. 再判断用户是否选择了收货地址
                if (!this.addStr) return uni.$showMessage('请选择收货地址！')
                // 3. 最后判断用户是否登录了
                // if (!this.token) return uni.$showMsg('请先登录！')
           }
        }
	}
</script>

<style lang="scss">
    .cart{
        padding-bottom: 50px;
    }
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
    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 150px;
    
      .empty-img {
        width: 90px;
        height: 90px;
      }
    
      .tip-text {
        font-size: 12px;
        color: gray;
        margin-top: 15px;
      }
    }
</style>
