<template>
	<!-- 签订合同 -->
	<view class="main-all">
		<view class="main-head">
			<view class="head-content">
			    <view>合同名称</view>
			    <view class="content-input"> <input v-model="contractName"  /></view>
			</view>
			<view class="head-content">
			    <view>合同范本</view>
			    <view class="content-input download" v-model="model"> 点击下载合同范本</view>
			</view>
			<view class="head-content">
			    <view>订单单价</view>
			    <view class="content-input"> <input v-model="unitPrice"  /></view>
			</view>
			<view class="head-content">
			    <view>合同总价</view>
			    <view class="content-input"> <input v-model="allPrice"  /></view>
			</view>
			<ad-file :outinharbor="outharbor" v-on:greet="getphoto"></ad-file>	
		</view>
		<view class="view-button">
			确认签订
		</view>
	</view>
</template>

<script>
	import adFile from '@/components/ad-file/ad-file.vue';   
	export default{
		components:{
			adFile
		},
		data() {
			return {
				contractName: '航次租船合同', // 搜索的值
				model: '',
				unitPrice:'12', // 单价
				allPrice: '12345', //总价
				outharbor:'合同文件',
			}
		},
		methods:{
			getphoto() {
				console.log("获取图片")
			}
		}
		
	}
</script>

<style lang="scss">
	 @import '@/style/page/card.scss';
	.main-all{
		margin: 0;
		padding: 0;
		width: 100%;
		.main-head{
			padding: 10upx 0;
			color: #5d5d5d;
			background-color: #ffffff;
			.head-content{
				display: flex;
				flex-direction: row;
				padding: 24upx 0;
				border-bottom: 1upx solid #dcdcdc;
				view:nth-child(1){
					font-size: 30upx;
					width: 22%;
					text-align: right;
				}
				.content-input{
					width: 78%;
					text-align: right;
					padding: 0 30upx;
					input{
						font-size: 30upx;
					}
				}
				.download{
					color: #ffffff;
					background-color: #2587ff;
					border: 1upx solid #2587ff;
					border-radius: 10upx;
					width: 30%;
					padding: 10upx;
					position: absolute;
					right: 20upx;
					margin-top: -8upx;
				}
			}
		}
		.view-button{
			color: #ffffff;
			background-color: #2587ff;
			font-size: 30upx;
			border: 1upx solid #2587ff;
			border-radius: 10upx;
			padding: 30upx;
			text-align: center;
			margin: 30upx;
		}
		
	}
</style>
