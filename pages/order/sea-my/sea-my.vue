<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="content">
            <block v-for="(item, index) of data[indexActive].list" :key="index">
                <view class="cell" @tap="_toBeConfiremed(item)">
                    <view class="cell__row">
                        <view>
                            <text v-if="item.offer_type === 'ship'" class="cell__name">{{item.ship_name}}/{{item.ship_type}}</text>
                            <text v-else class="cell__name">{{item.cargo_name}}/{{item.weigh}}T</text>
                            <text class="cell__name">{{item.departure}}->{{item.target}}</text>
                        </view>
                    </view>
                    <view class="cell__row">
                        <view class="cell__col">
                            <view class="cell__label">我的{{item.offer_type === 'ship' ? '货物': '船舶'}}：<text class="cell__note">{{item.offer_type === 'ship' ? item.cargo_name: item.ship_name}}</text></view>
                            <view class="cell__label">我的报价：<text class="cell__note">{{item.price != 0 ? item.price + '元/吨' : '电议'}}</text></view>
                        </view>
                        <view class="cell__col">
                            <view class="cell__label">{{item.offer_type === 'ship' ? '空船时间': '货物重量'}}：<text class="cell__note">{{item.offer_type === 'ship' ? item.empty_at + '±' + item.empty_int : (item.weigh + 'T')}}</text></view>
                            <view class="cell__label">是否含税：<text class="cell__note">{{item.tax}}</text></view>
                        </view>
                    </view>
                </view>
            </block>
        </view>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无我的海运订单</text>
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
                items: ['待确认', '已确认', '已作废'],
				indexActive: 0,
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
                    this.getData();
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
        padding-top: $uni-spacing-col-base;
    }
    
    .cell{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
        
        &__head{
            @include flex();
            padding: $uni-spacing-col-lg 0;
        }
        
        &__name{
            position: relative;
            font-size: 16px;
            padding: 0 $uni-spacing-row-base;
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
                padding-right: 0;
            }
        }
        
        &__row{
            position: relative;
            @include flex(between);
            padding: $uni-spacing-col-lg 0;
        
            &::after{
                @include hr(top);
            }
        }
        
        &__label{
            @include flex-self(keep, top);
            min-height: 1em;
            line-height: 1.5;
            padding-left: $uni-spacing-row-base;
            color: $uni-text-color;
            font-size: 13px;
        }
        
        &__note{
            text-align: left;
            min-height:1em;
            line-height: 1.5;
            padding-right: $uni-spacing-row-base;
            font-size: 14px;
            color: $uni-text-color-grey;
        }
        
        &__col{
            @include flex(null, null, column);
            margin-bottom: -$uni-spacing-col-base;
        }
        
        &__col &__label{
            margin-bottom: $uni-spacing-col-base;
        }
        
        &__helper{
            color: #999;
            padding-right: $uni-spacing-row-base;
            font-size: 13px;
        }
        
        &__num{
            color: $color-main;
            font-size: 14px;
            font-weight: 700;
            padding: 0 $uni-spacing-row-sm;
        }
    }
</style>
