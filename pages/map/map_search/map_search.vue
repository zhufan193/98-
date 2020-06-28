<template>
	<view>
		<web-view src="/hybrid/html/map_search.html"></web-view>
	</view>
</template>

<script>
    import { localStorage } from '@/common/util.js';
    
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad() {
            // #ifdef APP-PLUS
            plus.nativeUI.showWaiting('加载中，请稍后。');
            // #endif
		},
        onReady() {
            setTimeout(() => {
                this.url = '/hybrid/html/map_search.html';
            }, 1000);
        }
	}
</script>

<style>

</style>
