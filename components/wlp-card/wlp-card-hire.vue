<template>
    <view class="card card--full">
        <view class="card__head" @tap="_clickMessage('head')">
            <text class="card__title">
                {{options.title}}
            </text>
        </view>
        <view class="card__main--col" @tap="_clickMessage('main')">
            <view class="card__col">
                <view class="card__row">
                    <view class="card__label">船籍</view>：
                    <text class="card__info">{{options.ship_country}}</text>
                </view>
                <view class="card__row">
                    <view class="card__label">类型</view>：
                    <text class="card__info">{{options.type_cn}}</text>
                </view>
                <view class="card__row">
                    <view class="card__label">船龄</view>：
                    <text class="card__info">{{options.age}}年以内</text>
                </view>
            </view>
            <view class="card__col">
                <view class="card__row">
                    <view class="card__label">有效期</view>：
                    <text class="card__info">{{options.expire_at}}</text>
                </view>
                <view class="card__row">
                    <view class="card__label">载重</view>：
                    <text class="card__info">{{options.load_min + '~' + options.load_max}}T</text>
                </view>
                <view class="card__row">
                    <view class="card__label">月租金</view>：
                    <text class="card__info card__info--red" v-if="options.price == 0">面议</text>
                    <text class="card__info card__info--red" v-else>{{options.price}}元</text>
                </view>
            </view>
            <view class="card__row" v-if="options.remark">
                <view class="card__label">备注</view>：
                <text class="card__info card__info--textarea">{{options.remark}}</text>
            </view>
        </view>
        <view class="card__foot card__foot--dashed" @tap="_phone()">
            <view class="card__foot--info">{{options.publish_at}}</view>
            <view class="card__foot--info">
                {{resCompanyNa}}
                <uni-icons type="phone" size="16" color="#999"></uni-icons>
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
            }
        },
        computed: {
            resCompanyNa(){
                let str = this.options.verify_type == 2 ? this.options.company_na : this.options.contact
                return str == '' ? '佚名' : str;
            }
        },
        methods: {
            _clickMessage(type) {
				this.$emit('click', {index: this.index, type: 'beRent'});
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
    @import '@/style/page/card.scss';
    
    .list{
        padding: $uni-spacing-col-lg $uni-spacing-row-base 0;
    }
    
    .card__head .card__helper{
        font-size: 14px;
        color: $uni-text-color-grey;
    }
    
    .card__label{
        width: 3em;
    }
    
    .card__info--textarea{
        line-height: 1.6;
        padding-right: $uni-spacing-row-base;
    }
</style>
