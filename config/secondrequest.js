import { initUrl } from './env';
import { secondUrl } from './env';
import errorLog from './errorLog';
import { localStorage } from '@/common/util';

export default (data = {}, type = 'GET') => {
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
			url=secondUrl;
            /* if(path == 'init' || !baseUrl){ // app启动判断登录
                url = initUrl;
            }else{     
                url = baseUrl;
            } */
// console.log(url+path,data)
   console.log(secondUrl);
   console.log(initUrl);
            uni.request({
                url: url,
                data: data,
                header: csrfConfig,
                method: type.toUpperCase(),
				complete: (res) => {
     
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
                 
                            resolve(requestObj);
                
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