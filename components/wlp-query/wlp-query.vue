<template>
    <view class="query" :class="{'query--disabled': disabled, 'query--fixed': fixed}">
        <block v-for="(item, index) in options" :key="index">
            <view class="query__cell" @tap="_clickCell(0)">
                <text class="query__txt">{{item.name}}</text>
                <uni-icons :type="index === indexActive ? 'arrowup' : 'arrowdown'" color="#333" size="12"></uni-icons>
            </view>
        </block>
    </view>
</template>

<script>
    import uniIcons from '../uni-icons/uni-icons.vue';
    
    export default {
        components:{
            uniIcons
        },
        props: {
            options: {
                type: Array
            },
            indexActive: {
                type: Number,
                default: -1
            },
            disabled: {
                type: Boolean,
                default: false
            },
            fixed: {
				type: Boolean,
				default: false
            }
        },
        methods: {
            _clickCell(type) {
    			this.$emit('click', {index: this.active, type: type});
            }
        }
    }
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    
    .query{
        @include flex(between);
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 44px;
        padding: 0 $uni-spacing-row-base;
        color: $uni-text-color;
        background-color: #fff;
        overflow: hidden;
        transition: height 700ms;
            
        &::after{
            @include hr(bottom);
        }
        
        &--disabled{
            height: 0px;
        }
        
        &--fixed{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            box-shadow: 0 4upx 6upx $uni-shadow-color;
            
            &::after{
                display: none;
            }
        }
        
        &__cell{
            @include flex(center, center);
        }
        
        &__txt{
            padding: 0 $uni-spacing-row-sm;
        }
    }
</style>
