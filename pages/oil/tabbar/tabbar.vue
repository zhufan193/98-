<template>
	<view class="page">
        <!-- <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="indexActive === 0">
            <block v-for="(item, index) of data[0].list" :key="index">
                <wlp-card-oil-bid :options="item" :index="index" :minute="item.minute" :second="item.second" @click="_goDetail(0, item.id)"></wlp-card-oil-bid>
            </block>
        </template> -->
		<view>
			<uni-swiper-dot :info="swiperData" :current="swiperCurrent" mode="long">
				<swiper class="swiper-box" autoplay="true" circular="true" @change="onChangeSwiper">
					<swiper-item class="swiper-item" v-for="(item ,index) in swiperData" :key="index" @tap="goBanner()">
						<image :src="item.img" mode="aspectFill"/>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<view  class="view-title">
			<select-picker :option="array" v-on:greet="boat" class="select-picker-class"></select-picker>
			<select-picker :option="transportarray" v-on:greet="boat" class="select-picker-class"></select-picker>
		</view>
		
        <template v-if="indexActive === 1">
            <block v-for="(item, index) of data[1].list" :key="index">
                <wlp-card-oil-store :options="item" :index="index" :show="item.show" @click="_goDetail(1, item.id)"></wlp-card-oil-store>
            </block>
        </template>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">{{indexActive === 0 ? '暂无竞价信息' : '暂无油商信息'}}</text>
        </view>
        
        <wlp-fab :title="indexActive === 0 ? '发布竞价加油' : '发布油商'" @click="_release()"></wlp-fab>
	</view>
</template>

<script>
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import wlpCardOilBid from '@/components/wlp-card/wlp-card-oil-bid.vue';
    import wlpCardOilStore from '@/components/wlp-card/wlp-card-oil-store.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue';
    import selectPicker from '@/components/select-picker/select-picker.vue';
    import { router, toast, dateUtils } from '@/common/util.js';
    import { getOilBidList, getOilStoreList,secondoilslantern,secondoilslist } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
    var time_id = null;
    
	export default {
        components:{
            wlpFab,
            uniSegmentedControl,
            wlpCardOilBid,
            wlpCardOilStore,
            uniLoadMore,
			uniSwiperDot,
			selectPicker
        },
        computed: mapState(['hasLogin', 'screenTemp']),
		data() {
			return {
                windowHeight: 0,
                items: ['竞价列表', '油商黄页'],
                data: [{
                    list: [],
                    harbor_id: '',
                    harbor_index: '',
                    router: '/pages/oil/bid-detail/bid-detail',
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    harbor_id: '',
                    harbor_index: '',
                    router: '/pages/oil/store-detail/store-detail',
                    page: 1,
                    loadingType: 'more'
                }],
				indexActive: 1,
                drawerVisible: false,
				swiperData: [],
				array: ['选择区域','渤海区', '黄海区', '东海区', '北部湾','南海区','长江','香港'],
				boatindex:'',
				transportarray:['选择燃料种类','柴油','重油','轻循环油','润滑油','导热油','液压油'],
				transportindex:'',
				swiperCurrent: 0,
			};
		},
        async onLoad() {
            toast.loading();
            await this.getData('init');
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
			//幻灯片接口
			this.uploada();
            toast.hideLoading();
        },
        // onShow() {
        //     time_id = setInterval(this.upDate, 1000);
        //     if(this.screenTemp.hasOwnProperty('oil') && this.screenTemp.oil.init){
        //         let screen = this.screenTemp.oil;
        //         this.data[this.indexActive].harbor_index = screen.port_index;
        //         this.data[this.indexActive].harbor_id = screen.port_id;
        //         screen.init = false;
        //         this.SCREEN_TEMP({
        //             field: 'oil',
        //             oil: screen
        //         })
        //         this.getData();
        //     }
        // },
        // onUnload() {
        //     clearInterval(time_id);
        // },
        onNavigationBarButtonTap() {
            router.navigateTo('/pages/oil/screen/screen');
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        onPageScroll() {
            if(this.indexActive === 1){
                this.load();
            }
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'SCREEN_TEMP']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.screenTemp.hasOwnProperty('oil')){
                    let screen = this.screenTemp.oil;
                    screen.port_id = this.data[this.indexActive].harbor_id;
                    screen.port_index = this.data[this.indexActive].harbor_index;
                    this.SCREEN_TEMP({
                        field: 'oil',
                        oil: screen
                    })
                }
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _release() {
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                let url = this.indexActive === 0 ? '/pages/oil/release/release' : '/pages/oil/store-add/store-add';
                router.navigateTo(url);
            },
            _goDetail(index, id) {
                // router.navigateTo(this.data[index].router, {id: id});
				router.navigateTo('/pages/oil/store-detail/store-detail',{id: id})
            },
            getData(type='DownRefresh') {
				
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].page = 1;
                    this.data[index].loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
    //             if(index === 0){
    //                 getOilBidList({page: this.data[index].page, harbor_id: this.data[index].harbor_id}).then(res => {
    //                     this.setData(type, res, index);
    //                 });
    //             }
				// else if(index === 1){
    //                 getOilStoreList({page: this.data[index].page, harbor_id: this.data[index].harbor_id}).then(res => {
    //                     this.setData(type, res, index);
    //                 });
    //             }
			
				let sent = {"type":"rygylist","gyqy":"","yp":"","size":"15","page":this.data[index].page};
				secondoilslist({data:sent}).then(res => {
					var lantern = eval('('+res.data+')');
					console.log("获取燃油数据开始："+lantern);
					if(lantern[0].stat == 1){
						console.log("获取燃油数据成功："+ JSON.stringify(lantern[0].meslist));
						// this.data = lantern[0].meslist;
						this.setData(type, lantern[0].meslist, index);
					}
				}); 
            },
            setData(type, res, index){
                if(this.data[index].page == 1){
                    this.data[index].list = res;
                }else{
                    this.data[index].list = this.data[index].list.concat(res);
                }
                if(index === 1){
                    this.$nextTick(function() {
                        this.load();
                    });
                }
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }
                if(res.data.length < 15){
                    this.data[index].loadingType = 'noMore';
                }else{
                    this.data[index].loadingType = 'more';
                    this.data[index].page ++;
                }
            },
            upDate() { // 计时器
                if(this.indexActive !== 0){
                    return;
                } 
                let query = uni.createSelectorQuery().in(this);
                query.selectAll('.page >>> .is_upDate').boundingClientRect((res) => {
                    for(let i = 0, len = res.length; i < len; i++){
                        let obj = this.data[0].list[res[i].dataset.index];
                        if(obj.state !== 1){
                            continue;
                        }
                    	if (res[i].top <= this.windowHeight && res[i].bottom >= 44) {
                            this.resDate(obj);
                    	}
                    }
                }).exec()
            },
            resDate(obj) { // 计算器数值生成
                let date = dateUtils.parse(obj.end_at);
                let diff = date.getTime() - Date.now();
                if(diff > 0){
                    let minute = Math.floor(diff / 60000);
                    let second = Math.floor(diff % 60000 / 1000);
                    this.$set(obj, 'minute', minute <= 9 ? '0' + minute : minute);
                    this.$set(obj, 'second', second <= 9 ? '0' + second : second);
                }else{
                    this.$set(obj,'state', 4);
                    this.$set(obj,'state_str', '竞价结束');
                }
            },
			load() { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
				query.selectAll('.page >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
                    	if (images[i].top <= this.windowHeight) {
                            this.$set(this.data[1].list[images[i].dataset.index],'show',true);
                    	}else{
                            break;
                        }
                    }
				}).exec()
			},
			boat(index){
				this.boatindex=index;
			},
			uploada(){
				 var that = this ;
				 uni.getStorage({
					 key: 'oils',
					 complete: function (res) {
						 if(res.data.length > 0){	
							 that.swiperData = res.data;
							 console.log("111111111"+that.swiperData[0].img);
						 }
						 else{
							 console.log(res.data.length);
							 that.uploadlantern();
						 }	
					 }
				 })
			},
			uploadlantern(){
				let sent = {"type":"hdp","lx":"56" };
				secondoilslantern({data:sent}).then(res => {
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
										   key: 'oils',
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
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
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
		margin-bottom: 20upx;
	}
    .page{
        padding: 0 0 $uni-spacing-col-base;
        // padding: 54px 0 $uni-spacing-col-base;
    }
</style>
