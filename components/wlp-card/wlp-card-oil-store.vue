<template>
    <view class="card card--full">
        <view class="card__content card__content--left" @tap="_clickMessage('main')">
            <view class="card__right">
                <view class="card__head">
                    <text class="card__title" style="color: #0091E6;font-size: 30upx;">
                        {{options.gsmc}}
                    </text>
                    <!-- <view class="card__badge">{{options.verify_type == 2 ? '企业认证' : '个人认证'}}</view> -->
                </view>
                <view class="card__row text-overflow">
                    供应区域：{{options.gyqy}}
                </view>
				<view class="card__row text-overflow" style="color: #359f4e;">
				    油种价格：{{options.yzjg}}
				</view>
            </view>
            <view class="card__left"  :data-index="index" :class="{is_lazy:!show}">
                    <view class="card__img card__img--nth3 lazy">
						<image class="lazy__img" :src="options.pic" mode="aspectFill" @load="imageLoad(0)"></image>
                        <!-- <image class="lazy__img" :src="show ? options.images[0] : ''" mode="aspectFill" @load="imageLoad(0)"></image>
                        <image class="lazy__img lazy__placeholder" :class="{lazy__loaded : loaded[0]}" src="/static/img/loading300x300.jpg" mode="aspectFill"></image> -->
                    </view>
            </view>
        </view>
        <!-- <view class="card__foot card__foot--dashed" @tap="_phone()">
            <view class="card__info">
                {{options.yzjg}}
            </view>
            <uni-icons type="phone" size="16" color="#999"></uni-icons>
        </view> -->
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
                let tel = this.options.phone ? this.options.phone : this.options.company_phone;
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
        &__head::after{
            display: none;
        }
        
        &__title{
            padding: 0 0 $uni-spacing-col-sm 0;
        }
        
        &__content{
            padding-bottom: 0;
            
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
    }
    
    .text-overflow{
        @include text-overflow(100%, 2);
        word-break: break-all;
        margin: 0;
    }
</style>
