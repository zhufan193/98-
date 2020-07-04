import {
    VERSION_UPDATA,             // 版本数据更新
    GOPAGE_LOGIN,               // 跳转登录页
    TOKEN_USERUPDATA,           // token更新
    CODE_KEY_UPDATA,            // code_key记录
    CUSTOMER_UPDATA,            // app信息记录
    RECORD_USERINFO,            // 记录用户信息
	RECORD_STSTEMCONFIG,        //记录系统设置信息
    LOGOUT,                     // 注销
    TABBAR_MESSAGE_UPDATA,      // tabBar消息更新
    LOCATION_UPDATA,            // 当前经纬度更新
    ADDRESS_UPDATA,             // 当前地址更新
    ADDRESS_ID_UPDATA,          // 当前省市id更新
    ADDRESS_INDEX_UPDATA,       // 当前省市index更新
    GLOBAL_TEMP_BOOL,           // 国家省市缓存开关
    PROVINCES_TEMP_BOOL,        // 省市区缓存开关
    PORT_TEMP_UPDATA,           // 港口缓存数据更新
    COMPANY_TEMP_UPDATA,        // 公司缓存数据更新
    SHIP_TEMP_UPDATA,           // 船舶缓存数据更新
    DICTIONARY_TEMP_UPDATA,     // 字典缓存数据更新
    PAGE_TEMP_UPDATA,           // 页面临时缓存更新
    PAGE_TEMP_ADD,              // 新增页面临时缓存更新
    SCREEN_TEMP,                // 页面筛选临时缓存更新
} from './mutation-types.js';
import { localStorage } from '@/common/util.js';

import { getLocation } from '@/service/getData.js';

export default {
    // 版本数据更新
    [VERSION_UPDATA](state, data) {
        const res = uni.getSystemInfoSync();
        state.systemInfo = res;
        state.version = data;
        // #ifdef APP-PLUS
        // 检查更新
        plus.runtime.getProperty(plus.runtime.appid, function(resApp){
            state.version.oldversion = resApp.version;
            // if(resApp.version !== data.version){
            //     uni.navigateTo({
            //         url: '/pages/common/up-data/up-data'
            //     });
            // }
        })
        // #endif
    },
    // 跳转登录页
    [GOPAGE_LOGIN](state) {
        if(!state.hasLogin){
            if (state.forcedLogin) {
                uni.reLaunch({
                    url: '/pages/user/login/login'
                });
            } else {
                uni.navigateTo({
                    url: '/pages/user/login/login'
                });
            }
        }
    },
    // token记录
    [TOKEN_USERUPDATA](state, data){
        localStorage.setStore('loginToken', data);
        state.token = data;
    },
    // 短信验证码效验码记录
    [CODE_KEY_UPDATA](state, code_key){
        localStorage.setStore('code_key', code_key);
        state.code_key = code_key;
    },
    // app信息记录
    [CUSTOMER_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.customer[param.field] = param[param.field];
            // #ifdef APP-PLUS
            if(param.field == 'customer_call'){
                localStorage.setStore('customer_call', param[param.field]);
            }
            // #endif
        }else{
            state.customer = param;
        }
    },
    // 记录用户信息
    [RECORD_USERINFO](state, param) {
        state.hasLogin = true;
        if(param.hasOwnProperty('field')){
            if(param.field == 'message'){
                this.commit(TABBAR_MESSAGE_UPDATA, param.message);
            }
            state.userInfo[param.field] = param[param.field];
        }else{
            if(param.hasOwnProperty('message')){
                this.commit(TABBAR_MESSAGE_UPDATA, param.message);
            }
            state.userInfo = param;
        }
        localStorage.setStore('userInfo', state.userInfo);
    },
	// 记录系统设置信息
	[RECORD_STSTEMCONFIG](state, param) {
	    if(param.hasOwnProperty('field')){
	        if(param.field == 'message'){
	            this.commit(TABBAR_MESSAGE_UPDATA, param.message);
	        }
	        state.systemConfig[param.field] = param[param.field];
	    }else{
	        if(param.hasOwnProperty('message')){
	            this.commit(TABBAR_MESSAGE_UPDATA, param.message);
	        }
	        state.systemConfig = param;
	    }
	    localStorage.setStore('systemConfig', state.systemConfig);
	},
    // 注销清除登陆信息
    [LOGOUT](state) {
        console.log('注销清除登陆信息');
        localStorage.removeStore('loginToken');
        localStorage.removeStore('userInfo');
        state.hasLogin = false;
        state.token = '';
        state.userInfo = {
            id: undefined,
            avatar: undefined,
            account: '未登录',
            phone: undefined,
            vip: 0,
            email: undefined,
            identity_type: -1,
            identity_str: undefined,
            sex: -1,
            realname: undefined,
            nickname: undefined,
            user_type: undefined,
            user_str: undefined,
            cancel_state: 2,
            cancel_at: 0,
            is_realname: false,
            review_state: undefined,
            favorites: undefined,
            follow: undefined,
            message: undefined,
            sea_order: undefined,
            insurance_order: undefined,
            fuel_order: undefined,
            company: undefined,
            ship: undefined,
            ship_market: undefined,
            ship_market_offer: 0,
            cargo_market: undefined,
            cargo_market_offer: 0,
            fuel_market: undefined,
            ship_sell: undefined,
            ship_rent: undefined,
            maintain: undefined,
            component: undefined,
            legal_advice: undefined,
            finance_advice: undefined,
            oil_company: undefined
        }
        state.portTempData = undefined;
        state.companyTempData = {};
        state.shipTempData = {};
        state.dictionaryTempData = {};
    },
    // tabBar消息更新
    [TABBAR_MESSAGE_UPDATA](state, num) {
        // #ifdef APP-PLUS
        if(num == 0){
            uni.removeTabBarBadge({
                index: 3
            });
        }else{
            // 新消息设置
            uni.setTabBarBadge({
                index: 3,
                text: num.toString()
            });
        }
        // #endif
        // #ifndef APP-PLUS
        if(num == 0){
            uni.removeTabBarBadge({
                index: 4
            });
        }else{
            // 新消息设置
            uni.setTabBarBadge({
                index: 4,
                text: num.toString()
            });
        }
        // #endif
    },
    // 当前经纬度更新
    [LOCATION_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.userLocation[param.field] = param[param.field];
        }else{
            state.userLocation = param;
        }
    },
    // 当前地址更新
    [ADDRESS_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.userAddress[param.field] = param[param.field];
        }else{
            state.userAddress = param;
        }
    },
    // 当前省市id更新
    [ADDRESS_ID_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.userAddressId[param.field] = param[param.field];
        }else{
            state.userAddressId = param;
        }
    },
    // 当前省市Index更新
    [ADDRESS_INDEX_UPDATA](state){
        let provinecData = JSON.parse(localStorage.getStore('region_province'));
        for(let i = 0, len = provinecData.length; i < len; i++){
            if(provinecData[i].id == state.userAddressId.province){
                state.userAddressIndex.province = i;
                break;
            }
        }
        if(state.userAddressId.city !== undefined){
            let provinceIndex = state.userAddressId.province;
            let cityData = JSON.parse(localStorage.getStore('region_city'));
            for(let i = 0, len = cityData[provinceIndex].children.length; i < len; i++){
                if(cityData[provinceIndex].children[i].id == state.userAddressId.city){
                    state.userAddressIndex.city = i;
                    break;
                }
            }
        }
        if(state.userAddressId.area !== undefined){
            let cityIndex = state.userAddressId.city;
            let areaData = JSON.parse(localStorage.getStore('region_area'));
            for(let i = 0, len = areaData[cityIndex].children.length; i < len; i++){
                if(areaData[cityIndex].children[i].id == state.userAddressId.area){
                    state.userAddressIndex.area = i;
                    break;
                }
            }
        }
    },
    [GLOBAL_TEMP_BOOL](state, param) {
        if(param.hasOwnProperty('field')){
            if(param.field === 'global'){
                state.globalTempBool[param.field] = param[param.field];
            }else{
                state.globalTempBool[param.field][param.id] = param[param.field];
            }
        }else{
            state.globalTempBool = param;
        }
    },
    [PROVINCES_TEMP_BOOL](state, param) {
        if(param.hasOwnProperty('field')){
            state.provincesTempBool[param.field] = param[param.field];
        }else{
            state.provincesTempBool = param;
        }
    },
    // 港口缓存数据更新
    [PORT_TEMP_UPDATA](state, param){
        let data;
        if(param.hasOwnProperty('data')){
            localStorage.setStore('region_port', param.data);
            data = param.data;
        }else{
            data = localStorage.getStore('region_port');
        }
        if(param.hasOwnProperty('id') && !!data[param.id]){
            state.portTempData = data[param.id];
        }else{
            state.portTempData = {
                id: 'default',
                children: [{
                    id: null,
                    name: '默认'
                }]
            };
        }
    },
    // 公司缓存数据更新
    [COMPANY_TEMP_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.companyTempData[param.field] = param[param.field];
        }else{
            state.companyTempData = param;
        }
    },
    // 船舶缓存数据更新
    [SHIP_TEMP_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.shipTempData[param.field] = param[param.field];
        }else{
            state.shipTempData = param;
        }
    },
    // 字典缓存数据更新
    [DICTIONARY_TEMP_UPDATA](state, param){
        if(param.hasOwnProperty('field')){
            state.dictionaryTempData[param.field] = param[param.field];
        }else{
            state.dictionaryTempData = param;
        }
    },
    // 页面临时缓存更新
    [PAGE_TEMP_UPDATA](state, param){
        state.pageTempData = param;
    },
    // 新增页面临时缓存更新
    [PAGE_TEMP_ADD](state, param){
        if(param.hasOwnProperty('field')){
            state.pageTempAdd[param.field] = param[param.field];
        }else if(param.hasOwnProperty('del')){
            delete state.pageTempAdd[param['del']];
        }else{
            state.pageTempAdd = param;
        }
    },
    // 页面筛选临时缓存更新
    [SCREEN_TEMP](state, param){
        if(param.hasOwnProperty('field')){
            state.screenTemp[param.field] = param[param.field];
        }else if(param.hasOwnProperty('del')){
            delete state.screenTemp[param['del']];
        }else{
            state.screenTemp = param;
        }
    }
}
