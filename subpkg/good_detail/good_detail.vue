<template>
    <view v-if="goods_info.goods_name">
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
            <swiper-item v-for="(item,index) in goods_info.pics" :key="item.pics_id">
               <image :src="item.pics_big" @click="preview(index)"></image>
            </swiper-item>
        </swiper>
        
        <!-- 商品的信息区域 -->
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="price">{{goods_info.goods_price | moneyFilter}}</view>
          <!-- 信息主体区域 -->
          <view class="goods-info-body">
            <!-- 商品名称 -->
            <view class="goods-name">{{goods_info.goods_name}}</view>
            <!-- 收藏 -->
            <view class="favi">
              <uni-icons :type="iconStyle[iconIndex].collectIcon" size="18" :color="iconStyle[iconIndex].collectIconColor" @click="collectGood"></uni-icons>
              <text>收藏</text>
            </view>
          </view>
          <!-- 运费 -->
          <view class="yf">快递：免运费</view>
        </view>
    
        <!-- 商品详情信息 -->
        <rich-text :nodes="goods_info.goods_introduce" class="padButtom"></rich-text>
        
        <!-- 底部商品导航区域 -->
        <view class="goods_nav">
            <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onclick" @buttonClick="buttonClick($event,goods_info)"/>
        </view>
    </view>
</template>

<script>
    import { mapState,mapGetters,mapMutations } from "vuex";
    export default {
        data() {
            return {
                goods_info:{},
                iconStyle:[
                    {collectIcon:'star',  collectIconColor:'gray'},
                    {collectIcon:'star-filled',  collectIconColor:'yellow'}
                ],
                iconIndex:0,
                options: [
                    {
                        icon: 'shop',
                        text: '店铺',
                        info: 0,
                        // infoBackgroundColor: '#007aff',
                        // infoColor: "#f5f5f5"
                    }, 
                    {
                        icon: 'cart',
                        text: '购物车',
                        info: 0
                    }
                ],
                buttonGroup: [
                  {
                    text: '加入购物车',
                    backgroundColor: '#ffa200',
                    color: '#fff'
                  },
                  {
                    text: '立即购买',
                    backgroundColor: '#ff0000',
                    color: '#fff'
                  }
                ]
            };
        },
        onLoad(options){
            // console.log("options:",options);
            //获取商品详情
            this.getGoodDetail(options.good_id)
            // 购物车数量初始化
            // console.log(this.goodsNum);
            this.options[1].info = this.goodsNum
        },
        filters:{
           moneyFilter(value){
               return '￥'+Number(value).toFixed(2)
           } 
        },
        computed:{
            ...mapState('cart',['cart']),
            ...mapGetters('cart',['goodsNum'])
        },
        methods:{
            // 加入购物车
             ...mapMutations('cart',['addToCart']),
             // 获取商品详细数据
            getGoodDetail(good_id){
                uni.$http.get('/api/public/v1/goods/detail', { goods_id:good_id }).then(res=>{
                    console.log(res);
                    if(res.data.meta.status!==200) return uni.$showMessage()
                    // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
                    res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
                    
                    this.goods_info = res.data.message
                })
            },
            // 预览图片
            preview(index){
                uni.previewImage({
                    current:index,
                    // 所有图片 url 地址的数组
                    urls: this.goods_info.pics.map(item => item.pics_big),
                })
            },
            // 收藏商品
            collectGood(){
                this.iconIndex = this.iconIndex == 0 ? 1:0
            },
            onclick(e){
                console.log(e);
                if(e.content.text=="购物车"){
                    uni.switchTab({
                        url:"/pages/cart/cart"
                    })
                }
            },
            buttonClick(e,goods_info){
                if(e.content.text == "加入购物车"){
                    console.log("加入购物车");
                    // 2. 组织一个商品的信息对象
                    const goods = {
                         goods_id: this.goods_info.goods_id,       // 商品的Id
                         goods_name: this.goods_info.goods_name,   // 商品的名称
                         goods_price: this.goods_info.goods_price, // 商品的价格
                         goods_count: 1,                           // 商品的数量
                         goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
                         goods_state: true                         // 商品的勾选状态
                    }
                    this.addToCart(goods)
                    // 更新数目
                    this.options[1].info = this.goodsNum
                    console.log(this.cart);
                }
            }
        }
    }
</script>

<style lang="scss">
    .padButtom{
        display: block;
        padding-bottom: 100rpx;
    }
    swiper {
      height: 750rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
    // 商品信息区域的样式
    .goods-info-box {
      padding: 20rpx;
      padding-right: 0;
      background-color: #f8f8f8;
    
      .price {
        color: #c00000;
        font-size: 36rpx;
        margin: 20rpx 0;
      }
    
      .goods-info-body {
        display: flex;
        justify-content: space-between;
    
        .goods-name {
          font-size: 26rpx;
          padding-right: 20rpx;
        }
        // 收藏区域
        .favi {
          width: 240rpx;
          font-size: 24rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-left: 2rpx solid #efefef;
          color: gray;
        }
      }
    
      // 运费
      .yf {
        margin: 20rpx 0;
        font-size: 24rpx;
        color: gray;
      }
    }
    
    .goods_nav{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
    }

</style>
