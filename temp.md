13805017361     tiamobb0331
18650487872     hahaliu
13348290525     123456


/ocean_order/closure  
关闭订单接口(取消订单/确认订单完成)
接收参数$param = $request->validate([
            'o_id' => 'required',
            'status' => 'required'
        ]);
status 1完成 2取消


contract合同
pay_record付款记录

tenantStatus托运方操作订单状态 0进行中 1完成 2取消
landlordStatus承运方操作订单状态 0进行中 1完成 2取消
tenant_id
landlord_id


/ocean_order/transaction
添加订单付款记录接口
接受参数$param = $request->validate([
            'ocean_order_id' => 'required',
            'image' => 'required',
            'type' => 'required',
            'amount' => 'required',
            'transfer_account' => 'required',
            'receive_account' => 'required',
        ]);
image值为提交上传图片后返回的source值




/ocean_order/contract提交订单合同接口
post提交
$param = $request->validate([
            'order_id' => 'required',
            'source' => 'required'
        ]);
接受参数order_id订单id，source合同图片源(提交上传图片接口后返回)
今天 11:09
$param = $request->validate([
            'order_id' => 'required',
            'sort' => 'required',
            'source' => 'required'
        ]);
合同接口增加sort参数，标记是第几张图片




/ocean_order/reply订单报价批复接口
post提交
接受参数
'id' => 'required',
            'o_id' => 'required',
            'market_type' => 'required',
            'status' => 'required'
id报价id
o_id订单id
market_type订单列表返回的值
status批复状态值为Y or N
Y接受，N拒绝



ocean_order接口返回值更改
status订单状态 1待确认 2进行中 3已完成 0已取消

market_type订单来源类型,ship船期,cargo货盘,backend后台
tenant_name托运方
landlord_name承运方
offer_count报价数量

订单报价列表status状态 0未被接受报价 1被接受报价 2驳回




/cargo_market_offer
货盘船主报价接口
get请求带o_id参数获取订单报价列表
post请求提交报价
post请求参数'cm_id' => 'required',
            'ship_id' => 'required',
            'empty_at' => 'required',
            'interval' => 'required',
            'price' => 'required',
            'is_tax' => 'required',
            'earnest_money' => 'required',
            'remark' => 'nullable',
post请求必须用户登录




/ship_market_offer
船期货主报价接口
get请求带o_id参数获取订单报价列表
post请求提交报价
post请求参数'sm_id' => 'required',
            'contact' => 'required',
            'cargo_type' => 'required',
            'cargo_name' => 'required',
            'weigh' => 'required',
            'empty_date' => 'empty_date',
            'empty_days' => 'empty_days',
            'price' => 'required',
            'is_tax' => 'required',
            'earnest_money' => 'required',
            'remark' => 'nullable',
            
            
货主报价接口增加参数
'departure_ids' => 'required',
            'target_ids' => 'required',
            'departure_na' => 'required',
            'target_na' => 'required',
departure_ids选择的国,省,市id
使用英文逗号连接
departure_na，选择省市后的中文名称，有输入，输入的信息跟在后面
待确认订单(船)接口增加departure与target返回,对应报价的时候提交的target_na与departure_na

[](https://apps.apple.com/cn/app/运有方/id1491697631)

船主报价接口增加参数
'empty_ids' => 'required',
'empty_na' => 'required',
空船地ids和名称
规则和货主报价的装货地卸货地一样
待确认订单(货)增加empty_na返回，对应报价时候的empty_na


增加/user_offer 我的报价接口，接收status参数 0未被接受报价 1被接受报价 2驳回

增加/user_offer/{id} 我的报价详情接口， 返回需要根据offer_type的类型分别解析，market与offer数据对应原型中详情的船期货盘数据与我的报价数据



船期货盘 电话未登录隐藏
已下单 按钮文字修改




/ocean_order/voucher提交订单送达凭证接口
接收'order_id' => 'required',
            'source' => 'required'
格式和上传合同一样
订单详情增加送达凭证voucher返回








权限：拨打电话
使用目的：用于快捷拨打【船/货】电话

权限：获取定位
使用目的：添加地址时快捷填写当前位置、【查船舶】自身定位

权限：拍照
使用目的：用于头像、图片文件信息上传

权限：读取手机状态和身份
使用目的：消息推送、客服sdk需要

权限：发送彩信
使用目的：友盟，高德地图sdk包含

权限：存储
使用目的：静态缓存使用
