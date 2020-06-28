<template>
	<view class="page" :style="{'height':height+'px'}">
		<view class="title">
		    输入企业营业执照上的全称
		</view>
        <view class="form">
            <view class="form__cell--column">
                <view class="formInput">
                    <input class="formInput__field" type="text" :value="name" @input="_inputName" placeholder="输入企业名称（必填）" placeholder-style="color: #999;"/>
                    <view class="uni-icon uni-icon-clear" v-if="showClearName" @click="clearIcon"></view>
                </view>
            </view>
            <view class="form__cell--column">
                <view class="formInput">
                    <input class="formInput__field" type="text" v-model="reason" placeholder="输入申请理由" placeholder-style="color: #999;"/>
                </view>
            </view>
        </view>
        <template v-if="name != ''">
            <view class="hr">
                查询结果
            </view>
            <view v-if="is_tips == 1" class="tips">
                搜索中...
            </view>
            <view v-if="is_tips == 0" class="tips tips--red">
                未找到该企业！<br/>
                请确认该企业已在该平台认证
            </view>
            <view v-if="is_tips == 2" class="tips">
                存在该企业！<br/>
                点击下一步向企业管理员发起加入申请
            </view>
            <view v-if="is_tips == 3" class="tips">
                {{message}}
            </view>
            <button v-if="is_tips == 2" type="primary" @click="sendBtn()">下一步</button>
        </template>
	</view>
</template>

<script>
    import { router, toast, debounce } from '@/common/util.js';
    import { postSearchCompany, postCompanyApply } from '@/service/getData.js';
    
	export default {
		data() {
			return {
                height: 0,
                id: null,
				name: '',
                reason: '',
                showClearName: false,
                is_tips: 1,
                message: ''
			};
		},
        onLoad() {
			this.height = uni.getSystemInfoSync().windowHeight;
        },
        methods: {
            _inputName(e) {
                let value = e.detail.value;
                if(value == this.name){
                    return;
                }
                this.is_tips = 1;
                if(value == ''){
                    this.id = null;
                    this.name = '';
                    this.showClearName = false;
                }else{
                    this.showClearName = true;
                }
                this._searchChange(this, value);
            },
            clearIcon(){
                this.is_tips = 1;
                this.id = null;
                this.name = '';
                this.reason = '';
                this.showClearName = false;
            },
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val != ''){
                    vm.name = val;
                    vm.getData();
                }
            }, 1000, false),
            getData(){
                postSearchCompany({name:this.name}).then(res => {
                    if(res.data.hasOwnProperty('name') && res.data.name != ''){
                        this.is_tips = 2;
                        this.id = res.data.id;
                    }else{
                        this.is_tips = 0;
                        this.id = null;
                    }
                });
            },
            sendBtn(){
                if(this.reason == ''){
                    toast.show('请输入申请理由');
                    return;
                }
                toast.loading();
                postCompanyApply({id:this.id, reason: this.reason}).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '申请加入公司',
                        content: res.message ? res.message : '提交成功，请联系该公司管理员通过审核！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    this.is_tips = 3;
                    this.message = err.message;
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    
    .page{
        @include flex(null, stretch, column);
        padding: 0 80rpx;
        background: #fff;
    }
    
    .title{
        padding: 67rpx 0;
        font-size: 23px;
        text-align: center;
        color: $uni-text-color;
    }
    
    .hr{
        @include flex(center, center);
        padding: 120rpx 0 22rpx;
        font-size: 12px;
        color: $uni-text-color-grey;
        
        &::before, &::after{
            @include flex-self(full);
            content: '';
            border-top: 1rpx dashed $uni-text-color-grey;
            margin: 0 $uni-spacing-row-sm;
        }
    }
    
    .tips{
        @include flex(null, center, column);
        padding: 40rpx 0;
        font-size: 13px;
        color: $uni-text-color;
        background-color: #FFF7E8;
        border-radius: $uni-border-radius-sm;
        margin-bottom: 80rpx;
        
        &--red{
            color: $uni-color-error;
        }
    }
    
    button{
        width: 100%;
    }
</style>
