<template>
    <view class="card card--full">
        <view class="card__content" @tap="_clickMessage('main')">
            <view class="card__head">
                <view class="card__title card__title--overflow">
                    {{options.title}}
                </view>
                <view class="card__badge">{{options.verify_type == 2 ? '企业认证' : '个人认证'}}</view>
            </view>
            <view class="card__row text-overflow card__row--hr">
                {{options.summary}}
            </view>
            <view class="card__row" :data-index="index" :class="{is_lazy:!show}">
                <block v-for="(img, imgIndex) of options.cover" :key="imgIndex">
                    <view class="card__img card__img--nth3 lazy">
                        <image class="lazy__img" :src="show ? img : ''" mode="aspectFill" @load="imageLoad(imgIndex)"></image>
                        <image class="lazy__img lazy__placeholder" :class="{lazy__loaded : loaded[imgIndex]}" src="/static/img/loading300x300.jpg" mode="aspectFill"></image>
                    </view>
                </block>
            </view>
        </view>
        <view class="card__foot--dashed">
            <view class="card__row" style="word-break: break-all;">
                {{options.addrs}}
            </view>
            <view class="card__row" @tap="_phone">
                <view class="card__info">
                    {{options.contact + '  ' + options.phone}}
                </view>
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
                loaded: [false, false, false]
            };
        },
        methods: {
            _clickMessage(type) {
                this.$emit('click', {index: this.index, type: type});
            },
            _phone() {
                // let tel = this.options.verify_type == 2 ? this.options.company_phone : this.options.phone;
                let tel = this.options.phone;
                uni.makePhoneCall({
                    phoneNumber: tel.toString()
                })
            },
            imageLoad(index){
                this.$set(this.loaded, index, true);
            }
        }
    }
</script>

<style lang="scss">
    @import '@/style/mixin/text-overflow.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/lazy.scss';
    
    .card{
        &__title{
            padding: 0 0 $uni-spacing-col-base 0;
        }
        
        &__head::after{
            display: none;
        }
        
        &__content{
            padding-bottom: 0;
        }
    }
    
    .text-overflow{
        @include text-overflow(100%, 2);
        word-break: break-all;
    }
</style>
