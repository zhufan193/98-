function formateDate(now){
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期

    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;

    var time = year + "-" + month + "-" + date;
    return time;
}

function formatTime(now,first) {
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
　　     var MS = now.getMilliseconds();//获取毫秒
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    
    if(first==true){
        hour = "00";
        minu = '00';
    } else {
        if (minu < 10){
            minu = '00';
        } else if (minu < 20){
            minu = 10;
        } else if (minu < 30){
            minu = 20;
        } else if (minu < 40){
            minu = 30;
        } else if (minu < 50){
            minu = 40;
        } else if (minu < 60){
            minu = 50;
        }
    }

    if (sec < 10) sec = "0" + sec;
    if (MS < 100)MS = "0" + MS;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    // time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec + " " + week;
    time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
    return time;
  }

  Date.prototype.Format = function(fmt){
    var o = {
        "M+": this.getMonth()+1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if(/(y+)/.test(fmt)){
        //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
        fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    }
    for(var k in o){
        if (new RegExp("(" + k +")").test(fmt)){
            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};