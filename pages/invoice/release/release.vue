<template>
	<view class="page">
        <view class="form" v-if="type === 'user'">
            <view class="form__cell">
                <view class="form__label">名称</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="name" placeholder="请填写抬头名称" placeholder-style="color: #999;"/>
            </view>
        </view>
        <view class="form" v-else>
            <view class="form__cell">
                <view class="form__label">单位名称<text class="red">*</text></view>
                <input class="formInput__field formInput__field--right" type="text" v-model="name" placeholder="请填写企业全称" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">税号<text class="red">*</text></view>
                <input class="formInput__field formInput__field--right" type="text" v-model="num" maxlength="18" placeholder="纳税人识别码或社会统一征信代码" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">注册地址</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="address" placeholder="请输入企业注册地址" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">注册电话</view>
                <input class="formInput__field formInput__field--right" type="number" v-model="phone" maxlength="11" placeholder="请输入企业电话号码" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">开户银行</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="bank_name" placeholder="请输入企业开户银行" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">银行账号</view>
                <input class="formInput__field formInput__field--right" type="number" v-model="bank_num" placeholder="请输入企业银行账号" placeholder-style="color: #999;"/>
            </view>
        </view>
        <view class="foot">
            <button type="primary" class="foot__btn" @click="sendData">确认添加</button>
        </view>
	</view>
</template>

<script>
    
    import { router, toast, check } from '@/common/util.js';
    import { postInvoice } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
		data() {
			return {
				type: 'user',
                name: '',
                num: '',
                address: '',
                phone: '',
                bank_name: '',
                bank_num: ''
			};
		},
        computed: mapState(['pageTempData']),
        onLoad(options) {
            if(options && options.type){
                this.type = options.type;
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _goPage(url){
                router.navigateTo(url);
            },
            sendData(){
                if(this.name == ''){
                    toast.show(this.type === 'user' ? '请填写抬头名称' : '请填写企业全称');
                    return;
                }
                let send = {
                    type: this.type === 'user' ? 2 : 1,
                    name: this.name
                }
                if(this.type != 'user'){
                    if(this.num.length === 15 || this.num.length === 18){
                        toast.show('请输入正确纳税人识别码或社会统一征信代码！');
                        return;
                    }
                    if(this.bank_num.length < 13 || this.bank_num.length > 19){
                        toast.show('请输入正确银行卡号！');
                        return;
                    }
                    send.code = this.num;
                    send.comp_addr = this.address;
                    send.comp_tel = this.phone;
                    send.comp_bank = this.bank_name;
                    send.comp_account = this.bank_num;
                }
                toast.loading('添加中，请稍后...');
                postInvoice(send).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'invoiceAdd', invoiceAdd: true});
                    uni.showModal({
                        title: '新增发票账号',
                        content: res.message ? res.message : '添加成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    console.log(err)
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        background-color: #fff;
    }
    
    .red{
        color: $color-sub;
        padding-left: 4px;
    }
</style>
