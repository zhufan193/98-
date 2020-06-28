<template>
	<view class="page">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
		<block v-for="(item, index) of data[indexActive].list" :key="index">
            <view class="card card--full">
                <view class="card__head" @tap="_goDetail(index)">
                    <view class="card__title">
                        {{item.name}}
                    </view>
                    <view class="card__helper" v-if="indexActive === 0 && item.expire_state" style="color:#ed3b00">
                        授权过期
                    </view>
                    <view class="card__helper" v-if="indexActive === 2" :style="item.review_state === 3 ? 'color:#ed3b00' : ''">
                        {{item.review_state_str}}
                    </view>
                </view>
                <view class="card__main--col" v-show="indexActive !== 1" @tap="_goDetail(index)">
                    <view class="card__col">
                        <view class="card__row">
                            <view class="card__label">授权方式</view>：
                            <text class="card__info">{{indexActive === 0 ? item.entrust_mode_na : item.entrust_mode_str}}</text>
                        </view>
                    </view>
                    <view class="card__col" v-if="indexActive === 0">
                        <view class="card__row">
                            <view class="card__label">授权截至</view>：
                            <text class="card__info card__info--time">{{item.expire_at}}</text>
                        </view>
                    </view>
                    <view class="card__col" v-if="indexActive === 2">
                        <view class="card__row">
                            <view class="card__label">提交时间</view>：
                            <text class="card__info card__info--time">{{item.resDate}}</text>
                        </view>
                    </view>
                </view>
                <view class="card__box" v-show="indexActive === 1" @click="_phone(item.business_call)">
                    <view class="card__row">
                        <view class="card__label" style="width: 5em;">企业管理员</view>：
                        <text class="card__info">{{item.manager_name}}</text>
                    </view>
                    <uni-icons type="phone" size="18" color="#999"></uni-icons>
                </view>
            </view>
        </block>
        <view v-if="!data[indexActive].list.length" class="empty">
            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
            <text class="empty__text">您还未添加任何信息</text>
        </view>
        <view class="foot">
            <button class="foot__btn" type="primary" v-show="indexActive !== 1" @tap="_goPage('/pages/company/verify/verify')">添加我负责的企业</button>
            <button class="foot__btn" type="primary" v-show="indexActive === 1" @tap="_goPage('/pages/company/apply/apply')">申请加入企业</button>
        </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { router, toast } from '@/common/util.js';
    import { getCompanyList, getCompanyVerifyList } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniSegmentedControl,
            uniIcons
        },
		data() {
			return {
                items: ['负责的企业', '加入的企业', '认证审核中'],
                itemsType: [
                    {
                        router: '/pages/company/info/info',
                        type: 'manage'
                    },{
                        router: '/pages/company/info/info',
                        type: 'join'
                    },{
                        router: '/pages/company/verify/verify',
                        type: 'verify'
                    }
                ],
                data: [{
                    list: [],
                    loadingType: 'more'
                },{
                    list: [],
                    loadingType: 'more'
                },{
                    list: [],
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
            if(this.pageTempAdd.hasOwnProperty('companyManagerEdit') && this.pageTempAdd.companyManagerEdit){
                this.PAGE_TEMP_ADD({field: 'companyManagerEdit', companyManagerEdit: false});
                this.indexActive = 0;
                this.getData();
            }else if(this.pageTempAdd.hasOwnProperty('companyVerify') && this.pageTempAdd.companyVerify){
                this.PAGE_TEMP_ADD({field: 'companyVerify', companyVerify: false});
                this.indexActive = 2;
                this.getData();
            }
        },
		onPullDownRefresh() { // 下拉刷新
            this.getData();
		},
        // onReachBottom() { // 上拉触底
        //     this.getData('ReachBottom');
        // },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _onClickItem(e) {
                this.indexActive = e;
                if(this.data[e].loadingType === 'more'){
                    this.getData();
                }
            },
            _goPage(url, param = null){
                router.navigateTo(url, param);
            },
            _goDetail(itemIndex) {
                let index = this.indexActive;
                if(index === 0 && this.data[index].list[itemIndex].expire_state){
                    toast.show('请重新授权');
                    return;
                }
                this._goPage(this.itemsType[index].router, {id: this.data[index].list[itemIndex].id, permissions: this.itemsType[index].type, review_state: this.data[index].list[itemIndex].review_state});
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
                if(index === 2){
                    getCompanyVerifyList().then(res => {
                        for(let i = 0, len = res.data.length; i < len; i++){
                            res.data[i].resDate = res.data[i].created_at.slice(0,10);
                        }
                        this.setData(type, 2, res);
                    });
                }else{
                    getCompanyList({type: this.itemsType[index].type}).then(res => {
                        this.setData(type, index, res);
                    });
                }
            },
            setData(type, index, res){
                this.data[index].list = res.data;
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }
                this.data[index].loadingType = 'noMore';
            },
			_phone(tel) {
			    uni.makePhoneCall({
			        phoneNumber: tel
			    })
			},
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/card.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding: 54px 0;
        overflow: hidden
    }
    
    .card__box{
        padding: $uni-spacing-col-base $uni-spacing-row-base;
    }
    
    .card__row{
        margin: 0;
    }
    
    .card__label, .card__info{
        color: #999;
        font-size: 12px;
    }
    
    .card__info--time{
        overflow:hidden;
        height:40rpx;
    }
</style>
