<template>
	<view class="content">
		<swiper v-if="value == false" class="swiper">
			<swiper-item>
                <view class="swiper-item">
                    <image class="swiper-item-img" src="/static/img/launch_1.png" mode="aspectFill"></image>
                </view>
			</swiper-item>
			<swiper-item>
                <view class="swiper-item">
                    <image class="swiper-item-img" src="/static/img/launch_2.png" mode="aspectFill"></image>
                </view>
			</swiper-item>
			<swiper-item>
                <view class="swiper-item">
                    <image class="swiper-item-img" src="/static/img/launch_3.png" mode="aspectFill"></image>
                </view>
			</swiper-item>
			<swiper-item>
                <view class="swiper-item">
                    <image class="swiper-item-img" src="/static/img/launch_4.png" mode="aspectFill"></image>
                    <view class="jump-over" @tap="_clickPopup()"></view>
                </view>
			</swiper-item>
		</swiper>
        
        <uni-popup :show="is_popupShow" position="middle" mode="fixed">
            <view class="popup">
                <view class="popup__title">用户协议及隐私政策</view>
                <view class="popup__content">
                    <view class="popup__p">感谢你选择使用运有方APP,我们将通过《用户协议及隐私政策》帮助您了解我们收集、使用、存储和共享个人信息的情况，以及您所享有的相关权力。</view>
                    <view class="popup__p">您可以通过阅读完整版<text class="popup__link" @click="goPage('/pages/common/rich-text/rich-text?type=user_agreement')">《用户协议及隐私政策》</text>，了解个人信息类型与用途的对应关系等更加详尽的个人信息处理规则。</view>
                    <view class="popup__p">如您同意，请点击“同意”开始接受我们的服务。</view>
                </view>
                <view class="popup__foot">
                    <view class="popup__btn" @click="close()">暂不使用</view>
                    <view class="popup__btn popup__btn--red" @click="launchFlag()">同意并继续</view>
                </view>
            </view>
        </uni-popup>
	</view>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    
	export default {
        components: {
            uniPopup
        },
		data() {
			return {
                is_popupShow: false,
                value: null
			}
		},
		onLoad(){
            this.loadExecution();
		},
		methods: {
            goPage(url){
                uni.navigateTo({
                    url: url
                })
            },
            _clickPopup(){
                // 首次启动用户协议
                this.is_popupShow = true;
            },
			loadExecution: function(){
				/**
				 * 获取本地存储中launchFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				try {
				    this.value = uni.getStorageSync('launchFlag');
				    if (this.value && this.value == true) {
                        uni.switchTab({
                            url: '/pages/tabBar/home/home'
                        });
				    }else{
                        this.value = false;
                        // #ifdef APP-PLUS
                        setTimeout(function() {
                            plus.navigator.closeSplashscreen();
                        }, 700);
                        // #endif
                    }
				} catch(e) { 
					// error 
                    this.value = true;
                    uni.setStorage({
                        key: 'launchFlag',
                        data: true,
				        success: function() {
							console.log('error存储launchFlag');
                            // #ifdef APP-PLUS
                            plus.navigator.closeSplashscreen();
                            // #endif
						}
                    });
				}
			},
			launchFlag: function(){
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
                this.is_popupShow = false;
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				    success: function() {
						console.log('guide存储launchFlag');
                        uni.switchTab({
                       url: '/pages/tabBar/home/home'
                        });
					}
				});
			},
            close: function(){
                if(uni.getSystemInfoSync().platform == 'android'){
                    plus.runtime.quit(); 
                }else{
                    plus.ios.import("UIApplication").sharedApplication().performSelector("exit"); 
                }
            }
		}
	}
</script>
<style lang="scss">
	page,
	.content,
    .swiper,
    swiper-item,
    .swiper-item,
    .swiper-item-img{
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		position: relative;
	}
    .jump-over{
        position: absolute;
        bottom: 31%;
        left: 0;
        right: 0;
        height: 90rpx;
        margin: 0 160rpx;
    }
    .popup{
        display: flex;
        flex-direction: column;
        background-color: #fff;
        width: 240px;
        
        &__title{
            color: $uni-color-title;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            margin-bottom: $uni-spacing-col-base;
        }
        &__content{
            margin-bottom: $uni-spacing-col-base;
        }
        &__p{
            color: $uni-color-paragraph;
            margin-bottom: $uni-spacing-col-sm;
        }
        &__link{
            color: $uni-color-warning;
        }
        &__foot{
            display: flex;
        }
        &__btn{
            flex: auto;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            color: $uni-color-warning;
            background-color: #eee;
            border-radius: $uni-border-radius-base;
            
            &--red{
                color: #eee;
                background-color: $uni-color-warning;
                margin-left: 10px;
            }
        }
    }
    
</style>


