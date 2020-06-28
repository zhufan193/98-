<template>
	<view class="main-order">
		<view class="order-title">
			<view class="title-first">
				<strong>{{choiceName}}：{{num}}</strong>
			</view>
			<view class="title-second" @click="getOrder('0')">
				<strong> 查看全部订单>></strong>
			</view>
		</view>
		<view class="order-centent">
			<view class="centent-first">
				<view @click="getOrder('1')" :class="{'orderColor':choiceValue == '1'}">
					<image src="@/static/img/noqueren.png"></image>
					未确定订单<text v-if="num != 0">{{num}}</text>
				</view>
				<view @click="getOrder('2')" :class="{'orderColor':choiceValue == '2'}">
					<image src="@/static/img/noSigned.png"></image>
					未签订合同<text v-if="num != 0">{{num}}</text>
				</view>
				<view @click="getOrder('3')" :class="{'orderColor':choiceValue == '3'}">
					<image src="@/static/img/nofukuan.png"></image>
					未付款订单<text v-if="num != 0">{{num}}</text>
				</view>
			</view>
			<view class="centent-first">
				<view @click="getOrder('4')" :class="{'orderColor':choiceValue == '4'}">
					<image src="@/static/img/tuoyun.png"></image>
					托运中订单<text v-if="num != 0">{{num}}</text>
				</view>
				<view @click="getOrder('5')" :class="{'orderColor':choiceValue == '5'}">
					<image src="@/static/img/songda.png"></image>
					订单已送达<text v-if="num != 0">{{num}}</text>
				</view>
				<view @click="getOrder('6')" :class="{'orderColor':choiceValue == '6'}">
					<image src="@/static/img/isget.png"></image>
					订单已签收<text v-if="num != 0">{{num}}</text>
				</view>
			</view>
			
			<view class="centent-second">
				<!-- 货主能看到 -->
				<template v-if="role == 0">
					<view class="centent-list" v-for="(tem,index) in tems">
						<view class="list-first">
							<view><image src="@/static/img/right.png" style="width: 30upx;height: 30upx;top: 5upx;"></image>1232435</view>
							<view><image src="@/static/img/head.png"></image>货源订单</view>
						</view>
						<view class="list-second">
							<view>油</view>
							<view>1000元</view>
						</view>
						<view class="list-third">下单时间:2020-06-24,祝凡,15179140060</view>
						<view class="list-four" >
							<view class="list-four-first" style="color: #007AFF;">托运中</view>
							<view class="list-four-second">无合同</view>
							<view class="list-four-second list-five">合同</view>
							<view class="list-four-third"><image src="@/static/img/money.png"></image>未付款</view>
							<view class="list-four-four" @tap="goPage('/pages/order/signContract/signContract')"><image src="@/static/img/noSigned.png"></image>签合同</view>
						</view>
					</view>
				</template>
				<!-- 船主能看到 -->
				<template v-if="role == 1">
					<view class="centent-list" v-for="(tem,index) in tems">
						<view class="list-first">
							<view @click="goPage('/pages/order/place-order/place-order')"><image src="@/static/img/right.png" style="width: 30upx;height: 30upx;top: 5upx;"></image>1232435</view>
							<view><image src="@/static/img/head.png"></image>货源订单</view>
						</view>
						<view class="list-second" @click="goPage('/pages/order/place-order/place-order')">
							<view @click="goPage('/pages/order/place-order/place-order')">油</view>
							<view @click="goPage('/pages/order/place-order/place-order')">1000元</view>
						</view>
						<view class="list-third">下单时间:2020-06-24,祝凡,15179140060</view>
						<view class="list-four">
							<view class="list-four-first">未签订</view>
							<view class="list-four-third"><image src="@/static/img/money.png"></image>未付款</view>
							<view class="list-four-four" @click="querenValue = true"><image src="@/static/img/noqueren.png"></image>确认</view>
						</view>
					</view>
				</template>
				
				<!-- <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more> -->
				<uni-load-more status="1"></uni-load-more>
			</view>
			
			<uni-popup :show="querenValue" position="middle" mode="fixed">
				<view class="popup-view">
					<view @click="querenValue = false" style="position: absolute;right: 20upx;">
						<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="popup-second">
						<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="popup-third">您确认此订单吗？</view>
					<view class="popup-four">确认一致，订单将进入签合同阶段！</view>
					<view class="popup-button">
						<view @click="get_order(0)">取消</view>
						<view @click="get_order(1)" type="default">是的，确认</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import { mapState, mapActions, mapMutations } from 'vuex';
	import { router, toast, localStorage, dateUtils } from '@/common/util.js';
	export default{
		components:{
			uniLoadMore
		},
		data() {
			return {
				choiceValue: 1, // 选择搜索的值
				choiceName: "未确认订单数",
				num: 0,
				querenValue: false,  //是否点击确认订单
				role: 1, //用户jues,0是货主，1是船主
				tems: [{}], //测试数据列表
			}
		},
		methods:{
			getOrder(num) {
				this.choiceValue = num;
				var tem = num;
				switch(tem){
					case '0':
					    this.choiceName = "总订单数";
					    break;
				    case '1':
				        this.choiceName = "未确认订单数";
				        break;
				    case '2':
				        this.choiceName = "未签订合同订单数";
				        break;
					case '3':
					    this.choiceName = "未付款订单数";
					    break;
					case '4':
					    this.choiceName = "托运中订单数";
					    break;
					case '5':
					    this.choiceName = "订单已送达数";
					    break;
				    default:
				        this.choiceName = "订单已签收数";
				}    
			},
			// 确认订单
			get_order(num) {
				if(num == 0){
					console.log("取消订单");
				}else{
					console.log("确认订单")
				}
				this.querenValue = false;
			},
			// 签订合同
			...mapActions(['getUserInfo']),
			...mapMutations(['GOPAGE_LOGIN', 'RECORD_USERINFO', 'LOGOUT', 'COMPANY_TEMP_UPDATA', 'SHIP_TEMP_UPDATA']),
			// goPage(url, param = null, hasLogin = true) {
			//     if(url == undefined){
			//         toast.show('开发中');
			//         return;
			//     }
			//     if(!this.hasLogin && hasLogin){
			//         toast.show('请点击登录！');
			//         return;
			//     }
			//     router.navigateTo(url, param);
			// },
			goPage(adder) {
				console.log("签订合同")
				router.navigateTo(adder);	
			}
		}
	}
</script>

<style lang="scss">
	.main-order{
		
		margin: 0;
		background-color: #ffffff;
		.order-title{
			margin: 50upx auto 0;
			display: flex;
			flex-direction: row;
			text-align: center;
			font-size: 35upx;
			padding-bottom: 20upx;
			border-bottom: 1px solid #bdbdbd;
			
			.title-first{
				width: 50%;
			}
			.second{
				width: 50%;
			}
		}
		.order-centent{
			padding-bottom: 30upx;
			.centent-first{
				display: flex;
				flex-direction: row;
				text-align: center;
				view{
					margin: 10upx auto 0;
					font-size: 32upx;
					color: #8a8a8a;
					image{
						width: 40upx;
						height: 40upx;
						top: 12upx;
						right: 5upx;
					}
					text{
						color: red;
						font-size: 28upx;
					}
				}
				.orderColor{
					color: #00aaff;
				}
			}
			.centent-second{
				margin: auto;
				.centent-list{
					border-bottom: 1upx solid #cecece;
					font-size: 30upx;
					padding: 10upx 10upx 10upx 30upx;
					image{
						width: 40upx;
						height: 40upx;
						top: 12upx;
						right: 5upx;
					}
					.list-first{
						display: flex;
						flex-direction: row;
						padding: 10upx 0;
						color: #959595;
						view:nth-child(1){
							padding: 10upx 0;
						}
						view:nth-child(2){
							margin-left: 40upx;
						}
					}
					.list-second{
						display: flex;
						flex-direction: row;
						padding: 10upx 0;
						margin-top: 10upx;
						font-size: 34upx;
						view:nth-child(2){
							color: #007AFF;
							position: absolute;
							right: 40upx;
						}
					}
					.list-third{
						color: #959595;
						padding: 10upx 0;
					}
					.list-four{
						color: #000000;
						display: flex;
						flex-direction: row;
						padding: 10upx 0;
						.list-four-first{
							margin-top: 12upx;
							font-size: 26upx;
						}
						.list-four-second{
							margin-left: 20upx;
							color: red;
							margin-top: 12upx;
							font-size: 26upx;
						}
						.list-four-third{
							margin-left: 20upx;
							font-size: 26upx;
						}
						.list-four-four{
							color: #007AFF;
							position: absolute;
							right: 40upx;
							font-size: 26upx;
						}
						.list-five{
							color: #000000;
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
				.popup-second{
					margin-top: 50upx;
					image{
						width: 100upx;
						height: 100upx;
					}
				}
				.popup-third{
					font-size: 40upx;
					color: #000000;
					padding: 20upx 0;
				}
				.popup-four{
					font-size: 30upx;
					color: #8c8c8c;
					padding: 20upx 0;
				}
				.popup-button{
					display: flex;
					flex-direction: row;
					color: #ffffff;
					font-size: 30upx;
					margin-top: 30upx;
					padding: 10upx 20upx 0 20upx;
					view:nth-child(1){
						background-color: #c5c5c5;
						border: 1upx solid #c5c5c5;
						border-radius: 10upx;
						padding: 20upx 50upx;
					}
					view:nth-child(2){
						background-color: red;
						margin-left: 40upx;
						border: 1upx solid red;
						border-radius: 10upx;
						padding: 20upx 50upx;
					}
				}
			}
		}
	}
</style>
