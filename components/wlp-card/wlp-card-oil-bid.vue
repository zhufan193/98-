<template>
    <view v-if="options" class="card card--full" :class="{'card--disable': options.state != 1}">
        <view class="card__head is_upDate" :data-index="index">
            <text class="card__title">
                {{options.ship_name}}
            </text>
            <view v-if="options.state == 1 && minute && second" class="card__helper">
                剩余时间：
                <view class="count__down">{{minute}}</view>
                :
                <view class="count__down">{{second}}</view>
            </view>
            <view v-if="options.state != 1" class="card__helper">
                {{options.state_str}}
            </view>
        </view>
        <view class="form">
            <view class="form__cell">
                <view class="form__label">支付方式</view>
                <text class="form__note">{{options.payment}}</text>
            </view>
            <view class="form__cell">
                <view class="form__label">加油港口</view>
                <text class="form__note">{{options.harbor}}</text>
            </view>
            <view class="form__cell">
                <view class="form__label">预计加油日期</view>
                <text class="form__note">{{options.refuel_at}}±{{options.refuel_at_num}}</text>
            </view>
            <block v-for="(item, index) of options.oil_product" :key="index">
                <view class="card__main--col form__cell">
                    <view class="card__col">
                        <view class="form__cell">
                            <view class="form__label">油品{{index + 1}}</view>
                            <text class="form__note">{{item.oil_type + '/' + item.amount}}吨</text>
                        </view>
                    </view>
                    <view class="card__col">
                        <view class="form__cell">
                            <view class="form__label">价格上限</view>
                            <text class="form__note">¥{{item.price}}元</text>
                        </view>
                    </view>
                </view>
            </block>
        </view>
        <view class="card__foot">
            <view v-if="options.state == 1" class="card__btn" @tap="_clickMessage()">
                查看详情
            </view>
            <view v-else class="card__btn card__btn--disable" @tap="_clickMessage()">
                查看结果
            </view>
        </view>
    </view>
</template>

<script>
    import uniIcons from '../uni-icons/uni-icons.vue';
    
    export default {
        components: {
            uniIcons
        },
        props: {
            options: {
                type: Object
            },
            index: {
                type: Number
            },
            minute: {
                type: String
            },
            second: {
                type: String
            }
        },
        methods: {
            _clickMessage(type) {
				this.$emit('click', {index: this.index, type: 'into'});
            },
            _phone(index) {
                let tel = this.options.verify_type == 2 ? this.options.company_phone : this.options.phone;
                uni.makePhoneCall({
                    phoneNumber: tel.toString()
                })
            }
        },
    }
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    
    .list{
        padding: $uni-spacing-col-lg $uni-spacing-row-base 0;
    }
    
    .card__head .card__helper{
        @include flex(center, center);
    }
    
    .count__down{
        height: 44rpx;
        line-height: 44rpx;
        margin: 0 5rpx;
        padding: 0 10rpx;
        font-size: 24rpx;
        color: #fff;
        background-color: $color-main;
        border-radius: 6rpx;
    }
    
    .card__main--col{
        padding: 0;
    }
    
    .card__col{
        padding: 0;
    }
    
    .card__foot{
        position: relative;
        justify-content: center;
        height: 54px;
        
        &::before{
            @include hr(top);
        }
    }
    
    .card__btn{
        @include flex(center, center);
        height: 38px;
        padding: 0 38px;
        color: #fff;
        background-color: $color-main;
        border-radius: 19px;
        
        &--disable{
            background-color: $uni-text-color-disable;
        }
    }
    
    .card.card--disable{
        .card__title, .card__helper, .form__label{
            color: #999;
        }
    }
</style>
