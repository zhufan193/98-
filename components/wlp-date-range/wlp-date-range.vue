<template>
	<view class="dateRange" v-show="show">
        <view class="dateRange__main">
            <view class="dateRange__head">
                <view class="dateRange__btn" @tap="_clickCancel()">
                    取消
                </view>
                <view class="dateRange__title">
                    {{title}}
                </view>
                <view class="dateRange__btn dateRange__btn--primary" @tap="_onConfirm()">
                    确定
                </view>
            </view>
            <view class="dateRange__content">
                <view class="dateRange__nav">
                    <view class="dateRange__item" @click="_month('pre')"><uni-icons type="arrowleft" size="22" color="#999"></uni-icons></view>
                    <view class="dateRange__msg">{{msg}}</view>
                    <view class="dateRange__item" @click="_month('next')"><uni-icons type="arrowright" size="22" color="#999"></uni-icons></view>
                </view>
                <view class="dateRange__row">
                    <block v-for="(item, index) of weekStr" :key="index">
                        <view class="dateRange__week">{{item}}</view>
                    </block>
                </view>
                <view class="dateRange__days">
                    <block v-for="(item, index) of resPreDate" :key="index"><view class="dateRange__day dateRange__gray">{{item}}</view></block>
                    <block v-for="(item, index) of resRefreshDate" :key="index"><view class="dateRange__day" :class="item" @tap="_clickItem(index)">{{index + 1}}</view></block>
                    <block v-for="(item, index) of resNextDate" :key="index"><view class="dateRange__day dateRange__gray">{{index + 1}}</view></block>
                </view>
            </view>
        </view>
        <view class="dateRange__mask" @tap="_hide()"></view>
    </view>
</template>

<script>
    import uniIcons from '../uni-icons/uni-icons.vue';
    
    var dateNew = new Date();
    var day = dateNew.getDate(); // 当前日期
    var month_olypic = [31,29,31,30,31,30,31,31,30,31,30,31]; //闰年每个月份的天数
    var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
    var monthDays = 0; // 月份天数
    
    function daysMonth(year, month){ // 根据年份判断某月有多少天(11,2018),表示2018年12月
        let tmp1 = year % 4;
        let tmp2 = year % 100;
        let tmp3 = year % 400;
        if((tmp1 === 0 && tmp2 !== 0) || tmp3 === 0){
            return month_olypic[month];
        }else{
            return month_normal[month];
        }
    }
    
	export default {
        components: {
            uniIcons
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            startDate: { // 开始时间
                type: Date
            },
            endDate: { // 结束时间
                type: Date
            },
            stopToday: { // 当前时间前不可选
                type: Boolean,
                default: false
            },
            multiSelect:{ // 是否多选
                type: Boolean,
                default: false
            }
        },
        data() {
            return{
                weekStr: ['周日','周一','周二','周三','周四','周五','周六'],
                year: dateNew.getFullYear(),
                month: dateNew.getMonth(),
                startObj: null,
                endObj: null,
                selectStartObj: null,
                selectEndObj: null
            }
        },
        computed:{
            dayStart() { // 根据年月获取当月第一天是周几
                let tmpDate = new Date(this.year, this.month, 1);
                return tmpDate.getDay();
            },
            resPreDate() { // 上月显示
                let days = [];
                let year = this.year;
                let month = this.month - 1;
                if(month < 0){
                    year --;
                    month = 11;
                }
                let monthDaysOld = daysMonth(year, month);
                for(let i = this.dayStart - 1; i >= 0; i--){
                    days.push(monthDaysOld - i);
                }
                return days;
            },
            resDayCurrent() { // 当前时间前不可选
                if(this.stopToday){
                    let year = dateNew.getFullYear();
                    let month = dateNew.getMonth();
                    if(this.year < year || this.year == year && this.month < month){
                        return 99;
                    }else if(this.year === year && this.month === month){
                        return day - 1;
                    }else{
                        return -1;
                    }
                }else{
                    return -1;
                }
            },
            resRefreshDate(){ // 当月显示
                let days = [];
                monthDays = daysMonth(this.year, this.month);
                let date = new Date();
                let dateTime = null, dateStartTime = null, dateEndTime = null;
                let selectShow = false;
                for(let i = 0; i < monthDays; i++){
                    let str = '';
                    if(this.resDayCurrent > i){
                        str += ' dateRange__gray';
                    }
                    if(this.resDayCurrent === i){
                        str += ' dateRange__myDay';
                    }
                    if(!selectShow && dateStartTime === null && this.selectStartObj !== null){
                        date.setFullYear(this.year);
                        date.setMonth(this.month);
                        date.setDate(i + 1);
                        dateTime = date.getTime();
                        date.setFullYear(this.selectStartObj.year);
                        date.setMonth(this.selectStartObj.month);
                        date.setDate(this.selectStartObj.day);
                        dateStartTime = date.getTime();
                        if(dateTime >= dateStartTime){
                            if(this.year === this.selectStartObj.year && this.month === this.selectStartObj.month){
                                str += ' dateRange__first';
                            }
                            selectShow = true;
                        }else{
                            dateStartTime = null;
                        }
                    }
                    if(selectShow && this.selectEndObj !== null){
                        date.setFullYear(this.selectEndObj.year);
                        date.setMonth(this.selectEndObj.month);
                        date.setDate(this.selectEndObj.day);
                        dateEndTime = date.getTime();
                        if(dateTime < dateEndTime){
                            str += ' dateRange__select';
                        }
                        if(this.year === this.selectEndObj.year && this.month === this.selectEndObj.month && this.selectEndObj.day === i + 1){
                            str += ' dateRange__last';
                            selectShow = false;
                        }
                    }
                    days.push(str);
                }
                return days;
            },
            resNextDate() { // 下月显示
                let days = [];
                let num = (this.dayStart + monthDays) % 7;
                days.length = num === 0 ? 0 : (7 - num);
                return days;
            },
            msg(){
                return this.year + '年' + (this.month + 1) + '月';
            },
            title(){
                if(this.selectStartObj === null){
                    return '';
                }else{
                    if(this.selectEndObj === null){
                        return this.selectStartObj.year + '-' + (this.selectStartObj.month + 1) + '-' + this.selectStartObj.day;
                    }else{
                        return this.selectStartObj.year + '-' + (this.selectStartObj.month + 1) + '-' + this.selectStartObj.day + '~' + this.selectEndObj.year + '-' + (this.selectEndObj.month + 1) + '-' + this.selectEndObj.day;
                    }
                }
            },
        },
        methods: {
            _hide() {
                this.$emit('click', {
                    type: 'mask'
                });
            },
            _clickCancel() {
                this.selectStartObj = null;
                this.selectEndObj = null;
                this.$emit('click', {
                    type: 'cancel'
                });
            },
            _onConfirm() {
                this.$emit('click', {
                    type: 'confirm',
                    startDate: this.selectStartObj,
                    endDate: this.selectEndObj
                });
            },
            _clickItem(index) {
                if(this.resDayCurrent > index){
                    return;
                }
                let dateObj = {
                    year: this.year,
                    month: this.month,
                    day: index + 1
                };
                if(this.selectStartObj === null){
                    this.selectStartObj = dateObj;
                }else{
                    if(this.multiSelect){
                        if(this.selectEndObj === null){
                            let date = new Date();
                            date.setFullYear(this.selectStartObj.year);
                            date.setMonth(this.selectStartObj.month);
                            date.setDate(this.selectStartObj.day);
                            let startTime = date.getTime();
                            date.setFullYear(dateObj.year);
                            date.setMonth(dateObj.month);
                            date.setDate(dateObj.day);
                            let endTime = date.getTime();
                            if(startTime > endTime){
                                this.selectEndObj = this.selectStartObj;
                                this.selectStartObj = dateObj;
                            }else{
                                this.selectEndObj = dateObj;
                            }
                        }else{
                            this.selectEndObj = null;
                            this.selectStartObj = dateObj;
                        }
                    }else{
                        this.selectStartObj = dateObj;
                    }
                }
            },
            _month(type) {
                if(type === 'next'){
                    if(this.month >= 11){
                        this.year ++;
                        this.month = 0;
                    }else{
                        this.month ++;
                    }
                }else if(type === 'pre'){
                    if(this.month <= 0){
                        this.year --;
                        this.month = 11;
                    }else{
                        this.month --;
                    }
                }
            },
        }
	}
</script>

<style lang="scss">
    @import '@/style/mixin/flex.scss';

    .dateRange{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;

        &__main{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #fff;
        }
        
        &__content{
            display: flex;
            flex-direction: column;
        }
        
        &__head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #eee;
            height: 44px;
            padding: 0 10px;
        }
        
        &__title{
            color: #333;
        }
        
        &__btn{
            padding: 3px 12px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            color: #333;
            background-color: #fff;
            border-radius: 3px;
            
            &--primary{
                color: #fff;
                background-color: #0091E6;
            }
        }
        
        &__nav{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 44px;
        }
        
        &__item{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 44px;
            height: 44px;
        }
        
        &__msg{
            color: #333;
        }
        
        &__row{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        &__week{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
        }
        
        &__days{
            display: flex;
            flex-wrap: wrap;
        }
        
        &__day{            
            position: relative;
            flex: 1 0;
            min-width: 14%;
            height: 44px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        &__gray{
            color: #bbb;
        }
        
        &__select{
            background-color: #eee;
        }
        
        &__first, &__last{
            color: #fff;
            background-color: #0091E6;
        }
        
        &__first::after{
            display: block;
            content: '起始';
        }
        
        &__last::after{
            display: block;
            content: '结束';
        }
        
        &__day::after{
            position: absolute;
            top: -50%;
            bottom: -50%;
            left: -50%;
            right: -50%;
            content: '';
            border-top: 1rpx solid $uni-border-color;
            border-right: 1rpx solid $uni-border-color;
            transform: scale(.5);
        }
            
        &__day:nth-child(7n)::after{
            border-right: 0;
        }
        
        &__myDay::before{
            position: absolute;
            right: 0;
            top: 0;
            content: '';
            border: 6px solid transparent;
            border-top-color: #FF3333;
            border-right-color: #FF3333;
        }
        
        &__mask{
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.25);
        }
    }
</style>
