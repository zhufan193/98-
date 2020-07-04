<template>
	<view class="page">
		<view v-if="review_state == 4 && data.created_at" class="info">
            <view class="info__txt">您于{{data.created_at}}提交实名认证申请。</view>
            <view class="info__txt">我们最迟将在三个工作日内为您审核！</view>
		</view>
		<view v-if="review_state == 2 || review_state == 3" class="info">
            <view class="info__txt">为了保障信息发布的有效性，营造一个诚信的交易平台。</view>
            <view class="info__txt">在本平台发布的任何信息都需要先进行个人实名认证！</view>
		</view>
		<form class="form" @submit="_formSubmit">
            <view class="card card--full" v-if="review_state == 3">
                <view class="card__head">
                    <view class="card__title card__info--error">
                        审核失败
                    </view>
                </view>
                <view class="card__content card__info--error">
                    失败原因：“{{data.review_reason}}”。
                </view>
            </view>
            <view class="card card--full">
                <view class="form__cell">
                    <view class="form__label">手机号</view>
                    <view class="form__note">{{userInfo.account}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">姓名</view>
                    <!-- <input class="formInput__field formInput__field--right" type="text" name="realname" :disabled="review_state != 2" v-model="data.realname" placeholder="请输入姓名" placeholder-style="color: #999;"/> -->
					<input class="formInput__field formInput__field--right" type="text" name="realname"  v-model="data.realname" placeholder="请输入姓名" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" style="position: relative;">
                    <view class="form__label">性别</view>
                    <radio-group  class="form__radio" name="sex">
                        <label class="radio" style="margin-right: 30upx;">
                            <radio color="#0091E6" style="transform:scale(0.7)" :value="1" :checked="data.sex === 1"/>男
                        </label>
                        <label class="radio">
                            <radio color="#0091E6" style="transform:scale(0.7)" :value="2" :checked="data.sex === 2"/>女
                        </label>
                    </radio-group>
       
                </view>
                <view class="form__cell">
                    <view class="form__label">身份证号</view>
                    <input class="formInput__field formInput__field--right" type="idcard" name="id_card"  v-model="data.id_card" placeholder="请输入身份证号" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" v-if="review_state === 1">
                    <view class="form__label">认证时间</view>
                    <view class="form__note">{{data.review_at}}</view>
                </view>
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        身份证照片
                    </view>
                </view>
                <view class="card__content idcard">
                    <view class="idcard__cell">
                        <view class="idcard__img">
                            <view class="idcard__close" v-if="idcard_img[0].path != '' && review_state == 2" @tap="_closeImage(0)"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                            <image class="idcard__picture" @tap="_chooseImage(0)" :class="{'idcard__picture--left': idcard_img[0].orientation != 'up'}" :src="idcard_img[0].path ? idcard_img[0].path : '/static/img/id_card_img.png'" mode="aspectFill"></image>
                        </view>
                        <view class="idcard__txt">人像面</view>
                    </view>
                    <view class="idcard__cell">
                        <view class="idcard__img">
                            <view class="idcard__close" v-if="idcard_img[1].path != '' && review_state == 2" @tap="_closeImage(1)"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                            <image class="idcard__picture" @tap="_chooseImage(1)" :class="{'idcard__picture--left': idcard_img[1].orientation != 'up'}" :src="idcard_img[1].path ? idcard_img[1].path : '/static/img/id_card_img_back.png'" mode="aspectFill"></image>
                        </view>
                        <view class="idcard__txt">国徽面</view>
                    </view>
                </view>
            </view>
            <view class="card card--full" >
                <view class="checked">
                    <label class="checked__field" style="width: auto;" @click="_checked">
                        <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                        我已阅读并同意
                    </label>
                    <view class="link" @click="_goPage('/pages/common/rich-text/rich-text?type=user_verify')">
                        《运有方个人认证规则》
                    </view>
                </view>
            </view>
            <view class="foot" v-if="review_state != 1">
                <button v-if="review_state == 4" class="foot__btn" type="warn" @tap="_verifyCencel">取消审核</button>
                <button v-if="review_state == 3" class="foot__btn" type="warn" @tap="clearData">重新认证</button>
                <button  class="foot__btn" type="primary" formType="submit">提交认证信息</button>
            </view>
		</form>
        
        <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" />
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast, check, dateUtils } from '@/common/util.js';
    import { uploadPic, postVerify, getVerify, postVerifyCancel } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            cpimg
        },
		data() {
			return {
                review_state: 2,
                is_chacked: true,
				data: {
                    id: null,
                    phone: '',
                    realname: '',
                    sex: 1,
                    id_card: '',
                    id_card_img: '',
                    id_card_img_back: '',
                    created_at: '',
                    review_at: '',
                    review_state: 0,
                    review_reason: ''
                },
                idcard_img: [{
                    path: '',
                    orientation: 'up'
                },{
                    path: '',
                    orientation: 'up'
                }]
			};
		},
        computed: mapState(['userInfo']),
        onLoad(options) {
            this.review_state = options.review_state;
            if(options.review_state != 2){
                toast.loading();
                getVerify().then(res => {
                    toast.hideLoading();
                    this.data = res.data;
                    if(this.data.review_state === 3){
                        this.review_state = 3;
                    }
                    this.idcard_img[0].path = res.data.id_card_img;
                    this.getImageInfo(0);
                    this.idcard_img[1].path = res.data.id_card_img_back;
                    this.getImageInfo(1);
                }, err => {
                    console.log(err);
                    toast.show(err.message);
                });
            }
        },
        methods:{
            ...mapMutations(['RECORD_USERINFO']),
            _chooseImage(index) {
                let that = this;
                if(this.idcard_img[index].path == ''){
                    this.$refs.cpimg._changImg(index);
                }else{
                    // 查看图片
                    uni.previewImage({
                        current: 0,
                        urls: [this.idcard_img[index].path]
                    });
                }
            },
            cpimgOk(file) {
                this.idcard_img[file.urlType].path = file.data[0];
                this.getImageInfo(file.urlType);
            },
            cpimgErr(e) {
                toast.show(e);
            },
            getImageInfo(index) {
                let that = this;
                uni.getImageInfo({
                    src: that.idcard_img[index].path,
                    success: function(info) {
                        if(info.width < info.height){
                            that.idcard_img[index].orientation = 'left';
                        }
                    }
                })
            },
            _closeImage(index) {
                this.idcard_img[index].path = '';
                this.idcard_img[index].orientation = 'up';
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            _goPage(url){
                router.navigateTo(url);
            },
            _formSubmit(e) {
                let send = e.detail.value;
                if(send.realname == ''){
                    toast.show('请输入姓名！');
                    return;
                }
                if(send.sex == ''){
                    toast.show('请选择性别！');
                    return;
                }
                if(!check.idcard(send.id_card)){
                    toast.show('请输入正确身份证号码！');
                    return;
                }
                if(this.idcard_img[0].path == ''){
                    toast.show('请选择身份证照片（人像面）！');
                    return;
                }
                send.id_card_img = '';
                if(this.idcard_img[1].path == ''){
                    toast.show('请选择身份证照片（国徽面）！');
                    return;
                }
                send.id_card_img_back = '';
                if(!this.is_chacked){
                    toast.show('请阅读并同意《运有方个人认证规则》！');
                    return;
                }
                toast.loading('图片上传中，请稍后...');
                uploadPic(this.idcard_img[0].path, {}).then(res => {
                    send.id_card_img = res.data.source; 
					console.log(send.id_card_img);
                    this.sendData(send);
                }, err => {
                    console.log(err)
                });
                uploadPic(this.idcard_img[1].path, {}).then(res => {
                    send.id_card_img_back = res.data.source;
                    this.sendData(send);
                }, err => {
                    console.log(err)
                });
            },
            sendData(e){
                if(e.id_card_img == '' || e.id_card_img_back == '') return;
                postVerify(e).then(res => {
                    this.RECORD_USERINFO({field: 'review_state', review_state: 4});
                    toast.hideLoading();
                    uni.showModal({
                        title: '提交认证',
                        content: res.message ? res.message : '提交成功，我们最迟将在三个工作日内为您审核！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    console.log(err)
                });
            },
            _verifyCencel() {
                postVerifyCancel(this.data.id).then(res => {
                    this.clearData();
                    this.RECORD_USERINFO({field: 'review_state', review_state: 2});
                }, err => {
                    console.log(err)
                });
            },
            clearData(){
                this.review_state = 2;
                this.data = {
                    id: null,
                    phone: '',
                    realname: '',
                    sex: -1,
                    id_card: '',
                    id_card_img: '',
                    id_card_img_back: '',
                    review_at: '',
                    review_state: 0
                }
                this.idcard_img = [{
                    path: '',
                    orientation: 'up'
                },{
                    path: '',
                    orientation: 'up'
                }]
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/foot.scss';
    
    .info{
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        background-color: #fff;
        text-align: center;
        
        &__txt{
            font-size: 24rpx;
            color: $uni-color-error;
        }
    }
    
    .form{
        align-items: inherit;
        box-sizing: border-box;
        padding: $uni-spacing-col-lg 0 44px;
    }
    
    .formInput{
        margin-bottom: 0;
    }
    
    .idcard{
        @include flex(between);
        
        &__cell{
            width: 320upx;
        }
        
        &__img{
            position: relative;
            width: 308upx;
            height: 228upx;
            border-radius: $uni-border-radius-sm;
            margin-bottom: $uni-spacing-col-sm;
            border: 1px dashed $uni-border-color;
        }
        
        &__picture{
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 308upx;
            height: 228upx;
            
            &--left{
                width: 228upx;
                height: 308upx;
                transform-origin: top left;
                transform: rotate(90deg) translateY(-308upx);
            }
        }
        
        &__close{
            position: absolute;
            top: $uni-spacing-col-sm;
            right: $uni-spacing-row-sm;
            z-index: 999;
        }
        
        &__txt{
            text-align: center;
            font-size: $uni-font-size-sm;
            color: $uni-text-color-grey;
        }
    }
    
    .link{
        color: $color-sub;
    }
</style>
