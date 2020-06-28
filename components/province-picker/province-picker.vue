<template>
	<view v-if="isgo" class="view-province">
		<view style="display: flex;flex-direction: row;background-color: #ffffff;">
			<view @click="sheng" class="class-text " :class="{'blue':isProvin == true,'white':isProvin == false}" >省</view>
			<view @click="isCity==true" class="class-text" :class="{'blue':isCity == true && isProvin == false,'white':isCity == false}">市</view>
			<image @click="reset" src="@/static/img/cancel.jpg" class="img"></image>
		</view> 
		<view class="font-color">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" style="" class="scroll-Y scroll-cla" @scrolltoupper="upper" @scrolltolower="lower"
			                @scroll="scroll">
				<view v-for="(provin,index) in province" v-if="isProvin" >
					 <view :index="index" @click="turnCity" v-bind:id="index" class="pro-name">{{provin.text}}</view>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y scroll-cla" @scrolltoupper="upper" @scrolltolower="lower"
			                @scroll="scroll">
				<view v-for="(citym,index) in city" v-if="isCity" >
					<view :index="index" @click="submitCity" v-bind:id="index" class="pro-name">{{citym.text}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { cityData3 } from '@/config/citydata.js';
	export default{
		data() {
			return {
				province:'',
				city:'',
				isProvin:true,
				isCity:false,
				prov:'',
				isgo:'',
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			};
		},

		props:{
			isgo:{type:Boolean},
		},
		onLoad(){
			this.isgo=isgo;
			
		},
		mounted(){
			this.province=cityData3;
		},
		methods:{
			turnCity:function(e){
				this.isProvin=!this.isProvin;	
				this.isCity=!this.isCity;
				console.log(e.target.id);
				this.city=this.province[e.target.id].children;
				this.prov=this.province[e.target.id].text;
			},
			submitCity:function(e){
				this.isgo=!this.isgo;
				this.$emit('greet',this.isgo);
				this.prov=this.prov+"-"+this.city[e.target.id].text;
				this.$emit('provinc',this.prov);
			
			},
			reset(){
				this.isgo=false;
				this.$emit('greet',this.isgo);
			},
			sheng(){
				this.isProvin=true;
				this.isCity=false;
			},
			upper: function(e) {
			            console.log(e)
			        },
			        lower: function(e) {
			            console.log(e)
			        },
			        scroll: function(e) {
			            console.log(e)
			            this.old.scrollTop = e.detail.scrollTop
			        },
			        goTop: function(e) {
			            this.scrollTop = this.old.scrollTop
			            this.$nextTick(function() {
			                this.scrollTop = 0
			            });
			            uni.showToast({
			                icon:"none",
			                title:"纵向滚动 scrollTop 值已被修改为 0"
			            })
			        }
		}
	}
</script>

<style>
	.view-province{
		float: left;
		text-align: center;
		margin: auto;
		background-color: #96c4f1;	
		width: 100%;
	}		
	.class-text{
		width: 20%;
		padding: 20upx 40upx;
		margin:5upx 2upx;
		background-color: #ffffff;
		border: 1px;
		border-radius: 10upx;
		font-size: 30upx;
	}	
	.blue{
		background-color: #a2d4ff;
		color: #ffffff;
	}
	.white{
		background-color: #ffffff;
		color: #000000;
	}
	.scroll-cla{
		max-height: 550upx;
		padding-bottom:10upx;
	}
	.pro-name{
		margin: 10upx;
		font-size: 30upx;
	}
	.font-color{
		color: #ffffff;
	}
	.img{
		width: 40upx;
		height: 40upx;
		margin: 20upx 20upx 20upx 185upx;
		}
	
</style>

