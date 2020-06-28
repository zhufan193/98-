<template>
	<view class="empty">
        <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
        <text class="empty__text">{{message}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message: ''
			};
		},
        onLoad(options) {
            if(options && options.type){
                this.message = options.type;
                uni.setNavigationBarTitle({title:this.message});
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
</style>
