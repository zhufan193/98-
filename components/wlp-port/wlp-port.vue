<template>
	<view class="global">
        <view v-if="queryShow" class="global__query">
            <view class="global__input">
                <icon type="search" size="16" color="#999"></icon>
                <input class="global__field" type="text" :value="globalQuery" @input="_queryInput" placeholder="查询港口" placeholder-style="color: #999;" />
                <view v-if="is_message" class="global__message" >
                    未查询到该港口！
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
            <scroll-view class="global__scroll" scroll-y :style="{height: resHeight}">
                <block v-for="(item, index) of globalDataList" :key="index">
                    <view class="global__item" :class="{'active': globalIndex === index}" @click="_scrollItem('global', index)">
                        {{item.name}}
                        <uni-icons v-if="defaultIndex[0] == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </block>
            </scroll-view>
            <scroll-view v-if="provinceShow" class="global__scroll" scroll-y :style="{height: resHeight}" :scroll-top="provinceTop" @scroll="_provinceScroll">
                <block v-for="(item, index) of provinceDataList" :key="index">
                    <view class="global__item" :class="{'active': provinceIndex === index}" @click="_scrollItem('province', index)">
                        {{item.name}}
                        <uni-icons v-if="defaultIndex[0] == globalIndex && defaultIndex[1] == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </block>
            </scroll-view>
            
            <scroll-view class="global__scroll global__scroll--port" scroll-y :style="{height: resHeight}" :scroll-top="portTop" @scroll="_portScroll">
                <block v-for="(item, index) of portDataList" :key="index">
                    <view class="global__item" :class="{'active': portIndex === index}" @click="_scrollItem('port', index)">
                        {{item.name}}
                        <uni-icons v-if="portIndex == index" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                    </view>
                </block>
            </scroll-view>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { toast, debounce, localStorage } from '@/common/util.js';
    import { getSearchPort } from '@/service/getData.js';
    
    import { mapActions } from 'vuex';
    
    var provinceData = {}, portData = {};
    
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
				portDataList: [],
                globalIndex: 0,
                provinceIndex: 0,
                portIndex: -1,
                provinceTop: 0,
                portTop: 0,
                provinceTopOld: 0,
                portTopOld: 0,
                provinceShow: true,
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
            },
            defaultIndex(e){
                if(e.length === 2){
                    this.portIndex = e[1];
                    this.init();
                }else if(e.length === 3){
                    this.portIndex = e[2];
                    this.init();
                }else if(!e.length){
                    this.portIndex = -1;
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
            },
            resHeight() {
                return (this.is_query ? this.height * 0.75 : this.height) + 'px';
            }
        },
		methods: {
            ...mapActions(['getGlobal', 'getPort']),
            // 初始化
            async init(){
                // 加载国家信息
                this.globalDataList = JSON.parse(localStorage.getStore('region_global'));
                
                // 加载首位国家下级列表
                await this._getGlobal('init', 0);
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
                vm._getSearchPort(val);
            }, 1000, false),
            _getSearchPort(val) {
                toast.loading('查询中，请稍后');
                getSearchPort(val).then(res => {
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
                this.$emit('click', {type: 'port', port_id: item.id, port_name: item.name});
                this.globalQueryData = [];
                this._clearDrawerQuery();
            },
            // 列表点击
            _scrollItem(type, index){
                // !=禁止点击重复项
                if(type === 'global' && index !== this.globalIndex){
                    this._getGlobal('global', index);
                }else if(type === 'province' && index !== this.provinceIndex){
                    this._getGlobal('province', index);
                }else if(type === 'port'){
                    this.portIndex = index;
                    this._click('port', index);
                }
            },
            // 一、二、三级列表点击
            async _getGlobal(type, index){
                toast.loading();
                let port_parent; // 用于存放港口父级（可能情况有国、省、市）
                this.provinceDataList = [];
                this.portDataList = [];
                if(type === 'global'){
                    // 修改一级选中状态
                    this.globalIndex = index;
                }
                // 修改二级选中状态
                if(type === 'province'){
                    this.provinceIndex = index;
                }else{
                    this.provinceIndex = 0;
                    // 滚动到顶部
                    this.provinceTop = this.provinceTopOld;
                    this.$nextTick(function() {
                        this.provinceTop = 0;
                    });
                }
                // 初始化default有改动情况下
                if(type === 'init'){
                    // 修改一级选中状态
                    this.globalIndex = this.defaultIndex.length > 1 ? this.defaultIndex[0] : 0;
                    this.provinceIndex = this.defaultIndex.length === 3 ? this.defaultIndex[1] : 0;
                }
                // 获取二级列表
                let globalItem = this.globalDataList[this.globalIndex];
                if(!provinceData.hasOwnProperty(globalItem.id)){
                    await this.getGlobal({global_id: globalItem.id, global_name: globalItem.name});
                    provinceData[globalItem.id] = JSON.parse(localStorage.getStore('region_global_province_' + globalItem.id));
                }
                // 判断国家是否有省会
                if(provinceData[globalItem.id][0].hasOwnProperty('empty')){
                    port_parent = provinceData[globalItem.id][0];
                    port_parent.type = 'country';
                    this.provinceShow = false;
                }else{
                    this.provinceDataList = provinceData[globalItem.id];
                    port_parent = this.provinceDataList[this.provinceIndex];
                    port_parent.type = 'province';
                    this.provinceShow = true;
                }
                // 修改港口选中状态
                this.portIndex = -1;
                if(type === 'init' && this.defaultIndex.length === 2){
                    this.portIndex = this.defaultIndex[1];
                }else if(type === 'init' && this.defaultIndex.length === 3){
                    this.portIndex = this.defaultIndex[2];
                }
                // 滚动到顶部
                this.portTop = this.portTopOld;
                this.$nextTick(function() {
                    this.portTop = 0;
                });
                // 获取港口列表
                if(!portData.hasOwnProperty(port_parent.id)){
                    await this.getPort({id: port_parent.id, code: port_parent.type});
                    portData[port_parent.id] = JSON.parse(localStorage.getStore('region_port_' + port_parent.id));
                }
                this.portDataList = portData[port_parent.id];
                toast.hideLoading();
            },
            _click(type, index){
                let globalObj = this.globalDataList[this.globalIndex],
                    provinceObj = this.provinceDataList[this.provinceIndex],
                    portObj = this.portDataList[this.portIndex];
                if(type === 'port'){
                    if(!this.provinceDataList.length){    
                        this.$emit('click', {type: type, id: [globalObj.id], name: [globalObj.name], port_id: portObj.id, port_name: portObj.name, index: [this.globalIndex, index]});
                    }else{    
                        this.$emit('click', {type: type, id: [globalObj.id, provinceObj.id], name: [globalObj.name, provinceObj.name], port_id: portObj.id, port_name: portObj.name, index: [this.globalIndex, this.provinceIndex, index]});
                    }
                }else if(type === 'province'){
                    this.$emit('click', {type: type, id: [globalObj.id, provinceObj.id], name: [globalObj.name, provinceObj.name], port_id: provinceObj.id, port_name: provinceObj.name, index: [this.globalIndex, index]});
                }else{
                    this.$emit('click', {type: type, id: [globalObj.id], name: [globalObj.name], port_id: globalObj.id, port_name: globalObj.name, index: [index]});
                }
            },
            _provinceScroll(e) {
                this.provinceTopOld = e.detail.scrollTop;
            },
            _portScroll(e) {
                this.portTopOld = e.detail.scrollTop;
            },
		}
	};
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/mixin/text-overflow.scss';
    
    .global{
        &__query{
            @include flex(null, null, column);
            padding: $uni-spacing-col-base $uni-spacing-row-base;
        }
            
        &__input{
            @include flex(null, center);
            position: relative;
            padding: 0 $uni-spacing-row-base;
            border-radius: $uni-border-radius-base;
            background-color: $uni-bg-color-grey;
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
            border-radius: $uni-border-radius-base;
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
            min-width: 6em;
            max-width: 50%;
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
            }
            
            &--port{
                flex-grow: 1;
                flex-shrink: 0;
                width: auto;
                min-width: 33.33%;
            }
        }
        
        &__item{
            @include flex(between, center);
            position: relative;
            box-sizing: border-box;
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
            overflow: hidden;
            white-space: nowrap;
        }
    }
</style>
