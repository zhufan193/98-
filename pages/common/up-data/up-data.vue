<template>
	<view class="page">
		<image class="logo" src="/static/img/logo.png" mode="aspectFit"></image>
        <view class="head">
            <view class="title">
                {{version.title}}
            </view>
            发现新版本
        </view>
        <scroll-view class="note" scroll-y :style="{height: height + 'px'}">
            <view style="padding-bottom: 8px;">当前版本:{{currentVersions}}</view>
            <rich-text class="rich" :nodes="version.note"></rich-text>
        </scroll-view>
        <button v-if="!onSwitch" class="btn" type="primary" @tap="_btn">立即更新</button>
        <view v-else class="progress" stroke-width="2" activeColor="#0091E6" backgroundColor="#c0c0c0">
            <view class="progress__text" :style="{'margin-left': progress + '%'}">{{progress}}%</view>
            <progress :percent="progress" />
        </view>
        <uni-popup :show="is_popup !== ''" position="middle" mode="fixed">
            <view class="popup__text" v-if="is_popup === 'ios_ok'">请重启软件完成更新！</view>
            <view class="popup__text" v-if="is_popup === 'error'">版本过低，请重新下载安装！</view>
            <view class="popup__btn" v-if="is_popup === 'error'" @tap="_openURL">下载</view>
        </uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import { mapState } from 'vuex';

	export default {
        components: {
            uniPopup
        },
		data() {
			return {
                height: 0,
                onSwitch: false,
				progress: 0,
                currentVersions: '',
                is_popup: ''
            };
		},
        computed: mapState(['version']),
        onLoad() {
            let that = this;
            // #ifdef APP-PLUS
            plus.runtime.getProperty(plus.runtime.appid, function(res){
                that.currentVersions = res.version;  
            });
            // #endif
        },
        onReady() {
            this.height = uni.getSystemInfoSync().windowHeight - 284;
        },
        onHide() {
            if (this.is_popup !== '') {
                this.is_popup = '';
            }
        },
        onBackPress() {
            if (this.is_popup !== '') {
                this.is_popup = '';
                return true;
            }
        },
        methods: {
            _btn() {
                let resultVersions = this.version.version.split('.');  
                let currentVersions = this.currentVersions.split('.');
                let url = '';
// console.log(currentVersions, resultVersions)
                if(parseInt(currentVersions[0]) < parseInt(resultVersions[0]) || (parseInt(currentVersions[0]) == parseInt(resultVersions[0]) && parseInt(currentVersions[1]) < parseInt(resultVersions[1]))){
                    // 大版本更新（SDK有修改必须更新整包）
                    url = this.version.url;
                    // ios更新
                    if (uni.getSystemInfoSync().platform == "ios") {
                        // HelloH5应用在appstore的地址:'itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8'
                        plus.runtime.openURL(url);  
                        return;
                    }
                }else{
                    // 小版本更新（wgt）
                    url = this.version.hot_url;
                }
                this.onSwitch = true;
// console.log(uni.getStorageSync('fileBaseUrl') + url);
                uni.showLoading({
                    title: '下载中...',
                    mask: true
                });
                let that = this;
                const downloadTask = uni.downloadFile({
                    url: url, //仅为示例，并非真实的资源
                    success: (res) => {
                        if (res.statusCode === 200) {
                            uni.hideLoading();
// console.log(res)
                            // console.log('下载成功');
                            // 安装
                            plus.runtime.install(res.tempFilePath, {  
                                force: false  
                            }, function() {  
                                console.log('install success...');  
                                uni.setStorageSync('launchFlag', false);
                                if (uni.getSystemInfoSync().platform == "ios") {
                                    that.is_popup = 'ios_ok';
                                }else{
                                    plus.runtime.restart();  
                                }
                            }, function(e) {  
                                console.error('install fail...');  
                                console.error(JSON.stringify(e));  
// console.log(e)               
                                that.is_popup = 'error';
                            });
                        }
                    }
                });
                // 监听下载
                downloadTask.onProgressUpdate((res) => {
                    this.progress = res.progress;
                });
            },
            _openURL(){
                plus.runtime.openURL(this.version.url);  
            }
        }
	}
</script>

<style lang="scss">
    page, .page{
        height: 100%;
    }
    
    .page{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 $uni-spacing-row-lg 20px;
        background-color: #fff;
    }
    
    .logo{
        flex: none;
        margin-top: 32px;
        width: 96px;
        height: 96px;
    }
    
    .head{
        flex: none;
        padding: 16px 0;
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
        text-align: center;
    }
    
    .title{
        font-size: 20px;
        font-weight: bold;
        color: $uni-text-color;
    }
    
    .note{
        position: relative;
        box-sizing: border-box;
        margin-bottom: 16px;
        padding: $uni-spacing-col-lg $uni-spacing-row-lg;
        font-size: $uni-font-size-paragraph;
        color: $uni-color-paragraph;
        background-color: $uni-bg-color-grey;
        border-radius: $uni-border-radius-sm;
    }
    
    .rich{
        height: 100%;
    }
    
    .btn{
        flex: none;
        width: 100%;
    }
    
    .progress{
        flex:none;
        width: 100%;
        
        &__text{
            display: inline-block;
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
            transform: translateX(-50%);
        }
    }
    .uni-popup-middle.uni-popup-fixed{
        padding: $uni-spacing-col-base 0 0 !important;
        overflow: hidden;
    }
    .popup__text{
        color: $uni-text-color;
        font-size: 14px;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        margin-bottom: $uni-spacing-col-base;
        width: 300rpx;
    }
    .popup__btn{
        color: #fff;
        background-color: $uni-color-primary;
        font-size: 16px;
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
    }
</style>
