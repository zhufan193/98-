<template>
	<view class="page">
		 <view class="card card--full" v-for="(tem,index) of data" :key="index">
             <view class="card__swiper">
                 <swiper class="swiper-box" autoplay="true" circular="true">
                 	<swiper-item class="swiper-item" v-for="(item ,index) in imglist" :key="index">
                 		<image :src="item.img" mode="aspectFill" />
                 	</swiper-item>
                 </swiper>
             </view>
            <view class="card__head" >
                <text class="card__title">{{tem.gsmc}}</text>
            </view>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">发布日期:</view>
                    <view class="form__note"></view>
                </view>
                <view class="form__cell">
                    <view class="form__label">供应区域:</view>
                    <view class="form__note">{{tem.gyqy}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">加油方式:</view>
                    <view class="form__note">{{tem.jyfs}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">油品种类:</view>
                    <view class="form__note">{{tem.yzzl}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">商家地址:</view>
                    <view class="form__note">{{tem.sjdz}}</view>
                </view>
				<view class="form__cell">
				    <view class="form__label">联系人:</view>
				    <view class="form__note">{{tem.lxr}}
				    	<text @click="add_person" style="color: #007AFF;font-size: 30upx;margin-left: 10upx;">
				    		添加好友
				    	</text>
				    </view>
				</view>
				<view class="form__cell">
				    <view class="form__label">联系方式:</view>
				    <view class="form__note" style="color: #007AFF;" @click="_makePhoneCall(tem.lxdh)">{{tem.lxdh}}</view>
				</view>
				<view class="form__cell">
				    <view class="form__label">备注信息:</view>
				    <view class="form__note">{{tem.bzxx}}</view>
				</view>
            </view>
		</view>
		
		<uni-popup :show="is_popupShow" position="middle" mode="fixed">
			<view class="popup-view">
				<view @click="is_popupShow = false" style="position: absolute;right: 20upx;">
					<image src="@/static/img/cancel.jpg" style="width: 35upx;height: 35upx;"></image>
				</view>
				<view  class="yugou" style="margin-top: 50upx;padding: 0upx 20upx;">
					<view class="yg-first" style="margin-top: 24upx;">
						<image src="@/static/img/goods.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view style="margin-left: 10upx;">
						<select-picker :option="array" v-on:greet="boat" class="select-picker-class" style="color: #747474;"></select-picker>
					</view>
				</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/img/model.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input placeholder="请填写油品型号/规格" />
					</view>
				</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/img/one-mongy.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input v-model="oneMongy" placeholder="油品单价 元/吨" />
					</view>
				</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/img/num.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input v-model="num" placeholder="请填写预购买数量(吨)" />
					</view>
				</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/img/all-mongy.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input placeholder="请填写预购油总金额" />
					</view>
				</view>
				<view class="yugou">
					<view class="yg-first">
						<image src="@/static/img/beizhu.png" style="width: 35upx;height: 35upx;"></image>
					</view>
					<view class="yg-second">
						<input placeholder="购买备注信息" />
					</view>
				</view>
				<view class="bug-button" @click="buyoil">
					确认预购
				</view>
				<view style="color: red;font-size: 24upx;">
					{{oilvalue}}
				</view>
			</view>
		</uni-popup>
		
		 <view class="get-goods" @click="is_popupShow =true">
			我要购油
		</view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import { router, toast } from '@/common/util.js';
    import { secondoilsdetail, secondbuyoil } from '@/service/getData.js';
    import selectPicker from '@/components/select-picker/select-picker.vue';
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniListItem,
			uniPopup,
			selectPicker
        },
		data() {
			return {
                router: '',
				id: null,
                data: [],
				imglist: [],
				is_popupShow: false, // 是否显示弹窗
				array: ['柴油','重油','轻循环油','润滑油','导热油','液压油'],
				boatindex:'',
				oneMongy: '',
				num: '',
				oilvalue: '',
			};
		},
        computed: mapState(['hasLogin']),
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                toast.loading();
                secondoilsdetail({data:{"type":"rygyinfo","rygyid":this.id}}).then(res => {
					var lantern = eval('('+res.data+')');
					if(lantern[0].stat == 1){
						this.data = lantern[0].meslist;
						console.log("获取燃油详情成功this.data："+ JSON.stringify(this.data));
						var arry = this.data;
						for( var i= 0; i<arry.length; i++){
							for(var k in arry[i]){
								if(k.indexOf("pic") != -1){
									this.imglist.push({"img":arry[i][k]});
								}
							}
						}	
					}
					toast.hideLoading()
                });
            }
        },
        onNavigationBarButtonTap() { // 标题栏按钮点击事件
            if(this.router === 'user'){
                this._del();
            }else{
                this._report();
            }
        },
        methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'PAGE_TEMP_UPDATA']),
            _makePhoneCall(phone) {
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
            },
            // _report() {
            //     router.navigateTo('/pages/common/report/report', {method: '油商黄页:' + this.id});
            // },

			add_person(){
				console.log("添加好友")
			},
			boat(index){
				this.boatindex=index;
			},
			buyoil(){
				if(this.oneMongy == ''){
					this.oilvalue = "请填写油品单价！"
					return;
				}
				if(this.num == ''){
					this.oilvalue = "请填写预购买数量(吨)！"
					return;
				}
				this.is_popupShow =false;
				let sent ={
					"type":"rygyjy","cbid":"1", "hyid":"1","uid":"1" ,"lxr":"张三" ,"lxdh":"13601588888" ,"dj":"20"
				};
				
				secondbuyoil({data:sent}).then(res => {
					console.log("23423423"+eval('('+res.data+')'))
					var lantern = eval('('+res.data+')');
					console.log("购油成功this.data："+ JSON.stringify(lantern[0].meslist));
					if(lantern[0].stat == 1){
						this.data = lantern[0].meslist;
						
						var arry = this.data;
						for( var i= 0; i<arry.length; i++){
							for(var k in arry[i]){
								if(k.indexOf("pic") != -1){
									this.imglist.push({"img":arry[i][k]});
								}
							}
						}	
					}
					toast.hideLoading()
				});
			}
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 0px;
    }
    
    .card__swiper{
        padding: $uni-spacing-col-base $uni-spacing-row-base 0;
    }
    
    .swiper-box {
    	width: 100%;
    	height: 350upx;
        border-radius: $uni-border-radius-base;
        overflow: hidden;
    }
    
    .swiper-item {
        @include flex(center, center);
    	height: 100%;
    	background: #eee;
        
        image {
        	width: 100%;
        	height: 100%;
        }
    }
    
    .boxTop__newDay{
        @include flex(between);
        position: relative;
        padding: $uni-spacing-col-lg 0;
        
        &::after{
            @include hr();
        }
        
        &Item{
            position: relative;
            width: 33.3%;
            text-align: center;
            
            &::after{
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 1px;
                background-color: $uni-border-color;
                transform: scaleX(.5);
            }
            
            &:last-child::after{
                display: none;
            }
        }
        
        &Rad{
            height: 40upx;
            line-height: 40upx;
            font-size: 56upx;
            font-weight: 700;
            color: $color-sub;
        }
        
        &Text{
            height: 30upx;
            line-height: 30upx;
            font-size: $uni-font-size-xs;
            color: $color-grey;
            padding-top: $uni-spacing-col-sm * 1.5;
        }
    }
	.get-goods{
		background-color: #1988ff;
		color: #ffffff;
		text-align: center;
		font-size: 30upx;
		padding: 20upx 0;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.popup-view{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		width: 240px;
		label{
			margin: 20upx 0;
			text-align: left;
		}
		.view-title{
			border: 10px;
			margin: 10upx 0;
		}
		.select-picker-class{
			text-align: left;
			background-color:#ffffff ;	
		}
		.yugou{
			padding: 20upx;
			margin-top: 20upx;
			display: flex;
			flex-direction: row;
			border: 1px solid #dadada;
			border-radius: 10upx;
			color: #1988ff;
			.yg-first{
				margin-top: 8upx;
			}
			.yg-second{
				margin-left: 30upx;
				
				input{
					font-size: 30upx;
				}
			}
		}
		.bug-button{
			background-color: #1988ff;
			color: #ffffff;
			text-align: center;
			border-radius: 15upx;
			border: 1upx;
			font-size: 30upx;
			padding: 20upx 0;
			margin-top: 30upx;
		}
	}
</style>
