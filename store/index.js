import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	firstApp: false,		// 首次使用App
    forcedLogin: false,     // 是否强制登陆
    hasLogin: false,        // 是否登陆
    token: '',
    code_key: '',           // 短信验证码条件
    systemConfig: {                  // 系统信息
		mobile:undefined,//客服电话
		business:undefined,//商务电话
		businessmobile:undefined,//商务电话
		technology:'dafjl',//技术姓名
		technologymobile:undefined,//技术电话
		version:undefined,//系统版本
		company:undefined,//公司名称
		address:undefined,//联系地址
		qq:undefined,//Qq
		email:undefined,//电子邮箱
	},
	userInfo: {             // 用户信息
        uid: undefined,
        uname: undefined,
        account: '未登录',
        realname: undefined,
        mobile: undefined,
        identity: undefined,
        company: undefined,
        certification: undefined,
        headimg: undefined,
        qq: undefined,
        email: undefined,
    },
	userLocation: {
		latitude: undefined,	// 当前位置纬度
		longitude: undefined,	// 当前位置经度
	},
	userAddress: {              // 当前经纬度解析城市
        country: undefined,     // 国家
        province: undefined,    // 省份
        city: undefined,        // 城市
        district: undefined,    // 区（县）
        street: undefined,      // 街道
        streetNum: undefined,   // 街道门牌号
        poiName: undefined,     // POI信息
        postalCode: undefined,  // 邮政编码
        cityCode: undefined     // 城市代码
    },
    userAddressId: {
        province: undefined,    // 选择默认省份id
        city: undefined,        // 选择默认城市id
        area: undefined         // 选择默认城区id
    },
    userAddressIndex: {
        province: 0,    // 选择默认省份index
        city: 0,        // 选择默认城市index
        area: 0         // 选择默认城区index
    },
    globalTempBool: {               // 国家市缓存数据(与下面省市区是两套不同的体系)
        global: false,
        province: {},
        city: {},
        port: {}
    },
    provincesTempBool: {
        province: false,            // 省份缓存数据
        city: false,                // 市缓存数据
        area: false                 // 区缓存数据
    },
    portTempData: undefined,        // 港口缓存数据
    companyTempData: {},            // 公司缓存数据
    shipTempData: {},               // 船舶缓存数据
    dictionaryTempData: {},         // 字典缓存数据 
    pageTempData: null,             // 页面临时缓存
    pageTempAdd: {},                // 页面新增判断
    screenTemp: {},                 // 页面筛选缓存
    customer: {
        customer_call: '',          // 客服电话
    },
	systemInfo: undefined,		    // 当前运行基座
	version: undefined,		        // 版本
}

/* const state = {
	firstApp: false,		// 首次使用App
    forcedLogin: false,     // 是否强制登陆
    hasLogin: true,        // 是否登陆
    token: '',
    code_key: '',           // 短信验证码条件
    userInfo: {             // 用户信息
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
        insurance_order: 0,
        fuel_order: 0,
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
        ship_agent: undefined,
        sand_count: undefined,
        oil_company: undefined
    },
	userLocation: {
		latitude: undefined,	// 当前位置纬度
		longitude: undefined,	// 当前位置经度
	},
	userAddress: {              // 当前经纬度解析城市
        country: undefined,     // 国家
        province: undefined,    // 省份
        city: undefined,        // 城市
        district: undefined,    // 区（县）
        street: undefined,      // 街道
        streetNum: undefined,   // 街道门牌号
        poiName: undefined,     // POI信息
        postalCode: undefined,  // 邮政编码
        cityCode: undefined     // 城市代码
    },
    userAddressId: {
        province: undefined,    // 选择默认省份id
        city: undefined,        // 选择默认城市id
        area: undefined         // 选择默认城区id
    },
    userAddressIndex: {
        province: 0,    // 选择默认省份index
        city: 0,        // 选择默认城市index
        area: 0         // 选择默认城区index
    },
    globalTempBool: {               // 国家市缓存数据(与下面省市区是两套不同的体系)
        global: false,
        province: {},
        city: {},
        port: {}
    },
    provincesTempBool: {
        province: false,            // 省份缓存数据
        city: false,                // 市缓存数据
        area: false                 // 区缓存数据
    },
    portTempData: undefined,        // 港口缓存数据
    companyTempData: {},            // 公司缓存数据
    shipTempData: {},               // 船舶缓存数据
    dictionaryTempData: {},         // 字典缓存数据 
    pageTempData: null,             // 页面临时缓存
    pageTempAdd: {},                // 页面新增判断
    screenTemp: {},                 // 页面筛选缓存
    customer: {
        customer_call: '',          // 客服电话
    },
	systemInfo: undefined,		    // 当前运行基座
	version: undefined,		        // 版本
} */

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})