<template>
	<view class="collapse">
		<view class="collapse__title" @click="_clickTitle">
		    {{title}}
            <template v-if="active_index == -1 && active_name === '' && mode != 'date'">
                <uni-icons :type="arrowType !== '' ? arrowType : isOpen ? 'arrowup' : 'arrowdown'" size="16" color="#999"></uni-icons>
            </template>
		</view>
        <template v-if="mode === 'slot'">
            <view class="collapse__content" v-show="active_name !== ''">
                <view class="collapse__item--small collapse__item--active" @click="_clearItem()">
                    {{active_name}}
                </view>
            </view>
            <view class="collapse__content--slot" v-show="isOpen">
                <slot />
            </view>
        </template>
        <template v-if="mode === 'select'">
            <view class="collapse__content" v-show="active_index != -1">
                <view class="collapse__item--small collapse__item--active" @click="_clearItem()">
                    {{active_index != -1 ? options[active_index].name : ''}}
                </view>
            </view>
            <view class="collapse__content" v-show="isOpen">
                <block v-for="(item, index) of options" :key="index">
                    <view class="collapse__item--small" @click="_clickItem(index)">
                        {{item.name}}
                    </view>
                </block>
            </view>
        </template>
        <template v-if="mode === 'multi-select'">
            <view class="collapse__content" v-show="isOpen">
                <block v-for="(item, index) of options" :key="index">
                    <view class="collapse__item--small" :class="{'collapse__item--active': item.checked}" @click="_clickMultiItem(index)">
                        {{item[keyName]}}
                    </view>
                </block>
            </view>
        </template>
        <template v-if="mode === 'text'">
            <view class="collapse__content--text">
                <view class="collapse__col">
                    <input class="collapse__input" type="number" :value="min_Input" @input="_changeMinText" @focus="_focus" @blur="_blur" :placeholder="'最低' + placeholderTxt" placeholder-style="color: #999;"/>
                </view>
                -
                <view class="collapse__col">
                    <input class="collapse__input" type="number" :value="max_Input" @input="_changeMaxText" @focus="_focus" @blur="_blur" :placeholder="'最高' + placeholderTxt" placeholder-style="color: #999;"/>
                </view>
            </view>
            <view class="collapse__content" v-show="isOpen">
                <block v-for="(item, index) of options" :key="index">
                    <view class="collapse__item" @click="_clickText(item.value)">
                        {{item.name}}
                    </view>
                </block>
            </view>
        </template>
        <template v-if="mode === 'date'">
            <view class="collapse__content--text">
                <view class="collapse__col">
                    <picker mode="date" :value="date" @change="_changeMinDate">
                        <view class="collapse__input" :class="{'collapse__input--disabled': min_Input == ''}">
                            {{min_Input ? min_Input : '选择开始时间'}}
                        </view>
                    </picker>
                </view>
                -
                <view class="collapse__col">
                    <picker mode="date" :value="date" @change="_changeMaxDate">
                        <view class="collapse__input" :class="{'collapse__input--disabled': max_Input == ''}">
                            {{max_Input ? max_Input : '选择结束时间'}}
                        </view>
                    </picker>
                </view>
            </view>
        </template>
	</view>
</template>

<script>
    import uniIcons from '../uni-icons/uni-icons.vue';
    import { dateUtils } from '@/common/util.js';
    
	export default {
        components: {
            uniIcons
        },
        props: {
            mode: { // select: 默认，选择列表、text:选择列表带输入框、date：时间选择
                type: String,
                default: 'select'
            },
            type: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            options: {
                type: Array,
                default: function(){
                    return [];
                }
            },
            activeIndex: {
                type: Number,
                default: -1
            },
            activeName: {
                type: String,
                default : ''
            },
            inputDefault: {
                type: String,
                default: ''
            },
            open: {
                type: Boolean,
                default: false
            },
            arrowType: {
                type: String,
                default: ''
            },
            keyName: {
                type: String,
                default: 'name'
            },
            placeholderTxt: {
                type: String,
                default: '范围'
            }
        },
		data() {
			return {
                isOpen: false,
                data: [],
                active_index: -1,
                active_name: '',
                min_Input: '',
                max_Input: '',
                date: dateUtils.formatStr('yyyy/MM/dd')
			};
		},
        watch:{
            activeIndex(val){
                this.active_index = val;
            },
            activeName(val){
                this.active_name = val;
            },
            inputDefault(val){
                let obj = val.split(',');
                if(obj.length === 2){
                    this.min_Input = obj[0];
                    this.max_Input = obj[1];
                }else{
                    this.min_Input = '';
                    this.max_Input = '';
                }
            },
            open(val){
                this.isOpen = val;
            }
        },
		created() {
			this.isOpen = this.open
		},
        methods: {
            _clickTitle() {
// console.log(this.options)
                if(this.active_index == -1 && this.active_name === ''){
                    this.$emit('click', {value: this.type, type: 'title'});
                    this.isOpen = !this.isOpen;
                }
            },
            _clickItem(index) {
                this.active_index = index;
                this.isOpen = false;
                this._change(this.type, index);
            },
            _clickMultiItem(index) {
                this._change(this.type, index);
            },
            _clearItem() {
                this.active_index = -1;
                this._change('clear', this.type);
            },
            _clickText(value) {
                let obj = value.split(',');
                this.min_Input = obj[0];
                this.max_Input = obj[1];
                this.isOpen = false;
				this._change(this.type, value);
            },
            _changeMinText(value){
                this.min_Input = value.target.value;
                this._change(this.type, this.min_Input + ',' + this.max_Input);
            },
            _changeMaxText(value){
                this.max_Input = value.target.value;
                this._change(this.type, this.min_Input + ',' + this.max_Input);
            },
            _changeMinDate(value){
                this.min_Input = value.target.value;
                this._change('date', this.min_Input + ',' + this.max_Input);
            },
            _changeMaxDate(value){
                this.max_Input = value.target.value;
                this._change('date', this.min_Input + ',' + this.max_Input);
            },
            _focus(e) {
				this.$emit('focus', { name: this.type, value: e });
            },
            _blur(e){
				this.$emit('blur', { name: this.type, value: e });
            },
            _change(type, value){
				this.$emit('change', {value: value, type: type});
            }
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';
    @import '@/style/mixin/hr.scss';
    
    .collapse{
        position: relative;
        
        &::after{
            @include hr(bottom);
        }
        
        &__title{
            @include flex(between, center);
            height: 38px;
            padding: 0 $uni-spacing-row-base;
            font-size: $uni-font-size-base;
            color: $color-grey;
        }
        
        &__content{
            @include flex(null, null, null, wrap);
            padding: 0 $uni-spacing-row-base;
            
            &--text{
                @include flex(between, center);
                padding: 0 $uni-spacing-row-base $uni-spacing-col-base;
            }
            
            &--slot{
                @include flex(null, null, column);
            }
        }
        
        &__item{
            width: (650upx - $uni-spacing-row-base * 4) / 3;
            line-height: $uni-font-size-base;
            padding: $uni-spacing-col-base 0;
            margin: 0 $uni-spacing-row-sm $uni-spacing-col-base 0;
            text-align: center;
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
            background-color: $uni-bg-color-grey;
            border-radius: $uni-border-radius-sm;
            
            &--small{
                position: relative;
                box-sizing: border-box;
                min-width: 20%;
                line-height: $uni-font-size-base;
                padding: $uni-spacing-col-sm $uni-spacing-row-base;
                margin: 0 $uni-spacing-row-base $uni-spacing-col-base 0;
                text-align: center;
                font-size: $uni-font-size-sm;
                color: $uni-text-color;
                background-color: $uni-bg-color-grey;
                border-radius: $uni-border-radius-sm;
            }
            
            &:nth-child(3n){
                margin-right: 0;
            }
            
            &--active{
                width: initial;
                background-color: $color-main;
                color: #fff;
                padding: $uni-spacing-col-sm 14px $uni-spacing-col-sm $uni-spacing-row-sm;
                
                &::after{
                    content: "x";
                    display: block;
                    position: absolute;
                    top: 0;
                    right: $uni-spacing-row-sm;
                    color: #fff;
                    line-height: 1;
                }
            }
        }
        
        &__col{
            @include flex-self(keep);
            width: 45%;
            padding: $uni-spacing-col-sm 0;
        }
        
        &__input{
            width: 100%;
            height: 32px;
            line-height: 32px;
            min-height: inherit;
            text-align: center;
            font-size: 12px;
            color: $uni-text-color;
            background-color: $uni-bg-color-grey;
            border-radius: $uni-border-radius-sm;
            
            &--disabled{
                color: #999;
            }
        }
    }
</style>
