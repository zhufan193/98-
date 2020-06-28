<template>
	<view class="search">
        <view class="search__list" v-if="is_search">
            <view class="empty" v-if="!data.length">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">暂无信息</text>
            </view>
            <view class="uni-list">
                <block v-for="(item, index) in data" :key="index">
                    <uni-list-item :title="item" @click="_clickItem(item)"></uni-list-item>
                </block>
            </view>
        </view>
        <view class="search__old" v-else>
            <view class="search__head">
                历史搜索
                <uni-icons type="trash" color="#999" size="24"></uni-icons>
            </view>
            <block v-for="(item, index) in data_old" :key="index">
                <view class="search__item" @tap="_clickItem(item)">
                    {{item}}
                </view>
            </block>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    
    import { router, toast, localStorage, debounce } from '@/common/util.js';
    import { getSearch } from '@/service/getData.js';
    
	export default {
        components: {
            uniIcons,
            uniListItem
        },
		data() {
			return {
                type: '',
				searchValue: '',
                data: [],
                data_old: [],
                is_search: false
			};
		},
        onLoad(options) {
            if(options && options.type){
                this.type = options.type;
                let obj = localStorage.getStore('search_old_' + this.type);
                if(!!obj){
                    this.data_old = JSON.parse(obj);
                }
                let currentWebview = this.$mp.page.$getAppWebview();
                if(options.value != ''){
                    currentWebview.setTitleNViewSearchInputText(options.value);
                }
                currentWebview.setStyle({titleNView:{searchInput:{placeholder: options.placeholder}}});
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            localStorage.setStore('search_value_' + this.type, '');
            router.navigateBack();
        },
        onNavigationBarSearchInputChanged(e) {
            this._searchChange(this, e.text);
        },
        onNavigationBarSearchInputConfirmed(e) {
            this._clickItem(e.text);
        },
        methods: {
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                if(val == ''){
                    vm.is_search = false;
                    vm.data = [];
                    return;
                }
                if(val == vm.searchValue){
                    return;
                }
                vm.searchValue = val;
                vm.getData();
            }, 1000, false),
            getData() {
                getSearch({type: this.type, search_value: this.searchValue}).then(res => {
                    this.data = res.data;
                    if(!this.data.length){
                        this.is_search = false;
                    }else{
                        this.is_search = true;
                    }
                });
            },
            _clickItem(val) {
                localStorage.setStore('search_value_' + this.type, val);
                if(val != ''){
                    let _dataOld = this.data_old;
                    _dataOld.some((value, index, arr) => {
                        if(val == value){
                            arr.splice(index, 1);
                            return true;
                        }
                    });
                    _dataOld.unshift(val);
                    if(_dataOld.length > 15){
                        _dataOld.pop();
                    } 
                    localStorage.setStore('search_old_' + this.type, JSON.stringify(_dataOld));
                }
                router.navigateBack();
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
    
    .empty{
        height: 600upx;
    }
    
    .search{
        
        &__list{
            @include flex(null, null, column);
        }
        
        .uni-list-item__content-title{
            font-size: $uni-font-size-base;
        }
        
        &__old{
            @include flex(null, null, null, wrap);
            padding-left: $uni-spacing-row-base;
        }
        
        &__head{
            @include flex(between, center);
            width: 100%;
            height: 44px;
            box-sizing: border-box;
            padding-right: $uni-spacing-row-base;
            color: $uni-text-color;
        }
        
        &__item{
            height: 38px;
            line-height: 38px;
            padding: 0 $uni-spacing-row-base;
            margin-bottom: $uni-spacing-col-base;
            margin-right: $uni-spacing-row-base;
            font-size: $uni-font-size-base;
            color: $uni-text-color-grey;
            background-color: #fff;
            border-radius: 44px;
        }
        
        &__trash{
            
        }
    }
</style>
