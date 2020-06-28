<template>
    <view class="card card--full" @tap="_clickMessage()">
        <view class="card__content">
            <view class="card__head">
                <view class="card__title">
                    {{options.title}}
                </view>
                <view class="card__badge">{{options.verify_type == 2 ? '企业认证' : '个人认证'}}</view>
            </view>
            <view class="card__row" :class="type === 'sell' ? 'card__row--hr' : ''">
                <view class="card__grey">
                    {{options.type_na}}
                </view>
            </view>
            <view v-if="type === 'sell'" class="card__row" :data-index="index" :class="{is_lazy:!show}">
                <block v-for="(img, imgIndex) of options.images" :key="imgIndex">
                    <view class="card__img card__img--nth3 lazy">
                        <image class="lazy__img" :src="show ? img : ''" mode="aspectFill" @load="imageLoad(imgIndex)"></image>
                        <image class="lazy__img lazy__placeholder" :class="{lazy__loaded : loaded[imgIndex]}" src="/static/img/loading300x300.jpg" mode="aspectFill"></image>
                    </view>
                </block>
            </view>
        </view>
        <view class="card__foot card__foot--dashed">
            <view class="card__grey">
                {{type === 'sell' ? '产地：' + options.origin_text : '交货地：' + options.delivery_text}}
            </view>
            <view class="card__eye">
                {{options.browser}}人查看
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
            type: {
                type: String,
                default: 'sell'
            },
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
            _clickMessage() {
                this.$emit('click', {index: this.index, type: this.type});
            },
            _phone() {
                let tel = this.options.verify_type == 2 ? this.options.company_phone : this.options.phone;
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
    @import '@/style/page/card.scss';
    @import '@/style/page/lazy.scss';
    
    .card{
        &__head::after{
            display: none;
        }
        
        &__title{
            padding: 0;
            margin-bottom: $uni-spacing-col-base;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        
        &__eye{
            flex: none;
            font-size: 12px;
            color: #999;
        }
        
        &__content{
            padding-bottom: 0;
        }
        
        &__grey{
            color: #999;
        }
        
        &__foot{
            padding: $uni-spacing-col-lg 0;
        }
    }
</style>
