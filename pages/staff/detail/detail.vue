<template>
	<view class="page" v-if="data">
		<view class="form">
		    <image class="form__avatar" :src="data.avatar" mode="aspectFill"></image>
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
		            注册手机
		        </view>
		        <view class="form__note">
		            {{data.phone}}
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
		    <view class="form__cell">
		        <view class="form__label">
		            角色
		        </view>
		        <view class="form__note">
		            {{data.role_na}}
		        </view>
		    </view>
		</view>
		<view class="foot" v-if="data.role == 1 && permissions === 'manage'">
		    <button v-if="type === 'ship'" class="foot__btn" type="warn" @tap="_shipManagerEdit()">更换船管理员</button>
		    <button v-else class="foot__btn" type="warn" @tap="_companyManagerEdit()">更换企业管理员</button>
		</view>
		<view class="foot" v-if="data.role != 1 && permissions === 'manage'">
		    <button class="foot__btn" type="warn" @tap="_shipStaffRemove()">解绑该员工</button>
		</view>
	</view>
</template>

<script>
    import { router, toast } from '@/common/util.js';
    import { postShipStaffRemove, postCompanyStaffRemove, postCompanyShipStaffRemove } from '@/service/getData.js';
    
    import { mapMutations } from 'vuex';
    
	export default {
		data() {
			return {
                type: 'ship',
                permissions: 'join',
                company_id: null,
				data: null
			};
		},
        onLoad(options) {
            if(options){
                this.permissions = options.permissions;
                if(options && options.type){
                    this.type = options.type;
                    this.company_id = options.company_id;
                    if(this.type === 'company'){
                        uni.setNavigationBarTitle({
                            title: '企业员工信息'
                        });
                    }
                }
                if(options.avatar === 'null'){
                    options.avatar = '/static/img/avatar.png';
                }
                this.data = options;
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _shipManagerEdit() {
                router.redirectTo('/pages/ship/manager-edit/manager-edit', this.data);
            },
            _companyManagerEdit() {
                router.redirectTo('/pages/company/manager-edit/manager-edit', this.data);
            },
            _shipStaffRemove() {
                uni.showModal({
                    title: '警告',
                    content: '解绑该员工！',
                    success:(res) => {
                        if(res.cancel){
                            return;
                        }
                        toast.loading('解绑中，请稍后。')
                        if(this.type === 'ship'){
                            postShipStaffRemove(this.data).then(res => {
                                this.PAGE_TEMP_ADD({field: 'shipStaffRemove', shipStaffRemove: true});
                                toast.hideLoading();
                                uni.navigateBack();
                            }, err => {
                                toast.show(err.message);
                            });
                        }else if(this.type === 'company'){
                            postCompanyStaffRemove(this.data).then(res => {
                                this.PAGE_TEMP_ADD({field: 'companyStaffAdd', companyStaffAdd: true});
                                toast.hideLoading();
                                uni.navigateBack();
                            }, err => {
                                toast.show(err.message);
                            });
                        }else{
                            postCompanyShipStaffRemove(this.data).then(res => {
                                this.PAGE_TEMP_ADD({field: 'shipStaffRemove', shipStaffRemove: true});
                                toast.hideLoading();
                                uni.navigateBack();
                            }, err => {
                                toast.show(err.message);
                            });
                        }
                    }
                })
            }
        },
	}
</script>

<style lang="scss">
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .form{
        background-color: #fff;
    }
    
    .form__avatar{
        align-self: center;
        width: $uni-img-size-base * 2;
        height: $uni-img-size-base * 2;
        margin: 10px 0;
        border-radius: $uni-border-radius-circle;
    }
</style>
