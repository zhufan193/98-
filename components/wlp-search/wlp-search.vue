<template>
	<view class="search">
        <view class="search__list" v-if="visible">
            <view class="empty" v-if="!data.length">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">暂无信息</text>
            </view>
            <view class="uni-list">
                <block v-for="(item, index) in data" :key="index">
                    <uni-list-item :title="item" @click="_clickItem(index)"></uni-list-item>
                </block>
            </view>
        </view>
        <view class="search__old" v-else>
            <view class="search__head">
                历史搜索
                <uni-icons type="trash" color="#999" size="24"></uni-icons>
            </view>
            <block v-for="(item, index) in data_old" :key="index">
                <view class="search__item" @tap="_clickItem(index)">
                    {{item}}
                </view>
            </block>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    
    import { localStorage, debounce } from '@/common/util.js';
    import { getSearch } from '@/service/getData.js';
    
    export default {
        components: {
            uniIcons,
            uniListItem
        },
        props: {
            type: {
                type: String,
                default: ''
            },
            searchValue: {
                type: String,
                default: ''
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            searchValue(e) {
                console.log(e)
            },
            visible(e){
                console.log(e)
                // let obj = localStorage.getStore('search_old_' + this.type);
                // if(!!obj){
                //     this.data_old = JSON.parse(obj);
                // }
            }
        },
    	data() {
    		return {
                search_value_old: '',
                data_old: [],
                data: [],
                old_visable: true
    		};
    	},
        methods: {
            _searchChange: debounce((vm, val) => { // 防抖动搜索
                vm.searchValue = val;
                vm.getData();
            }, 1000, false),
            getData() {
                getSearch({type: this.type, search_value: this.searchValue}).then(res => {
                    this.data = res.data;
                    if(!this.data.length){
                        this.old_visable = true;
                    }else{
                        this.old_visable = false;
                    }
                });
            }
        }
    }
</script>

<style>
</style>
