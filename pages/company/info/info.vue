<template>
	<view class="page">
		<uni-segmented-control fixed="true" :current="indexActive" :values="items" style-type="text" active-color="#0091E6" @clickItem="_onClickItem" />
        <view v-show="indexActive !== 2">
            <view class="uni-list" v-if="data[indexActive].list.length">
                <block v-for="(item, index) of data[indexActive].list" :key="index">
                    <uni-list-item v-if="indexActive === 0" :title="item.name_cn" :note="'船舶管理员：' + item.manager" @tap="_goShip(index)"></uni-list-item>
                    <uni-list-item v-if="indexActive === 1" :title="item.name" :note="item.phone" :showBadge="true" badgeType="primary" :badgeText="item.role_na" @tap="_goStaff(index)"></uni-list-item>
                </block>
            </view>
            <uni-load-more v-if="data[indexActive].list.length" :status="data[indexActive].loadingType"></uni-load-more>
            <view v-else class="empty">
                <image class="empty__img" src="/static/img/empty.png" mode="aspectFit"></image>
                <text class="empty__text">暂无信息</text>
            </view>
        </view>
        <view class="content" v-show="indexActive === 2">
            <view class="form__list">
                <view class="form__cell" :style="is_edit ? '' : 'display:none;'">
                    <view class="form__label">认证方式</view>
                    <view class="form__note">{{info.entrust_mode_na}}</view>
                </view>
                <view class="form__cell" :style="is_edit ? '' : 'display:none;'">
                    <view class="form__label">企业名称</view>
                    <view class="form__note">{{info.name}}</view>
                </view>
                <view class="form__cell" :style="is_edit ? '' : 'display:none;'">
                    <view class="form__label">企业法人</view>
                    <view class="form__note">{{info.legal_person}}</view>
                </view>
                <view class="form__cell">
                    <view class="form__label">公司电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="info.business_call" :placeholder="defaultInfo.business_call" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" @tap="_showCityPicker()">
                    <view class="form__label">所属省市</view>
                    <view :class="info.area_text ? 'form__field' : 'form__note'">
                        {{info.area_text ? info.area_text : '点击选择'}}
                    </view>
                </view>
                <view class="form__cell">
                    <view class="form__label">详细地址</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="info.addrs" :placeholder="defaultInfo.addrs" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人姓名</view>
                    <input class="formInput__field formInput__field--right" :disabled="is_edit" v-model="info.contact" :placeholder="defaultInfo.contact" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell">
                    <view class="form__label">联系人电话</view>
                    <input class="formInput__field formInput__field--right" type="number" maxlength="11" :disabled="is_edit" v-model="info.phone" :placeholder="defaultInfo.phone" placeholder-style="color: #999;"/>
                </view>
                <view class="form__cell" :style="is_edit ? '' : 'display:none;'">
                    <view class="form__label">授权过期时间</view>
                    <view class="form__note">{{info.entrust_expire}}</view>
                </view>
            </view>
            <view class="info">
                <view class="info__title">企业简介</view>
                <textarea class="info__content" v-model="info.detail" :disabled="is_edit" :placeholder="defaultInfo.detail ? defaultInfo.detail : '完善企业简介有利于别人更多的了解您的企业!'" placeholder-style="color: #999;"/>
            </view>
        </view>
		<view class="foot" v-if="permissions === 'manage'">
		    <button class="foot__btn" type="primary" v-show="indexActive === 1" @tap="_goPage('/pages/staff/add/add', {type: 'company', company_id: id})">添加企业员工</button>
		    <button class="foot__btn" type="primary" v-show="indexActive === 2" @tap="_setEdit()">{{is_edit ? '编辑' : '保存修改'}}</button>
            <button class="foot__btn" type="warn" v-show="indexActive === 2 && !is_edit" @tap="_clearEdit()">取消</button>
		</view>
        
        <mpvue-city-picker ref="mpvuePicker" :deepLength="3" :pickerValueDefault="pickerValueIndex"
         @onConfirm="_onConfirm" @onCancel="_onCancel"></mpvue-city-picker>
	</view>
</template>

<script>
    import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import mpvueCityPicker from '../components/mpvue-citypicker/mpvueCityPicker.vue';
    
    import { router, toast, check, localStorage } from '@/common/util.js';
    import { getCompanyShip, getCompanyStaff, getCompanyDetail, postCompanyDetail } from '@/service/getData.js';
    
    import { mapState, mapActions, mapMutations } from 'vuex';
    
	export default {
        components: {
            uniSegmentedControl,
            uniListItem,
            uniLoadMore,
            mpvueCityPicker
        },
		data() {
			return {
                id: null,
                permissions: 'join',
                items: ['关联的船舶', '企业员工', '企业基本信息'],
				indexActive: 0,
                data: [{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                },{
                    list: [],
                    page: 1,
                    loadingType: 'more'
                }],
                info: null,
                is_edit: true,
                textInput: '',
                defaultInfo: null,
                pickerValueIndex: []
			};
		},
        computed: mapState(['pageTempAdd']),
        onLoad(options) {
            if(options && options.id){
                this.id = options.id;
                this.permissions = options.permissions;
                this.getDetail('init');
            }
        },
        onShow() {
            if(this.pageTempAdd.hasOwnProperty('companyStaffAdd') && this.pageTempAdd.companyStaffAdd){
                this.PAGE_TEMP_ADD({field: 'companyStaffAdd', companyStaffAdd: false});
                this.indexActive = 1;
                this.getData();
            }
        },
		onPullDownRefresh() { // 下拉刷新
            if(this.indexActive === 2){
                this.getDetail();
            }else{
                this.getData();
            }
		},
        onReachBottom() { // 上拉触底
            if(this.indexActive !== 2){
                this.getData('ReachBottom');
            }
        },
        onBackPress() {
            // 退出前关闭选择器
            if (this.$refs.mpvuePicker.showPicker) {
                this.$refs.mpvuePicker.pickerCancel();
                return true;
            }
        },
		onUnload() {
            // 退出前关闭选择器
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
			}
		},
        methods: {
            ...mapActions(['getProvince', 'getCity', 'getArea']),
            ...mapMutations(['PAGE_TEMP_ADD']),
            _goPage(url, param = null){
                router.navigateTo(url, param);
            },
            _goShip(index) {
                let obj = this.data[this.indexActive].list[index];
                obj.type = 'company';
                obj.permissions = this.permissions;
                obj.company_id = this.id;
                this._goPage('/pages/ship/info/info', obj);
            },
            _goStaff(index){
                let obj = this.data[this.indexActive].list[index];
                obj.type = 'company';
                obj.permissions = this.permissions;
                obj.company_id = this.id;
                this._goPage('/pages/staff/detail/detail', obj);
            },
            _setEdit(){
                if(this.is_edit){
                    this.is_edit = false;
                    this.initEdit();
                    return;
                }
                toast.loading();
                if(this.info.business_call === ''){
                    this.info.business_call = this.defaultInfo.business_call;
                }
                if(this.info.phone === ''){
                    this.info.phone = this.defaultInfo.phone;
                }
                if(!check.phone(this.info.business_call) || !check.phone(this.info.phone)){
                    if(this.info.business_call.length === 7){
                        toast.show('座机号码请加上区号！');
                        return;
                    }
                    toast.show('电话格式错误！');
                    return;
                }
                if(this.info.addrs === ''){
                    this.info.addrs = this.defaultInfo.addrs;
                }
                if(this.info.contact === ''){
                    this.info.contact = this.defaultInfo.contact;
                }
                postCompanyDetail(this.info).then(res => {
                    toast.hideLoading();
                    this.is_edit = true;
                    toast.show('修改成功！');
                });
            },
            async initEdit(){
                await this.getProvince();
                await this.getCity();
                await this.getArea();
                let provinces = [0, 0, 0];
                let provinceData = JSON.parse(localStorage.getStore('region_province'));
                for(let i = 0, len = provinceData.length; i < len; i++){
                    if(provinceData[i].id == this.info.province_id){
                        provinces[0] = i;
                        break;
                    }
                }
                if(this.info.city_id !== 0){
                    let cityData = JSON.parse(localStorage.getStore('region_city'));
                    for(let i = 0, len = cityData[this.info.province_id].children.length; i < len; i++){
                        if(cityData[this.info.province_id].children[i].id == this.info.city_id){
                            provinces[1] = i;
                            break;
                        }
                    }
                }
                if(this.info.area_id !== 0){
                    let areaData = JSON.parse(localStorage.getStore('region_area'));
                    for(let i = 0, len = areaData[this.info.city_id].children.length; i < len; i++){
                        if(areaData[this.info.city_id].children[i].id == this.info.area_id){
                            provinces[2] = i;
                            break;
                        }
                    }
                }
                this.pickerValueIndex = provinces;
                this.defaultInfo = {
                    pickerValueIndex: provinces,
                    province_id: this.info.province_id,
                    city_id: this.info.city_id,
                    area_id: this.info.area_id,
                    area_text: this.info.area_text,
                    business_call: this.info.business_call,
                    addrs: this.info.addrs,
                    contact: this.info.contact,
                    phone: this.info.phone,
                    detail: this.info.detail
                }
                this.info.business_call = '';
                this.info.addrs = '';
                this.info.contact = '';
                this.info.phone = '';
                this.info.detail = '';
            },
            _clearEdit() {
                this._onCancel();
                this.info.business_call = this.defaultInfo.business_call;
                this.info.addrs = this.defaultInfo.addrs;
                this.info.contact = this.defaultInfo.contact;
                this.info.phone = this.defaultInfo.phone;
                this.info.detail = this.defaultInfo.detail;
                this.is_edit = true;
            },
            _showCityPicker() {
                if(this.is_edit) return;
                this.$refs.mpvuePicker.show();
            },
            _onCancel(e) {
                this.pickerValueIndex = this.defaultInfo.pickerValueIndex;
                this.info.province_id = this.defaultInfo.province_id;
                this.info.city_id = this.defaultInfo.city_id;
                this.info.area_id = this.defaultInfo.area_id;
                this.info.area_text = this.defaultInfo.area_text;
            },
            _onConfirm(e) {
                this.pickerValueIndex = e.index;
                this.info.province_id = e.province_id;
                this.info.city_id = e.city_id;
                this.info.area_id = e.area_id;
                this.info.area_text = e.provinces;
            },
            _onClickItem(e) {
                this.is_edit = true;
                this.indexActive = e;
                if(e !== 2){
                    if(this.data[e].page === 1 && this.data[e].loadingType === 'more'){
                        this.getData();
                    }
                }
            },
            async getDetail(type='DownRefresh') {
                toast.loading();
                let res = await getCompanyDetail(this.id);
                this.info = res.data;
                if(!this.info.detail && this.permissions === 'join'){
                    this.info.detail = '暂无简介';
                }
                if(type === 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }else{
                    this.getData();
                }
            },
            getData(type='DownRefresh') {
                let index = this.indexActive;
                if(type == 'DownRefresh'){
                    this.data[index].page = 1;
                    this.data[index].loadingType = 'more';
                    toast.loading();
                }
                if(type == 'ReachBottom'){
                    if(this.data[index].loadingType == 'noMore') return;
                    this.data[index].loadingType = 'loading';
                }
                if(index === 0){
                    getCompanyShip({id: this.id, page: this.data[index].page}).then(res => {
                        this.setData(type, 0, res);
                    });
                }else{
                    getCompanyStaff({id: this.id, page: this.data[index].page}).then(res => {
                        this.setData(type, 1, res);
                    });
                }
            },
            setData(type, index, res){
                if(this.data[index].page == 1){
                    this.data[index].list = res.data;
                }else{
                    this.data[index].list = this.data[index].list.concat(res.data);
                }
                if(type == 'DownRefresh'){
                    uni.stopPullDownRefresh();
                    toast.hideLoading();
                }
                if(res.data.length < 15){
                    this.data[index].loadingType = 'noMore';
                }else{
                    this.data[index].loadingType = 'more';
                    this.data[index].page ++;
                }
            }
        },
	}
</script>

<style lang="scss">
    @import '@/style/mixin/hr.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/empty.scss';
    
    .page{
        padding: 54px 0;
    }
    
    .content{
    }
    
    .form__list{
        background-color: $uni-bg-color;
    }
    
    .page .uni-list-item__extra{
        width: initial;
    }
    
    .content .uni-list::before, .content .uni-list::after{
        display: none;
    }
    
    .content .uni-list uni-list-item:last-child .uni-list-item__container::after{
        display: none;
    }
    
    .info{
        margin: $uni-spacing-col-base 0;
        color: $uni-text-color;
        background-color: $uni-bg-color;
        overflow: hidden;
        
        &__title{
            position: relative;
            padding: $uni-spacing-col-lg $uni-spacing-row-base;
            color: $uni-text-color;
            font-size: 16px;
            
            &::after{
                @include hr(bottom);
            }
        }
        
        &__content{
            box-sizing: border-box;
            width: 100%;
            min-height: 100px;
            height: initial;
            padding: $uni-spacing-col-base $uni-spacing-row-base;
        }
    }
</style>
