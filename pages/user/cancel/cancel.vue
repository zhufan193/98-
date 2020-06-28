<template>
	<view class="page">
		<template v-if="is_cancel">
            <view class="list">
                <view class="list__main">
                    <view class="list__name">{{phone}}</view>
                    <view class="list__time">还剩 {{time}} 账号将被注销</view>
                </view>
                <view class="list__btn" @tap="userCancelBack()">
                    撤销
                </view>
            </view>
        </template>
        <template v-else>
            <view class="form">
                <view class="form__cell--column">
                    <view class="form__label">手机号</view>
                    <view class="formInput">
                        <input class="formInput__field" type="number" confirm-type="next" v-model="phone" placeholder="请输入手机号" placeholder-style="color:#ccc"/>
                    </view>
                </view>
                <view class="form__cell--column">
                    <view class="form__label">验证码</view>
                    <view class="formInput">
                        <input class="formInput__field" type="text" v-model="code" placeholder="请输入验证码" placeholder-style="color:#ccc"/>
                        <view class="formInput__code" @tap="sendCode">
                            {{ inputCheckCode }}
                        </view>
                    </view>
                </view>
                <view class="form__cell--column">
                    <view class="form__label">注销原因</view>
                    <view class="formInput">
                        <input class="formInput__field" type="text" v-model="remark" placeholder="输入注销原因(非必填)" placeholder-style="color:#ccc"/>
                    </view>
                </view>
                <view class="form__cell--column" v-if="!is_edit">
                    <view class="checked">
                        <label class="checked__field" style="width: auto;" @click="_checked">
                            <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                            我已知晓账号注销相关情况
                        </label>
                    </view>
                    <view class="tips">
                        您提交的账号注销申请，系统会在7天内完成账号的彻底注销，账号被注销前，您还有机会撤销。注销以后该手机号将不能用于注册该平台会员！
                    </view>
                </view>
                <view class="foot">
                    <view class="btn" @tap="userCancel()">
                        提交账号注销申请
                    </view>
                </view>
            </view>
        </template>
	</view>
</template>

<script>
    import { router, toast, check } from '@/common/util.js';
    import { postSecCode, postAccountCancel, postAccountCancelBack } from '@/service/getData.js';
    
    import { mapState } from 'vuex';
    
    var timer;
    
	export default {
		data() {
			return {
				is_cancel: false,
                phone: '',
                time: '0天 0时 0分 0秒',
                code: '',
                remark: '',
                inputCheckCode: '获取验证码',
                secCodekey: '',
                is_chacked: false
			}
		},
        computed: mapState(['userInfo', 'code_key']),
        onLoad() {
            if(this.userInfo && this.userInfo.cancel_state === 1){
                this.is_cancel = true;
                this.setTime(this.userInfo.cancel_at + 604800);
            }
            uni.setNavigationBarTitle({
                title: this.is_cancel ? '撤销账号注销' : '账号注销'
            });
        },
        onUnload() {
            clearInterval(timer);
        },
		methods: {
            setTime(val){
                let that = this;
                this.phone = this.userInfo.account;
                timer = setInterval(function(){
                    let date = new Date();
                    that.time = that.timing(val - parseInt(date.getTime()/1000));
                }, 1000);
            },
            sendCode(){
                if (this.inputCheckCode != '获取验证码' && this.inputCheckCode != '重新发送验证码') {
                    toast.show('操作过于频繁！');
                    return;
                }
                //校验手机号码
                if (!check.phone(this.phone)) {
                    toast.show('手机号码错误！');
                    return;
                }
                if (this.phone !== this.userInfo.account) {
                    toast.show('请输入当前手机号！');
                    return;
                }
                var than = this;
				var inputCheckCodeNum = 60;
                toast.loading('获取验证码...');
				postSecCode({account: this.phone, check_key: this.code_key}).then(res => {
                    toast.hideLoading();
					this.secCodekey = res.data.sec_key;
				}, err => {
                    toast.show(err.message);
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
            _checked(){
                this.is_chacked = !this.is_chacked;
            },
            userCancel(){
                if (this.phone == '') {
                    toast.show('请输入当前手机号！');
                    return;
                }
                if (this.code == '') {
                    toast.show('请输入验证码！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意账号注销相关情况！');
                    return;
                }
                toast.loading();
                postAccountCancel({'remark': this.remark, 'sec_key': this.secCodekey, 'sec_code': this.code}).then(res=>{
                    toast.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: '账号注销申请已成功提交，您的申请将在7天后失效。若您想撤回注销，可以在【我的】【设置】【注销账号】中撤回注销。',
                        showCancel: false,
                        success:(e)=>{
                            router.navigateBack(2);
                        }
                    })
                }, err => {
                    toast.show(err.message);
                });
            },
            userCancelBack(){
                toast.loading();
                postAccountCancelBack().then(res=>{
                    toast.hideLoading();
                    toast.show('取消成功！');
                    setTimeout(function(){
                        router.navigateBack(2);
                    }, 1500);
                }, err=>{
                    toast.show(err.message);
                })
            },
            timing: function(time) { // 计时秒转00：00：00形态
                if (typeof time !== 'number' || time < 0) {
                    return time;
                }
                let day = parseInt(time / 86400);
                time = time % 86400;
                let hour = parseInt(time / 3600);
                time = time % 3600;
                let minute = parseInt(time / 60);
                time = time % 60;
                let second = time;
                
                return `${day}天${hour}时${minute}分${second}秒`;
            },
		}
	}
</script>

<style lang="scss">
    @import "@/style/mixin/flex.scss";
    @import "@/style/mixin/hr.scss";
    @import "@/style/page/form.scss";
    
    page{
        background-color: #fff;
    }
    
    .page{
        @include flex(null, center, column);
        padding: $uni-spacing-col-base $uni-spacing-row-lg 70px;
    }
    
    .list{
        align-self: stretch;
        @include flex();
        padding: $uni-spacing-col-lg 0;
        
        &__main{
            flex: auto;
            position: relative;
            
            &::after{
                @include hr(right);
            }
        }
        
        &__name{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: $uni-spacing-col-sm;
        }
        
        &__time{
            color: $color-grey;
        }
        
        &__btn{
            flex: none;
            @include flex(center, center);
            padding-left: $uni-spacing-row-lg;
            width: 4em;
            color: $color-main;
            font-size: 16px;
        }
    }
    
    .form .checked{
        padding: 0;
    }
    
    .tips{
        color: $color-sub;
        padding-bottom: $uni-spacing-col-base;
    }
    
    .foot{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        
        .btn{
            height: 44px;
            line-height: 44px;
            text-align: center;
            color: #fff;
            background-color: $color-sub;
            border-radius: 22px;
        }
    }
</style>
