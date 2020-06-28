<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
    import md5 from '@/common/md5.min.js';
    
	export default {
		data() {
			return {
				url: ''
			}
		},
        computed: mapState(['hasLogin', 'userInfo']),
		onLoad() {
            let urlStore = 'http://mall.98hangyun.com/mobile/user/applogin';
            let account = this.hasLogin ? this.userInfo.account : '';
            this.url = urlStore + '?mobile=' + account + '&token=' + md5(md5(account) + 'shuimayunyoufanshop');
		},
        onNavigationBarButtonTap() {
            uni.switchTab({
                url: '/pages/tabBar/home/home'
            })
		}
	}
</script>

<style>

</style>
