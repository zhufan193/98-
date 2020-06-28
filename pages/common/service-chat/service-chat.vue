<template>
	<view>
        <view class="statusBarHeight">
            <uni-status-bar></uni-status-bar>
        </view>
		<web-view :src="url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
    import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
    
    import { mapState } from 'vuex';
    
    var wv;
    
	export default {
        components: {
            uniStatusBar
        },
		data() {
			return {
				url: ''
			}
		},
        computed: mapState(['hasLogin', 'userInfo']),
		onLoad(options) {
            let clientId = '', otherParams = '';
            if(this.hasLogin){
                clientId = this.userInfo.account;
                otherParams = JSON.stringify({
                    "nickName": this.userInfo.realname ? this.userInfo.realname : this.userInfo.nickName
                })
            }
            this.url = 'https://ykf-webchat.7moor.com/wapchat.html?accessId=07ed8c10-eccd-11e9-9074-e7fb59c60219&fromUrl=mobileApp&urlTitle=&clientId=' + clientId + '&otherParams=' + otherParams;
        },
        // #ifdef APP-PLUS
        onReady() {
            var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
            setTimeout(function() {
                let height = uni.getSystemInfoSync().statusBarHeight;
                let width = uni.getSystemInfoSync().windowWidth;
                wv = currentWebview.children()[0];
                wv.setStyle({top: height, bottom: 0});
                let wTitle = new plus.nativeObj.View('title', {top:  height + 'px', left: width / 2 - 56 + 'px', height: '44px', width: '112px'},
                    [{tag: 'font', id: 'font', text: '运有方在线客服', position: {top:'2px',left:'0px',width:'100%',height:'100%'},textStyles:{size:'16px', color: '#ffffff'}}]);
                currentWebview.append(wTitle);
                let wBack = new plus.nativeObj.View('wback',{top: height + 'px',left:'0px',height:'44px',width:'44px'},
                    [{tag: 'img', id: 'img', src: '/static/icon/back.png', position: {top:'13px',left:'11px',width:'22px',height:'22px'}}]);
                wBack.addEventListener("click", function(){
                    uni.navigateBack();
                }, false);
                currentWebview.append(wBack);
            }, 300);
        },
        // #endif
        methods:{
            handleMessage(evt) {
                console.log(evt);
                console.log(evt.detail.data);
            }
        }
	}
</script>

<style lang="scss">
    .statusBarHeight{
        width: 100%;
        background-color: $color-main;
    }
</style>
