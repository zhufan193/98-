<template>
	<view class="page">
		<view class="form" v-if="data">
		    <view class="form__cell">
		        <view class="form__label">船舶信息</view>
		        <view class="form__note">{{data.name}}{{data.mmsi ? '/' + data.mmsi : ''}}</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">类型/吨位</view>
		        <view class="form__note">{{data.type}}/{{data.load_amount}}T</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">装/卸港</view>
		        <view class="form__note">{{data.departure_na}}->{{data.target_na}}</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">空船日期</view>
		        <view class="form__note">{{data.empty_at}}±{{data.interval}}</view>
		    </view>
        </view>
		<view class="form">
            <view class="form__cell">
                <view class="form__label"><text class="form__wran">*</text>托运方名称</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="contact" placeholder="点击输入" placeholder-style="color: #999;"/>
				<picker class="form__icon" mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
					<uni-icons type="plusempty" size="24" color="#999"></uni-icons>
				</picker>
            </view>
            <view class="form__cell" @tap="_changeCargoType()">
                <view class="form__label"><text class="form__wran">*</text>货物类型</view>
                <view :class="cargo_type ? 'form__field' : 'form__note'" >{{cargo_type ? cargo_name : '点击选择'}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label"><text class="form__wran">*</text>包装类型</view>
                <picker mode="selector" :range="packingTypeList" range-key="label" :value="packingTypeIndex" @change="_changePacking">
                    <view :class="packingTypeIndex != 0 ? 'form__field' : 'form__note'">{{packingTypeIndex != 0 ? packingTypeList[packingTypeIndex].label : '点击选择' }}</view>
                </picker>
            </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>货物重量（吨）</view>
		        <input class="formInput__field formInput__field--right" type="number" v-model="weigh" placeholder="点击输入" placeholder-style="color: #999;"/>
		    </view>
			<view class="form__cell" @tap="_showDrawer('departure')">
			    <view class="form__label"><text class="form__wran">*</text>装货地</view>
			    <view :class="departure_ids ? 'form__field' : 'form__note'" >
			        {{departure_ids ? departure_na_str + (departure_harbor_na ? '-' + departure_harbor_na : '') : '点击选择'}}
			    </view>
			</view>
			<view class="form__cell" @tap="_showDrawer('target')">
			    <view class="form__label"><text class="form__wran">*</text>卸货地</view>
			    <view :class="target_ids ? 'form__field' : 'form__note'" >
			        {{target_ids ? target_na_str + (target_harbor_na ? '-' + target_harbor_na : '') : '点击选择'}}
			    </view>
			</view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>受载日期</view>
		        <picker mode="date" @change="_changeTime">
		            <view class="formInput__field--right" :class="empty_date ? 'form__field' : 'form__note'">{{empty_date ? empty_date : '点击选择'}}</view>
		        </picker>
		        <view class="form__interval">
		            ±<input class="formInput__field--interval" type="number" maxlength="2" v-model="empty_days" placeholder="输入" placeholder-style="color: #999;"/>天
		        </view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>承运单价（元/吨）</view>
		        <input class="formInput__field formInput__field--right" type="number" v-model="price" placeholder="请输入承运单价" placeholder-style="color: #999;"/>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>是否含税</view>
				<radio-group class="form__radio" @change="_setTax">
					<label>
						<radio color="#0091E6" style="transform:scale(0.7)" value="1" />
						含税
					</label>
					<label>
						<radio color="#0091E6" style="transform:scale(0.7)" value="0" :checked="true" />
						不含税
					</label>
				</radio-group>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>定金</view>
		        <input class="formInput__field formInput__field--right" type="number" v-model="earnest_money" placeholder="请输入定金" placeholder-style="color: #999;"/>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">备注</view>
		        <input class="formInput__field formInput__field--right" type="text" v-model="remark" placeholder="备注信息" placeholder-style="color: #999;"/>
		    </view>
		</view>
        <view class="foot">
            <view class="foot__cell foot__cell--main" @tap="_send()">
                提交报价
            </view>
        </view>
            
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="cargoTypeIndex"
         @onConfirm="_setCargoType" :pickerValueArray="cargoTypeList"></mpvue-picker>
			 
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
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
    
    import { router, toast } from '@/common/util.js';
    import { postSailOffer } from '@/service/getData.js';
    import { mapState, mapActions } from 'vuex';
    
    var globalTemp;
    
	export default {
        components: {
            uniIcons,
            mpvuePicker,
            uniDrawer,
            uniPopup,
            wlpGlobal
        },
		data() {
			return {
                height: 0,
                drawerVisible: false,
                is_departure: false,
                is_target: false,
				data: null,
                cargoTypeIndex: [0, 0],
				cargoTypeList: [],
                packingTypeList: [{'label':'请选择'}],
                packingTypeIndex: 0,
				departure_ids: '',
				departure_na: '',
				departure_na_str: '',
				departure_index: [],
                departure_harbor_id:  '',
                departure_harbor_na:  '',
				target_ids: '',
				target_na: '',
				target_na_str: '',
				target_index: [],
                target_harbor_id:  '',
                target_harbor_na:  '',
                contact: '',
                cargo_type: '',
                cargo_name: '',
                weigh: '',
                empty_date: '',
                empty_days: '',
                price: '',
                is_tax: 0,
                earnest_money: '',
                remark: '',
				companyArray: [{'name':'请选择'}],
				companyIndex: 0,
                is_popup: false,
                popupInput: ''
			};
		},
        computed: {
            ...mapState(['companyTempData', 'dictionaryTempData']),
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
        async onLoad(options) {
            if(options && options.id){
                toast.loading();
                this.data = options;
                
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
            }
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.is_popup) {
                this.is_popup = false;
            }
            if (this.$refs.mpvuePicker.showPicker) {
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
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        onHide() {
            if (this.is_popup) {
                this.is_popup = false;
            }
            if (this.drawerVisible) {
                this._hideDrawer();
            }
        },
        methods: {
            ...mapActions(['getReleaseCompany', 'getCargoType', 'getPackingType', 'getGlobal']),
			_changeCompany(e){
				let index = e.target.value
				this.companyIndex = index
				if (index > 0)
				{
					this.contact = this.companyArray[index].name;
				}
			},
			_changeCargoType(){
				this.$refs.mpvuePicker.show();
			},
			_setCargoType(e) {
			    this.cargo_name = e.label;
			    this.cargo_type = e.value[1];
			},
            _changePacking(e){
				let index = e.target.value;
                this.packingTypeIndex = index;
                this.data.packing_type = index == 0 ? '' : this.packingTypeList[index].val;
            },
            _portIn(e, value){
                if(this.is_departure){
                    this.departure_ids = e.id.join(',');
                    this.departure_na_str = e.name[e.name.length - 1];
                    this.departure_na = e.name[e.name.length - 1];
                    this.departure_index = e.index;
                    if(value !== '' && this.departure_na !== value) {
                        this.departure_harbor_na = value;
                        this.departure_na = value;
                    }else{
                        this.departure_harbor_na = '';
                    }
                }else if(this.is_target){
                    this.target_ids = e.id.join(',');
                    this.target_na_str = e.name[e.name.length - 1];
                    this.target_na = e.name[e.name.length - 1];
                    this.target_index = e.index;
                    if(value !== '' && this.target_na !== value) {
                        this.target_harbor_na = value;
                        this.target_na = value;
                    }else{
                        this.target_harbor_na = '';
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
                if(type === 'departure'){
                    this.is_departure = true;
                }else if(type === 'target'){
                    this.is_target = true;
                }
                this.drawerVisible = true;
            },
            _hideDrawer() {
                this.is_departure = false;
                this.is_target = false;
                this.drawerVisible = false;
            },
            _changeTime(e){
                this.empty_date = e.detail.value;
            },
            _setTax(e){
				this.is_tax = e.target.value;
            },
            _send(){
                let send = {
                    'sm_id': this.data.id,
                    'packing_type': this.packingTypeIndex == 0 ? '' : this.packingTypeList[this.packingTypeIndex].val,
                    'contact': this.contact,
                    'cargo_type': this.cargo_type,
                    'cargo_name': this.cargo_name,
                    'departure_ids': this.departure_ids,
                    'target_ids': this.target_ids,
                    'departure_na': this.departure_na,
                    'target_na': this.target_na,
                    'weigh': this.weigh,
                    'empty_date': this.empty_date,
                    'empty_days': this.empty_days,
                    'price': this.price,
                    'is_tax': this.is_tax,
                    'earnest_money': this.earnest_money,
                    'remark': this.remark,
                };
                if (send.contact == '')
                {
                	toast.show('请输入托运方名称');
                	return;
                }
                if (send.cargo_type == '')
                {
                	toast.show('请选择货物类型');
                	return;
                }
                if (send.packing_type == '')
                {
                	toast.show('请选择包装类型');
                	return;
                }
				if (send.departure_ids == '')
				{
					toast.show('请选择装货地');
					return;
				}
				if (send.target_ids == '')
				{
					toast.show('请输入目的地');
					return;
				}
                
                if (send.weigh == '')
                {
                	toast.show('请输入货物吨位');
                	return;
                }
                if (send.empty_date == '')
                {
                	toast.show('请选择装载日');
                	return;
                }
                if (send.empty_days == '')
                {
                	toast.show('请输入日期误差');
                	return;
                }
                if(send.price == '' || send.price == 0){
                	toast.show('请输入承运单价');
                	return;
                }
                if(send.earnest_money == ''){
                	toast.show('请输入定金');
                	return;
                }
                toast.loading('提交中，请稍后...');
                postSailOffer(send).then(res=>{
                    toast.hideLoading();
                    uni.showModal({
                        title: '提交报价',
                        content: res.message ? res.message : '提交成功！等待对方接受！',
                        showCancel: false,
                        success: function() {
                            router.navigateBack(2);
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '提交报价',
                        content: '提交失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding-bottom: 54px;
    }
    
    .form{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
    }
        
    .form__interval{
        @include flex(null, center);
        @include flex-self(keep);
        padding-right: $uni-spacing-row-base;
    }
    
    .formInput__field--interval{
        color: $uni-text-color-grey;
        width: 3em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
    }
    
    .formInput__field + uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
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
