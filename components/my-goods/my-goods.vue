<template>
    <view class="goods-item">
      <!-- 商品左侧图片区域 -->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      
      <!-- 商品右侧信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">{{goods.goods_price | moneyForm}}</view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" v-model="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
</template>

<script>
    export default {
        name:"my-goods",
        data() {
            return {
                defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
            };
        },
        props:{
            goods:{
                type:Object,
                required:true
            }, 
            showRadio: {
              type: Boolean,
              default: false,
            },
            showNum: {
              type: Boolean,
              default: false,
            },
        },
        filters:{
            moneyForm(value){
                return '￥'+Number(value).toFixed(2) 
            }
        },
        methods:{
            // 选中
            radioClickHandler(){
                // 传递出商品信息 并修改goodstate
                this.$emit('radio-change',{
                    goods_id: this.goods.goods_id,
                    goods_state: !this.goods.goods_state
                })
            },
            // 物品数量(点击emit的参数num就是数量)
            numChangeHandler(num){
                this.$emit('num-change',{
                    goods_id: this.goods.goods_id,
                    goods_count: num - 0
                })
            }
        }
    }
</script>

<style lang="scss">
    .goods-item {
      display: flex;
      padding: 10px 5px;
      border-bottom: 1px solid #f0f0f0;

      .goods-item-left {
        margin-right: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-pic {
          width: 100px;
          height: 100px;
          display: block;
        }
      }

      .goods-item-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods-name {
          font-size: 13px;
        }
        .goods-info-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 20rpx;
            
            .goods-price {
              font-size: 32rpx;
              color: #c00000;
            }
        }
      }
    }
</style>