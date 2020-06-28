<template>
	<view class="page">
        <uni-status-bar></uni-status-bar>
        <view class="close" @tap="close">
            <uni-icons type="closeempty" color="#999" size="44"></uni-icons>
        </view>
        <view class="form">
            <view class="form__head">
                {{list[active]}}
            </view>
            <view class="form__cell--column" v-if="active == 0">
                <view class="form__label">
                    手机号
                </view>
                <view class="formInput">
                    <view class="formInput__left">
                        <image class="formInput__img" src="/static/icon/phone.png" mode="aspectFit"></image>
                    </view>
                    <input class="formInput__field" 
                        type="number" 
                        confirm-type="next" 
                        :value="valuePhone" 
                        placeholder="请输入手机号"
                        @input="bindPhone" />
                    <view class="uni-icon uni-icon-clear" v-if="showClearPhone" @click="clearIconPhone"></view>
                </view>
            </view>
            <view class="numbox" v-if="active == 1">
                <view class="numbox__main">
                    <block v-for="(item, index) in resValueCode" :key="index">
                        <view class="numbox__item">
                            {{item}}
                        </view>
                    </block>
                </view>
                <input class="numbox__field" type="number" maxlength="6" :value="valueCode" @input="bindCode" />
            </view>
            <view class="form__cell--column" v-if="active == 2">
                <view class="form__label">
                    密码
                </view>
                <view class="formInput" v-if="active == 2">
                    <view class="formInput__left">
                        <image class="formInput__img" src="/static/icon/pwd.png" mode="aspectFit"></image>
                    </view>
                    <input class="formInput__field" 
                        type="text" 
                        confirm-type="next" 
                        :value="valuePwd" 
                        placeholder="请设置6-12位登录密码"
                        @input="bindPwd" />
                    <view class="uni-icon uni-icon-clear" v-if="showClearPwd" @click="clearIconPwd"></view>
                </view>
            </view>
            <view class="pageTips" :class="{'pageTips--error': messageTxt == '请输入正确手机号！'}">
                {{messageTxt}}
            </view>
            <button class="btn" type="primary" v-if="active == 0 || active == 2 || active == 3" @tap="_clickBtn">{{active == 0 ? '发送验证码' : active == 3 ? '完成' : '提交'}}</button>
            <view class="btn--switch" @tap="_clickBtnCode" v-if="active == 1">
                {{inputCheckCode}}
            </view>
        </view>
	</view>
</template>

<script>
    import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue'
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    
    import { router, toast, check } from '@/common/util.js';
	import { postSecCode, postForgetPwd } from '@/service/getData';
    import { mapState, mapMutations } from 'vuex';

	export default {
		components: {
            uniStatusBar,
            uniIcons
		},
		data() {
			return {
				active: 0,
				list: ['忘记密码', '请输入验证码', '请设置新密码', '密码修改成功'],
                valuePhone: '', // 手机号
                showClearPhone: false,
                valuePwd: '',
                showClearPwd: false,
                valueCode: '', // 验证码
                messageTxt: '', // 错误提示
                inputCheckCode: '重新发送验证码', // 验证码计时显示
                secCodekey: '', // 验证码校验码
			};
		},
        computed: {
            ...mapState(['code_key']),
            resValueCode() {
                return [this.valueCode.charAt(0),this.valueCode.charAt(1),this.valueCode.charAt(2),this.valueCode.charAt(3),this.valueCode.charAt(4),this.valueCode.charAt(5)]
            }
        },
        methods: {
            ...mapMutations(['RECORD_USERINFO']),
            goPage(link){
                router.navigateTo(link);
            },
            bindPhone(e) { // 手机号绑定
                this.valuePhone = e.target.value;
				if (e.target.value.length > 0) {
					this.showClearPhone = true;
                    if(check.phone(this.valuePhone) && this.messageTxt == '请输入正确手机号！'){
                        this.messageTxt = '';
                    }
				} else {
					this.showClearPhone = false;
				}
            },
            clearIconPhone() {
                this.valuePhone = '';
                this.showClearPhone = false;
            },
            bindCode(e) { // 验证码绑定
				if (e.target.value.length <= 6) {
                    this.valueCode = e.target.value;
                    if (this.valueCode.length == 6){
                        this.active++;
                        this.messageTxt = '';
                    }
				}
            },
            bindPwd(e) { // 密码绑定
                this.valuePwd = e.target.value;
				if (e.target.value.length != '') {
					this.showClearPwd = true;
                    let str = check.password(this.valuePwd)
                    if(str == ''){
                        this.messageTxt = '';
                    }else{
                        this.messageTxt = str;
                    }
				}
            },
            clearIconPwd() {
                this.valuePwd = '';
                this.showClearPwd = false;
            },
            _clickBtn() {
                if(this.active == 0){
                    if(!check.phone(this.valuePhone)){
                        this.messageTxt = '请输入正确手机号！';
                    }
                    this._clickBtnCode();
                    return;
                }else if(this.active == 1){
                    this._clickBtnCode();
                    return;
                }else if(this.active == 2){
                    let str = check.password(this.valuePwd)
                    if(str != ''){
                        this.messageTxt = str;
                        return;
                    }
                    toast.loading();
                    postForgetPwd({account: this.valuePhone, sec_key: this.secCodekey, sec_code: this.valueCode, password: this.valuePwd}).then(res => {
                        toast.hideLoading();
                        this.RECORD_USERINFO({field: 'phone', phone: this.valuePhone});
                        this.active++;
                    },err => {
                        toast.hideLoading();
                        this.active--;
                        this.messageTxt = err.message;
                    });
                    return;
                }
                // 完成
                router.navigateBack();
            },
            // 发送验证码
            _clickBtnCode() {
                // 发送次数过于频繁，请稍后再试。
                if (this.inputCheckCode != '重新发送验证码') {
                    toast.show("操作过于频繁！");
                    return;
                }
                toast.loading('发送验证码...');
                postSecCode({account: this.valuePhone, check_key: this.code_key}).then(res => {
                    toast.hideLoading();
                	this.secCodekey = res.data.sec_key;
// 短信接口未开 直接打印
// toast.show('短信接口未开,直接填写');
// this.valueCode = res.data.code;
                    if(this.active == 0) this.active++;
                    let inputCheckCodeNum = 60;
                    this.inputCheckCode = inputCheckCodeNum + 's后重新发送';
                    //倒计时
                    let than = this;
                    var clock = setInterval(function() {
                        inputCheckCodeNum--;
                        than.inputCheckCode = inputCheckCodeNum + 's后重新发送';
                        if (inputCheckCodeNum < 0) { //当倒计时小于0时清除定时器
                            clearInterval(clock);
                            than.inputCheckCode = '重新发送验证码';
                            inputCheckCodeNum = 60;
                        }
                    }, 1000);
                },err => {
                    toast.hideLoading();
                    if(this.active == 1){
                        this.inputCheckCode = err.message;
                    }else{
                        this.messageTxt = err.message;
                    }
                    return;
                });
            },
            close() {
                router.navigateBack();
            },
        }
	}
</script>

<style lang="scss">
    @import "@/style/mixin/flex.scss";
    @import "@/style/page/form.scss";
    
    page,.page{
        height: 100%;
        min-height: 100%;
    }
    
    .page{
        @include flex(null, center, column);
        background-color: #fff;
    }
    
    .close{
        @include flex-self(null, top);
    }
    
    .form{
        @include flex-self(keep);
        box-sizing: border-box;
        width: 590upx;
        padding: $uni-spacing-col-lg 0 0;
        
        &__head{
            font-size: 46upx;
            padding-bottom: $uni-spacing-col-lg * 2;
        }
    }
	
	.pageTips{
        width: 100%;
        font-size: 22upx;
        color: $uni-color-warning;
        text-align: left;
        line-height:40upx;
        padding-bottom: $uni-spacing-col-lg * 3;
        
        &--error{
            color: $uni-color-error;
        }
	}
    
    .btn[type=primary]{
        font-size: $uni-font-size-lg;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: $color-main !important;
    }
    
    .link{
        padding: $uni-spacing-col-lg 0;
        color: $uni-text-color;
        text-align: center;
        font-size: $uni-font-size-sm;
    }
    
    .numbox{
        position: relative;
        padding: $uni-spacing-col-lg 0;
        
        &__main{
            @include flex(between);
        }
        
        &__item{
            width: 60upx;
            height: 60upx;
            font-size: 44upx;
            line-height: 60upx;
            text-align: center;
            color: $uni-text-color;
            margin: 0 $uni-spacing-row-base;
            border-bottom: 2px solid $uni-text-color-grey;
        }
        
        &__field{
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 999;
            margin-left: -50%;
            width: 150%;
            height: 100%;
        }
    }
    
    .btn--switch{
        text-align: center;
        color: $uni-color-primary;
        font-size: $uni-font-size-base;
        font-weight: 700;
        padding: $uni-spacing-col-lg $uni-spacing-row-base;
    }
</style>
