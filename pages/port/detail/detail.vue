<template>
	<view class="page">
        <wlp-swiper-tab :fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <template v-if="data !== null">
            <view class="content">
                <view v-if="indexActive === 0" class="card">
                    <view class="card__banner lazy">
                        <image class="card__img lazy__img" :src="data.thumbnail" @load="loaded = true" mode="aspectFill"></image>
                        <image class="card__img lazy__img lazy__placeholder" :class="{lazy__loaded: loaded}" src="/static/img/loading800x500.jpg" mode="aspectFill"></image>
                    </view>
                    <view class="form">
                        <view class="form__cell">
                            <view class="form__label">
                                港口名
                            </view>
                            <view class="form__note">
                                {{data.name}}
                            </view>
                        </view>
                        <view class="form__cell" hover-class="form__cell--hover" @tap="_gotoMap()">
                            <view class="form__label">
                                经纬度
                            </view>
                            <view class="form__note">
                                {{resLocation}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                港口类别
                            </view>
                            <view class="form__note">
                                {{data.type}}
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="indexActive !== 2" class="card article">
                    <rich-text class="article__rich" :nodes="resText"></rich-text>
                </view>
                <block v-for="(item, index) in berth" :key="index">
                    <view v-if="indexActive === 2" class="card form">
                        <view class="form__cell">
                            <view class="form__label">
                                泊位名称
                            </view>
                            <view class="form__note">
                                {{item.dock_name}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                港区
                            </view>
                            <view class="form__note">
                                {{item.area}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                所属单位
                            </view>
                            <view class="form__note">
                                {{item.company}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                结构形式
                            </view>
                            <view class="form__note">
                                {{item.dock_type}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                长度/水深
                            </view>
                            <view class="form__note">
                                {{item.length + '/' + item.depth}}
                            </view>
                        </view>
                        <view class="form__cell">
                            <view class="form__label">
                                靠泊能力
                            </view>
                            <view class="form__note">
                                {{item.berthing}}
                            </view>
                        </view>
                    </view>
                </block>
            </view>
        </template>
        <template v-else>
            <view class="content__empty">
                {{message}}
            </view>
        </template>
	</view>
</template>

<script>
    import wlpSwiperTab from '@/components/wlp-swiper-tab/wlp-swiper-tab.vue';
    
    import { format, localStorage } from '@/common/util.js';
    import { getPortDetail } from '@/service/getData.js';
    
	export default {
        components:{
            wlpSwiperTab
        },
		data() {
			return {
                loaded: false,
                items: [
					'港口简介',
					'港口设备',
					'泊位情况表',
					'锚地及禁航区',
					'水文气象',
                    '港口服务',
                    '通信联络'
				],
                indexActive: 0,
				id: null,
                data: null,
                berth: [],
                message: ''
			};
		},
        computed: {
            resLocation() {
                if(!this.data) return '';
                let obj = format.location(this.data.longitude, this.data.latitude);
                return obj.longitude[0] + '°' + obj.longitude[1] + '′E：' + obj.latitude[0] + '°' + obj.latitude[1] + '′N';
            },
            resText() {
                if(!this.data) return '';
                if(this.indexActive === 0){
                    return this.data.detail;
                }else if(this.indexActive === 1){
                    return this.data.device_detail;
                }else if(this.indexActive === 3){
                    return this.data.no_nav;
                }else if(this.indexActive === 4){
                    return this.data.hydrometeorology;
                }else if(this.indexActive === 5){
                    return this.data.service;
                }else if(this.indexActive === 6){
                    return this.data.contact;
                }
            }
        },
        onLoad(options) {
			if (options && options.id) {
				this.id = options.id;
                getPortDetail(this.id).then(res => {
                    // 匹配img scr添加地址前缀
                    const imgBaseURL = localStorage.getStore('fileBaseUrl');
                    // 正则表达式修改img样式
                    res.data.detail = format.replace(res.data.detail, imgBaseURL);
                    res.data.contact = format.replace(res.data.contact, imgBaseURL);
                    res.data.device_detail = format.replace(res.data.device_detail, imgBaseURL);
                    res.data.hydrometeorology = format.replace(res.data.hydrometeorology, imgBaseURL);
                    res.data.no_nav = format.replace(res.data.no_nav, imgBaseURL);
                    res.data.service = format.replace(res.data.service, imgBaseURL);
                    this.data = res.data;
                    this.berth = res.data.berth.slice(0, 15);
                }, err => {
                    this.message = '不存在或已删除';
                });
			}else{
                this.message = '不存在或已删除';
            }
        },
        onReachBottom() {
            let long = this.data.berth.length;
            let i = this.berth.length;
            if(this.indexActive === 2 && i < long){
                for(let len = i + 15; i < len; i++){
                    if(i< long){
                        this.berth.push(this.data.berth[i]);
                    }else{
                        break;
                    }
                }
            }
        },
        methods: {
            _onClickItem(e) {
                if(this.data !== null){
                    this.indexActive = e;
                }
            },
            _gotoMap() {
                uni.openLocation({
                    latitude: this.data.latitude,
                    longitude: this.data.longitude,
                    name: this.data.name
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/lazy.scss';
    
    page, .page{
        min-height: 100%;
    }
    
    .page{
        display: flex;
        flex-direction: column;
        padding-top: 44px;
    }
    
    .tabbar{
        flex-shrink: 0;
    }
    
    .content{
        box-sizing: border-box;
        padding: $uni-spacing-col-base 0 0;
        flex: auto;
        
        &__empty{
            flex: auto;
            @include flex(center, center);
            font-size: 24px;
        }
    }
    
    .card{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
        overflow: hidden;
        
        &__banner{
            margin: $uni-spacing-col-base $uni-spacing-row-base 0;
            padding-bottom: 62.5%;
            border-radius: $uni-border-radius-base;
            overflow: hidden;
        }
        
        &__img{
            display: block;
            width: 100%;
            height: 468upx;
        }
        
        .uni-list::before, .uni-list::after{
            display: none;
        }
        
        .uni-list-item__content-title{
            font-size: $uni-font-size-base;
            color: $uni-text-color;
        }
        
        .uni-list-item__container::after{
            right: 30upx;
        }
        
        uni-list-item:last-child .uni-list-item__container::after{
            display: none;
        }
        
        .uni-list-item__content{
            @include flex(between, center, row);
        }
        
        .uni-list-item__extra{
            width: 60upx;
        }
    }
    
    .article{
        padding: $uni-spacing-col-base $uni-spacing-row-lg;
    }
</style>
