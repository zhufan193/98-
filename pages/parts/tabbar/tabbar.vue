<template>
	<view class="page">
        <block v-for="(item, index) of data" :key="index">
            <wlp-card-parts :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-parts>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
        
        <wlp-fab title="发布船舶备件" @click="_release()"></wlp-fab>
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import wlpCardParts from '@/components/wlp-card/wlp-card-parts.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, debounce } from '@/common/util.js';
    import { getShipPartsList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpFab,
            wlpCardParts,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
				data: [],
                page: 1,
                loadingType: 'more',
                type_index: -1,
                type_id: ''
			};
		},
        computed: mapState(['hasLogin', 'screenTemp']),
        async onLoad() {
            toast.loading();
            await this.getData('init');
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            toast.hideLoading();
        },
        onShow() {
            if(this.screenTemp.hasOwnProperty('parts') && this.screenTemp.parts.init){
                let screen = this.screenTemp.parts;
                this.type_index = screen.componentTypeIndex;
                this.type_id = screen.componentTypeId;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'parts',
                    parts: screen
                })
                this.getData();
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            router.navigateTo('/pages/parts/parts-screen/parts-screen');
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
                router.navigateTo('/pages/parts/parts-add/parts-add');
            },
            _goDetail(param) {
                this.goPage({type: 'component', id: this.data[param.index].id})
            },
            goPage(e) {
                router.navigateTo('/pages/company/detail/detail', e);
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
                    page: this.page
                };
                if(this.type_index >= 0){
                    send.type = this.type_id;
                }
                getShipPartsList(send).then(res => {
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