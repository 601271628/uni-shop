<template>
    <view>
        <!-- 使用自定义组件 -->
        <view class="searchBox">
            <my-search :radius="'30rpx'" :bgc="'#b80000'" @click.native="gotoSearch"></my-search>
        </view>
        
        <view class="container">
            <!-- 左边滚动 1级分类-->
            <view class="left-scroll">
                <scroll-view scroll-y="true" :style="{height:windowHeight+'px'}">
                   <view  
                        :class="{'left-scroll-item':true,'active':active==index}" 
                        v-for="(item,index) in cateList" 
                        :key="item.cat_id" 
                        @click="activeChanged(index)">{{item.cat_name}}</view>
                </scroll-view>  
            </view>
            
            <!-- 右边滚动 -->
            <view class="rigth-scroll">
                <scroll-view scroll-y="true" :style="{height:windowHeight+'px'}" :scroll-top="scrollTop">
                    <!-- 二级分类 -->
                    <view v-for="item in cateLevel2" :key="item.cat_id" v-if="item.children">
                        <view class="cateLevel2-title">  /{{item.cat_name}}/  </view>
                        
                        <!-- 三级分类 -->
                        <view class="cateLevel3">
                            <view v-for="item2 in item.children" :key="item2.cat_id" @click="gotoGoodList(item2)">
                                <image :src="item2.cat_icon.replace('dev','web')" mode="widthFix"></image>
                                <text>{{item2.cat_name}}</text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				windowHeight:0,
                cateList:[],
                active:0,
                cateLevel2:[],
                scrollTop:0,
                goodList:[]
			};
		},
        onLoad() {
            // 获取系统可用高度
            let sysInfo = uni.getSystemInfoSync()
            this.windowHeight =sysInfo.windowHeight - 50
            
            // scroll数据
            this.getCateList()
        },
        methods:{
            getCateList(){
                uni.$http.get('/api/public/v1/categories').then(res=>{
                    console.log(res);
                    if(res.data.meta.status!==200) return uni.$showMessage()
                    this.cateList = res.data.message
                    
                    // 二级分类列表(默认是大家电的)
                    this.cateLevel2 = this.cateList[0].children
                })
            },
            // 一级分类切换
            activeChanged(index){
                // 更新active （class）
                this.active = index
                
                // 重新获取二级分类
                this.cateLevel2 = this.cateList[index].children
                
                // 回滚到顶部(每次都设置为0 时无效的 可以设置为0，1)
                this.scrollTop = this.scrollTop == 0 ? 1 : 0
            },
            // 点击商品跳转到good_list
            gotoGoodList(item2){
                console.log(item2);
                uni.navigateTo({
                    url:"/subpkg/good_list/good_list?cid=" + item2.cat_id
                })
            },
            gotoSearch(){
                uni.navigateTo({
                   url: '/subpkg/search/search'
                 })
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
    .container{
        display: flex;
    }
    .left-scroll{
        scroll-view{
            width: 200rpx;
            .left-scroll-item{
                line-height: 120rpx;
                background-color: #f8f7f7;
                text-align: center;
                font-size: 24rpx;
            }
            .active{
                background-color: #ffffff;                
                position: relative;
                // 渲染激活项左侧的红色指示边线
                &::before {
                  content: ' ';
                  display: block;
                  width: 8rpx;
                  height: 70rpx;
                  background-color: #c00000;
                  position: absolute;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
                }
            }
        }
    }
    .rigth-scroll{
        scroll-view{
            width: 550rpx;
        }
        
        .cateLevel2-title{
            font-size: 24rpx;
            font-weight: bold;
            justify-content: center;
            text-align: center;
            padding:30rpx 0;
        }
        .cateLevel3{
            font-size: 24rpx;
            display: flex;
            flex-wrap: wrap;
            
            view{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 10px;
                width: 33.33%;
                
                image{
                   width: 60px;
                   height: 60px;
                }
            }
        }
    }
    
</style>
