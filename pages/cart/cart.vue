<template>
    <view >
        cart
        <uni-search-bar @confirm="search" :focus="true" v-model="searchValue" @blur="blur" @focus="focus" @input="input"
        				@cancel="cancel" @clear="clear">
        			</uni-search-bar>
        			<view class="search-result">
        				<text class="search-result-text">当前输入为：{{ searchValue }}</text>
        			</view>
                <input type="text" v-model="searchValue">
    </view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: '1312'
			};
		},
        methods: {
        			search(res) {
        				uni.showToast({
        					title: '搜索：' + res.value,
        					icon: 'none'
        				})
        			},
        			input(res) {
        				console.log('----input:', res)
        			},
        			clear(res) {
        				uni.showToast({
        					title: 'clear事件，清除值为：' + res.value,
        					icon: 'none'
        				})
        			},
        			blur(res) {
        				uni.showToast({
        					title: 'blur事件，输入值为：' + res.value,
        					icon: 'none'
        				})
        			},
        			focus(e) {
        				uni.showToast({
        					title: 'focus事件，输出值为：' + e.value,
        					icon: 'none'
        				})
        			},
        			cancel(res) {
        				uni.showToast({
        					title: '点击取消，输入值为：' + res.value,
        					icon: 'none'
        				})
        			}
        		},
	}
</script>

<style lang="scss">

</style>
