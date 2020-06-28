<template>
	<view class="global">
        <view v-if="queryShow" class="global__query">
            <view class="global__input">
                <icon type="search" size="16" color="#999"></icon>
                <input class="global__field" type="text" :value="globalQuery" @input="_queryInput" placeholder="查询" placeholder-style="color: #999;" />
                <view v-if="is_message" class="global__message" >
                    未查询到该地点！
                </view>
                <view class="uni-icon uni-icon-clear" v-if="showQueryClose" @click="_clearDrawerQuery()"></view>
            </view>
        </view>
        <scroll-view v-if="queryShow" v-show="is_query" class="global__list" scroll-y :style="{'height': height * 0.25 + 'px'}">
            <view class="global__content">
                <block v-for="(item, index) of globalQueryData" :key="index">
                    <view class="global__btn" @click="_queryClick(item)">
                        {{item.name}}
                    </view>
                </block>
            </view>
        </scroll-view>
        <view class="global__main">
            <scroll-view class="global__scroll" scroll-y :style="{height: (is_query ? height * 0.75 : height) + 'px'}">
                <block v-for="(item, index) of globalDataList" :key="index">
                    <view class="global__item" :class="{'active': globalIndex === index}" @click="_scrollItem('global', index)">
                        {{item.name}}
                        <uni-icons v-if="defaultIndex[0] == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </block>
            </scroll-view>
            <scroll-view class="global__scroll" scroll-y :style="{height: (is_query ? height * 0.75 : height) + 'px'}" :scroll-top="provinceTop" @scroll="_provinceScroll">
                <block v-for="(item, index) of provinceDataList" :key="index">
                    <view class="global__item" :class="{'active': provinceIndex === index && !item.empty}" @click="_scrollItem('province', index)">
                        {{item.name}}
                        <uni-icons v-if="defaultIndex[0] == globalIndex && defaultIndex[1] == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </block>
            </scroll-view>
            <scroll-view class="global__scroll" scroll-y :style="{height: (is_query ? height * 0.75 : height) + 'px'}" :scroll-top="cityTop" @scroll="_cityScroll">
                <block v-for="(item, index) of cityDataList" :key="index">
                    <view class="global__item" @click="_scrollItem('city', index)">
                        <view class="global__txt">
                            {{item.name}}
                            <uni-icons v-if="defaultIndex[0] == globalIndex && defaultIndex[1] == provinceIndex && defaultIndex[2] == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                        </view>
                    </view>
                </block>
            </scroll-view>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { toast, debounce, localStorage } from '@/common/util.js';
    import { getSearchGlobal } from '@/service/getData.js';
    
    import { mapActions } from 'vuex';
    
    var provinceData = {}, cityData = {};
    
	export default {
        components: {
            uniIcons
        },
		data() {
			return {
                // 搜索
                globalQueryData: [],
                globalQuery: '',
                is_message: false,
                showQueryClose: false,
                // 选择列表
                globalDataList: [],
				provinceDataList: [],
				cityDataList: [],
                globalIndex: 0,
                provinceIndex: 0,
                provinceTop: 0,
                cityTop: 0,
                provinceTopOld: 0,
                cityTopOld: 0,
			};
		},
		props: {
			/* 默认值 */
			height: {
				type: Number,
				default: 0
			},
            defaultIndex: {
                type: Array,
                default: function() {
                    return []
                }
            },
            queryShow: {
                type: Boolean,
                default: false
            }
		},
		watch: {
            height(e) {
                if(!this.globalDataList.length){
                    this.init();
                }
            }
		},
        computed: {
            is_query(){
                if(this.globalQueryData.length !== 0){
                    return true;
                }else{
                    return false;
                }
            }
        },
		methods: {
            ...mapActions(['getGlobal']),
            // 初始化
            init(){
                // 加载国家信息
                this.globalDataList = JSON.parse(localStorage.getStore('region_global'));
                this._getGlobal('global', 0);
            },
            // 防抖动搜索
            _searchChange: debounce((vm, val) => { 
                if(val == ''){
                    vm.globalQueryData = [];
                    return;
                }
                if(val == vm.globalQuery){
                    return;
                }
                vm.globalQuery = val;
                vm._getSearchGlobal(val);
            }, 1000, false),
            _getSearchGlobal(val) {
                toast.loading('查询中，请稍后');
                getSearchGlobal(val).then(res => {
                    toast.hideLoading();
                    if(!res.data.length){
                        this.is_message = true;
                    }else{
                        this.is_message = false;
                    }
                    this.globalQueryData = res.data;
                })
            },
            _queryInput(e) {
				if (e.detail.value.length > 0) {
					this.showQueryClose = true;
				} else {
					this.showQueryClose = false;
				}
                this._searchChange(this, e.detail.value);
            },
            _clearDrawerQuery(){
                this.globalQueryData = [];
                this.globalQuery = '';
                this.showQueryClose = false;
                this.is_message = false;
            },
            _queryClick(item) {
                item.path.push(item.id);
                this.$emit('click', {type: 'query', id: item.path, name: [item.name]});
                this.globalQueryData = [];
                this._clearDrawerQuery();
            },
            // 列表点击
            _scrollItem(type, index){
                if(type === 'global' && index !== this.globalIndex){
                    this._getGlobal('global', index);
                }else if(type === 'province'){
                    if(index !== this.provinceIndex){
                        this._getGlobal('province', index);
                    }else if(this.provinceDataList[index].hasOwnProperty('empty') && this.provinceDataList[index].empty){
                        this._click('global', this.globalIndex);
                    }
                }else if(type === 'city'){
                    if(this.cityDataList[index].hasOwnProperty('empty') && this.cityDataList[index].empty){
                        this._click('province', this.provinceIndex);
                    }else{
                        this._click('city', index);
                    }
                }
            },
            // 一、二级列表点击
            async _getGlobal(type, index){
                toast.loading();
                let globalItem, provinceItem;
                // 获取一级列表
                if(type === 'global'){
                    this.globalIndex = index;
                    globalItem = this.globalDataList[index];
                    // 获取二级列表
                    if(!provinceData.hasOwnProperty(globalItem.id)){
                        await this.getGlobal({global_id: globalItem.id, global_name: globalItem.name});
                        provinceData[globalItem.id] = JSON.parse(localStorage.getStore('region_global_province_' + globalItem.id));
                    }
                    this.provinceTop = this.provinceTopOld;
                    this.$nextTick(function() {
                    	this.provinceTop = 0;
                    });
                    this.provinceIndex = 0;
                    this.provinceDataList = provinceData[globalItem.id];
                    provinceItem = this.provinceDataList[0];
                }else{
                    this.provinceIndex = index;
                    globalItem = this.globalDataList[this.globalIndex];
                    provinceItem = this.provinceDataList[index];
                }
                // 获取三级列表
                if(!cityData.hasOwnProperty(provinceItem.id)){
                    if(provinceItem.hasOwnProperty('empty') && provinceItem.empty){
                        cityData[provinceItem.id] = [];
                    }else{
                        await this.getGlobal({province_id: provinceItem.id, province_name: provinceItem.name});
                        cityData[provinceItem.id] = JSON.parse(localStorage.getStore('region_global_city_' + provinceItem.id));
                    }
                }
                this.cityTop = this.cityTopOld;
                this.$nextTick(function() {
                    this.cityTop = 0;
                });
                this.cityIndex = 0;
                this.cityDataList = cityData[provinceItem.id];
                toast.hideLoading();
            },
            _click(type, index){
                let globalObj, provinceObj, cityObj;
                if(type === 'global'){
                    globalObj = this.globalDataList[index];
                }else{
                    globalObj = this.globalDataList[this.globalIndex];
                }
                if(type === 'province'){
                    provinceObj = this.provinceDataList[index];
                }else{
                    provinceObj = this.provinceDataList[this.provinceIndex];
                }
                if(type === 'city'){
                    cityObj = this.cityDataList[index];
                }else{
                    cityObj = this.cityDataList[this.cityIndex];
                }
                if(type === 'city'){
                    this.$emit('click', {type: type, id: [globalObj.id, provinceObj.id, cityObj.id], name: [globalObj.name, provinceObj.name, cityObj.name], index: [this.globalIndex, this.provinceIndex, index]});
                }else if(type === 'province'){
                    this.$emit('click', {type: type, id: [globalObj.id, provinceObj.id], name: [globalObj.name, provinceObj.name], index: [this.globalIndex, index]});
                }else{
                    this.$emit('click', {type: type, id: [globalObj.id], name: [globalObj.name], index: [index]});
                }
            },
            _provinceScroll(e) {
                this.provinceTopOld = e.detail.scrollTop;
            },
            _cityScroll(e) {
                this.cityTopOld = e.detail.scrollTop;
            }
		}
	};
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/mixin/text-overflow.scss';
    
    .global{
        width: 100%;
        
        &__query{
            @include flex(null, null, column);
            padding: 10px $uni-spacing-row-base;
        }
            
        &__input{
            @include flex(null, center);
            position: relative;
            padding: 0 $uni-spacing-row-base;
            background-color: $uni-bg-color-grey;
            border-radius: $uni-border-radius-base;
        }
        
        &__field{
            @include flex-self(full);
            height: 24px;
            line-height: 24px;
            padding: 6px 0 6px $uni-spacing-row-sm;
            color: $uni-text-color;
            font-size: 14px;
        }
        
        &__message{
            @include flex-self(keep);
            font-size: 10px;
            color: $uni-color-error;
        }
        
        &__list{
            box-sizing: border-box;
            padding: 0 $uni-spacing-row-base $uni-spacing-col-sm;
            overflow: hidden;
        }
        
        &__content{
            @include flex(null, null, null, wrap);
        }
        
        &__btn{
            position: relative;
            height: 22px;
            line-height: 22px;
            padding: 0 16px 0 8px;
            margin: 0 8px 8px 0;
            text-align: center;
            font-size: $uni-font-size-sm;
            color: $uni-color-error;
            background-color: #ffbba5;
            border-radius: $uni-border-radius-sm;
        }
        
        &__main{
            @include flex();
            position: relative;
            
            &::before, &::after{
                @include hr(top);
            }
            
            &::after{
                top: initial;
                bottom: 0;
            }
        }
        
        &__scroll{
            position:relative;
            width: 33.3%;
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
            }
        }
        
        &__item{
            @include flex(between, center);
            position: relative;
            height: 54px;
            padding: 0 $uni-spacing-row-base;
            color: $uni-text-color-grey;
            font-size: 14px;
            background-color: #fff;
            
            &::before{
                @include hr(bottom);
            }
            
            &.active{
                color: $color-main;
            }
        }
        
        &__txt{
            color: $uni-text-color-grey;
            font-size: 14px;
            @include text-overflow();
        }
    }
</style>
