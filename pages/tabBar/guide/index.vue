<template>
	<view class="content">
		<view class="content" v-if="slcombine">
		<image  class="logo" src="/static/img/frontcover.png" mode="aspectFill"></image>	
		<image class="river"  mode="aspectFill" @tap="_river()"></image>
		<image class="road"  mode="aspectFill" @tap="_road()"></image>
		</view>
		<image v-if="boat" class="logo" src="/static/img/boat.png" mode="aspectFill" @tap="_river()"></image>
		<image v-if="bus" class="logo" src="/static/img/bus.png" mode="aspectFill" @tap="_road()"></image>
		
	</view>
</template>

<script>
	var _show;
	export default {
		data() {
			return {
				slcombine:false,
				boat:false,
				bus:false
				
			}
		},
		onLoad:function(e) {
			_show=this;
			uni.request({
				url: 'http://www.yunyoufang.net/ajax.aspx?t=appversion',
				method: 'GET',
				data: {},
				success: res => {
					var obj=eval('('+res.data+')');
					console.log(obj[0].version);
					_show.boat=true;
					uni.switchTab({
					url:'/pages/tabBar/home/home'
					});
				},
				fail: () => {},
				complete: () => {}
			});

		},
		methods: {
			_road:function(e){
				uni.navigateTo({
					url: '/pages/tabBar/home/bus'
				});
			},
			_river(){
				uni.navigateTo({
					url: '/pages/tabBar/guide/guide'	
				});
			}

		}
	}
</script>

<style>
	.content{
		position:fixed;
		            top: 0;
		            bottom:0rpx;
		            left:0;
		            right:0;
	}
    .river{
		position: absolute;
		bottom: 25%;
		left: 0;
		right: 0;
		height: 100rpx;
		width: 250rpx;
		margin: 0rpx 50rpx 0rpx 360rpx;
	}
	.road{
		position: absolute;
		top: 39%;
		left: 0;
		right: 0;
		height: 100rpx;
		width: 250rpx;
		margin: 0 50rpx 0rpx 190rpx;
	}
	.logo {
		height: 100%;
		width: 100%;
		margin-left: auto;
		margin-bottom: 0rpx;
	
	}
 .jump-over{
        position: absolute;
        bottom: 31%;
        left: 0;
        right: 0;
        height: 190rpx;
        margin: 0 160rpx;
    }
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 0rpx;
		color: #8f8f94;
	}
</style>
