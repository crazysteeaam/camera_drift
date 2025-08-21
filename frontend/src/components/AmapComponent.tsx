import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Relay } from '../config/projectData';
import { getAmapKey, isAmapKeyConfigured, MAP_CONFIG } from '../config/mapConfig';
import './AmapComponent.css';

interface AmapComponentProps {
    relays: Relay[];
    currentRelayId?: number;
    height?: string;
    showRoute?: boolean;
    showAllMarkers?: boolean;
}

const AmapComponent: React.FC<AmapComponentProps> = ({
    relays,
    currentRelayId,
    height = '400px',
    showRoute = true,
    showAllMarkers = true
}) => {
    const [map, setMap] = useState<any>(null);
    const [infoWindow, setInfoWindow] = useState<any>(null);
    const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // 获取高德地图API密钥
    const AMAP_KEY = getAmapKey();

    useEffect(() => {
        if (!mapRef.current) return;

        // 初始化地图
        const initMap = async () => {
            try {
                // 动态加载高德地图API
                const script = document.createElement('script');
                script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=${MAP_CONFIG.PLUGINS.join(',')}`;
                script.async = true;
                
                script.onload = () => {
                    // @ts-ignore
                    const AMap = window.AMap;
                    
                    const map = new AMap.Map(mapRef.current!, {
                        zoom: MAP_CONFIG.DEFAULT_ZOOM,
                        center: MAP_CONFIG.DEFAULT_CENTER,
                        mapStyle: MAP_CONFIG.MAP_STYLE
                    });

                    // 添加控件
                    map.addControl(new AMap.ToolBar());
                    map.addControl(new AMap.Scale());
                    map.addControl(new AMap.HawkEye({isOpen: true}));
                    map.addControl(new AMap.MapType());
                    map.addControl(new AMap.Geolocation());

                    setMap(map);

                    // 创建信息窗体
                    const infoWindowInstance = new AMap.InfoWindow({
                        offset: new AMap.Pixel(0, -30)
                    });
                    setInfoWindow(infoWindowInstance);
                };

                script.onerror = () => {
                    console.error('高德地图API加载失败');
                };

                document.head.appendChild(script);

            } catch (error) {
                console.error('地图初始化失败:', error);
            }
        };

        initMap();
    }, [AMAP_KEY]);

    useEffect(() => {
        if (!map || !relays.length) return;

        // 清除现有标记和路线
        map.clearMap();

        const markers: any[] = [];
        const path: [number, number][] = [];

        // 添加标记点
        relays.forEach((relay, index) => {
            // @ts-ignore
            const AMap = window.AMap;
            
            const marker = new AMap.Marker({
                position: [relay.coordinates.lng, relay.coordinates.lat],
                title: relay.name,
                icon: new AMap.Icon({
                    size: new AMap.Size(32, 32),
                    image: relay.id === currentRelayId 
                        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNFNjQ0NDQiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj57cmVsYXkuaWR9PC90ZXh0Pgo8L3N2Zz4K'
                        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiM0Q0Y1RjAiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj57cmVsYXkuaWR9PC90ZXh0Pgo8L3N2Zz4K',
                    imageSize: new AMap.Size(32, 32)
                }),
                label: {
                    content: relay.id.toString(),
                    direction: 'top',
                    offset: [0, -10]
                }
            });

            // 添加点击事件
            marker.on('click', () => {
                setSelectedRelay(relay);
                if (infoWindow) {
                    infoWindow.setContent(`
                        <div style="padding: 10px; max-width: 200px;">
                            <h4 style="margin: 0 0 8px 0; color: #333;">${relay.name}</h4>
                            <p style="margin: 4px 0; color: #666;">参与者: ${relay.participant}</p>
                            <p style="margin: 4px 0; color: #666;">位置: ${relay.location}</p>
                            <p style="margin: 4px 0; color: #666;">日期: ${relay.date}</p>
                        </div>
                    `);
                    infoWindow.open(map, marker.getPosition());
                }
            });

            markers.push(marker);
            path.push([relay.coordinates.lng, relay.coordinates.lat]);
        });

        // 添加标记到地图
        if (showAllMarkers) {
            markers.forEach(marker => map.add(marker));
        } else if (currentRelayId) {
            const currentMarker = markers.find(m => m.getTitle() === `第${currentRelayId}棒`);
            if (currentMarker) {
                map.add(currentMarker);
            }
        }

        // 绘制路线
        if (showRoute && path.length > 1) {
            // @ts-ignore
            const AMap = window.AMap;
            const polyline = new AMap.Polyline({
                path: path,
                strokeColor: '#4C8BF0',
                strokeWeight: 4,
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
            });
            map.add(polyline);
        }

        // 调整视野以包含所有点
        if (path.length > 0) {
            map.setFitView();
        }

    }, [map, relays, currentRelayId, showRoute, showAllMarkers, infoWindow]);

    // 检查API密钥是否已配置
    if (!isAmapKeyConfigured()) {
        return (
            <div className="relative1">
                <div 
                    style={{ height, width: '100%' }}
                    className="rounded-lg shadow-lg bg-gray-100 flex items-center justify-center"
                >
                    <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">地图加载失败</p>
                        <p className="text-gray-400 text-sm">请配置高德地图API密钥</p>
                        <p className="text-gray-400 text-xs mt-1">
                            在 src/config/mapConfig.ts 中设置 AMAP_KEY
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative1">
            <div 
                ref={mapRef} 
                style={{ height, width: '100%' }}
                className="rounded-lg shadow-lg"
            />
            {selectedRelay && (
                <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedRelay.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">参与者: {selectedRelay.participant}</p>
                    <p className="text-sm text-gray-600 mb-1">位置: {selectedRelay.location}</p>
                    <p className="text-sm text-gray-600 mb-1">日期: {selectedRelay.date}</p>
                    <p className="text-sm text-gray-600">天气: {selectedRelay.weather}</p>
                </div>
            )}
        </div>
    );
};

export default AmapComponent;
