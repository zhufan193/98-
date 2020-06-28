<template>
    <view class="comment__list">
        <view class="comment__top" @tap="_clickMessage('user')">
            <image class="comment__face" :src="options.owner.avatar ? options.owner.avatar : '/static/img/avatar.png'" mode="aspectFill"></image>
            <view class="comment__info">
                <view class="comment__name">{{options.owner.nickname}}</view>
                <view class="comment__date">{{resDate}}</view>
            </view>
        </view>
        <view class="comment__content" @tap="_clickMessage('comment')">
            {{options.content}}
            <view v-if="options.reply" class="comment__reply" @tap="_clickMessage('reply')">
                @{{options.reply.owner.nickname}}：{{options.reply.content}}
            </view>
        </view>
    </view>
</template>

<script>
    import { dateUtils } from '@/common/util.js'
    
	export default {
        props: {
            options: {
                type: Object
            },
            index: {
                type: Number
            }
        },
        computed:{
            resDate() {
                return dateUtils.format(this.options.created_at);
            }
        },
        methods: {
            _clickMessage(type) {
				this.$emit('click', {index: this.index, type: type});
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/mixin/text-overflow.scss';
    
    .comment{
        
        &__list{
            position: relative;
            background-color: #fff;
            
            &::after{
                @include hr(bottom, $uni-spacing-row-lg);
            }
        }
        
        &__top{
            @include flex()
            padding: $uni-spacing-col-base $uni-spacing-row-lg;
        }
        
        &__face{
            @include flex-self(keep);
            display: block;
            width: $uni-img-size-lg;
            height: $uni-img-size-lg;
            border-radius: $uni-border-radius-circle;
        }
        
        &__info{
            @include flex(between, null, column);
            padding-left: $uni-spacing-row-base;
        }
        
        &__name{
            color: $color-grey;
            font-size: $uni-font-size-base;
        }
        
        &__date{
            color: $uni-text-color-grey;
            font-size: $uni-font-size-sm;
        }
        
        &__content{
            padding: 0 $uni-spacing-row-lg $uni-spacing-col-base;
            color: $uni-text-color;
            font-size: $uni-font-size-lg;
            word-wrap: break-word; 
            word-break: break-all;
        }
        
        &__reply{
            @include text-overflow();
            font-size: $uni-font-size-sm;
            margin-top: $uni-spacing-col-sm;
            padding: $uni-spacing-col-sm $uni-spacing-row-base;
            border-radius: $uni-border-radius-base;
            background-color: $uni-bg-color-grey;
            color: $uni-text-color;
        }
    }
</style>
