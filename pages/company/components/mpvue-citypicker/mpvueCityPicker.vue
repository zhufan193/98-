<template>
	<div class="mpvue-picker">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<div class="mpvue-picker__hd" catchtouchmove="true">
				<div class="mpvue-picker__action" @click="pickerCancel">取消</div>
				<div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
			</div>
            <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
                <picker-view-column>
                    <block v-for="(item,index) in provinceDataList" :key="index">
                        <view class="picker-item">{{item.name}}</view>
                    </block>
                </picker-view-column>
                <picker-view-column v-if="deepLength > 1">
                    <block v-for="(item,index) in cityDataList" :key="index">
                        <view class="picker-item">{{item.name}}</view>
                    </block>
                </picker-view-column>
                <picker-view-column v-if="deepLength > 2">
                    <block v-for="(item,index) in areaDataList" :key="index">
                        <view class="picker-item">{{item.name}}</view>
                    </block>
                </picker-view-column>
            </picker-view>
		</div>
	</div>
</template>

<script>
	import { localStorage } from '@/common/util.js';
	
    var cityData = {}, areaData = {};
    
	export default {
		data() {
			return {
				pickerValue: [0],
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				/* 是否显示控件 */
				showPicker: false,
			};
		},
		props: {
            /* 联动 */
            deepLength: {
                type: Number,
				default: 1
            },
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0]
				}
			},
			/* 主题色 */
			themeColor: String
		},
		watch: {
			pickerValueDefault(e) {
                this.provinceDataList = JSON.parse(localStorage.getStore('region_province'));
                if(this.deepLength > 1){
                    cityData = JSON.parse(localStorage.getStore('region_city'));
                }
                if(this.deepLength > 2){
                    areaData = JSON.parse(localStorage.getStore('region_area'));
                }
                this.$nextTick(()=>{
                    this.init(e, 'init');
                    this.pickerValue = e;
                });
			}
		},
		methods: {
			init(pickerValue, type) {
                if(this.deepLength > 1 && (type == 'init' || (type == 'change' && pickerValue[0] !== this.pickerValue[0]))){
                    let cityIndex = this.provinceDataList[pickerValue[0]].id;
                    if(cityData.hasOwnProperty(cityIndex)){
                        this.cityDataList = cityData[cityIndex].children;
                    }else{
                        this.cityDataList = [{
                            name: '全部'
                        }];
                    }
                }
                if(this.deepLength > 2){
                    let areaIndex = this.cityDataList[pickerValue[1]].id;
                    if(areaData.hasOwnProperty(areaIndex)){
                        this.areaDataList = areaData[areaIndex].children;
                    }else{
                        this.areaDataList = [{
                            name: '全部'
                        }];
                    }
                }
			},
            show() {
                setTimeout(() => {
                    this.showPicker = true;
                }, 0);
            },
			maskClick() {
				this.showPicker = false;
				this._$emit('onMaskClick');
			},
			pickerCancel() {
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			pickerChange(e) {
                let pickerValue = e.detail.value;
                if(this.deepLength > 2 && pickerValue[1] != this.pickerValue[1]){
                    pickerValue[2] = 0;
                }
                if(this.deepLength > 1 && pickerValue[0] != this.pickerValue[0]){
                    pickerValue[1] = 0;
                    pickerValue[2] = 0;
                }
                this.init(pickerValue, 'change');
                this.pickerValue = pickerValue;
				this._$emit('onChange');
			},
			_$emit(emitName) {
                let province = this.provinceDataList[this.pickerValue[0]];
				let pickObj = {
                    province_name: province.name,
					province_id: province.id,
                    provinces: province.name,
					index: this.pickerValue
				};
                if(this.deepLength > 1){
                    let city = this.cityDataList[this.pickerValue[1]];
                    if(city.name !== '全部'){
                        pickObj.provinces = pickObj.provinces + '-' + city.name;
                        pickObj.city_name = city.name;
                        pickObj.city_id = city.id;
                    }else{
                        pickObj.city_name = null;
                        pickObj.city_id = 0;
                    }
                }
                if(this.deepLength > 2){
                    let area = this.areaDataList[this.pickerValue[2]];
                    if(area.name !== '全部'){
                        pickObj.provinces = pickObj.provinces + '-' + area.name;
                        pickObj.area_name = area.name;
                        pickObj.area_id = area.id;
                    }else{
                        pickObj.area_name = null;
                        pickObj.area_id = 0;
                    }
                }
				this.$emit(emitName, pickObj);
			}
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
