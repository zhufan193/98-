<template>
	<view>
	<view style="margin-right: 20upx;" v-for="(item,index) in goList" :key="index">
		<view class="form__cell">
		    <view class="form__label"><text class="form__wran">*</text>{{outinharbor}}{{index+1}}</view>
		    <view>
				<view  @click="go"  v-bind:id="index"  v-if="item.isout" style="font-size: 30upx;">选择{{outinharbor}}所在省市</view>
				<view v-if="!item.isout" @click="go"  v-bind:id="index">{{item.provinc}}</view>
			</view></view>
			<province-select  style="font-size:30upx;" :isgo.sync="item.isgo" v-on:greet="_isgo" v-on:provinc="getProvince"></province-select>
		</view>
		
		<view class="form__cell">
			<view class="form__label" @click="addHarbor" v-if="adHarbor" style="color: #004590;">
				<image style="width: 30upx;height: 30upx;margin-right: 5upx;" src="@/static/img/add.png"></image>增加{{outinharbor}}
			</view>
			<view class="form__label" @click="deleteHarbor" v-if="deHarbor" style="text-align: right;color: #fd2c10;">
			   <image style="width: 30upx;height: 30upx;margin-right: 5upx;" src="@/static/img/del.png"></image>删除{{outinharbor}}
			</view>
		</view> 

	</view>
</template>

<script>
	import provinceSelect from '@/components/province-select/province-select.vue';
		
	export default {
	    components: {
	      provinceSelect
	    },
		props:{
			outinharbor:''
		},
		data() {
			return {
				indexa:0,//发出港中定位哪一行
				indexb:1,//统计发出港的行数
				adHarbor:true,
				deHarbor:false,
				goList:[{
				  isout:true,
				  isgo:false,
				  provinc:''
				}],
				
			};
		},
		methods:{
			addHarbor:function(e){
				let list={
					isout:true,
				isgo:false,
				provinc:''
				}
				this.goList.push(list);
				this.indexb=this.indexb+1;
				if(this.indexb==3) {
					this.adHarbor=false;
				}
				if(this.indexb==2){
					this.deHarbor=true;
				}
				
			},
			deleteHarbor:function(e){
				this.goList.splice(this.indexa,1);
				this.indexb=this.indexb-1;
				if(this.indexb==1){ 
					this.deHarbor=false;
					this.adHarbor=true;
				}
			},
			go:function(e){
				console.log(e.target);
				this.goList[e.target.id].isgo=true;
				this.goList[e.target.id].isout=true;
				this.indexa=e.target.id;
				console.log(this.indexa);
			},
			_isgo(isgo){
				this.goList[this.indexa].isgo=isgo;
			},
			getProvince(province){
				this.goList[this.indexa].provinc=province;
				this.$emit('greet',this.goList);
				this.goList[this.indexa].isout=false;
				
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
    
    .page{
        padding: 0 0 44px;
    }
    
    .form__interval{
        @include flex(null, center);
        @include flex-self(keep);
        padding-right: $uni-spacing-row-base;
    }
    
    .formInput__field--interval{
        width: 3em;
        text-align: center;
        font-size:14px;
        padding: 0 $uni-spacing-row-sm;
        color: $uni-text-color-grey;
    }
    
    .formInput__field + picker.form__icon{
        @include flex-self(keep);
    }
    
    .formInput__field + picker.form__icon uni-icons{
        border-left: 1px solid $uni-border-color;
        padding: 0 $uni-spacing-row-base 0 $uni-spacing-row-sm;
    }
    
    /* #ifdef MP */
    uni-popup .uni-mask{
        z-index: 10004;
    }
    
    uni-popup .uni-popup-fixed.uni-popup-middle{
        z-index: 10004;
        padding: 0;
        overflow: hidden;
    }
    
    .popup{
        background-color: #f2f2f2;
        
        &__close{
            position: absolute;
            right: 0;
            top: 0;
        }
        
        &__text{
            color: $uni-text-color;
            font-size: 16px;
            padding: $uni-spacing-col-lg 0;
            text-align: center;
        }
        
        &__input{
            padding: $uni-spacing-col-sm $uni-spacing-row-sm;
            margin: 0 $uni-spacing-row-lg $uni-spacing-col-lg;
            background-color: #fff;
            border: 1rpx solid $uni-border-color;
            border-radius: $uni-border-radius-sm;
        }
        
        &__field{
            width: 100%;
        }
        
        &__bottom{
            position: relative;
            @include flex();
            
            &::after{
                @include hr(top);
            }
        }
        
        &__btn{
            position: relative;
            width: 250rpx;
            height: 40px;
            text-align: center;
            line-height: 40px;
                
            &--confirm{
                color: $color-main;
            }
            
            &::after{
                @include hr(right);
            }
            
            &:last-child::after{
                display: none;
            }
        }
    }
    /* #endif */
</style>

