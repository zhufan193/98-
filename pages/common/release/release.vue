<template>
	<view class="page">
        <view class="full">
            <view class="time">
                {{time}}
            </view>
            <view class="date">
                {{resDate}}
            </view>
        </view>
        <view class="full__title">
            快捷发布
        </view>
        <view class="grid">
            <view class="grid__item" @tap="goPage('/pages/sail/release/release')">
                <image class="grid__img" src="/static/icon/release-1.png" mode="aspectFit"></image>
                <view class="grid__title">船期</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/pallet/release/release')">
                <image class="grid__img" src="/static/icon/release-2.png" mode="aspectFit"></image>
                <view class="grid__title">货盘</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/oil/release/release')">
                <image class="grid__img" src="/static/icon/release-3.png" mode="aspectFit"></image>
                <view class="grid__title">竞价加油</view>
            </view>
            <view class="grid__item" @tap="togglePopup('sand')">
                <image class="grid__img" src="/static/icon/release-4.png" mode="aspectFit"></image>
                <view class="grid__title">砂石骨料</view>
            </view>
        </view>
        <view class="grid">
            <view class="grid__item" @tap="togglePopup('deal')">
                <image class="grid__img" src="/static/icon/release-5.png" mode="aspectFit"></image>
                <view class="grid__title">船舶买卖</view>
            </view>
            <view class="grid__item" @tap="togglePopup('rent')">
                <image class="grid__img" src="/static/icon/release-6.png" mode="aspectFit"></image>
                <view class="grid__title">船舶租赁</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/maintenance/maintenance-add/maintenance-add')">
                <image class="grid__img" src="/static/icon/release-7.png" mode="aspectFit"></image>
                <view class="grid__title">船舶维修</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/parts/parts-add/parts-add')">
                <image class="grid__img" src="/static/icon/release-8.png" mode="aspectFit"></image>
                <view class="grid__title">船舶备件</view>
            </view>
        </view>
        <view class="grid">
            <view class="grid__item" @tap="goPage('/pages/agent/agent-add/agent-add')">
                <image class="grid__img" src="/static/icon/release-9.png" mode="aspectFit"></image>
                <view class="grid__title">船舶代理</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/financial/financial-add/financial-add')">
                <image class="grid__img" src="/static/icon/release-10.png" mode="aspectFit"></image>
                <view class="grid__title">财务咨询</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/law/law-add/law-add')">
                <image class="grid__img" src="/static/icon/release-11.png" mode="aspectFit"></image>
                <view class="grid__title">法律咨询</view>
            </view>
            <view class="grid__item" @tap="goPage('/pages/oil/store-add/store-add')">
                <image class="grid__img" src="/static/icon/release-12.png" mode="aspectFit"></image>
                <view class="grid__title">油商</view>
            </view>
        </view>
        
        <view class="grid">
            <view class="grid__item" @tap="goPage('/pages/common/feedback/feedback')">
                <image class="grid__img" src="/static/icon/release-13.png" mode="aspectFit"></image>
                <view class="grid__title">意见建议</view>
            </view>
            <view class="grid__item">
            </view>
            <view class="grid__item">
            </view>
            <view class="grid__item">
            </view>
        </view>
        
        <view class="close" @tap="close">
            <uni-icons size="55" color="#ccc" type="close"></uni-icons>
            <!-- 关闭 -->
        </view>
        
        <uni-popup :show="type !== ''" position="middle" mode="fixed" @hidePopup="togglePopup('')">
            <template v-if="type === 'sand'">
                <uni-icons class="popup__close" type="closeempty" size="32" color="#333" @click="togglePopup('')"/>
                <view class="popup__text">选择砂石骨料类型</view>
                <button class="popup__btn" type="primary" @click="goPage('/pages/sand/buy-add/buy-add')">求购</button>
                <button class="popup__btn" type="warn" @click="goPage('/pages/sand/sell-add/sell-add')">供应</button>
            </template>
            <template v-if="type === 'deal'">
                <uni-icons class="popup__close" type="closeempty" size="32" color="#333" @click="togglePopup('')"/>
                <view class="popup__text">选择船舶交易类型</view>
                <button class="popup__btn" type="primary" @click="goPage('/pages/deal/buy-add/buy-add')">求购</button>
                <button class="popup__btn" type="warn" @click="goPage('/pages/deal/sell-add/sell-add')">出售</button>
            </template>
            <template v-if="type === 'rent'">
                <uni-icons class="popup__close" type="closeempty" size="32" color="#333" @click="togglePopup('')"/>
                <view class="popup__text">选择船舶租赁类型</view>
                <button class="popup__btn" type="primary" @click="goPage('/pages/rent/hire-add/hire-add')">求租</button>
                <button class="popup__btn" type="warn" @click="goPage('/pages/rent/rent-add/rent-add')">出租</button>
            </template>
        </uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    import { router, dateUtils, localStorage } from '@/common/util.js';
    
    import { mapState, mapMutations } from 'vuex';
    
    var time_id = null;
    
	export default {
        components: {
            uniPopup,
            uniIcons
        },
		data() {
			return {
                date: new Date(),
                time: dateUtils.formatStr('HH:mm'),
                type: ''
            };
		},
        computed: {
            ...mapState(['hasLogin']),
            resDate(){
                let day = '天';
                switch(this.date.getDay()){
                    case 1:
                        day = '一'
                        break;
                    case 2:
                        day = '二'
                        break;
                    case 3:
                        day = '三'
                        break;
                    case 4:
                        day = '四'
                        break;
                    case 5:
                        day = '五'
                        break;
                    case 6:
                        day = '六'
                }
                return (this.date.getMonth() + 1) + '月' + this.date.getDate() + '日，星期' + day;
            }
        },
        onShow() {
            this.setDateFun();
            time_id = setInterval(this.setDateFun, 1000);
        },
        onUnload() {
            localStorage.setStore('tabBarIndex', 2);
            clearInterval(time_id);
        },
		onBackPress() {
			if (this.type !== '') {
				this.type = '';
				return true;
			}
		},
        methods: {
            ...mapMutations(['GOPAGE_LOGIN']),
			togglePopup(type) {
				this.type = type;
			},
            goPage(url){
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                router.navigateTo(url);
            },
            close() {
                let tabBarItem = ['/pages/tabBar/home/home','/pages/tabBar/sail/sail','','/pages/tabBar/pallet/pallet','/pages/tabBar/profile/profile'];
                router.switchTab(tabBarItem[localStorage.getStore('tabBarIndex')]);
            },
            setDateFun() {
                let date = new Date();
                if(date.getSeconds() == 0){
                    this.time = dateUtils.formatStr('HH:mm');
                    if(date - this.date >= 86400000){
                        this.date = date;
                    }
                }
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    
    page, .page{
        height: 100%;
        background-color: #f0f0f0;
    }
    
    .page{
        @include flex(null, null, column);
        box-sizing: border-box;
        padding: 0 $uni-spacing-row-lg * 2 30px;
        
        &__back{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1
        }
    }
    
    .full{
        @include flex-self(full);
        @include flex(center, null, column);
        padding: $uni-spacing-col-lg 0 0;
        
        .time{
            text-align: center;
            color: #000;
            font-size: 68px;
        }
        
        .date{
            text-align: center;
            color: #000;
            font-size: 14px;
        }
        
        &__title{
            @include flex(between, center);
            padding: 22px 0;
            color: #000;
            font-weight: 700;
            
            &::before, &::after{
                @include flex-self(full);
                content: '';
                height: 1rpx;
                margin: 0 16rpx 0 0;
                background-color: rgba(0, 0, 0, 0.3);
            }
            
            &::after{
                margin: 0 0 0 16rpx;
            }
        }
    }

    .grid{
        @include flex(around, null, null, wrap);
        padding: 0 0 24px;
        
        &__item{
            @include flex(null, center, column);
            width: 96upx;
        }
        
        &__img{
            display: block;
            width: 96upx;
            height: 96upx;
            margin-bottom: 8px; 
        }
        
        &__title{
            color: #000;
            line-height: 13px;
            font-size: 13px;
            white-space:nowrap;
        }
    }
    
    .close{
    //     height: 50px;
    //     line-height: 50px;
    //     font-size: 16px;
        align-self: center;
    //     color: #000;
    //     border: 0;
    //     border-radius: $uni-border-radius-sm;
    }
    
    .popup{
        
        &__close{
            position: absolute;
            right: 0;
            top: 0;
        }
        
        &__text{
            color: $uni-text-color;
            font-size: 16px;
            padding: $uni-spacing-col-base 0;
        }
        
        &__btn{
            width: 500rpx;
            margin-top: $uni-spacing-col-base * 2;
        }
    }
</style>
