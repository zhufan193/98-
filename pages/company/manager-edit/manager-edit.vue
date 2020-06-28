<template>
	<view class="page" :style="{'background-color': active === 0 ? '' : '#fff'}">
		<view class="search" v-if="active === 1">
		    <view class="search__title">
		        请输入原管理员手机验证码
		    </view>
            <view class="form">
                <view class="formInput">
                    <view class="formInput__left">
                        <image class="formInput__img" src="/static/icon/code.png" mode="aspectFit"></image>
                    </view>
                    <input class="formInput__field" 
                        type="number" 
                        confirm-type="next" 
                        :value="valueCode" 
                        placeholder="请输入验证码"
                        @input="bindCode" placeholder-style="color: #999;"/>
                    <view class="formInput__code" @tap="sendCode">
                        {{ inputCheckCode }}
                    </view>
                </view>
                <view class="info__error" :class="{'color__error': message !== '查找中...'}" v-if="!is_data && message !== ''">
                    *{{message}}
                </view>
            </view>
		</view>
		<view class="search" v-if="active === 0">
		    <view class="search__title">
		        请输入新管理员手机号
		    </view>
            <view class="search__info">
                <image class="search__error" src="../../../static/icon/error.png" mode="aspectFit"></image>
                新的管理员必须先在该平台完成实名认证，企业管理员拥有最高权限请务必确认信息！
            </view>
            <view class="form">
                <view class="formInput">
                    <view class="formInput__left">
                        <image class="formInput__img" src="/static/icon/phone.png" mode="aspectFit"></image>
                    </view>
                    <input class="formInput__field" 
                        type="number" 
                        confirm-type="next" 
                        :value="valuePhone" 
                        placeholder="请输入手机号"
                        maxlength="11" 
                        @input="bindPhone" placeholder-style="color: #999;"/>
                    <view class="uni-icon uni-icon-clear" v-if="showClearPhone" @click="clearIconPhone"></view>
                </view>
                <view class="info__error" :class="{'color__error': message !== '查找中...'}" v-if="!is_data && message !== ''">
                    *{{message}}
                </view>
            </view>
		</view>
	    <view v-if="is_data">
	        <view class="info__head">
                确认相关信息
	        </view>
	        <view class="form">
	            <view class="form__cell">
	                <view class="form__label">
	                    手机号
	                </view>
	                <view class="form__note">
	                    {{data.phone}}
	                </view>
	            </view>
	            <view class="form__cell">
	                <view class="form__label">
	                    姓名
	                </view>
	                <view class="form__note">
	                    {{data.name}}
	                </view>
	            </view>
	            <view class="form__cell">
	                <view class="form__label">
	                    性别
	                </view>
	                <view class="form__note">
	                    {{data.sex == 1 ? '男' : '女'}}
	                </view>
	            </view>
	        </view>
	    </view>
        <view class="foot">
            <button v-if="active === 0" :disabled="!is_data" class="foot__btn" type="primary" @tap="_clickNext()">下一步</button>
            <button v-else :disabled="valueCode.length === 0" class="foot__btn" type="primary" @tap="_sendBtn()">确认更换企业管理员</button>
        </view>
	</view>
</template>

<script>
    import { router, toast, check, debounce } from '@/common/util.js';
    import { postCompanySearchStaff, postCompanyManagerCode, postCompanyManagerConfirm } from '@/service/getData.js';
    
    import { mapMutations } from 'vuex';
    
	export default {
		data() {
			return {
                active: 0,
                is_data: false,
                message: '',
                company_id: null,
				data: {
                    id: null,
                    phone: '',
                    name: '',
                    sex: 1
                },
                valuePhone: '',
                valuePhoneOld: '',
                showClearPhone: false,
                secCodekey: '',
                valueCode: '',
                inputCheckCode: '获取验证码'
			};
		},
        onLoad(options) {
            if(options){
                this.company_id = options.company_id;
                if(options.phone){
                    this.valuePhoneOld = options.phone;
                }
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val === '' && val === vm.phone){
                    return;
                }
                if(check.phone(val)){
                    if(val === vm.valuePhoneOld){
                        vm.message = '当前号码已是该企业管理员！';
                        return;
                    }
                    vm.getData(val);
                }else{
                    vm.message = '请输入正确电话号码！';
                }
            }, 1000, false),
            bindPhone(e) {
                let val = e.detail.value;
                this.is_data = false;
                if(val !== ''){
                    this.showClearPhone = true;
                    this._searchChange(this, val);
                }else{
                    this.showClearPhone = false;
                }
            },
            clearIconPhone() {
                this.message = '';
                this.valuePhone = '';
                this.is_data = false;
                this.showClearPhone = false;
            },
            bindCode(e) { // 验证码绑定
				this.valueCode = e.target.value;
            },
            getData(phone) {
                this.message = '查找中...';
                postCompanySearchStaff({company_id: this.company_id, phone: phone}).then(res => {
                    if(res.data === ''){
                        this.message = '未查询到该信息！';
                        this.is_data = false;
                    }else{
                        this.valuePhone = phone;
                        this.is_data = true;
                        this.data = res.data;
                    }
                }, err => {
                    this.message = err.message;
                    this.is_data = false;
                });
            },
            // 发送验证码
            sendCode(){
                if (this.inputCheckCode != '获取验证码' && this.inputCheckCode != '重新发送验证码') {
                    toast.show('操作过于频繁！');
                    return;
                }
                var than = this;
				var inputCheckCodeNum = 60;
                toast.loading('获取验证码...');
				postCompanyManagerCode(this.company_id).then(res => {
                    toast.hideLoading();
                    this.message = '';
					this.secCodekey = res.data.sec_key;
// 短信接口未开 直接打印
// toast.show('短信接口未开,直接填写');
// this.secCodekey = 'secCode_123456';
// this.valueCode = '123456';
				},err => {
                    toast.hideLoading();
                    this.message = err.message;
                });
				than.inputCheckCode = inputCheckCodeNum + 's后重新发送';
				//倒计时
				var clock = setInterval(function() {
					inputCheckCodeNum--;
					than.inputCheckCode = inputCheckCodeNum + 's后重新发送';
					if (inputCheckCodeNum < 0) { //当倒计时小于0时清除定时器
						clearInterval(clock);
						than.inputCheckCode = '重新发送验证码';
						inputCheckCodeNum = 60;
					}
				}, 1000);
            },
            _clickNext() {
                if(this.active == 0){
                    this.active++;
                    this.message = '';
                    this.is_data = false;
                }
            },
            _sendBtn() {
                toast.loading('发送验证码...');
                postCompanyManagerConfirm({company_id: this.company_id, user_id: this.data.id, phone: this.valuePhone, sec_key: this.secCodekey, sec_code: this.valueCode}).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'companyManagerEdit', companyManagerEdit: true});
                    uni.showModal({
                        title: '更换企业管理员',
                        content: '提交成功!',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack({delta: 2});
                        }
                    })
                }, err => {
                    toast.show(err.message);
                    this.message = err.message;
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    page, .page{
        height: 100%;
    }
    
    .page{
        padding: 0 0 44px;
    }
    
    .search{
        background-color: #fff;
        padding: $uni-spacing-col-base * 4 0;
        
        &__title{
            font-size: 23px;
            text-align: center;
            color: $uni-text-color;
            
            &+.form{
                margin-top: $uni-spacing-col-base * 2;
            }
        }
        
        &__info{
            @include flex(between, center);
            width: 75%;
            margin: 0 auto;
            color: $uni-color-error;
            font-size: 11px;
        }
        
        &__error{
            width: $uni-img-size-base * 2;
            height: $uni-img-size-base * 2;
        }
    }
    
    .info__head{
        font-size: 11px;
        color: #777;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
    }
    
    .info__error{
        font-size: 11px;
        color: #777;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        width: 75%;
        margin: 0 auto;
    }
    
    .color__error{
        color: $uni-color-error;
    }
    
    .form{
        background-color: #fff;
    }
    
    .formInput{
        width: 75%;
        margin: 0 auto;
    }

</style>
