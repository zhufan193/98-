<template>
	<view class="page" v-if="data">
        <view class="head">
            <view class="head__title">
                {{data.title}}
            </view>
            <view class="head__bottom" v-if="data.source != ''">
                <view class="head__info">
                    <text class="head__text">
                        {{data.source}}
                    </text>
                    <text class="head__text">
                        {{resDate}}
                    </text>
                </view>
                <view class="head__text" style="margin: 0;">
                    {{data.browser}}人查看
                </view>
            </view>
        </view>
        
        <!-- 暂时禁止评论<scroll-view class="article__scroll" scroll-y @scrolltolower="getComment" @scroll="setScrollTop" :scroll-top="scrollTop" scroll-with-animation="true" enable-back-to-top="true"> -->
            <view class="is_scroll article__content">
                <rich-text :class="[isBig ? 'article__bigrich' : 'article__rich']" :nodes="data.content"></rich-text>
                <view class="article__btn" :class="{'is_star': data.has_favorited}" @tap="_collection">
                    <image v-if="!data.has_favorited" class="article__star" src="../../../static/icon/star.png" mode="aspectFit"></image>
                    {{data.has_favorited ? '取消收藏' : '收藏'}}
                </view>
                <view class="article__helper">
                    <text>免责声明：</text>
                    <text>1.凡本网注明“来源：XXX（非运有方）”的作品，均转载自其他媒体，转载目的在于传递更多信息，并不代表本网赞同其观点和对其真实性负责。</text>
                    <text>2.如因作品内容、版权和其他问题需要同本网联系的，请在30日内进行。</text>
                </view>
            </view>
            
            <!-- <view v-if="comment.length" class="comment">
                <block v-for="(item, index) in comment" :key="index">
                    <wlp-comment :options="item" :index="index" @click="_clickComment"></wlp-comment>
                </block>
                <uni-load-more :status="loadingType"></uni-load-more>
            </view>
            <view v-else class="empty" @tap="_clickEmpty">
                {{commentText}}
            </view> -->
        <!-- </scroll-view> -->
        
        <!-- 暂时禁止评论 -->
        <view class="foot" style="display: none;">
            <view v-if="commentIndex != null" class="foot__reply" @tap="_clickInputClose">
                @{{comment[commentIndex].owner.nickname}} 
                <uni-icons type="closeempty" color="#fff" size="14"></uni-icons>
            </view>
            <view class="foot__center" @tap="_clickInput">
                <textarea class="input-text" type="text" maxlength="255" auto-height :focus="focus" :value="inputValue" :disabled="!hasLogin" @input="_onKeyInput" @focus="focus=true" @blur="focus=false" placeholder="写评论"></textarea>
            </view>
            <view v-if="focus" class="foot__right">
                <button class="foot__btn" type="primary" size="mini" @tap="_sendComment">发送</button>
            </view>
            <view v-else class="foot__right">
                <uni-icons type="chatbubble" color="#777" size="28" @tap="goComment"></uni-icons>
                <!-- #ifndef APP-PLUS -->
                <button :plain="true" class="btn_share" type="default" open-type="share">
                    <uni-icons type="paperplane" color="#777" size="28"></uni-icons>
        		</button>
        		<!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <uni-icons type="paperplane" color="#777" size="28" @tap="togglePopup(true)"></uni-icons>
                <!-- #endif -->
            </view>
        </view>
        <!-- #ifdef APP-PLUS -->
        <uni-popup :show="is_share" position="bottom" @hidePopup="togglePopup(false)">
        	<view style="display: block; width: 100%;">
        		<view class="bottom-title">分享到</view>
        		<view class="bottom-content">
        			<view class="bottom-content-box" @click="share(0)">
        				<view class="wx bottom-content-image">
                            <uni-icons type="weixin" color="#fff" size="20"></uni-icons>
        				</view>
        				<view class="bottom-content-text">微信</view>
        			</view>
        			<view class="bottom-content-box" @click="share(1)">
        				<view class="wx bottom-content-image">
                            <uni-icons type="pengyouquan" color="#fff" size="20"></uni-icons>
        				</view>
        				<view class="bottom-content-text">朋友圈</view>
        			</view>
        			<view class="bottom-content-box" @click="share(2)">
        				<view class="sina bottom-content-image">
                            <uni-icons type="weibo" color="#fff" size="20"></uni-icons>
        				</view>
        				<view class="bottom-content-text">新浪</view>
        			</view>
        			<view class="bottom-content-box" @click="share(3)">
        				<view class="qq bottom-content-image">
                            <uni-icons type="qq" color="#fff" size="20"></uni-icons>
        				</view>
        				<view class="bottom-content-text">QQ</view>
        			</view>
        		</view>
        		<view class="bottom-btn" @click="togglePopup(false)">取消分享</view>
        	</view>
        </uni-popup>
		<wlp-fab :title="isBig ? '小号字体' : '大号字体'" @click="_change()"></wlp-fab>
        <!-- #endif -->
	</view>
</template>

<script>
	import wlpComment from "./wlp-comment.vue"
	import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import uniIcons from '@/components/uni-icons/uni-icons.vue'

    import {toast, localStorage, dateUtils, format} from '@/common/util';
	import {getNewsDetail, getNewsComment, postNewsComment, postCollection, postUnCollection} from '@/service/getData';
    
    import { mapState, mapMutations } from 'vuex';
    
	const FAIL_CONTENT = '获取信息失败';
    
	export default {
        components:{
            wlpComment,
            uniLoadMore,
            uniPopup,
            uniIcons
        },
		data() {
			return {
                path: '', // 入口页
                navBarTitle: '',
                // scrollTop: 0,暂时禁止评论
                // oldScrollTop: 0,暂时禁止评论
                id: null,
				data: null,
                comment: [],
                commentText: '暂无评论',
                commentIndex: null, // 评论对方id
                page: 1,
                loadingType: 'more',
				focus: false,
                inputValue: '',
                is_share: false,
                providerList: [],
				isBig:false
			}
		},
        computed:{
            ...mapState(['hasLogin', 'userInfo']),
            resDate() {
                if(this.data)
                    return dateUtils.format(this.data.publish_at);
            }
        },
		onLoad(options) {
			if (options && options.title) {
				this.navBarTitle = options.title;
                uni.setNavigationBarTitle({
                    title: this.navBarTitle
                });
			}
			if (options && options.path) {
				this.path = options.path;
			}
            this.id = options.id;
			this.getDetail();
		},
		onBackPress() {
			if (this.is_share) {
				this.is_share = false;
				return true;
			}
		},
        onNavigationBarButtonTap() {
            this.is_share = !this.is_share;
        },
		onShareAppMessage() { // 小程序分享
			return {
				title: this.data.title,
				path: '/pages/news/detail/detail?type='+ this.navBarTitle + '&id=' + this.id,
				imageUrl: '/static/img/logo.png'
			}
		},
        onReachBottom() {
            this.getComment();
        },
		methods: {
            ...mapMutations(['GOPAGE_LOGIN', 'PAGE_TEMP_UPDATA']),
			getDetail() { // 获取详情
                toast.loading();
				getNewsDetail(this.id).then(res => {
                    // 统计
                    uni.report('title', '新闻:' + res.data.title);
					console.log(res);
                    // 匹配img scr添加地址前缀
                    const imgBaseURL = localStorage.getStore('fileBaseUrl');
                    // 正则表达式修改img样式
                    res.data.content = format.replace(res.data.content, imgBaseURL);
                    this.data = res.data;
                    this.getComment();
                }, err => {
                    this.data.title = FAIL_CONTENT;
                    toast.hideLoading();
                    setTimeout(function(){
                        uni.navigateBack();
                    }, 2000);
                });
			},
			getComment() { // 获取评论
                if(this.loadingType === 'noMore') return;
                toast.loading();
                this.loadingType = 'loading';
				getNewsComment(this.id, {page: this.page}).then(res => {
                    this.comment = res.data;
                    toast.hideLoading();
                    if(res.data.length < 15){
                        this.loadingType = 'noMore';
                    }else{
                        this.loadingType = 'more';
                        this.page++;
                    }
                }, err => {
                    this.commentText = FAIL_CONTENT;
                    toast.hideLoading();
                });
			},
            // 暂时禁止评论 setScrollTop(e){ // 更新滚动必须
            //     this.oldScrollTop = e.detail.scrollTop;
            // },
            // goComment() { // 滚动到评论
            //     uni.createSelectorQuery().select(".is_scroll").fields({
            //         size: true
            //     }, (data) => {
            //         this.scrollTop = this.oldScrollTop;
            //         this.$nextTick(function() {
            //             this.scrollTop = data.height;
            //         });
            //     }).exec();
            // },
            _onKeyInput(e){ // 输入框同步
                this.inputValue = e.detail.value;
            },
            _clickInput(){
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
            },
            _clickEmpty(){ // 发起评论
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                this.focus = true;
            },
            _clickComment(obj) { // 评论其他人
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                // 评论点击自己忽略
                if(this.comment[obj.index].owner.id === this.userInfo.id){
                    return;
                }
                this.commentIndex = obj.index;
                this.focus = true;
            },
            _clickInputClose(){ // 取消评论对方
                this.commentIndex = null;
            },
            _sendComment() { // 发送评论
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
            	if (this.inputValue.trim() == '') {
            		this.inputValue = '';
                    toast.show('评论不能为空！');
                    return;
            	}
                let send = {content: this.inputValue};
                if(this.commentIndex != null){
                    send.reply_id = this.comment[this.commentIndex].id;
                }
				postNewsComment(this.id, send).then(res => {
                    let obj = {
                        "id": null,
                        "owner":{
                            "id": this.userInfo.id,
                            "avatar": this.userInfo.avatar,
                            "nickname": "我",
                        },
                        "content": this.inputValue,
                        "created_at": dateUtils.formatStr(),
                        "reply": null
                    };
                    if(send.reply_id != null){
                        obj.reply = this.comment[this.commentIndex];
                    }
                    this.comment.push(obj);
                    this.inputValue = '';
                    this.commentIndex = null;
                });
            },
			_change:function(e){
				this.isBig=!this.isBig;
				
			},
            _collection() { // 收藏
                if(!this.hasLogin){
                    this.GOPAGE_LOGIN();
                    return;
                }
                if(this.data.has_favorited){
                    postUnCollection(this.id, {type: 'news'}).then(res => {
                        toast.success('取消收藏成功！')
                        this.data.has_favorited = false;
                        this.PAGE_TEMP_UPDATA(this.data);
                    });
                }else{
                    postCollection(this.id, {type: 'news'}).then(res => {
                        toast.success('收藏成功！')
                        this.data.has_favorited = true;
                        this.PAGE_TEMP_UPDATA(null);
                    });
                }
            },
            togglePopup(bool) { // 分享
                this.is_share = bool;
            },
            share(index) {
                uni.getProvider({
                    service: 'share',
                    success: (e) => {
                        let data = []
                        for (let i = 0; i < e.provider.length; i++) {
                            switch (e.provider[i]) {
                                case 'weixin':
                                    data.push({
                                        name: '分享到微信好友',
                                        id: 'weixin',
                                        sort:0
                                    })
                                    data.push({
                                        name: '分享到微信朋友圈',
                                        id: 'weixin',
                                        type:'WXSenceTimeline',
                                        sort:1
                                    })
                                    break;
                                case 'sinaweibo':
                                    data.push({
                                        name: '分享到新浪微博',
                                        id: 'sinaweibo',
                                        sort:2
                                    })
                                    break;
                                case 'qq':
                                    data.push({
                                        name: '分享到QQ',
                                        id: 'qq',
                                        sort:3
                                    })
                                    break;
                                default:
                                    break;
                            }
                        }
                        this.providerList = data.sort((x,y) => {
                            return x.sort - y.sort
                        });
                        this.sendShare(index);
                    },
                    fail: (e) => {
                        console.log('获取分享通道失败', e);
                        uni.showModal({
                            content:'获取分享通道失败',
                            showCancel:false
                        })
                    }
                });
            },
            sendShare(index) {
                let e = this.providerList[index];
				console.log('分享通道:'+ e.id);
                
                let shareOPtions = {
                	provider: e.id,
                	scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
                	type: 0, // 分享类型：图文
                    title: '运有方-船舶资讯',
                    summary: this.data.title,
                    href: 'https://cdd.oeyeu.com/',
                	success: (e) => {
                        // 统计
                        uni.report('share', {
                            'type': 'news',
                            'id': this.id
                        })
                		console.log(e);
                		uni.showModal({
                			content: '分享成功',
                			showCancel:false
                		})
                	},
                	fail: (e) => {
                        // 统计
                        uni.report('share_fail', {
                            'type': 'news',
                            'id': this.id
                        })
                		console.log(e)
                		uni.showModal({
                			content: e.errMsg,
                			showCancel:false
                		})
                	},
                	complete:function(){
                		console.log('分享操作结束!')
                	}
                }
                
                if(shareOPtions.provider !== 'qq'){
                    shareOPtions.type = 1;
					shareOPtions.imageUrl = 'http://www.xindemarinenews.com/uploads/allimg/190830/1-1ZS00Z159.png'; // this.data.cover;
                }
                console.log(shareOPtions)
                uni.share(shareOPtions);
            }
		}
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    
    page, .page{
        width: 100%;
        // 暂时禁止评论 height: 100%;
    }
    
    .page{
        @include flex(null, null, column);
        background-color: #fff;
    }
    
    .head{
        @include flex(between, null, column);
        @include flex-self(keep);
        min-height: 64px;
        padding: 16px $uni-spacing-row-lg;
        
        &__title{
            line-height: 1.6;
            padding-bottom: 16rpx;
            font-size: 48rpx;
            font-weight: bold;
        }
        
        &__bottom{
            @include flex(between, center);
        }
        
        &__info{
            @include flex-self(full);
        }
        
        &__text{
            color: #999;
            font-size: 28rpx;
            margin-right: 16rpx;
        }
    }
    
    .article{
    
        &__scroll{
            flex: auto;
            height: 100px;
        }
        
        &__content{
            margin: 0 $uni-spacing-row-lg;
            overflow: hidden;
        }
        
        &__btn{
            @include flex(center, center);
            width: 220px;
            height: 72px;
            box-sizing: border-box;
            margin: 0 auto;
            text-align: center;
            font-size: 30px;
            font-size: bold;
            color: #fff;
            background-color: $color-main;
            border-radius: 36px;
            transform: scale(.5);
        }
    
        &__btn.is_star{
            font-size: 30px;
            color: $uni-text-color-grey;
            background-color: #fff;
            border: 2px solid $uni-text-color-grey;
        }
        
        &__star{
            width: 32px;
            height: 32px;
            margin-right: 10px;
        }
        
        &__helper{
            position: relative;
            color: #999;
            font-size: 12px;
            line-height: 20px;
            padding: 16px 0;
            
            &::after{
                @include hr(top);
            }
        }
    }
    
    .empty{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #999;
        font-size: 16px;
        padding: 16px 0;
    }
    
    .foot{
        position: relative;
        flex: none;
		display: flex;
		flex-direction: row;
        align-items: flex-start;
		padding: 8px 0 8px 16px;
		background-color: $uni-bg-color-grey;
        
        &::after{
            @include hr(top);
        }
        
        
        &__right {
        	height: 36px;
        	display: flex;
        	justify-content: flex-end;
        	align-items: center;
        	color: #1482D1;
            padding: 0 4px;
            
            .uni-icons{
                padding: 0 4px;
            }
        }
        
        &__right &__btn{
            font-size: 14px;
            height: 36px;
            line-height: 36px;
            margin: 0 12px 0 4px;
        }
        
        &__center {
        	flex: 1;
        	display: flex;
            flex-direction: column;
            background: $uni-text-color-inverse;
            border-radius: $uni-border-radius-lg;
            overflow: hidden;
            padding: 8px;
            
            .input-text {
            	flex: 1;
            	// padding: 0 !important;
            	font-family: verdana !important;
                width: inherit;
                line-height: 18px;
                min-height: 18px;
                max-height:55px;
            }
        }
        
        &__reply{
            position: absolute;
            top: - 48upx;
            left: 10px;
            height: 32upx;
            line-height: 32upx;
            padding: 0 $uni-spacing-row-sm;
            margin-bottom: $uni-spacing-col-sm;
            font-size: 22upx;
            color: $uni-text-color-inverse;
            background-color: $uni-text-color-disable;
            border-radius: $uni-border-radius-base;
        }
        
        .btn_share[plain]{
            padding: 0;
            border: 0;
            line-height:inherit;
        }
    }
    
    .bottom-title {
		line-height: 60upx;
		font-size: 24upx;
		padding: 15upx 0;
	}

	.bottom-content {
		display: flex;
		flex-wrap: wrap;
		padding: 0 35upx;
	}

	.bottom-content-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15upx;
		width: 25%;
		box-sizing: border-box;
	}

	.bottom-content-image {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90upx;
		height: 90upx;
		overflow: hidden;
		background: #007aff;
		border-radius: 10upx;
	}

	.bottom-content-text {
		font-size: 26upx;
		color: #333;
		margin-top: 10upx;
	}

	.bottom-btn {
		height: 90upx;
		line-height: 90upx;
        position: relative;
        
        &::after{
            @include hr(top);
        }
	}

	.bottom-content-image.wx {
		background: #00ce47;
	}

	.bottom-content-image.qq {
		background: #00b6f6;
	}

	.bottom-content-image.sina {
		background: #ff766a;
	}
</style>
