/*
 * =========================================================
 * 异常处理
 * 
*/
import { setBUG } from '@/service/getData.js';

import store from 'vue';

export default (objError) => {
    try {
        return new Promise((resolve, reject) => {
            if(objError.path === 'debug/add_error')return;
            switch(objError.type){
                case 'status':
                    // console.log("接口返回错误:" + objError.res.message);
                    if(objError.res.status == 100){
                        // console.log("toKen失效");
                        uni.showToast({
                            title: '长时间未登陆，请重新登陆',
                            icon:"none",
                        });
                        store.prototype.$store.commit('LOGOUT');
                    }else if(objError.res.status == 0){
                        uni.hideLoading();
                    }else{
                        // console.log("api验证失败");
                        uni.showToast({
                            title: objError.res.message,
                            icon:"none",
                        });
                    }
                    resolve(objError)
                    break;
                case 'statusCode':
                    console.log("提交错误:" + objError.res.statusCode);
                    uni.hideLoading();
                    setBUG({content: JSON.stringify(objError)});
                    uni.redirectTo({
                        url: "/pages/common/error/error?type=提交错误:" + objError.res.statusCode
                    });
                    resolve(objError)
                    break;
                case 'error':
                    uni.hideLoading();
                    uni.getNetworkType({
                        success: function(resNetwork){
                            if(resNetwork.networkType == 'none'){
                                console.log("network: 当前没有网络");
                                uni.redirectTo({
                                    url: "/pages/common/error/error?type=当前没有网络"
                                });
                            }else{
                                console.log("error: app错误:" + objError.res);
                                setBUG({content: JSON.stringify(objError)});
                              /*  uni.redirectTo({
                                    url: "/pages/common/error/error?type=网络错误,请尝试重启软件"
                                }); */
                            }
                        }
                    })
                    break;
            }
        });
    } catch (error) {
        throw new Error(error)
    }
}