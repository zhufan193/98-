<template>
	<view class="main-all">
		<view class="main-head" @click="download" v-for="(tem,index) in tems">
			<view class="head-first">{{tem.name}}</view>
			<view class="head-second" >
				<image src="@/static/img/right2.png" style="width: 30upx;height: 30upx;"></image>
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
				tems:[
					{
						id:1,
						name:'注册用户协议'
					},{
						id:2,
						name:'隐私政策'
					},{
						id:3,
						name:'企业资质'
					},{
						id:4,
						name:'企业文化'
					},{
						id:5,
						name:'帮助中心'
					},{
						id:6,
						name:'联系我们'
					},{
						id:7,
						name:'注册保密协议'
					},]
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
