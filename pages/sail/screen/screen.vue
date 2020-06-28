<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    空船地
                    <uni-icons v-if="departure_index != null" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view class="nav-left-item" :class="1 == categoryActive ? 'active' : ''" @click="categoryClickMain(1)">
                    目的地
                    <uni-icons v-if="target_index != null" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view class="nav-left-item" :class="2 == categoryActive ? 'active' : ''" @click="categoryClickMain(2)">
                    吨位区间
                    <uni-icons v-if="collapseWeightIndex != -1" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view class="nav-left-item" :class="3 == categoryActive ? 'active' : ''" @click="categoryClickMain(3)">
                    空船日期
                    <uni-icons v-if="dateStr != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            
            <view v-show="categoryActive == 0" class="nav-right">
                <wlp-global :height="height" :default-index="departure_index" :query-show="false" @click="_globalChange"></wlp-global>
            </view>
            
            <view v-show="categoryActive == 1" class="nav-right">
                <wlp-global :height="height" :default-index="target_index" :query-show="false" @click="_globalChange"></wlp-global>
            </view>
            
			<scroll-view v-show="categoryActive == 2" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <block v-for="(item, index) of collapseWeight" :key="index">
                        <view class="collapse__cell" :class="index == collapseWeightIndex ? 'collapse__cell--active' : ''" @click="_clickWeight(index)">
                            {{item.label}}
                            <uni-icons v-if="index == collapseWeightIndex" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                        </view>
                    </block>
                </view>
			</scroll-view>
            
			<scroll-view v-show="categoryActive == 3" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <view class="collapse__cell" @tap="dateRangeShow=true">
                        <view class="collapse__label">
                            空船日期
                        </view>
                        <view class="collapse__input" :class="{'collapse__input--disabled': dateStr == ''}">
                            {{dateStr ? dateStr : '点击选择'}}
                        </view>
                    </view>
				</view>
			</scroll-view>
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
        
        <wlp-date-range :show="dateRangeShow" :stopToday="true" :multiSelect="true" @click="_dataRangeChange"></wlp-date-range>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
    import wlpDateRange from '@/components/wlp-date-range/wlp-date-range.vue';
    
    import { router, toast, dateUtils } from '@/common/util.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            wlpGlobal,
            wlpDateRange
        },
		data() {
			return {
                height: 0,
				categoryActive: 0,
                departure_index: null,
                departure_na: '',
                target_index: null,
                target_na: '',
                collapseWeight: [],
                collapseWeightIndex: -1,
                dateStr: '',
                dateRangeShow: false
            };
		},
        computed: mapState(['screenTemp', 'dictionaryTempData']),
        async onLoad(options) {
            toast.loading();
			// 获取船舶吨位
			await this.getShipDwt();
			this.collapseWeight = this.dictionaryTempData.ship_dwt;
            // 筛选地点
            await this.getGlobal();
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('sail')){
                let screen = this.screenTemp.sail;
                this.departure_index = screen.departure_index;
                this.departure_na = screen.departure_na;
                this.target_index = screen.target_index;
                this.target_na = screen.target_na;
                this.collapseWeightIndex = screen.collapseWeightIndex;
                this.dateStr = screen.dateStr;
            }
            
            toast.hideLoading();
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
        },
        methods: {
            ...mapActions(['getGlobal', 'getShipDwt']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _globalChange(e){
                if(this.categoryActive === 0){
                    this.departure_index = e.index;
                    this.departure_na = e.name[e.name.length - 1];
                }else if(this.categoryActive === 1){
                    this.target_index = e.index;
                    this.target_na = e.name[e.name.length - 1];
                }
            },
            _clickWeight(index) {
                this.collapseWeightIndex = index;
            },
            _dataRangeChange(e){
                if(e.type === 'confirm'){
                    this.dateStr = e.startDate.year + '-' + (e.startDate.month + 1) + '-' + e.startDate.day;
                    if(e.endDate !== null){
                        this.dateStr = this.dateStr + ',' + e.endDate.year + '-' + (e.endDate.month + 1) + '-' + e.endDate.day;
                    }
                }
                this.dateRangeShow = false;
            },
            _clearDrawer(){
                this.departure_index = null;
                this.departure_na = '';
                this.target_index = null;
                this.target_na = '';
                this.collapseWeightIndex = -1;
                this.dateStr = '';
                this.SCREEN_TEMP({
                    field: 'sail',
                    sail: {
                        'init': true,
                        'departure_index': null,
                        'departure_na': '',
                        'target_index': null,
                        'target_na': '',
                        'collapseWeightIndex': -1,
                        'weight': '',
                        'dateStr': ''
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'sail',
                    sail: {
                        'init': true,
                        'departure_index': this.departure_index,
                        'departure_na': this.departure_na,
                        'target_index': this.target_index,
                        'target_na': this.target_na,
                        'collapseWeightIndex': this.collapseWeightIndex,
                        'weight': this.collapseWeightIndex == -1 ? '' : this.collapseWeight[this.collapseWeightIndex].val,
                        'dateStr': this.dateStr
                    }
                });
                // 统计
                uni.report('screen_sail',{
                    'type': 'sail',
                    'search_value': this.searchValue,
                    'departure_na': this.departure_na,
                    'target_na': this.target_na,
                    'weight': this.collapseWeightIndex == -1 ? '' : this.collapseWeight[this.collapseWeightIndex].val,
                    'dateStr': this.dateStr
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
            flex: auto;
            height: 54px;
            line-height: 54px;
            min-height: inherit;
            text-align: right;
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
