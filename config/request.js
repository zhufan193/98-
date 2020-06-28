import { initUrl } from './env';
import errorLog from './errorLog';
import { localStorage } from '@/common/util';

export default (path = '', data = {}, type = 'GET') => {
    try {
        return new Promise((resolve, reject) => {
            let csrfConfig = {
                'Accept': 'application/json',
                'Authorization': localStorage.getStore('loginToken')
            };
            if(type == 'POST'){
                csrfConfig['Content-Type'] = 'application/json';
                 csrfConfig['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            let url = '';
            let baseUrl = localStorage.getStore('baseUrl');
            if(path == 'init' || !baseUrl){ // app启动判断登录
                url = initUrl;
            }else{     
                url = baseUrl;
            }
// console.log(url+path,data)
            uni.request({
                url: url + path,
                data: data,
                header: csrfConfig,
                method: type.toUpperCase(),
				complete: (res) => {
console.log(url+path,data);
 console.log(res);
                    // 记录token
					if(typeof res.header.Authorization != "undefined"){
console.log('更新token');
						localStorage.setStore('loginToken', res.header.Authorization);
					}
					// #ifdef APP-PLUS
					if(typeof res.header['Authorization '] != "undefined"){
console.log('更新token2')
						localStorage.setStore('loginToken', res.header['Authorization ']);
					}
					// #endif
				},
                success: (requestObj) => {
// console.log(requestObj)
                    if (requestObj.statusCode == 200) {
                        let obj = requestObj.data;
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        if(obj.status == 1){
                            resolve(obj);
                        }else{
                            errorLog({type:"status", url: url, path: path, data: data, res: obj}).then((res)=>{
                                reject(res.res);
                            });
                        }
                    } else {
                        errorLog({type:"statusCode", url: url, path: path, data: data, res: requestObj}).then((res)=>{
                            reject(res);
                        });
                    }
                },
                fail: (error) => {
                    console.log('error')
                    console.log(error)
                    errorLog({type:"error", url: url, path: path, data: data, res: error}).then((res)=>{
                        reject(res);
                    });
                }
            });
        });
    } catch (error) {
        throw new Error(error)
    }
}