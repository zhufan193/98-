<template>
	<view class="page" :style="{'height':height+'px'}">
		<view class="title">
		    输入船舶名称或MMSI
		</view>
        <view class="form">
            <view class="form__cell--column">
                <view class="formInput">
                    <input class="formInput__field" type="text" :value="name" @input="_inputName" placeholder="请输入船舶名称" placeholder-style="color:#999" />
                    <view class="uni-icon uni-icon-clear" v-if="showClearUserName" @click="clearIconName"></view>
                </view>
            </view>
            <view class="form__cell--column">
                <view class="formInput">
                    <input class="formInput__field" type="text" :value="mmsi" @input="_inputMmsi" placeholder="请输入MMSI" placeholder-style="color:#999" />
                    <view class="uni-icon uni-icon-clear" v-if="showClearUserMmsi" @click="clearIconMmsi"></view>
                </view>
            </view>
        </view>
        <template v-if="name !== '' || mmsi !== ''">
            <view class="hr">
                查询结果
            </view>
            <view v-if="is_tips == 1" class="tips">
                搜索中...
            </view>
            <view v-if="is_tips == 0" class="tips tips--red">
                未找到该船！<br/>
                请确认该船舶已在该平台认证
            </view>
            <view v-if="is_tips == 2" class="tips">
                存在船“{{ship_name}}”！<br/>
                点击下一步向管理员发起加入申请
            </view>
            <view v-if="is_tips == 3" class="tips">
                {{message}}
            </view>
            <button v-if="is_tips == 2" type="primary" @click="sendBtn()">下一步</button>
        </template>
	</view>
</template>

<script>
    import { router, toast, debounce } from '@/common/util.js';
    import { getShipSearch, postShipJoin } from '@/service/getData.js';
    
	export default {
		data() {
			return {
                height: 0,
                id: null,
				name: '',
                mmsi: '',
                showClearName: false,
                showClearMmsi: false,
                is_tips: 1,
                ship_name: '',
                message: ''
			};
		},
        onLoad() {
			this.height = uni.getSystemInfoSync().windowHeight;
        },
        methods: {
            _inputName(e) {
                let value = e.detail.value;
                if(value == this.name){
                    return;
                }
                if(value == ''){
                    this.id = null;
                    this.name = '';
                    this.showClearName = false;
                }else{
                    this.showClearName = true;
                }
                this._searchChange(this, value, this.mmsi);
            },
            _inputMmsi(e) {
                let value = e.detail.value;
                if(value == this.mmsi){
                    return;
                }
                if(value == ''){
                    this.mmsi = '';
                    this.showClearMmsi = false;
                }else{
                    this.showClearMmsi = true;
                }
                this._searchChange(this, this.name, value);
            },
            clearIconName(){
                this.name = '';
                this.showClearName = false;
            },
            clearIconMmsi(){
                this.mmsi = '';
                this.showClearMmsi = false;
            },
            _searchChange: debounce((vm, name, mmsi) => { // 防抖动搜索
                if(name !== '' || mmsi !== ''){
                    vm.is_tips = 1;
                    vm.name = name;
                    vm.mmsi = mmsi;
                    vm.getData();
                }else{
                    vm.id = null;
                    vm.name = '';
                    vm.mmsi = '';
                }
            }, 1000, false),
            getData(){
                getShipSearch({name: this.name, mmsi: this.mmsi}).then(res => {
                    if(res.data.hasOwnProperty('name') && res.data.name != ''){
                        this.is_tips = 2;
                        this.id = res.data.id;
                        this.ship_name = res.data.name;
                    }else{
                        this.is_tips = 0;
                        this.id = null;
                    }
                });
            },
            sendBtn(){
                toast.loading();
                postShipJoin(this.id).then(res => {
                    toast.hideLoading();
                    uni.showModal({
                        title: '申请加入船舶',
                        content: res.message ? res.message : '提交成功，请联系该船舶管理员通过审核！',
                        showCancel: false,
                        success: function() {
                            uni.navigateBack();
                        }
                    })
                }, err => {
                    this.is_tips = 3;
                    this.message = err.message;
                });
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/page/form.scss';
    
    .page{
        @include flex(null, stretch, column);
        padding: 0 80rpx;
        background: #fff;
    }
    
    .title{
        padding: 67rpx 0;
        font-size: 23px;
        text-align: center;
        color: $uni-text-color;
    }
    
    .hr{
        @include flex(center, center);
        padding: 120rpx 0 22rpx;
        font-size: 12px;
        color: $uni-text-color-grey;
        
        &::before, &::after{
            @include flex-self(full);
            content: '';
            border-top: 1rpx dashed $uni-text-color-grey;
            margin: 0 $uni-spacing-row-sm;
        }
    }
    
    .tips{
        @include flex(null, center, column);
        padding: 40rpx 0;
        font-size: 13px;
        color: $uni-text-color;
        background-color: #FFF7E8;
        border-radius: $uni-border-radius-sm;
        margin-bottom: 80rpx;
    }
    
    button{
        width: 100%;
    }
</style>
