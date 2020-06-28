<template>
	<view class="card">
        <view class="card__head">
            <view class="card__headTxt">
                {{title}}
            </view>
            <view class="card__headIcon">
                <uni-icons :type="icon"></uni-icons>
            </view>
        </view>
		<slot name="content"></slot>
	</view>
</template>

<script>
	export default {
		props() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
</style>