<template>
	<view class="page">
        <view v-if="data.length" class="uni-list">
            <block v-for="(item, index) of data" :key="index">
                <uni-list-item :title="item.title" :note="item.resdate" :showArrow="false" :disabled="item.read_state" :showBadge="!item.read_state" badgeText=" " badgeType="error" @click="_goDetail(item)"></uni-list-item>
            </block>
        </view>
        <uni-load-more v-if="data.length" :status="loadingType"></uni-load-more>
		<view v-else class="empty">
		    <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
		    <text class="empty__text">暂无消息</text>
		</view>
	</view>
</template>

<script>
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, dateUtils } from '@/common/util.js';
    import { getMessage } from '@/service/getData.js';
    
    import { mapMutations } from 'vuex';
    
	export default {
        components:{
            uniListItem,
            uniLoadMore
        },
		data() {
			return {
                data: [],
                page: 1,
                loadingType: 'more'
			};
		},
        onLoad() {
            this.getData();
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods:{
            _goDetail(obj){
                obj.read_state = true;
                router.navigateTo('/pages/message/detail/detail', {id: obj.id});
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                getMessage({page: this.page}).then(res => {
                    for(let i = 0, len = res.data.length; i < len; i++){
                        res.data[i].resdate = dateUtils.format(res.data[i].created_at);
                    }
                    if(this.page == 1){
                        this.data = res.data;
                    }else{
                        this.data = this.data.concat(res.data);
                    }
                    if(type == 'DownRefresh'){
                        uni.stopPullDownRefresh();
                        toast.hideLoading();
                    }
                    if(res.data.length < 15){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page ++;
                    }
                });
            },
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/empty.scss';
    
    .page .uni-list-item__extra{
        width:initial;
        align-self:flex-start;
    }
    
    .page .uni-badge-error{
        padding: 4px;
    }
</style>
