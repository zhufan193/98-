<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="indexActive === 0">
            <block v-for="(item, index) of data[0].list" :key="index">
                <wlp-card-hire :options="item" :index="index" @click="_goDetail"></wlp-card-hire>
            </block>
        </template>
        <template v-if="indexActive === 1">
            <block v-for="(item, index) of data[1].list" :key="index">
                <wlp-card-rent :options="item" :index="index" :show="item.show" @click="_goDetail"></wlp-card-rent>
            </block>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">暂无船舶租赁信息</text>
        </view>
        
        <wlp-fab :title="indexActive === 0 ? '发布船舶求租' : '发布船舶出租'" @click="_release()"></wlp-fab>
        
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import wlpCardHire from '@/components/wlp-card/wlp-card-hire.vue';
    import wlpCardRent from '@/components/wlp-card/wlp-card-rent.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getShipRentList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            wlpFab,
            uniSegmentedControl,
            wlpCardHire,
            wlpCardRent,
            uniLoadMore
        },
		data() {
			return {
                windowHeight: 0,
                items: ['船舶求租', '船舶出租'],
                data: [{
                    type: 'beRent',
                    list: [],
                    page: 1,
                    loadingType: 'more',
                    router: '/pages/rent/detail/detail',
                    type_id: '',
                    type_name: '',
                    type_index: '',
                    load_min: '',
                    load_max: '',
                    age_index: -1,
                },{
                    type: 'rent',
                    list: [],
                    page: 1,
                    loadingType: 'more',
                    router: '/pages/rent/detail/detail',
                    type_id: '',
                    type_name: '',
                    type_index: '',
                    load_min: '',
                    load_max: '',
                    price_min: '',
                    price_max: ''
                }],
				indexActive: 0,
                drawerVisible: false,
                shipTypeArray: [],
                shipAgeList: [{value: 1,name: "1",},{value: 2,name: "2",},{value: 3,name: "3",},{value: 4,name: "4",},{value: 5,name: "5",},{value: 6,name: "6",},{value: 7,name: "7",},{value: 8,name: "8",},{value: 9,name: "9",},{value: 10,name: "10",},]
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
            if(this.screenTemp.hasOwnProperty('rent') && this.screenTemp.rent.init){
                let screen = this.screenTemp.rent;
                    this.data[this.indexActive].type_id = screen.shipTypeId;
                    this.data[this.indexActive].type_index = screen.shipTypeIndex;
                    this.data[this.indexActive].type_name = screen.shipTypeName;
                    this.data[this.indexActive].load_min = screen.load_min;
                    this.data[this.indexActive].load_max = screen.load_max;
                    if(this.indexActive == 0){
                        this.data[this.indexActive].price_min = screen.price_min;
                        this.data[this.indexActive].price_max = screen.price_max;
                    }else{
                        this.data[this.indexActive].age_index = screen.shipAgeIndex;
                    }
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'rent',
                    rent: screen
                })
                this.getData();
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            router.navigateTo('/pages/rent/screen/screen');
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        onPageScroll() {
            if(this.indexActive === 1){
                this.load();
            }
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.screenTemp.hasOwnProperty('rent')){
                    let screen = this.screenTemp.rent;
                    screen.indexActive = this.indexActive;
                    screen.shipTypeId = this.data[this.indexActive].type_id;
                    screen.shipTypeIndex = this.data[this.indexActive].type_index;
                    screen.shipTypeName = this.data[this.indexActive].type_name;
                    screen.load_min = this.data[this.indexActive].load_min;
                    screen.load_max = this.data[this.indexActive].load_max;
                    if(this.indexActive == 0){
                        screen.shipAgeIndex = this.data[this.indexActive].age_index;
                    }else{
                        screen.price_min = this.data[this.indexActive].price_min;
                        screen.price_max = this.data[this.indexActive].price_max;
                    }
                    this.SCREEN_TEMP({
                        field: 'rent',
                        rent: screen
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
                let url = this.indexActive === 0 ? '/pages/rent/hire-add/hire-add' : '/pages/rent/rent-add/rent-add';
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
                let send = {
                        type: this.data[index].type, 
                        page: this.data[index].page,
                        ship_type: this.data[index].type_id
                    };
                if(this.data[index].load_min != '' || this.data[index].load_max != ''){
                    send.load = this.data[index].load_min + ',' + this.data[index].load_max;
                }
                if(index === 0) {
                    if(this.data[0].age_index >= 0){
                        send.age = this.data[0].age_index + 1;
                    }
                } else {
                    if(this.data[1].price_min != '' || this.data[1].price_max != ''){
                        send.load = this.data[1].price_min + ',' + this.data[1].price_max;
                    }
                }
				getShipRentList(send).then(res => {
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
				})
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
    
    .list{
        padding: $uni-spacing-col-lg $uni-spacing-row-base 0;
    }
</style>
