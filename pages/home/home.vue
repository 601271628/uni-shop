<template>
	<view>
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
                <swiper-item v-for="item in swipperList" :key="item.goods_id">
                    <navigator :url="'../../subpkg/good_detail/good_detail?good_id=' + item.goods_id">
                        <image :src="item.image_src" mode="widthFix"></image>
                    </navigator>
                </swiper-item>
        </swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swipperList:[]
			};
		},
        onLoad(){
              this.getSwiperList()
              console.log(this.swipperList);
        },
        methods:{
            // 轮播图
            getSwiperList(){
                uni.$http.get('/api/public/v1/home/swiperdata').then(res=>{
                    console.log(res);
                    if(res.statusCode!==200){
                        return uni.$showMessage() // 自定义全局toast
                    }
                    this.swipperList = res.data.message
                })
            }
        }
	}
</script>

<style lang="scss">
 swiper-item image{
     width: 100%;
 }
</style>
