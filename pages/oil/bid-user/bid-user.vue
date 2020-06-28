<template>
	<view class="page">
        <block v-for="(item, index) of data" :key="index">
            <wlp-card-oil-bid :options="item" :index="index" :minute="item.minute" :second="item.second" @click="_goDetail"></wlp-card-oil-bid>
        </block>
        <uni-load-more v-if="data.length" :status="loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无竞价信息</text>
        </view>
	</view>
</template>

<script>
    import wlpCardOilBid from '@/components/wlp-card/wlp-card-oil-bid.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, dateUtils } from '@/common/util.js';
    import { getOilBidList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
    var time_id = null;
    
	export default {
        components:{
            wlpCardOilBid,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
                data: [],
				indexActive: 0,
                page: 1,
                loadingType: 'more',
                indexPath: null
			};
		},
        computed: mapState(['pageTempData']),
        onLoad() {
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            this.getData();
        },
        onShow() {
            time_id = setInterval(this.upDate, 1000);
            // 删除列表
            if(this.pageTempData){
                this.data.splice(this.indexPath, 1);
                this.indexPath = null;
                this.PAGE_TEMP_UPDATA(null);
            }
        },
        onUnload() {
            clearInterval(time_id);
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_UPDATA']),
            _goDetail(param) {
                this.indexPath = param.index;
                router.navigateTo('/pages/oil/bid-detail/bid-detail', {id: this.data[param.index].id, router: 'user'});
            },
            getData(type='DownRefresh') {
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                getOilBidList({filter: 'owner', page: this.page}).then(res => {
                    if(this.page == 1){
                        this.data = res.data;
                    }else{
                        this.data = this.data.concat(res.data);
                    }
                    if(type == 'DownRefresh'){
                        uni.stopPullDownRefresh();
                        toast.hideLoading();
                    }
                    if(res.data.length < 15){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page ++;
                    }
                });
            },
            upDate() { // 计时器
                let query = uni.createSelectorQuery().in(this);
                query.selectAll('.page >>> .is_upDate').boundingClientRect((res) => {
                    for(let i = 0, len = res.length; i < len; i++){
                        let obj = this.data[res[i].dataset.index];
                    	if (res[i].top <= this.windowHeight && res[i].bottom >= 44) {
                            this.resDate(obj);
                    	}
                    }
                }).exec()
            },
            resDate(obj) { // 计算器数值生成
                let date = dateUtils.parse(obj.end_at);
                let diff = date.getTime() - Date.now();
                if(diff > 0){
                    let minute = Math.floor(diff / 60000);
                    let second = Math.floor(diff % 60000 / 1000);
                    this.$set(obj, 'minute', minute <= 9 ? '0' + minute : minute);
                    this.$set(obj, 'second', second <= 9 ? '0' + second : second);
                }else{
                    this.$set(obj,'state', 4);
                    this.$set(obj,'state_str', '竞价结束');
                }
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding: 0 0 $uni-spacing-col-base;
    }
</style>
