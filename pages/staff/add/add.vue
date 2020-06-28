<template>
	<view class="page">
		<view class="info">
            <image class="info__img" src="../../../static/img/verify.png" mode="aspectFit"></image>
            <view class="info__txt">
                需要添加的员工必须先在该平台完成实名认证才能添加,
                请务必确认所添加员工的信息！
            </view>
        </view>
        <view class="card">
            <view class="card__head">
                <view class="search">
                    <image class="search__icon" src="../../../static/icon/search.png" mode="aspectFit"></image>
                    <input class="search__input" type="number" maxlength="11" :value="phone" @input="searchInput" placeholder="输入该员工在平台认证所使用的手机号" placeholder-style="color:#ccc"/>
                </view>
            </view>
            <view class="card__content" :class="{'color__error': message !== '查找中...'}" v-if="!is_data && message !== ''">
                {{message}}
            </view>
            <view class="form" v-show="is_data">
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
        <view class="card" v-show="is_data">
            <view class="checked">
                <label class="checked__field" style="width: auto;" @click="_checked">
                    <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                    已确认该员工信息无误
                </label>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @tap="_sendBtn()">确认添加</button>
            </view>
        </view>
	</view>
</template>

<script>
    import { router, toast, check, debounce } from '@/common/util.js';
    import { postCompanySearchStaff, postCompanyStaff, postCompanyShipStaff, getShipSearchStaff, postShipStaff } from '@/service/getData.js';
    
    import { mapMutations } from 'vuex';
    
	export default {
		data() {
			return {
				type: 'ship',
                company_id: null,
                ship_id: null,
                is_data: false,
                phone: '',
                message: '',
                data: {
                    id: null,
                    phone: '',
                    name: '',
                    sex: 1
                },
                is_chacked: false
			};
		},
        onLoad(options) {
            if(options && options.type){
                this.type = options.type;
                if(this.type === 'company'){
                    this.company_id = options.company_id;
                    uni.setNavigationBarTitle({
                        title: '添加企业员工'
                    });
                }else if(this.type === 'companyShip'){
                    this.company_id = options.company_id;
                    this.ship_id = options.ship_id;
                }else{
                    this.ship_id = options.ship_id;
                }
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            searchInput(e){
                this._searchChange(this, e.detail.value);
            },
            // 防抖动搜索
            _searchChange: debounce((vm, val) => { 
                if(val === '' && val === vm.phone){
                    return;
                }
                if(check.phone(val)){
                    vm.getData(val);
                }else{
                    vm.message = '请输入正确电话号码！';
                    vm.is_data = false;
                }
            }, 1000, false),
            getData(phone) {
                this.message = '查找中...';
                if(this.type === 'ship'){
                    getShipSearchStaff({ship_id: this.ship_id, phone: phone}).then(res => {
                        this.setData(phone, res);
                    }, err => {
                        this.message = err.message;
                        this.is_data = false;
                    });
                }else{
                    postCompanySearchStaff({company_id: this.company_id, phone: phone}).then(res => {
                        this.setData(phone, res);
                    }, err => {
                        this.message = err.message;
                        this.is_data = false;
                    });
                }
            },
            setData(phone, res) {
                this.is_chacked = false;
                if(res.data === ''){
                    this.message = '未查询到该信息，或该手机号未完成实名认证！';
                    this.is_data = false;
                }else{
                    this.phone = phone;
                    this.is_data = true;
                    this.data = res.data;
                }
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            _sendBtn() {
                if(!this.is_chacked){
                    toast.show('请点击下方勾选按钮！');
                    return;
                }
                let send = {
                    user_id: this.data.id,
                    phone: this.data.phone,
                };
                toast.loading();
                if(this.type === 'company'){
                    send.company_id = this.company_id;
                    postCompanyStaff(send).then(res => {
                        toast.hideLoading();
                        toast.show('添加成功！');
                        this.is_chacked = false;
                        this.phone = '';
                        this.is_data = '';
                        this.message = '';
                        this.PAGE_TEMP_ADD({field: 'companyStaffAdd', companyStaffAdd: true});
                    }, err => {
                        toast.show(err.message);
                    });
                }else if(this.type === 'ship'){
                    send.ship_id = this.ship_id;
                    send.role = 2;
                    postShipStaff(send).then(res => {
                        toast.hideLoading();
                        toast.show('添加成功！');
                        this.is_chacked = false;
                        this.phone = '';
                        this.is_data = '';
                        this.message = '';
                        this.PAGE_TEMP_ADD({field: 'shipStaffAdd', shipStaffAdd: true});
                    }, err => {
                        toast.show(err.message);
                    });
                }else if(this.type === 'companyShip'){
                    send.company_id = this.company_id;
                    send.ship_id = this.ship_id;
                    send.role = 2;
                    postCompanyShipStaff(send).then(res => {
                        toast.hideLoading();
                        toast.show('添加成功！');
                        this.is_chacked = false;
                        this.phone = '';
                        this.is_data = '';
                        this.message = '';
                        this.PAGE_TEMP_ADD({field: 'shipStaffAdd', shipStaffAdd: true});
                    }, err => {
                        toast.show(err.message);
                    });
                }
            }
        },
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 0 0 44px;
    }
    
    .info{
        @include flex(between, center);
        background-color: #fff;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        margin-bottom: 10px;
        
        &__img{
            @include flex-self(keep);
            width: $uni-img-size-base * 1.5;
            height: $uni-img-size-base * 1.5;
            margin-right: $uni-spacing-row-base;
        }
        
        &__txt{
            font-size: 12px;
            color: $uni-color-error;
        }
    }
    
    .search{
        @include flex(between, center);
        width: 100%;
        height: 28px;
        padding: 0 $uni-spacing-row-base;
        margin: 15px $uni-spacing-row-base;
        border-radius: 14px;
        color: #ccc;
        background-color: #f5f5f5;
        
        &__icon{
            @include flex-self(keep);
            width: 13px;
            height: 13px;
            margin-right: $uni-spacing-row-base;
        }
        
        &__input{
            @include flex-self(full);
            width: 100%;
            color: $uni-text-color;
            font-size: 13px;
        }
    }
    
    .card{
        border-radius: 0;
    }
    
    .color__error{
        color: $uni-color-error;
    }
    
    .checked{
        align-self: flex-start;
        @include flex(null, center);
        padding: 0 $uni-spacing-row-base;
        
        &__field{
            @include flex(null, center);
            height: 88rpx;
        }
    }
</style>
