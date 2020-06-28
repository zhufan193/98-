<template>
	<view class="page">
        <template v-if="companyArray.length < 2">
            <view class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">您当前没有认证的船舶维修类企业，</text>
                <text class="empty__text" style="padding-top: 0;">只有拥有认证的船舶维修类企业才能发布。</text>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @click="_verify">前往认证企业</button>
            </view>
        </template>
        <template v-else>
            <view class="card card--full form__list">
                <view class="form__cell">
                    <view class="form__label">选择企业</view>
                    <picker mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
                        <view :class="companyIndex != 0 ? 'form__field' : 'form__note'">{{companyIndex != 0 ? data.company_name : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="data.company_phone" placeholder="请输入公司电话" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人</view>
                    <input class="formInput__field formInput__field--right" type="text" :disabled="is_edit" v-model="data.contact" placeholder="请输入联系人" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系电话</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="data.phone" placeholder="请输入联系电话" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" @tap="_showDrawer('helper')">
                    <view class="form__label">维修类型</view>
                    <view :class="data.type ? 'form__field' : 'form__note'">
                        {{data.type ? data.type : '点击选择'}}
                    </view>
                </view>
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        公司照片（上传照片增加信任度）
                    </view>
                    <view class="card__helper">
                        {{imageList.length}}/3（至少上传1张）
                    </view>
                </view>
                <view class="card__content feedback-uploader">
                    <view class="uni-uploader">
                        <view class="uni-uploader-body">
                            <view class="uni-uploader__files">
                                <block v-for="(image,index) in imageList" :key="index">
                                    <view class="uni-uploader__file" style="position: relative;">
                                        <image class="uni-uploader__img" :src="image" mode="aspectFill" @tap="_previewImg(index)"></image>
                                        <view class="close-view" @click="_closeImg(index)">
                                            <uni-icons type="closeempty" size="12" color="#fff"></uni-icons>
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
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        公司概述
                    </view>
                </view>
                <view class="card__content">
                    <!-- #ifndef MP -->
                    <textarea class="form__textarea" maxlength="50" v-model="data.summary" :disabled="is_edit" placeholder="一句话介绍公司的主要业务。（50个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="drawerVisible" class="form__textarea" :style="{'color': data.summary ? '#000' : '#999'}">{{data.summary ? data.summary : '一句话介绍公司的主要业务。（50个字以内）'}}</view>
                    <textarea v-if="!drawerVisible" class="form__textarea" maxlength="50" v-model="data.summary" :disabled="is_edit" placeholder="一句话介绍公司的主要业务。（50个字以内）"  placeholder-style="color: #999; line-height: 1.6;"/>
                    <!-- #endif -->
                </view>
            </view>
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        公司详细介绍
                    </view>
                </view>
                <view class="card__content">
                    <!-- #ifndef MP -->
                    <textarea class="form__textarea" maxlength="500" auto-height v-model="data.detail" :disabled="is_edit" placeholder="详细介绍公司的各项业务。请勿发布虚假内容！（500个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="drawerVisible" class="form__textarea" :style="{'color': data.detail ? '#000' : '#999'}">{{data.detail ? data.detail : '详细介绍公司的各项业务。请勿发布虚假内容！（500个字以内）'}}</view>
                    <textarea v-if="!drawerVisible" class="form__textarea" maxlength="500" auto-height v-model="data.detail" :disabled="is_edit" placeholder="详细介绍公司的各项业务。请勿发布虚假内容！（500个字以内）"  placeholder-style="color: #999; line-height: 1.6;"/>
                    <!-- #endif -->
                </view>
            </view>
            
            <view class="card card--full form">
                <view class="checked">
                    <label class="checked__field" style="width: auto;" @click="_checked">
                        <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                        我已阅读并同意
                    </label>
                    <view class="form__link" @click="_goPage('/pages/common/rich-text/rich-text?type=terms_service')">
                        《服务条款》
                    </view>
                </view>
            </view>
            
            <view class="foot">
                <button class="foot__btn" type="primary" @click="sendBtn">提交发布信息</button>
            </view>
            <!-- #ifdef MP -->
            <cover-view v-if="!drawerVisible" class="foot__btn foot__btn--cover" @click="sendBtn">提交发布信息</cover-view>
            <!-- #endif -->
            
            <uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
                <view class="drawer">
                    <scroll-view class="drawer__scroll" scroll-y :style="{height: height + 'px'}">
                        <block v-for="(item, index) of componentArray" :key="index">
                            <wlp-collapse :title="item.label" mode="multi-select" :type="index" :options="item.children" key-name="label" @change="_changeDrawer"></wlp-collapse>
                        </block>
                    </scroll-view>
                    <view class="drawer__bottom">
                        <view class="drawer__btn" @click="_sendDrawer">确定</view>
                        <view class="drawer__btn drawer__btn--right" @click="_clearDrawer">重置</view>
                    </view>
                </view>
            </uni-drawer>
        
            <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNum" />
        </template>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import wlpCollapse from '@/components/wlp-collapse/wlp-collapse.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast, check } from '@/common/util.js';
    import { getShipPartsDetail, uploadPic, postService, postVerifyCencel } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniDrawer,
            wlpCollapse,
            cpimg
        },
		data() {
			return {
                is_edit: false,
                is_chacked: true,
                drawerVisible: false,
                height: 0,
                companyArray: [{name:'请选择'}],
                companyIndex: 0,
                componentArray: [],
				data: {
                    release_type: 'maintain',
                    id: null,
                    verify_type: 2,
                    company_id: '',
                    company_name: '',
                    company_phone: '',
                    contact: '',
                    phone: '',
                    type_ids: '',
                    type: '',
                    summary: '',
                    detail: '',
                    carousel: ''
                },
                imageList: [],
                cpimgNum: 1
			};
		},
        computed: mapState(['userInfo', 'companyTempData', 'dictionaryTempData']),
        onLoad(options) {
            const systemInfo = uni.getSystemInfoSync();
            this.height = systemInfo.windowHeight - 44;
            toast.loading();
            if(options && options.id){
                this.data.id = options.id;
                this.is_edit = true;
                getShipPartsDetail(options.id).then(res => {
                    toast.hideLoading();
                    console.log(res)
                }, err => {
                    console.log(err)
                });
            }else{
                this._getSelect();
            }
            
        },
        onHide() {
            if (this.drawerVisible) {
                this._hideDrawer();
            }
        },
        methods:{
            ...mapActions(['getMaintainType', 'getCompanyMaintain']),
            _goPage(url) {
                router.navigateTo(url);
            },
            async _getSelect() {
                if(!this.companyTempData.hasOwnProperty('company_maintain') || !this.companyTempData.company_maintain.length){
                    await this.getCompanyMaintain();
                }
                this.companyArray = this.companyArray.concat(this.companyTempData.company_maintain);
                
                await this.getMaintainType();
                this.componentArray = this.componentArray.concat(this.dictionaryTempData.maintain_type);
                
                toast.hideLoading();
            },
			_changeCompany(e)
			{
				let index = e.target.value
				this.companyIndex = index
				if (index == 0){
                    this.data.company_id = '';
                    this.data.company_name = '';
                    this.data.company_phone = '';
                }else{
                    this.data.company_id = this.companyArray[index].id;
                    this.data.company_name = this.companyArray[index].name;
                    this.data.company_phone = this.companyArray[index].business_call;
				}
			},
            _showDrawer(type) {
                this.drawerVisible = true;
            },
            _hideDrawer() {
                this.drawerVisible = false;
            },
            _clearDrawer(){
                for(let i = 0, len = this.componentArray.length; i < len; i++){
                    for(let j = 0, childrenLen = this.componentArray[i].children.length; j < childrenLen; j++){
                        if(this.componentArray[i].children[j].checked){
                            this.$set(this.componentArray[i].children[j], 'checked', false);
                        }
                    }
                }
                this.data.type_ids = '';
                this.data.type = '';
            },
            _sendDrawer(){
                this.data.type_ids = '';
                this.data.type = '';
                for(let i = 0, len = this.componentArray.length; i < len; i++){
                    let type_ids = '', type = '';
                    type_ids = this.componentArray[i].children.filter(n => n.checked === true).map(item => {
                        return item.value;
                    }).join(',');
                    type = this.componentArray[i].children.filter(n => n.checked === true).map(item => {
                        return item.label;
                    }).join(',');
                    if(this.data.type_ids !== '' && type_ids !== ''){
                        type_ids = ',' + type_ids;
                        type = ',' + type;
                    }
                    this.data.type_ids += type_ids;
                    this.data.type += type;
                    console.log(this.data.type)
                }
                this._hideDrawer();
            },
            _changeDrawer(e){
                let obj = this.componentArray[e.type].children[e.value];
                if(obj.checked){
                    this.$set(obj, 'checked', false);
                }else{
                    this.$set(obj, 'checked', true);
                }
            },
            _previewImg(index) { //预览图片
                uni.previewImage({
                    urls: this.imageList,
					current:this.imageList[index]
                });
            },
            _chooseImg() { //选择图片
                this.cpimgNum = 3 - this.imageList.length;
                this.$refs.cpimg._changImg();
            },
            cpimgOk(file) {
                this.imageList = this.imageList.concat(file.data);
            },
            cpimgErr(e) {
                toast.show(e);
            },
            _closeImg(e){
                this.imageList.splice(e,1);
            },
			_checked(e){
			    this.is_chacked = !this.is_chacked;
			},
            sendBtn() {
                let send = this.data;
                if(send.company_id == ''){
                    toast.show('请选择企业！');
                    return;
                }
                if(!check.phone(send.company_phone) || !check.phone(send.phone)){
                    if(send.company_phone.length === 7 || send.phone.length === 7){
                        toast.show('座机号码请加上区号！');
                        return;
                    }
                    toast.show('请填写正确电话号码！');
                    return;
                }
                if(send.type == ''){
                    toast.show('请选择提供备件！');
                    return;
                }
                if(send.contact == '' || send.summary == '' || send.detail == ''){
                    toast.show('请完善所有信息！');
                    return;
                }
                if(!this.imageList.length){
                    toast.show('请选择公司照片（至少1张）！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《服务条款》！');
                    return;
                }
                toast.loading('图片上传中，请稍后...');
                let is_i = 0, carousel = [];
                for(let i = 0,len = this.imageList.length; i < len; i++){
                    uploadPic(this.imageList[i], {}).then(res => {
                        carousel[i] = res.data.source;
                        is_i++;
                        if(is_i == len){
                            send.carousel = carousel.join(',');
                            this.sendData(send);
                        }
                    }, err => {
                        console.log(err);
                    });
                }
            },
            sendData(e){
                postService(e).then(res => {
                    this.is_edit = true;
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布船舶维修',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布船舶维修',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            },
            _verify() {
                if(this.userInfo.is_realname){
                    router.redirectTo('/pages/company/verify/verify');
                }else{
                    let review_state = this.userInfo.review_state;
                    uni.showModal({
                        content: '请实名认证后再进行企业认证！',
                        success: function(e) {
                            if(e.confirm){
                                router.redirectTo('/pages/user/verify/verify', {review_state: review_state});
                            }
                        }
                    })
                }
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/drawer.scss';
    
    .page{
        padding: 0 0 44px;
    }
    
    .form{
        align-items: inherit;
        box-sizing: border-box;
    }
    
    .formInput{
        margin-bottom: 0;
    }
    
    .uni-uploader__file{
        width:210rpx;
        height:210rpx;
        box-sizing: border-box;
        margin: 0 10rpx 10rpx 0;
        border: 1rpx dashed #ccc;
        
        &:nth-child(3n){
            margin: 0 0 10rpx 0;
        }
    }
    
    .uni-uploader__img{
        width: 100%;
        height: 100%;
    }

    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
</style>
