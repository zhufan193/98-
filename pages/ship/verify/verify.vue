<template>
	<view class="page">
        <view class="card card--full" v-if="data.review_state == 3">
            <view class="card__content">
                <view class="card__info card__info--red">
                    审核失败：{{data.review_reason}}
                </view>
            </view>
        </view>
		<view class="card card--full">
            <view class="card__head">
                <text class="card__title">基础资料-必填</text>
            </view>
            <view class="form">
                <view class="form__cell">
                    <view class="form__label">中文船名</view>
                    <input class="formInput__field formInput__field--right" type="text" :disabled="is_edit" v-model="data.name_cn" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">英文船名</view>
                    <input class="formInput__field formInput__field--right" type="text" :disabled="is_edit" v-model="data.name_en" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船舶类型</view>
                    <view class="form__field" @tap="_clickShipType()">
                        {{data.type != '' ? data.type_na : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">封仓类型</view>
                    <picker mode="selector" :range="shipClosureArray" range-key="label" :value="shipClosureIndex" @change="_changeClosureType">
                        <view :class="shipClosureIndex != 0 ? 'form__field' : 'form__note'">{{shipClosureIndex != 0 ? shipClosureArray[shipClosureIndex].label : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell">
                    <view class="form__label">MMSI</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" maxlength="9" v-model="data.mmsi" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">IMO</view>
                    <input class="formInput__field formInput__field--right" type="text" :disabled="is_edit" maxlength="9" v-model="data.imo" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">载重/吨</view>
                    <input class="formInput__field formInput__field--right" type="digit" :disabled="is_edit" v-model="data.load_amount" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">所属公司</view>
                    <input class="formInput__field formInput__field--right" type="text" :disabled="is_edit" v-model="data.company" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
            </view>
		</view>
        <view class="card card--full">
            <view class="card__head">
                <view class="card__title">
                    上传授权委托书/船舶国籍证书
                </view>
		        <view class="card__helper" @tap="goPage('/pages/common/rich-text/rich-text?type=ship_sample')">
		            <view class="card__badge--btn">
		                查看范本
		            </view>
		        </view>
            </view>
            <view class="card__content idcard">
                <view class="idcard__cell">
                    <view v-if="entrust_pic != ''" class="idcard__img">
                        <view v-if="!is_edit" class="idcard__close" @tap="_closeImg('entrust_pic')"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                        <image class="idcard__picture" @tap="_previewImg('entrust_pic', 0)" :src="entrust_pic" mode="aspectFill"></image>
                    </view>
                    <view v-else class="idcard__img card__center" @tap="_chooseImg('entrust_pic')">
                        点击添加
                    </view>
                    <view class="idcard__txt">授权委托书</view>
                </view>
                <view class="idcard__cell">
                    <view v-if="examine_pic != ''" class="idcard__img">
                        <view v-if="!is_edit" class="idcard__close" @tap="_closeImg('examine_pic')"><uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons></view>
                        <image class="idcard__picture" @tap="_previewImg('examine_pic', 1)" :src="examine_pic" mode="aspectFill"></image>
                    </view>
                    <view v-else class="idcard__img card__center" @tap="_chooseImg('examine_pic')">
                        点击添加
                    </view>
                    <view class="idcard__txt">船舶国籍证书</view>
                </view>
            </view>
        </view>
		<view class="card card--full">
		    <view class="card__head">
		        <view class="card__title">
		            船舶照片
		        </view>
		        <view class="card__helper" style="color: #c0c0c0;">
		            {{imageList.length}}/3（至少上传1张）
		        </view>
		    </view>
		    <view class="card__content feedback-uploader">
		        <view class="uni-uploader">
		            <view class="uni-uploader-body">
		                <view class="uni-uploader__files">
		                    <block v-for="(image,index) in imageList" :key="index">
		                        <view class="uni-uploader__file" style="position: relative;">
		                            <image class="uni-uploader__img" :src="image" mode="aspectFill" @tap="_previewImg('', index)"></image>
		                            <view v-if="!is_edit" class="close-view" @click="_closeImg(index)">
		                                <uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons>
		                            </view>
		                        </view>
		                    </block>
		                    <view class="uni-uploader__file uni-uploader__input-box" v-if="!is_edit && imageList.length < 3">
		                        <view class="uni-uploader__input" @tap="_chooseImg"></view>
		                    </view>
		                </view>
		            </view>
		        </view>
		    </view>
            <view class="card__foot">
                <view class="form__cell">
                    <view class="form__label">授权过期时间</view>
                    <view v-if="is_edit" class="form__field">
                        {{data.expired_at}}
                    </view>
                    <picker v-else mode="date" @change="_changeTime">
                        <view :class="data.expired_at ? 'form__field' : 'form__note'">{{data.expired_at ? data.expired_at : '点击选择'}}</view>
                    </picker>
                </view>
            </view>
		</view>
        <view class="card card--full" v-if="!is_edit">
            <view class="checked">
                <label class="checked__field" style="width: auto;" @click="_checked">
                    <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                    我已阅读并同意
                </label>
                <view class="link" @click="goPage('/pages/common/rich-text/rich-text?type=ship_verify')">
                    《运有方船舶认证规则》
                </view>
            </view>
        </view>
        <view class="foot" v-if="id == null">
            <button class="foot__btn" type="primary" @tap="sendBtn">提交认证</button>
        </view>
        <view class="foot" v-else>
            <button v-if="data.review_state != 3" class="foot__btn" type="warn" @tap="_verifyCencel()">取消认证</button>
            <button v-if="data.review_state != 2" class="foot__btn" type="primary" @tap="_edit">{{is_edit ? '编辑' : '重新提交认证'}}</button>
        </view>
		
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="[0,0]"
        @onConfirm="_changeShipType" :pickerValueArray="shipTypeArray"></mpvue-picker>
        
        <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNum" />
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast } from '@/common/util.js';
    import { getVerifyShip, uploadPic, postVerifyShip, postVerifyShipCencel } from '@/service/getData.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            mpvuePicker,
            cpimg
        },
		data() {
			return {
                id: null,
                is_edit: false,
                is_chacked: true,
                data: {
                    auth_mode: 1,
                    name_cn: '',
                    name_en: '',
                    type: '',
                    type_na: '',
                    closure_type: '',
                    mmsi: '',
                    imo: '',
                    load_amount: '',
                    company: '',
                    expired_at: '',
                    entrust_pic: '',
                    examine_pic: '',
                    images: [],
                    review_state: null,
                    review_reason: ''
                },
                shipTypeArray: [],
                shipClosureArray: [{'label':'请选择'}],
                shipClosureIndex: 0,
				entrust_pic: '',
                is_entrust_pic: null,
				examine_pic: '',
                is_examine_pic: null,
				imageList: [],
                is_imageList: [],
                cpimgNum: 1
			};
		},
        computed: mapState(['dictionaryTempData']),
        onLoad(options) {
            toast.loading();
            if(options && options.id){
                this.id = options.id;
                getVerifyShip(this.id).then(res => {
                    this.is_edit = true;
                    this.data = res.data;
                    this.entrust_pic = this.data.entrust_pic_str[0];
                    this.is_entrust_pic = true;
                    this.examine_pic = this.data.examine_pic_str[0];
                    this.is_examine_pic = true;
                    this.imageList = this.data.images_str;
                    for(let i = 0, len = this.imageList.length; i < len; i++){
                        this.is_imageList.push(true);
                    }
                    this.data.images = this.data.images.split(',');
                    this.data.auth_mode = 1;
                    this.data.id = this.id;
                    toast.hideLoading();
                }, err => {
                    console.log(err)
                })
            }else{
                this._getDictionary();
            }
        },
        onUnload() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                this.$refs.mpvuePicker.pickerCancel()
            }
        },
		onBackPress() {
			if (this.$refs.mpvuePicker.showPicker) {
			    this.$refs.mpvuePicker.pickerCancel();
			    return true;
			}
		},
        methods:{
            ...mapActions(['getShipType', 'getClosureType']),
            ...mapMutations(['PAGE_TEMP_ADD']),
            _edit(){
                if(this.is_edit){
                    this.is_edit = false;
                    toast.loading();
                    this._getDictionary();
                }else{
                    this.sendBtn();
                }
            },
            async _getDictionary(){
                if(!this.shipTypeArray.length){
                    await this.getShipType();
                    this.shipTypeArray = this.dictionaryTempData.ship_type;
                }
                if(this.shipClosureArray.length === 1){
                    await this.getClosureType();
                    this.shipClosureArray = this.shipClosureArray.concat(this.dictionaryTempData.closure_type);
                }
                toast.hideLoading();
            },
            _previewImg(type, index) { //预览图片
                let images = this.imageList.concat([]);
                if(this.examine_pic != ''){
                    images.unshift(this.examine_pic);
                }
                if(this.entrust_pic != ''){
                    images.unshift(this.entrust_pic);
                }
                if(type == ''){
                    if(this.examine_pic != ''){
                        index ++;
                    }
                    if(this.entrust_pic != ''){
                        index ++;
                    }
                }
                uni.previewImage({
                    urls: images,
					current: images[index],
                    loop: true
                });
            },
            cpimgOk(file) {
                if(file.urlType === 'entrust_pic'){
                    this.entrust_pic = file.data[0];
                    this.is_entrust_pic = false;
                }else if(file.urlType === 'examine_pic'){
                    this.examine_pic = file.data[0];
                    this.is_examine_pic = false;
                }else{
                    this.imageList = this.imageList.concat(file.data);
                    for(let i = 0; i < file.data.length; i++){
                        this.is_imageList.push(false);
                    }
                }
            },
            cpimgErr(e) {
                toast.show(e);
            },
            _chooseImg(type) { //选择图片
                if(type === 'entrust_pic' || type === 'examine_pic'){
                    this.cpimgNum = 1;
                }else{
                    this.cpimgNum = 3 - this.imageList.length;
                }
                this.$refs.cpimg._changImg(type)
            },
            _closeImg(e){
                if(e === 'entrust_pic'){
                    this.entrust_pic = '';
                    this.is_entrust_pic = null;
                }else if(e === 'examine_pic'){
                    this.examine_pic = '';
                    this.is_examine_pic = null;
                }else{
                    this.data.images.splice(e,1);
                    this.imageList.splice(e,1);
                    this.is_imageList.splice(e,1);
                }
            },
            _clickShipType()
            {
                this.$refs.mpvuePicker.show();
            },
			_changeShipType(e)
			{
				this.data.type = e.value[1];
				this.data.type_na = e.label.split('-')[1];
			},
            _changeClosureType(e){
				let index = e.target.value;
                this.shipClosureIndex = index;
                this.data.closure_type = index == 0 ? '' : this.shipClosureArray[index].val;
            },
            _changeTime(e){
                this.data.expired_at = e.detail.value;
            },
            _checked(e){
                this.is_chacked = !this.is_chacked;
            },
            goPage(url){
                router.navigateTo(url);
            },
            sendBtn(){
                let send = this.data;
                if(send.name_cn == '' || send.name_en == '' || send.mmsi == '' || send.imo == '' || send.load_amount == '' || send.company == '' || send.company == ''){
                    toast.show('请补全基础资料！');
                    return;
                }
                if(send.type == ''){
                    toast.show('请选择船舶类型！');
                    return;
                }
				if (send.closure_type == '')
				{
					toast.show('请选择封仓类型');
					return;
				}
                if(send.mmsi.length !== 9){
                    toast.show('请填写正确MMSI！');
                    return;
                }
                if(this.entrust_pic == ''){
                    toast.show('请选择授权委托书！');
                    return;
                }
                if(this.examine_pic == ''){
                    toast.show('请选择船舶国籍证书！');
                    return;
                }
                if(!this.imageList.length){
                    toast.show('请选择船舶照片（至少1张）！');
                    return;
                }
                if(send.expired_at == ''){
                    toast.show('请选择授权过期时间！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《运有方船舶认证规则》！');
                    return;
                }
                let is_i = 0, is_num = 0;
                let images = [this.entrust_pic, this.examine_pic];
                    images = images.concat(this.imageList);
                let is_images = [this.is_entrust_pic, this.is_examine_pic];
                    is_images = is_images.concat(this.is_imageList);
                is_num = is_images.filter((value, index) => !value).length;
                if(is_num === 0){
                    this.sendData(send);
                    return;
                }
                for(let i = 0,len = is_images.length; i < len; i++){
                    if(is_images[i] === false){
                        uploadPic(images[i], {}).then(res => {
                            if(i==0){
                                send.entrust_pic = res.data.source;
                                this.is_entrust_pic = true;
                            }else if(i==1){
                                send.examine_pic = res.data.source;
                                this.is_examine_pic = true;
                            }else{
                                send.images[i-2] = res.data.source;
                                this.is_imageList[i-2] = true;
                            }
                            is_i++;
                            if(is_i == is_num){
                                this.sendData(send);
                            }
                        }, err => {
                            console.log(err);
                        });
                    }
                }
            },
            sendData(data) {
                toast.loading('提交中...');
                postVerifyShip(data).then(res => {
                    toast.hideLoading();
                    this.PAGE_TEMP_ADD({field: 'shipVerify', shipVerify: true});
                    uni.showModal({
                        title: '提交船舶认证',
                        content: res.message ? res.message : '提交成功，我们最迟将在三个工作日内为您审核！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '错误',
                        content: err.message,
                        showCancel: false
                    })
                });
            },
            _verifyCencel() {
                // 取消认证申请
                let that = this;
                uni.showModal({
                    content: '是否取消认证！',
                    success: function(e) {
                        if(e.confirm){
                            postVerifyShipCencel(that.id).then(res => {
                                that.PAGE_TEMP_ADD({field: 'shipVerify', shipVerify: true});
                                toast.show('取消成功');
                                uni.navigateBack();
                            });
                        }
                    }
                })
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
        padding: 0 0 44px;
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
        
        .card__center{
            @include flex(center, center);
        }
    }
    
    .card__foot{
        position: relative;
        
        &::before{
            @include hr(top, $uni-spacing-row-base);
        }
    }
    
    .checked{
        @include flex(null, center);
        padding: 0 $uni-spacing-row-base;
        
        &__field{
            @include flex(null, center);
            height: 88rpx;
        }
    }
    
    .uni-uploader__file{
        width:210rpx;
        height:210rpx;
        box-sizing: border-box;
        margin: 0 10rpx 10rpx 0;
        border: 1px dashed $uni-border-color;
        
        &:nth-child(3n){
            margin: 0 0 10rpx 0;
        }
    }
    
    .uni-uploader__img{
        width: 100%;
        height: 100%;
    }

    .close-view{
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 999;
    }
    
    .link{
        color: $color-sub;
    }
</style>
