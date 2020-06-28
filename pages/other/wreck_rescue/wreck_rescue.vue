<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="list">
            <block v-for="(item, index) of data[indexActive].list" :key="index">
                <view class="list__cell">
                    <view class="list__title">
                        {{item.title}}
                    </view>
                    <block v-for="(phone, indexPhone) of item.list" :key="indexPhone">
                        <view class="list__helper" hover-class="list__hover" @tap="_cellPhone(phone)">
                            {{phone}}
                            <image class="list__img" src="../../../static/icon/icon-phone.png" mode="aspectFit"></image>
                        </view>
                    </block>
                </view>
            </block>
        </view>
	    <uni-load-more :status="data[indexActive].loadingType"></uni-load-more>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, debounce } from '@/common/util.js';
    import { getWreckRescue } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
    var vw;
    
	export default {
        components:{
            uniSegmentedControl,
            uniIcons,
            uniLoadMore
        },
        computed: mapState(['userLocation']),
		data() {
			return {
                indexActive: 0,
                items: ['交通运输部救助打捞局', '全国海上搜救中心'],
				data: [{
                    list: [],
                    page: 1,
                    loadingType: 'more',
                    searchValue: ''
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more',
                    searchValue: ''
                }]
			};
		},
        async onLoad() {
            // #ifdef APP-PLUS
            vw = this.$mp.page.$getAppWebview();  
            // #endif
            await this.getLocation();
            this.getData();
        },
        onNavigationBarSearchInputChanged(e) {
            this._searchChange(this, e.text);
        },
        onNavigationBarSearchInputConfirmed(e) {
            this._searchBtn(this, e.text);
        },
        onNavigationBarButtonTap(){
            // #ifdef APP-PLUS
            vw.setTitleNViewSearchInputText('');  
            // #endif
            this._searchBtn(this, '');
        },
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            ...mapActions(['getLocation']),
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val === vm.data[vm.indexActive].searchValue){
                    return;
                }
                vm.data[vm.indexActive].searchValue = val;
                vm.getData();
            }, 1000, false),
            _searchBtn: debounce((vm, val) => { // 防抖动搜索
                if(val === vm.data[vm.indexActive].searchValue){
                    return;
                }
                vm.data[vm.indexActive].searchValue = val;
                vm.getData();
            }, 1000, true),
            _onClickItem(e) {
                this.indexActive = e;
                // #ifdef APP-PLUS
                vw.setTitleNViewSearchInputText(this.data[this.indexActive].searchValue);  
                // #endif
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _cellPhone(phone) {
                uni.makePhoneCall({
                    phoneNumber: phone
                })
            },
            getData(type = 'DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].page = 1;
                    this.data[index].loadingType = 'more';
                    toast.loading();
                    uni.pageScrollTo({
                        scrollTop: 0
                    })
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
                let send = {
                    longitude: this.userLocation.longitude,
                    latitude: this.userLocation.latitude,
                    type: this.indexActive + 1,
                    title: this.data[index].searchValue,
                    page: this.data[index].page
                };
                getWreckRescue(send).then(res => {
                    for(let i = 0, len = res.data.length; i < len; i++) {
                        res.data[i].list = res.data[i].phone.split(',');
                    }
                    if(this.data[index].page == 1){
                        this.data[index].list = res.data;
                    }else{
                        this.data[index].list = this.data[index].list.concat(res.data);
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
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    
    .search{
        @include flex(between, center);
        height: 38px;
        padding: 0 11px;
        margin: $uni-spacing-col-lg $uni-spacing-row-base;
        background-color: rgba(255,255,255,0.8);
        border-radius: 22px;
        box-shadow: 0 0 11rpx rgba(0,0,0,0.1);
        
        &__input{
            flex: auto;
            height: 100%;
            padding: 0 $uni-spacing-row-base;
        }
    }
    
    .list{
        padding: 54px 0 0;
        
        &__cell{
            @include flex(null, null, column);
            margin-bottom: $uni-spacing-col-base;
            background-color: #fff;
        }
        
        &__hover{
            background-color: #f8f8f8;
        }
        
        &__title{
            font-size: 36rpx;
            font-weight: 700;
            color: $uni-text-color;
            padding: $uni-spacing-col-lg $uni-spacing-row-base;
        }
        
        &__helper{
            position: relative;
            @include flex(between, center);
            padding: $uni-spacing-col-lg $uni-spacing-row-base;
            font-size: 32rpx;
            color: $color-main;
            
            &::after{
                @include hr(top, $uni-spacing-row-base);
            }
        }
        
        &__img{
            display: block;
            width: 32rpx;
            height: 32rpx;
        }
    }
</style>