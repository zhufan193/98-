<template>
	<view class="page">
        <template v-if="userInfo.is_realname">
            <view class="card card--full form__list">
                <view class="form__cell">
                    <view class="form__label">选择发布主体</view>
                    <radio-group class="form__radio" @change="_radioChange">
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="1" :checked="true" />个人求租
                        </label>
                        <label>
                            <radio color="#0091E6" style="transform:scale(0.7)" value="2" />企业求租
                        </label>
                    </radio-group>
                </view>
                <view class="form__cell" v-if="companyPost">
                    <view class="form__label">选择企业</view>
                    <picker mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
                        <view :class="companyIndex != 0 ? 'form__field' : 'form__note'">{{companyIndex != 0 ? companyArray[companyIndex].name : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell" v-if="companyPost">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" disabled="true" v-model="data.company_phone" placeholder="公司电话" placeholder-style="color: #999;"/>
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
            
            <view class="card card--full form__list">
                <view class="card__head">
                    <view class="card__title">
                        必填参数
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">标题</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.title" placeholder="请输入标题" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船籍</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="data.ship_country" placeholder="请输入船籍" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船舶类型</view>
                    <view class="form__note" @tap="_clickShipType()">
                        {{data.type != '' ? shipTypeName : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">有效载重（吨）</view>
                    <input class="formInput__field--row" type="number" v-model="data.load_min" placeholder="输入最小值" placeholder-style="color: #999;"/>
                    ~
                    <input class="formInput__field--row" type="number" v-model="data.load_max" placeholder="输入最大值" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船龄（x年以内）</view>
                    <input class="formInput__field--row" type="number" v-model="data.age" placeholder="输入船龄" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">月租金（元/月）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="data.price" placeholder="请输入月租金,不填默认显示面议" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">有效时间</view>
                    <picker mode="date" @change="_changeTime">
                        <view :class="data.expire_at ? 'form__field' : 'form__note'">{{data.expire_at ? data.expire_at : '点击选择'}}</view>
                    </picker>
                </view>
            </view>
            
            <view class="card card--full form__list">
                <view class="card__head">
                    <view class="card__title">
                        其他参数
                    </view>
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
                        其他要求
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
    
    import { router, toast, check } from '@/common/util.js';
    import { postShipRent } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            mpvuePicker
        },
		data() {
			return {
                is_chacked: true,
                shipTypeArray: [],
                shipTypeName: '',
				companyArray: [{name:'请选择'}],
				companyIndex:0,
				drivePositionArray:[{name:'请选择'}],
				positionIndex:0,
				data: {
                    id: null,
                    post_type:'beRent',
                    verify_type: 1,
                    company_id: '',
                    company_name: '',
                    company_phone: '',
                    contact: '',
                    phone: '',
                    title:'',
					ship_country:'',
                    type:'',
                    load_min:'',
					load_max:'',
                    age:'',
                    price:'',
					expire_at:'',
                    remark:'',
                    draft:'',
                    displacement:'',
                    build_address:'',
                    drive_position_id:'',
                    host_model:'',
                    host_power:'',
                },
                is_mp: true
			};
		},
        computed: {
			...mapState(['userInfo' , 'companyTempData', 'dictionaryTempData']),
			companyPost: function()
			{
				return this.data.verify_type == 2;
			}
		},
        onLoad(options) {
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
            ...mapActions(['getShipType','getReleaseCompany','getPosition']),
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
                
                await this.getShipType();
                this.shipTypeArray = this.dictionaryTempData.ship_type;
				
				await this.getPosition();
				this.drivePositionArray = this.drivePositionArray.concat(this.dictionaryTempData.dict_drive_position);
				
                toast.hideLoading();
            },
			_changeCompany(e)
			{
				let index = e.target.value
				this.companyIndex = index
				if (index > 0)
				{
					this.data.company_id = this.companyArray[index].id
					this.data.company_phone = this.companyArray[index].business_call
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
				this.data.expire_at = e.target.value
			},
			_radioChange(e) {
				this.data.verify_type = e.target.value
			},
			_checked(e){
			    this.is_chacked = !this.is_chacked;
			},
            sendBtn() {
				let send = this.data;
                
				if (! this.companyPost)
				{
					this.data.company_id = ''
					this.data.company_name = ''
					this.data.company_phone = ''
				}
				
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
				
				if (send.title == '')
				{
					toast.show('请输入标题');
					return;
				}
                
                if (send.ship_country == '')
				{
					toast.show('请输入船籍');
					return;
				}
				
				if (send.type == '')
				{
					toast.show('请选择船舶类型');
					return;
				}
				if(send.title == '' || send.ship_country == '' || send.age == '' || 
				send.load_min == '' || send.load_max == '' || send.expire_at == ''){
				    toast.show('请完善必填参数！');
				    return;
				}
				
                if(parseInt(send.load_min) > parseInt(send.load_max)){
					toast.show('有效载重填写错误');
                    return;
                }
                
                if(!this.is_chacked){
                    toast.show('请阅读并同意《服务条款》！');
                    return;
                }
                
                if(send.price === ''){
                    send.price = 0;
                }
				this.sendData(send);
            },
            sendData(e){
                postShipRent(e).then(res => {
                    this.is_edit = true;
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布船舶求租',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布船舶求租',
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
    
    .formInput__field--row{
        @include flex-self(keep);
        width: 5em;
        padding: 0 $uni-spacing-row-base;
        font-size:14px;
        text-align: right;
    }
</style>
