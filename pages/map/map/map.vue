<template>
	<view class="page">
		<map id="cMap" 
            :style="{height: height == 0 ? '100%' : height + 'px'}"
            longitude="116.221175" 
            latitude="29.051373"
            scale="5" 
            :markers="markers" 
            :polyline="polyline" 
            :controls="controls" 
            @markertap="_markertap"
            @callouttap="_callouttap"
            @controltap="_controltap"
            @tap="_maptap"></map> 
	</view>
</template>
<!--  -->
<script>
    import { toast } from '@/common/util.js'
	import { getMapMarkers, getPortList, getShip } from '@/service/getData';
    
    var _map;
    
	export default {
		data() {
			return {
                pixelRatio: '2', // 设备像素比
                height: '0',
                width: '0',
                marker: null,   // 关注点active
                markers: [],    // 船只点
                polyline: [],   // 线路
                controls: [     // 控件参数
                    {
                        id: 0,
                        position:{
                            left: 16,
                            width: 44,
                            height: 44
                        },
                        iconPath: '/static/icon/location.png',
                        clickable: true
                    },
                    {
                        id: 1,
                        position:{
                            width: 44,
                            height: 44
                        },
                        iconPath: '/static/icon/map_add.png',
                        clickable: true
                    },
                    {
                        id: 2,
                        position:{
                            width: 44,
                            height: 44
                        },
                        iconPath: '/static/icon/map_minus.png',
                        clickable: true
                    },
                ],
                old: {
                    longitude: '116.221175',
                    latitude: '29.051373',
                    scale: 5
                },
                upIcon: 1
			};
		},
        methods: {
            addPortMarker() {
                let that = this;
                // 获取港口数据
                getPortList({type:'port'}).then(res => {
                    for(let i = 0, len = res.data.length; i < len; i++){
                        let _marker = new plus.maps.Marker(new plus.maps.Point(res.data[i].longitude,res.data[i].latitude));
                        _marker.setIcon("/static/img/logo.png");
                        _marker.setLabel(res.data[i].name);
                        _marker.onclick = function(resMarker){
                            resMarker.bringToTop();
                            that.moveMarker(res.data[i].longitude, res.data[i].latitude, 'port');
                            // getPort({id: res.result.data[i].id}).then(resPort => {
                            //     if(resPort.status == 1){
                            //     }
                            // })
                        }
                        _map.addOverlay(_marker);
                    }
                });
            },
            addShipMarker(sid = 0) {
                // 获取船舶数据
                getMapMarkers({type: 'ship', sid: sid}).then(res => {
                    for(let i = 0, len = res.result.data.length; i < len;i++){
                        this.markers.push({
                            id: i,
                            longitude: res.result.data[i].longitude,
                            latitude: res.result.data[i].latitude,
                            iconPath: '/static/icon/map_port.png',
                            anchor: {x: 0.5, y: 0},
                            rotate: res.result.data[i].rotate,
                            sid: sid    // 船只id
                        })
                    }
                });
            },
            moveMarker(lon, lat, type = 'ship') {
                let point = new plus.maps.Point(lon, lat);
                let imgUrl = '/static/icon/map_ship_active.png';
                if(type == 'port'){
                    imgUrl = '/static/icon/map_port_active.png';
                }
                if(this.marker == null){
                    this.marker = new plus.maps.Marker(point);
                    this.marker.setIcon(imgUrl);
                    this.marker.bringToTop();
                    _map.addOverlay(this.marker);
                }else{
                    this.marker.setIcon(imgUrl);
                    this.marker.setPoint(point);
                    this.marker.bringToTop();
                    this.marker.show();
                }
            },
            addBubble(obj){
                console.log(JSON.stringify(obj))
                let bubble = new plus.maps.Bubble("加载中...");
                bubble.setIcon('/static/img/logo.png');
                this.marker.setBubble(bubble, true);
            },
            _markertap(e) {
                this.moveMarker(this.markers[e.markerId].longitude, this.markers[e.markerId].latitude);
                // if(this.markers[e.markerId].hasOwnProperty('data')){
                // }else{
                //     getShip({id: this.markers[e.markerId].sid}).then(res => {
                //         if(res.status === 1){
                //             this.markers[e.markerId].data = res.result.data;
                //             this.moveMarker(this.markers[e.markerId].longitude, this.markers[e.markerId].latitude);
                //         }
                //     })
                // }
            },
            _callouttap(e) {
                console.log('点击marker气泡')
                console.log(e)
            },
            _controltap(e) {
                // #ifdef APP-PLUS
                if(e.controlId == 0){
                    _map.getUserLocation( function ( state, point ){
                        if( 0 == state ){
                            _map.setCenter(point);
                        }else{
                            toast.show( "无法获取位置，请确认是否打开定位!" );
                        }
                    });
                }else if(e.controlId == 1){
                    if(this.old.scale < 18){
                        this.old.scale ++;
                        _map.setZoom(this.old.scale);
                    }
                }else if(e.controlId == 2){
                    if(this.old.scale > 3){
                        this.old.scale --;
                        _map.setZoom(this.old.scale);
                    }
                }
                // #endif
            },
            _maptap(e){
                if(this.marker){
                    this.marker.hide();
                }
            }
        },
        onLoad() {
            uni.setNavigationBarColor({
            	frontColor: "#000000",
            	backgroundColor: "#F8F8F8"
            });
            const systemInfo = uni.getSystemInfoSync();
            this.pixelRatio = systemInfo.pixelRatio;
            this.height = systemInfo.windowHeight;
            this.width = systemInfo.windowWidth;
            this.controls[0].position.top = this.height - 94;
            this.controls[1].position.top = this.height - 154;
            this.controls[1].position.left = this.width - 60;
            this.controls[2].position.top = this.height - 94;
            this.controls[2].position.left = this.width - 60;
        },
        onReady() {
            // #ifdef APP-PLUS
            _map = uni.createMapContext('cMap', this).$getAppMap();
            _map.showUserLocation(true);
            // 监听地图变化
            let that = this;
            _map.onstatuschanged = function(e) {
                // if(that.upIcon == that.old.upIcon){
                    // if(e.zoom>9){
                    //     that.upIcon = 2
                    // }else{
                    //     that.upIcon = 1
                    // }
                    // let markers = that.markers;
                    // for(let i = 0, len = markers.length; len > i ; i++){
                    //     console.log(e.zoom + ':' + that.upIcon + ':' + i)
                    //     markers[i].iconPath = '/static/icon/ship_zoom' + that.upIcon + '.png';
                    // }
                    // that.markers = markers;
                // }
            }
            this.addPortMarker();
            this.addShipMarker();
            // #endif
        },
        onUnload(){
            // 销毁地图
            _map.close();
        }
	}
</script>

<style lang="scss">
    page, .page, map{
        height: 100%;
        width: 750upx;
    }
</style>
