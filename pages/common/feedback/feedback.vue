<template>
	<view class="page">
        <view class="card">
            <view class="card__head">
                <view class="card__title">
                    意见建议
                </view>
                <!-- <view class="card__helper" @tap="chooseMsg">
                    快速键入
                </view> -->
            </view>
            <view class="card__content">
                <textarea class="form__textarea" maxlength="150" v-model="sendDate.content" placeholder="感谢您对我们提出的宝贵意见建议，您的每一条建议我们都会非常重视!" placeholder-style="color: #999;"/>
            </view>
        </view>
        
        <view class="card form__list">
            <view class="form__cell">
                <view class="form__label">您的姓名</view>
                <input class="formInput__field formInput__field--right" type="text" v-model="sendDate.contact" placeholder="请输入姓名" placeholder-style="color: #999;"/>
            </view>
            <view class="form__cell">
                <view class="form__label">联系电话</view>
                <input class="formInput__field formInput__field--right" type="number" v-model="sendDate.phone" placeholder="请输入联系电话" placeholder-style="color: #999;"/>
            </view>
        </view>
        
        <view class="foot">
            <button class="foot__btn" type="primary" @click="sendBtn">提交</button>
        </view>
    </view>
</template>



<script>

import {toast} from '@/common/util.js';
import {postFeedback} from '@/service/getData.js';

    export default {
        data() {
            return {
                // msgContents: ["界面显示错乱", "启动缓慢，卡出翔了", "UI无法直视，丑哭了", "偶发性崩溃"],
                sendDate: {
                    content: "",
                    contact: '',
                    phone: ''
                }
            }
        },
        methods: {
            // chooseMsg() { //快速输入
            //     uni.showActionSheet({
            //         itemList: this.msgContents,
            //         success: (res) => {
            //             this.sendDate.content = this.msgContents[res.tapIndex];
            //         }
            //     })
            // },
            sendBtn() { //发送反馈
			   if (this.sendDate.content == '')
			   {
				   toast.show('内容不能为空')
				   return
			   }
			   postFeedback(this.sendDate).then(res => {
				   toast.hideLoading();
				   uni.showModal({
				   	title: '发布成功',
				   	content: res.message ? res.message : '发布成功！',
				   	showCancel: false,
				   	success: function() {
				   		uni.navigateBack();
				   	}
				   });
			   },
			   error => {
				   toast.show(error.message)
				   return
				   }
			   )
            }
        }
    }
</script>

<style lang="scss">
    @import '@/style/page/card.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/foot.scss';
    
</style>
