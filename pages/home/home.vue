<template>
	<view>
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
                <swiper-item v-for="item in swipperList" :key="item.goods_id">
                    <navigator :url="'../../subpkg/good_detail/good_detail?good_id=' + item.goods_id"  open-type="navigate" >
                        <image :src="item.image_src" mode="widthFix"></image>
                    </navigator>
                </swiper-item>
        </swiper>
        
        <!-- nav -->
        <view class="nav">
            <image :src="item.image_src" mode="widthFix" v-for="(item,index) in navList" :key="index" 
            @click="navClickHandler(item)"></image>
        </view>
        
        <!-- floorList -->
        <view class="floor-list">
          <view class="floor-item" v-for="(item, index) in floorList" :key="index">
              <!-- title -->
            <image :src="item.floor_title.image_src" class="floor-title"></image>
            <!-- 楼层图片区域 -->
            <view class="floor-img-box">
              <!-- 左侧大图片的盒子 -->
              <navigator class="left-img-box" :url="item.product_list[0].url">
                <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" 
                        mode="widthFix"></image>
              </navigator>
              <!-- 右侧 4 个小图片的盒子 -->
              <view class="right-img-box">
                <navigator class="right-img-item" 
                            v-for="(item2, i2) in item.product_list" 
                            :key="i2" v-if="i2 !== 0" 
                            :url="item2.url">
                    <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
                </navigator>
              </view>
            </view>
          </view>
        </view>
	
        
    </view>
</template>

<script>
	export default {
		data() {
			return {
				swipperList:[],
				navList:[],
                floorList:[]
			};
		},
        onLoad(){
            this.getSwiperList()
            this.gitNavList()
            this.getFloorList()
            this.getFloorList()
        },
        methods:{
            // 轮播图
            getSwiperList(){
                uni.$http.get('/api/public/v1/home/swiperdata').then(res=>{
                    // console.log("轮播图--",res);
                    if(res.statusCode!==200){
                        return uni.$showMessage() // 自定义全局toast
                    }
                    this.swipperList = res.data.message
                })
            },
            // nav
            gitNavList(){
                uni.$http.get('/api/public/v1/home/catitems').then(res=>{
                    // console.log(res);
                    if(res.statusCode!==200) return uni.$showMessage()
                    this.navList = res.data.message
                })
            },
            // nav事件
            navClickHandler(item){
                if (item.name === '分类') {
                    uni.switchTab({
                      url: '/pages/cate/cate'
                    })
                }
            },
            
            // 图层
            getFloorList(){
                uni.$http.get('/api/public/v1/home/floordata').then(res=>{
                    console.log(res);
                    if(res.statusCode != 200) return uni.$showMessage()
                    
                    // 添加一个跳转的url
                     res.data.message.forEach(floor => {
                        floor.product_list.forEach(prod => {
                          prod.url = '/subpkg/good_list/good_list?' + prod.navigator_url.split('?')[1]
                        })
                      })
                    this.floorList = res.data.message
                })
            },
        }
	}
</script>

<style lang="scss">
 swiper-item image{
     width: 100%;
 }
 .nav{
     display: flex;
     justify-content: space-around;
     margin: 15rpx 0;
     
     image{
         width: 128rpx;
         height: 140rpx;
     }
 }
 .floor-title {
   height: 60rpx;
   width: 100%;
   display: flex;
 }
 .floor-img-box {
   display: flex;
   padding-left: 10rpx;

   .right-img-box {
     display: flex;
     flex-wrap: wrap;
     justify-content: space-evenly;
   }
 }

</style>
