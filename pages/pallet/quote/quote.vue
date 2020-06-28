<template>
	<view class="page">
		<view class="form">
		    <view class="form__cell" v-if="data">
		        <view class="form__label">货盘信息</view>
		        <view class="form__note">{{data.name}}/{{data.weigh}}T</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">装/卸港</view>
		        <view class="form__note">{{data.departure_na}}->{{data.target}}</view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">受载日期</view>
		        <view class="form__note">{{data.empty_date}}±{{data.empty_days}}</view>
		    </view>
        </view>
		<view class="form">
            <view class="form__cell">
                <view class="form__label"><text class="form__wran">*</text>承运方名称</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="company" placeholder="点击输入" placeholder-style="color: #999;"/>
				<picker class="form__icon" mode="selector" :range="companyArray" range-key="name" :value="companyIndex" @change="_changeCompany">
					<uni-icons type="plusempty" size="24" color="#999"></uni-icons>
				</picker>
            </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>选择我的船舶</view>
				<picker mode="selector" :range="shipArray" range-key="name" :value="shipIndex" @change="_changeShip">
					<view class="form__note">{{ shipIndex != 0 ? shipArray[shipIndex].name : '点击选择' }}</view>
				</picker>
		    </view>
            <view class="form__cell" @tap="_showDrawer()">
                <view class="form__label"><text class="form__wran">*</text>空船地</view>
                <view :class="departure_ids ? 'form__field' : 'form__note'" >
                    {{departure_ids ? departure_na : '点击选择'}}
                </view>
            </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>空船时间</view>
		        <picker mode="date" @change="_changeTime">
		            <view class="formInput__field--right" :class="empty_at ? 'form__field' : 'form__note'">{{empty_at ? empty_at : '点击选择'}}</view>
		        </picker>
		        <view class="form__interval">
		            ±<input class="formInput__field--interval" type="number" maxlength="2" v-model="interval" placeholder="输入" placeholder-style="color: #999;"/>天
		        </view>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>承运单价（元/吨）</view>
		        <input class="formInput__field formInput__field--right" type="number" v-model="price" placeholder="请输入承运单价" placeholder-style="color: #999;"/>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>是否含税</view>
				<radio-group class="form__radio" @change="_setTax">
					<label>
						<radio color="#0091E6" style="transform:scale(0.7)" value="1" />
						含税
					</label>
					<label>
						<radio color="#0091E6" style="transform:scale(0.7)" value="0" :checked="true" />
						不含税
					</label>
				</radio-group>
		    </view>
		    <view class="form__cell">
		        <view class="form__label"><text class="form__wran">*</text>定金</view>
		        <input class="formInput__field formInput__field--right" type="number" v-model="earnest_money" placeholder="请输入定金" placeholder-style="color: #999;"/>
		    </view>
		    <view class="form__cell">
		        <view class="form__label">备注</view>
		        <input class="formInput__field formInput__field--right" type="text" v-model="remark" placeholder="备注信息" placeholder-style="color: #999;"/>
		    </view>
		</view>
        <view class="foot">
            <view class="foot__cell foot__cell--main" @tap="_send()">
                提交报价
            </view>
        </view>
        
        <uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
            <view class="drawer">
                <view class="drawer__scroll">
                    <wlp-global :height="height" @click="_globalChange"></wlp-global>
                </view>
            </view>
        </uni-drawer>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import wlpGlobal from '@/components/wlp-global/wlp-global.vue';
    
    import { router, toast } from '@/common/util.js';
    import { postPalletOffer } from '@/service/getData.js';
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            uniIcons,
            uniDrawer,
            wlpGlobal
        },
		data() {
			return {
                height: 0,
                drawerVisible: false,
				data: null,
                shipArray: [{name:'请选择'}],
                shipIndex: 0,
                departure_ids: '',
                departure_na: '',
                empty_at: '',
                interval: '',
                price: '',
                tax: 0,
                earnest_money: '',
                remark: '',
                company: '',
				companyArray: [{'name':'请选择'}],
				companyIndex: 0,
			};
		},
        computed: {
            ...mapState(['companyTempData', 'shipTempData']),
        },
        async onLoad(options) {
            if(options && options.id){
                toast.loading();
                
                // 获取公司
                if(!this.companyTempData.hasOwnProperty('my_company') || !this.companyTempData.my_company.length){
                    await this.getReleaseCompany();
                }
                this.companyArray = this.companyArray.concat(this.companyTempData.my_company);
                
                this.data = options;
                this.shipArray = this.shipArray.concat(this.shipTempData.my_ship);
                
                await this.getGlobal();
                toast.hideLoading();
            }
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
			if (this.drawerVisible) {
				this._hideDrawer()
				return true
			}
		},
        methods: {
            ...mapActions(['getReleaseCompany', 'getPackingType', 'getGlobal']),
			_changeCompany(e){
				let index = e.target.value
				this.companyIndex = index
				if (index > 0)
				{
					this.company = this.companyArray[index].name;
				}
			},
            _changeShip(e){
                let index = e.target.value
                this.shipIndex = index;
            },
            _changeTime(e){
                this.empty_at = e.detail.value;
            },
            _setTax(e){
				this.tax = e.target.value;
            },
            _globalChange(e){
                this.departure_ids = e.id.join(',');
                this.departure_na = e.name[e.name.length - 1];
                this._hideDrawer();
            },
            _showDrawer(type) {
                this.drawerVisible = true;
            },
            _hideDrawer() {
                this.drawerVisible = false;
            },
            _send(){
                let send = {
                    'company': this.company,
                    'cm_id': this.data.id,
                    'ship_id': this.shipIndex == 0 ? '' : this.shipArray[this.shipIndex].id,
                    'empty_ids': this.departure_ids,
                    'empty_na': this.departure_na,
                    'empty_at': this.empty_at,
                    'interval': this.interval,
                    'price': this.price,
                    'is_tax': this.tax,
                    'earnest_money': this.earnest_money,
                    'remark': this.remark,
                };
				if (send.company == ''){
					toast.show('请输入公司');
					return;
				}
                if(send.ship_id == ''){
                    toast.show('请选择船舶！');
                    return;
                }
                if(send.empty_na == ''){
                    toast.show('请选择空船地区！');
                    return;
                }
                if(send.empty_at == ''){
                    toast.show('请选择空船日期！');
                    return;
                }
                if(send.interval == ''){
                    toast.show('请填写空船误差天数！');
                    return;
                }
                if(send.price == '' || send.price == 0){
                	toast.show('请输入承运单价');
                	return;
                }
                if(send.earnest_money == ''){
                	toast.show('请输入定金');
                	return;
                }
                toast.loading('提交中，请稍后...');
                postPalletOffer(send).then(res=>{
                    toast.hideLoading();
                    uni.showModal({
                        title: '提交报价',
                        content: res.message ? res.message : '提交成功！等待对方接受！',
                        showCancel: false,
                        success: function() {
                            router.navigateBack(2);
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '提交报价',
                        content: '提交失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding-bottom: 54px;
    }
    
    .form{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
    }
        
    .form__interval{
        @include flex(null, center);
        @include flex-self(keep);
        padding-right: $uni-spacing-row-base;
    }
    
    .formInput__field--interval{
        color: $uni-text-color-grey;
        width: 3em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
    }
    
    .formInput__field + uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
    }
    
    .formInput__field + picker.form__icon{
        @include flex-self(keep);
    }
    
    .formInput__field + picker.form__icon uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
    }
        
</style>
