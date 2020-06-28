<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="content" v-if="indexActive === 0">
            <block v-for="(item, index) of data[0].list" :key="index">
                <view class="cell" @tap="_toBeConfiremed(item)">
                    <view class="cell__row">
                        <view>
                            <text v-if="item.market_type === 'ship'" class="cell__name">{{item.ship_name}}</text>
                            <text class="cell__name">{{item.departure_name}}->{{item.target_name}}</text>
                        </view>
                        <view class="cell__helper">共<text class="cell__num">{{item.offer_count}}</text>人报价</view>
                    </view>
                    <view class="cell__row">
                        <view class="cell__col">
                            <view class="cell__label">{{item.market_type === 'ship' ? '船舶': '货物'}}类型：<text class="cell__note">{{item.market_type === 'ship' ? item.ship_type: item.cargo_type}}</text></view>
                            <view class="cell__label">{{item.market_type === 'ship' ? '船舶载重': '货物重量'}}：<text class="cell__note">{{item.weight}}T</text></view>
                        </view>
                        <view class="cell__col">
                            <view class="cell__label">{{item.market_type === 'ship' ? '空船': '受载'}}时间：<text class="cell__note">{{item.empty_at}}±{{item.interval}}</text></view>
                            <view class="cell__label">发布时间：<text class="cell__note">{{item.publish_at}}</text></view>
                        </view>
                    </view>
                    <view class="cell__row">
                        <view class="cell__label">订单编号：<text class="cell__note">{{item.order}}</text></view>
                    </view>
                </view>
            </block>
        </view>
        <view class="content" v-else>
            <block v-for="(item, index) of data[indexActive].list" :key="index">
                <view class="cell" @tap="_goDetail(item.id)">
                    <view class="cell__head">
                        <text class="cell__name cell__name--bold" v-if="item.market_type === 'ship'">{{item.ship_name}}/{{item.weight}}T</text>
                        <text class="cell__name cell__name--bold" v-else>{{item.cargo_type}}/{{item.weight}}T</text>
                        <text class="cell__name">{{item.departure_name}}->{{item.target_name}}</text>
                    </view>
                    <view class="cell__row">
                        <view class="cell__label">订单编号</view>
                        <view class="cell__note">{{item.order}}</view>
                    </view>
                    <view class="cell__row">
                        <view class="cell__label">承运方</view>
                        <view class="cell__note">{{item.landlord_name}}</view>
                    </view>
                    <view class="cell__row">
                        <view class="cell__label">托运方</view>
                        <view class="cell__note">{{item.tenant_name}}</view>
                    </view>
                </view>
            </block>
        </view>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无海运订单</text>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getOrderSeaList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniSegmentedControl,
            uniLoadMore
        },
		data() {
			return {
                items: ['待确认', '进行中', '已完成', '已取消'],
				indexActive: 0,
				data: [{
                    status: 1,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                },{
                    status: 2,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                },{
                    status: 3,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                },{
                    status: 0,
                    list: [],
                    page: 1,
                    loadingType: 'more',
                }],
			};
		},
        computed: mapState(['pageTempAdd']),
        async onLoad() {
            toast.loading();
            await this.getData('init');
            toast.hideLoading();
        },
        onShow() {
            if(this.pageTempAdd.hasOwnProperty('palletToBeConfiremed') && this.pageTempAdd.palletToBeConfiremed){
                this.PAGE_TEMP_ADD({field: 'palletToBeConfiremed', palletToBeConfiremed: false});
                this.data[0].list = [];
                this.data[0].page = 1;
                this.data[0].loadingType = 'more';
                this.indexActive = 1;
                this.getData();
            }
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _onClickItem(index){
                this.indexActive = index;
                if(!this.data[index].list.length && this.data[index].loadingType === 'more'){
                    this.getData();
                }
            },
            _toBeConfiremed(obj){
                if(obj.market_type === 'ship'){
                    router.navigateTo('/pages/order/sail-to-be-confiremed/sail-to-be-confiremed', {id: obj.id});
                }else{
                    router.navigateTo('/pages/order/pallet-to-be-confiremed/pallet-to-be-confiremed', {id: obj.id});
                }
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
                getOrderSeaList({ status: this.data[index].status, page: this.data[index].page }).then(res => {
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
            
            &--bold{
                font-weight: bold;
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
