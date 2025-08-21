import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Relay, Group } from '../config/projectData';
import { getAmapKey, isAmapKeyConfigured, MAP_CONFIG } from '../config/mapConfig';
import './AmapComponent.css';

interface AmapComponentProps {
    relays: Relay[];
    currentRelayId?: number;
    height?: string;
    showRoute?: boolean;
    showAllMarkers?: boolean;
    groups?: Group[]; // 添加组信息用于颜色分配
}

const AmapComponent: React.FC<AmapComponentProps> = ({
    relays,
    currentRelayId,
    height = '400px',
    showRoute = true,
    showAllMarkers = true,
    groups = []
}) => {
    const [map, setMap] = useState<any>(null);
    const [infoWindow, setInfoWindow] = useState<any>(null);
    const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // 为不同组定义颜色映射
    const groupColorMap: { [key: string]: string } = {
        'A': '#FF0000', // 纯红色
        'B': '#0000FF', // 纯蓝色
        'C': '#FFA500', // 橙色
        'D': '#800080', // 紫色
        'E': '#008000', // 绿色
        'F': '#FFD700', // 金色
        'G': '#FF1493', // 深粉色
        'H': '#00CED1', // 深青色
        'I': '#FF4500', // 橙红色
        'J': '#4B0082'  // 靛蓝色
    };

    // 获取组的颜色
    const getGroupColor = (groupId: string): string => {
        return groupColorMap[groupId] || '#4C8BF0';
    };

    // 获取接力棒所属的组
    const getRelayGroup = (relay: Relay): Group | undefined => {
        return groups.find(group => group.relays.some(r => r.id === relay.id));
    };

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
            
            // 获取组的颜色
            const relayGroup = getRelayGroup(relay);
            const groupColor = relayGroup ? getGroupColor(relayGroup.id) : '#4C8BF0';
            
            // 生成SVG图标
            const svgIcon = relay.id === currentRelayId 
                ? `data:image/svg+xml;base64,${btoa(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#E64444" stroke="#FFF" stroke-width="2"/>
                        <text x="16" y="20" font-family="Arial" font-size="12" fill="#FFF" text-anchor="middle">${relay.id}</text>
                    </svg>
                `)}`
                : `data:image/svg+xml;base64,${btoa(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="${groupColor}" stroke="#FFF" stroke-width="2"/>
                        <text x="16" y="20" font-family="Arial" font-size="12" fill="#FFF" text-anchor="middle">${relay.id}</text>
                    </svg>
                `)}`;
            
            const marker = new AMap.Marker({
                position: [relay.coordinates.lng, relay.coordinates.lat],
                title: relay.name,
                icon: new AMap.Icon({
                    size: new AMap.Size(32, 32),
                    image: svgIcon,
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
        if (showRoute && groups.length > 0) {
            // @ts-ignore
            const AMap = window.AMap;
            
            // 按组绘制路线
            groups.forEach(group => {
                // 直接使用组的接力棒数据，而不是从relays中过滤
                if (group.relays.length > 1) {
                    const groupPath = group.relays.map(relay => 
                        [relay.coordinates.lng, relay.coordinates.lat]
                    );
                    
                    const groupColor = getGroupColor(group.id);
                    
                    const polyline = new AMap.Polyline({
                        path: groupPath,
                        strokeColor: groupColor,
                        strokeWeight: 4,
                        strokeOpacity: 0.8,
                        strokeStyle: 'solid'
                    });
                    map.add(polyline);
                }
            });
        } else if (showRoute && path.length > 1) {
            // 如果没有组信息，使用默认颜色绘制单一路线
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
