<template>
	<view class="page" :style="{'padding-bottom': is_record ? detail.oil_product.length * 54 + 115 + 'px' : ''}">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view v-show="indexActive === 0 && detail" @tap="togglePopup(false)">
            <view class="card card--full form">
                <view class="form__cell" v-if="detail.state === 1">
                    <view class="form__label">付款方式</view>
                    <view class="form__note">{{detail.payment}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">船舶名称</view>
                    <view class="form__note">{{detail.ship_name}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">加油港口</view>
                    <view class="form__note">{{detail.harbor}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">预计加油日期</view>
                    <view class="form__note">{{detail.refuel_at + '±' + detail.refuel_at_num}}</view>
                </view>
                <view class="card__main--col form__cell" v-for="(item, index) of detail.oil_product" :key="index">
                    <view class="card__col">
                        <view class="form__cell">
                            <view class="form__label">油品{{index + 1}}</view>
                            <text class="form__note">{{item.oil_type + '/' + item.amount}}吨</text>
                        </view>
                    </view>
                    <view class="card__col">
                        <view class="form__cell">
                            <view class="form__label">价格上限</view>
                            <text class="form__note">¥{{item.price}}元/吨</text>
                        </view>
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">发布时间</view>
                    <view class="form__note">{{detail.publish_at}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">结束时间</view>
                    <view class="form__note">{{detail.end_at}}</view>
                </view>
            </view>
            <view class="card card--full" v-if="detail.bid_info">
                <view class="card__head">
                    <view class="card__title">
                        当前领先报价
                    </view>
                    <view class="card__helper">
                        共<text class="card__info--red">{{detail.bid_company_count}}</text>人竞价，出价<text class="card__info--red">{{detail.bid_count}}</text>次
                    </view>
                </view>
                <view class="form">
                    <block v-for="(item, index) of detail.bid_info.oil_product" :key="index">
                        <view class="form__cell">
                            <view class="form__label">{{item.oil_type}}报价</view>
                            <view class="form__note">{{item.price}}元/吨</view>
                        </view>
                    </block>
                    <view class="form__cell">
                        <view class="form__label">总费用</view>
                        <view class="form__note card__info--red">{{detail.bid_info.total_amount}}元</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="list" v-show="indexActive === 1">
            <block v-for="(item, index) of data" :key="index">
                <view class="card card--full form">
                    <view class="card__head">
                        <view class="card__title">
                            竞价号:{{item.order_no}}
                        </view>
                        <view class="card__helper">
                            <view class="card__badge" :class="item.state == 1 ? '' : 'card__badge--out'">
                                {{item.state_str}}
                            </view>
                        </view>
                    </view>
                    <block v-for="(item, index) of item.oil_product" :key="index">
                        <view class="form__cell">
                            <view class="form__label">{{item.oil_type}}报价</view>
                            <view class="form__note">{{item.price}}元/吨</view>
                        </view>
                    </block>
                    <view class="form__cell">
                        <view class="form__label">总费用</view>
                        <view class="form__note card__info--red">{{item.total_amount}}元</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">报价时间</view>
                        <view class="form__note">{{item.created_at}}</view>
                    </view>
                </view>
            </block>
            <uni-load-more v-if="data.length" :status="loadingType"></uni-load-more>
            <view v-else class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">暂无竞价信息</text>
            </view>
        </view>
        <view class="foot">
            <button class="foot__btn" :class="detail.state === 1 ? '' : 'foot__btn--disabled'" type="primary" @tap="_record()">{{detail.state === 1 ? '我要出价（剩余时间' + minute + '分' + second + '秒）' : detail.state_str}}</button>
        </view>
        <view v-if="detail.state === 1" class="record">
            <view class="record__head" :class="{'active': is_record}">
                距离报价结束还有：
                <text class="record__red">{{minute}}</text>分
                <text class="record__red">{{second}}</text>秒
            </view>
            <view v-if="companyArray.length > 1" class="record__main form" :class="{'active': is_record}">
                <view class="form__cell">
                    <view class="form__label">选择燃油公司</view>
            		<picker mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
            			<view class="form__note">{{ companyIndex != 0 ? companyArray[companyIndex].name : '点击选择' }}</view>
            		</picker>
                </view>
                <block v-for="(item, index) of detail.oil_product" :key="index">
                    <view class="form__cell">
                        <view class="form__label">油品{{index + 1}}：{{item.oil_type}}/{{item.amount}}吨</view>
                        <input class="formInput__field formInput__field--right" type="digit" placeholder="输入每吨报价" :value="bid[index]" :data-index="index" @input="_input" @focus="_scroll" placeholder-style="color: #cecece;"/>
                    </view>
                </block>
                <view class="form__cell">
                    <view class="form__label">总费用：{{totalAmount}}元</view>
                    <button class="record__btn" type="default" size="mini" @click="_send()">提交报价</button>
                </view>
            </view>
            <template v-if="companyArray.length < 2">
                <view class="empty empty--popup">
                    <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                    <view class="empty__text">您当前没有认证的燃油企业，</view>
                    <view class="empty__text" style="padding-top: 0;">只能已认证的燃油企业才能参与竞价。</view>
                </view>
                <view class="foot">
                    <button class="foot__btn" type="primary" @click="_verify">前往认证燃油企业</button>
                </view>
            </template>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    
    import { router, toast, dateUtils, check } from '@/common/util.js';
    import { getOilBidDetail, getOilBidRecord, postOilBidRecord, postActionDel } from '@/service/getData.js';
    
    import { mapState, mapMutations, mapActions } from 'vuex';
    
    var time_id = null;
    
	export default {
        components:{
            uniSegmentedControl,
            uniLoadMore,
            uniPopup
        },
		data() {
			return {
                router: '',
                items: ['标底需求', '报价记录'],
				indexActive: 0,
                id: null,
                detail: null,
                data: [],
                page: 1,
                loadingType: 'more',
                minute: '00',
                second: '00',
                is_record: false,
                companyArray: [{name:'请选择'}],
                companyIndex: 0,
                bid: [],
                totalAmount: 0
			};
		},
        computed: mapState(['hasLogin', 'userInfo', 'companyTempData']),
        onLoad(options) {
            if(options && options.id){
                if(options.router && options.router === 'user'){
                    this.router = options.router;
                    // #ifdef APP-PLUS  
                    var webView = this.$mp.page.$getAppWebview();  
                    webView.setTitleNViewButtonStyle(0, {  
                        text: '删除',  
                        width: '54px'
                    });  
                    // #endif
                }
                this.id = options.id;
                this.getData();
                time_id = setInterval(this.upDate, 1000);
            }
        },
        onUnload() {
            clearInterval(time_id);
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            if(this.indexActive === 1){
                this.getData('ReachBottom');
            }
        },
        onBackPress() {
			if (this.is_record) {
				this.is_record = false;
				return true;
			}
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            if(this.router === 'user'){
                this._del();
            }else{
                router.navigateTo('/pages/common/rich-text/rich-text?type=bid_rules');
            }
        },
        methods: {
            ...mapActions(['getCompanyFuel']),
            ...mapMutations(['GOPAGE_LOGIN', 'PAGE_TEMP_UPDATA']),
            async _record() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                if(this.detail.state !== 1){
                    return;
                }
                toast.loading();
                    
                //获取我的公司
                if(!this.companyTempData.hasOwnProperty('company_fuel') || !this.companyTempData.company_fuel.length){
                    await this.getCompanyFuel();
                }
                if(this.companyArray.length === 1){
                    this.companyArray = this.companyArray.concat(this.companyTempData.company_fuel);
                }
                toast.hideLoading();
                
                this.indexActive = 0;
                this.is_record = true;
                this._scroll();
            },
            _scroll(){
                setTimeout(() => {
                    uni.pageScrollTo({
                        scrollTop: 3000,
                        duration: 0
                    });
                }, 300);
            },
            togglePopup(bool) {
                this.is_record = bool;
            },
            _changeCompany(e) {
                this.companyIndex = e.detail.value;
            },
            _input(e) {
                this.bid[e.target.dataset.index] = e.detail.value;
                let totalAmount = 0;
                for(let i = 0, len = this.bid.length; i < len; i++){
                    totalAmount = totalAmount + this.detail.oil_product[i].amount * this.bid[i];
                }
                this.totalAmount = Math.floor(totalAmount * 100) / 100;
            },
            _send() {
                if(this.companyIndex == 0){
                    toast.show('请选择公司！');
                    return;
                }
                for(let i = 0, len = this.bid.length; i < len; i++){
                    if(!check.price(this.bid[i])){
                        toast.show('请输入正确价格！');
                        return;
                    }
                }
                toast.loading('发起中...');
                postOilBidRecord({id: this.id, company_id: this.companyArray[this.companyIndex].id, price: this.bid}).then(res => {
                    this.companyIndex = 0;
                    this.bid = [];
                    this.totalAmount = 0;
                    this.togglePopup(false);
                    this.getData();
                }, err => {
                    toast.show(err.message, 'none', false, 3000, 'center');
                });
            },
            _onClickItem(e) {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                });
                this.indexActive = e;
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh' && index === 0){
                    toast.loading();
                    getOilBidDetail(this.id).then(res => {
                        this.bid = [];
                        for(let i = 0, len = res.data.oil_product.length; i < len; i++){
                            this.bid.push(null);
                        }
                        this.detail = res.data;
                        if(type == 'DownRefresh'){
                            uni.stopPullDownRefresh();
                            toast.hideLoading();
                        }
                    });
                }
                if(type == 'ReachBottom' && index === 1){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                if(!this.data.length || (type == 'DownRefresh' && index === 1)){
                    if(type == 'DownRefresh'){
                        this.page = 1;
                        this.loadingType = 'more';
                        toast.loading();
                    }
                    getOilBidRecord({id: this.id, page: this.page}).then(res => {
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
                    })
                }
            },
            upDate() { // 计时器
                if(!this.detail) return;
                let date = dateUtils.parse(this.detail.end_at);
                let diff = date.getTime() - Date.now();
                if(diff > 0){
                    let minute = Math.floor(diff / 60000);
                    let second = Math.floor(diff % 60000 / 1000);
                    this.minute = minute <= 9 ? '0' + minute : minute;
                    this.second = second <= 9 ? '0' + second : second;
                }else{
                    this.getData();
                    clearInterval(time_id);
                }
            },
            _verify() {
                if(this.userInfo.is_realname){
                    router.redirectTo('/pages/company/verify/verify');
                }else{
                    let review_state = this.userInfo.review_state;
                    uni.showModal({
                        content: '请实名认证后再进行企业认证！',
                        success: function(e) {
                            if(e.confirm){
                                router.redirectTo('/pages/user/verify/verify', {review_state: review_state});
                            }
                        }
                    })
                }
            },
            _del() {
                uni.showModal({
                    title: '警告',
                    content: '请确认是否删除',
                    confirmText: '删除',
                    success: res => {
                        if(res.confirm){
                            postActionDel('bid_order', this.id).then(res => {
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
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 56px 0;
    }
    
    .card__main--col {
        padding: 0;
    }
    
    .card__col{
        padding: 0;
    }

    .foot__btn--disabled[type=primary]{
        background-color: #999;
    }
    
    .record{
        
        &__head{
            @include flex(center, center);
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            z-index: -1;
            height: 44px;
            background-color: #0082ce;
            color: #fff;
            font-size: $uni-font-size-sm;
            opacity: 0;
            transition: opacity 300ms;
        
            &.active{
                opacity: 1;
                z-index: 1001;
            }
        }
        
        &__red{
            color: #ffe719;
            padding: 0 2px;
            font-size: $uni-font-size-lg;
            font-weight: bold;
        }
        
        &__main{
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            width: 100%;
            background-color: $color-main;
            opacity: 0;
            transition: opacity 300ms;
        
            &.active{
                opacity: 1;
                z-index: 1001;
            }
        
            .form__label,.form__note,.formInput__field{
                color: #fff;
            }
        }
        
        &__btn{
            margin: 0 $uni-spacing-row-base;
        }
        
        .form__cell::after{
            background-color: #1e9be4;
        }
    }
            
    .empty{
        &.empty--popup{
            height: 350px;
            padding-bottom: 44px;
        }
        
        &__text{
            height: 12px;
            line-height: 12px;
            padding: 26rpx 0 16rpx;
        }
    }
    
    .card__badge--out{
        color: #999;
        border-color: #999;
    }
</style>
