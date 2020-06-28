<template>
	<view class="page">
		<rich-text class="article__rich" :nodes="strings"></rich-text>
	</view>
</template>

<script>
    import { toast, localStorage, format } from '@/common/util.js';
    import { getAppArticle, getBannerDetail } from '@/service/getData.js';
    
	export default {
		data() {
			return {
				strings: ''
			}
		},
        onLoad(options) {
            if(options && options.title){
                uni.setNavigationBarTitle({
                    title: options.title
                });
            }
            if(options && options.type){
                // app相关文章信息获取
                getAppArticle(options.type).then(res => {
                    uni.setNavigationBarTitle({
                        title: res.data.type
                    });
                    // 匹配img scr添加地址前缀
                    const imgBaseURL = localStorage.getStore('fileBaseUrl');
                    // 正则表达式修改img样式
                    res.data.content = format.replace(res.data.content, imgBaseURL);
                    this.strings = res.data.content;
                });
            }else if(options && options.id){
                getBannerDetail(options.id).then(res => {
                    uni.setNavigationBarTitle({
                        title: res.data.name
                    });
                    // 匹配img scr添加地址前缀
                    const imgBaseURL = localStorage.getStore('fileBaseUrl');
                    // 正则表达式修改img样式
                    res.data.content = format.replace(res.data.content, imgBaseURL);
                    this.strings = res.data.content;
                });
            }else{
                toast.show('参数不全');
            }
        }
	}
</script>

<style>
    .dsg{
        text-indent: 2em;
    }
    
    .page{
        background-color: #fff;
    }
</style>
