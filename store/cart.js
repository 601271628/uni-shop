export default {
    //命名空间，开启可以更加方便读取state
    //  不加：...mapState('vuexPerson')后需要 vuexPerson.num读取
    //  加了: ...mapState('vuexPerson',['num','person_list']) 直接num读取
    namespaced:true,
    state:{
        // 都本地的 没有就为[]
        cart:JSON.parse(uni.getStorageSync('cart') || '[]'),
    },
    getters:{
        goodsNum(state,getters){
            return state.cart.reduce((total,item)=>{
                return total + item.goods_count
            },0)
        }
    },
    mutations:{
        // 将购物车中的数据持久化存储到本地
        saveToStorage(state) {
           uni.setStorageSync('cart', JSON.stringify(state.cart))
        },
        // 添加到购物车
        addToCart(state, goods) {
          // 根据提交的商品的Id，查询购物车中是否存在这件商品
          // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
          const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
    
          if (!findResult) {
            // 如果购物车中没有这件商品，则直接 push
            state.cart.push(goods);
          } else {
            // 如果购物车中有这件商品，则只更新数量即可
            findResult.goods_count++
          }
          // 存到本地
          this.commit("cart/saveToStorage")
        },
    },
}