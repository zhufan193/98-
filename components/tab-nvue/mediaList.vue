<template>
	<view class="list-cell" hover-class="uni-list-cell-hover" @click="bindClick">
		<view class="media-list" v-if="options.title">
			<view :class="{'media-image-right': type === 2, 'media-image-left': type === 1}">
                <view class="media-content">
                    <text class="media-title" :class="{'media-title2': type === 1 || type === 2}">{{options.title}}</text>
                    <view class="media-foot">
                    	<view class="media-info">
                    		<text class="info-text">{{options.source}}</text>
                    	</view>
                    	<view class="media-info">
                            <!-- <uni-icons type="eye" color="#999"></uni-icons> -->
                            <text class="info-text">{{options.browser}}查看</text>
                    	</view>
                    </view>
                </view>
				<view v-if="options.image_list || options.cover" class="image-section lazy" :class="{'image-section-right': type === 2, 'image-section-left': type === 1}">
					<image class="image-list1 lazy__img" :class="{'image-list2': type === 1 || type === 2, is_lazy:!options.show}"
					 v-if="options.cover" :src="options.show ? options.cover : ''" :data-index="index" @load="imageLoad" mode="aspectFill"></image>
                    <image class="lazy__img lazy__placeholder" :class="{lazy__loaded : loaded}" src="/static/img/loading300x300.jpg" mode="aspectFill"></image>
					<template v-if="options.image_list">
						<image class="image-list3" lazy-load :src="source.url" v-for="(source, i) in options.image_list" :key="i" mode="aspectFill" />
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    import uniIcons from '../uni-icons/uni-icons.vue'
    
	export default {
        components:{
            uniIcons
        },
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			},
            type: {         // 0：标题底部根据showImg()来显示大图 1：左边显示图片、2：右边显示图片
                type: Number,
                default: 1
            },
            index: {
                type: Number
            }
		},
        data() {
            return {
                loaded: false
            }
        },
		methods: {
			bindClick() {
				this.$emit('click');
			},
            imageLoad(){
                this.loaded = true;
            }
		}
	}
</script>

<style lang="scss">
    @import "@/style/mixin/hr.scss";
    @import "@/style/page/lazy.scss";
    
	.list-cell {
        box-sizing: border-box;
		width: 750upx;
		padding: 0 30upx;
        background-color: #fff;
	}

	.uni-list-cell-hover {
		background-color: $uni-bg-color-hover;
	}

	.media-list {
        position: relative;
        display: flex;
		flex: 1;
		flex-direction: column;
		padding: 32upx 0;
        
        &::after{
            @include hr(bottom);
        }
	}
    
    .media-content{
		flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

	.media-image-right {
        display: flex;
		flex-direction: row;
	}

	.media-image-left {
        display: flex;
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
	}

	.media-title {
		font-size: 34upx;
		color: $uni-text-color;
		lines: 2;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
	}

	.media-title2 {
		flex: none;
		line-height: 55rpx;
        margin-top: -8rpx;
	}

	.image-section {
		margin-top: 20upx;
        display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0upx;
		margin-left: 24upx;
		width: 200upx;
		height: 150upx;
	}

	.image-section-left {
		margin-top: 0upx;
		margin-right: 24upx;
		width: 200upx;
		height: 150upx;
	}

	.image-list1 {
		width: 690upx;
		height: 481upx;
	}

	.image-list2 {
		width: 200upx;
		height: 150upx;
	}

	.image-list3 {
		width: 200upx;
		height: 150upx;
	}

	.media-info {
        display: flex;
		flex-direction: row;
	}

	.info-text {
		margin-right: 20upx;
		color: #c0c0c0;
		font-size: 22upx;
	}

	.info-text:last-child {
		margin-right: 0;
    }

	.media-foot {
		padding-top: 10upx;
        display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
    
    .media-foot .uni-icons {
        margin-right: 10upx;
    }
</style>
