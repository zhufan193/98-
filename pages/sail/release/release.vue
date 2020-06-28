<template>
	<view class="page">
        <!-- <template v-if="shipArray.length > 1"> -->
            <view class="card card--full form__list">
                <view class="form__cell">
                    <view class="form__label"><text class="form__wran">*</text>选择船舶</view>
                    <picker mode="selector" :range="shipArray" range-key="name" :value="shipIndex" @change="_changeShip">
                        <view :class="shipIndex != 0 ? 'form__field' : 'form__note'">{{shipIndex != 0 ? data.ship_name : '点击选择'}}</view>
                    </picker>
                </view>
				<view class="form__cell">
				  		<view class="form__label"><text class="form__wran">*</text>船长（米）</view>
				  		<view> <input class="uni-input" style="margin-top: -20upx;text-align: right;" placeholder="请输入船长(米)" /></view>
				  	</view>
				<view class="form__cell">
				  		<view class="form__label"><text class="form__wran">*</text>船舶吨位</view>
				  		<view> <input class="uni-input" style="margin-top: -20upx;text-align: right;" placeholder="请输入船舶吨位" /></view>
				  	</view>
				<view class="form__cell">
					     <view class="form__label"><text class="form__wran">*</text>船舶类型</view>
					     <view> <picker @change="bindPickerChangea" :value="indexa" :range="arraya"> 
					   				<view class="uni-input" style="margin-top: -20upx;">{{arraya[indexa]}}</view></picker></view>
					</view>
				<view class="form__cell">
					    <view class="form__label"><text class="form__wran">*</text>封仓形式</view>
					    <view> <picker @change="bindPickerChangeb" :value="indexb" :range="arrayb"> 
					  				<view class="uni-input" style="margin-top: -20upx;">{{arrayb[indexb]}}</view></picker></view>
					</view>  
				<view class="form__cell">
					     <view class="form__label"><text class="form__wran">*</text>航运类型</view>
					     <view> <picker @change="bindPickerChangec" :value="indexc" :range="arrayc"> 
					   				<view class="uni-input" style="margin-top: -20upx;">{{arrayc[indexc]}}</view></picker></view>
					</view>
				<view class="form__cell">
				    <view class="form__label"><text class="form__wran">*</text>所在港</view>
				    <view @click="goOut">
						<view  v-bind:id="index"  v-if="isout" style="font-size: 30upx;">请选择发出港所在省市</view>
						<view v-if="!isout">{{provinceOut}}</view>
					</view></view>
					<view><province-select  style="font-size:30upx;" :isgo.sync="isgoOut" v-on:greet="_isgoOut" v-on:provinc="getProvinceOut"></province-select></view>
				<view class="form__cell">
				    <view class="form__label"><text class="form__wran">*</text>所在港</view>
				    <view @click="goIn">
						<view v-bind:id="index"  v-if="isin" style="font-size: 30upx;">请选择发出港所在省市</view>
						<view v-if="!isin">{{provinceIn}}</view>
					</view></view>
					<view><province-select  style="font-size:30upx;" :isgo.sync="isgoIn" v-on:greet="_isgoIn" v-on:provinc="getProvinceIn"></province-select></view>
				
					   
					   
                <view class="form__cell">
                    <view class="form__label"><text class="form__wran">*</text>空船期限</view>
                    <picker mode="date" @change="_changeTime">
                        <view class="formInput__field--right" :class="data.empty_at ? 'form__field' : 'form__note'">{{data.empty_at ? data.empty_at : '点击选择'}}</view>
                    </picker>
                    <view class="form__interval">
                        ±<input class="formInput__field--interval" type="number" maxlength="2" v-model="data.interval" placeholder="输入" placeholder-style="color: #999;"/>天
                    </view>
                </view>
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        备注
                    </view>
                </view>
                <view class="card__content">
                    <!-- #ifndef MP -->
                    <textarea class="form__textarea" maxlength="150" v-model="data.remark" :disabled="is_edit" placeholder="请输入简介。（150个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="drawerVisible" class="form__textarea" :style="{'color': data.remark ? '#000' : '#999'}">{{data.remark ? data.remark : '请输入简介。（150个字以内）'}}</view>
                    <textarea v-if="!drawerVisible" class="form__textarea" maxlength="150" v-model="data.remark" :disabled="is_edit" placeholder="请输入简介。（150个字以内）"  placeholder-style="color: #999; line-height: 1.6;"/>
                    <!-- #endif -->
                </view>
            </view>
            <view class="card card--full form__list" v-if="data.ship_id !== ''">
                <view class="form__cell">
                    <view class="form__label">船舶类型</view>
                    <view class="form__note">
                        {{ship.type_na}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">载重（吨）</view>
                    <view class="form__note">
                        {{ship.load_amount}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">所属公司</view>
                    <view class="form__note">
                        {{ship.company_name}}
                    </view>
                </view>
            </view>

			<view class="card card--full form">
				<view class="checked">
					<label class="checked__field" style="width: auto;" @click="_checked">
						<checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)" />
						我已阅读并同意
					</label>
					<view class="form__link" @click="_goPage('/pages/common/rich-text/rich-text?type=terms_service')">《服务条款》</view>
				</view>
			</view>
            
            <view class="foot">
                <button class="foot__btn" type="primary" @click="sendBtn">提交发布信息</button>
            </view>
            <!-- #ifdef MP -->
            <cover-view v-if="!drawerVisible" class="foot__btn foot__btn--cover" @click="sendBtn">提交发布信息</cover-view>
            <!-- #endif -->
             
            <uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
                <view class="drawer">
                    <view class="drawer__scroll">
                        <view id="select" class="select" v-show="is_target">
                            <view class="select__title">
                                选择目的地（可多选）
                            </view>
                            <view class="select__main">
                                <view class="select__subTitle">建议多选几个愿意去的地区</view>
                                <block v-for="(item, index) of selectData" :key="index">
                                    <view class="select__btn" @click="_globalRemove(index)">
                                        {{item.name[item.name.length - 1]}}
                                    </view>
                                </block>
                            </view>
                        </view>
                        <wlp-global :height="resDrawerHeight" @click="_globalChange"></wlp-global>
                    </view>
                    <view class="drawer__bottom" v-show="is_target">
                        <view class="drawer__btn" @click="_sendDrawer">确定</view>
                        <view class="drawer__btn drawer__btn--right" @click="_clearDrawer">重置</view>
                    </view>
                </view>
            </uni-drawer>
        <!-- </template> -->
        <!-- <template v-else>
            <view class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">您当前没有认证的船舶，</text>
                <text class="empty__text" style="padding-top: 0;">只有拥有认证的船舶才能发布。</text>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @click="_verify">前往认证船舶</button>
            </view>
        </template> -->
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
	import provinceSelect from '@/components/province-select/province-select.vue';
    
    import { router, toast, check } from '@/common/util.js';
    import { postSail } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniDrawer,
            uniListItem,
            wlpGlobal,
			provinceSelect
        },
		data() {
			return {
                is_chacked: true,
                height: 0,
				data: {
                    ship_id: '',
                    ship_name: '',
                    contact: '',
                    phone: '',
                    departure_ids: null,
                    departure_na: '',
                    empty_at: '',
                    interval: '',
                    target_ids: '',
                    target_na: '',
                    remark: ''
                },
                drawerVisible: false,
                is_target: false,
                shipArray: [{name:'请选择'}],
                shipIndex: 0,
                ship: {
                    type_na: '',
                    company_name: '',
                    load_amount: 0
                },
                selectData: [],
                selectHeight: 151,
				indexa:0,//船舶类型的选择
				indexb:0,//封仓形式的选择
				indexc:0,//航运类型的选择
				arraya:['请选择船舶类型','散货船', '散装水泥船','杂货船','集装箱船','拖队','油船','化学品船','液化气船','滚装船','多用途船','捕捞船','冷藏船','其他船'],
				arrayb:['请选择封仓形式','无封仓','简易封仓','自动封仓'],
				arrayc:['请选择航运类型','长江-内河','江海联运','海运'],
				isout:true,//用于决定具体选择的省市（发出港）的显示
				isgoOut:false,//用于决定省市组件的显示
				provinceOut:'',//接收选择的省市
				isin:true,
				isgoIn:false,
				provinceIn:'',
			};
		},
        computed: {
            ...mapState(['userInfo','shipTempData']),
            resDrawerHeight() {
                if(this.is_target){
                    return this.height - this.selectHeight;
                }else{
                    return this.height;
                }
            }
        },
        async onLoad() {
            if(!this.shipTempData.hasOwnProperty('my_ship') || !this.shipTempData.my_ship.length){
                await this.getReleaseShip();
            }
            this.shipArray = this.shipArray.concat(this.shipTempData.my_ship);
                
            await this.getGlobal();
            toast.hideLoading();
            // global由height启动，需放数据加载后
            const systemInfo = uni.getSystemInfoSync();
            this.height = systemInfo.windowHeight;
        },
        onHide() {
            if (this.drawerVisible) {
                this._hideDrawer();
            }
        },
		onBackPress() {
			if (this.drawerVisible) {
				this._hideDrawer()
				return true
			}
		},
        methods:{
            ...mapActions(['getReleaseShip', 'getGlobal']),
            _goPage(url) {
                router.navigateTo(url);
            },
			//用于获得包装形式
			bindPickerChangea: function(e) {
			            this.indexa = e.target.value;
			        },
			//用于获得航运类型
			bindPickerChangeb: function(e) {
					    this.indexb = e.target.value;
					},
			//
			bindPickerChangec: function(e) {
					    this.indexc = e.target.value;
					},
			//发出港
			goOut:function(e){
			
				this.isgoOut=true;
				this.isout=true;
			},
			_isgoOut(isgo){
				this.isgoOut=isgo;
			},
			getProvinceOut(province){
				this.provinceOut=province;
				this.isout=false;
				
			},
			//到达港
			goIn:function(e){
			
				this.isgoIn=true;
				this.isin=true;
			},
			_isgoIn(isgo){
				this.isgoIn=isgo;
			},
			getProvinceIn(province){
				this.provinceIn=province;
				this.isin=false;
				
			},
			_changeShip(e)
			{
				let index = e.target.value
				this.shipIndex = index
				if (index == 0){
                    this.ship.type_na = '';
                    this.ship.company_name = '';
                    this.ship.load_amount = '';
                    this.data.contact = '';
                    this.data.phone = '';
                    this.data.ship_name = '';
                    this.data.ship_id = '';
                }else{
                    let item = this.shipArray[index];
                    this.ship.type_na = item.type_na;
                    this.ship.company_name = item.company;
                    this.ship.load_amount = item.load_amount;
                    this.data.ship_name = item.name;
                    this.data.ship_id = item.id;
                    if(item.contact !== ''){
                        if(this.data.contact === ''){
                            this.data.contact = item.contact;
                        }else if(this.data.contact !== item.contact){
                            uni.showModal({
                                title: '提示',
                                content: '联系人：（' + this.data.contact + '）是否替换成（' + item.contact + ')',
                                success: (res) => {
                                    if (res.confirm) {
                                        this.data.contact = item.contact;
                                    }
                                }
                            });
                        }
                    }
                    if(item.phone !== ''){
                        if(this.data.phone === ''){
                            this.data.phone = item.phone;
                        }else if(this.data.phone !== item.phone){
                            uni.showModal({
                                title: '提示',
                                content: '联系电话：（' + this.data.phone + '）是否替换成（' + item.phone + ')',
                                success: (res) => {
                                    if (res.confirm) {
                                        this.data.phone = item.phone;
                                    }
                                }
                            });
                        }
                    }
				}
			},
            _changeTime(e){
                this.data.empty_at = e.detail.value;
            },
            _targetInput(e){
                this.data.target_ids = '';
                this.data.target_na = e.detail.value;
            },
            _globalRemove(index) {
                this.selectData.splice(index, 1);
            },
            _globalChange(e){
                if(this.is_target){
                    let bool = this.selectData.some((item, index, array) => {
                        return item.id[item.id.length - 1] === e.id[e.id.length - 1];
                    });
                    if(!bool){
                        this.selectData.push(e);
                        this.$nextTick(() => {
                            // 重新计算高度
                            uni.createSelectorQuery().in(this).select('#select').boundingClientRect((res) => {
                                let height = res.height + 58;
                                if(height > 160){
                                    this.selectHeight = height;
                                }
                            }).exec();
                        })
                    }
                }else{
                    this.data.departure_ids = e.id.join(',');
                    this.data.departure_na = e.name[e.name.length - 1];
                    this._hideDrawer();
                }
            },
            _sendDrawer(){
                if(this.is_target){
                    this.data.target_ids = this.selectData.map(item => {
                        return item.id[item.id.length - 1]
                    }).join(',');
                    this.data.target_na = this.selectData.map(item => {
                        return item.name[item.name.length - 1]
                    }).join(',');
                }
                this._hideDrawer();
            },
            _clearDrawer(){
                if(this.is_target){
                    this.selectData = [];
                    this.data.target_ids = '';
                    this.data.target_na = '';
                }else{
                    this.data.departure_ids = '';
                    this.data.departure_na = '';
                    this._hideDrawer();
                }
            },
            _showDrawer(type) {
                if(type == 'target'){
                    this.is_target = true;
                }
                this.drawerVisible = true;
            },
            _hideDrawer() {
                this.is_target = false;
                this.drawerVisible = false;
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            sendBtn() {
                let send = this.data;
                if(send.ship_id == ''){
                    toast.show('请选择船舶！');
                    return;
                }
                if(send.empty_at == ''){
                    toast.show('请选择空船日期！');
                    return;
                }
                if(send.interval == ''){
                    toast.show('请填写空船误差天数！');
                    return;
                }
                if(send.departure_ids == ''){
                    toast.show('请选择空船地区！');
                    return;
                }
                if(send.target_na == ''){
                    send.target_na = '不限';
                }
                if(send.contact == ''){
                    toast.show('请输入联系人！');
                    return;
                }
                if(!check.phone(send.phone)){
                    if(send.phone.length === 7){
                        toast.show('座机号码请加上区号！');
                        return;
                    }
                    toast.show('请填写正确电话号码！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《服务条款》！');
                    return;
                }
                toast.loading('发布中，请稍后...');
                postSail(send).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布船期',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布船期',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
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
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/drawer.scss';
    
    .page{
        padding: 0 0 44px;
    }
    
    .form__interval{
        @include flex(null, center);
        @include flex-self(keep);
        padding-right: $uni-spacing-row-base;
    }
    
    .formInput__field--interval{
        width: 2em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
    }
    
    .formInput__field + uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
    }
    
    .select{
        &__title{
            padding: 16px $uni-spacing-row-base 0;
            color: $uni-text-color;
            font-size: 16px;
            font-weight: 700;
        }
        
        &__subTitle{
            color: $uni-text-color-grey;
            font-size: 12px;
            font-weight: 100;
            width: 100%;
        }
        
        &__main{
            @include flex(null, null, null, wrap);
            position: relative;
            margin: 4px $uni-spacing-row-base 0;
            min-height: 60px;
            padding: 4px $uni-spacing-row-sm 0;
            
            &::after{
                @include hr(border);
            }
        }
        
        &__btn{
            position: relative;
            height: 22px;
            line-height: 22px;
            padding: 0 16px 0 8px;
            margin: 0 8px 8px 0;
            text-align: center;
            font-size: $uni-font-size-sm;
            color: $uni-color-error;
            background-color: #ffbba5;
            border-radius: $uni-border-radius-sm;
            
            &::after{
                content: "x";
                display: block;
                position: absolute;
                top: 0;
                right: $uni-spacing-row-sm;
                color: $uni-color-error;
                line-height: 1;
            }
        }
    }
</style>
