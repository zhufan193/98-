<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" :class="0 == categoryActive ? 'active' : ''" @click="categoryClickMain(0)">
                    地区
                    <uni-icons v-if="city_index != null" type="checkmarkempty" color="#0091E6" size="24"></uni-icons>
                </view>
			</scroll-view>
            
            <view v-show="categoryActive == 0" class="nav-right">
                <wlp-global :height="height" :default-index="city_index" :query-show="false" @click="_globalChange"></wlp-global>
            </view>
		</view>
        
        <view class="foot">
            <button type="primary" class="foot__btn foot__btn--right" @click="_clearDrawer()">重置</button>
            <button type="primary" class="foot__btn" @click="_sendDrawer()">确定</button>
        </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
    
    import { router, toast, dateUtils } from '@/common/util.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            wlpGlobal
        },
		data() {
			return {
                height: 0,
				categoryActive: 0,
                city_index: null,
                city_id: '',
			}
		},
        computed: mapState(['screenTemp']),
        async onLoad(options) {
            toast.loading();
            // 筛选地点
            await this.getGlobal();
            
            if(this.screenTemp && this.screenTemp.hasOwnProperty('agent')){
                let screen = this.screenTemp.agent;
                this.city_index = screen.city_index;
                this.city_id = screen.city_id;
            }
            toast.hideLoading();
            // global由height启动，需放数据加载后
            this.height = uni.getSystemInfoSync().windowHeight - 44;
        },
		methods: {
            ...mapActions(['getGlobal']),
            ...mapMutations(['SCREEN_TEMP']),
			categoryClickMain(index) {
				this.categoryActive = index;
			},
            _globalChange(e){
                if(this.categoryActive === 0){
                    this.city_index = e.index;
                    this.city_id = e.id[e.id.length - 1];
                }
            },
            _clearDrawer(){
                this.city_index = null;
                this.city_id = '';
                this.SCREEN_TEMP({
                    field: 'agent',
                    agent: {
                        'init': true,
                        'city_index': null,
                        'city_id': ''
                    }
                });
            },
            _sendDrawer(){
                this.SCREEN_TEMP({
                    field: 'agent',
                    agent: {
                        'init': true,
                        'city_index': this.city_index,
                        'city_id': this.city_id
                    }
                });
                // 统计
                uni.report('screen_agent',{
                    'type': 'agent',
                    'city_id': this.city_id
                });
                uni.navigateBack();
            }
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/foot.scss';
    
	.page-body {
		display: flex;
        background-color: #fff;
	}
    
	.nav-left {
        position: relative;
        flex: none;
		width: 196rpx;
        
        &::after{
            @include hr(right);
        }
	}

	.nav-left-item {
        position: relative;
		height: 54px;
        padding: 0 0 0 $uni-spacing-row-base;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
        
        &::after{
            @include hr(bottom);
        }
	}

	.nav-right {
        flex: auto;
	}

	.active {
		color: $color-main;
	}
    
    .foot__btn[type=primary]{
        background-color: $color-main;
        
        &::after{
            display: none;
        }
    }
    
    .foot__btn--right[type=primary]{
        background-color: #a2d7ff;
        
        &::after{
            display: none;
        }
    }
</style>