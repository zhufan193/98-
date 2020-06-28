<template>
	<view class="page">
		<view class="uni-list">
			<uni-list-item  @tap="_setAvatar" note="更换头像" :thumb="userInfo.avatar ? userInfo.avatar : '/static/img/avatar.png'" />
			<!-- <uni-list-item  @tap="_pickerIdentity" title="身份" :note="resIdentity" /> -->
		</view>
		<view class="uni-list">
			<!-- <uni-list-item  @tap="goPage('/pages/user/chang-info/chang-info')" title="昵称" :note="userInfo.nickname ? userInfo.nickname : '未设置'"/> -->
			<uni-list-item  title="注册手机" :note="userInfo.phone" :showArrow="false"/>
			<uni-list-item  title="姓名" :note="userInfo.realname ? userInfo.realname : '未认证'"  :showArrow="false"/>
			<uni-list-item  @tap="_setSex" title="性别" :note="userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女': '请选择性别'"/>
			<uni-list-item  @tap="goPage('/pages/user/chang-info/chang-info')" title="邮箱" :note="userInfo.email ? userInfo.email : '未绑定'"/>
		</view>
        <view class="uni-list">
			<!-- #ifdef APP-PLUS -->
			<uni-list-item  @tap="_clearTemp" title="清除本地缓存" :note="tempSize" :showArrow="false" />
			<uni-list-item title="关于运有方" :note="resVersion? '发现新版本：v' + version.version : '当前版本：v' + version.oldversion" :showArrow="resVersion? 'info' : false"   @tap="_updata"/>
			<!-- #endif -->
			<uni-list-item @tap="callPhone(customer.customer_call)" class="disable" title="客服电话" :note="customer.customer_call" :showArrow="false" />
		</view>
        <view class="uni-list">
            <uni-list-item  @click="goPage('/pages/common/rich-text/rich-text?type=user_agreement')" title="用户协议及隐私政策"/>
			<uni-list-item  @tap="goPage('/pages/user/cancel/cancel')" title="注销账号" :note="userInfo.cancel_state === 1 ? '进行中' : ''"/>
            <!-- <uni-list-item  @tap="goPage('/pages/common/feedback/feedback')" title="帮助与反馈" />
            <uni-list-item  @tap="goPage()" title="联系我们" /> -->
        </view>
        <view class="foot">
            <view class="foot__btn" @tap="_logout">
                退出登录
            </view>
        </view>
        
        <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" deepLength="1" :pickerValueDefault="[pickerValueIndex]"
		 @onConfirm="_setIdentity" :pickerValueArray="pickerValueArray"></mpvue-picker>
        
        <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" />
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast, localStorage } from '@/common/util.js';
    import { uploadPic, postUserInfo, postAccountCancel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniList,
            uniListItem,
            mpvuePicker,
            cpimg
        },
        data() {
            return {
                pickerValueArray: [
                    {label: '船东', value: 0},
                    {label: '船代', value: 1},
                    {label: '货主', value: 2},
                    {label: '货代', value: 3},
                    {label: '船员', value: 4},
                    {label: '供应商', value: 5},
                    {label: '其他', value: 6},
                ],
                pickerValueIndex: 0,
                tempSize: '',
            }
        },
        onShow() {
            this.tempSize = this.getCurrentSize();
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                this.$refs.mpvuePicker.pickerCancel();
                return true;
            }
        },
		onUnload() {
            // 退出前关闭选择器
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        computed: {
            ...mapState(['userInfo', 'customer', 'version']),
            resIdentity() {
                if(this.userInfo.identity_type != null){
                    return this.userInfo.identity_str;
                }
                return '请选择';
            },
            // #ifdef APP-PLUS
            resVersion() {
                // let str = '';
                // if(this.version.oldversion != this.version.version){
                //     // this.is_version = true;
                //     str = '最新版本：v' + this.version.version;
                // }else{
                //     // this.is_version = false;
                //     str = '当前版本：v' + this.version.oldversion;
                // }
                return this.version.oldversion != this.version.version;
            }
            // #endif
        },
        methods: {
            ...mapMutations(['RECORD_USERINFO', 'LOGOUT', 'VERSION_UPDATA']),
			goPage(url, detail = null) {
				router.navigateTo(url, detail);
			},
            _setAvatar() { //选择图片
                this.$refs.cpimg._changImg();
            },
            cpimgOk(file) {
                toast.loading('图片上传中，请稍后...');
                uploadPic(file.data[0], {}).then(res => {
                    postUserInfo({avatar: res.data.source}).then(resUp => {
                        toast.hideLoading();
                        toast.success('头像上传成功', 'success' , false, 2000);
                        this.RECORD_USERINFO({field: 'avatar', avatar: res.data.source_url});
                    },errUp => {
                        toast.hideLoading();
                        toast.show('头像变更失败', 'none' , false, 2000);
                    });
                },err => {
                    toast.hideLoading();
                    toast.show('头像上传失败', 'none' , false, 2000);
                });
            },
            cpimgErr(e) {
                toast.show(e);
            },
            _pickerIdentity() {
                this.$refs.mpvuePicker.show();
            },
            _setIdentity(e) {
                let identity = e.value
                postUserInfo({identity: identity}).then(res => {
                    this.RECORD_USERINFO({field: 'identity_type', identity_type: identity});
                    this.RECORD_USERINFO({field: 'identity_str', identity_str: this.pickerValueArray[identity].label});
                });
            },
            _setSex() { // 修改性别
				uni.showActionSheet({
					itemList: ['男', '女'],
					success: (e) => {
                        let sex = e.tapIndex === 0 ? '1' : '2';
                        postUserInfo({sex: sex}).then(res => {
                            this.RECORD_USERINFO({field: 'sex', sex: sex});
                        })
					}
				})
            },
            _updata() {
                if(this.resVersion){
                    uni.navigateTo({
                        url: '/pages/common/up-data/up-data'
                    });
                }
            },
            _clearTemp() {
                let baseUrl = localStorage.getStore('baseUrl');
                let fileBaseUrl = localStorage.getStore('fileBaseUrl');
                let globalUrl = localStorage.getStore('globalUrl');
                let loginToken = localStorage.getStore('loginToken');
                let code_key = localStorage.getStore('code_key');
                let userInfo = localStorage.getStore('userInfo');
                let tabBarIndex = localStorage.getStore('tabBarIndex');
                localStorage.clearStore();
                localStorage.setStore('baseUrl', baseUrl);
                localStorage.setStore('fileBaseUrl', fileBaseUrl);
                localStorage.setStore('globalUrl', globalUrl);
                localStorage.setStore('loginToken', loginToken);
                localStorage.setStore('code_key', code_key);
                localStorage.setStore('userInfo', userInfo);
                localStorage.setStore('tabBarIndex', tabBarIndex);
                localStorage.setStore('launchFlag', true);
                this.tempSize = this.getCurrentSize();
                // #ifdef APP-PLUS
                plus.runtime.restart();
                // #endif
            },
            getCurrentSize(){
                let res = uni.getStorageInfoSync();
                let num = res.currentSize / 1000;
                if(num < 0.1) return res.currentSize + 'KB';
                return num.toFixed(1) + 'M';
            },
            _logout(){
                this.LOGOUT();
                router.switchTab('/pages/tabBar/home/home');
            },
            callPhone(phone) {
                uni.makePhoneCall({
                    phoneNumber: phone
                })
            }
        }
	}
</script>

<style lang="scss">
    .page{
        padding-bottom: 44px;
    }
    
    .uni-list{
        margin-bottom: 10px;
    }
    .uni-list::before, .uni-list::after, uni-list-item:last-child .uni-list-item__container::after{
        display: none;
    }
    .uni-list .uni-list-item__icon-img{
        width: 144upx;
        height: 144upx;
        background-color: #eee;
        border: 1px solid #fff;
        border-radius: 100%;
    }
    .uni-list .uni-list-item__content{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .uni-list .uni-list-item__extra{
        width: initial;
    }

    .foot{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        
        &__btn{
            line-height: 44px;
            text-align: center;
            color: #fff;
            background-color: #dd524d;
        }
        
        &__info{
            color: #777;
            text-align: right;
            padding: 16upx;
        }
    }
    
    uni-list-item.disable .uni-list-item--hover{
        background-color: initial;
    }
</style>
