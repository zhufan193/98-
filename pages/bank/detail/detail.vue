<template>
	<view class="page">
        <view class="form">
            <view class="form__cell">
                <view class="form__label">{{type === 'user' ? '持卡人姓名' : '企业名称'}}</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="name" :placeholder="type === 'user' ? '请输入真实姓名' : '请输入完整的企业名称'" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">
                    选择开户银行
                </view>
                <view class="form__note" @tap="_goPage('/pages/bank/indexed-list/indexed-list')">
                    {{bank_name}}
                </view>
            </view>
            <view class="form__cell">
                <view class="form__label">银行账号</view>
                <input class="formInput__field formInput__field--right" type="number" v-model="bank_num" placeholder="输入持卡人本人的银行账号" placeholder-style="color: #999;"/>
            </view>
        </view>
        <view class="foot">
            <button type="primary" class="foot__btn" @click="sendData" :disabled="btn_disbaled">保存修改</button>
        </view>
	</view>
</template>

<script>
    
    import { router, toast, check } from '@/common/util.js';
    import { getBankDetail, postBank, postBankDel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
		data() {
			return {
				type: 'user',
                name: '',
                bank_name: '请选择',
                bank_num: '',
                detail: {
                    owner: '',
                    bank: '',
                    account: ''
                }
			};
		},
        computed: {
            ...mapState(['pageTempData']),
            btn_disbaled() {
                return this.name === this.detail.owner && this.bank_name === this.detail.bank && this.bank_num === this.detail.account
            }
        },
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                toast.loading('加载中');
                getBankDetail({id: this.id}).then(res => {
                    toast.hideLoading();
                    this.detail = res.data;
                    this.name = res.data.owner;
                    this.bank_name = res.data.bank;
                    this.bank_num = res.data.account;
                });
            }
        },
        onShow() {
            if(this.pageTempData !== null){
                this.bank_name = this.pageTempData;
            }
            this.PAGE_TEMP_UPDATA(null);
        },
        onNavigationBarButtonTap() {
            uni.showModal({
                title: '警告',
                content: '删除银行账号！',
                confirmText: '删除',
                success: (e) => {
                    if(e.confirm){
                        toast.loading('请稍后...');
                        postBankDel({id: this.id}).then(res => {
                            toast.hideLoading();
                            this.PAGE_TEMP_ADD({field: 'bankAdd', bankAdd: true});
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
                if(this.bank_name == '请选择'){
                    toast.show('请选择开户行');
                    return;
                }
                if(this.bank_num.length < 13 || this.bank_num.length > 19){
                    toast.show('请输入正确银行卡号！');
                    return;
                }
                let send = {
                    id: this.id,
                    owner: this.name,
                    bank: this.bank_name,
                    account: this.bank_num
                }
                toast.loading('请稍后...');
                postBank(send).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'bankAdd', bankAdd: true});
                    uni.showModal({
                        title: '编辑银行账号',
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
