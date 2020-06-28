<template>
	<view class="page">
        <wlp-swiper-tab :fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template>
            <template v-if="indexActive === 0">
                <block v-for="(item, index) of data[0].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-sail :options="item" :index="index" @click="_goDetail"></wlp-card-sail>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 1">
                <block v-for="(item, index) of data[1].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-pallet :options="item" :index="index" @click="_goDetail"></wlp-card-pallet>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 2">
                <block v-for="(item, index) of data[2].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-deal-into :options="item" :index="index" @click="_goDetail"></wlp-card-deal-into>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 3">
                <block v-for="(item, index) of data[3].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-deal-out :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-deal-out>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 4">
                <block v-for="(item, index) of data[4].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-hire :options="item" :index="index" @click="_goDetail"></wlp-card-hire>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 5">
                <block v-for="(item, index) of data[5].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-rent :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-rent>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 6">
                <block v-for="(item, index) of data[6].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-sand-sell :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-sand-sell>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
            <template v-else-if="indexActive === 7">
                <block v-for="(item, index) of data[7].list" :key="index">
                    <uni-swipe-action :options="[{text: '取消关注'}]" :index="index" @click="bindClick">
                        <wlp-card-sand-buy type="buy" :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-sand-buy>
                    </uni-swipe-action>
                    <view class="hr"></view>
                </block>
            </template>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无关注信息</text>
        </view>
	</view>
</template>

<script>
    import wlpSwiperTab from '@/components/wlp-swiper-tab/wlp-swiper-tab.vue';
	import uniSwipeAction from '../components/uni-swipe-action/uni-swipe-action.vue'
    import wlpCardSail from '@/components/wlp-card/wlp-card-sail.vue';
    import wlpCardPallet from '@/components/wlp-card/wlp-card-pallet.vue'
    import wlpCardDealInto from '@/components/wlp-card/wlp-card-deal-into.vue';
    import wlpCardDealOut from '@/components/wlp-card/wlp-card-deal-out.vue';
    import wlpCardHire from '@/components/wlp-card/wlp-card-hire.vue';
    import wlpCardRent from '@/components/wlp-card/wlp-card-rent.vue';
    import wlpCardSandSell from '@/components/wlp-card/wlp-card-sand-sell.vue';
    import wlpCardSandBuy from '@/components/wlp-card/wlp-card-sand-buy.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, dateUtils, toast } from '@/common/util.js';
    import { getMyCollection, postUnCollection } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpSwiperTab,
            uniSwipeAction,
            wlpCardSail,
            wlpCardPallet,
            wlpCardDealInto,
            wlpCardDealOut,
            wlpCardHire,
            wlpCardRent,
            wlpCardSandSell,
            wlpCardSandBuy,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
                items: ['船期', '货盘', '船舶求购', '船舶出售', '船舶求租', '船舶出租', '供应砂石', '求购砂石'],
                itemsType: [
                    {
                        type: 'ship_market',
                        router: '/pages/sail/detail/detail'
                    },{
                        type: 'cargo_market',
                        router: '/pages/pallet/detail/detail'
                    },{
                        type: 'ship_buy',
                        router: '/pages/deal/detail/detail'
                    },{
                        type: 'ship_sell',
                        router: '/pages/deal/detail/detail'
                    },{
                        type: 'ship_rent',
                        router: '/pages/rent/detail/detail'
                    },{
                        type: 'ship_rent',
                        router: '/pages/rent/detail/detail'
                    },{
                        type: 'sand_sell',
                        router: '/pages/sand/detail/detail'
                    },{
                        type: 'sand_buy',
                        router: '/pages/sand/detail/detail'
                    }
                ],
                data: [{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
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
            this.PAGE_TEMP_UPDATA(null);
            this.getData();
        },
        onShow() {
            // 取消关注后删除列表
            if(this.pageTempData && !this.pageTempData.has_favorited){
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
        onPageScroll() {
            if(this.indexActive === 3 || this.indexActive === 5){
                this.load();
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_UPDATA']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            // 取消关注按钮
			bindClick(value) {
                let index = value.listIndex;
                postUnCollection(this.data[this.indexActive].list[index].id, {type: this.itemsType[this.indexActive].type}).then(res => {
                    toast.success('取消关注成功！');
                    this.data[this.indexActive].list.splice(index, 1);
                });
			},
            _goDetail(param) {
                let index = this.indexActive;
                this.indexPath = param.index;
                router.navigateTo(this.itemsType[index].router, {id: this.data[index].list[param.index].id, type: param.type});
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
                let send = {type: this.itemsType[index].type, page: this.data[index].page};
                if(this.indexActive === 5){
                    send.rent_type = 'rent';
                }
                getMyCollection(send).then(res => {
                    if(index == 0 || index == 1){
                        for(let i = 0, len = res.data.length; i < len; i++){
                            res.data[i].resDate = dateUtils.format(res.data[i].updated_at);
                        }
                    }
                    if(this.data[index].page == 1){
                        this.data[index].list = res.data;
                    }else{
                        this.data[index].list = this.data[index].list.concat(res.data);
                    }
                    if(index === 3 || index === 5 || index === 6){
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
                })
            },
            load() { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
                query.selectAll('.page >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
                        if (images[i].top <= this.windowHeight) {
                            this.$set(this.data[this.indexActive].list[images[i].dataset.index],'show',true);
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
    
    wlp-card-sail .list__cell,
    wlp-card-pallet .card,
    wlp-card-deal-into .card,
    wlp-card-deal-out .card,
    wlp-card-hire .card,
    wlp-card-rent .card,
    wlp-card-sand-sell .card,
    wlp-card-sand-buy .card{
        margin-bottom: 0;
    }
    
    .hr{
        height: $uni-spacing-col-base;
    }
</style>
