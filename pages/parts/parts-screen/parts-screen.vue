<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    备件分类
                    <uni-icons v-if="componentTypeIndex != -1" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            
			<scroll-view v-show="categoryActive == 0" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <block v-for="(item, index) of componentArray" :key="index">
                        <view class="collapse__cell" :class="index == componentTypeIndex ? 'collapse__cell--active' : ''" @click="_componentType(index)">
                            {{item.name}}
                            <uni-icons v-if="index == componentTypeIndex" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                        </view>
                    </block>
                </view>
			</scroll-view>
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { router, toast } from '@/common/util.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons
        },
		data() {
			return {
                height: 0,
				categoryActive: 0,
                componentArray: [],
                componentTypeIndex: -1,
                componentTypeId: '',
            };
		},
        computed: mapState(['dictionaryTempData', 'screenTemp']),
        async onLoad(options) {
            toast.loading();
			// 获取货物type
			await this.getComponentType();
			this.componentArray = this.dictionaryTempData.component_type;
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('parts')){
                let screen = this.screenTemp.parts;
                this.componentTypeIndex = screen.componentTypeIndex;
                this.componentTypeId = screen.componentTypeId;
            }
            toast.hideLoading();
        },
        methods: {
            ...mapActions(['getComponentType']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _componentType(index) {
                this.componentTypeIndex = index;
                this.componentTypeId = this.componentArray[index].id;
            },
            _clearDrawer(){
                this.componentTypeIndex = -1;
                this.componentTypeId = '';
                this.SCREEN_TEMP({
                    field: 'parts',
                    parts: {
                        'init': true,
                        'componentTypeIndex': -1,
                        'componentTypeId': ''
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'parts',
                    parts: {
                        'init': true,
                        'componentTypeIndex': this.componentTypeIndex,
                        'componentTypeId': this.componentTypeId
                    }
                });
                // 统计
                uni.report('screen_parts',{
                    'type': 'parts',
                    'componentType': this.componentTypeIndex
                });
                uni.navigateBack();
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/foot.scss';
    
	.page-body {
		display: flex;
        background-color: #fff;
	}
    
	.nav-left {
        position: relative;
        flex: none;
		width: 196rpx;
        
        &::after{
            @include hr(right);
        }
	}

	.nav-left-item {
        position: relative;
		height: 54px;
        padding: 0 0 0 $uni-spacing-row-base;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
        
        &::after{
            @include hr(bottom);
        }
	}

	.nav-right {
        flex: auto;
	}

	.active {
		color: $color-main;
	}
    
    .collapse{
        @include flex(null, null, column);
        
        &__cell{
            position: relative;
            box-sizing: border-box;
            @include flex(between, center);
            height: 54px;
            width: 100%;
            padding: 0 $uni-spacing-row-base;
            font-size: $uni-font-size-base;
            color: $uni-text-color;
        
            &::after{
                @include hr(bottom);
            }
            
            &--active{
                color: $color-main;
            }
        }
        
        &__label{
            font-size: $uni-font-size-base;
            color: $uni-text-color;
        }
        
        &__input{
            height: 54px;
            line-height: 54px;
            min-height: inherit;
            text-align: center;
            font-size: 14px;
            color: $uni-text-color;
            
            &--disabled{
                color: #999;
            }
        }
    }
    
    .foot__btn[type=primary]{
        background-color: $color-main;
        
        &::after{
            display: none;
        }
    }
    
    .foot__btn--right[type=primary]{
        background-color: #a2d7ff;
        
        &::after{
            display: none;
        }
    }
</style>
