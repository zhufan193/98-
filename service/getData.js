import request from '@/config/request'
import secondrequest from '@/config/secondrequest'
import upload from '@/config/upload'
import {localStorage} from '@/common/util'


/**
 * =====================================================================================================================================
 * 基础
 */
//测试
export const secondgetInit = (data) => secondrequest(data,'GET');
//用户登录接口
export const secondlogin = (data) => secondrequest(data,'GET');
//用户注册接口
export const secondregister = (data) => secondrequest(data,'GET');
//系统参数接口
export const sencondsystem = (data) => secondrequest(data,'GET');
//短信接口
export const secondsms = (data) => secondrequest(data,'GET');
//主页-幻灯片接口
export const secondmainlantern = (data) => secondrequest(data,'GET');
//主页-公告信息
export const secondnotice = (data) => secondrequest(data,'GET');
//主页-货源总数、船源总数
export const secondsum= (data) => secondrequest(data,'GET');
//主页-货源推荐
export const secondrecommend = (data) => secondrequest(data,'GET');
//主页-新闻资讯
export const secondnews = (data) => secondrequest(data,'GET');
//货源-幻灯片
export const secondgoodslantern = (data) => secondrequest(data,'GET');
//船源-幻灯片
export const secondboatlantern = (data) => secondrequest(data,'GET');
//货源信息（带参数）
export const secondgoodsnews = (data) => secondrequest(data,'GET');
//货源详细
export const secondgoodsdetail = (data) => secondrequest(data,'GET');
//船源信息（带参数）
export const secondboatnews = (data) => secondrequest(data,'GET');
//抢单货源提交接口
export const secondgoodsSourceOrder = (data) => secondrequest(data,'GET');
//燃油供应幻灯片
export const secondoilslantern = (data) => secondrequest(data,'GET');
//燃油供应列表
export const secondoilslist = (data) => secondrequest(data,'GET');
//燃油供应详情
export const secondoilsdetail = (data) => secondrequest(data,'GET');
//我要购油
export const secondbuyoil = (data) => secondrequest(data,'GET');

















































// 初始化
export const getInit = (data) => request('init', data);

// 初始化当前位置
export const getLocation = (data) => request('location', data);

// 获取验证码
export const postSecCode = (data) => request('sec_code', data, 'POST');

// 上传图片
export const uploadPic = (file, data) => upload('upload_image', file, 'image', data);

// 上传文件
export const uploadFile = (file, data) => upload('upload_file', file, 'file', data);

// 字典
export const getDictionary = (data) => request('search_do', data);

// app相关文本信息
export const getAppArticle = (type) => request('single_page', {type: type});

// 获取首页信息
export const getHome = () => request('home');

// 获取首页banner信息
export const getBannerDetail = (id) => request('nav_page/' + id);

// 发布
export const postService = (data) => request('service_page/' + data.release_type, data, 'POST');

// 搜索
export const getSearch = (data) => request('search', data);

// 搜索
export const getSearchGlobal = (val) => request('search_do', {type: 'global_region', name: val});

// 搜索
export const getSearchPort = (val) => request('search_do', {type: 'harbor', name: val});

// bug提交
export const setBUG = (data) => request('debug/add_error', data, 'POST');

// 消息获取
export const getMessage = (data) => request('user/message', data);

// 消息详情获取兼状态修改
export const getMessageType = (id) => request('user/message/' + id);

// 消息详情功能状态修改
export const postMessageAction = (id, type) => request('user/message/' + id + '/action', { action_state: type}, 'POST');

//发布意见建议
export const postFeedback = (data) => request('user_advice',data,'POST')

//投诉
export const postComplaint= (data) => request('user_complaint',data,'POST')


/**
 * =====================================================================================================================================
 * 登录注册
 */

// 验证注册账号
export const postRegisterAccount = (data) => request('register/check', data, 'POST');

// 忘记密码
export const postForgetPwd = (data) => request('forget_password', data, 'POST');

// 注册
export const postRegister = (data) => request('register', data, 'POST');

// 短信验证码登录
export const postLoginPhone = (data) => request('login_phone', data, 'POST');

// 账号密码登录 Bearer abcdeABCDE
export const postLoginAccount = (data) => request('login_account', data, 'POST');

// 账号注销
export const postAccountCancel = (data) => request('user/cancel', data, 'POST');

// 账号注销取消
export const postAccountCancelBack = (data) => request('user/cancel_back', data, 'POST');


/**
 * =====================================================================================================================================
 * 个人数据管理
 */

// 获取用户信息
export const getUserInfo = () => request('user/info');

// 修改用户信息
export const postUserInfo = (data) => request('user/info', data, 'POST');

// 个人中心数量更新
export const getUserInfoCount = () => request('user/info_count');

// 收藏
export const postCollection = (id, data) => request('favorite/' + id, data, 'POST');

// 取消收藏
export const postUnCollection = (id, data) => request('un_favorite/' + id, data, 'POST');

// 收藏列表
export const getMyCollection = (data) => request('my_favorite', data);

// 关注列表(和收藏合并)

// 统一删除我的发布
export const postActionDel = (type, id) => request('post_action/' + type + '/del', {id: id}, 'POST')

// 添加实名认证
export const postVerify = (data) => request('user/verify', data, 'POST');

// 获取实名认证信息
export const getVerify = () => request('user/verify');

// 取消实名认证
export const postVerifyCancel = (id) => request('user/cancel_verify', {id: id}, 'POST');


/**
 * =====================================================================================================================================
 * 海运订单
 */

// 获取我的报价
export const getUserOfferList = (data) => request('user_offer', data);

// 获取我的报价
export const getUserOfferDetail = (id) => request('user_offer/' + id);

// 获取海运订单列表
export const getOrderSeaList = (data) => request('ocean_order', data);

// 获取海运订单详情
export const getOrderSeaDetail = (id) => request('ocean_order/' + id);

// 海运订单报价批复
export const postOrderSeaReply = (data) => request('ocean_order/reply', data, 'POST');

// 获取海运订单电子合同
export const getOrderSeaContract = (data) => request('ocean_order/' + data.order_id + '/contract/' + data.id);

// 海运订单电子合同上传
export const postOrderSeaContract = (data) => request('ocean_order/contract', data, 'POST');

// 海运订单送达凭证上传
export const postOrderSeaVoucher = (data) => request('ocean_order/voucher', data, 'POST');

// 海运订单报价添加订单付款记录
export const postOrderSeaTransaction = (data) => request('ocean_order/transaction', data, 'POST');

// 海运订单添加订单付款记录订单双方接口
export const getOrderSeaTransaction = (id) => request('ocean_order/transaction_change/' + id);

// 海运订单报价关闭
export const postOrderSeaClosure = (data) => request('ocean_order/closure', data, 'POST');

// 海运订单提交审核
export const postOrderSeaAudit = (data) => request('ocean_order/audit', data, 'POST');

/**
 * =====================================================================================================================================
 * 银行卡
 */

// 获取银行卡列表
export const getBankList = (data) => request('user/my_bank', data);

// 获取银行卡详情
export const getBankDetail = (data) => request('user/my_bank/show', data);

// 新增/编辑银行卡详情
export const postBank = (data) => request('user/my_bank/update', data, 'POST');

// 删除银行卡
export const postBankDel = (data) => request('user/my_bank/destroy', data, 'POST');


/**
 * =====================================================================================================================================
 * 发票信息
 */

// 获取发票信息列表
export const getInvoiceList = (data) => request('user/my_invoice', data);

// 获取发票信息详情
export const getInvoiceDetail = (data) => request('user/my_invoice/show', data);

// 新增/编辑发票信息详情
export const postInvoice = (data) => request('user/my_invoice/update', data, 'POST');

// 删除发票信息
export const postInvoiceDel = (data) => request('user/my_invoice/destroy', data, 'POST');


/**
 * =====================================================================================================================================
 * 资讯
 */

// 获取新闻头部分类
export const getNews = () => request('news/cat');

// 获取新闻列表
export const getNewsList = (data) => request('news', data);

// 获取新闻详情
export const getNewsDetail = (id) => request('news/' + id);

// 获取新闻评论
export const getNewsComment = (id, data) => request('news/' + id + '/comments', data);

// 发布新闻评论
export const postNewsComment = (id, data) => request('news/' + id +'/comments', data, 'POST');


/**
 * =====================================================================================================================================
 * 船期信息获取
 */

// 获取船期列表
export const getSailList = (data) => request('ship_market', data);

// 获取船期详情
export const getSailDetail = (id) => request('ship_market/' + id);

// 发布船期
export const postSail = (data) => request('ship_market', data, 'POST');

// 船期抢单
export const postSailOffer = (data) => request('ship_market_offer', data, 'POST');

// 船期抢单报价列表
export const getSailOffer = (data) => request('ship_market_offer', data);


/**
 * =====================================================================================================================================
 * 货期信息获取
 */

// 获取货期列表
export const getPalletList = (data) => request('cargo_market', data);

// 获取货期详情
export const getPalletDetail = (id) => request('cargo_market/' + id);

// 发布货期
export const postPallet = (data) => request('cargo_market', data, 'POST');

// 货期抢单
export const postPalletOffer = (data) => request('cargo_market_offer', data, 'POST');

// 货期抢单报价列表
export const getPalletOffer = (data) => request('cargo_market_offer', data);


/**
 * =====================================================================================================================================
 * 竞价加油信息获取
 */

// 发布竞价加油
export const postOilBid = (data) => request('bid_order', data, 'POST');

// 获取竞价列表
export const getOilBidList = (data) => request('bid_order', data);

// 获取竞价详情
export const getOilBidDetail = (id) => request('bid_order/' + id);

// 获取竞价详情报价记录
export const getOilBidRecord = (data) => request('bid_order/' + data.id + '/record', data);

// 发起竞价
export const postOilBidRecord = (data) => request('bid_order/' + data.id + '/record', data, 'POST');

// 获取油商黄页列表
export const getOilStoreList = (data) => request('bid_order/oil_company', data);

// 发布油商黄页
export const postOilStore = (data) => request('bid_order/oil_company', data, 'POST');

// 获取油商黄页详情
export const getOilStoreDetail = (id) => request('bid_order/oil_company/' + id);


/**
 * =====================================================================================================================================
 * 砂石信息获取
 */

// 获取砂石类型
export const getSandTypeList = () => request('seach_do');

// 发布砂石求购
export const postSandBuy = (data) => request('sand_buy', data, 'POST');

// 获取砂石求购列表
export const getSandBuyList = (data) => request('sand_buy', data);

// 获取砂石求购详情
export const getSandBuyDetail = (id) => request('sand_buy/' + id);

// 发布砂石供应
export const postSandSell = (data) => request('sand_sell', data, 'POST');

// 获取砂石供应列表
export const getSandSellList = (data) => request('sand_sell', data);

// 获取砂石供应详情
export const getSandSellDetail = (id) => request('sand_sell/' + id);


/**
 * =====================================================================================================================================
 * 船舶信息获取
 */

// 获取我的船舶列表
export const getShipList = (data) => request('user/ships', data);

// 获取我的船舶列表(发布页使用)
export const getMyShipList = () => request('user/my_ships');

//获取我的船舶信息(发布页中关联船舶信息)
export const getMyShipInfoList = () => request('user/my_ships_info');

// 获取船舶详情
export const getShipDetail = (id) => request('ships/' + id);

// 修改船舶详情
export const postShipDetail = (data) => request('ships/' + data.id, data, 'POST');

// 搜索某条船是否存在
export const getShipSearch = (data) => request('ships/search', data);

// 加入某一只船
export const postShipJoin = (id) => request('ships/' + id + '/apply', {}, 'POST');

// 同意加入船申请
export const postShipApplyAgree = (data) => request('ships/' + data.ship_id + '/agree_apply', data, 'POST');

// 拒绝加入船申请
export const postShipApplyReject = (data) => request('ships/' + data.ship_id + '/reject_apply', data, 'POST');

// 获取船舶员工
export const getShipStaff = (id) => request('ships/' + id + '/staff');

// 搜索员工
export const getShipSearchStaff = (data) => request('ships/' + data.ship_id + '/search_staff', data);

// 添加员工
export const postShipStaff = (data) => request('ships/' + data.ship_id + '/staff/add', data, 'POST');

// 发送更换管理员验证码
export const postShipManagerCode = (ship_id) => request('ships/' + ship_id + '/manager_code', {}, 'POST');

// 确定更换管理员
export const postShipManagerConfirm = (data) => request('ships/' + data.ship_id + '/manager_confirm', data, 'POST');

// 移除某条船上的某位员工
export const postShipStaffRemove = (data) => request('ships/' + data.ship_id + '/staff/' + data.user_id + '/remove', {}, 'POST');

// 添加船舶认证
export const postVerifyShip = (data) => request('user/ship_verify', data, 'POST');

// 取消船舶认证
export const postVerifyShipCencel = (id) => request('user/ship_verify/' + id + '/cancel', {}, 'POST');

// 获取船舶认证列表
export const getVerifyShipList  = (data) => request('user/ship_verify', data);

// 获取船舶认证信息
export const getVerifyShip  = (id) => request('user/ship_verify/' + id);


/**
 * =====================================================================================================================================
 * 船舶资讯信息获取
 */

// 获取船舶代理列表
export const getShipAgentList = (data) => request('ship_agent', data);

// 获取船舶代理详情
export const getShipAgentDetail = (id) => request('ship_agent/' + id);

// 获取船舶维修列表
export const getShipMaintenanceList = (data) => request('maintain', data);

// 获取船舶维修详情
export const getShipMaintenanceDetail = (id) => request('maintain/' + id);

// 获取船舶配件列表
export const getShipPartsList = (data) => request('component', data);

// 获取船舶配件详情
export const getShipPartsDetail = (id) => request('component/' + id);


/**
 * =====================================================================================================================================
 * 船舶交易信息获取
 */

// 发布船舶购买
export const postShipBuy = (data) => request('ship_buy', data, 'POST');

// 获取船舶购买列表
export const getShipBuyList = (data) => request('ship_buy', data);

// 获取船舶购买详情
export const getShipBuyDetail = (id) => request('ship_buy/' + id);

// 发布船舶出售
export const postShipSell = (data) => request('ship_sell', data, 'POST');

// 获取船舶出售列表
export const getShipSellList = (data) => request('ship_sell', data);

// 获取船舶出售详情
export const getShipSellDetail = (id) => request('ship_sell/' + id);


/**
 * =====================================================================================================================================
 * 船舶租赁信息获取
 */

// 发布船舶租赁
export const postShipRent = (data) => request('ship_rent', data, 'POST');

// 获取船舶租赁列表
export const getShipRentList = (data) => request('ship_rent', data);

// 获取船舶租赁详情
export const getShipRentDetail = (id) => request('ship_rent/' + id);


/**
 * =====================================================================================================================================
 * 公司信息获取
 */

// 我负责的企业
export const getCompanyList = (data) => request('user/company', data);

// 我负责的企业(发布页使用)
export const getMyCompanyList = (data) => request('user/my_company', data);

// 企业详情
export const getCompanyDetail = (id) => request('company/' + id);

// 修改企业详情
export const postCompanyDetail = (data) => request('company/' + data.id, data,'POST');

// 企业修改船舶详情
export const postCompanyShipDetail = (data) => request('company/' + data.company_id + '/ships/' + data.ship_id, data, 'POST');

// 关联船舶列表
export const getCompanyShip = (data) => request('company/' + data.id + '/ships', data);

// 企业船舶详情
export const getCompanyShipDetail = (data) => request('company/' + data.company_id + '/ships/' + data.ship_id);

// 查看某条船下的所有员工
export const getCompanyShipStaff = (data) => request('company/' + data.company_id + '/ships/' + data.ship_id + '/staff');

// 解绑某公司某条船的某个员工
export const postCompanyShipStaffRemove = (data) => request('company/' + data.company_id + '/ships/' + data.ship_id + '/staff/' + data.user_id + '/remove', {},'POST');

// 根据公司名搜索船
export const getCompanySearchShip = (data) => request('company/search_ship', data);

// 关联船舶
export const postCompanyShip = (data) => request('company/add_ship', data, 'POST');

// 企业员工
export const getCompanyStaff = (data) => request('company/' + data.id + '/staff', data);

// 根据公司名搜索员工
export const postCompanySearchStaff = (data) => request('company/' + data.company_id + '/search_staff', data, 'POST');

// 企业添加员工
export const postCompanyStaff = (data) => request('company/' + data.company_id + '/staff/add', data, 'POST');

// 企业添加船舶员工
export const postCompanyShipStaff = (data) => request('company/' + data.company_id + '/ships/' + data.ship_id + '/staff/add', data, 'POST');

// 发送更换管理员验证码
export const postCompanyManagerCode = (company_id) => request('company/' + company_id + '/manager_code', {}, 'POST');

// 确定更换管理员
export const postCompanyManagerConfirm = (data) => request('company/' + data.company_id + '/manager_confirm', data, 'POST');

// 解绑某公司某个员工
export const postCompanyStaffRemove = (data) => request('company/' + data.company_id + '/staff/' + data.user_id + '/remove', {},'POST');

// 搜索企业
export const postSearchCompany = (data) => request('company/search', data, 'POST');

// 申请加入企业
export const postCompanyApply = (data) => request('company/staff/apply', data, 'POST');

// 同意加入企业申请
export const postCompanyApplyAgree = (data) => request('company/' + data.company_id + '/agree_apply', data, 'POST');

// 拒绝加入企业申请
export const postCompanyApplyReject = (data) => request('company/' + data.company_id + '/reject_apply', data, 'POST');

// 进行企业认证
export const postCompanyVerify = (data) => request('user/company_verify', data, 'POST');

// 取消企业认证
export const postCompanyVerifyCancel = (id) => request('user/company_verify/' + id + '/cancel', {}, 'POST');

// 获取企业认证列表
export const getCompanyVerifyList = (data) => request('user/company_verify', data);

// 获取企业认证详情
export const getCompanyVerifyDetail = (id) => request('user/company_verify/' + id);

// 获取法律咨询列表
export const getCompanyLawList = (data) => request('legal_advice', data);

// 获取法律咨询详情
export const getCompanyLawDetail = (id) => request('legal_advice/' + id);

// 获取财务咨询列表
export const getCompanyFinancialList = (data) => request('finance_advice', data);

// 获取财务咨询详情
export const getCompanyFinancialDetail = (id) => request('finance_advice/' + id);


/**
 * =====================================================================================================================================
 * 其他功能页
 */

// 海难救援
export const getWreckRescue = (data) => request('wreck_rescue', data);

// 海事局地区分类
export const getMaritimeBureau = () => request('search_do', {type: 'dict', code: 'MaritimeBureauType'});

// 海事局地区列表
export const getMaritimeOffice = (data) => request('maritime_office', data);

// 海事局详情
export const getMaritimeOfficeDetail = (id) => request('maritime_office/' + id);


/**
 * =====================================================================================================================================
 * 港口信息获取
 */

// 获取港口列表
export const getPortList = (data) => request('harbors', data);

// 获取港口详情
export const getPortDetail = (id) => request('harbors/' + id);


/**
 * =====================================================================================================================================
 * 地图数据获取
 */

// 获取地图markers
export const getMapMarkers = (data) => request('map_markers', data);

/**
 * =====================================================================================================================================
 * bdi数据获取
 */

export const getBdi = (data) => request('bdi', data);