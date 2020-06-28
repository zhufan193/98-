<script>
    import { localStorage } from '@/common/util.js';
    import errorLog from '@/config/errorLog.js';
    
    import { mapActions, mapMutations } from 'vuex';
    
	export default {
        methods: {
            ...mapActions(['getUserInfo']),
        },
		onLaunch: function() {
			console.log('App Launch')
            // #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定 
            // #endif
		},
		onShow: function() {
			console.log('App Show')
            if(localStorage.getStore('loginToken') != '' && localStorage.getStore('loginToken') != this.$store.state.token){
                // console.log('用户信息更新-----App_token:' + localStorage.getStore('loginToken').slice(-4) + ':' + this.$store.state.token.slice(-4))
                // 用户信息更新
                this.getUserInfo();
            }
		},
		onHide: function() {
			console.log('App Hide')
		},
        onError: function(err) {
			console.log('App Error')
            errorLog({type:"error", url: 'app.vue onError', res: err});
        }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
    /* #ifndef APP-PLUS-NVUE */
    @import './style/uni.css';
    @import './style/base.scss';
    /* #endif */
</style>
