<template>
	<view class="page">
       <!-- <template v-if="userInfo.is_realname"> -->
	   <template v-if="true">
            <view class="card card--full form__list">
                
				<view class="form__cell" @tap="_changeCargoType()">
                    <view class="form__label"><text class="form__wran">*</text>船舶名称</view>
                    <view> <input class="uni-input common-right" v-model="data.cname"  placeholder="请输入船舶名称" /></view>
                </view>
              
				<view class="form__cell">
			        <view class="form__label"><text class="form__wran">*</text>MMSI</view>
			        <view> <input class="uni-input common-right"  placeholder="请输入MMSI" /></view>
			    </view>
				
				<view class="form__cell">
			  		<view class="form__label"><text class="form__wran">*</text>船长（米）</view>
			  		<view> <input class="uni-input common-right" placeholder="请输入船长（米）" /></view>
			  	</view>
			  				
				<view class="form__cell">
			  		<view class="form__label"><text class="form__wran">*</text>船宽（米）</view>
			  		<view> <input class="uni-input common-right"  placeholder="请输入船宽（米）" /></view>
			  	</view>
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>吃水（米）</view>
					<view> <input class="uni-input common-right" placeholder="请输入吃水（米）" /></view>
				</view>
							
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>载重（吨）</view>
					<view> <input class="uni-input common-right" placeholder="请输入载重（吨）" /></view>
				</view>
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>船主姓名</view>
					<view> <text class="uni-input common-right" >姓名</text></view>
				</view>
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>手机号码</view>
					<view> <text class="uni-input common-right" >111111111</text></view>
				</view>
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>QQ</view>
					<view>
						<input class="uni-input common-right"  placeholder="请输入QQ" />
					</view>	
				</view>
				
				<view class="form__cell">
				    <view class="form__label"><text class="form__wran">*</text>船型</view>
				    <view> 
						<picker @change="bindPickerChangea" :value="indexa" :range="arraya"> 
				  			<view class="uni-input common-right" >{{arraya[indexa]}}</view>
						</picker>
					</view>
				</view>  
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>航线类型</view>
					<view> 
						<picker @change="bindPickerChangeb" :value="indexb" :range="arrayb"> 
							<view class="uni-input common-right" >{{arrayb[indexb]}}</view>
						</picker>
					</view>
				</view>  
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>封仓形式</view>
					<view> 
						<picker @change="bindPickerChangec" :value="indexc" :range="arrayc"> 
			   				<view class="uni-input common-right" >{{arrayc[indexc]}}</view>
						</picker>
					</view>
			   </view> 			  
               
			   <view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>所在省市</view>
					<view>
				  <view  @click="go"  v-bind:id="index"  v-if="isout" style="font-size: 30upx;">请选择所在省市</view>
				<view  @click="go" v-if="!isout">{{provinc}}</view>
			     </view> </view>	
						   <view v-if="isgo">
							<province-picker style="font-size: 30upx;" :isgo.sync="isgo" v-on:greet="_isgo" v-on:provinc="getProvince">
							</province-picker></view>
					
			  	   
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>挂靠公司</view>
					<view> <input class="uni-input common-right" placeholder="请输入挂靠公司" /></view>
				</view>
				
				<view class="form__cell">
					<view class="form__label"><text class="form__wran">*</text>公司电话</view>
					<view> <input class="uni-input common-right"   placeholder="请输入公司电话" /></view>
				</view>
				
				<view class="card card--full">
				    <view class="card__head">
				        <view class="card__title">
				            船舶主要项目
				        </view>
				    </view>
					
				    <view class="card__content idcard">
				        
						<view class="idcard__cell">
				            <view class="idcard__img">
				                <view class="idcard__close" v-if="idcard_img[0].path != '' && review_state == 2" @tap="_closeImage(0)"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
				                <image class="idcard__picture" @tap="_chooseImage(0)" :class="{'idcard__picture--left': idcard_img[0].orientation != 'up'}" :src="idcard_img[0].path ? idcard_img[0].path : '/static/img/id_card_img.png'" mode="aspectFill"></image>
				            </view>
				            <view class="idcard__txt">点击上传</view>
				        </view>
						
						
				    </view>
				 </view>
				 <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" />
				
				


				<view class="card__content">
					<textarea class="form__textarea" placeholder="请输入补充说明"  placeholder-style="color: #999;"  auto-height />
				</view>
           </view>
			
        <view class="foot">
            <button class="foot__btn" type="primary" @click="sendBtn">提交发布信息</button>
        </view>
       </template>

	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
	import adDeharbor from '@/components/ad-deharbor/ad-deharbor.vue'; 
	import provincePicker from '@/components/province-picker/province-picker.vue'; 
	import cpimg from "@/components/cpimg/cpimg.vue"; 
	
    import { router, toast, check } from '@/common/util.js';
    import { postPallet } from '@/service/getData.js';
    import { mapState, mapActions } from 'vuex';


    var globalTemp;
	var photo;
    
	export default {
        components: {
            uniIcons,
            mpvuePicker,
            uniDrawer,
            uniPopup,
            wlpGlobal,
			adDeharbor,
			provincePicker,
			cpimg
        },
		data() {
			return {
				photoSrc: '',
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
					'cname':''  ,//船舶名称
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
				indexa:0,//船舶类型的选择
				indexb:0,//航运类型的选择
				indexc:0,//封仓形式的选择
				arraya:['请选择船舶类型','散货船', '散装水泥船','杂货船','集装箱船','拖队','油船','化学品船','液化气船','滚装船','多用途船','捕捞船','冷藏船','其他船'],
				arrayb:['请选择航运类型','长江-内河','江海联运','海运'],
				arrayc:['请选择封仓形式','无封仓','简易封仓','自动封仓'],
				is_popupShow: false,  //是否显示单选按钮
				radiovalue: '', //0是相机 1是文件
				isgo:false,
				isout:true,
				provinc:'',
				idcard_img: [{
				    path: '',
				    orientation: 'up'
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
			//选择图片
			_chooseImage(index) {   
			    let that = this;
			    if(this.idcard_img[index].path == ''){
			        this.$refs.cpimg._changImg(index);
			    }else{
			        // 查看图片
			        uni.previewImage({
			            current: 0,
			            urls: [this.idcard_img[index].path]
			        });
			    }
			},
			//组件cpimg返回的文件结果
			cpimgOk(file) {
			    this.idcard_img[file.urlType].path = file.data[0];
			    this.getImageInfo(file.urlType);
			},
			//cpimg返回的错误原因
			cpimgErr(e) {
			    toast.show(e);
			},
			//用于cpimg返回的正确结果的处理，获取图片信息
			getImageInfo(index) {
			    let that = this;
			    uni.getImageInfo({
			        src: that.idcard_img[index].path,
			        success: function(info) {
			            if(info.width < info.height){
			                that.idcard_img[index].orientation = 'left';
			            }
			        }
			    })
			},
			_closeImage(index) {
			    this.idcard_img[index].path = '';
			    this.idcard_img[index].orientation = 'up';
			},
			//用于获得包装形式
			bindPickerChangea: function(e) {
			            this.indexa = e.target.value;
			        },
			//用于获得航运类型
			bindPickerChangeb: function(e) {
					    this.indexb = e.target.value;
					},
			//用于获得包装形式
			bindPickerChangec: function(e) {
			            this.indexc = e.target.value;
			        },
			go(){
				this.isgo=true;
				console.log("dadfasf");
				this.isout=true;
			},
			photopush(){
				this.is_popupShow = true;
			},
			_isgo(isgo){
				this.isgo=isgo;
			},
			getProvince(province){
				this.provinc=province;
				this.isout=false;
				
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
            sendBtn() {
				console.log('船舶名称:'+this.data.cname);
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

	.info{
	    padding: $uni-spacing-col-base $uni-spacing-row-base;
	    background-color: #fff;
	    text-align: center;
	    
	    &__txt{
	        font-size: 24rpx;
	        color: $uni-color-error;
	    }
	}
	
	.form{
	    align-items: inherit;
	    box-sizing: border-box;
	    padding: $uni-spacing-col-lg 0 44px;
	}
	
	.formInput{
	    margin-bottom: 0;
	}
	
	.idcard{
	    @include flex(between);
	    
	    &__cell{
	        width: 320upx;
	    }
	    
	    &__img{
	        position: relative;
	        width: 308upx;
	        height: 228upx;
	        border-radius: $uni-border-radius-sm;
	        margin-bottom: $uni-spacing-col-sm;
	        border: 1px dashed $uni-border-color;
	    }
	    
	    &__picture{
	        position: absolute;
	        top: 0;
	        left: 0;
	        display: block;
	        width: 308upx;
	        height: 228upx;
	        
	        &--left{
	            width: 228upx;
	            height: 308upx;
	            transform-origin: top left;
	            transform: rotate(90deg) translateY(-308upx);
	        }
	    }
	    
	    &__close{
	        position: absolute;
	        top: $uni-spacing-col-sm;
	        right: $uni-spacing-row-sm;
	        z-index: 999;
	    }
	    
	    &__txt{
	        text-align: center;
	        font-size: $uni-font-size-sm;
	        color: $uni-text-color-grey;
	    }
	}
	
	.link{
	    color: $color-sub;
	}
    
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
	
	.common-right{
		margin-top: -20upx;
		text-align: right;
	}
	.show-button{
		font-size: 28upx;
		margin-right: 20upx;
		background-color: #0091E6;
		color: #ffffff;
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
	}
</style>

