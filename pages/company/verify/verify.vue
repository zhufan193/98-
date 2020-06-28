<template>
	<view class="page">
        <view class="card card--full" v-if="review_state == 3 && data.review_state">
            <view class="card__content">
                <view class="card__info card__info--red">
                    审核失败：{{data.review_reason}}
                </view>
            </view>
        </view>
		<view class="card card--full">
            <view class="card__head">
                <text class="card__title">基础资料-必填</text>
            </view>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">企业类型</view>
                    <view v-if="is_edit" class="form__field">
                        {{data.type_na}}
                    </view>
                    <picker v-else mode="selector" :range="companyTypeArray" range-key="name" :value="companyTypeIndex" @change="_changeCompanyType">
                        <view :class="companyTypeIndex != 0 ? 'form__field' : 'form__note'">{{companyTypeArray[companyTypeIndex].name}}</view>
                    </picker>
                </view>
                <view class="form__cell" style="position: relative;">
                    <view class="form__label">认证方式</view>
                    <radio-group class="form__radio" @change="_radioChange">
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="2" :checked="data.entrust_mode == 2" />企业授权
                        </label>
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="1" :checked="data.entrust_mode == 1" />申请为法人
                        </label>
                    </radio-group>
                    <view v-if="is_edit" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></view>
                </view>
                <view class="form__cell">
                    <view class="form__label">企业名称</view>
                    <input class="formInput__field formInput__field--right" v-model="data.name" :disabled="is_edit" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" v-show="data.entrust_mode == 2">
                    <view class="form__label">企业法人</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="data.legal_person" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="data.business_call" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" @tap="_showCityPicker()">
                    <view class="form__label">所属省市</view>
                    <view :class="provinces ? 'form__field' : 'form__note'">
                        {{provinces ? provinces : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">详细地址</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="data.addrs" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
            </view>
		</view>
        <view class="card card--full">
            <view class="card__head">
                <view class="card__title">
                    上传相关证明
                </view>
		        <view class="card__helper" @tap="_goPage('/pages/common/rich-text/rich-text?type=company_sample')">
		            <view class="card__badge--btn">
		                查看范本
		            </view>
		        </view>
            </view>
            <view class="card__content idcard">
                <view class="idcard__cell">
                    <view v-if="business_license != ''" class="idcard__img">
                        <view v-if="!is_edit" class="idcard__close" @tap="_closeImg('business_license')"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                        <image class="idcard__picture" @tap="_previewImg(0)" :src="business_license" mode="aspectFill"></image>
                    </view>
                    <view v-else class="idcard__img card__center" @tap="_chooseImg('business_license')">
                        点击添加
                    </view>
                    <view class="idcard__txt">企业营业执照</view>
                </view>
                <view class="idcard__cell" v-show="data.entrust_mode == 2">
                    <view v-if="entrust_license != ''" class="idcard__img">
                        <view v-if="!is_edit" class="idcard__close" @tap="_closeImg('entrust_license')"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                        <image class="idcard__picture" @tap="_previewImg(1)" :src="entrust_license" mode="aspectFill"></image>
                    </view>
                    <view v-else class="idcard__img card__center" @tap="_chooseImg('entrust_license')">
                        点击添加
                    </view>
                    <view class="idcard__txt">企业授权委托书</view>
                </view>
            </view>
            <view class="card__foot">
                <view class="form__cell">
                    <view class="form__label" style="width: 220rpx;">{{data.entrust_mode == 2 ? '授权过期时间' : '营业执照有效期'}}</view>
                    <view v-if="is_edit" class="form__field">
                        {{data.expire_at}}
                    </view>
                    <picker v-else mode="date" @change="_changeTime" >
                        <view :class="data.expire_at ? 'form__field' : 'form__note'">{{data.expire_at ? data.expire_at : '点击选择'}}</view>
                    </picker>
                </view>
            </view>
        </view>
        <view class="card card--full" v-if="!is_edit">
            <view class="checked">
                <label class="checked__field" style="width: auto;" @click="_checked">
                    <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                    我已阅读并同意
                </label>
                <view class="link" @click="_goPage('/pages/common/rich-text/rich-text?type=company_verify')">
                    《运有方企业认证规则》
                </view>
            </view>
        </view>
        
        <view class="foot" v-if="review_state != 3 && id == null">
            <button class="foot__btn" type="primary" @click="sendBtn()">提交认证</button>
        </view>
        <view class="foot" v-else>
            <button v-if="data.review_state != 3" class="foot__btn" type="warn" @tap="_verifyCencel()">取消认证</button>
            <button v-if="data.review_state != 2" class="foot__btn" type="primary" @tap="_edit">{{is_edit ? '编辑' : '重新提交认证'}}</button>
        </view>
        
        <mpvue-city-picker ref="mpvuePicker" :deepLength="3" :pickerValueDefault="pickerValueIndex"
         @onConfirm="_onConfirm" @onCancel="_onCancel"></mpvue-city-picker>
        
        <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" />
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvueCityPicker from '../components/mpvue-citypicker/mpvueCityPicker.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast, check, localStorage } from '@/common/util.js';
    import { getCompanyVerifyDetail, uploadPic, postCompanyVerify, postCompanyVerifyCancel } from '@/service/getData.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            mpvueCityPicker,
            cpimg
        },
		data() {
			return {
                id: null,
                review_state: null,
                is_edit: false,
                is_chacked: true,
                data: {
                    type: null,
                    type_na: '',
                    entrust_mode: 2,
                    name: '',
                    legal_person: '',
                    business_call: '',
                    province_id: '',
                    city_id: '',
                    area_id: '',
                    area_text: '',
                    addrs: '',
                    business_license: '',
                    business_license_str: '',
                    entrust_license: '',
                    entrust_license_str: '',
                    expire_at: '',
                    review_state: null,
                    review_reason: ''
                },
                provinces: '',
				business_license: '',
                is_business_license: null,
				entrust_license: '',
                is_entrust_license: null,
                companyTypeArray: [{name:'请选择'}],
                companyTypeIndex: 0,
                pickerValueIndex: []
			};
		},
        computed: mapState(['dictionaryTempData', 'userAddressId', 'userAddressIndex']),
        onLoad(options) {
            toast.loading('加载中');
            if(options && options.id){
                this.id = options.id;
                this.review_state = options.review_state;
                getCompanyVerifyDetail(this.id).then(res => {
                    this.is_edit = true;
                    this.data = res.data;
                    this.business_license = this.data.business_license_str[0];
                    this.is_business_license = true;
                    this.entrust_license = this.data.entrust_license_str[0];
                    this.is_entrust_license = true;
                    this.provinces = this.data.area_text;
                    toast.hideLoading();
                }, err => {
                    console.log(err)
                })
            }else{
                this._getSelect();
            }
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                this.$refs.mpvuePicker.pickerCancel();
                return true;
            }
        },
		onUnload() {
            // 退出前关闭选择器
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        methods:{
            ...mapActions(['getDictCompany', 'getLocation', 'getUserAddresId', 'getProvince', 'getCity', 'getArea']),
            ...mapMutations(['ADDRESS_INDEX_UPDATA', 'PAGE_TEMP_ADD']),
            _goPage(url){
                router.navigateTo(url);
            },
            _edit(){
                if(this.is_edit){
                    toast.loading();
                    this._getSelect('edit');
                }else{
                    this.sendBtn();
                }
            },
            async _getSelect(type = 'init'){
                await this.getDictCompany();
                this.companyTypeArray = this.companyTypeArray.concat(this.dictionaryTempData.dict_company);
                await this.getProvince();
                await this.getCity();
                await this.getArea();
                toast.hideLoading();
                if(type === 'init'){
                    if(this.userAddressId.province === undefined){
                        await this.getLocation();
                        await this.getUserAddresId();
                        this.ADDRESS_INDEX_UPDATA();
                    }
                    this.pickerValueIndex = [this.userAddressIndex.province, this.userAddressIndex.city, this.userAddressIndex.area];
                }else{
                    for(let i = 0, len = this.companyTypeArray.length; i < len; i++){
                        if(this.companyTypeArray[i].id == this.data.type){
                            this.companyTypeIndex = i;
                            break;
                        }
                    }
                    let provinces = [0, 0, 0];
                    let provinceData = JSON.parse(localStorage.getStore('region_province'));
                    for(let i = 0, len = provinceData.length; i < len; i++){
                        if(provinceData[i].id == this.data.province_id){
                            provinces[0] = i;
                            break;
                        }
                    }
                    if(this.data.city_id !== 0){
                        let cityData = JSON.parse(localStorage.getStore('region_city'));
                        for(let i = 0, len = cityData[this.data.province_id].children.length; i < len; i++){
                            if(cityData[this.data.province_id].children[i].id == this.data.city_id){
                                provinces[1] = i;
                                break;
                            }
                        }
                    }
                    if(this.data.area_id !== 0){
                        let areaData = JSON.parse(localStorage.getStore('region_area'));
                        for(let i = 0, len = areaData[this.data.city_id].children.length; i < len; i++){
                            if(areaData[this.data.city_id].children[i].id == this.data.area_id){
                                provinces[2] = i;
                                break;
                            }
                        }
                    }
                    this.pickerValueIndex = provinces;
                    this.is_edit = false;
                }
            },
            _showCityPicker() {
                if(this.is_edit) return;
                this.$refs.mpvuePicker.show();
            },
            _onCancel(e) {
                this.pickerValueIndex = [this.userAddressIndex.province, this.userAddressIndex.city, this.userAddressIndex.area];
                this.data.province_id = '';
                this.data.city_id = '';
                this.data.area_id = '';
                this.provinces = '';
            },
            _onConfirm(e) {
                this.pickerValueIndex = e.index;
                this.data.province_id = e.province_id;
                this.data.city_id = e.city_id;
                this.data.area_id = e.area_id;
                this.provinces = e.provinces;
            },
            _previewImg(index) { //预览图片
                let images = [];
                if(this.entrust_license != '' && this.data.entrust_mode == 2){
                    images.unshift(this.entrust_license);
                }
                if(this.business_license != ''){
                    images.unshift(this.business_license);
                }
                uni.previewImage({
                    urls: images,
					current: images[index],
                    loop: true
                });
            },
            _chooseImg(type) { //选择图片
                this.$refs.cpimg._changImg(type);
            },
            cpimgOk(file) {
                if(file.urlType === 'business_license'){
                    this.business_license = file.data[0];
                    this.is_business_license = false;
                }else if(file.urlType === 'entrust_license'){
                    this.entrust_license = file.data[0];
                    this.is_entrust_license = false;
                }
            },
            cpimgErr(e) {
                toast.show(e);
            },
            _closeImg(e){
                if(e === 'business_license'){
                    this.business_license = '';
                    this.is_business_license = null;
                }else if(e === 'entrust_license'){
                    this.entrust_license = '';
                    this.is_entrust_license = null;
                }
            },
            _changeCompanyType(e){
                this.companyTypeIndex = e.detail.value;
            },
            _radioChange(e){
                this.data.legal_person = '';
                this.entrust_license = '';
                this.$set(this.data, 'entrust_mode', e.detail.value);
            },
            _changeTime(e){
                this.$set(this.data, 'expire_at', e.detail.value);
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            sendBtn(){
                let send = this.data;
                if(this.companyTypeIndex == 0){
                    toast.show('请选择企业类型！');
                    return;
                }
                if(!check.phone(send.business_call)){
                    if(send.business_call.length === 7){
                        toast.show('座机号码请加上区号！');
                        return;
                    }
                    toast.show('电话格式错误！');
                    return;
                }
                if(this.provinces == ''){
                    toast.show('请选择省市区！');
                    return;
                }
                if(send.name == '' || send.addrs == '' || (send.legal_person == '' && send.entrust_mode == 2)){
                    toast.show('请补全基础资料！');
                    return;
                }
                if(this.business_license == ''){
                    toast.show('请选择营业执照！');
                    return;
                }
                if(this.entrust_license == '' && send.entrust_mode == 2){
                    toast.show('请选择委托认证书！');
                    return;
                }
                if(send.expire_at == ''){
                    toast.show(send.entrust_mode == 2 ? '请选择授权过期时间' : '请选择营业执照有效期');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《运有方企业认证规则》！');
                    return;
                }
                send.type = this.companyTypeArray[this.companyTypeIndex].id;
                send.type_na = this.companyTypeArray[this.companyTypeIndex].name;
                send.area_text = this.provinces;
                let is_i = 0, is_num = 0;
                if(this.is_business_license === false) is_num ++;
                if(this.is_entrust_license === false) is_num ++;
                if(is_num === 0){
                    this.sendData(send);
                    return;
                }
                if(this.is_business_license === false){
                    send.business_license = '';
                    uploadPic(this.business_license, {}).then(res => {
                        send.business_license = res.data.source;
                        this.is_business_license = true;
                        is_i++;
                        if(is_i == is_num){
                            this.sendData(send);
                        }
                    }, err => {
						if (err.status == 0)
						{
							toast.show(err.message)
						}
                        console.log(err);
                    });
                }
                if(this.is_entrust_license === false){
                    send.entrust_license = '';
                    uploadPic(this.entrust_license, {}).then(res => {
                        send.entrust_license = res.data.source;
                        this.is_entrust_license = true;
                        is_i++;
                        if(is_i == is_num){
                            this.sendData(send);
                        }
                    }, err => {
						if (err.status == 0){
							toast.show(err.message)
						}
                        console.log(err);
                    });
                }
            },
            sendData(data) {
                toast.loading('提交中...');
                postCompanyVerify(data).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'companyVerify', companyVerify: true});
                    uni.showModal({
                        title: '提交公司认证',
                        content: res.message ? res.message : '提交成功，我们最迟将在三个工作日内为您审核！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
					if (err.status == 0){
						toast.show(err.message)
					}
                    // console.log(err)
                });
            },
            _verifyCencel() {
                // 取消认证申请
                let that = this;
                uni.showModal({
                    content: '是否取消认证！',
                    success: function(e) {
                        if(e.confirm){
                            postCompanyVerifyCancel(that.id).then(res => {
                                that.PAGE_TEMP_ADD({field: 'companyVerify', companyVerify: true});
                                toast.show('取消成功');
                                uni.navigateBack();
                            });
                        }
                    }
                })
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 0 0 44px;
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
        
        .card__center{
            @include flex(center, center);
        }
    }
    
    .card__foot{
        position: relative;
        
        &::before{
            @include hr(top, $uni-spacing-row-base);
        }
    }
    
    .checked{
        @include flex(null, center);
        padding: 0 $uni-spacing-row-base;
        
        &__field{
            @include flex(null, center);
            height: 88rpx;
        }
    }
    
    .link{
        color: $color-sub;
    }
</style>
