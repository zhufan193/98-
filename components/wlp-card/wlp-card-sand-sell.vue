<template>
    <view class="card card--full" @tap="_clickMessage()">
        <view class="card__content" :class="{'card__content--left': resImagesNum}">
            <view class="card__right">
                <view class="card__head">
                    <view class="card__title">
                        {{options.title}}
                    </view>
                    <view class="card__badge">{{options.verify_type == 2 ? '企业认证' : '个人认证'}}</view>
                </view>
                <view :class="[resImagesNum ? 'card__col' : 'card__row card__row--reverse', {'card__row--bottom': resImagesNum}]">
                    <view class="card__red">
                        {{resPrice > 0 ? resPrice + '元/吨' : '电议'}}
                    </view>
                    <view class="card__grey">
                        {{options.type_na}}
                    </view>
                </view>
            </view>
            <view :data-index="index" :class="[resImagesNum ? 'card__left' : 'card__row', {is_lazy: !show}]">
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
                交货地：{{resDelivery}}
            </view>
            <view class="card__eye">
                {{resPublishAt}}
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
        computed: {
            resImagesNum(){
                return this.options.images.length === 1;
            },
            resPrice(){
                return this.options.max_price == this.options.min_price ? this.options.min_price : (this.options.min_price + '~' + this.options.max_price);
            },
            resDelivery(){
                let arr = this.options.delivery_text.split(',');
                arr.shift();
                let str = arr.join(',');
                return str;
            },
            resPublishAt(){
                return this.options.publish_at.slice(0, 10);
            }
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
        
        &__head{
            margin-bottom: $uni-spacing-col-base;
            
            &::after{
                display: none;
            }
        }
        
        &__title{
            padding: 0;
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
            padding: $uni-spacing-col-base * 1.8 $uni-spacing-row-base 0;
            
            &--left{
                display: flex;
                flex-direction: row-reverse;
                padding-bottom: $uni-spacing-col-base;
            }
        }
        
        &__left{
            flex: none;
        }
        
        &__right{
            flex: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        &__row{
            &--reverse{
                flex-direction: row-reverse;
                justify-content: space-between;
            }
            
            &--bottom{
                margin-bottom: 0;
            }
        }
        
        &__col{
            flex: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            padding: 0;
        }
        
        &__red{
            display: flex;
            color: $color-sub;
        }
        
        &__grey{
            color: #999;
        }
        
        &__foot{
            padding: $uni-spacing-col-base * 1.25 0;
        }
    }
</style>
