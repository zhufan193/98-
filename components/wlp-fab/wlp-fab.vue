<template>
	<view class="fab" @tap="_onClick">
        <view class="fab__icon"></view>
        <view class="fab__text">
            {{title}}
        </view>
    </view>
</template>

<script>
	export default {
        props: {
            title: {
                type: String,
                default: '发布'
            }
        },
        methods: {
            _onClick() {
                this.$emit('click');
            },
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    
    .fab{
        @include flex(center, center);
        position: fixed;
        bottom: 10%;
        right: 0;
        z-index: 10;
        height: 34px;
        box-sizing: border-box;
        padding: 0 $uni-spacing-row-base 0 17px;
        background-color: #3c81df;
        border-radius: 17px 0 0 17px;
        
        &__icon{
            position: relative;
            width: 12px;
            height: 12px;
            margin: 0 $uni-spacing-col-sm 0 0;
                
            &::before, &::after{
                content: " ";
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                background-color: #fff;
                border-radius: 1rpx;
            }
            
            &::before {
            	width: 4rpx;
            	height: 100%;
            }
            
            &::after {
            	width: 100%;
            	height: 4rpx;
            }
        }
        
        &__text{
            font-size: 13px;
            color: #fff;
        }
    }
</style>
