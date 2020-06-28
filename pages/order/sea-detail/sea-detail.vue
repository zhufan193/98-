<template>
	<view class="page" v-if="data">
        <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view v-show="indexActive === 0" class="content">
            <view class="card card--full from">
                <view class="form__cell">
                    <view class="form__label">合同单价</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="resStatus !== 0" @input="_inputContractPrice" :value="contractPrice" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">合同总价</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="resStatus !== 0" @input="_inputContractAmount" :value="contractAmount" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
            </view>
            <view class="card card--full" v-if="type === 'landlord'">
                <view class="card__head">
                    <view class="card__title">
                        上传/查看【承运方盖章合同】
                    </view>
                </view>
                <view class="card__content feedback-uploader">
                    <view class="uni-uploader">
                        <view class="uni-uploader-body">
                            <view class="uni-uploader__files">
                                <block v-for="(item,index) in imageLandlord" :key="index">
                                    <view class="uni-uploader__file" style="position: relative;">
                                        <image class="uni-uploader__img" :src="imageLandlord[index]" mode="aspectFill" @tap="_previewImg('landlord', imageLandlord[index])"></image>
                                        <view class="close-view" v-if="type === 'landlord' && resStatus === 0" @click="_closeImg('landlord', index)">
                                            <uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons>
                                        </view>
                                    </view>
                                </block>
                                <view v-if="data.landlordStatus === 0" class="uni-uploader__file" :class="{'uni-uploader__input-box': type === 'landlord'}">
                                    <view class="uni-uploader__input" @tap="_chooseImg('landlord', index)"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="card card--full" v-else>
                <view class="card__head">
                    <view class="card__title">
                        上传/查看【托运方盖章合同】
                    </view>
                </view>
                <view class="card__content feedback-uploader">
                    <view class="uni-uploader">
                        <view class="uni-uploader-body">
                            <view class="uni-uploader__files">
                                <block v-for="(item,index) in imageTenant" :key="index">
                                    <view class="uni-uploader__file" style="position: relative;">
                                        <image class="uni-uploader__img" :src="imageTenant[index]" mode="aspectFill" @tap="_previewImg('tenant', imageTenant[index])"></image>
                                        <view class="close-view" v-if="type === 'tenant' && resStatus === 0" @click="_closeImg('tenant', index)">
                                            <uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons>
                                        </view>
                                    </view>
                                </block>
                                <view v-if="data.tenantStatus === 0" class="uni-uploader__file" :class="{'uni-uploader__input-box': type === 'tenant'}">
                                    <view class="uni-uploader__input" @tap="_chooseImg('tenant')"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view v-show="indexActive === 1">
            <block v-for="(item, index) of data.pay_record" :key="index">
                <view class="form">
                    <view class="form__cell">
                        <view class="form__label">记录填写人</view>
                        <view class="form__note">{{item.op_name}}</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">记录填写时间</view>
                        <view class="form__note">{{item.pay_at}}</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">转账方</view>
                        <view class="form__note">{{item.transfer_account}}</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">收款方</view>
                        <view class="form__note">{{item.receive_account}}</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">付款金额</view>
                        <view class="form__note price">{{item.amount}}元</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">付款类型</view>
                        <view class="form__note">{{item.type}}</view>
                    </view>
                    <view class="form__cell">
                        <view class="form__label">付款截图</view>
                        <view class="form__note" @tap="_previewImg('transactionList', item.image)">
                            <image class="form__img" :src="item.image" mode="aspectFill"></image>
                        </view>
                    </view>
                </view>
            </block>
            <uni-load-more :status="loadingType"></uni-load-more>
            
            <wlp-fab v-if="resStatus === 0" title="添加付款记录" @click="_openTransaction()"></wlp-fab>
        </view> -->
        <view v-show="indexActive === 1">
            <view class="card card--full">
                <view class="card__head">
                    <view class="card__title">
                        {{type === 'landlord' ? '上传/查看' : '查看'}}【送达凭证】
                    </view>
                    <view class="card__helper" style="color: #c0c0c0;">
                        {{imageVoucher.length}}
                    </view>
                </view>
                <view class="card__content feedback-uploader">
                    <view class="card__empty" v-if="type === 'tenant' && !imageVoucher.length">
                        对方还未上传送达凭证
                    </view>
                    <view class="uni-uploader">
                        <view class="uni-uploader-body">
                            <view class="uni-uploader__files">
                                <block v-for="(image,index) in imageVoucher" :key="index">
                                    <view class="uni-uploader__file" style="position: relative;">
                                        <image class="uni-uploader__img" :src="image" mode="aspectFill" @tap="_previewImg('voucher', image)"></image>
                                        <view v-if="type === 'landlord' && data.landlordStatus === 0" class="close-view" @click="_closeImg('voucher', index)">
                                            <uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons>
                                        </view>
                                    </view>
                                </block>
                                <view class="uni-uploader__file uni-uploader__input-box" v-if="type === 'landlord' && data.landlordStatus === 0">
                                    <view class="uni-uploader__input" @tap="_chooseImg('voucher')"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-show="indexActive === 2" class="form">
            <view class="form__cell" v-if="resStatus === 0">
                <view class="form__tips">
                    <text>订单概述中的信息不能作为最终准确的信息，</text>
                    <text>一切以双方盖章合同内容为准！</text>
                </view>
            </view>
            <view class="form__cell">
                <view class="form__label">订单编号</view>
                <view class="form__note">{{data.order}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">承运人</view>
                <view class="form__note">{{data.land_lord}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">托运人</view>
                <view class="form__note">{{data.tenant_name}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">货物名称</view>
                <view class="form__note">{{data.cargo.cargo_type}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">货物重量（吨）</view>
                <view class="form__note">{{data.cargo.weight}}吨</view>
            </view>
            <!-- <view class="form__cell">
                <view class="form__label">单价（元/吨）</view>
                <view class="form__note price">{{data.cargo.price}}元/吨</view>
            </view> -->
            <view class="form__cell">
                <view class="form__label">是否含税</view>
                <view class="form__note">{{data.cargo.tax}}</view>
            </view>
            <view class="form__cell">
                <view class="form__label">付款方式</view>
                <view class="form__note">{{data.cargo.pay_method}}</view>
            </view>
            <!-- <view class="form__cell">
                <view class="form__label">总价</view>
                <view class="form__note">{{data.cargo.amount}}</view>
            </view> -->
            <view class="form__cell">
                <view class="form__label">定金</view>
                <view class="form__note">{{data.cargo.deposit}}</view>
            </view>
        </view>
        
        <!-- <view class="fixed__tips" v-if="resTips">对方已{{resOther === 1 ? '确认完成' : '取消'}}订单！</view>
        <view class="foot" v-if="resStatus !== 0 && resOther === 0 && indexActive === 2">
            <view class="foot__cell form__tips">您已{{resStatus === 1 ? '确认完成' : '取消'}}订单，等待对方操作。对方{{resStatus === 2 ? '确认完成' : '取消'}}订单将重新选择。</view>
        </view> -->
        <view class="foot" v-show="indexActive === 0 && is_imageList">
            <view class="foot__cell foot__cell--main" @tap="_sendImg()">提交</view>
        </view>
        <view class="foot" v-show="indexActive === 1 && is_imageVoucher">
            <view class="foot__cell foot__cell--main" @tap="_sendVoucherImg()">提交</view>
        </view>
        <view class="foot" v-show="indexActive === 2">
            <!-- <view class="foot__cell foot__cell--main" @tap="_send(2)">取消订单</view> -->
            <view class="foot__cell foot__cell--error" v-if="resStatus === 0" @tap="_send(1)">提交审核</view>
            <view class="foot__cell foot__cell--disable" v-else>{{resStatus === 1 && resOther === 1 ? '已完成' : '审核中'}}</view>
        </view>
        <!-- <uni-popup :show="is_transaction" position="bottom" @hide-popup="_hideTransaction">
            <view class="form" style="width: 100%;margin-bottom: 0;">
                <view class="form__cell">
                    <view class="form__label">转账方</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="send.transfer_account" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">收款方</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="send.receive_account" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">付款金额（元）</view>
                    <input class="formInput__field formInput__field--right" type="number" v-model="send.amount" placeholder="点击输入" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">付款类型</view>
                    <input class="formInput__field formInput__field--right" type="text" v-model="send.type" placeholder="如订金，尾款，滞期费等" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">付款截图</view>
                    <view class="form__note">
                        <view class="uni-uploader__file" style="position: relative;" v-if="imageTransaction">
		                    <image class="uni-uploader__img" :src="imageTransaction" mode="aspectFill" @tap="_previewImg('transaction')"></image>
		                    <view class="close-view" @click="_closeImg('transaction')">
		                        <uni-icons type="clear" color="#FF4C4C" size="24"></uni-icons>
		                    </view>
		                </view>
		                <view class="uni-uploader__file uni-uploader__input-box" v-else>
		                    <view class="uni-uploader__input" @tap="_chooseImg('transaction')"></view>
		                </view>
                    </view>
                </view>
                <view class="foot__cell foot__cell--main" @click="_sendTransaction()">
                    提交付款记录
                </view>
            </view>
        </uni-popup> -->
        <cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNum" />
    </view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import wlpFab from '@/components/wlp-fab/wlp-fab.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import cpimg from "@/components/cpimg/cpimg.vue";
    
    import { router, toast } from '@/common/util.js';
    import { uploadPic, getOrderSeaDetail, postOrderSeaContract, getOrderSeaTransaction, postOrderSeaTransaction, postOrderSeaVoucher, postOrderSeaAudit } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniSegmentedControl,
            uniIcons,
            wlpFab,
            uniLoadMore,
            uniPopup,
            cpimg
        },
		data() {
			return {
				items: ['电子合同', '送达凭证', '订单概述'],//, '付款记录'
                indexActive: 0,
                id: null,
                data: null,
                type: 'tenant',
                contractPrice: '',
                contractAmount: '',
                imageLandlord: [],
                imageTenant: [],
				imageList: [],
                is_imageList: false,
				imageVoucher: [],
                is_imageVoucher: false,
                cpimgNum: 1,
                is_transaction: false,
                imageTransaction: '',
                send: {
                    ocean_order_id: null,
                    image: '',
                    type: '',
                    amount: '',
                    transfer_account: '',
                    receive_account: ''
                },
                loadingType: 'noMore'
			};
		},
        computed: {
            ...mapState(['userInfo']),
            resStatus(){ // 当前状态
                if(this.data) return this.type === 'tenant' ? this.data.tenantStatus : this.data.landlordStatus;
            },
            resOther(){ // 对方状态
                if(this.data) return this.type === 'tenant' ? this.data.landlordStatus : this.data.tenantStatus;
            },
            resTips(){
                if(this.data) return this.data.landlordStatus !== this.data.tenantStatus && this.resOther !== 0;
            }
        },
        onLoad(options) {
            if(options && options.id) {
                this.id = options.id;
                this.getData();
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _onClickItem(index) {
                this.indexActive = index;
            },
            goPage(id){
                router.navigateTo('/pages/order/sea-contract/sea-contract', {order_id: this.id, id: id});
            },
            getData(){
                toast.loading();
                getOrderSeaDetail(this.id).then(res => {
                    toast.hideLoading();
                    this.data = res.data;
                    this.imageLandlord = this.data.contract.landlord_image.map(item => item);
                    this.imageTenant = this.data.contract.tenant_image.map(item => item);
                    this.imageVoucher = this.data.voucher.map(item => item);
                    // 判断订单归属
                    if(this.userInfo.id == this.data.landlord_id){
                        this.type = 'landlord';
                    }
                    this.contractPrice = this.type === 'landlord' ? this.data.contract.landlord_price : this.data.contract.tenant_price;
                    this.contractAmount = this.type === 'landlord' ? this.data.contract.landlord_amount : this.data.contract.tenant_amount;
                });
            },
            _send(status){
                uni.showModal({
                    title: '提交审核',
                    content: `确认该交易已顺利完结。双方提交审核通过后，该订单将移动至已完成订单列表。`,
                    confirmText: '提交',
                    // title: status === 1 ? '提交审核' : '取消订单',
                    // content: status === 1 ? `确认该交易已顺利完结。双方确认完成订单后，该订单将移动至已完成订单列表。` : `由于误操作或经双方协商同意取消订单，经双方都确认取消订单后，该订单将移动至已取消订单列表。`,
                    // confirmText: status === 1 ? '提交审核' : '确认取消',
                    success: (res) => {
                        if (res.confirm) {
                            postOrderSeaAudit({'ocean_order_id': this.id}).then(res => {
                                toast.show('提交成功');
                                this.PAGE_TEMP_ADD({field: 'palletToBeConfiremed', palletToBeConfiremed: true});
                                setTimeout(() => {
                                    this.getData();
                                }, 1500);
                            }, err => {
                                toast.show(err.message);
                            });
                            // postOrderSeaClosure({'o_id': this.id,
                            //     'status': status
                            // }).then(res => {
                            //     if(status==1){
                            //         toast.show('提交成功');
                            //         if(this.type === 'landlord' && this.data.tenantStatus === 1 || this.type === 'tenant' && this.data.landlordStatus === 1){
                            //             this.PAGE_TEMP_ADD({field: 'palletToBeConfiremed', palletToBeConfiremed: true});
                            //             setTimeout(function(){
                            //                 uni.navigateBack();
                            //             }, 1500);
                            //         }else{
                            //             this.getData();
                            //         }
                            //     }else{
                            //         toast.show('取消成功');
                            //         if(this.type === 'landlord' && this.data.tenantStatus === 2 || this.type === 'tenant' && this.data.landlordStatus === 2){
                            //             this.PAGE_TEMP_ADD({field: 'palletToBeConfiremed', palletToBeConfiremed: true});
                            //             setTimeout(function(){
                            //                 uni.navigateBack();
                            //             }, 1500);
                            //         }else{
                            //             this.getData();
                            //         }
                            //     }
                            // }, err => {
                            //     toast.show(err.message);
                            // });
                        }
                    }
                });
            },
            _previewImg(type, image) { //预览图片
                if(type === 'landlord'){
                    uni.previewImage({
                        urls: this.imageLandlord,
                        current: image
                    });
                }else if(type === 'tenant'){
                    uni.previewImage({
                        urls: this.imageTenant,
                        current: image
                    });
                }else if(type === 'transaction'){
                    uni.previewImage({
                        urls: [this.imageTransaction],
                        current: 0
                    });
                }else if(type === 'transactionList'){
                    uni.previewImage({
                        urls: [image],
                        current: 0
                    });
                }else if(type === 'voucher'){
                    uni.previewImage({
                        urls: this.imageVoucher,
                        current: image
                    });
                }
            },
            cpimgOk(file) {
                if(file.urlType === 'landlord'){
                    this.is_imageList = true;
                    for(let i = 0; i < file.data.length; i++){
                        this.imageLandlord.push(file.data[i]);
                    }
                }else if(file.urlType === 'tenant'){
                    this.is_imageList = true;
                    for(let i = 0; i < file.data.length; i++){
                        this.imageTenant.push(file.data[i]);
                    }
                }else if(file.urlType === 'transaction'){
                    this.imageTransaction = file.data[0];
                }else if(file.urlType === 'voucher'){
                    this.is_imageVoucher = true;
                    for(let i = 0; i < file.data.length; i++){
                        this.imageVoucher.push(file.data[i]);
                    }
                }
            },
            cpimgErr(e) {
                toast.show(e);
            },
            _chooseImg(type) { //选择图片
                if(this.resStatus !== 0) return;
                if(type === 'landlord'){
                    if(this.type !== type) return;
                    this.cpimgNum = 9;// - this.imageLandlord.length;
                }else if(type === 'tenant'){
                    if(this.type !== type) return;
                    this.cpimgNum = 9;// - this.imageTenant.length;
                }else if(type === 'transaction'){
                    this.cpimgNum = 1;
                }else if(type === 'voucher'){
                    this.cpimgNum = 9;
                }
                this.$refs.cpimg._changImg(type);
            },
            _closeImg(type, index){
                if(type === 'landlord'){
                    this.imageLandlord.splice(index, 1);
                    this.is_imageList = true;
                }else if(type === 'tenant'){
                    this.imageTenant.splice(index, 1);
                    this.is_imageList = true;
                }else if(type === 'transaction'){
                    this.imageTransaction = '';
                }else if(type === 'voucher'){
                    this.imageVoucher.splice(index, 1);
                    this.is_imageVoucher = !this.imageVoucher.length && !this.data.voucher.length ? false : true;
                }
            },
            _inputContractPrice(e){
                this.contractPrice = e.target.value;
                this.is_imageList = true;
            },
            _inputContractAmount(e){
                this.contractAmount = e.target.value;
                this.is_imageList = true;
            },
            _sendImg(){
                if(this.contractPrice == ''){
                    toast.show('请填写合同单价！');
                    return;
                }
                if(this.contractAmount == ''){
                    toast.show('请填写合同总价！');
                    return;
                }
                let images = [];
                let imagesEmpty = [];
                if(this.type === 'landlord'){
                    images = this.imageLandlord.map(item => {
                        if(this.data.contract.landlord_image.includes(item)){
                            return {image:item, load:true};
                        }else{
                            return {image:item, load:false};
                        }
                    });
                }else{
                    images = this.imageTenant.map(item => {
                        if(this.data.contract.tenant_image.includes(item)){
                            return {image:item, load:true};
                        }else{
                            return {image:item, load:false};
                        }
                    });
                }
                if(images.some(elem => !elem.load)){
                    for(let i = 0, len = images.length; i < len; i++){
                        if(!images[i].load){
                            uploadPic(images[i].image, {}).then(res => {
                                images[i].image = res.data.source;
                                images[i].load = true;
                                if(images.every(item => item.load)){
                                    images.map((item, index) => {
                                        imagesEmpty[index] = item.image;
                                    });
                                    this._sendContract(imagesEmpty);
                                }
                            }, err => {
                                console.log(err);
                            });
                        }
                    }
                }else{
                    images.map((item, index) => {
                        imagesEmpty[index] = item.image;
                    });
                    this._sendContract(imagesEmpty);
                }
            },
            _sendContract(images){
                postOrderSeaContract({order_id: this.id, source: images, amount: this.contractAmount, price: this.contractPrice}).then(res => {
                    uni.hideLoading();
                    this.is_imageList = false;
                    toast.show('提交成功！');
                    this.getData();
                },err => {
                    toast.show('提交失败！');
                });
            },
            _sendVoucherImg(){
                let images = [];
                let imagesEmpty = [];
                images = this.imageVoucher.map(item => {
                    if(this.data.voucher.includes(item)){
                        return {image:item, load:true};
                    }else{
                        return {image:item, load:false};
                    }
                });
                if(images.some(elem => !elem.load)){
                    for(let i = 0, len = images.length; i < len; i++){
                        if(!images[i].load){
                            uploadPic(images[i].image, {}).then(res => {
                                images[i].image = res.data.source;
                                images[i].load = true;
                                if(images.every(item => item.load)){
                                    images.map(item => {
                                        imagesEmpty.push(item.image);
                                    });
                                    this._sendVoucher(imagesEmpty);
                                }
                            }, err => {
                                console.log(err);
                            });
                        }
                    }
                }else{
                    images.map(item => {
                        imagesEmpty.push(item.image);
                    });
                    this._sendVoucher(imagesEmpty);
                }
            },
            _sendVoucher(images){
                postOrderSeaVoucher({order_id: this.id, source: images}).then(res => {
                    uni.hideLoading();
                    this.is_imageVoucher = false;
                    toast.show('提交成功！');
                    this.getData();
                },err => {
                    toast.show('提交失败！');
                });
            },
            _openTransaction(){
                this.is_transaction = true;
            },
            _hideTransaction(){
                this.is_transaction = false;
            },
            _sendTransaction(){
                if(this.send.transfer_account == ''){
                    toast.show('请填写转账方！');
                    return;
                }
                if(this.send.receive_account == ''){
                    toast.show('请填写收款方！');
                    return;
                }
                if(this.send.amount == ''){
                    toast.show('请填写付款金额！');
                    return;
                }
                if(this.send.type == ''){
                    toast.show('请填写付款类型！');
                    return;
                }
                if(this.imageTransaction == ''){
                    toast.show('请添加付款截图！');
                    return;
                }
                this.send.ocean_order_id = this.id;
                uploadPic(this.imageTransaction, {}).then(res => {
                    this.send.image = res.data.source;
                    postOrderSeaTransaction(this.send).then(res => {
                        toast.hideLoading();
                        toast.show('提交成功！');
                        this.imageTransaction = '';
                        this.send.ocean_order_id = null;
                        this.send.image = '';
                        this.send.type = '';
                        this.send.amount = '';
                        this.send.transfer_account = '';
                        this.send.receive_account = '';
                        this.getData();
                        this._hideTransaction();
                    }, err => {
                        toast.show(err.message);
                    });
                }, err => {
                    console.log(err);
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/price-before.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/foot.scss';
    
    .page{
        padding: 54px 0 ;
    }
    
    .form{
        background-color: #fff;
        margin-bottom: $uni-spacing-col-base;
    }
    
    .form__tips{
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: $color-sub;
        padding: 0 $uni-spacing-row-base;
        font-size: 12px;
    }
    
    .fixed__tips{
        position: fixed;
        bottom: 54px;
        left: 0;
        right: 0;
        z-index: 9;
        color: $color-sub;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
        font-size: 12px;
        text-align: center;
    }
    
    .form__img{
        display: block;
        width: 60px;
        height: 60px;
        border: 1px dashed #e0e0e0;
    }

    .price::before{
        @extend %__priceBefore;
    }
    .uni-uploader__files--around{
        @include flex(around);
    }
    .uni-uploader__file{
        position: relative;
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
    
    .card__empty{
        padding: 20px 0;
        text-align: center;
    }
    
    .foot__cell--disable{
        color: #fff;
        background-color: #ccc;
    }
</style>
