<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="content">

        </view>
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
		background-color: #ffffff;
		padding-bottom: 30upx;
    }
    
    
</style>
