<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="index" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
            :id="'tab-item-' + index" :data-current="index" @click="tapTab">{{tab.name}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab,index) in tabBars" :key="index">
				<scroll-view class="list" :class="'is_list_' + index" scroll-y @scrolltolower="getData" @scroll="load(index)">
					<block v-for="(newsitem,indexItem) in tab.data" :key="indexItem">
						<media-list :options="newsitem" :index="indexItem" @click="goDetail(newsitem.id)"></media-list>
					</block>
                    <uni-load-more :status="tabBars[tabIndex].loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	import mediaList from '@/components/tab-nvue/mediaList.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

    import {toast} from '@/common/util';
	import {getNews, getNewsList} from '@/service/getData';

	export default {
		components: {
			mediaList,
            uniLoadMore
		},
		data() {
			return {
                windowHeight: 0,
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
                tabBars: [],              // 新闻分类数据
			}
		},
		onLoad() {
            this.windowHeight = uni.getSystemInfoSync().windowHeight;
            this.getTabBar();
		},
		methods: {
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/news/detail/detail?title=' + this.tabBars[this.tabIndex].name + '&id=' + e
				});
			},
            getTabBar(){
                getNews().then(res => {
                    let result = res.data;
                    for (let i = 0, length = result.length; i < length; i++) {
                    	result[i].page = 1;
                    	result[i].loadingType = 'more';
                    	result[i].data = [];
                    }
                    let obj =  [{
                        name: '头条',
                        id: '',
                        page: 1,
                        loadingType: 'more',
                        data: []
                    }];
                    this.tabBars = obj.concat(result);
                    this.getData();
                    uni.stopPullDownRefresh();
                });
            },
            getData(){
                if(this.tabBars[this.tabIndex].loadingType == 'noMore') return;
                this.tabBars[this.tabIndex].loadingType = 'loading';
                toast.loading();
                getNewsList({id: this.tabBars[this.tabIndex].id, page: this.tabBars[this.tabIndex].page}).then(res => {
                    if(this.tabBars[this.tabIndex].page == 1){
                        this.$set(this.tabBars[this.tabIndex],'data',res.data);
                    }else{
                        this.$set(this.tabBars[this.tabIndex],'data',this.tabBars[this.tabIndex].data.concat(res.data));
                    }
                    this.$nextTick(function() {
                        this.load(this.tabIndex);
                    });
                    toast.hideLoading();
                    if(res.data.length < 15){
                        this.tabBars[this.tabIndex].loadingType = 'noMore';
                    }else{
                        this.tabBars[this.tabIndex].loadingType = 'more';
                        this.tabBars[this.tabIndex].page ++;
                    }
                });
            },
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			async changeTab(e) {
				let index = e.target.current;
				if (this.tabBars[index].data.length === 0) {
					this.getData(index)
				}
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize("tab-item-" + i);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize("tab-item-" + index),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			load(indexActive) { // 图片懒加载
                let query = uni.createSelectorQuery().in(this);
				query.selectAll('.is_list_' + indexActive + ' >>> .is_lazy').boundingClientRect((images) => {
                    for(let i = 0, len = images.length; i < len; i++){
                    	if (images[i].top <= this.windowHeight) {
                            this.$set(this.tabBars[indexActive].data[images[i].dataset.index],'show',true);
                    	}else{
                            break;
                        }
                    }
				}).exec()
			}
		}
	}
</script>

<style>
    page{
        height: 100%;
        background-color: #fff;
    }
    
    .swiper-tab-list{
        font-size: 28rpx;
    }
    
	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28upx;
		color: #999;
	}
</style>
