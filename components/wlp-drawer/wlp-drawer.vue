<template>
	<view v-show="visibleSync" :class="{'uni-drawer--visible':showDrawer,'uni-drawer--right':rightMode}" class="uni-drawer">
		<view class="uni-drawer__mask" @click="close" @touchmove.stop.prevent="moveHandle"/>
		<view class="uni-drawer__content scrollbar--hide" @touchmove.stop.prevent="moveHandle">
            <view class="drawer__scroll" :class="{'drawer--android': resAndroid}" :style="{height: (height - 44) + 'px'}">
                <slot />
            </view>
            <view class="drawer__bottom">
                <view class="drawer__btn" @click="_sendDrawer()">确定</view>
                <view class="drawer__btn drawer__btn--right" @click="_clearDrawer()">重置</view>
            </view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniDrawer',
		props: {
			/**
			 * 带scroll-view需要height，且适应安卓弹出scroll与原页面scroll冲突bug
			 */
			height: {
				type: Number,
				default: 0
			},
			/**
			 * 显示状态
			 */
			visible: {
				type: Boolean,
				default: false
			},
			/**
			 * 显示模式（左、右），只在初始化生效
			 */
			mode: {
				type: String,
				default: ''
			},
			/**
			 * 蒙层显示状态
			 */
			mask: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				visibleSync: false,
				showDrawer: false,
				rightMode: false
			}
		},
		watch: {
			visible(val) {
                this.supportRefresh(!val);
				clearTimeout(this.watchTimer)
				setTimeout(() => {
					this.showDrawer = val
				}, 100)
				if (this.visibleSync) {
					clearTimeout(this.closeTimer)
				}
				if (val) {
					this.visibleSync = val
				} else {
					this.watchTimer = setTimeout(() => {
						this.visibleSync = val
					}, 300)
				}
			}
		},
        computed: {
            resAndroid() {
                if (uni.getSystemInfoSync().platform == "android") {
                    return true;
                }else{
                    return false;
                }
            }
        },
		created() {
			this.visibleSync = this.visible
			setTimeout(() => {
				this.showDrawer = this.visible
			}, 100)
			this.rightMode = this.mode === 'right'
		},
		methods: {
            _sendDrawer() {
                this.$emit('send')
            },
            _clearDrawer() {
                this.$emit('clear')
            },
			close() {
				this.showDrawer = false
				this.closeTimer = setTimeout(() => {
					this.visibleSync = false
					this.$emit('close')
				}, 200)
			},
            supportRefresh(type) {
                // 安卓端防止弹出组件与下拉刷新冲突
                if (uni.getSystemInfoSync().platform == 'android') {
                    let pages = getCurrentPages();
                    let page = pages[pages.length - 1];
                    let currentWebview = page.$getAppWebview();
                    currentWebview.setStyle({
                        pullToRefresh: {
                            support: type,
                            style: 'default'
                        }
                    });
                }
            },
            moveHandle(){}
		}
	}
</script>

<style lang="scss">
	@charset "UTF-8";
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/drawer.scss';

	.uni-drawer {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		visibility: hidden;
		z-index: 10001;
		height: 100%
	}

	.uni-drawer.uni-drawer--right .uni-drawer__content {
		left: auto;
		right: 0;
		transform: translatex(100%)
	}

	.uni-drawer.uni-drawer--visible {
		visibility: visible
	}

	.uni-drawer.uni-drawer--visible .uni-drawer__content {
		transform: translatex(0)
	}

	.uni-drawer.uni-drawer--visible .uni-drawer__mask {
		display: block;
		opacity: 1
	}

	.uni-drawer__mask {
		display: block;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		transition: opacity .3s
	}

	.uni-drawer__content {
        @include flex(null, null, column);
		position: absolute;
		top: 0;
		left: 0;
		width: 650upx;
		height: 100%;
		background: #fff;
		transition: all .3s ease-out;
		transform: translatex(-100%);
    }
    
    .scrollbar--hide::-webkit-scrollbar{
        display: none;
    }
    
    .drawer--android{
        overflow-y: scroll;
        border-radius: 1rpx;
        
        & > scroll-view{ 
            // 安卓弹出scroll与原页面scroll冲突bug适配
            padding-bottom: 10px;
        }
        
        scroll-view::-webkit-scrollbar{
            display: none;
        }
    }
</style>