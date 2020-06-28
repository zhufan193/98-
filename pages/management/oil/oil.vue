<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="content">
			<block>
			    <view class="cellss" v-if="indexActive == 2">
					<view class="view-xq">
						<view class="view-num">吨<text>1</text></view>
						<view class="view-right">
							<view class="right-content">
								<view class="right-money">
									柴油,100元
								</view>
								<view class="right-button">
									未支付
								</view>
							</view>
							<view class="view-name">
								供油:**有限公司有限公司,15170199909
							</view>
						</view>
					</view>
			    </view>
				
				<view class="cellss" v-if="indexActive == 0">
					<view class="view-xq">
						<view class="view-num">吨<text>1</text></view>
						<view class="view-right">
							<view class="right-content">
								<view class="right-money">
									柴油,1元
								</view>
								<view class="right-button" @click="isshow = true">
									加油
								</view>
							</view>
							<view class="view-name">
								供油:**有限公司有限公司,15170199909
							</view>
						</view>
					</view>
				</view>
			</block>
        </view>
		
		<uni-popup :show="isshow" position="middle" mode="fixed">
			<view class="popup-view">
				<view @click="isshow = false" style="position: absolute;right: 20upx;">
					<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
				</view>
				<view class="popup-third">订单号:<strong>c123212343212345</strong></view>
				<view class="popup-four">柴油,1吨</view>
				<view class="popup-button" @click="isshow = false" >确定</view>
			</view>
		</uni-popup>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无订单</text>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getUserOfferList } from '@/service/getData.js';
    
	export default {
        components:{
            uniSegmentedControl,
            uniLoadMore
        },
		data() {
			return {
                items: ['未使用', '已使用', '待支付'],
				indexActive: 0,
				isshow: false, // 是否显示加油订单号
				data: [{
                    status: 0,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                },{
                    status: 1,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                },{
                    status: 2,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                }],
			};
		},
        async onLoad() {
            toast.loading();
            await this.getData('init');
            toast.hideLoading();
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            _onClickItem(index){
                this.indexActive = index;
                if(!this.data[index].list.length && this.data[index].loadingType === 'more'){
					console.log("index:"+index)
                    // this.getData();
                }
            },
            _toBeConfiremed(obj){
                router.navigateTo('/pages/order/sea-my-detail/sea-my-detail', {id: obj.id});
            },
            _goDetail(id) {
                router.navigateTo('/pages/order/sea-detail/sea-detail', {id: id});
            },
            getData(type = 'DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].page = 1;
                    this.data[index].loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
                getUserOfferList({ status: this.data[index].status, page: this.data[index].page }).then(res => {
                    if(this.data[index].page == 1){
                        this.data[index].list = res.data;
                    }else{
                        this.data[index].list = this.data[index].list.concat(res.data);
                    }
                    if(type == 'DownRefresh'){
                        uni.stopPullDownRefresh();
                        toast.hideLoading();
                    }
                    if(res.data.length < 15){
                        this.data[index].loadingType = 'noMore';
                    }else{
                        this.data[index].loadingType = 'more';
                        this.data[index].page ++;
                    }
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding-top: 44px;
    }
    
    .content{
		background-color: #ffffff;
		padding:30upx;
		.cellss{
			border: 4upx solid #c8c8c8;
			border-top: 20upx solid #c8c8c8;
			border-radius: 15upx;
			margin-bottom: 30upx;
			.view-xq{
				display: flex;
				flex-direction: row;
				.view-num{
					width: 20%;
					display: flex;
					align-items: center; /*定义body的元素垂直居中*/
					justify-content: center; 
					color: #a7a7a7;
					border-right: 4upx dashed #c8c8c8;
				}
				.view-right{
					padding: 10upx;
					color: #a7a7a7;
					width: 80%;
					.right-content{
						display: flex;
						flex-direction: row;
						
						.right-money{
							font-size: 32upx;
							margin-top: 10upx;
						}
						.right-button{
							border: 1upx solid #55aaff;
							border-radius: 10upx;
							color: #ffffff;
							background-color: #55aaff;
							padding: 10upx 25upx;
							position: absolute;
							right: 40upx;
							font-size: 32upx;
						}
					}
					.view-name{
						font-size: 26upx;
						margin-top: 30upx;
					}
				}
			}
		}
    }
    .popup-view{
    	display: flex;
    	flex-direction: column;
    	background-color: #fff;
    	width: 260px;
    	text-align: center;
    	.popup-third{
			margin-top: 30upx;
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
    		color: #ffffff;
    		font-size: 35upx;
			background-color: #73caff;
			border: 1upx solid #73caff;
			border-radius: 10upx;
			padding: 20upx 30upx;
    		margin: 30upx auto 0;
			width: 180upx;
    	}
    }
    
</style>
