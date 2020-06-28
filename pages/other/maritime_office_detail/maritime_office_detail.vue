<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
		<view v-show="indexActive === 0" class="content">
		    <rich-text class="article__rich" :nodes="detail"></rich-text>
		</view>
        <view v-show="indexActive === 1" class="map">
            <map class="map__field" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">地区</view>
                    <view class="form__note">{{area_text}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">详细地址</view>
                    <view class="form__note">{{addrs}}</view>
                </view>
            </view>
        </view>
		<view v-show="indexActive === 2" class="list">
		    <view class="list__head">
		        <view class="list__left">部门</view>
		        <view class="list__right">电话/传真</view>
		    </view>
            <view class="list__main">
                <block v-for="(item, index) of list" :key="index">
                    <view class="list__cell">
                        <view class="list__left">{{item.name}}</view>
                        <view class="list__right">
                            <view class="list__txt list__phone" @tap="_cellPhone(item.phone)">
                                <image class="list__icon" src="../../../static/icon/icon-phone.png" mode="aspectFit"></image>
                                {{item.phone}}
                            </view>
                            <view class="list__txt" v-if="item.fax">
                                <image class="list__icon" src="../../../static/icon/icon-fax.png" mode="aspectFit"></image>
                                {{item.fax}}
                            </view>
                        </view>
                    </view>
                </block>
            </view>
		</view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    
    import { toast, localStorage, format } from '@/common/util.js';
    import { getMaritimeOfficeDetail } from '@/service/getData.js';
    
	export default {
        components: {
            uniSegmentedControl
        },
		data() {
			return {
				indexActive: 0,
                items: ['简介', '联系地址', '联系电话'],
                id: null,
                detail: '',
                list: [],
                area_text: '',
                addrs: '',
                latitude: 0,
                longitude: 0,
                markers: []
			};
		},
        onLoad(options) {
            if(options && options.title){
                uni.setNavigationBarTitle({
                    title: options.title
                })
            }
            if(options && options.id){
                this.id = options.id;
                toast.loading();
                getMaritimeOfficeDetail(this.id).then(res => {
                    toast.hideLoading();
                    // 匹配img scr添加地址前缀
                    const imgBaseURL = localStorage.getStore('fileBaseUrl');
                    // 正则表达式修改img样式
                    res.data.detail = format.replace(res.data.detail, imgBaseURL);
                    this.detail = res.data.detail;
                    
                    this.area_text = res.data.area_text;
                    this.addrs = res.data.addrs;
                    this.latitude = res.data.latitude;
                    this.longitude = res.data.longitude;
                    this.markers.push({
                        id: 0,
                        latitude: this.latitude,
                        longitude: this.longitude,
                        iconPath: '/static/icon/address-location.png',
                        width: 28,
                        height: 28,
                        label: {
                            content: res.data.title
                        }
                    });
                    
                    let contact_us = res.data.contact_us;
                    for(let i = 0, len = contact_us.length; i < len; i++) {
                        let data = contact_us[i].contact.split(',');
                        contact_us[i].phone = data[0];
                        contact_us[i].fax = data[1];
                    }
                    this.list = contact_us;
                });
            }
        },
        methods: {
            _onClickItem(e) {
                this.indexActive = e;
            },
            _cellPhone(phone) {
                uni.makePhoneCall({
                    phoneNumber: phone
                })
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    
    .page{
        padding: 44px 0 0;
    }
    
    .content{
        margin-top: $uni-spacing-col-base;
        padding: $uni-spacing-col-lg $uni-spacing-row-lg;
        background-color: #fff;
    }
    
    .map{
        background-color: #fff;
        
        &__field{
            width: 750rpx;
            height: 750rpx;
        }
    }
    
    .list{
        margin-top: $uni-spacing-col-base;
        background-color: #fff;
        
        &__head{
            @include flex(null, center);
            position: relative;
            height: 44px;
            font-weight: 700;
            
            &::after{
                @include hr(bottom);
            }
        }
        
        &__left{
            width: 50%;
            text-align: center;
            color: $uni-text-color;
        }
        
        &__right{
            width: 50%;
            text-align: center;
        }
        
        &__main{
            
        }
        
        &__cell{
            @include flex(null, center);
            position: relative;
            padding: $uni-spacing-col-base $uni-spacing-row-base;
            
            &::after{
                @include hr(bottom, $uni-spacing-row-base);
            }
        }
        
        &__txt{
            @include flex(center, center);
            line-height: 2;
            color: $uni-text-color-grey;
        }
        
        &__phone{
            color: $color-main;
        }
        
        &__icon{
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 8rpx;
        }
    }
</style>
