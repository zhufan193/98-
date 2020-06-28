<template>
    <view class="card card--full">
        <view class="card__banner lazy" :data-index="index" :class="{is_lazy: !show}" @tap="_clickMessage('img')">
            <image class="lazy__img" :src="show ? options.images[0] : ''" mode="aspectFill" @load="imageLoad()" @tap="_clickMessage('img')"></image>
            <image class="lazy__img lazy__placeholder" :class="{lazy__loaded : loaded}" src="/static/img/loading300x300.jpg" mode="aspectFill"></image>
        </view>
        <view class="card__title card__title--overflow" @tap="_clickMessage('title')">
            {{options.name}} 
        </view>
        <view class="card__main--col" @tap="_clickMessage('main')">
            <view class="card__col">
                <view class="card__row">
                    <view class="card__label">类型</view>：
                    <text class="card__info">{{options.type_cn}}</text>
                </view>
                <view class="card__row">
                    <view class="card__label">载重</view>：
                    <text class="card__info">{{options.load}}T</text>
                </view>
            </view>
            <view class="card__col">
                <view class="card__row">
                    <view class="card__label">出售价格</view>：
                    <text class="card__info card__info--red" v-if="options.price == 0">面议</text>
                    <text class="card__info card__info--red" v-else>{{options.price}}万元</text>
                </view>
                <view class="card__row">
                    <view class="card__label">建造年份</view>：
                    <text class="card__info">{{options.build_at}}年</text>
                </view>
            </view>
        </view>
        <view class="card__foot card__foot--dashed" @tap="_phone()">
            <view class="card__foot--info">
                {{options.publish_at}}
            </view>
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
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                loaded: false
            };
        },
        computed: {
            resCompanyNa(){
                let str = this.options.verify_type == 2 ? this.options.company_na : this.options.contact
                return str == '' ? '佚名' : str;
            }
        },
        methods: {
            _clickMessage(type) {
				this.$emit('click', {index: this.index, type: 'out'});
            },
            _phone() {
                let tel = this.options.verify_type == 2 ? this.options.company_phone : this.options.phone;
                uni.makePhoneCall({
                    phoneNumber: tel.toString()
                })
            },
            imageLoad(){
                this.loaded = true;
            }
        },
    }
</script>

<style lang="scss">
    @import '@/style/page/card.scss';
    @import '@/style/page/lazy.scss';
    
    .card__banner{
        margin-top: $uni-spacing-col-lg;
    }
    
    .card__main--col{
        padding-top: 0;
        padding-bottom: 0;
    }
    
    .card__foot--info{
        font-size: 12px;
    }
</style>
