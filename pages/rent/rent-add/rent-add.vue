<template>
	<view class="page">
        <template v-if="userInfo.is_realname">
            <view class="card card--full form__list">
                <view class="form__cell">
                    <view class="form__label">选择发布主体</view>
                    <radio-group class="form__radio" @change="_radioChange">
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="1" :checked="true" />个人出租
                        </label>
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="2"  />企业出租
                        </label>
                    </radio-group>
                </view>
                <view class="form__cell" v-if="companyPost">
                    <view class="form__label">选择企业</view>
                    <picker mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
                        <view :class="companyIndex != 0 ? 'form__field' : 'form__note'">{{companyIndex != 0 ? companyArray[companyIndex].name : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell" v-if="companyIndex != 0">
                    <view class="form__label">公司电话</view>
                    <view class="form__note">{{data.company_phone}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.contact" placeholder="请输入联系人" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系电话</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.phone" placeholder="请输入联系电话" placeholder-style="color: #999;"/>
                </view>
            </view>
            
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        船舶照片（上传照片增加信任度）
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
                                <view class="uni-uploader__file uni-uploader__input-box" v-if="imageList.length < 3">
                                    <view class="uni-uploader__input" @tap="_chooseImg"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            
            <view class="card card--full form__list">
                <view class="card__head">
                    <view class="card__title">
                        必填参数
                    </view>
                    <view class="card__helper" v-if="shipArray.length > 1">
                        <picker mode="selector" :range="shipArray" range-key="name_cn" :value="shipIndex" @change="_changeShip">
                            <view class="card__badge">选择已认证的船舶</view>
                        </picker>
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">船名</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.name" placeholder="请输入船中文名" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船舶类型</view>
                    <view class="form__note" @tap="_clickShipType()">
                        {{data.type != '' ? shipTypeName : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">有效载重（吨）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.load_min" placeholder="请输入有效载重" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">建造年份</view>
                    <picker mode="date" @change="_changeTime">
                        <view :class="data.build_at ? 'form__field' : 'form__note'">{{data.build_at ? data.build_at : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell">
                    <view class="form__label">月租金（元/月）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.price" placeholder="请输入月租金,不填默认显示面议" placeholder-style="color: #999;"/>
                </view>
            </view>
            
            <view class="card card--full form__list">
                <view class="card__head">
                    <view class="card__title">
                        其他参数
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">船长（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.ship_length" placeholder="请输入船长" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船宽（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.ship_width" placeholder="请输入船宽" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">吃水（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.draft" placeholder="请输入吃水" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">排水量（吨）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.displacement" placeholder="请输入排水量" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">建造地址</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.build_address" placeholder="请输入建造地址" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">驾驶位置</view>
                    <picker mode="selector" :range="drivePositionArray" range-key="name" :value="positionIndex" @change="_changePosition">
                        <view :class="positionIndex != 0 ? 'form__field' : 'form__note'">{{positionIndex != 0 ? drivePositionArray[positionIndex].name : '点击选择'}}</view>
                    </picker>
                </view>
          
                <view class="form__cell">
                    <view class="form__label">主机型号</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.host_model" placeholder="请输入主机型号" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">主机功率</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.host_power" placeholder="请输入主机功率" placeholder-style="color: #999;"/>
                </view>
            </view>
            
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        备注说明
                    </view>
                </view>
                <view class="card__content">
                    <!-- #ifndef MP -->
                    <textarea class="form__textarea" maxlength="500" auto-height v-model="data.remark" placeholder="输入需要特别说明的地方。（500个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="!is_mp" class="form__textarea" :style="{'color': data.remark ? '#000' : '#999'}">{{data.remark ? data.remark : '输入需要特别说明的地方。（500个字以内）'}}</view>
                    <textarea v-if="is_mp" class="form__textarea" maxlength="500" auto-height v-model="data.remark" placeholder="输入需要特别说明的地方。（500个字以内）"  placeholder-style="color: #999;line-height: 1.6;"/>
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
            <cover-view v-if="is_mp" class="foot__btn foot__btn--cover" @click="sendBtn">提交发布信息</cover-view>
            <!-- #endif -->
        
            <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNum" />
            
        </template>
        <template v-else>
            <view class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">您当前还未进行个人实名认证。</text>
                <text class="empty__text" style="padding-top: 0;">只有个人实名认证的会员才能发起。</text>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @click="_verify()">前往实名认证</button>
            </view>
        </template>
		
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="[0,0]"
        @onConfirm="_changeShipType" @onCancel="_cancelShipType" :pickerValueArray="shipTypeArray"></mpvue-picker>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast, check } from '@/common/util.js';
    import { uploadPic, postShipRent } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            mpvuePicker,
            cpimg
        },
		data() {
			return {
                is_chacked: true,
                drawerVisible: '',
                height: 0,
				companyArray: [{name:'请选择'}],
				companyIndex:0,
                shipArray: [{name_cn:'请选择'}],
                shipIndex: 0,
                shipTypeArray: [],
                shipTypeName: '',
				drivePositionArray:[{name:'请选择'}],
				positionIndex:0,
				data: {
                    id: null,
					post_type:'rent',
                    verify_type: 1,
                    company_id: '',
					company_name: '',
					company_phone: '',
                    contact: '',
                    phone: '',
					title:'',
					images:'',
					name:'',
					type:'',
					load_min:'',
					build_at:'',
					price:'',
					remark:'',
					ship_length:'',
					ship_width:'',
					draft:'',
					displacement:'',
					build_address:'',
					drive_position_id:'',
					host_model:'',
					host_power:'',
					
                },
                imageList: [],
                cpimgNum: 1,
                is_mp: true
			};
		},
        computed: {
			...mapState(['userInfo', 'companyTempData', 'shipTempData', 'dictionaryTempData']),
			companyPost: function()
			{
				return this.data.verify_type == 2;
			}
		},
        onLoad(options) {
            const systemInfo = uni.getSystemInfoSync();
            this.height = systemInfo.windowHeight - 44;
            this._getSelect();
			this.data.contact = this.userInfo.realname
			this.data.phone = this.userInfo.phone
        },
        onUnload() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                // #ifdef MP
                this.is_mp = true;
                // #endif
                this.$refs.mpvuePicker.pickerCancel()
            }
        },
		onBackPress() {
			if (this.$refs.mpvuePicker.showPicker) {
                // #ifdef MP
                this.is_mp = true;
                // #endif
			    this.$refs.mpvuePicker.pickerCancel();
			    return true;
			}
		},
        methods:{
            ...mapActions(['getShipType', 'getMyShipInfo','getReleaseCompany','getPosition']),
            _goPage(url) {
                router.navigateTo(url);
            },
            async _getSelect() {
                toast.loading();
				//获取我的公司
                if(!this.companyTempData.hasOwnProperty('my_company') || !this.companyTempData.my_company.length){
                    await this.getReleaseCompany();
                }
				this.companyArray = this.companyArray.concat(this.companyTempData.my_company);
                
                if(!this.shipTempData.hasOwnProperty('my_ship_info') || !this.shipTempData.my_ship_info.length){
                    await this.getMyShipInfo();
                }
                this.shipArray = this.shipArray.concat(this.shipTempData.my_ship_info);
               
                await this.getShipType();
                this.shipTypeArray = this.dictionaryTempData.ship_type;
				
				await this.getPosition();
				this.drivePositionArray = this.drivePositionArray.concat(this.dictionaryTempData.dict_drive_position);
				
                toast.hideLoading();
            },
			_radioChange(e) {
				this.data.verify_type = e.target.value
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
			_changeCompany(e)
			{
				let index = e.target.value
				this.companyIndex = index
				if (index == 0)
				{
					this.data.company_id = '';
                    this.data.company_name = '';
					this.data.company_phone = '';
				}else{
					this.data.company_id = this.companyArray[index].id;
                    this.data.company_name = this.companyArray[index].name;
					this.data.company_phone = this.companyArray[index].business_call;
                }
			},
			_changeShip(e)
			{
				let index = e.target.value
				this.shipIndex = index
				if (index == 0)
				{
					this.data.name = '';
					this.data.type = '';
                    this.shipTypeName = '';
                    this.data.ship_length = '';
                    this.data.load_min = '';
                    this.data.ship_width = '';
                    this.data.draft = '';
                    this.data.displacement = '';
				}else{
                    let item = this.shipArray[index];
                    this.data.name = item.name_cn;
                    this.data.type = item.type;
                    this.shipTypeName = '';
                    for(let i = 0, len = this.shipTypeArray.length; i < len; i++){
                        for(let j = 0, lenChildren = this.shipTypeArray[i].children.length; j < lenChildren; j++){
                            if(this.shipTypeArray[i].children[j].value == item.type){
                                this.shipTypeName = this.shipTypeArray[i].label + '-' + this.shipTypeArray[i].children[j].label;
                                break;
                            }
                        }
                    }
                    this.data.ship_length = item.length;
                    this.data.load_min = item.load_amount;
                    this.data.ship_width = item.width;
                    this.data.draft = item.draft;
                    this.data.displacement = item.displacement;
                }
			},
            _clickShipType()
            {
                // #ifdef MP
                this.is_mp = false;
                // #endif
                this.$refs.mpvuePicker.show();
            },
			_changeShipType(e)
			{
                // #ifdef MP
                this.is_mp = true;
                // #endif
				this.shipTypeName = e.label;
				this.data.type = e.value[1];
			},
            _cancelShipType(){
                // #ifdef MP
                this.is_mp = true;
                // #endif
            },
			_changePosition(e)
			{
				let index = e.target.value
				this.positionIndex = index
				this.data.drive_position_id = this.drivePositionArray[index].id
			},
			_changeTime(e)
			{
				this.data.build_at = e.target.value;
			},
			_checked(e){
			    this.is_chacked = !this.is_chacked;
			},
            sendBtn() {
				
				if (! this.companyPost)
				{
					this.data.company_id = ''
					this.data.company_name = ''
					this.data.company_phone = ''
				}
				
				let send = this.data;
				
                if(send.company_id == '' && this.companyPost){
                    toast.show('请选择企业！');
                    return;
                }
				if (send.contact == '')
				{
					toast.show('请输入联系人');
					return;
				}
				if (send.phone == '')
				{
					toast.show('请输入联系电话');
					return;
				}
				
				if (send.name == '')
				{
					toast.show('请输入船名');
					return;
				}
				
				if (send.type == '')
				{
					toast.show('请选择船舶类型');
					return;
				}
				 
                if(send.load_min == '' || send.build_at == ''){
                    toast.show('请完善必填参数！');
                    return;
                }
				
                if(!this.imageList.length){
                    toast.show('请选择船舶照片（至少1张）！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《服务条款》！');
                    return;
                }
                
                if(send.price === ''){
                    send.price = 0;
                }
				
                toast.loading('图片上传中，请稍后...');
                let is_i = 0, carousel = [];
                for(let i = 0,len = this.imageList.length; i < len; i++){
                    uploadPic(this.imageList[i], {}).then(res => {
                        carousel[i] = res.data.source;
                        is_i++;
                        if(is_i == len){
                            send.images = carousel.join(',');
                            this.sendData(send);
                        }
                    }, err => {
                        console.log(err);
                    });
                }
            },
            sendData(e){
                postShipRent(e).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布船舶出租',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布船舶出租',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            },
            _verify() {
                let review_state = this.userInfo.review_state;
                router.redirectTo('/pages/user/verify/verify', {review_state: review_state});
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/drawer.scss';
    @import '@/style/page/empty.scss';
    
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
