# shipping_uni-app

## 项目介绍
运有方项目基于uni-app开发组件、模板、功能


## 软件架构
软件架构说明
Hbuilder uni-app
vue
vuex


## 项目运行
主要：HbuilderX真机运行
次要：微信小程序（小部分页面考虑性能问题使用nvue无法兼容小程序，需另外开发）


## 目标功能

- [ ] 首次进入展示页、引导页
- [ ] 首页
- [ ] 个人中心
- [x] 更新下载App(包含热更新)
- [x] 登录/注册
- [x] 上传文件(头像、图片)
- [ ] 微信登录
- [ ] 发布功能
- [ ] 定位功能
- [ ] 选择城市
- [ ] 搜索

## 项目布局

### 主体结构
```
.
├── common                                  // 公共文件
│   └── util.js                                 // 公共函数
├── config                                  // 基本配置
│   ├── env.js                                  // 环境切换配置
│   ├── request.js                              // 请求方法
│   ├── upload.js                               // 文件上传方法
│   └── errorLog.js                             // 网络请求错误处理
├── service                                 // 数据交互统一调配
│   ├── getData.js                              // 获取数据的统一调配文件，对接口进行统一管理
│   └── tempdata                                // 开发阶段的临时数据
├── static                                  // 静态文件
│   ├── font                                    // 字体图标
│   ├── icon                                    // 图标
│   ├── img                                     // 图片
│   └── temp                                    // 临时图片
├── store                                   // vuex的状态管理
│   ├── action.js                               // 配置actions
│   ├── getters.js                              // 配置getters
│   ├── index.js                                // 引用vuex，创建store
│   ├── mutation-types.js                       // 定义常量muations名
│   └── mutations.js                            // 配置mutations
├── unpackage                               // 临时文件
│   └── screenshots                         // 项目参考截图
├── App.vue                                 // 页面入口文件
├── main.js                                 // 程序入口文件，加载各种公共组件
├── manifest.json                           // 应用配置
├── pages.json                              // 页面配置
├── README.md                               // 自述文件
└── uni.scss                                // 常用样式变量
0 directories, 0 files
```

### util.js 公共函数
```
.
├── router              // 路由
│   ├──setQueryConfig       // 动态拼接参数到请求的url
│   ├──navigateBack         // 关闭当前页面，返回上一页面或多级页面。
│   ├──navigateTo           // 保留当前页面，跳转到应用内的某个页面
│   ├──redirectTo           // 关闭当前页面，跳转到应用内的某个页面。
│   ├──reLaunch             // 关闭所有页面，打开到应用内的某个页面。
│   └──switchTab            // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
├── toast               // 提示
│   ├──show                 // 显示消息提示框
│   ├──showImg              // 自定义图片消息提示框
│   ├──success              // 成功消息提示框
│   ├──loading              // loading 提示框。
│   └──hideLoading          // 隐藏 loading 提示框。
├── localStorage        // 数据缓存
│   ├──getStore             // 获取localStorage，同步接口
│   ├──setStore             // 存储localStorage，同步接口
│   ├──removeStore          // 删除localStorage，同步接口
│   ├──getStoreInfo         // 获取localStorage信息,同步接口
│   └──clearStore           // 清空localStorage，同步接口
├── check               // 正则校验
│   ├──phone                // 手机号码校验
│   ├──idcard            // 身份证校验
│   └──password             // 密码的强度必须包含大小写字母和数字的组合，不能使用特殊字符，长度最少8位
├── format              // 格式化
│   ├──location             // 经纬度转XX°XX′
│   ├──timing               // 计时秒转00：00：00形态
│   └──money                // 价格转string格式
├── dateUtils           // 时间转换xx天前、xx小时前、刚刚
│   ├──parse                // 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
│   ├──formatYear           // 转换XX时间前、去除秒（通知使用）
│   ├──format               // 转换XX时间前，天以内转换、去除秒(文章使用)
│   └──formatStr            // 当前时间转化为参数（"yyyy/MM/dd HH:mm:ss"）格式的字符串
├── debounce            // 函数防抖
└── throttle            // 函数节流
```

### components组件参考页面介绍
```
·
├── mpuve-picker            // 选择器
├── tab-nvue                // 新闻页
├── uni-badge               // 角标
├── uni-grid                // 宫格
├── uni-icon                // uni图标
├── uni-list                // 列表框
├── uni-list-item           // 列表
├── uni-load-more           // 底部加载
├── uni-rate                // 评论的五颗星组件
├── uni-segmented-control   // tabbar分段器
├── uni-status-bar          // uni顶部状态栏
├── uni-steps               // 步骤条
├── uni-swiper-dot          // 轮播图自定义指示点
├── wlp-card                // 自定义卡片
├── wlp-comment             // 自定义评论列表
└── wlp-query               // 自定义tabbar筛选
```

### pages-template页面介绍
```
·
├── common                          // 通用页
│   ├── error                           // 错误
│   ├── rich-text                       // 文章
│   ├── up-data                         // 更新
│   └── web-view                        // web网页
├── company                         // 企业
│   ├── detail                          // 详情
│   ├── financial                       // 财务
│   ├── law                             // 法律
│   └── verify                          // 认证
├── map                            // 地图
│   ├── c		                        // 地图测试用
│   └── map                             // 首页查船舶地图
├── message                        // 消息
│   ├── tabbar                          // 消息列表带选项卡
│   ├── list                            // 消息列表
│   ├── detail                          // 消息详情
│   ├── im-chat                         // 聊天窗口
│   ├── notice                          // 公告
│   └── service                         // 客服
├── news                            // 新闻
│   ├── detail                          // 详情
│   ├── search                          // 搜索
│   └── tabbar                          // 新闻列表带选项卡
├── pallet                          // 货期
│   ├── detail                          // 详情
│   └── tabbar                          // 首页用
├── port                            // 港口
│   ├── detail                          // 详情
│   └── query                           // 搜索
├── sail                            // 船期
│   ├── detail                          // 详情
│   └── tabbar                          // 首页用
├── setting                         // 设置
│   ├── about                           // 关于
│   ├── feedback                        // 问题反馈
│   ├── invite                          // 邀请
│   ├── log                             // 日志管理
│   ├── set-up                          // 设置
│   └── share                           // 分享
├── ship                            // 船
│   ├── apply                           // 申请
│   ├── deal                            // 交易
│   ├── detail                          // 详情
│   ├── hire                            // 租赁
│   ├── maintenance                     // 维修
│   ├── management                      // 管理
│   ├── parts                           // 配件
│   ├── user                            // 我的发布
│   └── verify                          // 认证
├── staff                           // 员工
│   └── detail                          // 详情
├── tabBar                          // appTabBar页
│   ├── home                            // 首页
│   └── release                         // 发布
└── user                            // 用户
    ├── profile                         // 个人中心
    ├── login                           // 登录页
    └── reg                             // 注册页
    ├── businessCard                    // 名片
    ├── forget                          // 忘记密码，修改密码页
    └── info                            // 帐户信息
```

### 样式style
```
.
├── mixin               // 组件样式
│   ├── flex.scss           // icon
│   ├── flex.scss           // icon
│   ├── flex.scss           // icon
│   ├── flex.scss           // 价格¥前加
│   ├── text-overflow.scss           // 文本格式化超出省略号
│   └── triangle.scss     // 画三角形
├── page                    // 页面样式
│   ├── grid-scroll         // 首页横向grid
│   └── numbox-shopping     // 商品加入购物车按钮
├── base.scss               // 样式入口
└── uni.css                 // uni组件样式
```

