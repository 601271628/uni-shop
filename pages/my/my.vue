<template>
	<view>
        <!-- 登录 -->
        <my-login v-if="!token"></my-login>
        <!-- 登陆了 显示信息 -->
        <my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
    import badgeMix from '@/mixins/tabbar-badge.js'
    import { mapState } from 'vuex'
	export default {
        mixins: [badgeMix],
		data() {
			return {
				
			};
		},
        computed:{
            ...mapState('user',['token'])
        }
	}
</script>

<style lang="scss">

</style>
