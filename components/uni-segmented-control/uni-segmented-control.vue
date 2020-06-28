<template>
	<view :class="{ text: styleType === 'text', 'fixed': fixed }" :style="{ borderColor: styleType === 'text' ? '' : activeColor }" class="segmented-control">
		<view v-for="(item, index) in values" :key="index" class="segmented-control-item" :class="[{ text: styleType === 'text' }]" @click="_onClick(index)">
            <view class="segmented-control-text" :class="[{ active: index === currentIndex }]" :style="{
                color:
                index === currentIndex
                    ? styleType === 'text'
                    ? activeColor
                    : '#fff'
                    : styleType === 'text'
                    ? '#333'
                    : activeColor,
                backgroundColor: index === currentIndex && styleType === 'button' ? activeColor : ''
            }">{{ item }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniSegmentedControl',
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
			activeColor: {
				type: String,
				default: '#007aff'
			},
			styleType: {
				type: String,
				default: 'button'
			},
            fixed: {
				type: Boolean,
				default: false
            }
		},
		data() {
			return {
				currentIndex: 0
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
			this.currentIndex = this.current
		},
		methods: {
			_onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index
					this.$emit('clickItem', index)
				}
			}
		}
	}
</script>

<style lang="scss">
	@charset "UTF-8";

	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 75%;
		font-size: 28upx;
		box-sizing: border-box;
		margin: 0 auto;
		overflow: hidden;
		border: 1px solid;
		border-radius: 10upx
	}

	.segmented-control.text {
        width: 100%;
        background-color: #fff;
		border: 0;
		border-radius: 0;
	}
    
    .segmented-control.fixed{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        box-shadow: 0 4upx 6upx $uni-shadow-color;
    }

	.segmented-control-item {
		flex: 1;
		text-align: center;
		box-sizing: border-box;
		border-left: 1px solid
	}

	.segmented-control-item:first-child {
		border-left-width: 0
	}

	.segmented-control-item.text {
		border-left: 0;
		color: #333
	}

	.segmented-control-text {
		box-sizing: border-box;
        display: inline-block;
        height: 44px;
        line-height: 44px;
        padding: 0 $uni-spacing-row-sm;
		color: #fff
	}

	.segmented-control-text.active {
        font-weight: bold;
		border-bottom: 3px solid
	}
</style>