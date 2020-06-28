<template>
	<view class="page">
	</view>
</template>

<script>
    var _map;
    
	export default {
		data() {
			return {
                height: 0,
                width: 0,
                pixelRatio: 2,
				scale: 5,
                controls: [
                    
                        {
                            id: 0,
                            position:{
                                left: 10,
                                bottom: 40,
                                width: 36,
                                height: 36
                            },
                            iconPath: '/static/icon/location.png',
                            clickable: true
                        },
                ]
			}
		},
        onLoad() {
            const systemInfo = uni.getSystemInfoSync();
            this.pixelRatio = systemInfo.pixelRatio;
            this.height = systemInfo.windowHeight;
            this.width = systemInfo.windowWidth;
            this.createMap();
            // let that = this;
            // if(!_map){
            //     _map = plus.maps.create('map', {
            //         top:'0px',
            //         left:'0px',
            //         width: that.width + 'px',
            //         height: that.height + 'px',
            //         position: 'static'
            //     });
            //     plus.webview.currentWebview().append(_map);
            // }
        },
		methods: {
			_controltap(){
                this.scale ++;
            },
            createMap:function(){
				var that = this;
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				var currentWebview = page.$getAppWebview();
				// this.mapPcenter = new plus.maps.Point(this.longitude,this.latitude);
				this.map = plus.maps.create("map", {
					top:'0',
					left:'0',
                    width: that.width + 'px',
					height: that.width + 'px',
					position: 'static'
				});
				// 当前位置显示
				this.map.showUserLocation( true );
				// 缩放按钮显示
				this.map.showZoomControls( true );
				// 创建移动点
// 				this.mapMarker = new plus.maps.Marker(this.mapPcenter);
// 				this.mapMarker.setIcon("/static/img/icon/locationMy.png");
// 				this.map.addOverlay(this.mapMarker);
				// 地图变化触发
				// this.map.onstatuschanged = function( e ){
				// 	that.my=true;
				// 	var point = new plus.maps.Point(e.center.longitude,e.center.latitude);
				// 	plus.maps.Map.reverseGeocode(point,{},function(event){
				// 		that.maskData.tel = event.address;
				// 	});
				// 	// that.mapMarker.setPoint(point);
				// }
				// 向地图添加商铺
				for(var i = 0; i < 100; i++){
					this.createMarker(i);
				}
				currentWebview.append(this.map);
				// this.mapMarker = new plus.nativeObj.View(
				// 	"",
				// 	{top:(that.heightMap/2-24) + 'px',left:(that.widthMap/2-12)+'px',height:'24px',width:'24px'},
				// 	[{tag:'img',id:'img',src:'/static/img/icon/locationMy.png',position:{top:'0px',left:'0px',width:'100%',height:'100%'}}]
				// );
				// currentWebview.append(this.mapMarker);
			},
            createMarker(index) {
                var marker = new plus.maps.Marker(new plus.maps.Point(Math.random() * 180,Math.random() * 90));
				marker.setIcon("/static/img/logo.png");
				this.map.addOverlay(marker);
            }
		}
	}
</script>

<style>
    page, .page{
        height: 100%;
    }
</style>
