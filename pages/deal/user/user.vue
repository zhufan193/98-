<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="indexActive === 0">
            <block v-for="(item, index) of data[0].list" :key="index">
                <wlp-card-deal-into :options="item" :index="index" @click="_goDetail"></wlp-card-deal-into>
            </block>
        </template>
        <template v-if="indexActive === 1">
            <block v-for="(item, index) of data[1].list" :key="index">
                <wlp-card-deal-out :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-deal-out>
            </block>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无船舶交易信息</text>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import wlpCardDealInto from '@/components/wlp-card/wlp-card-deal-into.vue';
    import wlpCardDealOut from '@/components/wlp-card/wlp-card-deal-out.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getShipBuyList, getShipSellList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniSegmentedControl,
            wlpCardDealInto,
            wlpCardDealOut,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
                items: ['船舶求购', '船舶出售'],
                data: [{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                }],
				indexActive: 0,
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
                this.data[this.indexActive].list.splice(this.indexPath, 1);
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
            _onClickItem(e) {
                this.indexActive = e;
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _goDetail(param) {
                let index = this.indexActive;
                this.indexPath = param.index;
                router.navigateTo('/pages/deal/detail/detail', {id: this.data[index].list[param.index].id, type: param.type, router: 'user'});
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
                    getShipBuyList({filter: 'owner', page: this.data[index].page}).then(res => {
                        this.setData(type, res, index);
                    })
                }else if(this.indexActive === 1){
                    getShipSellList({filter: 'owner', page: this.data[index].page}).then(res => {
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
                if(index === 1){
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
                            this.$set(this.data[1].list[images[i].dataset.index],'show',true);
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
