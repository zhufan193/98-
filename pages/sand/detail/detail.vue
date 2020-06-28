<template>
	<view :class="{page: router !== 'user'}" v-if="data">
        <template v-if="type === 'buy'">
            <view class="card card--full form">
                <view class="card__head">
                    <view class="card__title">
                        {{data.title}}
                        <view class="card__time">
                           发布时间：{{data.publish_at}}
                        </view>
                    </view>
                    <view class="card__helper">
                        <view class="card__badge">
                            {{data.verify_type === 2 ? '企业认证' : '个人认证'}}
                        </view>
                    </view>
                </view>
            </view>
            <view class="card card--full form">
                <view class="form__cell">
                    <view class="form__label">详细需求</view>
                    <view class="form__note">{{data.detail ? data.detail : '无'}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">分类规格</view>
                    <view class="form__note">{{data.type_na}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">需求量</view>
                    <view class="form__note">{{data.amount}}吨</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">交货地</view>
                    <view class="form__note">{{data.delivery_text}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">物流方式</view>
                    <view class="form__note">{{data.express_na}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">需求时间</view>
                    <view class="form__note">{{data.demand_min + '~' + data.demand_max}}</view>
                </view>
            </view> 
        </template>
        <template v-else>
            <view class="card card--full form">
                <view class="card__swiper">
                    <swiper class="swiper-box" autoplay="true" circular="true">
                        <swiper-item class="swiper-item" v-for="(item ,index) in data.images" :key="index">
                            <image :src="item" mode="aspectFill" />
                        </swiper-item>
                    </swiper>
                </view>
                <view class="form__cell">
                    <view class="form__label">产地</view>
                    <view class="form__note">{{data.origin_text}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">种类</view>
                    <view class="form__note">{{data.type_na}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">价格</view>
                    <view v-if="data.min_price == 0 && data.max_price == 0" class="form__note">电议</view>
                    <view v-else class="form__note">{{data.min_price == data.max_price ? data.min_price : (data.min_price + '~' + data.max_price)}}元/吨</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">物流</view>
                    <view class="form__note">{{data.express_na}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">交货地</view>
                    <view class="form__note">{{data.delivery_text}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">备注说明</view>
                    <view class="form__note">{{data.detail ? data.detail : '无'}}</view>
                </view>
            </view>
        </template>
        <view class="card card--full" v-if="data.verify_type === 2">
            <view class="card__head">
                <text class=" card__title">{{data.company_na}}</text>
            </view>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">联系人</view>
                    <view class="form__note">{{data.contact}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系电话</view>
                    <view class="form__note">{{data.phone}}</view>
                </view>
            </view>
        </view>
        <view class="card card--full form" v-else>
            <view class="form__cell">
                <view class="form__label">联系人</view>
                <view class="form__note">{{data.contact}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">联系电话</view>
                <view class="form__note">{{data.phone}}</view>
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
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getSandBuyDetail, getSandSellDetail, postCollection, postUnCollection, postActionDel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons
        },
		data() {
			return {
                router: '',
				id: null,
                type: 'sell',
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
                if(this.type === 'buy'){
                    getSandBuyDetail(this.id).then(res => {
                        toast.hideLoading()
                        this.data = res.data;
                    });
                }else{
                    getSandSellDetail(this.id).then(res => {
                        toast.hideLoading()
                        this.data = res.data;
                    });
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
                if(this.data.has_favorited){
                    postUnCollection(this.id, {type: this.type === 'sell' ? 'sand_sell' : 'sand_buy'}).then(res => {
                        toast.success('取消收藏成功！')
                        this.data.has_favorited = false;
                        this.PAGE_TEMP_UPDATA(this.data);
                    });
                }else{
                    postCollection(this.id, {type: this.type === 'sell' ? 'sand_sell' : 'sand_buy'}).then(res => {
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
			_callName(){
				if (this.data.verify_type == 2)
				{
					return this.data.company_na;
				}
				return this.data.contact;
			},
			_callPhone(){
				if (this.data.verify_type == 2)
				{
					return this.data.company_phone;
				}
				return this.data.phone;
			},
            _report() {
                router.navigateTo('/pages/common/report/report', {method: (this.type === 'sell' ? '砂石出售:' : '砂石购买:') + this.id});
            },
            _del() {
                uni.showModal({
                    title: '警告',
                    content: '请确认是否删除',
                    confirmText: '删除',
                    success: res => {
                        if(res.confirm){
                            let type = 'sand_buy';
                            if(this.type === 'sell'){
                                type = 'sand_sell';
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
        padding: 0 0 54px;
    }
    
    .card__time{
        margin-top: $uni-spacing-col-base;
        font-weight: normal;
        font-size: 12px;
        color: #999;
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
</style>
