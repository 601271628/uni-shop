import { mapGetters } from "vuex";

export default{
    onShow() {
        // 设置购物车右上角图标
        uni.setTabBarBadge({
            index:2,
            text:''+this.goodsNum
        })
    },
    computed:{
        ...mapGetters('cart',['goodsNum'])
    },
}