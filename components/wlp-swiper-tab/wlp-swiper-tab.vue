<template>
    <scroll-view class="tab--swiper" :class="{fixed: fixed}" scroll-x :scroll-left="scrollLeft" @scroll="_scroll">
        <view class="tab__main">
            <block v-for="(item, index) of values" :key="index">
                <view class="tab__cell" :class="['is_tab_cell_' + index, {active: index === currentIndex }]" :data-index="index" @click="_onClick">{{item}}</view>
            </block>
        </view>
    </scroll-view>
</template>

<script>
	export default {
		name: 'wlpSwiperTab',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return []
				}
			},
            fixed: {
				type: Boolean,
				default: false
            }
		},
		data() {
			return {
                windowWidth: 0,
                scrollWidth: 0,
				currentIndex: 0,
                scrollLeft: 0,
                scrollLeftOld: 0
			}
		},
		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val
				}
			}
		},
		created() {
            this.windowWidth = uni.getSystemInfoSync().windowWidth;
			this.currentIndex = this.current
		},
		methods: {
			_onClick(e) {
                let index = e.target.dataset.index;
                this.scrollLeft = this.scrollLeftOld;
                this.$nextTick(()=>{
                    if(index < 3){
                        this.scrollLeft = 0;
                    }else if(index > 3){
                        this.scrollLeft = e.target.offsetLeft;
                    }else{
                        let query = uni.createSelectorQuery().in(this);
                        query.selectAll('.tab__cell').boundingClientRect((tabItem) => {
                            this.scrollLeft = e.target.offsetLeft + tabItem[index].width / 2  - this.windowWidth / 2;
                        }).exec()
                    }
                })
				if (this.currentIndex !== index) {
					this.currentIndex = index
					this.$emit('clickItem', index)
				}
			},
            _scroll(e){
                this.scrollLeftOld = e.target.scrollLeft
            }
		}
	}
</script>

<style lang="scss">
	@charset "UTF-8";

	.tab--swiper {
        width: 100%;
        height: 44px;
        background-color: #fff;
		overflow: hidden;
	}
    
    .tab--swiper.fixed{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        box-shadow: 0 4upx 6upx $uni-shadow-color;
    }
    
    .tab__main{
		display: flex;
    }
    
	.tab__cell {
		flex: none;
        height: 44px;
        line-height: 44px;
		box-sizing: border-box;
        padding: 0 $uni-spacing-row-lg;
		color: #333;
		font-size: 28upx;
		text-align: center;
        border-bottom: 3px solid #fff;
	}

	.tab__cell.active {
		color: $color-main;
        border-bottom-color: $color-main;
	}
</style>