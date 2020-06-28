<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    船舶类型
                    <uni-icons v-if="shipTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view class="nav-left-item" :class="1 == categoryActive ? 'active' : ''" @click="categoryClickMain(1)">
                    载重范围
                    <uni-icons v-if="load_min != '' || load_max != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view v-if="indexActive == 0" class="nav-left-item" :class="2 == categoryActive ? 'active' : ''" @click="categoryClickMain(2)">
                    船龄
                    <uni-icons v-if="shipAgeIndex != -1" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
                <view v-else class="nav-left-item" :class="2 == categoryActive ? 'active' : ''" @click="categoryClickMain(2)">
                    出售价格
                    <uni-icons v-if="price_min != '' || price_max != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            
            <scroll-view v-show="categoryActive == 0" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
                <view class="collapse">
                    <view class="collapse__cell" @click="_shipType()">
                        {{shipTypeId == '' ? '请选择船舶类型' : shipTypeName}}
                        <uni-icons v-if="shipTypeId != ''" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </view>
            </scroll-view>
            
			<scroll-view v-show="categoryActive == 1" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <view class="collapse__cell">
                        <view class="collapse__label">
                            最低范围（吨）
                        </view>
                        <input class="collapse__input" type="number" v-model="load_min" placeholder="请输入" placeholder-style="color: #999;"/>
                    </view>
                    <view class="collapse__cell">
                        <view class="collapse__label">
                            最高范围（吨）
                        </view>
                        <input class="collapse__input" type="number" v-model="load_max" placeholder="请输入" placeholder-style="color: #999;"/>
                    </view>
				</view>
			</scroll-view>
            
			<scroll-view v-if="indexActive == 0" v-show="categoryActive == 2" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <block v-for="(item, index) of shipAgeList" :key="index">
                        <view class="collapse__cell" :class="index == shipAgeIndex ? 'collapse__cell--active' : ''" @click="_clickShipAge(index)">
                            {{item.name}}
                            <uni-icons v-if="index == shipAgeIndex" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                        </view>
                    </block>
                </view>
			</scroll-view>
            
			<scroll-view v-else v-show="categoryActive == 2" class="nav-right" scroll-y :style="'height:'+height+'px'" scroll-with-animation>
				<view class="collapse">
                    <view class="collapse__cell">
                        <view class="collapse__label">
                            最低价格（万）
                        </view>
                        <input class="collapse__input" type="number" v-model="price_min" placeholder="请输入" placeholder-style="color: #999;"/>
                    </view>
                    <view class="collapse__cell">
                        <view class="collapse__label">
                            最高价格（万）
                        </view>
                        <input class="collapse__input" type="number" v-model="price_max" placeholder="请输入" placeholder-style="color: #999;"/>
                    </view>
				</view>
			</scroll-view>
            
            
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
        
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="shipTypeIndex"
         @onConfirm="_setShipType" :pickerValueArray="shipTypeArray"></mpvue-picker>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    
    import { router, toast, dateUtils } from '@/common/util.js';
    
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
                shipTypeArray: [],
                shipTypeIndex: [0, 0],
                shipTypeId: '',
                shipTypeName: '',
                load_min: '',
                load_max: '',
                price_min: '',
                price_max: '',
                shipAgeList: [{value: 1,name: "1年以内",},{value: 2,name: "2年",},{value: 3,name: "3年",},{value: 4,name: "4年",},{value: 5,name: "5年",},{value: 6,name: "6年",},{value: 7,name: "7年",},{value: 8,name: "8年",},{value: 9,name: "9年",},{value: 10,name: "10年",},],
                shipAgeIndex: -1,
                indexActive: 0
            };
		},
        computed: mapState(['dictionaryTempData', 'screenTemp']),
        async onLoad(options) {
            toast.loading();
			// 获取货物type
			await this.getShipType();
			this.shipTypeArray = this.dictionaryTempData.ship_type;
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('rent')){
                let screen = this.screenTemp.rent;
                this.shipTypeIndex = screen.shipTypeIndex;
                this.shipTypeId = screen.shipTypeId;
                this.shipTypeName = screen.shipTypeName;
                this.load_min = screen.load_min;
                this.load_max = screen.load_max;
                this.indexActive = screen.indexActive;
                if(this.indexActive == 0){
                    this.shipAgeIndex = screen.shipAgeIndex;
                }else{
                    this.price_min = screen.price_min;
                    this.price_max = screen.price_max;
                }
            }
            toast.hideLoading();
        },
        methods: {
            ...mapActions(['getShipType']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _shipType() {
                this.$refs.mpvuePicker.show();
            },
			_setShipType(e) {
                this.shipTypeIndex = e.index;
                this.shipTypeId = e.value[1];
                this.shipTypeName = e.label;
			},
            _clickShipAge(index) {
                this.shipAgeIndex = index;
            },
            _clearDrawer(){
                this.shipTypeIndex = [0, 0];
                this.shipTypeId = '';
                this.shipTypeName = '';
                this.load_min = '';
                this.load_max = '';
                this.price_min = '';
                this.price_max = '';
                this.shipAgeIndex = -1;
                this.SCREEN_TEMP({
                    field: 'rent',
                    rent: {
                        'init': true,
                        'shipTypeIndex': [0, 0],
                        'shipTypeId': '',
                        'shipTypeName': '',
                        'load_min': '',
                        'load_max': '',
                        'price_min': '',
                        'price_max': '',
                        'shipAgeIndex': -1,
                        'indexActive': this.indexActive,
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'rent',
                    rent: {
                        'init': true,
                        'shipTypeIndex': this.shipTypeIndex,
                        'shipTypeId': this.shipTypeId,
                        'shipTypeName': this.shipTypeName,
                        'load_min': this.load_min,
                        'load_max': this.load_max,
                        'price_min': this.price_min,
                        'price_max': this.price_max,
                        'shipAgeIndex': this.shipAgeIndex,
                        'indexActive': this.indexActive
                    }
                });
                // 统计
                uni.report('screen_rent',{
                    'type': 'rent',
                    'shipTypeIndex': this.shipTypeIndex,
                    'shipTypeId': this.shipTypeId,
                    'shipTypeName': this.shipTypeName,
                    'load_min': this.load_min,
                    'load_max': this.load_max,
                    'price_min': this.price_min,
                    'price_max': this.price_max,
                    'shipAgeIndex': this.shipAgeIndex,
                    'indexActive': this.indexActive
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
            text-align: right;
            
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
