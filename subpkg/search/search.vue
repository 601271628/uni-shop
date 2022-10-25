<template>
    <view>
        <!-- 搜索框 -->
        <view class="searchBox">
            <uni-search-bar  radius="100" placeholder="请输入搜索内容" 
                            cancelButton="none" clearButton="none"
                            @input="input"/>     
        </view>
      
        <!-- 搜索建议列表 -->
        <view class="res-list">
            <view class="res-item" v-for="item in searchResults" :key="item.goods_id" 
                  :class="{'active':item.goods_id === activeId}"  @click="gotoGoodDetail(item)" 
                  @touchstart="start(item)"  @touchmove="move($event,item)" @touchend="end">
                 <view :title="item.goods_name">{{item.goods_name}}</view>
                 <uni-icons type="forward" size="16"></uni-icons>
            </view>
        </view>
        
        <!-- 搜索历史 -->
        <view class="search-history" v-show="keyword==''">
            <view class="top">
                <view class="text">搜索历史</view>
                <uni-icons type="trash" size="16" @click="clearHistory"></uni-icons>
            </view>
           <view class="history-list">
                <ul v-if="historyList.length > 0">
                    <li v-for="(keyword, i) in historyList" :key="i" @click="gotoGoodsList(keyword)">{{keyword}}</li>
                </ul>
                <view v-else
                    style="text-align: center; margin-top: 20rpx; color: lightgray;">无搜索历史~</view>
             </view>
        </view>
        <!-- 使用弹框 步骤1 -->
        <van-dialog id="van-dialog" />
    </view>
</template>

<script>
    // 使用弹框 步骤2（步骤三：在app.vue中引入js）
    import Dialog from "../../wxcomponents/vant/dist/dialog/dialog.js"
    
    export default {
        data() {
            return {
                timer:null,
                keyword:'',
                searchResults:[],
                activeId:-1,
                // 搜索关键词的历史记录
                historyList: [], //['华为', '小黑', 'thinkbook']，
            };
        },
        // onLoad() {
        //     console.log("load");
        // },
        onShow(){
            console.log("show");
            this.activeId = -1
           // 取出数据
            this.historyList = uni.getStorageSync('kw') && JSON.parse(uni.getStorageSync('kw')) ||  []
        },
        methods:{
            input(e){
                this.throlle(()=>{
                    // console.log(e.value);
                    // 保存搜索关键字
                    this.keyword = e.value
                    // 如果搜索了就保存
                    this.keyword !='' && this.saveHistoryList()
                    // 根据ky列出建立列表
                    this.getSearchList()
                },500)
            },
            // 停止输入0.5秒后执行
            throlle(callback,time){
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                   callback && callback()
                },time)
            },
            // 获取搜索建议列表
            getSearchList(){
                if(this.keyword==''){
                    return this.searchResults = []
                }
                //请求数据
                uni.$http.get('/api/public/v1/goods/qsearch',{query:this.keyword}).then(res=>{
                    if(res.data.meta.status!=200) return uni.$showMessage()
                    console.log(res.data.message);
                    // 搜索建议列表
                    this.searchResults = res.data.message
                })
            },
            // 去商品详情
            gotoGoodDetail(item){
                // console.log(item);
                uni.navigateTo({
                    url:"/subpkg/good_detail/good_detail?good_id=" + item.goods_id
                })
            },
            // 去商品列表
            gotoGoodsList(keyword){
                uni.navigateTo({
                    url:"/subpkg/good_list/good_list?query=" + keyword
                })
            },
            start(item){
                // 加背景
                this.activeId = item.goods_id
            },  
            move(e,item){
                // 阻止页面滚动
                e.preventDefault()
               this.activeId = item.goods_id
            },  
            end(){
                this.activeId = -1
            },  
            // 清空历史
            clearHistory(){
                Dialog.confirm({
                  title: '确认清空历史记录？',
                })
                  .then(() => {
                    this.historyList = []
                    uni.setStorageSync('kw', JSON.stringify([]))
                  })
                  .catch(() => {});
            },
            // 保存
            saveHistoryList(){
               !this.historyList.includes(this.keyword) && this.historyList.unshift(this.keyword)
               // 保存本地
               uni.setStorageSync('kw', JSON.stringify(this.historyList))
            }
        }
    }
</script>

<style lang="scss">
    .searchBox{
        position: sticky;
        top: 0;
        z-index: 999;
    }
    .uni-searchbar{
        background-color: #b80000 !important;
    }
    .res-item{
       display: flex;
       border-bottom: 1px solid #efefef;
       padding: 24rpx 10rpx 10rpx 24rpx;
       font-size: 28rpx;
       
       view{
           width: 680rpx;
           // 文字不允许换行（单行文本）
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
       }
       uni-icons{
           width: 50rpx;
           height: 50rpx;
       }
    }
    .active{
        background-color: #f3f5f5;
    }
    .search-history{
        padding: 0 20rpx;
        font-size: 28rpx;
        .top{
            position: relative;
            padding:20rpx 0;
            border-bottom: 1px solid lightgray;
        }
        .uni-icons{
            position: absolute;
            top:50%;
            right: 20rpx;
            transform: translate(0,-50%);
            
            &:active{
                color: lightgray !important;
            }
        } 
        .history-list {
            ul{
                display: flex;
                flex-wrap: wrap;
                
                li{
                    background-color: #f3f3f3;
                    margin: 10rpx;
                    padding: 6rpx;
                    border-radius:8rpx;
                }
            }
          
         }
    }
     
</style>
