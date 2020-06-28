<template>
	<view class="page">
        <view class="form">
            <view class="form__cell--column">
                <view class="form__label">邮箱</view>
                <view class="formInput">
                    <input class="formInput__field" placeholder="请输入邮箱" placeholder-style="color:#ccc"
                     :value="valueEmail"
                     @input="bindEmail" />
                    <view class="uni-icon uni-icon-clear" v-if="showClear" @click="clearIcon"></view>
                </view>
            </view>
            <view class="pageTips">
                {{messageTxt}}
            </view>
            <button class="btn" type="primary" @tap="_clickBtn">提交</button>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    
    import { router, toast, check } from '@/common/util.js';
	import { postUserInfo } from '@/service/getData';
    import { mapMutations } from 'vuex';

	export default {
		components: {
            uniIcons
		},
		data() {
			return {
                valueEmail: '', // 邮箱
                showClear: false,
                messageTxt: '', // 错误提示
			};
		},
        methods: {
            ...mapMutations(['RECORD_USERINFO']),
            bindEmail(e) { // 手机号z绑定
                this.valueEmail = e.target.value;
				if (e.target.value.length > 0) {
					this.showClearPhone = true;
                    this.messageTxt = '';
				} else {
					this.showClearPhone = false;
				}
            },
            clearIcon() {
                this.valueEmail = '';
                this.showClear = false;
            },
            _clickBtn() {
                if(!check.email(this.valueEmail)){
                    this.messageTxt = '请输入邮箱！';
                    return;
                }
                toast.loading();
                postUserInfo({email: this.valueEmail}).then(res => {
                    toast.hideLoading();
                    this.RECORD_USERINFO({field: 'email', email: this.valueEmail});
                    toast.show('提交成功！');
                    setTimeout(() => {
                        router.navigateBack();
                    }, 1200);
                }, err => {
                    toast.hideLoading();
                    this.messageTxt = err.message;
                });
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
