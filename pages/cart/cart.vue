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
             ...mapState('user',['token']),
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
            showTip(n){
                // 调用 uni.showToast() 方法，展示提示消息
                uni.showToast({
                    title: `请登录后再结算！${n}秒后自动跳转到登录页...`,
                    icon: 'none',
                    // 为页面添加透明遮罩，防止点击穿透
                    mask: true,
                    duration: 1500
                })
            },
           settle(){
                // 1.如果没商品 则提示
                if(this.getPrice == 0) return uni.$showMessage('请选择要结算的商品！')
                // 2. 最后判断用户是否登录了
                if (!this.token){
                    let n = 3
                    this.showTip(n)
                    let timer = setInterval(()=>{
                        n--
                        if(n==0) {
                            clearInterval(timer)
                            return uni.switchTab({
                                url:"/pages/my/my"
                            })
                        }
                        this.showTip(n)
                    },1000)
                    // 3秒后跳转到登录页面
                    return 
                } 
                // 3. 再判断用户是否选择了收货地址
                if (!this.addStr) return uni.$showMessage('请选择收货地址！')
                
                 // 4. 实现微信支付功能
                this.payOrder()
           },
           async payOrder(){
                console.log(this.getPrice);
                // 1.1 组织订单的信息对象
                const orderInfo = {
                   order_price: 0.01,
                   consignee_addr: this.addStr,
                   goods: this.cart.filter(x => x.goods_state).map(x => ({
                       goods_id: x.goods_id,
                       goods_number: x.goods_count,
                       goods_price: x.goods_price 
                    }))
                }
                // 1 创建订单
                const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
                console.log(res);  //这里使用评论区的token （自己写的）
                if (res.meta.status !== 200) return uni.$showMessage('创建订单失败！')
                
                // 2 得到服务器响应的“订单编号”
                // const orderNumber = 'GD20180507000000000110'
                const orderNumber = res.message.order_number
                const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
                console.log(123,res2);  // msg: "无效token" 401// 2.2 预付订单生成失败
                // if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
                // 2.3 得到订单支付相关的必要参数
                // const payInfo = res2.message.pay
                
                // 支付 （pay对象）
                let pay =  {
                      "timeStamp": "1525681145",
                      "nonceStr": "BkPggorBXZwPGXe3",
                      "package": "prepay_id=wx071619042918087bb4c1d3d72999385683",
                      "signType": "MD5",
                      "paySign": "D1642DEEF1663C8012EDEB9297E1D516"
                }
                // 3.1 调用 uni.requestPayment() 发起微信支付
                const [err, succ] = await uni.requestPayment(pay)
                // console.log("支付",[err, succ]);
                // 3.2 未完成支付
                if (err) return uni.$showMessage('订单未支付！')
                // 3.3 完成了支付，进一步查询支付的结果
                const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
                // 3.4 检测到订单未支付
                if (res3.meta.status !== 200) return uni.$showMessage('订单未支付！')
                // 3.5 检测到订单支付完成
                uni.showToast({
                  title: '支付完成！',
                  icon: 'success'
                })
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
