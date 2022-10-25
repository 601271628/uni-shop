<template>
    <view >
       {{bbb}}
    </view>
</template>

<script>
    import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
        // 混入设置购物车数字的mixins
         mixins: [badgeMix],
		data() {
			return {
                
			};
		},
        onShow() {
        },
        methods: {
           
        },
        // mapState\mapGetters写入computed
        computed:{
        },
	}
</script>

<style lang="scss">

</style>
