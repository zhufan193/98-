<template>
	<view class="page" v-if="data">
		<view class="head">
		    <view class="head__title">
		        {{data.title}}
		    </view>
		    <view class="head__bottom">
		        <text class="head__text">
		            {{resDate}}
		        </text>
		    </view>
		</view>
        <view class="content">
            {{data.data.content}}
        </view>
        <view v-if="resType" class="form">
            <view class="form__cell">
                <view class="form__label">
                    备注
                </view>
                <view class="form__note">
                    {{data.data.reason ? data.data.reason : '无'}}
                </view>
            </view>
            <view v-if="data.data.action_state !== 0" class="form__cell">
                <view class="form__label">
                    操作
                </view>
                <view class="form__note" :style="{'color': data.data.action_state === 1 ? '#29CCCC' : '#ed3b00'}">
                    {{helper}}
                </view>
            </view>
        </view>
        <view class="foot" v-if="is_btn">
            <button class="foot__btn" type="primary" @tap="confirm()">通过</button>
            <button class="foot__btn" type="warn" @tap="cancel()">拒绝</button>
        </view>
	</view>
</template>

<script>
    import { getMessageType, postMessageAction, postShipApplyAgree, postShipApplyReject, postCompanyApplyAgree, postCompanyApplyReject } from '@/service/getData.js';
    
    import { dateUtils, toast } from '@/common/util.js';
    
	export default {
		data() {
			return {
                data: {
                    id: null,
                    notifiable_id: null,
                    read_at: '',
                    type: null,
                    created_at: '',
                    title: '',
                    data: {
                        company_id: null,
                        ship_id: null,
                        user_id: null,
                        action_state: 0,
                        title: '',
                        content: '',
                        reason: '',
                    }
                },
                resDate: '',
                helper: '',
                is_btn: false
			};
		},
        computed: {
            resType() {
                return this.data.type === 5 || this.data.type === 6
            }
        },
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                this.getData();
            }
        },
        methods: {
            getData(){
                getMessageType(this.id).then(res => {
                    this.data = res.data;
                    if(this.resType && res.data.data.hasOwnProperty('action_state')){
                        if(this.data.data.action_state === 0){
                            this.is_btn = true;
                        }else{
                            this.is_btn = false;
                            if(this.data.data.action_state === 1){
                                this.helper = '您同意了该请求';
                            }else if(this.data.data.action_state === 2){
                                this.helper = '您拒绝了该请求';
                            }
                        }
                    }
                    this.resDate = dateUtils.format(res.data.created_at);
                });
            },
            confirm() {
                let that = this;
                uni.showModal({
                    title: '请求通过',
                    content: '请确认该信息无误！',
                    success(e) {
                        if(e.confirm){
                            if(that.data.type === 5){
                                postShipApplyAgree({ship_id: that.data.data.ship_id, user_id: that.data.data.user_id, notify_id: that.data.id}).then(res => {
                                    postMessageAction(that.id, 1).then(res => {
                                        toast.show('成功通过该请求！');
                                        that.getData();
                                    });
                                },err => {
                                    toast.show(err.message);
                                });
                            }else if(that.data.type === 6){
                                postCompanyApplyAgree({company_id: that.data.data.company_id, user_id: that.data.data.user_id, notify_id: that.data.id}).then(res => {
                                    postMessageAction(that.id, 1).then(res => {
                                        toast.show('成功通过该请求！');
                                        that.getData();
                                    });
                                },err => {
                                    toast.show(err.message);
                                });
                            }
                        }
                    }
                })
            },
            cancel() {
                let that = this;
                uni.showModal({
                    title: '请求拒绝',
                    content: '请确认该信息无误！',
                    success(e) {
                        if(e.confirm){
                            if(that.data.type === 5){
                                postShipApplyReject({ship_id: that.data.data.ship_id, user_id: that.data.data.user_id, notify_id: that.data.id, reason: '该船舶管理员拒绝您加入'}).then(res => {
                                    postMessageAction(that.id, 2).then(res => {
                                        toast.show('成功拒绝该请求！');
                                        that.getData();
                                    });
                                },err => {
                                    toast.show(err.message);
                                });
                            }else if(that.data.type === 6){
                                postCompanyApplyReject({company_id: that.data.data.company_id, user_id: that.data.data.user_id, notify_id: that.data.id, reason: '该企业管理员拒绝您加入'}).then(res => {
                                    postMessageAction(that.id, 2).then(res => {
                                        toast.show('成功拒绝该请求！');
                                        that.getData();
                                    });
                                },err => {
                                    toast.show(err.message);
                                });
                            }
                        }
                    }
                })
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    page{
        background-color: $uni-bg-color;
    }
    
    .page{
        padding-bottom: 44px;
    }
    
    .head{
        @include flex(between, null, column);
        @include flex-self(keep);
        padding: $uni-spacing-col-lg $uni-spacing-row-base;
        
        &__title{
            font-size: 20px;
            line-height: 1.6;
            padding-bottom: $uni-spacing-col-base;
        }
        
        &__bottom{
            @include flex(between, center);
        }
        
        &__text{
            color: #999;
            font-size: 12px;
            margin-right: 8px;
        }
    }
    
    .content{
        padding: 0 $uni-spacing-row-base $uni-spacing-col-base;
        color: $uni-text-color;
        font-size: 16px;
        text-align: justify;
        line-height: 1.8;
    }
    
    .form::before{
        @include hr(top)
    }
    
    .form::after{
        @include hr(bottom)
    }
</style>
