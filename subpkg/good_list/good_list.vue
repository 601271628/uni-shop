<template>
  <view>
    <view class="noData" v-if="goodsList.length==0">
        没有该商品数据~
    </view>
    <!-- 显示商品 -->
    <view class="goods-list" v-if="goodsList.length!=0">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
    
    <!-- 上拉加载更多 -->
    <view class="uploadMore" v-show="isUploadMore">
       <van-loading color="gray" type="spinner"/> 
    </view>
    <!-- 拉到底了 -->
    <view style="text-align: center;  padding:32rpx 0; color: lightgray;" v-show="isReachBottm">
      <text>没有更多数据啦~</text>
    </view>
  </view>
</template>

<script>
    export default {
        data() {
            return {
                // 请求参数对象
                queryObj: {
                  query: '',        // 查询关键词
                  cid: '',          // 商品分类Id
                  pagenum: 1,       // 页码值
                  pagesize: 10      // 每页显示多少条数据
                },
                goodsList: [],
                total: 0,
                isUploadMore:false,
                isReachBottm:false
            };
        },
        onLoad(options) {
            // 传递的进来的 可能是cid分类id / query关键字
            this.queryObj.query = options.query?options.query:''
            this.queryObj.cid = options.cid?options.cid:''
            // 获取结果
            this.getGoodsList()
            // // 数据少
            // console.log(this.total,this.queryObj.pagesize);
            // this.isReachBottm = this.total >= this.queryObj.pagesize
        },
        onPullDownRefresh() {
            uni.stopPullDownRefresh()
        },
        onReachBottom() { 
            // console.log("下拉刷新");
            // 没数据了
            if(this.queryObj.pagenum * this.queryObj.pagesize >=this.total){
                this.isReachBottm = true
                this.isUploadMore = false
                return uni.showToast({
                    title:"数据加载完了",
                    icon:'none'
                })
            }
            // 刷新图
            this.isUploadMore = true
            this.queryObj.pagenum += 1
            // 更新数据
            this.getGoodsList()
        },
        methods:{
            getGoodsList() {
                // 发起请求
               uni.$http.get('/api/public/v1/goods/search', this.queryObj).then(res=>{
                    console.log(res);
                    if (res.data.meta.status !== 200) return uni.$showMessage()
                    // 为数据赋值
                    this.goodsList= [...this.goodsList,...res.data.message.goods]
                    this.total = res.data.message.total
               })
            },
            gotoDetail(goods){
                // console.log(goods.goods_id);
                uni.navigateTo({
                    url: '/subpkg/good_detail/good_detail?good_id=' + goods.goods_id
                })
            }
        }
    }
</script>

<style lang="scss">
.noData{
    text-align: center;
    margin: 30rpx;
    color:lightgray;
}
.uploadMore{
    position: relative;
    padding:32rpx 0;
    van-loading{
        position: absolute;
        left: 50%;
        transform: translate(-50%,0);
    }
}
</style>
