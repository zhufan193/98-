<template>
	<view>
        <view class="uni-product-list">
            <block v-for="(item, index) in data" :key="index">
                <view class="uni-product">
                    <view class="card" @tap="goPage(item)">
                        <view class="image-view lazy" :class="{is_lazy: !item.show}" :data-index="index">
                            <image class="uni-product-image lazy__img" :src="item.show ? item.cover : ''" @load="imageLoad(index)" mode="aspectFill"></image>
                            <image class="uni-product-image lazy__img lazy__placeholder" :class="{lazy__loaded: item.loaded}" src="/static/img/loading800x500.jpg" mode="aspectFill"></image>
                        </view>
                        <view class="uni-product-title">{{item.name}}</view>
                    </view>
                </view>
            </block>
        </view>
	    <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, debounce } from '@/common/util.js';
    import { getPortList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniLoadMore
        },
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
        computed: mapState(['screenTemp']),
        async onLoad() {
            toast.loading();
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            await this.getData('init');
            toast.hideLoading();
        },
        onShow() {
            if(this.screenTemp.hasOwnProperty('port') && this.screenTemp.port.init){
                let screen = this.screenTemp.port;
                this.city_id = screen.city_id;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'port',
                    port: screen
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
            router.navigateTo('/pages/port/screen/screen');
        },
        methods: {
            ...mapMutations(['SCREEN_TEMP']),
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val == '' && val != vm.searchValue){
                    return;
                }
                vm.searchValue = val;
                vm.getData();
            }, 1000, false),
            goPage(e) {
                router.navigateTo('/pages/port/detail/detail', e);
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
                getPortList(send).then(res => {
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
            imageLoad(index){
                this.$set(this.data[index], 'loaded', true);
            },
			load() { // 图片懒加载
                uni.createSelectorQuery().in(this).selectAll('.is_lazy').boundingClientRect((images) => {
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

<style lang="scss">
    @import '@/style/page/card.scss';
    @import '@/style/page/lazy.scss';
    
    .uni-product-list{
        justify-content: space-between;
        box-sizing: border-box;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
    }
    
    .uni-product{
        padding: 0 0 $uni-spacing-col-base 0;
    }
    
    .card, .image-view{
        margin: 0;
    }
    
    .image-view{
        width: 340rpx;
        height: initial;
        padding-bottom: 62.5%;
    }
    
    .uni-product-title{
        width: initial;
        padding: $uni-spacing-col-base 0;
        text-align: center;
        color: $uni-text-color;
        font-size: $uni-font-size-lg;
    }
</style>
