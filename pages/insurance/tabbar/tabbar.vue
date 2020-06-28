<template>
	<view>
        <view class="banner">
            <image class="banner__img" src="/static/img/insurance-back.png" mode="aspectFill"></image>
        </view>
        <view class="main">
            <view class="cell">
                <view class="title">货物险</view>
                <view class="note">全航次保障，让您的货高枕无忧</view>
                <button type="default" class="btn btn--success" @tap="_cellPhone()">电话联系投保</button>
                <!-- <button type="default" class="btn" @tap="_goPage('/pages/common/rich-text/rich-text?type=cargo_insurance')">了解货物险详情</button> -->
            </view>
            <view class="hr"></view>
            <view class="cell">
                <view class="title">船舶险</view>
                <view class="note">专属一对一客服，提供上一年保单最多可享受50%优惠</view>
                <button type="default" class="btn btn--warning" @tap="_cellPhone()">电话联系投保</button>
                <!-- <button type="default" class="btn" @tap="_goPage('/pages/common/rich-text/rich-text?type=ship_insurance')">了解船舶险详情</button> -->
            </view>
            <view class="hr"></view>
            <view class="cell">
                <view class="title title--hr">合作伙伴</view>
                <view class="content">
                    <image class="img__left" src="../../../static/img/img-zgrs.png" mode="aspectFit"></image>
                    <view class="txt">
                        本平台仅为互联网保险提供展示和引流服务保险产品的提供/销售/收取保费等行为，均由保险公司或保险中机构进行。
                    </view>
                </view>
            </view>
        </view> 
	</view>
</template>

<script>
    import { router, toast } from '@/common/util.js';
    import { getDictionary } from '@/service/getData.js';
    
	export default {
		data() {
			return {
				phone: ''
			};
		},
        onLoad() {
            toast.loading();
            getDictionary({type: 'settings', code: 'insurance_call'}).then(res => {
                toast.hideLoading();
                this.phone = res.data[0].value;
            });
        },
        methods: {
            _goPage(url) {
                router.navigateTo(url);
            },
            _cellPhone() {
                uni.makePhoneCall({
                    phoneNumber: this.phone
                })
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/hr.scss';
    
    .banner__img{
        display: block;
        width: 750rpx;
        height: 360rpx;
    }
    
    .main{
        margin-top: -$uni-spacing-col-base;
        border-radius: $uni-border-radius-lg $uni-border-radius-lg 0 0;
        background-color: #f0f0f0;
        overflow: hidden;
    }
    
    .cell{
        padding: $uni-spacing-col-base * 2 $uni-spacing-row-base * 2 $uni-spacing-col-lg;
        background-color: #fff;
    }
    
    .hr{
        height: $uni-spacing-col-base;
    }
    
    .title{
        text-align: center;
        font-size: 42rpx;
        font-weight: bold;
        color: $uni-text-color;
        margin-bottom: $uni-spacing-col-lg;
    }
    
    .note{
        text-align: center;
        font-size: 26rpx;
        color: $uni-text-color-grey;
        margin-bottom: $uni-spacing-col-base * 2;
    }
    
    button.btn{
        margin-bottom: $uni-spacing-col-base;
        font-size: 32rpx;
        color: $uni-text-color-grey;
        background-color: #fff;
        
        &::after{
            border: 1rpx solid #eee;
        }
        
        &--success{
            color: #fff;
            background-color: $color-main;
            border: 0;
        
            &::after{
                display: none;
            }
        }
        
        &--warning{
            color: #fff;
            background-color: #fd435a;
            border: 0;
        
            &::after{
                display: none;
            }
        }
    }
        
    .title--hr{
        position: relative;
        font-size: 36rpx;
        padding-bottom: $uni-spacing-col-lg;
        
        &::after{
            @include hr(bottom);
        }
    }
    
    .content{
        display: flex;
        align-items: center;
        margin-bottom: $uni-spacing-col-base;
    }
    
    .img__left{
        flex: none;
        display: block;
        width: 120rpx;
        height: 120rpx;
    }
    
    .txt{
        padding-left: $uni-spacing-row-base;
        text-align: center;
        font-size: 24rpx;
        color: $uni-text-color-grey;
    }
</style>
