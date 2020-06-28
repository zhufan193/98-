<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view class="uni-list">
            <block v-for="(item, index) of data[indexActive].list" :key="index">
                <uni-list-item v-if="indexActive === 0" @tap="_goDetail(0, index)" :title="item.name" :note="item.expire_state ? '' : item.note" :showArrow="!item.expire_state" :showBadge="item.expire_state" badgeType="error" badgeText="授权过期,重新授权"></uni-list-item>
                <uni-list-item v-if="indexActive === 1" @tap="_goDetail(1, index)" :title="item.name" :note="item.note"></uni-list-item>
                <uni-list-item v-if="indexActive === 2" @tap="_goDetail(2, index)" :title="item.name_cn" :note="item.note" :showArrow="item.review_state != 3" :showBadge="item.review_state == 3" badgeType="error" badgeText="审核不通过"></uni-list-item>
            </block>
        </view>
        <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
        <view v-else class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">{{itemsType[indexActive].empty}}</text>
        </view>
        <view class="foot">
            <button v-if="indexActive === 1" class="foot__btn" type="primary" @tap="_goPage('/pages/ship/apply/apply')">申请加入船舶</button>
            <button v-else class="foot__btn" type="primary" @tap="_goPage('/pages/ship/verify/verify')">添加船舶认证</button>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getShipList, getVerifyShipList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniSegmentedControl,
            uniListItem,
            uniLoadMore
        },
		data() {
			return {
                items: ['负责的船舶', '加入的船舶', '认证审核中'],
                itemsType: [
                    {
                        type: 'manage',
                        router: '/pages/ship/info/info',
                        note: '授权截止：',
                        empty: '您还未添加负责的船舶信息'
                    },{
                        type: 'join',
                        router: '/pages/ship/info/info',
                        note: '加入时间：',
                        empty: '暂无船舶加入信息'
                    },{
                        type: 'verify',
                        router: '/pages/ship/verify/verify',
                        note: '提交时间：',
                        empty: '暂无审核信息'
                    }
                ],
                data: [{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                }],
				indexActive: 0
			};
		},
        computed: mapState(['pageTempAdd']),
        onLoad() {
            this.getData();
        },
        onShow() {
            if(this.pageTempAdd.hasOwnProperty('shipManagerEdit') && this.pageTempAdd.shipManagerEdit){
                this.PAGE_TEMP_ADD({field: 'shipManagerEdit', shipManagerEdit: false});
                this.indexActive = 0;
                this.getData();
            }else if(this.pageTempAdd.hasOwnProperty('shipVerify') && this.pageTempAdd.shipVerify){
                this.PAGE_TEMP_ADD({field: 'shipVerify', shipVerify: false});
                this.indexActive = 2;
                this.getData();
            }
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        onReachBottom() { // 上拉触底
            this.getData('ReachBottom');
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _goPage(url, param = null) {
                router.navigateTo(url, param);
            },
            _goDetail(indexActive, itemIndex) {
                let obj = this.data[indexActive].list[itemIndex];
                if(indexActive === 0 && obj.expire_state){
                    toast.show('请重新授权');
                    return;
                }
                obj.type = 'ship';
                obj.permissions = this.itemsType[indexActive].type;
                router.navigateTo(this.itemsType[indexActive].router, obj);
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].page = 1;
                    this.data[index].loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
                if(index === 2){
                    getVerifyShipList({page: this.data[index].page}).then(res => {
                        this.setData(type, 2, res);
                    });
                }else{
                    getShipList({type: this.itemsType[index].type, page: this.data[index].page}).then(res => {
                        this.setData(type, index, res);
                    });
                }
            },
            setData(type, index, res){
                for(let i = 0, len = res.data.length; i < len; i++){
                    if(res.data[i].review_state != 3){
                        res.data[i].note = this.itemsType[index].note + res.data[i].expire_at;
                    }
					if (index != 0)
					{
						res.data[i].note = this.itemsType[index].note + res.data[i].created_at;
					}
                }
                if(this.data[index].page == 1){
                    this.data[index].list = res.data;
                }else{
                    this.data[index].list = this.data[index].list.concat(res.data);
                }
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }
                if(res.data.length < 15){
                    this.data[index].loadingType = 'noMore';
                }else{
                    this.data[index].loadingType = 'more';
                    this.data[index].page ++;
                }
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 54px 0; 
        
        .uni-list-item__content{
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        
        .uni-list-item__content-title{
            @include flex-self(full);
            font-size: $uni-font-size-base;
            color: $uni-text-color;
            min-width: 4.5em;
        }
        
        .uni-list-item__content-note{
            @include flex-self(keep);
            display: block;
            font-size: $uni-font-size-sm;
            color: $color-grey;
        }
        
        .uni-list-item__extra{
            width: auto;
            padding-left: $uni-spacing-row-base;
        }
        
        .uni-list::before, .uni-list::after{
            display: none;
        }
        
        .uni-list-item__container:after{
            left: 0;
        }
    }
</style>
