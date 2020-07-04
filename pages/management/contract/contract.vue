<template>
	<view class="main-all">
		<view class="main-head">
			<view class="head-first">合同文件</view>

			<view class="head-second" @click="download">
				<image src="@/static/img/right2.png" style="width: 30upx;height: 30upx;"></image>
				下载
			</view>
		</view>
		
	</view>
</template>

<script>
	
	export default{
		components: {
			
		},
		data() {
			return {
				searchValue: '', // 搜索的值
			}
		},
		methods: {
			download() {
				console.log('开始下载111111111111111');
			}
		}
		
	}
</script>

<style lang="scss">
	.main-all{
		margin: 0;
		padding: 0;
		width: 100%;
		background-color: #ffffff;
		.main-head{
			display: flex;
			flex-direction: row;
			padding: 10upx 10upx 10upx 20upx;
			font-size: 30upx;
			color: #7e7e7e;
			.head-first{
				padding: 20upx 0 20upx 20upx;
			}
			.head-second{
				padding: 20upx 0;
				position: absolute;
				right: 50upx;
			}
		}
	}
</style>
