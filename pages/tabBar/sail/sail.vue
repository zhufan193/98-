<template>
    <view class="page">		
	    <uni-swiper-dot :info="swiperData" :current="swiperCurrent" mode="long">
	    	<swiper class="swiper-box" autoplay="true" circular="true" @change="onChangeSwiper">
	    		<swiper-item class="swiper-item" v-for="(item ,index) in swiperData" :key="index" @tap="goBanner(item)">
	    			<image :src="item.img" mode="aspectFill" />
	    		</swiper-item>
	    	</swiper>
	    </uni-swiper-dot>
		
		<view  class="view-title line">
			<select-picker :option="array" v-on:greet="boat" class="select-picker-class"></select-picker>
			<select-picker :option="transportarray" v-on:greet="boat" class="select-picker-class"></select-picker>
			<select-picker :option="storearray" v-on:greet="boat" class="select-picker-class"></select-picker>
		</view>
		
		<view class="view-title first-color">
			<view v-if="isgotwo == false" @click="go" :class="[isout ? 'view-out' : 'view-two']">
				<view v-if="isout" style="font-size: 30upx;">选择船舶发出港</view><view v-if="!isout">{{provinc}}</view>
			</view>
			<view v-else  :class="[isout ? 'view-out' : 'view-two']">
				<view v-if="isout" style="font-size: 30upx;">选择船舶发出港</view><view v-if="!isout">{{provinc}}</view>
			</view>
			
			<view v-if="isgo == false" @click="gotwo" :class="[isin ? 'view-out' : 'view-two']">
				<view v-if="isin" style="font-size: 30upx;">选择船舶到达港</view><view v-if="!isin">{{provinctwo}}</view>
			</view>
			<view v-else  :class="[isin ? 'view-out' : 'view-two']">
				<view v-if="isin" style="font-size: 30upx;">选择船舶到达港</view><view v-if="!isin">{{provinctwo}}</view>
			</view>
		</view>
		
		<view>
			<view v-if="isgo">
				<province-select style="font-size: 30upx;" :isgo.sync="isgo" v-on:greet="_isgo" v-on:provinc="getProvince"></province-select></view>
			 <view v-if="isgotwo">
				<province-select  style="font-size: 30upx;" :isgo.sync="isgotwo" v-on:greet="_isgotwo" v-on:provinc="getProvincetwo"></province-select>
			</view>
		</view>
		
		<block v-for="(item, index) of dataa" :key="index">
            <wlp-card-sail :options="item" :index="index" @click="_goDetail"></wlp-card-sail>
        </block>
        <uni-load-more :status="loadingType"></uni-load-more>
        
        <wlp-fab title="发布船期" @click="_release()"></wlp-fab>
    </view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import wlpCardSail from '@/components/wlp-card/wlp-card-sail.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import selectPicker from '@/components/select-picker/select-picker.vue';
	import provinceSelect from '@/components/province-select/province-select.vue';

    import { router, toast, localStorage, dateUtils } from '@/common/util.js';
    import {secondboatlantern , getSailList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';

    export default {
        components: {
			uniSwiperDot,
            wlpFab,
            wlpCardSail,
            uniLoadMore,
			selectPicker,
			provinceSelect
        },
        computed: mapState(['hasLogin', 'screenTemp']),
        data() {
            return {
                dataa: [
					{ship_name:"东风",
					ship_type:"工程船",
					load_amount:9,
					resDate:6-25,
					resEmpty:34,
					departure_na:"中山",
					target_na:"待定",
						
					},
					{ship_name:"东风",
					ship_type:"工程船",
					load_amount:9,
					resDate:6-25,
					resEmpty:34,
					departure_na:"中山",
					target_na:"待定",
						
					},
					{ship_name:"东风",
					ship_type:"工程船",
					load_amount:9,
					resDate:6-25,
					resEmpty:34,
					departure_na:"中山",
					target_na:"待定",
						
					},
					{ship_name:"东风",
					ship_type:"工程船",
					load_amount:9,
					resDate:6-25,
					resEmpty:34,
					departure_na:"中山",
					target_na:"待定",
						
					}
				],
                page: 1,
                loadingType: 'more',
                searchValue: '',
                departure_na: '',
                target_na: '',
                weight: '',
                dateStr: '',
				swiperData: [],
			  array: ['船舶类型', '不限', '散货船', '散装水泥船','杂货船','集装箱船','拖队','油船','化学品船','液化气船','滚装船','多用途船','捕捞船','冷藏船','其他船'],
			  boatindex:'',
			  transportarray:['航运类型','不限','长江-内河','江海联运','海运'],
			  transportindex:'',
			  storearray:['封仓形式','不限','无封仓','简易封仓','自动封仓'],
			  storeindex:'',
			  isgo:false,   //判断显示出发港地址选择组件
			  provinc:'',   //接收显示出发港
			  isout:true,   //判断显示出发港还是选择的地点
			  isgotwo:false, //判断显示目的港地址选择组件
			  provinctwo:'', //接收目的港
			  isin:true,
			  swiperCurrent: 0,//幻灯片
            };
        },
        async onLoad() {
			this.uploada();
	        toast.loading();
            // 导航条搜索清空
            localStorage.setStore('search_value_sail', '');
            await this.getData('init');
            toast.hideLoading();
        },
        onShow() {
            // #ifdef APP-PLUS
            localStorage.setStore('tabbar_login', 'false');
            var tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if (tabBar_Login && !this.hasLogin) {
                tabBar_Login.show();
            }
            // #endif
            // 记录当前tabBarIndex
            localStorage.setStore('tabBarIndex', 1);
            // 搜索页返回数据获取
            let _searchValue = localStorage.getStore('search_value_sail');
            if (_searchValue != this.searchValue) {
                let currentWebview = this.$mp.page.$getAppWebview();
                currentWebview.setTitleNViewSearchInputText(_searchValue);
                this.searchValue = _searchValue;
                this.getData();
            }
            if(this.screenTemp.hasOwnProperty('sail') && this.screenTemp.sail.init){
                let screen = this.screenTemp.sail;
                this.departure_na = screen.departure_na;
                this.target_na = screen.target_na;
                this.weight = screen.weight;
                this.dateStr = screen.dateStr;
                screen.init = false;
                this.SCREEN_TEMP({
                    field: 'sail',
                    sail: screen
                })
                this.getData();
            }
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
            router.navigateTo('/pages/sail/screen/screen');
        },
        onNavigationBarSearchInputClicked() { // 标题栏搜索框点击事件
            router.navigateTo('/pages/common/search/search', {
                type: 'sail',
                placeholder: '搜索船名、呼号、MMSI或IMO',
                value: this.searchValue
            });
        },
        onPullDownRefresh() { // 下拉刷新
            this.getData();
        },
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
			boat(index){
				this.boatindex=index;
			},
            _release() {
                // if(!this.hasLogin){
                //     this.GOPAGE_LOGIN();
                //     return;
                // }
				 toast.show('跳转到船舶注册页面');
                 router.navigateTo('/pages/sail/register/register');
	        //toast.show('跳转到船舶发布页面');
	        //router.navigateTo('/pages/sail/release/release');
            },
            _goDetail(param) {
				// console.log("param.index"+param);
    //             router.navigateTo('/pages/sail/detail/detail?id=' + this.data[param.index].id);
				router.navigateTo('/pages/sail/detail/detail');
            },
			go(){
				this.isgo=true;
				console.log("dadfasf");
				this.isout=true;
			},
			_isgo(isgo){
				this.isgo=isgo;
			},
			getProvince(province){
				this.provinc=province;
				this.isout=false;
				
			},
			gotwo(){
				this.isgotwo=true;
				this.isin=true;
			},
			_isgotwo(isgotwo){
				this.isgotwo=isgotwo;
				this.isgetin = true;
			},
			getProvincetwo(province){
				this.provinctwo=province;
				this.isin=false;
				
			},
			uploada(){
				 var that = this ;
				 uni.getStorage({
					 key: 'saila',
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
								secondboatlantern({data:{"type":"hdp","lx":"52"}}).then(res => {
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
												               key: 'saila',
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
			onChangeSwiper(e){
			    this.swiperCurrent = e.detail.current;
			},
             getData(type = 'DownRefresh') {
                if (type == 'DownRefresh') {
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if (type == 'ReachBottom') {
                    if (this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                let send = {
                    departure_na: this.departure_na,
                    target_na: this.target_na,
                    weight: this.weight,
                    date: this.dateStr.length > 10 ? this.dateStr : (this.dateStr + ',' + this.dateStr),
                    page: this.page
                };
                getSailList(send).then(res => {
                    for(let i = 0, len = res.data.length; i < len; i++){
                        res.data[i].resDate = dateUtils.format(res.data[i].updated_at);
                    }
                    if (this.page == 1) {
                        this.data = res.data;
                    } else {
                        this.data = this.data.concat(res.data);
                    }
                    if (type == 'DownRefresh') {
                        uni.stopPullDownRefresh();
                        toast.hideLoading();
                    }
                    if(res.data.length < 15){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page ++;
                    }
                });
            }
        }
    };
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
	.select-picker-class{
		margin: auto;
		text-align: center;
		background-color:#ffffff ;	
	}
	.view-title{
		display: flex;
		flex-direction:row;
		background-color:#ffffff;
		font-size: 45upx;
	}
	.line{
		margin-bottom: 20upx;
	}
	.first-color{
		color: #000000;
	}
	.view-out{
		width: 50%;
		text-align: center;
		margin:20upx 0;
		color: #000000;
	}
		
	.view-two{
		width: 50%;
		text-align: center;
		margin:20upx 0;
		color: #007AFF;
	}
</style>
