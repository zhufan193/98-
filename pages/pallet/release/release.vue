<template>
	<view class="page">
       <!-- <template v-if="userInfo.is_realname"> -->
	   <template v-if="true">
            <view class="card card--full form__list">
                <view class="form__cell" @tap="_changeCargoType()">
                    <view class="form__label"><text class="form__wran">*</text>货源名称</view>
                    <view> <input class="uni-input " style="margin-top: -20upx;text-align: right;"  placeholder="请输入货源名称" /></view>
                </view>
              
			  <view class="form__cell">
			        <view class="form__label"><text class="form__wran">*</text>货物吨位</view>
			        <view> <input class="uni-input" style="margin-top: -20upx;text-align: right;"  placeholder="请输入货物吨位" /></view>
			    </view>
			<view class="form__cell">
			  		<view class="form__label"><text class="form__wran">*</text>货物单价</view>
			  		<view> <input class="uni-input" style="margin-top: -20upx;text-align: right;" placeholder="请输入货物单价 元/吨" /></view>
			  	</view>
			  				
			<view class="form__cell">
			  		<view class="form__label"><text class="form__wran">*</text>运价（元）</view>
			  		<view> <input class="uni-input" style="margin-top: -20upx;text-align: right;"  placeholder="请输入参考运价" /></view>
			  	</view>
			<view class="form__cell">
			    <view class="form__label"><text class="form__wran">*</text>包装形式</view>
			    <view> <picker @change="bindPickerChange" :value="indexa" :range="arraya"> 
			  				<view class="uni-input" style="margin-top: -20upx;">{{arraya[indexa]}}</view></picker></view>
			  </view>  
			<view class="form__cell">
			     <view class="form__label"><text class="form__wran">*</text>航运类型</view>
			     <view> <picker @change="bindPickerChangeb" :value="indexb" :range="arrayb"> 
			   				<view class="uni-input" style="margin-top: -20upx;">{{arrayb[indexb]}}</view></picker></view>
			   </view> 			  
                <view class="form__cell">
                    <view class="form__label"><text class="form__wran">*</text>装运期限</view>
                    <picker mode="date" @change="_changeTime">
                        <view class="formInput__field--right" :class="data.empty_date ? 'form__field' : 'form__note'">{{data.empty_date ? data.empty_date : '点击选择'}}</view>
                    </picker>
                    <view class="form__interval">
                        ±<input class="formInput__field--interval" type="number" maxlength="2" v-model="data.empty_days" placeholder="误差" placeholder-style="color: #999;"/>天
                    </view>
                </view>
				
				<ad-deharbor :outinharbor="outharbor" v-on:greet="getoutHarbor"></ad-deharbor>	
				   
				<ad-deharbor :outinharbor="inharbor" v-on:greet="getinHarbor"></ad-deharbor>
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        备注
                    </view>
                </view>
                <view class="card__content">
                    <!-- #ifndef MP -->
                    <textarea class="form__textarea" maxlength="150" v-model="data.remark" placeholder="其他信息。（150个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="!is_mp" class="form__textarea" :style="{'color': data.remark ? '#000' : '#999'}">{{data.remark ? data.remark : '其他信息。（150个字以内）'}}</view>
                    <textarea v-if="is_mp" class="form__textarea" maxlength="150" v-model="data.remark" placeholder="其他信息。（150个字以内）"  placeholder-style="color: #999;line-height: 1.6;"/>
                    <!-- #endif -->
                </view>
            </view>
			<view class="card card--full form">
			    <view class="checked">
			        <label class="checked__field" style="width: auto;" @click="_checked">
			            <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
			            我已阅读并同意
			        </label>
			        <view class="form__link" @click="_goPage('/pages/common/rich-text/rich-text?type=terms_service')">《服务条款》</view>
			    </view>
			</view>
            
            <view class="foot">
                <button class="foot__btn" type="primary" @click="sendBtn">提交发布信息</button>
            </view>
            <!-- #ifdef MP -->
            <cover-view v-if="is_mp" class="foot__btn foot__btn--cover" @click="sendBtn">提交发布信息</cover-view>
            <!-- #endif -->
			 
			<uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
			    <view class="drawer">
			        <view class="drawer__scroll">
                        <wlp-global :height="height" :default-index="resDefaultIndex" @click="_globalChange"></wlp-global>
			        </view>
			    </view>
			</uni-drawer>
            
            <!-- #ifdef MP -->
            <uni-popup :show="is_popup" position="middle" mode="fixed" @hidePopup="is_popup = false">
                <view class="popup">
                    <view class="popup__text">输入港口名称</view>
                    <view class="popup__input">
                        <input class="popup__field" type="text" v-model="popupInput" placeholder="输入港口名称"/>
                    </view>
                    <view class="popup__bottom">
                        <view class="popup__btn" @click="is_popup = false">取消</view>
                        <view class="popup__btn popup__btn--confirm" @click="_popupConfirm">确认</view>
                    </view>
                </view>
            </uni-popup>
            <!-- #endif -->
        </template>
		<template v-else>
			<view class="empty">
				<image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
				<text class="empty__text">您当前还未进行个人实名认证。</text>
				<text class="empty__text" style="padding-top: 0;">只有个人实名认证的会员才能发起。</text>
			</view>
			<view class="foot"><button class="foot__btn" type="primary" @click="_verify()">前往实名认证</button></view>
		</template>
            
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="cargoTypeIndex"
         @onConfirm="_setCargoType" @onCancel="_cancelCargoType" :pickerValueArray="cargoTypeList"></mpvue-picker>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
	import adDeharbor from '@/components/ad-deharbor/ad-deharbor.vue';   
    import { router, toast, check } from '@/common/util.js';
    import { postPallet } from '@/service/getData.js';
    import { mapState, mapActions } from 'vuex';
    
    var globalTemp;
    
	export default {
        components: {
            uniIcons,
            mpvuePicker,
            uniDrawer,
            uniPopup,
            wlpGlobal,
			adDeharbor
        },
		data() {
			return {
                height: 0,
                is_chacked: true,
				data: {
					'cargo_type':'',
                    'packing_type': '',
					'weigh':'',
                    'weigh_error':'',
					'empty_date':'',
					'empty_days':'',
					'departure_ids':'',
					'departure_na':'',
					'departure_na_str':'',
					'departure_index':[],
                    'departure_harbor_id': '',
                    'departure_harbor_na': '',
					'target_ids':'',
					'target':'',
					'target_na_str':'',
					'target_index':[],
                    'target_harbor_id': '',
                    'target_harbor_na': '',
					'price':'',
					'demurrage':'',
					'pay_method':1,
					'tax':0,
					'remark':'',
					'company_id':'',
					'company':'',
					'contact':'',
					'phone':'',
                },
                cargoTypeIndex: [0, 0],
				cargoTypeList: [],
                packingTypeList: [{'label':'请选择'}],
                packingTypeIndex: 0,
				companyArray:[{'name':'请选择'}],
				companyIndex:0,
                drawerVisible: false,
                is_departure: false,
                is_target: false,
                is_mp: true,
                is_popup: false,
                popupInput: '',
				indexa:0,//包装形式的选择
				indexb:0,//航运类型的选择
				inharbor:'到达港',//到达港
				iharbor:'',//用于接收到达港信息
				outharbor:'发出港',//发出港
				oharbor:'',//用于接收发出港信息
				arraya:['请选择包装形式','散装','封仓','袋装','箱装','罐桶装','裸装','其他'],
				arrayb:['请选择航运类型','长江-内河','江海联运','海运'],
				goList:[{
					isout:true,
				isgo:false,
				provinc:''
				}],
				
			};
		},
        computed: {
            ...mapState(['userInfo', 'companyTempData', 'dictionaryTempData']),
            resDefaultIndex() {
                if(this.is_departure){
                    return this.data.departure_index;
                }
                if(this.is_target){
                    return this.data.target_index;
                }
                return [];
            }
        },
        async onLoad() {
            toast.loading();
			// 获取公司
            if(!this.companyTempData.hasOwnProperty('my_company') || !this.companyTempData.my_company.length){
                await this.getReleaseCompany();
            }
			this.companyArray = this.companyArray.concat(this.companyTempData.my_company);
			
			// 获取货物type
			await this.getCargoType();
			this.cargoTypeList = this.cargoTypeList.concat(this.dictionaryTempData.cargo_type);
			
			// 获取包装type
			await this.getPackingType();
			this.packingTypeList = this.packingTypeList.concat(this.dictionaryTempData.packing_type);
			
            await this.getGlobal();
            toast.hideLoading();
            // port由height启动，需放数据加载后
            const systemInfo = uni.getSystemInfoSync();
            this.height = systemInfo.windowHeight;
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.is_popup) {
                this.is_popup = false;
                return true
            }
            if (this.$refs.mpvuePicker.showPicker) {
                // #ifdef MP
                this.is_mp = true;
                // #endif
                this.$refs.mpvuePicker.pickerCancel();
                return true
            }else if (this.drawerVisible) {
            	this._hideDrawer()
                return true
            }
        },
		onUnload() {
            // 退出前关闭选择器
			if (this.$refs.mpvuePicker.showPicker) {
                // #ifdef MP
                this.is_mp = true;
                // #endif
				this.$refs.mpvuePicker.pickerCancel();
			}
		},
        onHide() {
            // #ifdef MP
            this.is_mp = true;
            // #endif
            if (this.is_popup) {
                this.is_popup = false;
            }
            if (this.drawerVisible) {
                this._hideDrawer();
            }
        },
        methods:{
            ...mapActions(['getReleaseCompany', 'getCargoType', 'getPackingType', 'getGlobal']),
            _goPage(url) {
                router.navigateTo(url);
            },
			//获得到达港信息
			getinHarbor(province){
				this.iharbor=province;
				console.log(this.iharbor.provinc);
			},
			//获得发出港信息
			getoutHarbor(province){
				this.oharbor=province;
				for(var name in this.oharbor){
					console.log(this.oharbor[name].provinc);
				}
				
			},
			//用于获得包装形式
			bindPickerChange: function(e) {
			            this.indexa = e.target.value;
			        },
			//用于获得航运类型
			bindPickerChangeb: function(e) {
					    this.indexb = e.target.value;
					},
			_changeCargoType(){
                // #ifdef MP
                this.is_mp = false;
                // #endif
				this.$refs.mpvuePicker.show();
			},
            _changePacking(e){
				let index = e.target.value;
                this.packingTypeIndex = index;
                this.data.packing_type = index == 0 ? '' : this.packingTypeList[index].val;
            },
			_setCargoType(e) {
                // #ifdef MP
                this.is_mp = true;
                // #endif
			    this.data.type_na = e.label.split('-')[1];
			    this.data.cargo_type = e.value[1];
			},
            _cancelCargoType(){
                // #ifdef MP
                this.is_mp = true;
                // #endif
            },
            _changeTime(e){
                this.data.empty_date = e.detail.value;
            },
			setPayment(e){
				this.data.pay_method = e.target.value
			},
			setTax(e){
				this.data.tax = e.target.value
			},
			_changeCompany(e){
				let index = e.target.value
				this.companyIndex = index
				if (index > 0)
				{
					this.data.company_id = this.companyArray[index].id
					this.data.company = this.companyArray[index].name
					this.data.tmp_company = this.companyArray[index].name
				}
			},
            _portIn(e, value){
                // console.log(e, value)
                if(this.is_departure){
                    this.data.departure_ids = e.id.join(',');
                    this.data.departure_na_str = e.name[e.name.length - 1];
                    this.data.departure_na = e.name[e.name.length - 1];
                    this.data.departure_index = e.index;
                    if(this.data.departure_na !== value) {
                        this.data.departure_harbor_na = value;
                        this.data.departure_na = value;
                    }else{
                        this.data.departure_harbor_na = '';
                        this.data.departure_na = '';
                    }
                }else if(this.is_target){
                    this.data.target_ids = e.id.join(',');
                    this.data.target_na_str = e.name[e.name.length - 1];
                    this.data.target = e.name[e.name.length - 1];
                    this.data.target_index = e.index;
                    if(this.data.target_na !== value) {
                        this.data.target_harbor_na = value;
                        this.data.target = value;
                    }else{
                        this.data.target_harbor_na = '';
                        this.data.target = '';
                    }
                }
                this._hideDrawer();
            },
            _popupConfirm(){
                this.is_popup = false;
                this._portIn(globalTemp, this.popupInput.trim());
            },
            _globalChange(e){
                let that = this;
                // #ifdef APP-PLUS
                plus.nativeUI.prompt('输入港口名称', function(res){
                    if(res.index === 0){
                        that._portIn(e, res.value.trim());
                    }else{
                        that._hideDrawer();
                    }
                }, '', '输入港口名称', ['确认', '取消']);
                // #endif
                // #ifndef APP-PLUS
                // toast.show('缺少输入对话框组件');
                globalTemp = e;
                this.popupInput = '';
                this.is_popup = true;
                // #endif
            },
			
            _showDrawer(type) {
                // #ifdef MP
                this.is_mp = false;
                // #endif
                if(type === 'departure'){
                    this.is_departure = true;
                }else if(type === 'target'){
                    this.is_target = true;
                }
                this.drawerVisible = true;
            },
            _hideDrawer() {
                // #ifdef MP
                this.is_mp = true;
                // #endif
                this.is_departure = false;
                this.is_target = false;
                this.drawerVisible = false;
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            sendBtn() {
                // 选择公司后改手动输入
				if (this.data.company_id != '')
				{
					if (this.data.company != this.data.tmp_company)
					{
						this.data.company_id = ''
					}
				}
                let send = this.data;
				
				//进行判断
				
				if (this.data.cargo_type == '')
				{
					toast.show('请选择货物类型');
					return;
				}
				if (this.data.packing_type == '')
				{
					toast.show('请选择包装类型');
					return;
				}
				
				if (this.data.weigh == '')
				{
					toast.show('请输入货物吨位');
					return;
				}
				if (this.data.weigh_error == '')
				{
					toast.show('请输入货物吨位误差');
					return;
				}
				if (this.data.empty_date == '')
				{
					toast.show('请选择装载日');
					return;
				}
				if (this.data.empty_days == '')
				{
					toast.show('请输入日期误差');
					return;
				}
				if (this.data.cargo_type == '')
				{
					toast.show('请选择货物类型');
					return;
				}
				if (this.data.departure_ids == '')
				{
					toast.show('请选择装货地');
					return;
				}
				if (this.data.target_ids == '')
				{
					toast.show('请输入目的地');
					return;
				}
				if (this.data.company == '')
				{
					toast.show('请输入公司');
					return;
				}
				if (this.data.contact == '')
				{
					toast.show('请输入联系人');
					return;
				}
				if (!check.phone(this.data.phone))
				{
					toast.show('请填写正确电话号码');
					return;
				}
            
                if(!this.is_chacked){
                    toast.show('请阅读并同意《服务条款》！');
                    return;
                }
                if(this.data.price == ''){
                	send.price = '0';
                }
				if (this.data.demurrage == '')
				{
					send.demurrage = '0';
				}
                
                toast.loading('发布中，请稍后...');
                postPallet(send).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布货盘',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布货盘',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            },
            _verify() {
                let review_state = this.userInfo.review_state;
                router.redirectTo('/pages/user/verify/verify', {review_state: review_state});
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
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
        width: 3em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
        color: $uni-text-color-grey;
    }
    
    .formInput__field + picker.form__icon{
        @include flex-self(keep);
    }
    
    .formInput__field + picker.form__icon uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
    }
    
    /* #ifdef MP */
    uni-popup .uni-mask{
        z-index: 10004;
    }
    
    uni-popup .uni-popup-fixed.uni-popup-middle{
        z-index: 10004;
        padding: 0;
        overflow: hidden;
    }
    .popup{
        background-color: #f2f2f2;
        
        &__close{
            position: absolute;
            right: 0;
            top: 0;
        }
        
        &__text{
            color: $uni-text-color;
            font-size: 16px;
            padding: $uni-spacing-col-lg 0;
            text-align: center;
        }
        
        &__input{
            padding: $uni-spacing-col-sm $uni-spacing-row-sm;
            margin: 0 $uni-spacing-row-lg $uni-spacing-col-lg;
            background-color: #fff;
            border: 1rpx solid $uni-border-color;
            border-radius: $uni-border-radius-sm;
        }
        
        &__field{
            width: 100%;
        }
        
        &__bottom{
            position: relative;
            @include flex();
            
            &::after{
                @include hr(top);
            }
        }
        
        &__btn{
            position: relative;
            width: 250rpx;
            height: 40px;
            text-align: center;
            line-height: 40px;
                
            &--confirm{
                color: $color-main;
            }
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
            }
        }
    }
    /* #endif */
</style>