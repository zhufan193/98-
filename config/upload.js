/*
 * =========================================================
 * 文件上传
 * 
*/

import errorLog from './errorLog'
import {localStorage} from '../common/util'

const csrfConfig = {
    'Accept':'application/json',
    'content-type':'multipart/form-data'
};

export default (url = '', file, name, data = {}) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadTask = uni.uploadFile({
                header: csrfConfig,
                url: localStorage.getStore('baseUrl') + url, 
                filePath: file,
                name: name,
                formData: data,
                success: (requestObj) => {
                    if (requestObj.statusCode == 200) {
                        let obj = requestObj.data;
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        if(obj.status==1){
                            resolve(obj);
                        }else{
                            errorLog({type:"status",data:obj}).then((res)=>{
                                reject(res.data);
                            });
                        }
                    } else {
                        errorLog({type:"statusCode",data:requestObj}).then((res)=>{
                            reject(res);
                        });
                    }
                },
                fail: (error) => {
                    errorLog({type:"error",data:error}).then((res)=>{
                        reject(res);
                    });
                }
            });
            uploadTask.onProgressUpdate((res) => {
                uni.showLoading({
                    title: '上传进度:' + res.progress + '%',
                    mask: true
                });
            });
        })
    } catch (error) {
        throw new Error(error)
    }
}