<template>
	<view class="page">
        <uni-collapse :accordion="true">
            <block v-for="(item, index) of data" :key="index">
                <uni-collapse-item :title="item.name" @tap="_clickCollapse(index, item.id)">
                    <uni-list v-if="item.list">
                        <block v-for="(itemChildren, indexChildren) of item.list" :key="indexChildren">
                    		<uni-list-item :title="itemChildren.title" @click="_goPage(itemChildren)"/>
                        </block>
                    </uni-list>
                    <view v-if="item.list && !item.list.length" class="empty">
                        暂无
                    </view>
                </uni-collapse-item>
            </block>
        </uni-collapse>
	</view>
</template>

<script>
    import uniCollapse from '../components/uni-collapse/uni-collapse.vue';
    import uniCollapseItem from '../components/uni-collapse-item/uni-collapse-item.vue';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
    
    
    import { router, toast } from '@/common/util.js';
    import { getMaritimeBureau, getMaritimeOffice } from '@/service/getData.js';
    
	export default {
        components:{
			uniCollapse,
			uniCollapseItem,
			uniList,
			uniListItem
        },
		data() {
			return {
				data: []
			};
		},
        onLoad() {
            toast.loading();
            getMaritimeBureau().then(res => {
                toast.hideLoading();
                this.data = res.data;
            });
        },
        methods: {
            _goPage(e) {
                router.navigateTo('/pages/other/maritime_office_detail/maritime_office_detail', e);
            },
            _change(e) {
                console.log(e)
            },
            _clickCollapse(index, id) {
                if(!this.data[index].hasOwnProperty('list')){
                    toast.loading();
                    getMaritimeOffice({type: id}).then(res => {
                        toast.hideLoading();
                        this.$set(this.data[index], 'list', res.data);
                    });
                }
            }
        }
	}
</script>

<style lang="scss">
    .page{
        .uni-collapse-cell__title{
            padding: 30rpx;
        }
        
        .uni-list{
            box-sizing: border-box;
            padding-left: $uni-spacing-row-base * 2;
        }
        
        .uni-list-item__content-title{
            font-size: 28rpx;
        }
    }
    
    .empty{
        font-size: 24rpx;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: $uni-bg-color-grey;
    }
</style>
