<template>
	<view class="page">
        <view class="stack">
            <view class="head">
                <image class="head__back" src="/static/img/bg.jpg" mode="aspectFill"></image>
                <uni-status-bar></uni-status-bar>
                <view class="head__main" @tap="goLogin()">
                    <view class="head__imgUser lazy">
                        <image class="lazy__img" :src="userInfo.avatar ? userInfo.avatar : ''" @load="loaded=true" mode="aspectFill"></image>
                        <image class="lazy__img lazy__placeholder" :class="{'lazy__loaded': loaded}" src="/static/img/avatar.png" mode="aspectFill"></image>
                    </view>
                    <view class="head__content">
                        <view class="head__name">
                            {{resName}}
                            <view v-if="userInfo.account != '未登录'" class="head__verify">
                                {{review_str[userInfo.review_state]}}
                            </view>
                        </view>
                        <view v-if="userInfo.account != '未登录'" class="head__phone">
                            {{userInfo.phone}}
                        </view>
                    </view>
                    <!-- #ifndef APP-PLUS -->
                    <view class="head__setting">
                        <uni-icons type="gear" color="#fff" size="28"></uni-icons>
                    </view>
                    <!-- #endif -->
                </view>
                <view class="head__bottom">
                    <view class="head__cell" @tap="goPage('/pages/user/collection/collection')">
                        <view class="head__size">
                            {{userInfo.favorites ? userInfo.favorites : '0'}}
                        </view>
                        收藏夹
                    </view>
                    <view class="head__cell" @tap="goPage('/pages/user/attention/attention')">
                        <view class="head__size">
                            {{userInfo.follow ? userInfo.follow : '0'}}
                        </view>
                        关注
                    </view>
                    <view class="head__cell" @tap="goPage('/pages/message/tabbar/tabbar')">
                        <view class="head__size">
                            {{userInfo.message ? userInfo.message : '0'}}
                        </view>
                        消息
                    </view>
                </view>
            </view>
            <view class="stack__main">
                <view class="stack__bottom card">
                    <view class="uni-flex uni-row tabbar">
                        <!-- <view class="flex-item" @tap="goPage('/pages/order/sea-my/sea-my')">
                            <view class="tabbar__txt">{{parseInt(userInfo.ship_market_offer) + parseInt(userInfo.cargo_market_offer)}}</view>
                            <view class="tabbar__helper">我的报价</view>
                        </view>
                        <view class="flex-item" @tap="goPage('/pages/order/sea/sea')">
                            <view class="tabbar__txt">{{userInfo.sea_order ? userInfo.sea_order : '0'}}</view>
                            <view class="tabbar__helper">海运订单</view>
                        </view>
                        <view class="flex-item" @tap="goPage('/pages/insurance/order_sail/order_sail')">
                            <view class="tabbar__txt">0</view>
                            <view class="tabbar__helper">保险订单</view>
                        </view> -->
						<view class="flex-item" @tap="goPage('/pages/order/buy/buy')">
						    <view class="tabbar__txt">{{parseInt(userInfo.ship_market_offer) + parseInt(userInfo.cargo_market_offer)}}</view>
						    <view class="tabbar__helper">抢购信息</view>
						</view>
						<view v-if="userRole == 0" class="flex-item" @tap="goPage('/pages/order/release/release')">
						    <view class="tabbar__txt">{{userInfo.sea_order ? userInfo.sea_order : '0'}}</view>
						    <view class="tabbar__helper">发布信息</view>
						</view>
						<view v-if="userRole == 1" class="flex-item" @tap="goPage('/pages/order/release/ship')">
						    <view class="tabbar__txt">{{userInfo.sea_order ? userInfo.sea_order : '0'}}</view>
						    <view class="tabbar__helper">发布信息</view>
						</view>
						
						<view v-if="userRole == 0" class="flex-item" @tap="goPage('/pages/order/getOrder/getOrder')">
						    <view class="tabbar__txt">0</view>
						    <view class="tabbar__helper">接单信息</view>
						</view>
						<view v-if="userRole == 1" class="flex-item" @tap="goPage('/pages/order/getOrder/shipSource')">
						    <view class="tabbar__txt">0</view>
						    <view class="tabbar__helper">接单信息</view>
						</view>
						<view class="flex-item">
						    <view class="tabbar__txt">0</view>
						    <view class="tabbar__helper">信用指数</view>
						</view>
                    </view>
					<view class="manage-content">
						<view class="manage-head">
							<image src="@/static/img/management.png"></image>
							基本管理
						</view>
						<view class="manage-second">
							<view class="manage-tab" @click="goPage('/pages/management/order/order')">
								<view><image src="@/static/img/tobuy.png"></image></view>
								<view>订购管理</view>
							</view>
							<view class="manage-tab" @click="goPage('/pages/management/Insurance/Insurance')">
								<view><image src="@/static/img/Insurance.png"></image></view>
								<view>保险订单</view>
							</view>
							<view class="manage-tab" @click="goPage('/pages/management/contract/contract')">
								<view><image src="@/static/img/download.png"></image></view>
								<view>合同下载</view>
							</view>
							<view class="manage-tab" @click="goPage('/pages/management/oil/oil')">
								<view><image src="@/static/img/oil.png"></image></view>
								<view>油料订单</view>
							</view>
						</view>
					</view>
				</view>
            </view>
        </view>
		<view class="content">
			<view class="card uni-list" v-if="userRole == 0">
			    <uni-list-item @click="goPage('/pages/order/release/release')" :note="userInfo.bank" title="货源管理" thumb="/static/icon/icon-sm.png" />
			    <uni-list-item @click="goPage('/pages/order/getOrder/getOrder')" :note="userInfo.invoice" title="货源订单" thumb="/static/icon/icon-qyrz.png" />
				<uni-list-item @click="goPage('/pages/port/agent/agent')" :note="userInfo.invoice" title="港口代理" thumb="/static/icon/icon-qyrz.png" />
			</view>
			<view class="card uni-list" v-if="userRole == 1">
			    <uni-list-item @click="goPage('/pages/order/release/ship')" :note="userInfo.bank" title="船源管理" thumb="/static/img/ShipSourceManagement.png.png" />
			    <uni-list-item @click="goPage('/pages/order/getOrder/shipSource')" :note="userInfo.invoice" title="船源订单" thumb="/static/img/ShipSourceOrder.png" />
				<uni-list-item @click="goPage('/pages/order/shipTrading/shipTrading')" :note="userInfo.invoice" title="船舶交易" thumb="/static/img/ShipTrading.png" />
				<uni-list-item @click="goPage('/pages/order/shipTrading/trading-order')" :note="userInfo.invoice" title="船舶交易订单" thumb="/static/img/ShipTradingOrder.png" />
				<uni-list-item @click="goPage('/pages/order/service-appointment/service-appointment')" :note="userInfo.invoice" title="船舶维修预约单" thumb="/static/img/ShipMaintenance.png" />
			</view>
		</view>
        <view class="content">
            <view class="card uni-list">
                <view class="card__head">
                    <view class="card__title">
                        我的认证信息
                    </view>
                </view>
                <uni-list-item @click="goPage('/pages/user/verify/verify', {review_state:userInfo.review_state})" :note="review_str[userInfo.review_state]" title="实名认证" thumb="/static/icon/icon-sm.png" />
                <uni-list-item @click="_isVerify('/pages/company/management/management')" :note="userInfo.company > 0 ? '已认证(' + userInfo.company + ')' : '未认证'" title="企业认证/管理" thumb="/static/icon/icon-qyrz.png" />
                <uni-list-item @click="_isVerify('/pages/ship/management/management')" :note="userInfo.ship > 0 ? '已认证(' + userInfo.ship + ')' : '未认证'" title="船舶认证/管理" thumb="/static/icon/icon-cbjg.png" />
            </view>
            <view class="card uni-list">
				<uni-list-item @click="goPage('/pages/company/about-us/about-us')" :note="userInfo.invoice" title="关于我们" thumb="/static/img/aboutUs.png" />
                <uni-list-item @click="goPage('/pages/bank/list/list')" :note="userInfo.bank" title="银行账户管理" thumb="/static/icon/icon-sm.png" />
                <uni-list-item @click="goPage('/pages/invoice/list/list')" :note="userInfo.invoice" title="发票管理" thumb="/static/icon/icon-qyrz.png" />
            </view>
            <view class="card uni-list">
                <view class="card__head">
                    <view class="card__title">
                        我的发布信息
                    </view>
                </view>
                <uni-list-item  @click="goPage('/pages/sail/user/user')" :note="userInfo.ship_market" title="船期" thumb="/static/icon/icon-rl.png" />
                <uni-list-item  @click="goPage('/pages/pallet/user/user')" :note="userInfo.cargo_market" title="货盘" thumb="/static/icon/icon-fp.png" />
                <uni-list-item  @click="goPage('/pages/oil/bid-user/bid-user')" :note="userInfo.fuel_market" title="燃油" thumb="/static/icon/icon-ry.png" />
                <uni-list-item  @click="goPage('/pages/sand/user/user')" :note="userInfo.sand_count" title="砂石骨料" thumb="/static/icon/icon-ss.png" />
                <uni-list-item  @click="goPage('/pages/deal/user/user')" :note="userInfo.ship_sell" title="船舶买卖" thumb="/static/icon/icon-cs.png" />
                <uni-list-item  @click="goPage('/pages/rent/user/user')" :note="userInfo.ship_rent" title="船舶租赁" thumb="/static/icon/icon-zp.png" />
                <uni-list-item  @click="goPage('/pages/agent/agent-user/agent-user')" :note="userInfo.ship_agent" title="船舶代理" thumb="/static/icon/icon-dl.png" />
                <uni-list-item  @click="goPage('/pages/maintenance/maintenance-user/maintenance-user')" :note="userInfo.maintain" title="船舶维修" thumb="/static/icon/icon-wx.png" />
                <uni-list-item  @click="goPage('/pages/parts/parts-user/parts-user')" :note="userInfo.component" title="配件设备" thumb="/static/icon/icon-pj.png" />
                <uni-list-item  @click="goPage('/pages/law/law-user/law-user')" :note="userInfo.legal_advice" title="法律咨询" thumb="/static/icon/icon-fl.png" />
                <uni-list-item  @click="goPage('/pages/financial/financial-user/financial-user')" :note="userInfo.finance_advice" title="财务咨询" thumb="/static/icon/icon-cw.png" />
                <uni-list-item  @click="goPage('/pages/oil/store-user/store-user')" :note="userInfo.oil_company" title="油商黄页" thumb="/static/icon/icon-ys.png" />
            </view>
            <!-- <view class="card uni-list">
                <uni-list-item  @click="goPage('/pages/common/rich-text/rich-text?type=user_agreement')" title="用户协议及隐私政策" thumb="/static/icon/icon-ysxy.png" />
                <uni-list-item  @click="goPage('/pages/common/service-chat/service-chat', null, false)" title="在线客服" thumb="/static/icon/icon-kf.png" />
            </view> -->
        </view>
        <view class="copyright">
            <text class="copyright__link" @tap="goPage('/pages/common/rich-text/rich-text?type=user_agreement', null, false)">《用户协议及隐私政策》</text>
            九八航运 版权所有
        </view>
	</view>
</template>

<script>
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import { router, toast, localStorage } from '@/common/util.js';
    import { getUserInfoCount } from '@/service/getData.js';
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
		components: {
            uniStatusBar,
            uniIcons,
			uniListItem
		},
        computed: {
            ...mapState(['forcedLogin', 'hasLogin', 'token', 'userInfo']),
            resName(){
                // #ifdef MP
                if(this.userInfo.account == '未登录'){
                    return '点击登录'
                }
                // #endif
                if(!!this.userInfo.realname){
                    return this.userInfo.realname;
                }else if(this.userInfo.account != '未登录'){
                    return this.userInfo.account.slice(0, 3) + '****' + this.userInfo.account.slice(-4);
                }else{
                    return this.userInfo.account
                }
            }
        },
		data() {
			return {
				userRole: 1, //用户jues,0是货主，1是船主
                is_ready: false,
                loaded: false,
                // userBack: '',// 用户中心背景图
                review_str: ['','已认证','未认证', '认证失败','待审核']
			};
		},
        methods: {
            ...mapActions(['getUserInfo']),
            ...mapMutations(['GOPAGE_LOGIN', 'RECORD_USERINFO', 'LOGOUT', 'COMPANY_TEMP_UPDATA', 'SHIP_TEMP_UPDATA']),
            goPage(url, param = null, hasLogin = true) {
                if(url == undefined){
                    toast.show('开发中');
                    return;
                }
                if(!this.hasLogin && hasLogin){
                    toast.show('请点击登录！');
                    return;
                }
                router.navigateTo(url, param);
            },
            _isVerify(url){
                if(!this.hasLogin){
                    toast.show('请点击登录！');
                    return;
                }
                if(this.userInfo.is_realname){
                    router.navigateTo(url);
                }else{
                    toast.show('请先实名认证！');
                }
            },
            goLogin(){
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                }else{
                    this.goPage('/pages/user/info/info');
                }
            }
        },
        onNavigationBarButtonTap() {
            this.goPage('/pages/user/info/info');
        },
        // #ifndef MP
        onReady() {
            this.is_ready = true;
            if(!this.hasLogin){
                this.GOPAGE_LOGIN();
            }
        },
        // #endif
        // onShow(){
        //     if(this.hasLogin){
        //         // 记录当前tabBarIndex
        //         localStorage.setStore('tabBarIndex', 4);
        //     }
        //     // if(!this.hasLogin && this.is_ready){  暂时隐藏
        //     //     this.loaded = false;
        //     //     // #ifndef MP
        //     //     this.GOPAGE_LOGIN();
        //     //     // #endif
        //     //     return;
        //     // }
        //     if(localStorage.getStore('loginToken') != ''){
        //         if(this.token != localStorage.getStore('loginToken')){
        //             // console.log('用户信息更新---profile_token:' + localStorage.getStore('loginToken').slice(-4) + ':' + this.token.slice(-4))
        //             // 用户信息更新
        //             this.getUserInfo();
        //         }else{
        //             getUserInfoCount().then(res => {
        //             // console.log('用户信息数量更新')
        //                 let userInfo = this.userInfo;
        //                 if(userInfo.company !== res.data.company){
        //                     // 清除缓存，重新加载
        //                     this.COMPANY_TEMP_UPDATA({});
        //                 }
        //                 if(userInfo.ship !== res.data.ship){
        //                     // 清除缓存，重新加载
        //                     this.SHIP_TEMP_UPDATA({});
        //                 }
        //                 // 认证用户信息更新
        //                 if(res.data.is_realname && userInfo.realname == null){
        //                     this.getUserInfo();
        //                     return;
        //                 }
        //                 userInfo.message = res.data.message;
        //                 userInfo.cancel_state = res.data.cancel_state;
        //                 userInfo.cancel_at = res.data.cancel_at;
        //                 userInfo.cargo_market = res.data.cargo_market;
        //                 userInfo.cargo_market_offer = res.data.cargo_market_offer;
        //                 userInfo.company = res.data.company;
        //                 userInfo.favorites = res.data.favorites;
        //                 userInfo.follow = res.data.follow;
        //                 userInfo.fuel_market = res.data.fuel_market;
        //                 userInfo.fuel_order = res.data.fuel_order;
        //                 userInfo.insurance_order = res.data.insurance_order;
        //                 userInfo.is_realname = res.data.is_realname;
        //                 userInfo.review_state = res.data.review_state;
        //                 userInfo.sea_order = res.data.sea_order;
        //                 userInfo.ship = res.data.ship;
        //                 userInfo.ship_market = res.data.ship_market;
        //                 userInfo.ship_market_offer = res.data.ship_market_offer;
        //                 userInfo.ship_sell = res.data.ship_sell;
        //                 userInfo.ship_rent = res.data.ship_rent;
        //                 userInfo.maintain = res.data.maintain;
        //                 userInfo.component = res.data.component;
        //                 userInfo.legal_advice = res.data.legal_advice;
        //                 userInfo.finance_advice = res.data.finance_advice;
        //             	userInfo.ship_agent = res.data.ship_agent;
        //             	userInfo.sand_count = res.data.sand_count;
        //                 userInfo.oil_company = res.data.oil_company;
        //                 this.RECORD_USERINFO(userInfo);
        //                 this.$forceUpdate();
        //             }, err => {
        //                 this.loaded = false;
        //                 setTimeout(() => {
        //                     this.GOPAGE_LOGIN();
        //                 }, 700);
        //             });
        //         }
        //     }
        // }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/stack.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/lazy.scss';
    
    .card{
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    }
    
    .head{
        position: relative;
        padding: $uni-spacing-col-lg $uni-spacing-row-base $uni-spacing-col-base * 1.5;
        /* #ifndef APP-PLUS */
        padding-top: 44px;
        /* #endif */
        
        &__back{
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: -1;
        }
        
        &__main{
            @include flex(null, center);
            padding-bottom: $uni-spacing-col-base * 2;
        }
        
        &__imgUser{
            @include flex-self(keep);
            display: block;
            width: $uni-img-size-base * 2;
            height: $uni-img-size-base * 2;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: $uni-border-radius-circle;
            margin-right: 27upx;
            overflow: hidden;
        }
        
        &__content{
            @include flex(center, top, column);
            @include flex-self(full);
            font-size: $uni-font-size-sm;
            color: #fff;
        }
        
        &__name{
            @include flex(null, center);
            font-size: 34upx;
        }
        
        &__phone{
            padding-top: 10rpx;
        }
        
        &__verify{
            height: 32upx * 2;
            line-height: 32upx * 2;
            padding: 0 $uni-spacing-row-sm * 2;
            margin-left: $uni-spacing-row-lg;
            margin-bottom: -32upx;
            font-size: 24upx * 2;
            color: #f27252;
            background-color: #ffe2d1;
            border-radius: 16upx * 2;
            transform: scale(0.5);
            transform-origin: 0% 0%;
            white-space:nowrap;
        }
        
        &__setting{
            @include flex-self(keep, top);
        }
        
        &__bottom{
            @include flex(around, center);
            line-height: 1;
            padding-bottom: $uni-spacing-col-base * 2;
        }
        
        &__cell{
            @include flex(center, center, column);
            font-size: $uni-font-size-sm;
            color: #fff;
            width: 100%;
        }
        
        &__size{
            font-size: 34upx;
            font-weight: 700;
            padding-bottom: $uni-spacing-col-base;
        }
        &+.stack__main{
            height: initial;
            padding: 0 $uni-spacing-row-base;
            margin-top: -$uni-spacing-col-base * 2;
            margin-bottom: $uni-spacing-col-base;
            
            .stack__bottom{
                position: initial;
            }
        }
    }
	.manage-content{
		background-color: #ffffff;
		padding: 0 10upx;
		.manage-head{
			margin: 10upx auto 0;
			font-size: 32upx;
			color: #8a8a8a;
			border-bottom: 1upx solid #d3d3d3;
			padding: 0 20upx 20upx 40upx;
			image{
				width: 40upx;
				height: 40upx;
				top: 8upx;
				right: 10upx;
			}
		}
		.manage-second{
			display: flex;
			flex-direction: row;
			padding: 20upx 0;
			.manage-tab{
				width: 25%;
				text-align: center;
				image{
					width: 100upx;
					height: 100upx;
				}
			}
		}
	}
    .tabbar{
        width: 100%;
        padding: $uni-spacing-col-lg 0;
        
        .flex-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 33.3%;
            line-height: 1;
            
            &-hover{
                background-color: #eee;
            }
            
            &::after{
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 1px;
                background-color: $uni-border-color;
                transform: scaleX(.5);
            }
            
            &:last-child::after{
                display: none;
            }
        }
        
        &__txt{
            color: $color-sub;
            font-size: 56upx;
            padding-bottom: $uni-spacing-col-sm * 1.5;
        }
        
        &__helper{
            color: $uni-text-color-grey;
            font-size: $uni-font-size-xs;
        }
    }
    
    .content{
        padding: 0 $uni-spacing-row-base;
    }
    
    .uni-list::before, .uni-list::after{
        display: none;
    }
    
    .uni-list .uni-list-item__container:after{
        left: 82upx;
    }
    
    .uni-list uni-list-item:last-child .uni-list-item__container:after{
        display: none;
    }
    
    .uni-list .uni-list-item__content{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
        
    .uni-list .uni-list-item__content-title{
        font-size: $uni-font-size-base;
        color: $uni-text-color;
    }
    
    .uni-list .uni-list-item__extra{
        width: initial;
    }
    
    .copyright{
        @include flex(null, center, column);
        padding-bottom: $uni-spacing-col-lg * 2;
        text-align: center;
        font-size: 22upx;
        color: $uni-text-color-grey;
        
        &__link{
            color: #007AFF;
            border-bottom: 1rpx solid #007AFF;
            padding: $uni-spacing-col-base 0 0;
            margin-bottom: $uni-spacing-col-base;
        }
    }
</style>
