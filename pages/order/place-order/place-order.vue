<!-- 下订单 -->
<template>
	<view class="main-all">
		<view class="form">
		    <view class="form__cell">
		        <view class="form__label">订单编号:</view>
		        <view class="form__note">123</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">订单分类:</view>
		        <view class="form__note">货源订单</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">具体名称:</view>
		        <view class="form__note">油</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">甲方名称:</view>
		        <view class="form__note">祝凡</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">甲方电话:</view>
		        <view class="form__note">15179140060</view>
		    </view>
			<view class="form__cell">
			    <view class="form__label">乙方名称:</view>
			    <view class="form__note">张三</view>
			</view>
			<view class="form__cell">
		        <view class="form__label">乙方电话:</view>
		        <view class="form__note">15179141235</view>
		    </view>
			
			<view class="form__cell">
			    <view class="form__label">订单单价:</view>
			    <view class="form__note">10</view>
			</view>
			<view class="form__cell">
			    <view class="form__label">订单总价:</view>
			    <view class="form__note">1000</view>
			</view>
			<view class="form__cell">
			    <view class="form__label">航线:</view>
			    <view class="form__note">南昌-广西</view>
			</view>
			<view class="form__cell">
			    <view class="form__label">文件合同:</view>
			    <view class="form__note seeFile">点击查看甲方合同文件</view>
			</view>
			<view class="form__cell">
				<textarea class="form-text" placeholder="请输入信息内容" auto-height />
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
				
			}
		}
		
	}
</script>

<style lang="scss">
	@import '@/style/page/form.scss';
	.main-all{
		margin: 0;
		padding: 0;
		width: 100%;
		background-color: #ffffff;
		.form-text{
			width: 100%;
			border-bottom: 1upx solid #f3f3f3;
			border-radius: 5upx;
			padding: 20upx;
			font-size: 30upx;
		}	
		.seeFile{
			margin-right: 30upx;
			border-bottom: 1upx solid #00a0fd;
			border-radius: 10upx;
			padding: 12upx 30upx;
			font-size: 30upx;
			color: #ffffff;
			background-color: #00a0fd;
		}
	}
</style>
