<template>
	<view :class="{page: router !== 'user'}" v-if="data">
		 <view class="card card--full">
            <view class="card__swiper">
                <swiper class="swiper-box" autoplay="true" circular="true">
                 	<swiper-item class="swiper-item" v-for="(item ,index) in data.carousel" :key="index">
                 		<image :src="item" mode="aspectFill" />
                 	</swiper-item>
                </swiper>
            </view>
            <view class="card__head">
                <view class="card__title">
                    {{data.title}}
                </view>
                <view class="card__helper">
                    <view class="card__badge">企业认证</view>
                </view>
            </view>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">
                        发布时间
                    </view>
                    <view class="form__note">
                        {{data.publish_at}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">
                        公司地址
                    </view>
                    <view class="form__note">
                        {{data.addrs}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">
                        公司电话
                    </view>
                    <view class="form__note">
                        {{data.company_phone}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">
                        联系人
                    </view>
                    <view class="form__note">
                        {{data.contact}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">
                        联系电话
                    </view>
                    <view class="form__note">
                        {{data.phone}}
                    </view>
                </view>
                <view v-if="type=='maintain'" class="form__cell">
                    <view class="form__label">
                        擅长维修
                    </view>
                    <view class="form__note">
                        {{data.type}}
                    </view>
                </view>
                <view v-else-if="type=='component'" class="form__cell">
                    <view class="form__label">
                        提供备件
                    </view>
                    <view class="form__note">
                        {{data.type}}
                    </view>
                </view>
                <view v-else class="form__cell">
                    <view class="form__label">
                        服务区域
                    </view>
                    <view class="form__note">
                        {{data.service_city}}
                    </view>
                </view>
            </view>
		</view>
        <view class="card card--full">
            <view class="card__head">
                <text class=" card__title">服务介绍</text>
            </view>
            <view class="card__content">
                {{data.detail}}
            </view>
        </view>
        
        <view class="foot" v-if="router !== 'user'">
            <view class="foot__cell" :class="{'is_star': data.has_favorited}" @tap="_collection">
                <image class="foot__cellection" v-if="!data.has_favorited" src="/static/icon/star-black.png" mode="aspectFit"></image>
                {{data.has_favorited ? '取消收藏' : '收藏'}}
            </view>
            <view class="foot__cell foot__cell--main" @tap="_makePhoneCall()">
                <uni-icons type="phone-filled" color="#fff" size="16"></uni-icons>
                联系商家
            </view>
            <!-- #ifndef APP-PLUS -->
            <view class="foot__cell foot__cell--error" @tap="_report()">
                <uni-icons type="info" color="#fff" size="16"></uni-icons>
                虚假信息投诉
            </view>
            <!-- #endif -->
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getShipMaintenanceDetail, getShipPartsDetail, getCompanyLawDetail, getCompanyFinancialDetail, getShipAgentDetail, postCollection, postUnCollection, postActionDel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniListItem
        },
		data() {
			return {
                router: '',
				id: null,
                type: null,
                type_str: '',
                data: null
			};
		},
        computed: mapState(['hasLogin']),
        onLoad(options) {
            if(options && options.id){
                if(options.router && options.router === 'user'){
                    this.router = options.router;
                    // #ifdef APP-PLUS  
                    var webView = this.$mp.page.$getAppWebview();  
                    webView.setTitleNViewButtonStyle(0, {  
                        text: '删除',  
                    });  
                    // #endif
                }
                this.id = options.id;
                this.type = options.type;
                toast.loading();
                switch(this.type){
                    case 'maintain':
                        this.type_str = '船舶维修';
                        getShipMaintenanceDetail(this.id).then(res => {
                            toast.hideLoading()
                            this.data = res.data;
                        });
                        break;
                    case 'component':
                        this.type_str = '备件设备';
                        getShipPartsDetail(this.id).then(res => {
                            toast.hideLoading()
                            this.data = res.data;
                        });
                        break;
                    case 'legal_advice':
                        this.type_str = '法律咨询';
                        getCompanyLawDetail(this.id).then(res => {
                            toast.hideLoading()
                            this.data = res.data;
                        });
                        break;
                    case 'finance_advice':
                        this.type_str = '财务咨询';
                        getCompanyFinancialDetail(this.id).then(res => {
                            toast.hideLoading()
                            this.data = res.data;
                        });
                        break;
                    case 'agent':
                        this.type_str = '船舶代理';
                        getShipAgentDetail(this.id).then(res => {
                            toast.hideLoading()
                            this.data = res.data;
                        });
                        break;
                }
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            if(this.router === 'user'){
                this._del();
            }else{
                this._report();
            }
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'PAGE_TEMP_UPDATA']),
            _collection() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                let type = '';
                switch(this.type){
                    case 'maintain':
                        type = 'maintain';
                        break;
                    case 'component':
                        type = 'component';
                        break;
                    case 'legal_advice':
                        type = 'legal_advice';
                        break;
                    case 'finance_advice':
                        type = 'finance_advice';
                        break;
                    case 'agent':
                        type = 'ship_agent';
                        break;
                }
                if(this.data.has_favorited){
                    postUnCollection(this.id, {type: type}).then(res => {
                        toast.success('取消收藏成功！')
                        this.data.has_favorited = false;
                        this.PAGE_TEMP_UPDATA(this.data);
                    });
                }else{
                    postCollection(this.id, {type: type}).then(res => {
                        toast.success('收藏成功！')
                        this.data.has_favorited = true;
                        this.PAGE_TEMP_UPDATA(null);
                    });
                }
            },
            _makePhoneCall() {
                uni.makePhoneCall({
                    phoneNumber: this._callPhone()
                })
            },
			_callPhone(){
				if (this.data.verify_type == 2)
				{
					return this.data.company_phone;
				}
				return this.data.phone;
			},
            _report() {
                router.navigateTo('/pages/common/report/report', {method: this.type_str + ':' + this.id});
            },
            _del() {
                uni.showModal({
                    title: '警告',
                    content: '请确认是否删除',
                    confirmText: '删除',
                    success: res => {
                        if(res.confirm){
                            let type = '';
                            switch(this.type){
                                case 'maintain':
                                    type = 'maintain';
                                    break;
                                case 'component':
                                    type = 'component';
                                    break;
                                case 'legal_advice':
                                    type = 'legal_advice';
                                    break;
                                case 'finance_advice':
                                    type = 'finance_advice';
                                    break;
                                case 'agent':
                                    type = 'ship_agent';
                                    break;
                            }
                            postActionDel(type, this.id).then(res => {
                                toast.show('删除成功！');
                                this.PAGE_TEMP_UPDATA(this.data);
                                setTimeout(function(){
                                    router.navigateBack();
                                },2000);
                            });
                        }
                    }
                })
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        margin-bottom: 54px;
    }
    
    .card__swiper{
        padding: $uni-spacing-col-base $uni-spacing-row-base 0;
    }
    
    .swiper-box {
    	width: 100%;
    	height: 350upx;
        border-radius: $uni-border-radius-base;
        overflow: hidden;
    }
    
    .swiper-item {
        @include flex(center, center);
    	height: 100%;
    	background: #eee;
        
        image {
        	width: 100%;
        	height: 100%;
        }
    }
    
    .uni-list .uni-list-item__content-title{
        white-space: initial;
    }
    
    .card__content{
        word-break: break-all;
        line-height: 1.8;
        font-size: 16px;
    }
</style>
