<template>
	<!-- 发布信息 -->
	<view class="main-all">
		<view class="main-head">
			<view class="head-first">关键词：</view>
			<view class="head-second">
				<input v-model="searchValue" />
			</view>
			<view class="head-third add">
				搜索
			</view>
			<view class="head-third" @click="goPage('/pages/sail/register/register')">
				新增
			</view>
		</view>
		<!-- 数据列表 -->
		<view class="main-list">
			<view class="list-for" v-for="(tem,index) in tems">
				<view class="list-fitst">
					<image src="@/static/img/img-zgrs.png" class="img-second" @click="goPage('/pages/sail/register/register')"></image>
				</view>
				<view class="list-second" >
					<view class="list-name" @click="goPage('/pages/sail/register/register')">船舶名称</view>
					<view class="list-xq" @click="goPage('/pages/sail/register/register')">
						船东:张三,长:13米,宽:10米,重:12吨
					</view>
					<view class="list-xq">
						状态:<text class="list-zt">待审核</text>,航程:123,类型:集装箱船
					</view>
				</view>
				<view class="list-third">
					<image src="@/static/img/deltwo.png" class="img-second" @click="isshowdel = true"></image>
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
				<view class="popup-third">您确定要删除吗？删除后无法恢复！</view>
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
			    
				goPage(s) {
					console.log("签订合同")
					router.navigateTo(s);	
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
			margin-top: 25upx;
			background-color: #ffffff;
			padding: 20upx;
			.list-for{
				display: flex;
				flex-direction: row;
				font-size: 30upx;
				padding:10upx 0;
				border-bottom: 1upx solid #09BB07;
				.list-fitst{
					image{
						width: 220upx;
						height: 280upx;
					}
				}
				.list-second{
					padding: 10upx 0 10upx 10upx;
					.list-name{
						color: #007AFF;
						font-size: 35upx;
						padding: 10upx 0;
					}
					.list-xq{
						font-size: 24upx;
						color: #a1a1a1;
						padding: 10upx 0;
					}
					.list-zt{
						color: red;
					}
				}
				.list-third{
					position: absolute;
					right: 30upx;
					image{
						width: 30upx;
						height: 30upx;
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
				font-size: 33upx;
				color: #000000;
				margin-top: 40upx;
			}
			.popup-button{
				display: flex;
				flex-direction: row;
				color: #ffffff;
				font-size: 33upx;
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
