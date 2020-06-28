<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
    import { localStorage } from '@/common/util.js';
    
	export default {
		data() {
			return {
                type: '',
				url: ''
			}
		},
		onLoad(options) {
			if (options && options.url) {
                if (options.title) {
                    uni.setNavigationBarTitle({
                        title: options.title
                    })
                }
                if (options.type) {
                    if(options.type === 'ship_search'){
                        let token = localStorage.getStore('loginToken')
                        this.url = options.url + '?token=' + token.substring(7);
                        return;
                    }
                }
				this.url = options.url;
			}
		}
	}
</script>

<style>

</style>
