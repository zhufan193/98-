<template>
	<!-- 发布信息 -->
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
		<!-- 数据列表 -->
		<view class="main-list">
			<view class="list-for" v-for="(tem,index) in tems">
				<view class="for-title">
					<view>南昌-马鞍山</view>
					<view>
						<image src="@/static/img/soushuo.png" class="img-third"></image>
					</view>
				</view>
				<view class="for-information">
					油,
					5吨,
					运费:1000元,
					装运截止:2020-06-24
				</view>
				<view class="for-zt">
					<text>状态:</text>
					<text class="text2">托运中</text>
				</view>
			</view>
			
			<view class="list-for">
				<view class="for-title">
					<view>南昌-马鞍山</view>
					<view>
						<image src="@/static/img/write.png" class="img-first" @click="goPage('/pages/tabBar/pallet/pallet')"></image>
						<image src="@/static/img/deltwo.png" class="img-second" @click="isshowdel = true"></image>
					</view>
				</view>
				<view class="for-information">
					油,
					5吨,
					运费:1000元,
					装运截止:2020-06-24
				</view>
				<view class="for-zt">
					<text>状态:</text>
					<text>寻托运</text>
				</view>
			</view>
			
			<!-- <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more> -->
			<uni-load-more status="1"></uni-load-more>
		</view>
		<!-- 删除弹框 -->
		<uni-popup :show="isshowdel" position="middle" mode="fixed">
			<view class="popup-view">
				<view @click="isshowdel = false" style="position: absolute;right: 20upx;">
					<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
				</view>
				<view class="popup-third">真的要删除吗？删除后无法恢复！</view>
				<view class="popup-button">
					<view @click="get_order(0)"><strong>取消</strong></view>
					<view @click="get_order(1)"><strong>确定</strong></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { router, toast, localStorage } from '@/common/util.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import { mapState, mapActions, mapMutations } from 'vuex';
	export default{
		components:{
			uniLoadMore
		},
		data() {
			return {
				searchValue: '', // 搜索的值
				tems:[{}] , // 数据列表
				isshowdel: false, // 是否显示删除弹出
			}
		},
		methods:{
				...mapActions(['getUserInfo']),
			    ...mapMutations(['GOPAGE_LOGIN', 'RECORD_USERINFO', 'LOGOUT', 'COMPANY_TEMP_UPDATA', 'SHIP_TEMP_UPDATA']),
				// 获取用户信息，进行页面跳转
			    
				goPage() {
					console.log("签订合同")
					router.navigateTo('/pages/pallet/release/release');	
				},
				// 确定删除
				get_order(num) {
					if(num == 0){
						console.log("取消");
					}else{
						console.log("确定删除")
					}
					this.isshowdel = false;
				}
			   
		}
	}
</script>

<style lang="scss">
	.main-all{
		margin: 0;
		padding: 0;
		width: 100%;
		.main-head{
			display: flex;
			flex-direction: row;
			padding: 22upx 10upx 30upx 10upx;
			color: #5d5d5d;
			background-color: #ffffff;
			.head-first{
				font-size: 35upx;
				padding-top: 10upx;
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
			.add{
				right: 160upx;
			}
		}
		.main-list{
			margin-top: 30upx;
			background-color: #ffffff;
			padding: 20upx;
			.list-for{
				border-bottom: 1upx solid #e2effa;
				font-size: 30upx;
				padding:10upx 0;
				.for-title{
					display: flex;
					flex-direction: row;
					padding: 10upx;
					view:nth-child(1){
						color: #0091E6;
						font-size: 35upx;
					}
					view:nth-child(2){
						position: absolute;
						right: 40upx;
						image{
							width: 40upx;
							height: 40upx;
						}
						.img-first{
							right: 30upx;
						}
					}
				}
				.for-information{
					padding: 10upx;
				}
				.for-zt{
					padding: 10upx;
					font-size: 30upx;
					color: #ffdd8b;
					.text2{
						color: #3d72d5;
					}
				}
			}
		}
		.popup-view{
			display: flex;
			flex-direction: column;
			background-color: #fff;
			width: 240px;
			text-align: center;
			.popup-third{
				font-size: 34upx;
				color: #000000;
				padding: 20upx 0;
			}
			.popup-button{
				display: flex;
				flex-direction: row;
				color: #ffffff;
				font-size: 30upx;
				margin-top: 30upx;
				padding: 10upx 20upx 30upx 20upx;
				color: #007AFF;
				view:nth-child(1){
					position: absolute;
					right: 150upx;
				}
				view:nth-child(2){
					position: absolute;
					right: 50upx;
				}
			}
		}
	}
</style>
