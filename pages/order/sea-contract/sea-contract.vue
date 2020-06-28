<template>
	<view class="page">
		<rich-text class="article__rich" :nodes="strings"></rich-text>
	</view>
</template>

<script>
    import { toast, localStorage, format } from '@/common/util.js';
    import { getOrderSeaContract } from '@/service/getData.js';
    
	export default {
		data() {
			return {
				strings: ''
			}
		},
        onLoad(options) {
            if(options && options.order_id && options.id){
                toast.loading();
                getOrderSeaContract({order_id: options.order_id, id: options.id}).then(res => {
                    toast.hideLoading();
                    if(res.data.content){
                        // 匹配img scr添加地址前缀
                        const imgBaseURL = localStorage.getStore('fileBaseUrl');
                        // 正则表达式修改img样式
                        res.data.content = format.replace(res.data.content, imgBaseURL);
                        this.strings = res.data.content;
                    }
                });
            }
        },
		methods: {
			
		}
	}
</script>

<style>
    
    .page{
        background-color: #fff;
    }

</style>
