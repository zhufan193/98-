<template>
	<view v-if="isshow">
		
		<view style="display: flex;flex-direction: row;background-color: #ffffff;"">
			<view style="font-size: 40upx;padding-bottom: 25upx;">
				<text class="text_use1">抚州</text>
			</view>

			<view style="font-size: 40upx; background-color: #ff5500;position: absolute;right:50upx;">

				<image  style="width: 80upx;height: 80upx;" src="@/static/img/down.jpg"  @tap="_close"></image>

			</view>	
		</view>
		<view style="flex-direction: row; background-color: #aaffff;">
			<text class="text_use1">名称</text>
			<text class="text_use">所在港</text>
			<text class="text_use">到达港</text>
			<text class="text_use">吨位</text>
			<text class="text_use">装运期限</text>
		</view>
		  <scroll-view scroll-y="true"  class="scroll-Y">        
			<view style="flex-direction: row; background-color: #ffffff;">
				<text class="text_use1">名称</text><text class="text_use">所在港</text>
				<text class="text_use">到达港</text><text class="text_use">吨位</text>
				<text class="text_use">装运期限</text>
			</view>
			<view style="flex-direction: row; background-color: #ffffff;">
				<text class="text_use1">名称</text><text class="text_use">所在港</text>
				<text class="text_use">到达港</text><text class="text_use">吨位</text>
				<text class="text_use">装运期限</text>
			</view>	  
		</scroll-view>
	</view>
</template>

<script>
	export default{
	props:{
		isshow:Boolean
	},
	methods:{
		_close:function(e){
			this.isshow=false;
			this.$emit("greet",this.isshow);
			console.log(this.isshow);
		}
	}
	}
</script>

<style>
	.scroll-Y{
		height: 630upx;
	}
	.text_use{
			position: relative;
		/* 	flex-direction: column; */
		    text-align:left;
		    padding: 12rpx 30upx;
			font-size: 35upx;
	}
	.text_use1{
			position: relative;
		/* 	flex-direction: column; */
		    text-align:left;
		    padding: 12rpx 30upx 0 12rpx;
			font-size: 35upx;
	}
</style>