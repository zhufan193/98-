<template>
	<view :class="{page: router !== 'user'}" v-if="data">
        <view class="card card--full form" v-if="type === 'beRent'">
            <view class="card__head card__noLine">
                <text class=" card__title">{{data.title}}</text>
            </view>
            <view class="card__box">
                <view class="card__info">
                    发布时间：{{data.publish_at}}
                </view>
                <view class="card__info">
                    有效时间：{{data.expire_at}}
                </view>
            </view>
        </view>
		<view class="card card--full" v-if="type === 'rent'">
            <view class="card__swiper">
                <swiper class="swiper-box" autoplay="true" circular="true">
                	<swiper-item class="swiper-item" v-for="(item ,index) in data.images" :key="index">
                		<image :src="item" mode="aspectFill" />
                	</swiper-item>
                </swiper>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">船名</view>
                <view class="form__note">{{data.name}}</view>
            </view>
            <view v-if="data.price == 0" class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">月租金</view>
                <view class="form__note">面议</view>
            </view>
            <view v-else class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">月租金</view>
                <view class="form__note">{{data.price}}元</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">类型</view>
                <view class="form__note">{{data.type_cn}}</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">载重</view>
                <view class="form__note">{{data.load}}T</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">建造年份</view>
                <view class="form__note">{{data.build_at}}年</view>
            </view>
		</view>
		<view class="card card--full form" v-else>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">类型</view>
                <view class="form__note">{{data.type_cn}}</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">载重</view>
                <view class="form__note">{{data.load_min + '~' + data.load_max}}T</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">船龄</view>
                <view class="form__note">{{data.age}}年以内</view>
            </view>
            <view v-if="data.price == 0" class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">月租金</view>
                <view class="form__note">面议</view>
            </view>
            <view v-else class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">月租金</view>
                <view class="form__note">{{data.price}}元</view>
            </view>
		</view>
        <view class="card card--full">
            <view class="card__head">
                <text class=" card__title">备注</text>
            </view>
            <view class="card__content" style="word-break: break-all;">
                {{data.remark ? data.remark : '无'}}
            </view>
        </view>
		<view class="card card--full form">
            <view class="card__head">
                <text class=" card__title">其他信息</text>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">建造地址</view>
                <view class="form__note">{{data.build_address ? data.build_address : '未填写'}}</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">驾驶位置</view>
                <view class="form__note">{{data.drive_position ? data.drive_position : '未填写'}}</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">主机型号</view>
                <view class="form__note">{{data.host_model ? data.host_model : '未填写'}}</view>
            </view>
            <view class="form__cell" hover-class="form__cell--hover">
                <view class="form__label">主机功率</view>
                <view class="form__note">{{data.host_power ? data.host_power : '未填写'}}</view>
            </view>
            <template v-if="type !== 'into'">
                <view class="form__cell" hover-class="form__cell--hover">
                    <view class="form__label">船长</view>
                    <view class="form__note">{{data.ship_length ? data.ship_length + '米' : '未填写'}}</view>
                </view>
                <view class="form__cell" hover-class="form__cell--hover">
                    <view class="form__label">船宽</view>
                    <view class="form__note">{{data.ship_width ? data.ship_width + '米' : '未填写'}}</view>
                </view>
                <view class="form__cell" hover-class="form__cell--hover">
                    <view class="form__label">吃水</view>
                    <view class="form__note">{{data.draft ? data.draft + '米' : '未填写'}}</view>
                </view>
                <view class="form__cell" hover-class="form__cell--hover">
                    <view class="form__label">排水量</view>
                    <view class="form__note">{{data.displacement ? data.displacement + '吨' : '未填写'}}</view>
                </view>
            </template>
		</view>
        <view class="card card--full" v-if="data.verify_type === 2">
            <view class="card__head">
                <text class=" card__title">{{data.company_na}}</text>
            </view>
            <view class="card__content">
                {{data.contact + ' | ' + data.phone}}
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
                {{data.has_favorited ? '取消关注' : '关注'}}
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
    import { getShipRentDetail, postCollection, postUnCollection, postActionDel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons
        },
		data() {
			return {
                router: '',
				id: null,
                type: 'beRent',
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
                getShipRentDetail(this.id).then(res => {
                    toast.hideLoading()
                    this.data = res.data;
                });
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
                    postUnCollection(this.id, {type: 'ship_rent'}).then(res => {
                        toast.success('取消关注成功！')
                        this.data.has_favorited = false;
                        this.PAGE_TEMP_UPDATA(this.data);
                    });
                }else{
                    postCollection(this.id, {type: 'ship_rent'}).then(res => {
                        toast.success('关注成功！')
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
                router.navigateTo('/pages/common/report/report', {method: '船舶租赁:' + this.id});
            },
            _del() {
                uni.showModal({
                    title: '警告',
                    content: '请确认是否删除',
                    confirmText: '删除',
                    success: res => {
                        if(res.confirm){
                            postActionDel('ship_rent', this.id).then(res => {
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
        white-space: initial
    }
    
    .card__noLine::after{
        display: none;
    }
    
    .card__box{
        padding: 0 $uni-spacing-row-base $uni-spacing-col-base;
    }
    
    .card__info{
        color: $uni-text-color-grey;
        font-size: 12px;
    }
</style>
