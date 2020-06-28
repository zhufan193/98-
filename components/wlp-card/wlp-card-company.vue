<template>
    <view class="list" v-if="options.length">
        <block v-for="(item, index) in options" :key="index">
            <view class="card" @tap="_clickMessage(index, 'main')">
                <view class="card__head">
                    <text class="card__title">
                        {{item.title}}
                    </text>
                    <view class="card__helper">
                        距我{{item.distance}}公里
                    </view>
                </view>
                <view class="card__content">
                    <view class="card__row">
                        <uni-icons type="location" size="20" color="#0091E6"></uni-icons>
                        {{item.addrs}}
                    </view>
                </view>
                <view class="card__foot card__foot--dashed" @click="_phone(item.phone)">
                    点击拨打电话：{{item.phone}}
                    <uni-icons type="phone" size="20" color="#999"></uni-icons>
                </view>
            </view>
        </block>
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
                type: Array
            }
        },
        data() {
            return {
                imgs: false
            }
        },
        methods: {
            _clickMessage(index, type) {
				this.$emit('click', {index: index, type: type});
            },
            _phone(tel) {
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
</style>
