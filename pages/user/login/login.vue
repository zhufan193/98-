<template>
  <view class="page" :style="{'height':height+'px'}">
        <view class="logo">
            <image class="logo__sky" src="/static/img/login_sky_back.png" mode="scaleToFill"></image>
            <image class="logo__img" src="/static/img/login_back.png"></image>
            <uni-status-bar></uni-status-bar>
            <view class="close" @tap="close">
                <uni-icons type="closeempty" color="#999" size="44"></uni-icons>
            </view>
            <view class="name">
                九八航运<view class="name__span"></view>船多货多
            </view>
        </view>
		<view class="form">
            <view class="form__cell--column">
                <view class="form__label">手机号</view>
                <view class="formInput">
                    <input class="formInput__field"  confirm-type="next" :value="userName"   :placeholder="is_pwd ? '请输入用户名/手机号' : '请输入手机号'" placeholder-style="color:#ccc"
                    @input="bindUserName" 
                    @tap="focus.userName=true" 
                    @confirm="focus.userName=false;focus.userPwd=true;" 
                    @blur="focus.userName=false;"/>
                    <view class="uni-icon uni-icon-clear" v-if="showClearUserName" @click="clearIcon"></view>
                </view>
            </view>
            <view class="form__cell--column">
                <view class="form__label">{{is_pwd ? '密码' : '验证码'}}</view>
                <view class="formInput">
                    <input class="formInput__field" type="text" confirm-type="done" :password="is_pwd ? showUserPwd : false" v-model="userPwd"  :placeholder="is_pwd ? '请输入密码' : '请输入验证码'" placeholder-style="color:#ccc"
                    @tap="focus.userPwd=true" 
                    @confirm="sendLogin" 
                    @blur="focus.userPwd=false;"/>
                    <image v-if="is_pwd" class="icon-eye" :src="showUserPwd ? '/static/icon/eye-no.png' : '/static/icon/eye.png'" mode="aspectFit" @click="showUserPwd=!showUserPwd"></image>
                    <view v-else class="formInput__code" @tap="sendCode">
                        {{ inputCheckCode }}
                    </view>
                </view>
            </view>
            <view v-show="messageTxt" class="pageTips" :class="{'pageTips--error': messageTxt == '请联系管理员重置密码'}">
                {{messageTxt}}
            </view>
            <view class="link">
                <view class="link__switch" @tap="pwdOrCode">
                    {{is_pwd ? '短信验证码登录' : '密码登录'}}
                </view>
                <!-- <view v-if="is_pwd" class="link__helper" @tap="messageTxt = '请联系管理员重置密码'"> -->
                <view v-if="is_pwd" class="link__helper" @tap="goPage('/pages/user/forget-password/forget-password')">
                	忘记密码
                </view>
            </view>
            <button class="btn" type="primary" :loading="btnLoading" @tap="sendLogin">登陆</button>
            <button class="btn" type="default" @tap="goPage('/pages/user/reg/reg')">注册新用户</button>
            <view class="copyright">
                登录即代表阅读并同意
                <text style="color: #0091E6;" @tap="goPage('/pages/common/rich-text/rich-text?type=user_agreement')">《用户协议及隐私政策》</text>
            </view>
		</view>
	</view>
</template>

<script>
    import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue'
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    
	import { router, toast, check, localStorage } from '@/common/util.js';
	import {secondlogin,postSecCode, postLoginAccount, postLoginPhone } from '@/service/getData';
    import { mapState, mapMutations } from 'vuex';
    
    export default {
        components:{
            uniStatusBar,
            uniIcons
        },
        data() {
            return {
				height: 0,
				focus: {
					'userName': false,
					'userPwd': false,
				},
				userName: '',				// 用户名
				showClearUserName: false,	// 显示清空按钮
				userPwd: '',				// 密码
				showUserPwd: true,			// 显示密码
                inputCheckCode: '获取验证码',
                secCodekey: '',
				btnLoading: false,			// 按钮登陆状态
				messageTxt: '',	// 错误提示
                is_pwd: true
            };
        },
        computed: mapState(['forcedLogin', 'hasLogin', 'userInfo', 'code_key']),
		onLoad(options) {
			this.height = uni.getSystemInfoSync().windowHeight;
		},
		onShow() {
            // #ifdef APP-PLUS
            var tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if (tabBar_Login && !this.hasLogin) {
                tabBar_Login.show();
            }
            // #endif
            // 注册成功后返回页面获取注册手机号
            if(!!this.userInfo.phone){
                this.userName = this.userInfo.phone;
            }
			if(this.userName != ''){
				this.showClearUserName = true;
			}
		},
        // onReady() {
        //     // 短信注册监听
        //     sms.register(this.handleSMS);
        // },
        onUnload() {
            // 短信注册卸载
            // sms.unregister(this.handleSMS, true);
            // #ifdef APP-PLUS
            let tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if (tabBar_Login && this.hasLogin) {
                tabBar_Login.hide();
            }
            // #endif
        },
        onHide() {
            // #ifdef APP-PLUS
            let tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if (tabBar_Login) {
                tabBar_Login.hide();
            }
            // #endif
        },
        // 手机端点击回退拦截
        onBackPress() {
            // #ifdef APP-PLUS
            // 快速点击跳转用户中心再跳转登录后无法回退预防
            let pages = getCurrentPages();
            let route = pages[pages.length - 1].route;
            if(route.indexOf('profile') >= 0){
                let tabBarItem = ['/pages/tabBar/home/home','/pages/tabBar/sail/sail','','/pages/tabBar/pallet/pallet','/pages/tabBar/profile/profile'];
                router.switchTab(tabBarItem[localStorage.getStore('tabBarIndex')]);
                return true;
            }
            // #endif
            // #ifndef APP-PLUS
            // 会与返回冲突
            this.close()
            return true;
            // #endif
        },
        methods: {
            ...mapMutations([
                'TOKEN_USERUPDATA',
                'RECORD_USERINFO'
            ]),
//             handleSMS: function(msgs){
//                 console.log(msgs)
//                 //验证码匹配规则，需要根据实际站点匹配  
//                 var codeRegex = `/[0-9]{6}/g`; 
//                 for (var i = 0, len = msgs.length; i < len; i++) {  
//                     var content = msgs[i].getDisplayMessageBody();  
//                     //匹配短信内容，若短信内容包含“XX网”，则认为初步匹配成功  
//                     if (~content.indexOf('水马航运')) {  
//                         //匹配验证码规则，比如包含6位数字  
//                         var matches = content.match(codeRegex);  
//                         if (matches && matches.length) {  
//                             var code = matches[0];  
//                             //验证码输入框控件，需根据实际页面修改选择器  
//                             var codeElem = document.querySelector('.login-view form input[type="password"]');  
//                             if (codeElem) {  
//                                 codeElem.value = code;  
// 
//                                 //TODO 这里可以取消短信监听  
// 
//                                 //模拟表单提交，需根据实际页面修改选择器  
//                                 document.querySelector('.login-view form button[type="submit"]').click();  
//                                 plus.nativeUI.toast('获取短信验证码成功，自动登录..');  
// 
//                             }  
//                             break;  
//                         }  
//                     }  
//                 }  
//             },
            bindUserName(e) {
				this.userName = e.target.value;
				this.userPwd = '';
				if (e.target.value.length > 0) {
					this.showClearUserName = true;
				} else {
					this.showClearUserName = false;
				}
			},
			clearIcon(){
				this.userName = '';
				this.userPwd = '';
				this.showClearUserName = false;
			},
			pwdOrCode(){
				this.userPwd = '';
				this.is_pwd = !this.is_pwd;
			},
            sendCode(){
                if (this.inputCheckCode != '获取验证码' && this.inputCheckCode != '重新发送验证码') {
                    toast.show('操作过于频繁！');
                    return;
                }
                //校验手机号码
                if (!check.phone(this.userName)) {
                    toast.show('手机号码错误！');
                    return;
                }
                var than = this;
				var inputCheckCodeNum = 60;
                toast.loading('获取验证码...');
				postSecCode({account: this.userName, check_key: this.code_key}).then(res => {
                    toast.hideLoading();
					this.secCodekey = res.data.sec_key;
// 短信接口未开 直接打印
// toast.show('短信接口未开,直接填写');
// this.userPwd = res.data.code;
				}, err => {
                    toast.show(err.message);
                    this.messageTxt = err.message;
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
            sendLogin(){
				
				this.focus.userPwd=false;
				if(this.btnLoading){
					return;
				}
				// 校验表单
				if(this.userName==null||this.userName==''){
					this.messageTxt = '请输入用户名/手机号！';
					uni.showModal({
						content: '请输入用户名/手机号！',
						showCancel: false,
						confirmText: '确定'
					})
					return;
				} 
				if(this.userPwd==null||this.userPwd.length<6){
					this.messageTxt = this.is_pwd ? '请输入最少6位用户密码！' : '请输入6位验证码！';
					uni.showModal({
						content: this.is_pwd ? '请输入最少6位用户密码！' : '请输入6位验证码！',
						showCancel: false,
						confirmText: '确定'
					})
					return;
				}
                if(!this.is_pwd && (this.secCodekey === null || this.secCodekey === '')){
                    this.messageTxt = '验证码错误，请重新获取！';
                    uni.showModal({
                        content: '验证码错误，请重新获取！',
                        showCancel: false,
                        confirmText: '确定'
                    })
                    return;
                }
				this.btnLoading = true;
				let clientId = 'weixin'
				// #ifdef APP-PLUS
				var info = plus.push.getClientInfo();
				
				if (info.token != "null" || info.clientid != "null")
				{
					clientId = info.clientid
				}
				// #endif
                if(this.is_pwd){
					secondlogin({data:{"type":"login","uname":this.userName,"upass":this.userPwd}}).then(res => {
						let lantern = eval('('+res.data+')');
					 	console.log(lantern[0].meslist[0]);
						this.RECORD_USERINFO(lantern[0].meslist[0]);
						uni.showToast({title: '登录成功！'});
					                  setTimeout(function(){
													
						                     /**
						                      * 强制登录时使用reLaunch方式跳转过来
						                      * 返回首页也使用reLaunch方式
						                       */
						                      if (this.forcedLogin) {
						                          router.reLaunch('/pages/tabBar/home/home')
						                      } else {
						                          router.navigateBack();
						                      }
						                 },1200);
					});
                    //postLoginAccount({'account': this.userName, 'password': this.userPwd,'client':clientId}).then(res => {
					// 	let lantern = eval('('+res.data+')');
					// 	console.log(lantern[0].meslist);
					// 	this.RECORD_USERINFO(lantern[0].meslist);
					// });
                        // 统计
						// console.log("adadk0");
      //                   uni.report('lgoin',{
      //                       'login_type': this.is_pwd,
      //                       'account': this.userName,
      //                       'name': res.data.realname,
      //                       'age': res.data.sex,
      //                       'message': res.data.message
      //                   }); */
      //                   // 记录用户信息
						
						// /* console.log(res.data);
      //                   this.TOKEN_USERUPDATA(res.data.token);
      //                   this.RECORD_USERINFO(res.data);
						
      //                   this.btnLoading = false; 
       //                  uni.showToast({title: '登录成功！'});
       //                  setTimeout(function(){
							
       //                      /**
       //                       * 强制登录时使用reLaunch方式跳转过来
       //                       * 返回首页也使用reLaunch方式
       //                       */
       //                      if (this.forcedLogin) {
       //                          router.reLaunch('/pages/tabBar/home/home')
       //                      } else {
       //                          router.navigateBack();
       //                      }
       //                  },1200);
       //              }, err => {
       //                  this.messageTxt = err.message;
       //                  this.btnLoading = false;
       //              });
               }else{
                    postLoginPhone({'account': this.userName, 'sec_key': this.secCodekey, 'sec_code': this.userPwd,'client':clientId}).then(res => {
                        // 统计
                        uni.report('lgoin',{
                            'client': clientId,
                            'login_type': this.is_pwd,
                            'account': this.userName,
                            'age': res.data.sex,
                            'message': res.data.message
                        });
                        // 记录用户信息
                        this.TOKEN_USERUPDATA(res.data.token);
                        this.RECORD_USERINFO(res.data);
                        this.btnLoading = false;
                        uni.showToast({title: '登录成功！'});
                        setTimeout(function(){
                            /**
                             * 强制登录时使用reLaunch方式跳转过来
                            * 返回首页也使用reLaunch方式
                             */
                            if (this.forcedLogin) {
                                router.reLaunch('/pages/tabBar/home/home')
                            } else {
                                uni.navigateBack();
                            }
                       },1200);
                    }, err => {
                        this.messageTxt = err.message;
                        this.btnLoading = false;
                    });
                }
            },
            close() {
               // #ifdef APP-PLUS
                uni.navigateBack();
                // #endif
               // #ifndef APP-PLUS
                let tabBarItem = ['/pages/tabBar/home/home','/pages/tabBar/sail/sail','','/pages/tabBar/pallet/pallet','/pages/tabBar/profile/profile'];
               router.switchTab(tabBarItem[localStorage.getStore('tabBarIndex')]);
                // #endif
           },
            goPage(link){
                router.navigateTo(link);
           }
       }
   }
</script>

<style lang="scss">
    @import "@/style/mixin/flex.scss";
    @import "@/style/page/form.scss";
    
	.page{
        @include flex(null, center, column);
	}
    
    .close{
        @include flex-self(null, top);
    }
    
    .logo{
        flex: auto;
        @include flex(end, center, column);
        position: relative;
        width: 100%;
	
        &__sky{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        
        &__img{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 750rpx;
            height: 520rpx;
            z-index: -1;
        }
    }
	
	.name{
        flex: auto;
        @include flex(center, bottom);
        width: 100%;
        padding: 0 0 156rpx;
        line-height: 1;
        font-size: 48rpx;
        font-weight: 700;
        color: #fff;
        
        &__span{
            height: 38rpx;
            width: 6rpx;
            margin: 0 14rpx;
            background-color: #fff;
            border-radius: 2rpx;
        }
	}
	
	.form{
        box-sizing: border-box;
        width: 690rpx;
        padding: 54rpx 54rpx $uni-spacing-col-base;
        margin-top: -112rpx;
        margin-bottom: 72rpx;
        background-color: #fff;
        border-radius: $uni-border-radius-lg;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.pageTips{
        width: 100%;
        font-size: 22upx;
        color: $uni-color-warning;
        text-align: left;
        line-height:40upx;
        padding-bottom: $uni-spacing-col-base;
        
        &--error{
            color: $uni-color-error;
        }
	}
    
    .link{
        @include flex(between);
        padding-bottom: $uni-spacing-col-lg * 1.5;
        
        &__switch{
            color: $uni-color-primary;
            font-size: $uni-font-size-sm;
            padding: $uni-spacing-col-sm 0;
        }
        
        &__helper{
            color: $uni-text-color-grey;
            font-size: $uni-font-size-sm;
            padding: $uni-spacing-col-sm 0;
        }
    }
    
    .btn{
        font-size: $uni-font-size-lg;
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-bottom: $uni-spacing-col-lg * 1.5;
        
        &[type=default]{
            background-color: transparent;
        }
        &[type=primary]{
            background-color: $color-main !important;
        }
    }
    
    .icon-eye{
        width: 22px;
        height: 100%;
        padding: 0 10px;
    }
    
    .copyright{
        padding: $uni-spacing-col-lg 0;
        color: $uni-text-color;
        text-align: center;
        font-size: $uni-font-size-sm;
    }
</style>
