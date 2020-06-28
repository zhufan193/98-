<template>
	<view style="display: flex;flex-direction:row ;">
		<picker @change="optionPickerChange" :value="index" :range="option" @click="upDown">
		   <view style="background-color: #ffffff;" class="uni-input"><text :class="[ispump ? 'pump' : 'unpump']">{{option[index]}}</text></view>
	   </picker>
	   <view v-if="show">
		   <image   mode="aspectFit" src="@/static/img/up.jpg">
		   </image>
	   </view>
	   <view v-if="isshow" >
		   <image  mode="aspectFit" src="@/static/img/down.jpg">
		   </image>
	   </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0,
				ispump:false,
				isshow:true,
				show:false
			}
		},
		props:{
			option:''
		},
		methods: {
			optionPickerChange:function(e){
				this.index=e.target.value;
				this.$emit('greet',this.index);
				this.isshow=!this.isshow;
				this.show=!this.show;
				if(this.index != 0){
					this.ispump=true;
				}else{
					this.ispump=false;
				}
			},
			upDown(){
				this.isshow=!this.isshow;
				this.show=!this.show;
			}
		}
	}
</script>

<style>
	.pump{
		color: #007AFF;
	}
    .unpump{
		color:#484848;
	}
	image{
		width: 40upx;height: 40upx;margin-top: 20upx;
	}
</style>
