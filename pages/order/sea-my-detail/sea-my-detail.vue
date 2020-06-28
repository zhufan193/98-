<template>
	<view class="page" v-if="data">
        <view class="form" v-if="type === 'ship'">
            <view class="form__cell">
                <view class="form__label">船舶名称/类型</view>
                <view class="form__note">{{data.market.name}}/{{data.market.type}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">空船地</view>
                <view class="form__note">{{data.market.empty_na}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">受载日期</view>
                <view class="form__note">{{data.market.empty_at}}±{{data.market.empty_int}}</view>
            </view>
        </view>
        <view class="form" v-else>
            <view class="form__cell">
                <view class="form__label">货物类型/重量</view>
                <view class="form__note">{{data.market.name}}/{{data.market.weigh}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">装/卸地</view>
                <view class="form__note">{{data.market.departure_na}}/{{data.market.target_na}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">受载日期</view>
                <view class="form__note">{{data.market.empty_at}}±{{data.market.empty_int}}</view>
            </view>
        </view>
        <view class="form" v-if="type === 'ship'">
            <view class="form__cell">
                <view class="form__label">报价时间</view>
                <view class="form__note">{{data.offer.publish_at}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">货主名称</view>
                <view class="form__note">{{data.offer.name}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">我的货物</view>
                <view class="form__note">{{data.offer.type}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">货物重量</view>
                <view class="form__note">{{data.offer.weigh}}T</view>
            </view>
            <view class="form__cell">
                <view class="form__label">装货地</view>
                <view class="form__note">{{data.offer.departure_na}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">卸货地</view>
                <view class="form__note">{{data.offer.target_na}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">受载日期</view>
                <view class="form__note">{{data.offer.empty_at}}±{{data.offer.empty_int}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">承运单价（元/吨）</view>
                <view class="form__note">{{'￥' + data.offer.price + '元/吨'}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">定金（元）</view>
                <view class="form__note">{{'￥' + data.offer.earnest_money + '元'}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">是否含税</view>
                <view class="form__note">{{data.offer.tax}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">备注</view>
                <view class="form__note">{{data.offer.remark ? data.offer.remark : '无'}}</view>
            </view>
        </view>
        <view class="form" v-else>
            <view class="form__cell">
                <view class="form__label">报价时间</view>
                <view class="form__note">{{data.offer.publish_at}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">我的船舶</view>
                <view class="form__note">{{data.offer.name}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">船舶类型</view>
                <view class="form__note">{{data.offer.type}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">船舶载重</view>
                <view class="form__note">{{data.offer.load_amount}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">空船地</view>
                <view class="form__note">{{data.offer.empty_na}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">空船时间</view>
                <view class="form__note">{{data.offer.empty_at}}±{{data.offer.empty_int}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">承运单价（元/吨）</view>
                <view class="form__note">{{data.offer.price != 0 ? '￥' + data.offer.price + '元/吨' : '电议'}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">定金（元）</view>
                <view class="form__note">{{'￥' + data.offer.earnest_money + '元'}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">是否含税</view>
                <view class="form__note">{{data.offer.tax}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">备注</view>
                <view class="form__note">{{data.offer.remark ? data.offer.remark : '无'}}</view>
            </view>
        </view>
	</view>
</template>

<script>
    import { router, toast } from '@/common/util.js';
    import { getUserOfferDetail } from '@/service/getData.js';
    
	export default {
		data() {
			return {
				type: 'ship',
                id: null,
                data: null
			}
		},
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                toast.loading();
                getUserOfferDetail(this.id).then(res => {
                    toast.hideLoading();
                    this.type = res.data.offer_type;
                    this.data = res.data;
                });
            }
        },
		methods: {
			
		}
	}
</script>

<style lang="scss">
    @import '@/style/page/form.scss';
    
    .form{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
    }
</style>
