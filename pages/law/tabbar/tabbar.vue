<template>
	<view class="page">
        <block v-for="(item, index) of data" :key="index">
            <wlp-card-advisory :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-advisory>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
        
        <wlp-fab title="发布法律咨询" @click="_release()"></wlp-fab>
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import wlpCardAdvisory from '@/components/wlp-card/wlp-card-advisory.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, debounce } from '@/common/util.js';
    import { getCompanyLawList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpFab,
            wlpCardAdvisory,
            uniLoadMore,
        },
        computed: mapState(['hasLogin', 'screenTemp']),
		data() {
			return {
                windowHeight: 0,
				data: [],
                page: 1,
                loadingType: 'more',
                searchValue: '',
                city_id: ''
			};
		},
        async onLoad() {
            toast.loading();
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            await this.getData('init');
            toast.hideLoading();
        },
        onShow() {
            if(this.screenTemp.hasOwnProperty('law') && this.screenTemp.law.init){
                let screen = this.screenTemp.law;
                this.city_id = screen.city_id;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'law',
                    law: screen
                })
                this.getData();
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
        onNavigationBarSearchInputChanged(e) {
            this._searchChange(this, e.text);
        },
        onNavigationBarSearchInputConfirmed(e) {
            this._searchChange(this, e.text);
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            router.navigateTo('/pages/law/law-screen/law-screen');
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val == '' && val != vm.searchValue){
                    return;
                }
                vm.searchValue = val;
                vm.getData();
            }, 1000, false),
            _release() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                router.navigateTo('/pages/law/law-add/law-add');
            },
            _goDetail(param) {
                router.navigateTo('/pages/company/detail/detail', {type: 'legal_advice', id: this.data[param.index].id});
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
                    search: this.searchValue,
                    page: this.page
                };
                if(this.city_id){
                    send.city_id = this.city_id;
                }
                getCompanyLawList(send).then(res => {
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
