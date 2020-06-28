// ajax
function commonAjax(type, url, data, sfun, efun = function(err){toast.showWarn('接口错误-' + err.status);}){
  $.ajax({
    type: type,
    url: baseUrl + url,
    headers:{
        'Accept':'application/json',
        'Authorization':'Bearer ' + token
    },
    data: data,
    dataType: 'json',
    success: function(res){
      sfun(res);
    },
    error: function(err){
      console.log(JSON.stringify(err));
      efun(err);
      // box.html('<div class="page-info">网络错误，请退出后再次尝试。</div>')
    }
  })
}

function getAjax(url, data, fun){
  commonAjax('GET', url, data, fun)
}

function postAjax(url, data, fun){
  commonAjax('POST', url, data, fun)
}

// 函数防抖
function debounce(fn, wait = 300, delay = false) {
  let timer;

  return function () {
      var that = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      if (delay) {
          var callNow = !timer;
          timer = setTimeout(() => {
              timer = null;
          }, wait)
          if (callNow) fn.apply(that, args)
      }
      else {
          timer = setTimeout(function(){
              fn.apply(that, args)
          }, wait);
      }
  }
}