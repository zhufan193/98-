<template>
	<view class="page">
		<template v-if="userInfo.is_realname">
			<view class="card card--full form__list">
				<view class="form__cell">
					<view class="form__label">选择发布主体</view>
					<radio-group class="form__radio" @change="_radioChange">
						<label>
							<radio color="#0091E6" style="transform:scale(0.7)" value="1" :checked="true" />
							个人供应
						</label>
						<label>
							<radio color="#0091E6" style="transform:scale(0.7)" value="2" />
							企业供应
						</label>
					</radio-group>
				</view>
				<view class="form__cell" v-if="companyPost">
					<view class="form__label">选择企业</view>
					<picker mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
						<view :class="companyIndex != 0 ? 'form__field' : 'form__note'">{{ companyIndex != 0 ? companyArray[companyIndex].name : '点击选择' }}</view>
					</picker>
				</view>
				<view class="form__cell" v-if="companyPost">
					<view class="form__label">公司电话</view>
					<input class="formInput__field formInput__field--right" type="number" disabled="true" v-model="data.company_phone" placeholder="公司电话"  placeholder-style="color: #999;"/>
				</view>
				<view class="form__cell">
					<view class="form__label">联系人</view>
					<input class="formInput__field formInput__field--right" type="text" v-model="data.contact" placeholder="请输入联系人"  placeholder-style="color: #999;"/>
				</view>
				<view class="form__cell">
					<view class="form__label">联系电话</view>
					<input class="formInput__field formInput__field--right" type="number" v-model="data.phone" placeholder="请输入联系电话"  placeholder-style="color: #999;"/>
				</view>
			</view>

			<view class="card card--full">
				<view class="card__head">
					<view class="card__title">砂石照片（上传照片增加信任度）</view>
					<view class="card__helper">{{ imageList.length }}/3（至少上传1张）</view>
				</view>
				<view class="card__content feedback-uploader">
					<view class="uni-uploader">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image, index) in imageList" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" :src="image" mode="aspectFill" @tap="_previewImg(index)"></image>
										<view class="close-view" @click="_closeImg(index)"><uni-icons type="closeempty" size="12" color="#fff"></uni-icons></view>
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
				<view class="card__head"><view class="card__title">必填参数</view></view>
				<view class="form__cell">
					<view class="form__label">标题</view>
					<input class="formInput__field formInput__field--right" type="text" v-model="data.title" placeholder="请输入标题"  placeholder-style="color: #999;"/>
				</view>
				<view class="form__cell" @tap="_changeSandType()">
					<view class="form__label">分类规格</view>
					<view :class="data.type ? 'form__field' : 'form__note'">
					    {{data.type ? data.type_na : '点击选择'}}
					</view>
				</view>
				<view class="form__cell">
					<view class="form__label">价格（元/吨）</view>
					<input class="formInput__field--row" type="number" v-model="data.min_price" placeholder="输入最小值"  placeholder-style="color: #999;"/>
					~
					<input class="formInput__field--row" type="number" v-model="data.max_price" placeholder="输入最大值"  placeholder-style="color: #999;"/>
				</view>
				<view class="form__cell">
					<view class="form__label">物流方式</view>
					<picker mode="selector" :range="expressTypeArray" range-key="name" :value="expressIndex" @change="_changeExpress">
						<view :class="expressIndex != 0 ? 'form__field' : 'form__note'">{{ expressIndex != 0 ? expressTypeArray[expressIndex].name : '不限' }}</view>
					</picker>
				</view>
				<view class="form__cell" @tap="_showDrawer('origin')">
				    <view class="form__label">产地</view>
				    <view :class="data.origin_text ? 'form__field' : 'form__note'">
				        {{data.origin_text ? data.origin_text : '点击选择'}}
				    </view>
				</view>
				<view class="form__cell" @tap="_showDrawer('delivery')">
				    <view class="form__label">交货地</view>
				    <view :class="data.delivery_text ? 'form__field' : 'form__note'">
				        {{data.delivery_text ? data.delivery_text : '点击选择'}}
				    </view>
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
                    <textarea class="form__textarea" maxlength="500" auto-height v-model="data.detail" placeholder="输入需要特别说明的地方。（500个字以内）"  placeholder-style="color: #999;"/>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <view v-if="!is_mp" class="form__textarea" :style="{'color': data.detail ? '#000' : '#999'}">{{data.detail ? data.detail : '输入需要特别说明的地方。（500个字以内）'}}</view>
                    <textarea v-if="is_mp" class="form__textarea" maxlength="500" auto-height v-model="data.detail" placeholder="输入需要特别说明的地方。（500个字以内）"  placeholder-style="color: #999;line-height: 1.6;"/>
                    <!-- #endif -->
                </view>
			</view>

			<view class="card card--full form">
				<view class="checked">
					<label class="checked__field" style="width: auto;" @click="_checked">
						<checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)" />
						我已阅读并同意
					</label>
					<view class="form__link" @click="_goPage('/pages/common/rich-text/rich-text?type=terms_service')">《服务条款》</view>
				</view>
			</view>

			<view class="foot">
                <button class="foot__btn" type="primary" @click="sendBtn">提交发布信息</button>
            </view>
            <!-- #ifdef MP -->
            <cover-view v-if="is_mp" class="foot__btn foot__btn--cover" @click="sendBtn">提交发布信息</cover-view>
            <!-- #endif -->
            
			<uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
			    <view class="drawer">
			        <view class="drawer__scroll">
			            <wlp-global :height="height" @click="_globalChange"></wlp-global>
			        </view>
			    </view>
			</uni-drawer>
        
            <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNum" />
		</template>
		<template v-else>
			<view class="empty">
				<image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
				<text class="empty__text">您当前还未进行个人实名认证。</text>
				<text class="empty__text" style="padding-top: 0;">只有个人实名认证的会员才能发起。</text>
			</view>
			<view class="foot"><button class="foot__btn" type="primary" @click="_verify()">前往实名认证</button></view>
		</template>
		
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="sandTypeIndex"
        @onConfirm="_setSandType" @onCancel="_cancelSandType" :pickerValueArray="sandTypeList"></mpvue-picker>
	</view>
</template>

<script>
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";

import { router, toast, check } from '@/common/util.js';
import { uploadPic, postSandSell } from '@/service/getData.js';

import { mapState, mapActions} from 'vuex';

export default {
	components: {
		mpvuePicker,
		uniIcons,
        uniDrawer,
        wlpGlobal,
        cpimg
	},
	data() {
		return {
			height: 0,
			data: {
				id: null,
				verify_type: 1,
				type: null,
				type_na:'',
				contact: '',
				phone: '',
				title: '',
				images: '',
				min_price: '',
				max_price: '',
				express_id: 0,
				express_na: '',
				origin_ids: null,
				origin_text: '',
				delivery_ids: null,
				delivery_text: '',
				detail: '',
				company_id: ''
			},
			imageList: [],
			is_chacked: true,
			companyArray: [{ name: '请选择' }],
			expressTypeArray: [{ id: 0, name: '不限' }],
			sandTypeList: [],
			companyIndex: 0,
			expressIndex: 0,
			sandTypeIndex: [0, 0],
			drawerVisible: false,
            is_origin: false,
            is_delivery: false,
            cpimgNum: 1,
            is_mp: true
		};
	},
	computed: {
		...mapState(['userInfo', 'companyTempData', 'dictionaryTempData']),
		companyPost: function() {
			return this.data.verify_type == 2;
		}
	},
	async onLoad() {
		this.data.contact = this.userInfo.realname;
		this.data.phone = this.userInfo.phone;
		toast.loading();
            
		//获取我的公司
        if(!this.companyTempData.hasOwnProperty('my_company') || !this.companyTempData.my_company.length){
            await this.getReleaseCompany();
        }
		this.companyArray = this.companyArray.concat(this.companyTempData.my_company);

		await this.getExpress();
		this.expressTypeArray = this.expressTypeArray.concat(this.dictionaryTempData.express);

		await this.getSandType();
		this.sandTypeList = this.sandTypeList.concat(this.dictionaryTempData.sand_type);
        
        await this.getGlobal();

		toast.hideLoading();
        // global由height启动，需放数据加载后
		const systemInfo = uni.getSystemInfoSync();
		this.height = systemInfo.windowHeight;
	},
	onHide() {
		if (this.drawerVisible) {
			this._hideDrawer();
		}
	},
	onBackPress() {
	    // 退出前关闭选择器
	    if (this.$refs.mpvuePicker.showPicker) {
            // #ifdef MP
            this.is_mp = true;
            // #endif
	        this.$refs.mpvuePicker.pickerCancel();
	        return true;
	    }else if (this.drawerVisible) {
        	this._hideDrawer()
            return true
        }
	},
    onHide() {
        if (this.drawerVisible) {
            this._hideDrawer();
        }
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
	methods: {
		...mapActions(['getReleaseCompany', 'getExpress', 'getSandType', 'getGlobal']),
        _goPage(url) {
            router.navigateTo(url);
        },
		_radioChange(e) {
			this.data.verify_type = e.target.value;
		},
		_changeCompany(e) 
        {
			let index = e.target.value;
			this.companyIndex = index;
			if (index > 0) {
				this.data.company_id = this.companyArray[index].id;
				this.data.company_name = this.companyArray[index].name;
				this.data.company_phone = this.companyArray[index].business_call;
			}
		},
		_changeSandType() 
        {
            // #ifdef MP
            this.is_mp = false;
            // #endif
		    this.$refs.mpvuePicker.show();
		},
		_setSandType(e) 
        {
            // #ifdef MP
            this.is_mp = true;
            // #endif
		    this.data.type_na = e.label;
		    this.data.type = e.value[1];
		},
        _cancelSandType(){
            // #ifdef MP
            this.is_mp = true;
            // #endif
        },
		_changeExpress(e)
		{
			let index = e.target.value
			this.expressIndex = index
			this.data.express_id = this.expressTypeArray[index].id
		},
        _globalChange(e){
            if(this.is_origin){
                this.data.origin_ids = e.id.join(',');
                this.data.origin_text = e.name[e.name.length - 1];
            }else if(this.is_delivery){
                this.data.delivery_ids = e.id.join(',');
                this.data.delivery_text = e.name[e.name.length - 1];
            }
            this._hideDrawer();
        },
        _showDrawer(type) {
            // #ifdef MP
            this.is_mp = false;
            // #endif
            if(type === 'origin'){
                this.is_origin = true;
            }else if(type === 'delivery'){
                this.is_delivery = true;
            }
            this.drawerVisible = true;
        },
        _hideDrawer() {
            // #ifdef MP
            this.is_mp = true;
            // #endif
            this.drawerVisible = false;
            this.is_origin = false;
            this.is_delivery = false;
        },
		_previewImg(index) {
			//预览图片
			uni.previewImage({
				urls: this.imageList,
				current: this.imageList[index]
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
		_closeImg(e) {
			this.imageList.splice(e, 1);
		},
		sendBtn() {
			
			if (!this.companyPost) {
				this.data.company_id = '';
				this.data.company_name = '';
				this.data.company_phone = '';
			}

			let send = this.data;

			if (send.company_id == '' && this.companyPost) {
				toast.show('请选择企业！');
				return;
			}
			if (send.contact == '') {
				toast.show('请输入联系人');
				return;
			}
			if (send.phone == '') {
				toast.show('请输入联系电话');
				return;
			}
			
			if (send.title == '')
			{
				toast.show('请输入标题');
				return;
			}
			
			if (send.min_price == '' || send.max_price  == '')
			{
				toast.show('请输入价格');
				return;
			}
            
			if (parseFloat(send.min_price) >= parseFloat(send.max_price))
			{
				toast.show('价格输入错误');
				return;
			}
			
			if (send.type == 0)
			{
				toast.show('请选择分类');
				return;
			}
			
			if (send.origin_text == '')
			{
				toast.show('请选择产地');
				return;
			}
			
			if (send.delivery_text == '')
			{
				toast.show('请选择发货地');
				return;
			}
			

			if (!this.imageList.length) {
				toast.show('请选择船舶照片（至少1张）！');
				return;
			}
            
			if(!this.is_chacked){
			    toast.show('请阅读并同意《服务条款》！');
			    return;
			}

			toast.loading('图片上传中，请稍后...');
			let is_i = 0,
				carousel = [];
			for (let i = 0, len = this.imageList.length; i < len; i++) {
				uploadPic(this.imageList[i], {}).then(
					res => {
						carousel[i] = res.data.source;
						is_i++;
						if (is_i == len) {
							send.images = carousel.join(',');
							this.sendData(send);
						}
					},
					err => {
						console.log(err);
					}
				);
			}
		},
		sendData(e) {
			postSandSell(e).then(
				res => {
					toast.hideLoading();
					uni.showModal({
						title: '发布砂石骨料供应',
						content: res.message ? res.message : '发布成功！',
						showCancel: false,
						success: function() {
							uni.navigateBack();
						}
					});
				},
				err => {
                    uni.showModal({
                        title: '发布砂石骨料供应',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
					console.log(err);
				}
			);
		},
		_checked(e){
		    this.is_chacked = !this.is_chacked;
		},
		_verify() {
			let review_state = this.userInfo.review_state;
			router.redirectTo('/pages/user/verify/verify', { review_state: review_state });
		}
	}
};
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/drawer.scss';
    @import '@/style/page/empty.scss';

    .page {
        padding: 0 0 44px;
    }

    .form {
        align-items: inherit;
        box-sizing: border-box;
    }

    .formInput {
        margin-bottom: 0;
    }

    .uni-uploader__file {
        width: 210rpx;
        height: 210rpx;
        box-sizing: border-box;
        margin: 0 10rpx 10rpx 0;
        border: 1rpx dashed #ccc;

        &:nth-child(3n) {
            margin: 0 0 10rpx 0;
        }
    }

    .uni-uploader__img {
        width: 100%;
        height: 100%;
    }

    .close-view {
        text-align: center;
        line-height: 14px;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ff5053;
        color: #ffffff;
        position: absolute;
        top: -6px;
        right: -4px;
        font-size: 12px;
    }

    .formInput__field--row {
        @include flex-self(keep);
        width: 5em;
        padding: 0 $uni-spacing-row-base;
        font-size: 14px;
        text-align: right;
    }
</style>
