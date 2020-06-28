<template>
	<view class="page">
		<view class="card">
			<view class="card form__list" style="border-bottom: 1rpx solid #e6e6e6;">
				<view class="form__cell">
					<view class="form__label">举报内容</view>
					<picker mode="selector" :range="reportArray" range-key="name" :value="reportIndex" @change="_changeReport">
						<view :class="reportIndex != 0 ? 'form__field' : 'form__note'">{{ reportIndex != 0 ? reportArray[reportIndex].name : '点击选择' }}</view>
					</picker>
				</view>
			</view>

			<view class="card__content">
				<textarea
					class="form__textarea"
					style="height: 300rpx;"
					maxlength="150"
					v-model="sendDate.content"
					placeholder="请简明的描述您的投诉信息，方便工作人员更好的核实"
					placeholder-style="color: #999;"
				/>
			</view>
		</view>
		<view class="foot"><button class="foot__btn" type="primary" @click="sendBtn">提交</button></view>
	</view>
</template>

<script>
import { toast } from '@/common/util.js';
import { postComplaint } from '@/service/getData.js';
import { mapState, mapActions } from 'vuex';

export default {
	onLoad(options) {
        if(options && options.method){
            this.sendDate.method = options.method;
        }
        // console.log(options);
		this._getSelect();
	},
	computed: {
		...mapState(['dictionaryTempData'])
	},
	data() {
		return {
			reportArray: [{ name: '请选择' }],
			reportIndex: 0,
			sendDate: {
                method: '',
				content: '',
				type_id: ''
			}
		};
	},
	methods: {
		...mapActions(['getReportType']),
		async _getSelect() {
			toast.loading();
            if(!this.dictionaryTempData.hasOwnProperty('report_type') || !this.dictionaryTempData.report_type.length){
                await this.getReportType();
            }
			this.reportArray = this.reportArray.concat(this.dictionaryTempData.report_type);
			toast.hideLoading();
		},
		_changeReport(e) {
			this.reportIndex = e.target.value;
            if(this.reportIndex == 0){
                this.sendDate.type_id = '';
            }else{
                this.sendDate.type_id = this.reportArray[this.reportIndex].id;
            }
		},
		sendBtn() {
			//发送反馈
			if (this.sendDate.type_id == '') {
				toast.show('请选择一个类型');
				return;
			}
			if (this.sendDate.content == '') {
				toast.show('内容不能为空');
				return;
			}
			postComplaint(this.sendDate).then(
				res => {
					toast.hideLoading();
					uni.showModal({
						title: '提交成功',
						content: res.message ? res.message : '提交成功！',
						showCancel: false,
						success: function() {
							uni.navigateBack();
						}
					});
				},
				error => {
					toast.show(error.message);
					return;
				}
			);
		}
	}
};
</script>

<style lang="scss">
@import '@/style/page/card.scss';
@import '@/style/page/form.scss';
@import '@/style/page/foot.scss';
</style>
