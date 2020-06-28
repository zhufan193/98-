<template>
	<view class="page">
		<block v-for="(item, index) of data" :key="index">
            <view class="invoice" hover-class="invoice__hover" @tap="_goDetail(item.id)">
                <view class="invoice__content">
                    <view class="invoice__title">{{item.name}}</view>
                    <view class="invoice__note">{{item.type === 1 ? '企业发票' : '个人发票'}}</view>
                </view>
                <uni-icons size="20" color="#bbb" type="arrowright" />
            </view>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
        
        <wlp-fab title="添加发票信息" @click="is_popup = true"></wlp-fab>
        
        <uni-popup :show="is_popup" position="middle" mode="fixed" @hidePopup="is_popup = false">
            <uni-icons class="popup__close" type="closeempty" size="32" color="#333" @click="is_popup = false"/>
            <view class="popup__text">选择发票归属类型</view>
            <button class="popup__btn" type="warn" @click="_goPage('/pages/invoice/release/release', {type: 'company'})">企业发票</button>
            <button class="popup__btn" type="primary" @click="_goPage('/pages/invoice/release/release', {type: 'user'})">个人发票</button>
        </uni-popup>
        
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

    import { router, toast } from '@/common/util.js';
    import { getInvoiceList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniLoadMore,
            wlpFab,
            uniPopup
        },
        computed: mapState(['pageTempAdd']),
		data() {
			return {
                is_popup: false,
				data:[],
                page: 1,
                loadingType: 'more',
			}
		},
        onLoad() {
            this.getData('init');
        },
        onShow() {
            if(this.pageTempAdd.hasOwnProperty('invoiceAdd') && this.pageTempAdd.invoiceAdd){
                this.PAGE_TEMP_ADD({field: 'invoiceAdd', invoiceAdd: false});
                this.getData();
            }
        },
        onHide() {
            if (this.is_popup) {
                this.is_popup = false;
            }
        },
        onBackPress() {
            if (this.is_popup) {
                this.is_popup = false;
                return true;
            }
        },
        onPullDownRefresh() { // 下拉刷新
            this.getData();
        },
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
		methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _goPage(url, param){
                router.navigateTo(url, param);
            },
            _goDetail(id) {
                router.navigateTo('/pages/invoice/detail/detail?id=' + id);
            },
            getData(type = 'DownRefresh') {
                if (type == 'DownRefresh') {
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if (type == 'ReachBottom') {
                    if (this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                getInvoiceList({page: this.page}).then(res => {
                    if (this.page == 1) {
                        this.data = res.data;
                    } else {
                        this.data = this.data.concat(res.data);
                    }
                    if (type == 'DownRefresh') {
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
            }
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    
    .page{
        @include flex(null, null, column);
    }
    
    .invoice{
        @include flex(null, center);
        margin-bottom: $uni-spacing-col-base;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        background-color: #fff;
        
        &__hover{
            background-color: #f8f8f8;
        }
        
        &__content{
            flex: auto;
            @include flex(null, null, column);
        }
        
        &__title{
            font-size: 36rpx;
            font-weight: 700;
            color: $uni-text-color;
        }
        
        &__note{
            margin-top: $uni-spacing-col-base;
            font-size: 24rpx;
            color: $uni-text-color-grey;
        }
    }
    
    .popup{
        
        &__close{
            position: absolute;
            right: 0;
            top: 0;
        }
        
        &__text{
            color: $uni-text-color;
            font-size: 16px;
            padding: $uni-spacing-col-base 0;
        }
        
        &__btn{
            width: 500rpx;
            margin-top: $uni-spacing-col-base * 2;
        }
    }
</style>
