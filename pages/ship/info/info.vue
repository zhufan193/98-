<template>
	<view class="page">
	    <uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
	    <template v-if="indexActive === 0">
	        <view v-if="is_edit" class="form__list">
                <view class="card__swiper">
                    <swiper class="swiper-box" autoplay="true" circular="true">
                        <swiper-item class="swiper-item" v-for="(item ,index) in detail.images" :key="index">
                            <image :src="item" mode="aspectFill" />
                        </swiper-item>
                    </swiper>
                </view>
                <view v-if="detail.is_expire" class="form__cell">
                    <view class="form__label">授权过期时间</view>
                    <view class="form__note">船舶授权已过期</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">中文船名</view>
                    <view class="form__note">{{detail.name_cn}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">英文船名</view>
                    <view class="form__note">{{detail.name_en}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">MMSI</view>
                    <view class="form__note">{{detail.mmsi}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">IMO</view>
                    <view class="form__note">{{detail.imo}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">船舶类型</view>
                    <view class="form__note">{{detail.type_na}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">载重（吨)</view>
                    <view class="form__note">{{detail.load_amount}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">所属公司</view>
                    <view class="form__note">{{detail.company}}</view>
                </view>
	        </view>
	        <view class="form__list">
                <view class="form__cell">
                    <view class="form__label">船籍港</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.register_harbor" :placeholder="defaultDetail.register_harbor ? defaultDetail.register_harbor : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">建造时间</view>
                    <view v-if="is_edit" class="form__note">
                        {{detail.builded_at ? detail.builded_at : '未设置'}}
                    </view>
                    <picker v-else mode="date" @change="_changeTime">
                        <view class="form__note">{{detail.builded_at ? detail.builded_at : defaultDetail.builded_at ? defaultDetail.builded_at : '点击选择'}}</view>
                    </picker>
                </view>
                <view class="form__cell">
                    <view class="form__label">船长（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="detail.length" :placeholder="defaultDetail.length" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">船宽（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="detail.width" :placeholder="defaultDetail.width" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">吃水（米）</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="detail.draft" :placeholder="defaultDetail.draft" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">排水量（吨）</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="detail.displacement" :placeholder="defaultDetail.displacement" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">总吨位</view>
                    <input class="formInput__field formInput__field--right" type="number" :disabled="is_edit" v-model="detail.total_load_amount" :placeholder="defaultDetail.total_load_amount" placeholder-style="color: #999;"/>
                </view>
	        </view>
	    </template>
	    <template v-if="indexActive === 1">
            <view class="uni-list-title">
                船舶所有人信息
            </view>
	        <view class="form__list">
                <view class="form__cell">
                    <view class="form__label">船舶所有人</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.owner.name" :placeholder="defaultDetail.owner.name ? defaultDetail.owner.name : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="detail.owner.company_phone" :placeholder="defaultDetail.owner.company_phone ? defaultDetail.owner.company_phone : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">传真</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.owner.fax" :placeholder="defaultDetail.owner.fax ? defaultDetail.owner.fax : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">邮箱</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.owner.email" :placeholder="defaultDetail.owner.email ? defaultDetail.owner.email : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.owner.contact" :placeholder="defaultDetail.owner.contact ? defaultDetail.owner.contact : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="detail.owner.phone" :placeholder="defaultDetail.owner.phone ? defaultDetail.owner.phone : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
	        </view>
            <view class="uni-list-title">
                船舶经营人信息
            </view>
	        <view class="form__list">
                <view class="form__cell">
                    <view class="form__label">船舶经营人</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.operator.name" :placeholder="defaultDetail.operator.name ? defaultDetail.operator.name : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="detail.operator.company_phone" :placeholder="defaultDetail.operator.company_phone ? defaultDetail.operator.company_phone : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">传真</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.operator.fax" :placeholder="defaultDetail.operator.fax ? defaultDetail.operator.fax : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">邮箱</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.operator.email" :placeholder="defaultDetail.operator.email ? defaultDetail.operator.email : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="detail.operator.contact" :placeholder="defaultDetail.operator.contact ? defaultDetail.operator.contact : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="detail.operator.phone" :placeholder="defaultDetail.operator.phone ? defaultDetail.operator.phone : is_edit ? '未填写' : '点击输入'" placeholder-style="color: #999;"/>
                </view>
	        </view>
	    </template>
        <template v-if="indexActive === 2">
            <view class="uni-list">
                <block v-for="(item, index) of data" :key="index">
                    <uni-list-item :title="item.name" :note="item.phone" :showBadge="true" badgeType="primary" :badgeText="item.role_na" @tap="_goStaff(item)"></uni-list-item>
                </block>
            </view>
	        <uni-load-more v-if="data.length" :status="loadingType"></uni-load-more>
	        <view v-else class="empty">
	            <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
	            <text class="empty__text">暂无员工</text>
	        </view>
	    </template>
	    <view class="foot" v-if="permissions === 'manage'">
	        <button v-show="indexActive === 2" class="foot__btn" type="primary" @tap="_goPage('/pages/staff/add/add', {type: type === 'ship' ? 'ship' : 'companyShip', ship_id: id, company_id: company_id})">添加员工</button>
            <button v-show="indexActive !== 2" class="foot__btn" type="primary" @tap="_setEdit()">{{is_edit ? '编辑' : '保存修改'}}</button>
            <button v-show="indexActive !== 2 && !is_edit" class="foot__btn" type="warn" @tap="_clearEdit()">取消</button>
	    </view>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    
    import { router, toast, deepClone } from '@/common/util.js';
    import { getShipDetail, postShipDetail, getShipStaff, getCompanyShipDetail, postCompanyShipDetail, getCompanyShipStaff } from '@/service/getData.js';
    
    import { mapState, mapMutations } from 'vuex';
    
	export default {
        components:{
            uniSegmentedControl,
            uniListItem,
            uniLoadMore
        },
		data() {
			return {
                type: 'ship',
                permissions: 'join',
                company_id: null,
                id: null,
                items: ['基本信息', '所有人/经营人', '员工'],
                indexActive: 0,
				data: [],
                loadingType: 'more',
                page: 1,
                detail: {},
                defaultDetail: null,
                is_edit: true
			};
		},
        computed: mapState(['pageTempAdd']),
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                this.type = options.type;
                this.permissions = options.permissions;
                this.getDetail('init', options);
            }
        },
        onShow() {
            if((this.pageTempAdd.hasOwnProperty('shipStaffAdd') && this.pageTempAdd.shipStaffAdd) || (this.pageTempAdd.hasOwnProperty('shipStaffRemove') && this.pageTempAdd.shipStaffRemove)){
                this.PAGE_TEMP_ADD({field: 'shipStaffAdd', shipStaffAdd: false});
                this.PAGE_TEMP_ADD({field: 'shipStaffRemove', shipStaffRemove: false});
                this.indexActive = 2;
                this.getData();
            }
        },
		onPullDownRefresh() { // 下拉刷新
            if(this.indexActive === 2){
                this.getData();
            }else{
                this.getDetail();
            }
		},
        onReachBottom() { // 上拉触底
            if(this.indexActive === 2){
                this.getData('ReachBottom');
            }
        },
        methods: {
            ...mapMutations(['PAGE_TEMP_ADD']),
            _goStaff(item){
                let obj = item;
                if(obj && obj.type){
                    this.type = obj.type;
                    if(this.type !== 'ship'){
                        obj.type = 'companyShip';
                        obj.company_id = this.company_id;
                    }
                }
                obj.permissions = this.permissions;
                this._goPage('/pages/staff/detail/detail', obj);
            },
            _goPage(url, param = null){
                router.navigateTo(url, param);
            },
            // 对象拷贝
            deepClone(source){
                const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
                for(let keys in source){ // 遍历目标
                    if(source.hasOwnProperty(keys)){
                        if(source[keys] && typeof source[keys] === 'object'){ // 如果值是对象，就递归一下
                            targetObj[keys] = source[keys].constructor === Array ? [] : {};
                            targetObj[keys] = deepClone(source[keys]);
                        }else{ // 如果不是，就直接赋值
                            targetObj[keys] = source[keys];
                        }
                    }
                }
                return targetObj;
            },
            _changeTime(e){
                this.detail.builded_at = e.detail.value;
            },
            // 手机号码校验
            checkPhone(phone){ 
                if(phone !== ''){
                    if(phone.length === 7){
                        toast.show('座机号码请加上区号！');
                        return true;
                    }
                    var reg = /^1[3456789]\d{9}$/;
                    var reg2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{11}$/;
                    if(reg.test(phone) || reg2.test(phone)) {
                        return false;
                    }
                    toast.show('电话格式错误！');
                    return true;
                }else{
                    return false;
                }
            },
            _setEdit(){
                if(this.is_edit){
                    this.is_edit = false;
                    this.defaultDetail = this.deepClone(this.detail);
                    return;
                }
                toast.loading();
                let send = this.deepClone(this.detail);
                send.operator = JSON.stringify(this.detail.operator);
                send.owner = JSON.stringify(this.detail.owner);
                if(this.checkPhone(this.detail.owner.company_phone) || this.checkPhone(this.detail.owner.phone) || this.checkPhone(this.detail.operator.company_phone) || this.checkPhone(this.detail.operator.phone)){
                    return;
                }
                if(this.type === 'ship'){
                    postShipDetail(send).then(res => {
                        toast.hideLoading();
                        this.is_edit = true;
                        toast.show('修改成功！');
                    });
                }else{
                    postCompanyShipDetail(send).then(res => {
                        toast.hideLoading();
                        this.is_edit = true;
                        toast.show('修改成功！');
                    });
                }
            },
            _clearEdit() {
                this.detail = this.defaultDetail;
                this.is_edit = true;
            },
            _onClickItem(e){
                this.indexActive = e;
                if(e === 2 && this.page === 1 && this.loadingType === 'more'){
                    this.getData();
                }
            },
            async getDetail(type='DownRefresh', options) {
                toast.loading();
                let res;
                if(this.type === 'ship'){
                    if(type === 'init'){
                        uni.setNavigationBarTitle({
                            title: options.name
                        });
                    }
                    res = await getShipDetail(this.id);
                }else{
                    if(type === 'init'){
                        this.company_id = options.company_id;
                        uni.setNavigationBarTitle({
                            title: options.name_cn
                        });
                    }
                    res = await getCompanyShipDetail({company_id: this.company_id, ship_id: this.id});
                }
                this.detail = res.data;
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                }
                toast.hideLoading();
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.page = 1;
                    this.loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.loadingType == 'noMore') return;
                    this.loadingType = 'loading';
                }
                toast.loading();
                if(this.type === 'ship'){
                    getShipStaff(this.id).then(res => {
                        this.setData(res, type);
                    });
                }else{
                    getCompanyShipStaff({company_id: this.company_id, ship_id: this.id}).then(res => {
                        this.setData(res, type);
                    });
                }
            },
            setData(res, type) {
                this.data = res.data;
                if(this.page == 1){
                    this.data = res.data;
                }else{
                    this.data = this.data.concat(res.data);
                }
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }
                if(res.data.length < 15){
                    this.loadingType = 'noMore';
                }else{
                    this.loadingType = 'more';
                    this.page ++;
                }
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding: 54px 0 44px;
    }
    
    .uni-list{
        margin-bottom: $uni-spacing-col-base;
    }
    
    .uni-list-title{
        padding: 0 $uni-spacing-row-base $uni-spacing-col-base;
    }
    
    .form__list{
        background-color: $uni-bg-color;
        margin-bottom: $uni-spacing-col-base;
    }
    
    .card__swiper{
        padding: $uni-spacing-col-base $uni-spacing-row-base 0;
    }
    
    .swiper-box {
    	width: 100%;
    	height: 350upx;
        border-radius: $uni-border-radius-base;
        overflow: hidden;
    }
    
    .swiper-item {
        @include flex(center, center);
    	height: 100%;
    	background: #eee;
        
        image {
        	width: 100%;
        	height: 100%;
        }
    }
</style>
