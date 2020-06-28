<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="indexActive === 0">
            <block v-for="(item, index) of data[0].list" :key="index">
                <wlp-card-sand-sell type="sell" :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-sand-sell>
            </block>
        </template>
        <template v-if="indexActive === 1">
            <block v-for="(item, index) of data[1].list" :key="index">
                <wlp-card-sand-buy type="buy" :options="item" :index="index" @click="_goDetail"></wlp-card-sand-buy>
            </block>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无砂石交易信息</text>
        </view>
        
        <wlp-fab :title="indexActive === 0 ? '发布砂石供应' : '发布砂石求购'" @click="_release()"></wlp-fab>
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import wlpCardSandSell from '@/components/wlp-card/wlp-card-sand-sell.vue';
    import wlpCardSandBuy from '@/components/wlp-card/wlp-card-sand-buy.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getSandBuyList, getSandSellList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpFab,
            uniSegmentedControl,
            wlpCardSandSell,
            wlpCardSandBuy,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
				indexActive: 0,
                items: ['供应砂石', '求购砂石'],
                data: [{
                    list: [],
                    sand_index: [0, 0],
                    sand_id: '',
                    sand_name: '',
                    router: '/pages/sand/detail/detail',
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    sand_index: [0, 0],
                    sand_id: '',
                    sand_name: '',
                    router: '/pages/sand/detail/detail',
                    page: 1,
                    loadingType: 'more'
                }]
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
            if(this.screenTemp.hasOwnProperty('sand') && this.screenTemp.sand.init){
                let screen = this.screenTemp.sand;
                this.data[this.indexActive].sand_id = screen.sandTypeId;
                this.data[this.indexActive].sand_index = screen.sandTypeIndex;
                this.data[this.indexActive].sand_name = screen.sandTypeName;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'sand',
                    sand: screen
                })
                this.getData();
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            router.navigateTo('/pages/sand/screen/screen');
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        onPageScroll() {
            if(this.indexActive === 0){
                this.load();
            }
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.screenTemp.hasOwnProperty('sand')){
                    let screen = this.screenTemp.sand;
                    screen.sandTypeId = this.data[this.indexActive].sand_id;
                    screen.sandTypeIndex = this.data[this.indexActive].sand_index;
                    screen.sandTypeName = this.data[this.indexActive].sand_name;
                    this.SCREEN_TEMP({
                        field: 'sand',
                        sand: screen
                    })
                }
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _release() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                let url = this.indexActive === 0 ? '/pages/sand/sell-add/sell-add' : '/pages/sand/buy-add/buy-add';
                router.navigateTo(url);
            },
            _goDetail(param) {
                let index = this.indexActive;
                router.navigateTo(this.data[index].router, {id: this.data[index].list[param.index].id, type: param.type});
            },
            getData(type='DownRefresh') {
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
                if(this.indexActive === 0){
                    getSandSellList({page: this.data[index].page, type: this.data[index].sand_id}).then(res => {
                        this.setData(type, res, index);
                    })
                }else if(this.indexActive === 1){
                    getSandBuyList({page: this.data[index].page, type: this.data[index].sand_id}).then(res => {
                        this.setData(type, res, index);
                    })
                }
            },
            setData(type, res, index){
                if(this.data[index].page == 1){
                    this.data[index].list = res.data;
                }else{
                    this.data[index].list = this.data[index].list.concat(res.data);
                }
                if(index === 0){
                    this.$nextTick(function() {
                        this.load();
                    });
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
            },
			load() { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
				query.selectAll('.page >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
                    	if (images[i].top <= this.windowHeight) {
                            this.$set(this.data[0].list[images[i].dataset.index],'show',true);
                    	}else{
                            break;
                        }
                    }
				}).exec()
			}
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding: 54px 0 $uni-spacing-col-base;
    }
</style>
