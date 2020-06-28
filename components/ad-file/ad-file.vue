<template>
	<view>
		<view  v-for="(item,index) in goList" :key="index">
			<view class="head-content">
				<view class="head-name">{{outinharbor}}{{index+1}}</view>
				<view class="content-download" > 点击这里选择你要上传的合同文件</view>
			</view>
		</view>
		<view class="form__cell">
			<view class="form__label" @click="addHarbor" v-if="adHarbor" style="color: #004590;">
				<image style="width: 30upx;height: 30upx;margin-right: 5upx;" src="@/static/img/add.png"></image>增加图片
			</view>
			<view class="form__label" @click="deleteHarbor" v-if="deHarbor" style="text-align: right;color: #fd2c10;">
			   <image style="width: 30upx;height: 30upx;margin-right: 5upx;" src="@/static/img/del.png"></image>删除图片
			</view>
		</view> 

	</view>
</template>

<script>
	export default {
	    components: {
	      
	    },
		props:{
			outinharbor:''
		},
		data() {
			return {
				index:1,//
				adHarbor:true,
				deHarbor:false,
				goList:[{
				  isout:true,
				  adder:''
				}],
			};
		},
		methods:{
			addHarbor:function(e){
				let list={
					isout:true,
					adder:''
				}
				this.goList.push(list);
				this.index++;
				if(this.index == 5) {
					this.adHarbor=false;
				}
				if(this.index == 2){
					this.deHarbor=true;
				}
			},
			deleteHarbor:function(e){
				console.log(this.index)
				let index = this.index
				this.goList.splice(index-1,1);
				this.index--;
				if(this.index==1){ 
					this.deHarbor=false;
				}
				if(this.index < 5){
					this.adHarbor=true;
				}
			},
			go:function(e){
				console.log(this.index);
			},


		
			
		},
		}
	   
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    @import '@/style/page/card.scss';
    @import '@/style/page/empty.scss';
    @import '@/style/page/foot.scss';
    @import '@/style/page/drawer.scss';
    .head-content{
    	display: flex;
    	flex-direction: row;
    	border-bottom: 1upx solid #dcdcdc;
    	.head-name{
    		font-size: 30upx;
    		width: 20%;
    		text-align: right;
    	}
    	.content-download{
    		color: #ffffff;
    		background-color: #2587ff;
    		border: 1upx solid #2587ff;
    		border-radius: 10upx;
    		padding: 10upx;
    		position: absolute;
    		right: 20upx;
    		margin-top: -8upx;
    	}
    }
</style>

