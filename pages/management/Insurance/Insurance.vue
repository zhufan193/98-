<template>
	<!-- 保险合同管理 -->
	<view class="main-all">
		<view class="main-head">
			<view class="head-first">关键词：</view>
			<view class="head-second">
				<input v-model="searchValue" />
			</view>
			<view class="head-third">
				搜索
			</view>
		</view>
		
		<uni-load-more status="1"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components:{
			uniLoadMore
		},
		data() {
			return {
				searchValue: '', // 搜索的值
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
			padding: 20upx 10upx 30upx 10upx;
			color: #5d5d5d;
			background-color: #ffffff;
			.head-first{
				font-size: 35upx;
				padding-top: 8upx;
			}
			.head-second{
				border: 1upx solid #c6c6c6;
				padding: 10upx 20upx;
				border-radius: 10upx;
				width: 30%;
				input{
					font-size: 35upx;
				}
			}
			.head-third{
				padding: 8upx 20upx;
				font-size: 35upx;
				border: 1upx solid #0091E6;
				color: #0091E6;
				border-radius: 10upx;
				position: absolute;
				right: 20upx;
			}
		}
	}
</style>
