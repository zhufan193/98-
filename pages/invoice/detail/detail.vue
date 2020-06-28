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
            <button type="primary" class="foot__btn" @click="sendData" :disabled="btn_disbaled">保存修改</button>
        </view>
	</view>
</template>

<script>
    
    import { router, toast, check } from '@/common/util.js';
    import { getInvoiceDetail, postInvoice, postInvoiceDel } from '@/service/getData.js';
    
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
                bank_num: '',
                detail: {
                    name: '',
                    code: '',
                    comp_addr: '',
                    comp_tel: '',
                    comp_bank: '',
                    comp_account: '',
                }
			};
		},
        computed: {
            ...mapState(['pageTempData']),
            btn_disbaled() {
                return this.name === this.detail.name && this.num === this.detail.code && this.address === this.detail.comp_addr && this.phone === this.detail.comp_tel && this.bank_name === this.detail.comp_bank && this.bank_num === this.detail.comp_account
            }
        },
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                toast.loading('加载中');
                getInvoiceDetail({id: this.id}).then(res => {
                    toast.hideLoading();
                    this.detail = res.data;
                    this.type = res.data.type === 1 ? 'company' : 'user';
                    this.name = res.data.name;
                    this.num = res.data.code;
                    this.address = res.data.comp_addr;
                    this.phone = res.data.comp_tel;
                    this.bank_name = res.data.comp_bank;
                    this.bank_num = res.data.comp_account;
                });
            }
        },
        onNavigationBarButtonTap() {
            uni.showModal({
                title: '警告',
                content: '删除发票！',
                confirmText: '删除',
                success: (e) => {
                    if(e.confirm){
                        toast.loading('请稍后...');
                        postInvoiceDel({id: this.id}).then(res => {
                            toast.hideLoading();
                            this.PAGE_TEMP_ADD({field: 'invoiceAdd', invoiceAdd: true});
                            uni.navigateBack();
                        });
                    }
                }
            })
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_UPDATA', 'PAGE_TEMP_ADD']),
            _goPage(url){
                router.navigateTo(url);
            },
            sendData(){
                if(this.name == ''){
                    toast.show(this.type === 'user' ? '请填写持卡人姓名' : '请填写企业名称');
                    return;
                }
                let send = {
                    id: this.id,
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
                toast.loading('请稍后...');
                postInvoice(send).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'invoiceAdd', invoiceAdd: true});
                    uni.showModal({
                        title: '编辑发票',
                        content: res.message ? res.message : '编辑成功！',
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
</style>
