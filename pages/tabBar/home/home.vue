<template>
	<view class="page">
        <view class="is_compile" v-if="is_compile">测试网络</view>
		<uni-swiper-dot :info="swiperData" :current="swiperCurrent" mode="long">
			<swiper class="swiper-box" autoplay="true" circular="true" @change="onChangeSwiper">
				<swiper-item  class="swiper-item" v-for="(item ,index) in swiperData" :key="index" @tap="goBanner(item)">
					<image :src="item.img" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
        <view class="boxTop">
            <view class="grid">  
                <view class="grid__item" @tap="goPage('/pages/oil/tabbar/tabbar')">
                    <image class="grid__img" src="/static/icon/home-grid-5.png" mode="aspectFit"></image>
                    <view class="grid__title">燃油供应</view>
                    <view class="grid__note">优质燃料供应</view>
                </view>
                <view class="grid__item" @tap="goPage('/pages/map/mapmatch/matching')">
                    <image class="grid__img" src="/static/icon/home-grid-4.png" mode="aspectFit"></image>
                    <view class="grid__title">匹配推荐</view>
                    <view class="grid__note">优质船货信息</view>
                </view>
                <view class="grid__item" @tap="goPage('/pages/map/map_search/map_search')">
                    <image class="grid__img" src="/static/icon/home-grid-2.png" mode="aspectFit"></image>
                    <view class="grid__title">船舶定位</view>
                    <view class="grid__note">船舶当前位置</view>
                </view>
                <view class="grid__item" @tap="goPage('/pages/common/web-store/web-store')">
                    <image class="grid__img" src="/static/icon/home-grid-8.png" mode="aspectFit"></image>
                    <view class="grid__title">新闻资讯</view>
                    <view class="grid__note">航运相关新闻</view>
                </view>
				<view class="grid__item" @tap="goPage('/pages/common/web-store/web-store')">
				    <image class="grid__img" src="/static/icon/home-grid-6.png" mode="aspectFit"></image>
				    <view class="grid__title">水马商城</view>
				    <view class="grid__note">最高优惠50%</view>
				</view>
				<view class="grid__item" @tap="goPage('/pages/common/web-store/web-store')">
				    <image class="grid__img" src="/static/icon/home-grid-3.png" mode="aspectFit"></image>
				    <view class="grid__title">公路运输</view>
				    <view class="grid__note">陆运平台</view>
				</view>
            </view>
            
            <view class="boxTop__newDay">
                <view class="boxTop__newDayItem" @tap="goTabBar('/pages/tabBar/sail/sail')">
                    <view class="boxTop__newDayRad">
                        {{sum.cycount}}
                    </view>
                    <view class="boxTop__newDayText">
                        搜船源/条
                    </view>
                </view>
                <view class="boxTop__newDayItem" @tap="goTabBar('/pages/tabBar/pallet/pallet')">
                    <view class="boxTop__newDayRad">
                       {{sum.hycount}}
                    </view>
                    <view class="boxTop__newDayText">
                        找货源/条
                    </view>
                </view>
                <view class="boxTop__newDayItem" @tap="_callPhone()">
                    <view class="boxTop__newDayBlock">
                       客服热线
                    </view>
                    <view class="boxTop__newDayText">
                    {{customer.customer_call}}
                    </view>
                </view>
            </view>
        </view>
		<view class="view-Notice">
			<view class="n-left">
				<!-- 九八公告 -->
				<image src="@/static/icon/release.png"></image>
			</view>
			<view class="n-right">
				<view  v-for="(notice,index) of noticeList" :key="index">
					{{notice.title}}
				</view>
			</view>
		</view>
        
        <view class="head">
            实用工具
        </view>
        
        <view class="content">
            <uni-grid :options="gridData1" :show-border="false" type="oblong" column-num="4" @click="onClickGrid" />
        </view>
		
		<view class="xinxi-title">
			<view class="form__label first-view" ></view>
		    <view class="form__label second-view" >最新货源推荐</view>
		</view>
		
		<view class="recommend-cla">
			<view class="class-for"  v-for="(item, index) of dataList" :key="index">
			   <view class="recommend-first" @click="_goDetail(item)">
				   <view style="font-size: 34upx;">{{item.qd}}->{{item.zd}}</view>
				   <view class="view-right">电议</view>
			   </view>
			   <view class="recommend-second" @click="_goDetail(item)">
				   <view>{{item.hw}}，</view>
				   <view>{{item.ds}}吨，</view>
				   <view>{{item.ysfs}}，</view>
				   <view>有效期:{{item.yxq}}±{{item.kq}}天</view>
			   </view>
			</view>
		</view>
		
        <view class="head">
            今日推荐
            <view class="head__note" @tap="goPage('/pages/news/tabbar/tabbar')">
                更多
                <uni-icons type="arrowright" color="#999" size="12"></uni-icons>
            </view>
        </view>
        
        <view class="news">
            <block v-for="(newsitem,index) in newsa" :key="index">
            	<media-list :options="newsitem" :index="index" @click="goPage('/pages/news/detail/detail', {id: newsitem.id})"></media-list>
            </block>
            <uni-load-more :status="loadingType"></uni-load-more>
        </view>
        
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import mediaList from '@/components/tab-nvue/mediaList.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import wlpCardPallet from '@/components/wlp-card/wlp-card-pallet.vue';
    import { is_compile } from '@/config/env.js';
    import {router, toast, localStorage} from '@/common/util.js';
    import permision from '@/common/permission.js';
	import {secondgetInit,secondrecommend,secondnotice,secondmainlantern,secondsum,secondnews, getInit, getHome, getNewsList} from '@/service/getData';
    
    import { mapState, mapMutations } from 'vuex';
    
	
    var is_pushReceive = false; // 禁用推送消息和通知消息同时传入
    var pushData = "";
	function lookPush(msg){
        // 分析msg.payload处理业务逻辑 
	    uni.showModal({
	        title: '通知消息',
	        content: msg.content,
	        confirmText: '查看',
	        success: (e) => {
                is_pushReceive = false;
	            if(e.confirm){
                    plus.push.clear();
	                let pages = getCurrentPages();
	                let page = pages[pages.length - 1];
                    if('pages/message/tabbar/tabbar' === page.route){
                        uni.redirectTo({
                            url: '/pages/message/tabbar/tabbar'
                        });
                    }else{
                        uni.navigateTo({
                            url: '/pages/message/tabbar/tabbar'
                        });
                    }
	            }
	        }
	    });
	}
    
	export default {
		components: {
            uniIcons,
			uniSwiperDot,
            uniGrid,
            mediaList,
            uniLoadMore,
			wlpCardPallet
		},
        computed: mapState(['hasLogin', 'version', 'customer']),
		data() {
			return {
                is_compile: is_compile,
                gridData1:[
					{
						image: '/static/icon/home-grid-order.png',
						text: '运价行情',
						router: '/pages/common/web-view/web-view?title=运价行情&url='+localStorage.getStore('globalUrl')+'freight_rate'
					},
					{
						image: '/static/icon/home-grid-bdi.png',
						text: 'BDI指数',
						router: '/pages/common/web-view/web-view?title=BDI指数&url='+localStorage.getStore('globalUrl')+'bdi'
					},
					{
						image: '/static/icon/home-grid-search-prot.png',
						text: '查港口',
                        router: '/pages/port/query/query'
					},
                    {
						image: '/static/icon/home-grid-search-ship.png',
						text: '船舶代理',
                        router: '/pages/agent/tabbar/tabbar'
					},
                    {
						image: '/static/icon/home-grid-ship-weixiu.png',
						text: '船舶维修',
                        router: '/pages/maintenance/tabbar/tabbar'
					},
					{
						image: '/static/icon/home-grid-peijian.png',
						text: '配件设备',
                        router: '/pages/parts/tabbar/tabbar'
					},
					{
						image: '/static/icon/home-grid-falv-zhixun.png',
						text: '法律咨询',
                        router: '/pages/law/tabbar/tabbar'
					},
					{
						image: '/static/icon/home-grid-caiwu-zhixun.png',
						text: '财务咨询',
                        router: '/pages/financial/tabbar/tabbar'
					},
					// #ifdef APP-PLUS
					{
						image: '/static/icon/home-grid-search-qixiang.png',
						text: '查气象',
                        router: '/pages/common/web-view/web-view?title=实时洋流气象数据&url=https://www.windy.com'
					},
					{
						image: '/static/icon/home-grid-search-chaoxi.png',
						text: '查潮汐',
                        router: '/pages/common/web-view/web-view?title=港口潮汐查询&url=http://wap.ocean.cnss.com.cn/'
					},
					// #endif
					{
						image: '/static/icon/home-grid-hainan.png',
						text: '海难救助',
                        router: '/pages/other/wreck_rescue/wreck_rescue'
					},
					{
						image: '/static/icon/home-grid-haishiju.png',
						text: '海事局',
                        router: '/pages/other/maritime_office/maritime_office'
					}
                ],
                
                swiperCurrent: 0,
                gridCurrent: 0,
                banner: [],
                news: [],
				newsa:[],//首页新闻推荐
                page: 1,
                loadingType: 'more',
                windowHeight: 0,
				begin:{"type":"config"},//系统接口请求参数
				mainlantern:{"type":"indeximg"},//主页幻灯片
				swiperData: [],//主页幻灯片
				sum:[],//货源信息、船源信息总数
				sumb:{"type":"indexlistcount"},//船源、货源总数接口请求参数
				dataList: [], //货源信息
				noticeList: [], // 公告信息
			}
		},
		onLoad() {
            // 初始化数据
			// 获取货源信息
			this.getDataList();
			// 获取公告信息
			this.getNotice();
			//系统参数
			secondgetInit({data:this.begin}).then(res => { 
				var lanter = eval('('+res.data+')');
			console.log(lanter);
			});
			//幻灯片接口
			this.uploada();

			 //货源总数
				secondsum({data:this.sumb}).then(res => {
			 	let lantern = eval('('+res.data+')');
				this.sum=lantern[0].meslist[0];	
			 });
			 //主页-新闻资讯
			 secondnews({data:{"type":"indexnews"}}).then(res => {
			 	let lantern = eval('('+res.data+')');
				this.newsa=lantern[0].meslist;
			 	console.log(this.newsa);
	
			 });
            getInit({os: uni.getSystemInfoSync().platform}).then(res => {
                // 获取接口地址
				console.log(res);
                localStorage.setStore('baseUrl', res.data.url.api + '/api/v1/');
                localStorage.setStore('fileBaseUrl', res.data.url.resource);
                localStorage.setStore('globalUrl', res.data.url.api + '/');
                // 页面首次加载数据
                this.getData();
                // 短信验证码key
				console.log("good");
				
                this.CODE_KEY_UPDATA(res.data.check_key);
                // 客服电话
				
                this.CUSTOMER_UPDATA({field: 'customer_call', customer_call: res.data.param.customer_call});
                // #ifdef APP-PLUS
                // 版本数据更新
                this.VERSION_UPDATA(res.data.version);
                // 检查更新
                setTimeout(()=>{
                    if(this.version.version !== this.version.oldversion){
                        if(this.version.is_force){
                            uni.reLaunch({
                                url: '/pages/common/up-data/up-data'
                            });
                        }else{
                            uni.navigateTo({
                                url: '/pages/common/up-data/up-data'
                            });
                        }
                    }
                }, 3000);
                // #endif
            });
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            // #ifdef APP-PLUS
            // ios 高版本底部安全区偏移
            var bottomPos = plus.navigator.getSafeAreaInsets();
            // 移动端用户中心点击屏蔽
            var widthPos = Math.ceil((plus.screen.resolutionWidth - 72) / 4);
            var tabBar_Login = new plus.nativeObj.View('tabbarLogin', {
                bottom: '0px',
                left: (widthPos * 3 + 72) + 'px',
                width: widthPos + 'px',
                height: (bottomPos.bottom ? bottomPos.bottom + 50 : '50') + 'px'
            });
            // tabBar_Login.drawRect('#ff0000') // 测试用
            tabBar_Login.addEventListener('click', function() {
                let pages = getCurrentPages();
                let route = pages[pages.length - 1].route;
                if(route.indexOf('login') < 0){
                    localStorage.setStore('tabbar_login', 'true');
                    uni.navigateTo({
                        url: '/pages/user/login/login'
                    });
                }
            }, false);
            if(!this.hasLogin){
                tabBar_Login.show();
            }
            // var info = plus.push.getClientInfo();
            // console.log(JSON.stringify( info ));
            // 
            // var msgAll = plus.push.getAllMessage();
            // console.log(JSON.stringify(msgAll)); 
            if (uni.getSystemInfoSync().platform == "ios") {
                // 推送(消息穿透)
                plus.push.addEventListener("receive", function ( msg ) {
                    plus.push.remove(msg);
                    if (pushData == JSON.stringify(msg)) {
                        return ;
                    }
                    pushData = JSON.stringify(msg);
                    if(is_pushReceive) return;
                    // console.log("push receive"); 
                    let content = msg;
                    try{
                        content = JSON.parse(msg.content);
                    }catch(e){
                        //TODO handle the exception
                    }
                    lookPush(content);
                });
            }else{
                // 推送(通知消息)
                plus.push.addEventListener("click", function ( msg ) {
                    // console.log("push click"); 
                    is_pushReceive = true;
                    lookPush(msg);
                }, false);
            }
            // #endif
		},
        onReady() {
            // #ifdef APP-PLUS
			
            var tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            if(tabBar_Login){
                plus.navigator.closeSplashscreen();
            }
            if (uni.getSystemInfoSync().platform == "ios") {
                // console.log('ios')
                permision.judgeIosPermission("location");
                permision.judgeIosPermission("push");
                permision.judgeIosPermission("camera");
                permision.judgeIosPermission("photoLibrary");
            }else{
                permision.requestAndroidPermission([
                    'android.permission.ACCESS_FINE_LOCATION',
                    'android.permission.CAMERA',
                    'android.permission.READ_EXTERNAL_STORAGE',
                    'android.permission.WRITE_EXTERNAL_STORAGE',
                    'android.permission.READ_PHONE_STATE',
                    'android.permission.CALL_PHONE'
                ]).then(res => {
                    console.log(res)
                });
            };
            // 发布按钮监听
            uni.onTabBarMidButtonTap(function() {
                uni.navigateTo({
                    url: '/pages/common/release/release'
                });
            });
            // #endif
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
            localStorage.setStore('tabBarIndex', 0);
            // 退出登录清空tabBar未读消息数量
            if(!this.hasLogin){
                this.TABBAR_MESSAGE_UPDATA(0);
            }
        },
        onHide() {
            // #ifdef APP-PLUS
            let tabBar_Login = plus.nativeObj.View.getViewById("tabbarLogin");
            let tabbarLogin = localStorage.getStore('tabbar_login');
            if (tabBar_Login && tabbarLogin === 'false') {
                tabBar_Login.hide();
            }
            // #endif
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getNewsData('ReachBottom');
        },
        onNavigationBarButtonTap(e) { // 标题栏按钮点击事件
		    toast.show('跳转到个人中心页面');
             uni.reLaunch({
                 url: '/pages/tabBar/profile/profile'
             });
        },
		onPageScroll() {
			this.load()
		},
		methods: {
            ...mapMutations(['CODE_KEY_UPDATA', 'CUSTOMER_UPDATA', 'VERSION_UPDATA', 'GOPAGE_LOGIN', 'TABBAR_MESSAGE_UPDATA']),
            async getData() { // 获取首页数据(同步防止加载前再次加载)
                await getHome().then(res =>{
					console.log("yes");
                    this.banner = res.data.banner;
                });
                this.getNewsData();
            },
			_goDetail(param) {
				// 需要判断是否角色认证
				//船东未认证进入的页面
				//router.navigateTo('/pages/sail/register/ship-files');
				//船东认证进入的页面
				console.log("999999999999999999"+JSON.stringify(param));
			     router.navigateTo('/pages/pallet/detail/detail?id=' + param.id);
			},
			//  获取最新货源信息
			getDataList() {
			    let send = {
			        "type":"indexhyrecomm"
			    };
			    secondrecommend({data:send}).then(res => {

					let newsa = eval('('+res.data+')')[0].meslist;
			        if(newsa.length < 3){
						this.dataList = newsa;
			        }else{
						this.dataList = newsa.slice(0,3);
			        }
			    })
			},
			// 获取公告信息
			getNotice(){
				secondnotice({data:{"type":"indexmes"}}).then(res => {
					this.noticeList = eval('('+res.data+')')[0].meslist;
					console.log("11111111111"+JSON.stringify(this.noticeList))
				})
			},
			
			uploada(){
				 var that = this ;
				 uni.getStorage({
					 key: 'addliiii',
					 complete: function (res) {
						 if(res.data.length > 0){	
							 that.swiperData = res.data;
							 console.log(that.swiperData[0].img);
						 }
						 else{
							 console.log(res.data.length);
							 that.uploadlantern();
						 }	
					 }
				 })
			},
			uploadlantern(){
				secondmainlantern({data:this.mainlantern}).then(res => {
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
										   key: 'addliiii',
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
            getNewsData(type = 'DownRefresh') { // 获取首页底部新闻
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore'){
                        return;
                    }
                    this.loadingType = 'loading';
                }
                toast.loading();
                getNewsList({page: this.page, type: 'hot'}).then(res => {
                    if(this.page == 1){
                        this.news = res.data;
                    }else{
                        this.news = this.news.concat(res.data);
                    }
                    toast.hideLoading();
                    if(type == 'DownRefresh'){
                        uni.stopPullDownRefresh();
                    }
                    if(res.data.length < 15){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page ++;
                    }
                });
            },
            goTabBar(url){
                router.switchTab(url);
            },
            goMapShip(){
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                uni.report('search_ship', '查船舶');
                // #ifndef MP
                this.goPage('/pages/map/map_search/map_search');
                // #endif
                // #ifdef MP
                // http://127.0.0.1:8081/index_weixin.html
                this.goPage('/pages/common/web-view/web-view', {type: 'ship_search', title: '查船舶', url: 'https://www.yunyoufanshop.com/map_search.html'});
                // #endif
            },
            goBanner(obj) {
                // 统计
                uni.report('homeBanner', JSON.stringify(obj));
                this.goPage(obj.link);
            },
			goPage(url, detail = null) {
                if(!url){
                    toast.show('敬请期待','none',false,700,'center');
                    return
                }
				router.navigateTo(url, detail);
			},
            onChangeSwiper(e){
                this.swiperCurrent = e.detail.current;
            },
            onChangeGrid(e){
                this.gridCurrent = e.detail.current;
            },
			onClickGrid(e) {
                let obj;
                    obj = this.gridData1[e.index];
                // if(this.gridCurrent == 0){
                // }else{
                //     obj = this.gridData2[e.index];
                // }
                if(obj.hasOwnProperty('router')){
                    this.goPage(obj.router);
                }
			},
			load() { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
				query.selectAll('.news >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
						if (images[i].top <= this.windowHeight) {
                            this.$set(this.news[images[i].dataset.index],'show',true);
						}else{
                            break;
                        }
                    }
				}).exec()
			},
			back:function(e){
				uni.navigateTo({
					
					url:'/pages/tabBar/guide/index'
				})
				
			},
            _callPhone(){
                uni.showModal({
                    title: '联系客服',
                    confirmText: '拨打',
                    content: '客服电话：' + this.customer.customer_call,
                    success: (e) => {
                        if(e.confirm){
                            uni.makePhoneCall({
                                phoneNumber: this.customer.customer_call
                            });
                        }
                    }
                })
            }
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/banner.scss';
    
    .is_compile{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
        padding: 10px;
        font-size: 16px;
        color: #fff;
        background-color: #FF0000;
    }
    
    .content{
        margin-bottom: $uni-spacing-col-base;
        padding: 0 $uni-spacing-row-base $uni-spacing-col-lg;
        background-color: $uni-text-color-inverse;
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
    
    .boxTop{
        position: relative;
        margin-bottom: $uni-spacing-col-base;
        padding: $uni-spacing-col-base * 8 $uni-spacing-row-base $uni-spacing-col-sm * 2;
        background-color: $uni-text-color-inverse;
    }
    
    .boxTop__newDay{
        position: absolute;
        top: -$uni-spacing-col-base * 2;
        left: $uni-spacing-row-base;
        right: $uni-spacing-row-base;
        @include flex(between);
        background-color: #fff;
        padding: $uni-spacing-col-lg 0;
        border-radius: $uni-border-radius-lg / 2;
        box-shadow: 0 4upx 12upx rgba(0,0,0,0.15);
        
        &Item{
            position: relative;
            width: 33.3%;
            text-align: center;
            padding: 0;
            background-color: transparent;
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
            }
        }
        
        &Rad{
            height: 40upx;
            line-height: 40upx;
            font-size: 56upx;
            font-weight: 700;
            color: $color-sub;
        }
        
        &Block{
            height: 40upx;
            line-height: 40upx;
            font-size: 32upx;
            font-weight: 700;
            color: $color-main;
        }
        
        &Text{
            height: 30upx;
            line-height: 30upx;
            font-size: $uni-font-size-xs;
            color: $color-grey;
            padding-top: $uni-spacing-col-sm * 1.5;
        }
    }
        
    .grid{
        @include flex(around, null, null, wrap);
        
        &__item{
            @include flex(null, center, column);
            width: 33.3%;
            margin-bottom: $uni-spacing-col-base * 2;
        }
        
        &__img{
            display: block;
            width: 100rpx;
            height: 100rpx;
            margin-bottom: 16rpx;
        }
        
        &__title{
            height: $uni-font-size-base;
            line-height: $uni-font-size-base;
            font-size: $uni-font-size-base;
            margin-bottom: $uni-spacing-col-sm * 1.5; 
        }
        
        &__note{
            height: $uni-font-size-sm;
            line-height: $uni-font-size-sm;
            font-size: 24rpx;
            font-weight: normal;
            color: #c0c0c0;
        }
    }
    
    .head{
        @include flex(between, center);
        padding: $uni-spacing-row-sm $uni-spacing-row-lg 0;
        font-size: 15px;
        line-height: 44px;
        font-weight: bold;
        background-color: $uni-text-color-inverse;
        
        &__note{
            @include flex(end, center);
            font-size: $uni-font-size-sm;
            font-weight: 100;
            color: $uni-text-color-grey;
        }
    }
    
    .card{
        margin-bottom: $uni-spacing-col-base;
        border-radius: $uni-border-radius-lg;
        overflow: hidden;
    }
    
    .cardGrid{
        height: 230upx;
        
        &__view{
            padding: $uni-spacing-col-sm * 2 0;
        }
    }
    
    .news{
        @include flex(null, null, column);
        background-color: #fff;
    }
	.xinxi-title{
		flex-direction: row;
		display: flex;
		background-color: #ffffff;
		padding: 24upx 0;
		border: 10upx;
		.first-view{
			background-color: #007AFF;
			padding: 20upx 10upx 0;
			margin-top: 10upx;
		}
		.second-view{
			margin-top: 10upx;
			font-size: 36upx;
			margin-left: 30upx;
		}
	}
	.recommend-cla{
		background-color: #ffffff;
		padding: 20upx 20upx 20upx 40upx;
		.class-for{
			padding: 20upx 0;
			border-bottom: 1px solid #e3e3e3;
			
		}
		.recommend-first{
			flex-direction: row;
			display: flex;
			padding: 10upx 0;
			color: #000000;
			.view-right{
				position: absolute;
				right: 25upx;
				color: #007AFF;
				font-size: 32upx;
			}
		}
		.recommend-second{
			flex-direction: row;
			display: flex;
			color: #8b8b8b;
			padding: 10upx 0;
			view{
				font-size: 24upx;
			}
		}
	}
    .view-Notice{
		flex-direction: row;
		display: flex;
		position: relative;
		background-color: #fff;
		border-radius: $uni-border-radius-lg / 2;
		box-shadow: 0 4upx 12upx rgba(0,0,0,0.15);
		padding: 10upx 0;
		.n-left{
			margin-left: 20upx;
			font-size: 35upx;
			width: 90upx;
			text-align: center;
			
			image{
				top: 10upx;
				width: 80upx;
				height: 80upx;
			}
		}
		.n-right{
			margin-left: 20upx;
			view{
				padding: 10upx 0;
				font-size: 28upx;
			}
		}
	}
</style>
