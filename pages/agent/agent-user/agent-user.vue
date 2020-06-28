<template>
	<view class="page">
        <block v-for="(item, index) of data" :key="index">
            <wlp-card-advisory :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-advisory>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
    import wlpCardAdvisory from '@/components/wlp-card/wlp-card-advisory.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getShipAgentList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpCardAdvisory,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
				data: [],
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
        onPageScroll() {
            this.load();
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_UPDATA']),
            _goDetail(param) {
                this.indexPath = param.index;
                router.navigateTo('/pages/company/detail/detail', {type: 'agent', id: this.data[param.index].id, router: 'user'});
            },
            getData(type = 'DownRefresh') {
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                let send = {
                    filter: 'owner',
                    page: this.page
                };
                getShipAgentList(send).then(res => {
                    if(this.page == 1){
                        this.data = res.data;
                    }else{
                        this.data = this.data.concat(res.data);
                    }
                    this.$nextTick(function() {
                        this.load();
                    });
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
			load() { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
				query.selectAll('.page >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
                    	if (images[i].top <= this.windowHeight) {
                            this.$set(this.data[images[i].dataset.index],'show',true);
                    	}else{
                            break;
                        }
                    }
				}).exec()
			}
        }
	}
</script>