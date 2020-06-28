import {
    getUserInfo,
    getLocation,
    getDictionary,
    getMyShipList,
    getMyCompanyList,
	getMyShipInfoList
} from '../service/getData.js'

import { localStorage } from '@/common/util.js';

import {
    RECORD_USERINFO,
    LOCATION_UPDATA,
    ADDRESS_UPDATA,
    ADDRESS_ID_UPDATA,
    GLOBAL_TEMP_BOOL,
    PROVINCES_TEMP_BOOL,
    COMPANY_TEMP_UPDATA,
    SHIP_TEMP_UPDATA,
    DICTIONARY_TEMP_UPDATA
} from './mutation-types.js'

export default {
    // 获取用户信息
    async getUserInfo({state, commit}) {
        let res = await getUserInfo();
		console.log(res.data);
        state.token = localStorage.getStore('loginToken');
        commit(RECORD_USERINFO, res.data);
    },
    // 获取Location
    async getLocation({state, commit}) {
        let [err, res] = await uni.getLocation({
            type: 'gcj02',
            geocode: true,
        });
        if(res == null){
            uni.showLoading({
                title: '定位权限没有开启!',
                mask: true
            });
        }
        if(res.address != null){
            commit(ADDRESS_UPDATA, res.address);
        }
        commit(LOCATION_UPDATA, res);
    },
    // 获取用户AddresId
    async getUserAddresId({state, commit}) {
        let res = await getLocation({longitude: state.userLocation.longitude, latitude: state.userLocation.latitude});
        commit(ADDRESS_ID_UPDATA, {field: 'province', province: res.data.province_id});
        commit(ADDRESS_ID_UPDATA, {field: 'city', city: res.data.city_id});
        commit(ADDRESS_ID_UPDATA, {field: 'area', area: res.data.area_id});
    },
    // 获取国家
    async getGlobal({state, commit}, param) {
        let resGlobal, resProvince, resCity;
        if(param === undefined){
            if(!!state.globalTempBool.global) return;
            resGlobal = await getDictionary({type: 'global_region'});
            localStorage.setStore('region_global', resGlobal.data);
            commit(GLOBAL_TEMP_BOOL, {field: 'global', global: true});
            param = {
                global_id: resGlobal.data[0].id,
                global_name: resGlobal.data[0].name
            }
        }
        if(param.hasOwnProperty('global_id')){
            if(!!state.globalTempBool.province[param.global_id]) return;
            resProvince = await getDictionary({type: 'global_region', id: param.global_id});
            if(resProvince.data.length) {
                param.province_id = resProvince.data[0].id;
                param.province_name = resProvince.data[0].name;
                param.province_empty = false;
            }else{
                // 省不存在情况下
                resProvince.data = [{id: param.global_id, name: '全' + param.global_name, empty: true}];
                param.province_empty = true;
            }
            localStorage.setStore('region_global_province_' + param.global_id, resProvince.data);
            commit(GLOBAL_TEMP_BOOL, {field: 'province', id: param.global_id, province: true});
        }
        if(param.hasOwnProperty('province_id')){
            if(!!state.globalTempBool.city[param.province_id]) return;
            resCity = await getDictionary({type: 'global_region', id: param.province_id});
            if(!resCity.data.length) {
                // 市不存在情况下
                resCity.data = [{id: param.province_id, name: '全' + param.province_name, empty: true}];
            }
            localStorage.setStore('region_global_city_' + param.province_id, resCity.data);
            commit(GLOBAL_TEMP_BOOL, {field: 'city', id: param.province_id, city: true});
        }
        // console.log(param)
    },
    // 获取港口
    async getPort({state, commit}, param) {
		let res = await getDictionary({type: 'harbor', area_id: param.id, area_code: param.code});
        localStorage.setStore('region_port_' + param.id, res.data);
        commit(GLOBAL_TEMP_BOOL, {field: 'port', id: param.id, port: true});
    },
    // 获取省份
    async getProvince({state, commit}) {
        if(state.provincesTempBool.province) return;
		let res = await getDictionary({type: 'region', code: 'province'});
        localStorage.setStore('region_province', res.data);
        commit(PROVINCES_TEMP_BOOL, {field: 'province', province: true});
    },
    // 获取市
    async getCity({state, commit}, id = 0) {
        if(state.provincesTempBool.city) return;
		let res = await getDictionary({type: 'region', code: 'city'});
        let cityData = {}, index = null, num = 0;
        for(let i = 0, len = res.data.length; i < len; i++){
            if(res.data[i].parent_id !== index){
                num ++;
                index = res.data[i].parent_id;
                cityData[index] = {
                    children: [],
                    parent_id: index
                };
            }
            cityData[index].children.push({
                id: res.data[i].id,
                name: res.data[i].name
            });
        }
        cityData.length = num;
        localStorage.setStore('region_city', cityData);
        commit(PROVINCES_TEMP_BOOL, {field: 'city', city: true});
    },
    // 获取区
    async getArea({state, commit}, id = 0) {
        if(state.provincesTempBool.area) return;
		let res = await getDictionary({type: 'region', code: 'area'});
        let areaData = {}, index = null, num = 0;
        for(let i = 0, len = res.data.length; i < len; i++){
            if(res.data[i].parent_id !== index){
                num ++;
                index = res.data[i].parent_id;
                areaData[index] = {
                    children: [],
                    parent_id: index
                };
            }
            areaData[index].children.push({
                id: res.data[i].id,
                name: res.data[i].name
            });
        }
        areaData.length = num;
        localStorage.setStore('region_area', areaData);
        commit(PROVINCES_TEMP_BOOL, {field: 'area', area: true});
    },
    // 企业类型
    async getDictCompany({state, commit}) {
        if(state.dictionaryTempData.hasOwnProperty('dict_company') && !!state.dictionaryTempData.dict_company.length) return;
        let res = await getDictionary({type: 'dict', code: 'company'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'dict_company', dict_company: res.data});
    },
    // 船舶类型
    async getShipType({state, commit}) {
        if(state.dictionaryTempData.hasOwnProperty('ship_type') && !!state.dictionaryTempData.ship_type.length) return;
        let res = await getDictionary({type: 'ship_type'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'ship_type', ship_type: res.data});
    },
	// 驾驶位置
	async getPosition({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('dict_drive_position') && !!state.dictionaryTempData.dict_drive_position.length) return;
		let res = await getDictionary({type: 'dict', code: 'drive_position'});
		commit(DICTIONARY_TEMP_UPDATA, {field: 'dict_drive_position', dict_drive_position: res.data});
	},
	// 获取砂石分类
	async getSandType({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('sand_type') && !!state.dictionaryTempData.sand_type.length) return;
	    let res = await getDictionary({type:'sand_type'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'sand_type', sand_type: res.data});
	},
	// 获取货品分类
	async getCargoType({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('cargo_type') && !!state.dictionaryTempData.cargo_type.length) return;
	    let res = await getDictionary({type:'cargo_type'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'cargo_type', cargo_type: res.data});
	},
	// 获取封仓类型
	async getClosureType({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('closure_type') && !!state.dictionaryTempData.closure_type.length) return;
	    let res = await getDictionary({type:'closureType'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'closure_type', closure_type: res.data});
	},
	// 获取包装分类
	async getPackingType({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('packing_type') && !!state.dictionaryTempData.packing_type.length) return;
	    let res = await getDictionary({type:'packingType'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'packing_type', packing_type: res.data});
	},
	// 获取货物重量
	async getCargoDwt({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('cargo_dwt') && !!state.dictionaryTempData.cargo_dwt.length) return;
	    let res = await getDictionary({type:'cargoDwt'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'cargo_dwt', cargo_dwt: res.data});
	},
	// 获取船只吨位
	async getShipDwt({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('ship_dwt') && !!state.dictionaryTempData.ship_dwt.length) return;
	    let res = await getDictionary({type:'shipDwt'});
	    commit(DICTIONARY_TEMP_UPDATA, {field: 'ship_dwt', ship_dwt: res.data});
	},
	// 获取物流
	async getExpress({state, commit}) {
		if(state.dictionaryTempData.hasOwnProperty('express') && !!state.dictionaryTempData.express.length) return;
		let res = await getDictionary({type: 'dict', code: 'express'});
		commit(DICTIONARY_TEMP_UPDATA, {field: 'express', express: res.data});
	},
    // 维修类型
    async getMaintainType({state, commit}) {
        if(state.dictionaryTempData.hasOwnProperty('maintain_type') && !!state.dictionaryTempData.maintain_type.length) return;
        let res = await getDictionary({type: 'maintain_type'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'maintain_type', maintain_type: res.data});
    },
    // 备件类型
    async getComponentType({state, commit}) {
        if(state.dictionaryTempData.hasOwnProperty('component_type') && !!state.dictionaryTempData.component_type.length) return;
        let res = await getDictionary({type: 'component_type'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'component_type', component_type: res.data});
    },
    // 油品类型
    async getOilType({state, commit}) {
        if(state.dictionaryTempData.hasOwnProperty('oil_type') && !!state.dictionaryTempData.oil_type.length) return;
        let res = await getDictionary({type: 'oil_type'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'oil_type', oil_type: res.data});
    },
    // 我的船舶列表
    async getReleaseShip({state, commit}) {
        let res = await getMyShipList();
        commit(SHIP_TEMP_UPDATA, {field: 'my_ship', my_ship: res.data});
    },
	// 我的船舶信息
	async getMyShipInfo({state, commit}) {
	    let res = await getMyShipInfoList();
	    commit(SHIP_TEMP_UPDATA, {field: 'my_ship_info', my_ship_info: res.data});
	},
    // 我的企业列表
    async getReleaseCompany({state, commit}) {
        let res = await getMyCompanyList();
        commit(COMPANY_TEMP_UPDATA, {field: 'my_company', my_company: res.data});
    },
    // 船舶类型企业列表
    async getCompanyShip({state, commit}) {
        let res = await getMyCompanyList({type: 'company_ship'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_ship', company_ship: res.data});
    },
    // 货物类型企业列表
    async getCompanyCargo({state, commit}) {
        let res = await getMyCompanyList({type: 'company_cargo'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_cargo', company_cargo: res.data});
    },
    // 燃油类型企业列表
    async getCompanyFuel({state, commit}) {
        let res = await getMyCompanyList({type: 'company_fuel'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_fuel', company_fuel: res.data});
    },
    // 维修类型企业列表
    async getCompanyMaintain({state, commit}) {
        let res = await getMyCompanyList({type: 'company_maintain'});
        // let res = await getDictionary({type: 'service_company', filter: 'maintain'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_maintain', company_maintain: res.data});
    },
    // 备件类型企业列表
    async getCompanyComponent({state, commit}) {
        let res = await getMyCompanyList({type: 'company_component'});
        // let res = await getDictionary({type: 'service_company', filter: 'component'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_component', company_component: res.data});
    },
    // 法律类型企业列表
    async getCompanyLegalAdvice({state, commit}) {
        let res = await getMyCompanyList({type: 'company_legal'});
        // let res = await getDictionary({type: 'service_company', filter: 'legal_advice'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_legal', company_legal: res.data});
    },
    // 财务类型企业列表
    async getCompanyFinanceAdvice({state, commit}) {
        let res = await getMyCompanyList({type: 'company_finance'});
        // let res = await getDictionary({type: 'service_company', filter: 'finance-advice'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_finance', company_finance: res.data});
    },
    // 代理类型企业列表
    async getCompanyShipAgent({state, commit}) {
        let res = await getMyCompanyList({type: 'company_agent'});
        // let res = await getDictionary({type: 'service_company', filter: 'ship_agent'});
        commit(COMPANY_TEMP_UPDATA, {field: 'company_agent', company_agent: res.data});
    },
	//获取银行卡类型
	async getBankType({state, commit}) {
        let res = await getDictionary({type: 'banks'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'banks', banks: res.data});
    },
	
	//获取report类型
	async getReportType({state, commit}) {
        let res = await getDictionary({type: 'dict', code: 'report_type'});
        commit(DICTIONARY_TEMP_UPDATA, {field: 'report_type', report_type: res.data});
    },
    
}