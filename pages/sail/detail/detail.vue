<template>
	<view :class="{page: router !== 'user'}" >
        <view class="card card--full">
            <view class="card__main--col">
                <view class="card__col">
                    <view class="info">
                        <view class="info__label">出发港</view>
                        <view class="info__txt">南昌</view>
                    </view>
					<view class="info">
					    <view class="info__label">联系人</view>
					    <view class="info__txt">{{getfirstname('张三')}},{{getphone('15179140060')}}</view>
					</view>
                </view>
                <view class="card__col">
                    <view class="info">
                        <view class="info__label">到达港</view>
                        <view class="info__txt">杭州</view>
                    </view>
                    <view class="info">
                        <view class="info__label">发布时间</view>
                        <view class="info__txt">2020.03.23</view>
                    </view>
                </view>
            </view>
        </view>
		<view class="xinxi-title">
			<view class="form__label first-view" ></view>
		    <view class="form__label second-view" >船源信息</view>
		</view>
		<view class="view-br"></view>
        <view class="card card--full form" style="padding: 20upx 0;">
            <view class="source-xinxi">
				<view class="source-first">
				    <view class="form__label">船源名称:</view>
				    <view class="form__note">面</view>
				</view>
				<view class="source-second">
				    <view class="form__label">船舶吨位:</view>
				    <view class="form__note">12吨</view>
				</view>
			</view>
			
			<view class="source-xinxi">
				<view class="source-first">
				    <view class="form__label">封仓形式:</view>
				    <view class="form__note">形式</view>
				</view>
				<view class="source-second">
				    <view class="form__label">航线类型:</view>
				    <view class="form__note">南昌-杭州</view>
				</view>
			</view>
            
            <view class="source-xinxi">
            	<view class="source-new">
            	    <view class="form__label">空船港:</view>
            	    <view class="form__note">空船港空船港</view>
            	</view>
            </view>
			<view class="source-xinxi">
				<view class="source-new">
				    <view class="form__label">空船期:</view>
				    <view class="form__note"></view>
				</view>
			</view>
			<view class="source-xinxi">
				<view class="source-first">
				    <view class="form__label">联系人:</view>
				    <view class="form__note">{{getfirstname('张三')}}
						<text @click="add_person" style="color: #007AFF;font-size: 30upx;margin-left: 10upx;">
							添加好友
						</text>
					</view>
				</view>
				<view class="source-second">
				    <view class="form__label">联系QQ:</view>
				    <view class="form__note">99992332</view>
				</view>
			</view>
			<view class="source-xinxi">
				<view class="source-first">
				    <view class="form__label">联系电话:</view>
				    <view class="form__note">{{getphone('15179140060')}}</view>
				</view>
			</view>
        </view>
		<view class="xinxi-title">
					<view class="form__label first-view" ></view>
				    <view class="form__label second-view">说明备注</view>
				</view>
		<view class="view-br"></view>
		<view class="beizhu">
		    无
		</view>
		
		<view class="xinxi-title">
			<view class="form__label first-view" ></view>
		    <view class="form__label second-view" >相似货源推荐</view>
		</view>
	   <view class="view-br"></view>
	   <view style="margin-bottom: 50upx;">
		   <view class="recommend-cla" v-for="(tem,index) in tems">
			   <view @click="goto_recommend">
				   <view class="recommend-first">
					   <view>南通-></view>
					   <view>秦皇岛，玉米</view>
					   <view class="view-right">电议</view>
				   </view>
				   <view class="recommend-second" >
					   <view>6500吨，</view>
					   <view>散货船，</view>
					   <view>长江-内河，</view>
					   <view>空船期至:2020-12-23</view>
				   </view>
			   </view>
			   <view class="view-br" style="margin-top: 15upx;"></view>  
		   </view>
	   </view>
	   
	   <uni-popup :show="isshow" position="middle" mode="fixed">
	   	<view class="popup-view">
	   			<view @click="isshow = false" style="position: absolute;right: 20upx;">
	   				<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
	   			</view>

				<view class="yugou" style="margin-top: 50upx;">
					<view class="yg-first">
						<image src="@/static/img/goods.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input placeholder="请填写货物名称" />
					</view>
				</view>
	   			<view class="yugou">
	   				<view class="yg-first">
	   					<image src="@/static/img/num.png" style="width: 35upx;height: 35upx;"></image>
	   				</view>
	   				<view class="yg-second">
	   					<input placeholder="请填写货物吨数" />
	   				</view>
	   			</view>
	   			<view class="yugou">
	   				<view class="yg-first">
	   					<image src="@/static/img/one-money.png" style="width: 35upx;height: 35upx;"></image>
	   				</view>
	   				<view class="yg-second">
	   					<input placeholder="货物单价 元/吨" />
	   				</view>
	   			</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/icon/address-location.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input placeholder="卸货地点" />
					</view>
				</view>
	   			<view class="yugou">
	   				<view class="yg-first">
	   					<image src="@/static/icon/address-location.png" style="width: 35upx;height: 35upx;"></image>
	   				</view>
	   				<view class="yg-second">
	   					<input placeholder="请填写卸货地点" />
	   				</view>
	   			</view>
	   			<view class="yugou">
	   				<view class="yg-first">
	   					<image src="@/static/img/goods.png" style="width: 35upx;height: 35upx;"></image>
	   				</view>
	   				<view class="yg-second" style="display: flex;flex-direction: row;">
						<view style="width: 60%;"><input placeholder="输入验证码" /></view>
						<view style="margin-left: 30upx;"><text>9898</text></view>
	   				</view>
	   			</view>
	   			
	   			<view class="bug-button" @click="isshow = false">
	   				确认预购
	   			</view>
	   		</view>
	   </uni-popup>
	   
	   <!-- 角色为船主时，界面不显示 -->
	   <view v-if="role == 0" class="get-goods" @click="isshow = true">
		   立即抢单发货
	   </view>
		<!-- <view class="card user">
            <view class="user__main">
                <image class="user__imgUser" :src="data.user.avatar ? data.user.avatar : '/static/img/avatar.png'" mode="aspectFill"></image>
                <view class="user__content">
                    <view class="user__name">
                        {{data ? data.user.realname + (data.cargo_info.verify_type === 2 ? '/' + data.cargo_info.company : '') : '加载中'}}
                    </view>
                    {{data ? resUserPhone : ''}}
                </view>
            </view>
        </view> -->
        
        <!-- <view class="foot" v-if="router !== 'user'">
            <view class="foot__cell" :class="{'is_star': data.has_favorited}" @tap="_collection">
                <image class="foot__cellection" v-if="!data.has_favorited" src="/static/icon/star-black.png" mode="aspectFit"></image>
                {{data.has_favorited ? '取消关注' : '关注'}}
            </view>
            <view class="foot__cell foot__cell--main" @tap="_phone(data.cargo_info.phone)">
                <uni-icons type="phone-filled" color="#fff" size="16"></uni-icons>
                联系货主
            </view>
            <template v-if="userInfo.id !== data.user.id || !data.user.id">
                <view v-if="!data.cargo_info.offer_state" class="foot__cell foot__cell--red" @tap="_offer()">
                    <uni-icons type="compose" color="#fff" size="22"></uni-icons>
                    <text>抢单报价</text>
                </view>
                <view class="foot__cell foot__cell--disable" v-else>
                    <text>订单已确认</text>
                    <text>不再接受新报价</text>
                </view>
            </template>
        </view> -->
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    
    import { router, toast } from '@/common/util.js'
    import { getPalletDetail, postCollection, postUnCollection, postActionDel } from '@/service/getData.js'
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniIcons
        },
		data() {
			return {
                router: '',
				id: null,
                data: null,
				isshow: false, // 是否显示抢单弹框
				tems:[{},{}],
				role: 1, //0:货主，1：船主
			}
		},
        computed:{
            ...mapState(['hasLogin', 'userInfo', 'shipTempData']),
            resPhone(){
                if(this.data){
                    if(this.hasLogin){
                        return this.data.cargo_info.phone;
                    }else{
                        return this.data.cargo_info.phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                    }
                }
            },
            resUserPhone(){
                if(this.data){
                    if(this.hasLogin){
                        return this.data.user.phone;
                    }else{
                        return this.data.user.phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                    }
                }
            },
            resEmpty(){
                if(this.data){
                    return this.data.cargo_info.empty_date.slice(5);
                }
            }
        },
        onLoad(options) {
			if (options && options.id) {
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
                toast.loading();
                getPalletDetail(this.id).then(res => {
                    this.data = res.data;
                    toast.hideLoading()
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
            ...mapActions(['getReleaseShip']),
            ...mapMutations(['GOPAGE_LOGIN', 'PAGE_TEMP_UPDATA']),
            _collection() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                if(this.data.has_favorited){
                    postUnCollection(this.id, {type: 'cargo_market'}).then(res => {
                        toast.success('取消关注成功！')
                        this.data.has_favorited = false;
                        this.PAGE_TEMP_UPDATA(this.data);
                    });
                }else{
                    postCollection(this.id, {type: 'cargo_market'}).then(res => {
                        toast.success('关注成功！')
                        this.data.has_favorited = true;
                        this.PAGE_TEMP_UPDATA(null);
                    });
                }
            },
            _phone(tel) {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                uni.makePhoneCall({
                    phoneNumber: tel
                })
            },
            async _offer(){
                if(this.data.cargo_info.offer_state !== 0){
                    return;
                }
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                if(!this.shipTempData.hasOwnProperty('my_ship') || !this.shipTempData.my_ship.length){
                    toast.loading('加载中');
                    await this.getReleaseShip();
                    toast.hideLoading();
                }
                if(this.shipTempData.my_ship.length > 0){
                    router.navigateTo('/pages/pallet/quote/quote', {
                        id: this.data.cargo_info.id,
                        empty_date: this.data.cargo_info.empty_date,
                        empty_days: this.data.cargo_info.empty_days,
                        name: this.data.cargo_info.name,
                        departure_na: this.data.cargo_info.departure_na,
                        target: this.data.cargo_info.target,
                        weigh: this.data.cargo_info.weigh,
                    });
                }else{
                    uni.showModal({
                        title: '友情提示',
                        content: `您当前未有认证的船舶\n只有拥有认证的船舶才能进行报价抢单`,
                        confirmText: '认证船舶',
                        success: (res) => {
                            if (res.confirm) {
                                this._verify();
                            }
                        }
                    });
                }
            },
            _report() {
                router.navigateTo('/pages/common/report/report', {method: '货盘:' + this.id});
            },
            _del() {
                uni.showModal({
                    title: '警告',
                    content: '请确认是否删除',
                    confirmText: '删除',
                    success: res => {
                        if(res.confirm){
                            postActionDel('cargo_market', this.id).then(res => {
                                toast.show('删除成功！');
                                this.PAGE_TEMP_UPDATA(this.data);
                                setTimeout(function(){
                                    router.navigateBack();
                                },2000);
                            });
                        }
                    }
                })
            },
            _verify() {
                if(this.userInfo.is_realname){
                    router.redirectTo('/pages/ship/verify/verify');
                }else{
                    let review_state = this.userInfo.review_state;
                    uni.showModal({
                        content: '请实名认证后再进行船舶认证！',
                        success: function(e) {
                            if(e.confirm){
                                router.redirectTo('/pages/user/verify/verify', {review_state: review_state});
                            }
                        }
                    })
                }
            },
			// 添加好友
			add_person(){
				console.log('添加好友')
			},
			goto_recommend() {
				console.log("进入推荐详情页面")
			},
			//字符截取
			getfirstname(name) {
				var namevalue = name.substring(0,1)+'**';
				console.log(namevalue)
			   return namevalue;
			},
			getphone(tem) {
				var temvalue = tem.substring(0,3)+'****'+tem.substring(7,11);
				console.log(temvalue)
			   return temvalue;
			},
			get_order() {
				console.log("确定")
				this.isshow = false;
			}
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        margin-bottom: 54px;
    }
    
    .card__main--col{
        padding: $uni-spacing-col-base $uni-spacing-row-base;
    }
    
    .card__col{
        position: relative;
        padding: 0;
        
        &:first-child::before{
            @include hr(right);
        }
    }
    
    .info{
        @include flex(null, center, column);
        position: relative;
        padding: $uni-spacing-col-base 0;
        
        &__label{
            font-size: 12px;
            color: $uni-text-color;
            padding-bottom: $uni-spacing-col-base;
        }
        
        &__txt{
            font-size: 16px;
            font-weight: bold;
            color: $color-main;
            
            &--helper{
                padding-left: $uni-spacing-row-base;
            }
        }
        
        &:first-child::after{
            @include hr(bottom);
        }
    }
    
    .user{
        position: relative;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        border-radius: 0;
        
        &__main{
            @include flex(null, center);
        }
        
        &__imgUser{
            flex: none;
            display: block;
            width: $uni-img-size-sm * 3;
            height: $uni-img-size-sm * 3;
            border-radius: $uni-border-radius-circle;
            margin-right: $uni-spacing-row-base * 2;
        }
        
        &__content{
            @include flex(between, null, column);
            @include flex-self(full);
            font-size: $uni-font-size-sm;
            color: $uni-text-color-grey;
        }
        
        &__name{
            font-size: 40upx;
            font-weight: 700;
            letter-spacing: 2px;
            color: $uni-text-color;
            padding-bottom: $uni-spacing-row-sm;
        }
        
        &__btn--focus{
            font-size: $uni-font-size-sm;
            padding: $uni-spacing-col-sm $uni-spacing-row-base;
            color: $color-main;
            border: 1px solid $color-main;
            border-radius: 40upx;
        }
        
        &__bottom{
            @include flex(between, center);
        }
        
        &__cell{
            @include flex(center, center, column);
            font-size: 22upx;
            color: $uni-text-color-grey;
        }
        
        &__size{
            font-size: 34upx;
            font-weight: 700;
            color: $uni-text-color;
            padding-bottom: $uni-spacing-col-sm;
        }
    }
    
    .is_focus{
        color: #fff;
        background-color: $color-main;
    }
    
    .foot__cell--red{
        color: #fff;
        background-color: $color-sub;
    }
    
    .foot__cell--disable{
        @include flex(null, center, column);
        color: #fff;
        background-color: $uni-text-color-grey;
    }
	.xinxi-title{
		flex-direction: row;
		display: flex;
		background-color: #ffffff;
		padding: 24upx 0;
		border: 10upx;
		.first-view{
			background-color: #007AFF;
			padding: 20upx 10upx 0;
			margin-top: 10upx;
		}
		.second-view{
			margin-top: 10upx;
			font-size: 36upx;
		}
	}
	.source-xinxi{
		flex-direction: row;
		display: flex;
		background-color: #ffffff;
		padding: 10upx 0;
		.source-first{
			flex-direction: row;
			display: flex;
			background-color: #ffffff;
			width: 50%;
		}
		.source-second{
			flex-direction: row;
			display: flex;
			background-color: #ffffff;
			width: 50%;
		}
		.source-new{
			flex-direction: row;
			display: flex;
			background-color: #ffffff;
			width: 100%;
		}
	}
	.beizhu{
		background-color: #ffffff;
		padding: 20upx 20upx 20upx 40upx;
		margin-bottom: 20upx;
	}
	.view-br{
		height: 1upx;
		width: 100%;
		background-color: #f5f5f5;
	}
	.recommend-cla{
		background-color: #ffffff;
		padding: 20upx 20upx 20upx 40upx;
		.recommend-first{
			flex-direction: row;
			display: flex;
			.view-right{
				position: absolute;
				right: 25upx;
				color: #dd4900;
			}
		}
		.recommend-second{
			flex-direction: row;
			display: flex;
			color: #bababa;
			view{
				font-size: 18upx;
			}
		}
	}
	.get-goods{
		background-color: #1988ff;
		color: #ffffff;
		text-align: center;
		font-size: 38upx;
		padding: 22upx 0;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.popup-view{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		width: 240px;
		label{
			margin: 20upx 0;
			text-align: left;
		}
		.view-title{
			border: 10px;
			margin: 10upx 0;
		}
		.select-picker-class{
			text-align: left;
			background-color:#ffffff ;	
		}
		.yugou{
			padding: 20upx;
			margin-top: 20upx;
			display: flex;
			flex-direction: row;
			border: 1px solid #dadada;
			border-radius: 10upx;
			color: #1988ff;
			.yg-first{
				margin-top: 8upx;
			}
			.yg-second{
				margin-left: 30upx;
				
				input{
					font-size: 30upx;
				}
			}
		}
		.bug-button{
			background-color: #1988ff;
			color: #ffffff;
			text-align: center;
			border-radius: 15upx;
			border: 1upx;
			font-size: 30upx;
			padding: 20upx 0;
			margin-top: 30upx;
		}
	}
</style>
