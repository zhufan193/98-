<template>
	<view class="page">
			<uni-swiper-dot :info="swiperData" :current="swiperCurrent" mode="long">
				<swiper class="swiper-box" autoplay="true" circular="true" @change="onChangeSwiper">
					<swiper-item class="swiper-item" v-for="(item ,index) in swiperData" :key="index" @tap="goBanner(item)">
						<image :src="item.img" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		
		
		<view style="display: flex;flex-direction:row;padding: 20upx 0;background-color: #ffffff;margin-bottom: 20upx;">
			<view class="select-class" @tap="selecta"><text :class="[ispumpa ? 'pump' : 'unpump']">全部</text></view>
			<view class="select-class" @tap="selectb"><text :class="[ispumpb ? 'pump' : 'unpump']">长江-内河</text></view>
			<view class="select-class" @tap="selectc"><text :class="[ispumpc ? 'pump' : 'unpump']">江海联运</text></view>
		    <view class="select-class" @tap="selectd"><text :class="[ispumpd ? 'pump' : 'unpump']">海运</text></view>
		</view>
		
        <block v-for="(item, index) of dataa" :key="index">
            <wlp-card-pallet :options="item" :index="index" @click="_goDetail"></wlp-card-pallet>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
        
        <wlp-fab title="发布货盘" @click="_release()"></wlp-fab>
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import wlpCardPallet from '@/components/wlp-card/wlp-card-pallet.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, localStorage, dateUtils } from '@/common/util.js'
    import { getPalletList , secondgoodslantern ,secondgoodsnews} from '@/service/getData.js'
    
    import { mapState, mapMutations } from 'vuex';
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
	export default {
        components:{
            wlpFab,
            wlpCardPallet,
            uniLoadMore,
			uniSwiperDot
        },
		data() {
			return {
                dataa: [],
                page: 1,
                loadingType: 'more',
                cargo_type: '',
                departure_na: '',
                departure_area: '',
                target_na: '',
                target_area: '',
                weight: '',
                dateStr: '',
				swiperData: [],
				ispumpa:true,//点击筛选处按钮的变（刚进入默认全选）
				ispumpb:false,//点击筛选处按钮的变化
				ispumpc:false,//点击筛选处按钮的变化
				ispumpd:false,//点击筛选处按钮的变化
				swiperCurrent: 0,//幻灯片绑定
			};
		},
        computed: mapState(['hasLogin', 'screenTemp']),
        async onLoad() {
            toast.loading();
            await this.getData('init');
			this.uploada();
            toast.hideLoading();
        },
        onShow() {
            // #ifdef APP-PLUS
			this.getData();
         
           /* localStorage.setStore('tabbar_login', 'false');
            var tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if (tabBar_Login && !this.hasLogin) {
                tabBar_Login.show();
            }
            // #endif
            // 记录当前tabBarIndex
            localStorage.setStore('tabBarIndex', 3);
            // 筛选数据获取
            if(this.screenTemp.hasOwnProperty('pallet') && this.screenTemp.pallet.init){
                let screen = this.screenTemp.pallet;
                this.cargo_type = screen.cargoTypeId;
                this.departure_na = screen.departure_na;
                this.departure_area = screen.departure_area;
                this.target_na = screen.target_na;
                this.target_area = screen.target_area;
                this.weight = screen.weight;
                this.dateStr = screen.dateStr;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'pallet',
                    pallet: screen
                })
                this.getData();
            } */
        },
        onHide() {
            // #ifdef APP-PLUS
            var tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            let tabbarLogin = localStorage.getStore('tabbar_login');
            if (tabBar_Login && tabbarLogin === 'false') {
                tabBar_Login.hide();
            }
            // #endif
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            router.navigateTo('/pages/pallet/screen/screen');
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
		methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
            _release(url) {
                // if(!this.hasLogin){
                //     this.GOPAGE_LOGIN();
                //     return;
                // }
                router.navigateTo('/pages/pallet/release/release');
            },
            _goDetail(param) {
				// 需要判断是否角色认证
				//船东未认证进入的页面
				//router.navigateTo('/pages/sail/register/ship-files');
				//船东认证进入的页面
				console.log(this.dataa[param.index]);
                 router.navigateTo('/pages/pallet/detail/detail?id=' + this.dataa[param.index].id);
            },
            getData(type='DownRefresh') {
				
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                let send = {
                    "type":"hylisttj",
					"uid":"1",
					"bzid":"0",
					"hyid":"0",
					"qd":"",
					"zd":"",
					"page":this.page,
					"size":"6",
                };
                secondgoodsnews({data:send}).then(res => {
					console.log('dsada');
                    if(this.page == 1){
						let news = eval('('+res.data+')');
						this.dataa = news[0].meslist;
                    }else{
						let news = eval('('+res.data+')');
                        this.dataa = this.dataa.concat(news[0].meslist);
                    }
                    if(type == 'DownRefresh'){
                        uni.stopPullDownRefresh();
                        toast.hideLoading();
                    }
					let newsa = eval('('+res.data+')');
                    if(newsa[0].meslist.length < 6){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page ++;
                    }
                })
            },
			boat(index){
				this.boatindex=index;
			},
			selecta(){
				this.ispumpa=true;
				this.ispumpb=false;
				this.ispumpc=false;
				this.ispumpd=false;
			},
			selectb(){
				this.ispumpa=false;
				this.ispumpb=true;
				this.ispumpc=false;
				this.ispumpd=false;
			},
			selectc(){
				this.ispumpa=false;
				this.ispumpb=false;
				this.ispumpc=true;
				this.ispumpd=false;
			},
			selectd(){
				this.ispumpa=false;
				this.ispumpb=false;
				this.ispumpc=false;
				this.ispumpd=true;
			},
			onChangeSwiper(e){
			    this.swiperCurrent = e.detail.current;
			},
			goBanner(obj) {
			    // 统计
			    uni.report('homeBanner', JSON.stringify(obj));
			    this.goPage(obj.link);
			},
			uploada(){
				 var that = this ;
				 uni.getStorage({
					 key: 'palleta',
					 complete: function (res) {
						 if(res.data.length > 0){	
							 that.swiperData = res.data;
							 console.log(that.swiperData[0].img);
						 }
						 else{
							 console.log(res.data.length);
							 console.log(res.data);
							 console.log(res.data);
							 that.uploadlantern();
						 }	
					 }
				 })
			},
			uploadlantern(){
								secondgoodslantern({data:{"type":"hdp","lx":"51"}}).then(res => {
								var lantern = eval('('+res.data+')');
								console.log('接口返回数据：'+JSON.stringify(lantern[0].meslist));
								var that = this;
								
										// 清空缓存数组
										that.swiperData = [];
										var imgurl = lantern[0].meslist;
										for(var i = 0; i<imgurl.length;i++){
											uni.downloadFile({
											    url: imgurl[i].img, //仅为示例，并非真实的资源
											    success: (res) => {
											        if (res.statusCode === 200) {
														that.swiperData.push({"img":res.tempFilePath});
														console.log("下载图片成功:"+"0000000000000"+JSON.stringify(that.swiperData));
														if(i == imgurl.length){
															console.log(that.swiperData);
															uni.setStorage({
												               key: 'palleta',
												               data: that.swiperData,
												               success: function () {}
											                });
														}
												}
												
														}
												});
											}
											
											
											});	
										
			},
        }
	}
</script>

<style lang="scss">
	@import '@/style/mixin/flex.scss';
	@import '@/style/mixin/hr.scss';
	@import '@/style/page/banner.scss';
	
	.swiper-box {
		height: 100%;
		background: #eee;
		color: #fff;
	    
	    image {
	    	width: 100%;
	    	height: 100%;
	    }
	}
	.select-class{
		text-align: center;	
		margin: auto;
	}
	.pump{
		background-color: #3c81df;
		font-size: 36upx;
		color: #ffffff;
		padding: 10upx 20upx;
		border-radius: 5upx;
		border: 1upx;
	}
	.unpump{
		color:#000000;
		font-size: 36upx;
		padding: 10upx 20upx;
	}
	.swiper-box {
		height: 100%;
		background: #eee;
		color: #fff;
	    
	    image {
	    	width: 100%;
	    	height: 100%;
	    }
	}
</style>
