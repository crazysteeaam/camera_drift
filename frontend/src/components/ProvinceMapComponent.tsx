import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Camera } from 'lucide-react';
import { Phase2Province, Phase2Relay } from '../config/phase2Data';
import { getAmapKey, isAmapKeyConfigured, MAP_CONFIG } from '../config/mapConfig';
import './AmapComponent.css';

interface ProvinceMapComponentProps {
    province: Phase2Province;
    onCityClick?: (city: string) => void;
    height?: string;
    className?: string;
}

const ProvinceMapComponent: React.FC<ProvinceMapComponentProps> = ({
    province,
    onCityClick,
    height = '500px',
    className = ''
}) => {
    const [map, setMap] = useState<any>(null);
    const [infoWindow, setInfoWindow] = useState<any>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<Map<string, any>>(new Map());
    const provincePolygonRef = useRef<any>(null);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);

    // 加载 GeoJSON 数据
    useEffect(() => {
        const loadGeoJsonData = async () => {
            try {
                // 使用与第二期地图相同的 TopoJSON 文件
                const response = await fetch('/geo/china-1.6.2.json');
                const data = await response.json();
                setGeoJsonData(data);
                console.log('TopoJSON 数据加载成功');
            } catch (error) {
                console.error('加载 TopoJSON 数据失败:', error);
            }
        };
        loadGeoJsonData();
    }, []);

    // 省份名称规范化，提升与高德名称匹配的成功率
    const normalizeProvinceName = (name: string): string => {
        return name
            .replace(/省|市|自治区|特别行政区/g, '')
            .replace(/壮族|回族|维吾尔/g, '')
            .replace(/\s/g, '')
            .toLowerCase();
    };

    // 从 TopoJSON 数据中查找省份边界
    const findProvinceBoundary = (provinceName: string) => {
        if (!geoJsonData || !geoJsonData.objects || !geoJsonData.objects.default) {
            return null;
        }

        const geometries = geoJsonData.objects.default.geometries;
        const normalizedTarget = normalizeProvinceName(provinceName);
        
        const province = geometries.find((geom: any) => {
            const props = geom.properties;
            if (!props) return false;
            
            const name = props.fullname || props.name || '';
            const normalized = normalizeProvinceName(name);
            return normalized === normalizedTarget;
        });

        return province;
    };

    // TopoJSON arc 解码函数
    const decodeTopoJsonArc = (arc: any, arcs: any, transform?: { scale?: [number, number]; translate?: [number, number] }): any[] | null => {
        if (!arc || !Array.isArray(arc) || arc.length === 0) return null;

        const path: any[] = [];
        const scale = transform?.scale || [1, 1];
        const translate = transform?.translate || [0, 0];

        for (let i = 0; i < arc.length; i++) {
            const arcIndex = arc[i];
            const isReversed = arcIndex < 0;
            const actualIndex = isReversed ? -arcIndex - 1 : arcIndex;

            if (actualIndex >= arcs.length) {
                console.warn(`Arc index ${actualIndex} 超出范围`);
                continue;
            }

            const arcCoords = arcs[actualIndex];
            if (!arcCoords || !Array.isArray(arcCoords)) {
                console.warn(`Arc ${actualIndex} 数据无效`);
                continue;
            }

            let localX = 0;
            let localY = 0;
            const coords: [number, number][] = [];

            for (let j = 0; j < arcCoords.length; j++) {
                const delta = arcCoords[j];
                if (!Array.isArray(delta) || delta.length < 2) continue;

                localX += delta[0];
                localY += delta[1];

                const lng = localX * scale[0] + translate[0];
                const lat = localY * scale[1] + translate[1];
                coords.push([lng, lat]);
            }

            if (isReversed) {
                coords.reverse();
            }

            if (path.length > 0 && coords.length > 0) {
                coords.shift();
            }

            path.push(...coords);
        }

        return path.length > 0 ? path : null;
    };

    const clearProvinceBoundary = (mapInstance: any) => {
        const overlays = provincePolygonRef.current;
        if (!overlays) return;

        const overlayArray = Array.isArray(overlays) ? overlays : [overlays];
        const mapHasRemove = mapInstance && typeof mapInstance.remove === 'function';

        overlayArray.forEach((overlay: any) => {
            if (!overlay) return;

            if (mapHasRemove) {
                try {
                    mapInstance.remove(overlay);
                    return;
                } catch (error) {
                    console.warn('移除省份边界覆盖物失败，尝试使用 setMap(null)', error);
                }
            }

            if (typeof overlay.setMap === 'function') {
                overlay.setMap(null);
            }
        });

        provincePolygonRef.current = null;
    };

    // 获取所有城市及其坐标
    const getCitiesFromRelays = (): { [key: string]: { lat: number; lng: number; relays: Phase2Relay[] } } => {
        const cities: { [key: string]: { lat: number; lng: number; relays: Phase2Relay[] } } = {};
        
        province.groups.forEach(group => {
            group.relays.forEach(relay => {
                const city = relay.city;
                if (!cities[city]) {
                    cities[city] = {
                        lat: relay.coordinates.lat,
                        lng: relay.coordinates.lng,
                        relays: []
                    };
                }
                cities[city].relays.push(relay);
            });
        });
        
        return cities;
    };

    // 获取城市状态颜色
    const getCityColor = (city: string): string => {
        const cityData = getCitiesFromRelays()[city];
        if (!cityData) return '#9CA3AF';
        
        const hasCompletedRelays = cityData.relays.some(relay => 
            province.groups.some(group => 
                group.relays.includes(relay) && group.status === 'completed'
            )
        );
        
        const hasActiveRelays = cityData.relays.some(relay => 
            province.groups.some(group => 
                group.relays.includes(relay) && group.status === 'active'
            )
        );
        
        if (hasCompletedRelays) return '#10B981'; // 绿色 - 已完成
        if (hasActiveRelays) return '#F59E0B'; // 橙色 - 进行中
        return '#9CA3AF'; // 灰色 - 计划中
    };

    // 获取城市状态文本
    const getCityStatus = (city: string): string => {
        const cityData = getCitiesFromRelays()[city];
        if (!cityData) return '计划中';
        
        const hasCompletedRelays = cityData.relays.some(relay => 
            province.groups.some(group => 
                group.relays.includes(relay) && group.status === 'completed'
            )
        );
        
        const hasActiveRelays = cityData.relays.some(relay => 
            province.groups.some(group => 
                group.relays.includes(relay) && group.status === 'active'
            )
        );
        
        if (hasCompletedRelays) return '已完成';
        if (hasActiveRelays) return '进行中';
        return '计划中';
    };

    // 初始化地图
    useEffect(() => {
        if (!isAmapKeyConfigured() || !mapRef.current) return;

        const initMap = async () => {
            try {
                // 动态加载高德地图API
                if (!window.AMap) {
                    const script = document.createElement('script');
                    script.src = `https://webapi.amap.com/maps?v=2.0&key=${getAmapKey()}&plugin=AMap.Scale,AMap.ToolBar,AMap.Geocoder,AMap.DistrictSearch`;
                    script.async = true;
                    document.head.appendChild(script);
                    
                    script.onload = () => {
                        createMap();
                    };
                } else {
                    createMap();
                }
            } catch (error) {
                console.error('地图初始化失败:', error);
            }
        };

        const createMap = () => {
            const mapInstance = new window.AMap.Map(mapRef.current, {
                zoom: 7,
                center: [province.coordinates.lng, province.coordinates.lat],
                mapStyle: 'amap://styles/light',
                viewMode: '2D',
                features: ['bg', 'road', 'building', 'point'],
                showLabel: true
            });

            // 添加比例尺控件
            mapInstance.addControl(new window.AMap.Scale({
                position: 'LB'
            }));

            // 添加工具栏控件
            mapInstance.addControl(new window.AMap.ToolBar({
                position: 'RT'
            }));

            setMap(mapInstance);

            // 创建信息窗口
            const infoWindowInstance = new window.AMap.InfoWindow({
                isCustom: true,
                autoMove: true,
                closeWhenClickMap: true
            });
            setInfoWindow(infoWindowInstance);

            // 添加省份边界高亮
            addProvinceBoundary(mapInstance);
            
            // 添加城市标记
            addCityMarkers(mapInstance, infoWindowInstance);
        };

        initMap();

        return () => {
            if (map) {
                clearProvinceBoundary(map);
                map.destroy();
            }
        };
    }, [province, geoJsonData]);

    // 添加省份边界高亮
    const addProvinceBoundary = (mapInstance: any) => {
        clearProvinceBoundary(mapInstance);

        // 首先尝试使用 TopoJSON 数据
        if (geoJsonData && geoJsonData.type === 'Topology') {
            const provinceData = findProvinceBoundary(province.name);
            if (provinceData) {
                console.log('找到省份 TopoJSON 数据:', provinceData);
                
                const arcs = geoJsonData.arcs || [];
                const allPolygons: any[] = [];
                
                // 处理多边形数据
                if (provinceData.type === 'Polygon') {
                    // TopoJSON Polygon: arcs: [ [arc1, arc2, ...] ]
                    const rings = provinceData.arcs || [];
                    rings.forEach((ring: any) => {
                        const path = decodeTopoJsonArc(ring, arcs, geoJsonData.transform);
                        if (path && path.length >= 3) {
                            const polygon = new window.AMap.Polygon({
                                path: path,
                                strokeColor: '#3B82F6',
                                strokeWeight: 4,
                                strokeOpacity: 1,
                                fillColor: '#3B82F6',
                                fillOpacity: 0.15,
                                zIndex: 10
                            });
                            mapInstance.add(polygon);
                            allPolygons.push(polygon);
                        }
                    });
                } else if (provinceData.type === 'MultiPolygon') {
                    // TopoJSON MultiPolygon: arcs: [ [ [arc1, arc2, ...] ], ... ]
                    const polys = provinceData.arcs || [];
                    polys.forEach((poly: any) => {
                        (poly || []).forEach((ring: any) => {
                            const path = decodeTopoJsonArc(ring, arcs, geoJsonData.transform);
                            if (path && path.length >= 3) {
                                const polygon = new window.AMap.Polygon({
                                    path: path,
                                    strokeColor: '#3B82F6',
                                    strokeWeight: 4,
                                    strokeOpacity: 1,
                                    fillColor: '#3B82F6',
                                    fillOpacity: 0.15,
                                    zIndex: 10
                                });
                                mapInstance.add(polygon);
                                allPolygons.push(polygon);
                            }
                        });
                    });
                }
                
                if (allPolygons.length > 0) {
                    provincePolygonRef.current = allPolygons;
                    mapInstance.setFitView(allPolygons);
                    console.log('使用 TopoJSON 数据绘制省份边界，多边形数量:', allPolygons.length);
                    return;
                }
            }
        }

        // 检查是否有预定义的边界数据
        if (province.boundary && province.boundary.length > 0) {
            console.log('使用预定义边界数据');
            const polygon = new window.AMap.Polygon({
                path: province.boundary,
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 1,
                fillColor: '#3B82F6',
                fillOpacity: 0.15,
                zIndex: 10
            });
            mapInstance.add(polygon);
            provincePolygonRef.current = [polygon];
            mapInstance.setFitView([polygon]);
            return;
        }

        // 使用高德地图的行政区划服务获取省份边界
        const district = new window.AMap.DistrictSearch({
            level: 'province',
            showbiz: false,
            extensions: 'all',
            subdistrict: 0
        });

        // 尝试不同的省份名称格式
        const provinceNames = [
            province.name,
            province.name.replace('省', ''),
            province.name.replace('市', ''),
            province.name.replace('自治区', ''),
            province.name.replace('特别行政区', ''),
            // 添加一些常见的省份简称
            province.name === '浙江省' ? '浙江' : null,
            province.name === '江苏省' ? '江苏' : null,
            province.name === '广东省' ? '广东' : null,
            province.name === '山东省' ? '山东' : null,
            province.name === '河南省' ? '河南' : null,
            province.name === '四川省' ? '四川' : null,
            province.name === '湖北省' ? '湖北' : null,
            province.name === '湖南省' ? '湖南' : null,
            province.name === '安徽省' ? '安徽' : null,
            province.name === '河北省' ? '河北' : null,
            province.name === '福建省' ? '福建' : null,
            province.name === '江西省' ? '江西' : null,
            province.name === '辽宁省' ? '辽宁' : null,
            province.name === '黑龙江省' ? '黑龙江' : null,
            province.name === '山西省' ? '山西' : null,
            province.name === '陕西省' ? '陕西' : null,
            province.name === '甘肃省' ? '甘肃' : null,
            province.name === '青海省' ? '青海' : null,
            province.name === '新疆维吾尔自治区' ? '新疆' : null,
            province.name === '西藏自治区' ? '西藏' : null,
            province.name === '内蒙古自治区' ? '内蒙古' : null,
            province.name === '广西壮族自治区' ? '广西' : null,
            province.name === '宁夏回族自治区' ? '宁夏' : null,
            province.name === '海南省' ? '海南' : null,
            province.name === '台湾省' ? '台湾' : null,
            province.name === '香港特别行政区' ? '香港' : null,
            province.name === '澳门特别行政区' ? '澳门' : null,
            province.name === '北京市' ? '北京' : null,
            province.name === '天津市' ? '天津' : null,
            province.name === '上海市' ? '上海' : null,
            province.name === '重庆市' ? '重庆' : null
        ].filter(name => name !== null);

        let searchCompleted = false;

        const trySearch = (index: number) => {
            if (index >= provinceNames.length || searchCompleted) return;

            const searchName = provinceNames[index];
            console.log(`尝试搜索省份: ${searchName}`);

            district.search(searchName, (status: string, result: any) => {
                console.log(`搜索状态: ${status}`, result);
                
                if (status === 'complete' && result.districtList && result.districtList.length > 0) {
                    const districtData = result.districtList[0];
                    console.log('找到省份边界数据:', districtData);
                    
                    if (districtData.boundaries && districtData.boundaries.length > 0) {
                        // 处理边界数据，确保是正确格式
                        let boundaries = districtData.boundaries;
                        
                        // 如果boundaries是嵌套数组，取第一个
                        if (Array.isArray(boundaries[0]) && Array.isArray(boundaries[0][0])) {
                            boundaries = boundaries[0];
                        }
                        
                        console.log('处理后的边界数据:', boundaries);
                        
                        // 创建省份边界多边形
                        const polygon = new window.AMap.Polygon({
                            path: boundaries,
                            strokeColor: '#3B82F6', // 蓝色边框
                            strokeWeight: 4,
                            strokeOpacity: 1,
                            fillColor: '#3B82F6', // 蓝色填充
                            fillOpacity: 0.15, // 低透明度填充
                            zIndex: 10
                        });

                        mapInstance.add(polygon);
                        provincePolygonRef.current = [polygon];

                        // 自动调整地图视野以包含整个省份
                        mapInstance.setFitView([polygon]);
                        searchCompleted = true;
                        console.log('省份边界已添加，边界点数:', boundaries.length);
                        return;
                    }
                }
                
                // 如果当前搜索失败，尝试下一个名称
                if (!searchCompleted) {
                    trySearch(index + 1);
                }
            });
        };

        // 开始搜索
        trySearch(0);

        // 如果所有搜索都失败，尝试使用备用方法
        setTimeout(() => {
            if (!searchCompleted) {
                console.warn('无法获取省份边界数据，尝试备用方法');
                addFallbackBoundary(mapInstance);
            }
        }, 3000);
    };

    // 备用边界绘制方法
    const addFallbackBoundary = (mapInstance: any) => {
        // 根据省份调整圆形半径
        const radiusMap: { [key: string]: number } = {
            '浙江省': 80000,
            '江苏省': 70000,
            '广东省': 100000,
            '山东省': 90000,
            '河南省': 80000,
            '四川省': 120000,
            '湖北省': 80000,
            '湖南省': 80000,
            '安徽省': 70000,
            '河北省': 80000,
            '福建省': 70000,
            '江西省': 70000,
            '辽宁省': 80000,
            '黑龙江省': 100000,
            '山西省': 60000,
            '陕西省': 80000,
            '甘肃省': 100000,
            '青海省': 120000,
            '新疆维吾尔自治区': 150000,
            '西藏自治区': 150000,
            '内蒙古自治区': 120000,
            '广西壮族自治区': 80000,
            '宁夏回族自治区': 60000,
            '海南省': 50000,
            '台湾省': 40000,
            '香港特别行政区': 20000,
            '澳门特别行政区': 10000,
            '北京市': 30000,
            '天津市': 25000,
            '上海市': 20000,
            '重庆市': 60000
        };
        
        const radius = radiusMap[province.name] || 80000;
        const center = [province.coordinates.lng, province.coordinates.lat];
        
        console.log(`为${province.name}创建圆形边界，半径: ${radius}米`);
        
        // 创建圆形边界
        const circle = new window.AMap.Circle({
            center: center,
            radius: radius,
            strokeColor: '#3B82F6',
            strokeWeight: 4,
            strokeOpacity: 1,
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            zIndex: 10
        });

        mapInstance.add(circle);
        provincePolygonRef.current = [circle];
        
        // 调整地图视野
        mapInstance.setFitView([circle]);
        console.log('使用备用圆形边界');
    };

    // 添加城市标记
    const addCityMarkers = (mapInstance: any, infoWindowInstance: any) => {
        const cities = getCitiesFromRelays();
        
        Object.entries(cities).forEach(([cityName, cityData]) => {
            const marker = new window.AMap.Marker({
                position: [cityData.lng, cityData.lat],
                title: cityName,
                icon: new window.AMap.Icon({
                    size: new window.AMap.Size(32, 32),
                    image: createMarkerIcon(getCityColor(cityName)),
                    imageSize: new window.AMap.Size(32, 32)
                })
            });

            // 点击标记显示信息
            marker.on('click', () => {
                setSelectedCity(cityName);
                showCityInfo(mapInstance, cityName, cityData, infoWindowInstance);
                if (onCityClick) {
                    onCityClick(cityName);
                }
            });

            mapInstance.add(marker);
            markersRef.current.set(cityName, marker);
        });
    };

    // 创建标记图标
    const createMarkerIcon = (color: string): string => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
            // 绘制圆形背景
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(16, 16, 12, 0, 2 * Math.PI);
            ctx.fill();
            
            // 绘制白色边框
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制地图标记图标
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(16, 8);
            ctx.lineTo(12, 20);
            ctx.lineTo(20, 20);
            ctx.closePath();
            ctx.fill();
        }
        
        return canvas.toDataURL();
    };

    // 显示城市信息
    const showCityInfo = (
        mapInstance: any,
        cityName: string,
        cityData: any,
        infoWindowInstance: any
    ) => {
        const relayCount = cityData?.relays?.length ?? 0;
        const status = getCityStatus(cityName);
        const statusColor = getCityColor(cityName);

        if (!mapInstance || !infoWindowInstance || typeof infoWindowInstance.setContent !== 'function') {
            window.alert(`当前城市：${cityName}\n状态：${status}\n接力棒数量：${relayCount}`);
            return;
        }

        const content = `
            <div style="min-width:220px;font-family: 'SF Pro Display', 'PingFang SC', Arial, sans-serif;">
                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:12px 12px 0 0;background:linear-gradient(135deg, #3B82F6, #6366F1);color:#ffffff;">
                    <span style="font-size:14px;font-weight:600;letter-spacing:0.5px;">${cityName}</span>
                    <span style="display:inline-flex;align-items:center;font-size:12px;font-weight:500;">
                        <span style="width:8px;height:8px;border-radius:9999px;background:${statusColor};margin-right:6px;"></span>
                        ${status}
                    </span>
                </div>
                <div style="padding:12px 14px;background:#ffffff;border-radius:0 0 12px 12px;box-shadow:0 8px 20px rgba(15, 23, 42, 0.12);">
                    <div style="font-size:12px;color:#4b5563;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                        <span style="color:#6b7280;">接力棒数量</span>
                        <span style="font-size:16px;font-weight:600;color:#1f2937;">${relayCount}</span>
                    </div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:8px;text-align:right;">点击标记可查看城市详情</div>
                </div>
            </div>
        `;

        try {
            infoWindowInstance.setContent(content);
            infoWindowInstance.open(mapInstance, [cityData.lng, cityData.lat]);
        } catch (error) {
            console.warn('展示城市信息窗口失败，改用弹窗提示', error);
            window.alert(`当前城市：${cityName}\n状态：${status}\n接力棒数量：${relayCount}`);
        }
    };

    if (!isAmapKeyConfigured()) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
                <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>地图配置未完成</p>
                    <p className="text-sm">请配置高德地图API密钥</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div 
                ref={mapRef} 
                className="w-full rounded-lg overflow-hidden"
                style={{ height }}
            />
            
            {/* 图例 */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
                <div className="font-medium text-gray-700 mb-2">图例说明</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>已完成</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span>进行中</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span>计划中</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <div className="w-3 h-3 border-2 border-blue-500 bg-blue-100"></div>
                        <span>省份边界</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvinceMapComponent;
