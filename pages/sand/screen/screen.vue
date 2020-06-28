<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    砂石类型
                    <uni-icons v-if="sandTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            <scroll-view v-show="categoryActive == 0" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
                <view class="collapse">
                    <view class="collapse__cell" @click="_sandType()">
                        {{sandTypeId == '' ? '请选择砂石类型' : sandTypeName}}
                        <uni-icons v-if="sandTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </view>
            </scroll-view>
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
        
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="sandTypeIndex"
         @onConfirm="_setSandType" :pickerValueArray="sandTypeList"></mpvue-picker>
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
                sandTypeList: [],
                sandTypeIndex: [0, 0],
                sandTypeId: '',
                sandTypeName: ''
            };
		},
        computed: mapState(['dictionaryTempData', 'screenTemp']),
        async onLoad(options) {
            toast.loading();
			// 获取货物type
			await this.getSandType();
			this.sandTypeList = this.dictionaryTempData.sand_type;
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('sand')){
                let screen = this.screenTemp.sand;
                this.sandTypeIndex = screen.sandTypeIndex;
                this.sandTypeId = screen.sandTypeId;
                this.sandTypeName = screen.sandTypeName;
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
            ...mapActions(['getSandType']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _sandType() {
                this.$refs.mpvuePicker.show();
            },
			_setSandType(e) {
                this.sandTypeIndex = e.index;
                this.sandTypeId = e.value[1];
                this.sandTypeName = e.label;
			},
            _clearDrawer(){
                this.sandTypeIndex = [0, 0];
                this.sandTypeId = '';
                this.sandTypeName = '';
                this.SCREEN_TEMP({
                    field: 'sand',
                    sand: {
                        'init': true,
                        'sandTypeIndex': [0, 0],
                        'sandTypeId': '',
                        'sandTypeName': ''
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'sand',
                    sand: {
                        'init': true,
                        'sandTypeIndex': this.sandTypeIndex,
                        'sandTypeId': this.sandTypeId,
                        'sandTypeName': this.sandTypeName
                    }
                });
                // 统计
                uni.report('screen_sand',{
                    'type': 'sand',
                    'sandTypeIndex': this.sandTypeIndex,
                    'sandTypeId': this.sandTypeId,
                    'sandTypeName': this.sandTypeName
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
