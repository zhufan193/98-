<template>
	<view class="page">
        <template v-if="shipArray.length">
            <view class="card card--full form__list">
                <view class="form__cell">
                    <view class="form__label">选择船舶</view>
					<picker mode="selector" :range="shipArray" range-key="name" :value="shipIndex" @change="_changeShip">
						<view :class="shipIndex != 0 ? 'form__field' : 'form__note'">{{ shipIndex != 0 ? shipArray[shipIndex].name : '点击选择' }}</view>
					</picker>
                </view>
				<view class="form__cell">
					<view class="form__label">付款类型</view>
					<picker mode="selector" :range="payArray" range-key="name" :value="payIndex" @change="_changePay">
						<view :class="payIndex != 0 ? 'form__field' : 'form__note'">{{ payIndex != 0 ? payArray[payIndex].name : '点击选择' }}</view>
					</picker>
				</view>
                <view class="form__cell" @tap="_showDrawer('departure')">
                    <view class="form__label">加油港口</view>
                    <view :class="data.harbor_id ? 'form__field' : 'form__note'" >
                        {{data.harbor_id ? data.harbor_na : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">预计加油日期</view>
                    <picker mode="date" @change="_changeTime">
                        <view class="formInput__field--right" :class="data.refuel_at ? 'form__field' : 'form__note'">{{data.refuel_at ? data.refuel_at : '点击选择'}}</view>
                    </picker>
                    <view class="form__interval">
                        ±<input class="formInput__field--interval" type="number" maxlength="2" v-model="data.refuel_at_num" placeholder="输入" placeholder-style="color: #999;"/>天
                    </view>
                </view>
                <block v-for="(item, index) of data.oil_product" :key="index">
                    <view class="form__cell">
                    	<view class="form__label form__label--center">
                            油品{{index + 1}}
                            <button v-if="data.oil_product.length > 1" class="btn--oil" size="mini" type="warn" @click="_delOilProduct(index)">删除油品</button>
                        </view>
                    	<view :class="item.oil_type_id != null ? 'form__field' : 'form__note'" @tap="_clickOilType(index)">
                            {{ item.oil_type_id != null ? item.oil_type_na : '选择油品' }}
                        </view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label"></view>
                        <input class="formInput__field formInput__field--right" type="number" data-key="amount" :data-index="index" @input="_inputAmount" placeholder="输入加油数量(吨)" placeholder-style="color: #999;"/>
                    </view>
                    <view class="form__cell">
                        <view class="form__label"></view>
                        <input class="formInput__field formInput__field--right" type="number" data-key="price" :data-index="index" @input="_inputPrice" placeholder="输入可接受的每吨最高报价(元/吨)" placeholder-style="color: #999;"/>
                    </view>
                </block>
                <view class="form__cell">
                    <button class="btn--oil" size="mini" type="primary" @tap="_addOilProduct()">新增油品</button>
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
            <view class="card card--full form">
                <view class="checked">
                    <label class="checked__field" style="width: auto;" @click="_checked">
                        <checkbox color="#0091E6" :checked="is_chacked" style="transform:scale(0.7)"/>
                        我已阅读并同意
                    </label>
                    <view class="form__link" @click="_goPage('/pages/common/rich-text/rich-text?type=bid_rules')">《竞价加油规则》</view>
                </view>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @click="sendBtn">确认发布竞价</button>
            </view>
             
            <uni-drawer :visible="drawerVisible" mode="right" @close="_hideDrawer">
                <view class="drawer">
                    <view class="drawer__scroll">
                        <wlp-port :height="height" :defaultIndex="data.harbor_index" @click="_portChange"></wlp-port>
                    </view>
                </view>
            </uni-drawer>
        </template>
        <template v-else>
            <view class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">您当前没有认证的船舶，</text>
                <text class="empty__text" style="padding-top: 0;">只有拥有认证的船舶才能发布。</text>
            </view>
            <view class="foot">
                <button class="foot__btn" type="primary" @click="_verify">前往认证船舶</button>
            </view>
        </template>
		
        <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" :deepLength="2" :pickerValueDefault="[0,0]"
        @onConfirm="_changeOid" :pickerValueArray="oilTypeList"></mpvue-picker>
	</view>
</template>

<script>
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
    import wlpPort from '@/components/wlp-port/wlp-port.vue';
    
    import { router, toast, check } from '@/common/util.js';
    import { postOilBid } from '@/service/getData.js';
    
    import { mapState, mapActions } from 'vuex';
    
	export default {
        components: {
            mpvuePicker,
            uniIcons,
            uniDrawer,
            wlpPort
        },
		data() {
			return {
                height: 0,
				data: {
                    ship_id: null,
                    payment_id: null,
                    contact: '',
                    phone: '',
                    harbor_id: null,
                    harbor_na: '',
                    harbor_index: [],
                    refuel_at: '',
                    refuel_at_num: '',
                    oil_product: [{
                        oil_type_id: null,
                        oil_type_na: '',
                        amount: '',
                        price: ''
                    }]
                },
                drawerVisible: false,
                shipArray: [{name: '请选择'}],
                shipIndex: 0,
                payArray: [{name: '请选择'}, {id: 1, name: '现金支付'}, {id: 2, name: '垫付'}, {id: 3, name: '一个月期'}],
                payIndex: 0,
                oilTypeList: [],
                oilTypeIndex: 0,
                is_chacked: true
			};
		},
        computed: mapState(['userInfo','shipTempData', 'dictionaryTempData']),
        async onLoad() {
            toast.loading('加载中');
            if(!this.shipTempData.hasOwnProperty('my_ship') || !this.shipTempData.my_ship.length){
                await this.getReleaseShip();
            }
            this.shipArray = this.shipArray.concat(this.shipTempData.my_ship);

            await this.getOilType();
            this.oilTypeList = this.dictionaryTempData.oil_type;
            
            await this.getGlobal();
            toast.hideLoading();
            // global由height启动，需放数据加载后
            const systemInfo = uni.getSystemInfoSync();
            this.height = systemInfo.windowHeight;
        },
		onBackPress() {
			if (this.$refs.mpvuePicker.showPicker) {
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
                this.$refs.mpvuePicker.pickerCancel()
            }
        },
        methods:{
            ...mapActions(['getReleaseShip', 'getOilType', 'getGlobal']),
            _goPage(url) {
                router.navigateTo(url);
            },
            _changeShip(e){
                this.shipIndex = e.detail.value;
                if(this.shipIndex > 0){
                    this.data.ship_id = this.shipArray[this.shipIndex].id;
                }else{
                    this.data.ship_id = null;
                }
            },
            _changePay(e) {
                this.payIndex = e.detail.value;
                if(this.payIndex > 0){
                    this.data.payment_id = this.payArray[this.payIndex].id;
                }else{
                    this.data.payment_id = null;
                }
            },
            _changeTime(e){
                this.data.refuel_at = e.detail.value;
            },
            _portChange(e){
                if(e.type === 'port'){
                    this.data.harbor_id = e.port_id;
                    this.data.harbor_na = e.port_name;
                    this.data.harbor_index = e.index;
                    this._hideDrawer();
                }else{
                    toast.show('请选择港口！');
                }
            },
            _showDrawer(type) {
                this.drawerVisible = true;
            },
            _hideDrawer() {
                this.drawerVisible = false;
            },
            _addOilProduct() {
                this.data.oil_product.push({
                    oil_type_id: null,
                    oil_type_na: '',
                    amount: '',
                    price: ''
                })
            },
            _delOilProduct(index) {
                this.data.oil_product.splice(index, 1);
            },
            _clickOilType(index){
                this.oilTypeIndex = index;
                this.$refs.mpvuePicker.show();
            },
            _changeOid(e) {
                this.data.oil_product[this.oilTypeIndex].oil_type_na = e.label;
                this.data.oil_product[this.oilTypeIndex].oil_type_id = e.value[1];
            },
            _inputAmount(e) {
                let index = e.target.dataset.index;
                this.data.oil_product[index].amount = e.detail.value;
            },
            _inputPrice(e) {
                let index = e.target.dataset.index;
                this.data.oil_product[index].price = e.detail.value;
            },
			_checked(e){
			    this.is_chacked = !this.is_chacked;
			},
            sendBtn() {
                let send = this.data;
                if(send.ship_id == null){
                    toast.show('请选择船舶！');
                    return;
                }
                if(send.payment_id == null){
                    toast.show('请选择付款类型！');
                    return;
                }
                if(send.refuel_at == ''){
                    toast.show('请选择空船日期！');
                    return;
                }
                if(send.refuel_at_num == ''){
                    toast.show('请填写空船误差天数！');
                    return;
                }
                if(send.harbor_id == ''){
                    toast.show('请选择空船地区！');
                    return;
                }
                if(send.contact == ''){
                    toast.show('请输入联系人！');
                    return;
                }
                if(!check.phone(send.phone)){
                    if(send.phone.length === 7){
                        toast.show('座机号码请加上区号！');
                        return;
                    }
                    toast.show('请填写正确电话号码！');
                    return;
                }
                if(!this.is_chacked){
                    toast.show('请阅读并同意《竞价加油规则》！');
                    return;
                }
                toast.loading('发布中，请稍后...');
                postOilBid(send).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '发布竞价加油',
                        content: res.message ? res.message : '发布成功！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    uni.showModal({
                        title: '发布竞价加油',
                        content: '发布失败！' + err.message,
                        showCancel: false
                    });
                    console.log(err)
                });
            },
            _verify() {
                if(this.userInfo.is_realname){
                    router.redirectTo('/pages/ship/verify/verify');
                }else{
                    let review_state = this.userInfo.review_state;
                    uni.showModal({
                        content: '请实名认证后再进行船舶认证！',
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
    
    .form__interval{
        @include flex(null, center);
        @include flex-self(keep);
        padding-right: $uni-spacing-row-base;
    }
    
    .formInput__field--interval{
        width: 2em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
    }
    
    .btn--oil[type=primary]{
        margin-right: $uni-spacing-row-base;
    }
    
    .form__label--center{
        @include flex(null, center);
    }
    
    .btn--oil[type=warn]{
        margin-left: $uni-spacing-row-base;
    }
</style>
