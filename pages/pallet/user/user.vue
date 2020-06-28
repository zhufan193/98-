<template>
    <view class="page">
        <block v-for="(item, index) of data" :key="index">
            <wlp-card-pallet :options="item" :index="index" @click="_goDetail"></wlp-card-pallet>
        </block>
        <uni-load-more v-if="data.length" :status="loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无我的货盘发布信息</text>
        </view>
    </view>
</template>

<script>
    import wlpCardPallet from '@/components/wlp-card/wlp-card-pallet.vue'
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

    import { router, toast, dateUtils } from '@/common/util.js';
    import { getPalletList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            wlpCardPallet,
            uniLoadMore
        },
		data() {
			return {
				data:[],
                page: 1,
                loadingType: 'more',
                indexPath: null
			};
		},
        computed: mapState(['pageTempData']),
        onLoad() {
            this.getData();
        },
        onShow() {
            // 删除列表
            if(this.pageTempData){
                this.data.splice(this.indexPath, 1);
                this.indexPath = null;
                this.PAGE_TEMP_UPDATA(null);
            }
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
                router.navigateTo('/pages/pallet/detail/detail', {id: this.data[param.index].id, router: 'user'});
            },
            getData(type = 'DownRefresh') {
                if (type == 'DownRefresh') {
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if (type == 'ReachBottom') {
                    if (this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                getPalletList({filter: 'owner', page: this.page}).then(res => {
                    for(let i = 0, len = res.data.length; i < len; i++){
                        res.data[i].resDate = dateUtils.format(res.data[i].updated_at);
                    }
                    if (this.page == 1) {
                        this.data = res.data;
                    } else {
                        this.data = this.data.concat(res.data);
                    }
                    if (type == 'DownRefresh') {
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
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/empty.scss';

</style>
