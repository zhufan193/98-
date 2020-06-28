<template>
	<view class="page">
        <wlp-swiper-tab fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="indexActive === 0">
            <block v-for="(newsitem,index) in data[0].list" :key="index">
                <uni-swipe-action :options="[{text: '取消收藏'}]" :index="index" @click="bindClick">
                    <media-list :options="newsitem" :index="index" @click="_goDetail({index: index})"></media-list>
                </uni-swipe-action>
            </block>
        </template>
        <template v-else>
            <block v-for="(item, index) of data[indexActive].list" :key="index">
                <view class="hr"></view>
                <uni-swipe-action :options="[{text: '取消收藏'}]" :index="index" @click="bindClick">
                    <wlp-card-oil-store v-if="indexActive === 6" :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-oil-store>
                    <wlp-card-advisory v-else :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-advisory>
                </uni-swipe-action>
            </block>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无收藏信息</text>
        </view>
	</view>
</template>

<script>
    import wlpSwiperTab from '@/components/wlp-swiper-tab/wlp-swiper-tab.vue';
	import uniSwipeAction from '../components/uni-swipe-action/uni-swipe-action.vue'
	import mediaList from '@/components/tab-nvue/mediaList.vue';
    import wlpCardAdvisory from '@/components/wlp-card/wlp-card-advisory.vue';
    import wlpCardOilStore from '@/components/wlp-card/wlp-card-oil-store.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getMyCollection, postUnCollection } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpSwiperTab,
            uniSwipeAction,
            mediaList,
            wlpCardAdvisory,
            wlpCardOilStore,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
                items: ['资讯', '船舶维修', '配件设备', '法律咨询', '财务咨询', '船舶代理', '油商黄页'],
                itemsType: [
                    {
                        type: 'news',
                        router: '/pages/news/detail/detail'
                    },{
                        type: 'maintain',
                        router: '/pages/company/detail/detail'
                    },{
                        type: 'component',
                        router: '/pages/company/detail/detail'
                    },{
                        type: 'legal_advice',
                        router: '/pages/company/detail/detail'
                    },{
                        type: 'finance_advice',
                        router: '/pages/company/detail/detail'
                    },{
                        type: 'ship_agent',
                        router: '/pages/company/detail/detail'
                    },{
                        type: 'oil_company',
                        router: '/pages/oil/store-detail/store-detail'
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
            // 取消收藏后删除列表
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
            this.load();
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_UPDATA']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            // 取消收藏按钮
			bindClick(value) {
                let index = value.listIndex;
                postUnCollection(this.data[this.indexActive].list[index].id, {type: this.itemsType[this.indexActive].type}).then(res => {
                    toast.success('取消收藏成功！');
                    this.data[this.indexActive].list.splice(index, 1);
                });
			},
            _goDetail(param) {
                let index = this.indexActive;
                this.indexPath = param.index;
                router.navigateTo(this.itemsType[index].router, {path: 'collection', type: this.itemsType[index].type, id: this.data[index].list[param.index].id});
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
                getMyCollection({type: this.itemsType[index].type, page: this.data[index].page}).then(res => {
                    if(this.data[index].page == 1){
                        this.data[index].list = res.data;
                    }else{
                        this.data[index].list = this.data[index].list.concat(res.data);
                    }
                    this.$nextTick(function() {
                        this.load();
                    });
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
    @import '@/style/page/empty.scss';
    
    .page{
        padding-top: 44px; 
    }
    
    wlp-card-advisory .card{
        margin-bottom: 0;
    }
    
    .hr{
        height: $uni-spacing-col-base;
    }
</style>