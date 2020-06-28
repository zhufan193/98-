<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    维修类型
                    <uni-icons v-if="componentTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            <scroll-view v-show="categoryActive == 0" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
                <view class="collapse">
                    <view class="collapse__cell" @click="_componentType()">
                        {{componentTypeId == '' ? '请选择维修类型' : componentTypeName}}
                        <uni-icons v-if="componentTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </view>
            </scroll-view>
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
        
        
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="componentTypeIndex"
             @onConfirm="_setType" :pickerValueArray="componentArray"></mpvue-picker>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    
    import { router, toast } from '@/common/util.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            mpvuePicker
        },
		data() {
			return {
                height: 0,
				categoryActive: 0,
                componentArray: [],
                componentTypeIndex: [0, 0],
                componentTypeId: '',
                componentTypeName: ''
            };
		},
        computed: mapState(['dictionaryTempData', 'screenTemp']),
        async onLoad(options) {
            toast.loading();
			// 获取货物type
			await this.getMaintainType();
			this.componentArray = this.dictionaryTempData.maintain_type;
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('maintenance')){
                let screen = this.screenTemp.maintenance;
                this.componentTypeIndex = screen.componentTypeIndex;
                this.componentTypeId = screen.componentTypeId;
                this.componentTypeName = screen.componentTypeName;
            }
            toast.hideLoading();
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                this.$refs.mpvuePicker.pickerCancel();
                return true;
            }
        },
		onUnload() {
            // 退出前关闭选择器
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        methods: {
            ...mapActions(['getMaintainType']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _componentType() {
                this.$refs.mpvuePicker.show();
            },
			_setType(e) {
                this.componentTypeIndex = e.index;
                this.componentTypeId = e.value[1];
                this.componentTypeName = e.label;
			},
            _clearDrawer(){
                this.componentTypeIndex = [0, 0];
                this.componentTypeId = '';
                this.componentTypeName = '';
                this.SCREEN_TEMP({
                    field: 'maintenance',
                    maintenance: {
                        'init': true,
                        'componentTypeIndex': [0, 0],
                        'componentTypeId': '',
                        'componentTypeName': ''
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'maintenance',
                    maintenance: {
                        'init': true,
                        'componentTypeIndex': this.componentTypeIndex,
                        'componentTypeId': this.componentTypeId,
                        'componentTypeName': this.componentTypeName
                    }
                });
                // 统计
                uni.report('screen_maintenance',{
                    'type': 'maintenance',
                    'componentTypeIndex': this.componentTypeIndex,
                    'componentTypeId': this.componentTypeId,
                    'componentTypeName': this.componentTypeName
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
