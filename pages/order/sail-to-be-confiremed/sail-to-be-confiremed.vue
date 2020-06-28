<template>
	<view class="page">
        <block v-for="(item, index) of data" :key="index">
            <view class="form" :class="{'order': item.status == 2}">
                <view class="form__cell">
                    <view class="form__label">报价时间</view>
                    <view class="form__note">{{item.publish_at}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">货主名称</view>
                    <view class="form__note">{{item.contact}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">货物类型</view>
                    <view class="form__note">{{item.cargo_name}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">货物重量（吨）</view>
                    <view class="form__note">{{item.weigh}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">受载时间</view>
                    <view class="form__note">{{item.empty_date}}±{{item.empty_days}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">承运单价（元/吨）</view>
                    <view class="form__note" v-if="item.price == 0">电议</view>
                    <view class="form__note price" v-else>{{item.price}}元/吨</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">定金</view>
                    <view class="form__note" v-if="item.money == 0">电议</view>
                    <view class="form__note price" v-else>{{item.money}}元</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">是否含税</view>
                    <view class="form__note">{{item.tax}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">备注</view>
                    <view class="form__note">{{item.remark ? item.remark : '无'}}</view>
                </view>
                <view class="form__cell" v-if="item.status == 2">
                    <text class="tips">已驳回该报价</text>
                </view>
                <view class="form__cell" v-else>
                    <view class="btn btn--warn" @tap="_clickSendN(index, item.id)"><uni-icons type="closeempty" size="28" color="#fff"></uni-icons>不接受</view>
                    <view class="btn" @tap="_clickSendY(index, item.id)"><uni-icons type="checkmarkempty" size="28" color="#fff"></uni-icons>接受该货</view>
                    <view class="btn btn--sub" @tap="_phone(item.phone)"><uni-icons type="phone-filled" size="18" color="#fff"></uni-icons>联系货主</view>
                </view>
            </view>
        </block>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getSailOffer, postOrderSeaReply } from '@/service/getData.js';
    
    import { mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons
        },
		data() {
			return {
				id: null,
				data: null,
                page: 1,
                loadingType: 'more',
			}
		},
        async onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                toast.loading();
                await this.getData('init');
                toast.hideLoading();
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
                getSailOffer({ o_id: this.id, page: this.page }).then(res => {
                    if(this.page == 1){
                        this.data = res.data;
                    }else{
                        this.data = this.data.concat(res.data);
                    }
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
			_clickSendY(index, id){
                uni.showModal({
                    title: '温馨提示',
                    content: `确认接受报价后，请第一时间与货主沟通协商后续合同以及订金尾款等相关事宜。\n由于信息属于用户自行发布，平台无法保证可能存在的风险，请提高警惕，谨防诈骗！`,
                    confirmText: '确定提交',
                    success: (res) => {
                        if (res.confirm) {
                            this.sendData(index, id, 'Y');
                        }
                    }
                });
            },
			_clickSendN(index, id){
                uni.showModal({
                    title: '温馨提示',
                    content: `不接受该货的报价， 该货主可以再次给你提交报价。\n由于信息属于用户自行发布，平台无法保证可能存在的风险，请提高警惕，谨防诈骗！`,
                    confirmText: '不接受',
                    success: (res) => {
                        if (res.confirm) {
                            this.sendData(index, id, 'N');
                        }
                    }
                });
            },
            sendData(index, id, status){
                postOrderSeaReply({'o_id': this.id,
                    'id': id,
                    'market_type': 'ship',
                    'status': status
                }).then(res => {
                    if(status=='Y'){
                        this.PAGE_TEMP_ADD({field: 'palletToBeConfiremed', palletToBeConfiremed: true});
                        toast.show('接受成功');
                        setTimeout(function(){
                            uni.navigateBack();
                        }, 1500);
                    }else{
                        toast.show('取消成功');
                        this.data[index].status = 2;
                    }
                }, err => {
                    toast.show(err.message);
                });
            },
			_phone(tel) {
			    uni.makePhoneCall({
			        phoneNumber: tel
			    })
			},
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/price-before.scss';
    @import '@/style/page/form.scss';
    .page{
        @include flex(null,null,column);
    }
    .order{
        order: 1;
    }
    .form{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
    }
    .price::before{
        @extend %__priceBefore;
    }
    .btn{
        flex: auto;
        @include flex(center, center);
        height: 40px;
        margin: 0 $uni-spacing-row-base;
        color: #fff;
        background-color: $color-main;
        border-radius: $uni-border-radius-base;
        
        &--warn{
            background-color: $uni-color-error;
        }
        
        &--sub{
            background-color: $uni-color-warning;
        }
        
        .uni-icon-phone-filled{
            padding: 10rpx;
        }
    }
    .tips{
        flex: auto;
        text-align: center;
        color: $color-sub;
    }
</style>
