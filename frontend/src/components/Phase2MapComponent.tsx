import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Phase2Province } from '../config/phase2Data';
import { getAmapKey, isAmapKeyConfigured, MAP_CONFIG } from '../config/mapConfig';
import { useTranslation } from '../i18n/hooks';
import './AmapComponent.css';

interface Phase2MapComponentProps {
    provinces: Phase2Province[];
    onProvinceClick?: (province: Phase2Province) => void;
    highlightedProvinces?: string[];
    height?: string;
    className?: string;
}

const Phase2MapComponent: React.FC<Phase2MapComponentProps> = ({
    provinces,
    onProvinceClick,
    highlightedProvinces = [],
    height = '500px',
    className = ''
}) => {
    const { t } = useTranslation();
    const [map, setMap] = useState<any>(null);
    const [infoWindow, setInfoWindow] = useState<any>(null);
    const [selectedProvince, setSelectedProvince] = useState<Phase2Province | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const provincePolygonsRef = useRef<Map<string, any[]>>(new Map());
    const geojsonCacheRef = useRef<any | null>(null);

    // 省份名称规范化，提升与高德名称匹配的成功率
    const normalizeProvinceName = (name: string): string => {
        return name
            .replace(/省|市|自治区|特别行政区/g, '')
            .replace(/壮族|回族|维吾尔/g, '')
            .replace(/\s/g, '')
            .toLowerCase();
    };

    // 获取省份状态颜色
    const getProvinceColor = (province: Phase2Province): string => {
        if (province.completedGroups > 0) {
            return '#10B981'; // 绿色 - 已完成
        } else if (province.activeGroups > 0) {
            return '#F59E0B'; // 橙色 - 进行中
        } else {
            return '#9CA3AF'; // 灰色 - 计划中
        }
    };

    // 获取省份状态
    const getProvinceStatus = (province: Phase2Province): string => {
        if (province.completedGroups > 0) {
            return t('phase2.home.sections.map.statistics.status.completed') as string;
        } else if (province.activeGroups > 0) {
            return t('phase2.home.sections.map.statistics.status.active') as string;
        } else {
            return t('phase2.home.sections.map.statistics.status.planning') as string;
        }
    };

    // 获取高德地图API密钥
    const AMAP_KEY = getAmapKey();

    // 本地开发环境下，避免因为域名未授权导致高德脚本报错
    const isLocalhost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const canUseAmap = isAmapKeyConfigured() && !isLocalhost;

    useEffect(() => {
        if (!mapRef.current) return;

        // 本地开发环境或未正确配置密钥时，不加载高德脚本
        if (!canUseAmap) {
            return;
        }

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
                        zoom: 5, // 全国视图
                        center: [104.114129, 37.550339], // 中国中心点
                        mapStyle: MAP_CONFIG.MAP_STYLE
                    });

                    // 添加控件（隐藏右上角图层控制）
                    map.addControl(new AMap.ToolBar());
                    map.addControl(new AMap.Scale());
                    // 关闭鹰眼默认打开，减轻渲染压力
                    map.addControl(new AMap.HawkEye({ isOpen: false }));
                    // 不添加 MapType 控件，隐藏右上角图层控制面板

                    // 降低动画开销，避免部分环境下 Canvas 报错
                    map.setStatus({ animateEnable: false });

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
    }, [AMAP_KEY, canUseAmap]);

    useEffect(() => {
        if (!map || !provinces.length) return;

        // 清除现有标记/图层
        map.clearMap();
        provincePolygonsRef.current.clear();

        // @ts-ignore
        const AMap = window.AMap;

        // 从本地 GeoJSON 加载全国省界（失败则回退到远程）
        const loadGeoJson = async (): Promise<any> => {
            if (geojsonCacheRef.current) return geojsonCacheRef.current;
            const localUrl = '/geo/china-1.6.2.json';
            const remoteUrl = 'https://geojson.cn/api/china/1.6.2/china.json';
            try {
                const res = await fetch(localUrl, { cache: 'force-cache' });
                if (!res.ok) throw new Error('local not found');
                const data = await res.json();
                if (!data || !data.features || !Array.isArray(data.features) || data.features.length === 0) {
                    throw new Error('local invalid');
                }
                geojsonCacheRef.current = data;
                return data;
            } catch (e) {
                const res = await fetch(remoteUrl, { cache: 'no-cache' });
                const data = await res.json();
                geojsonCacheRef.current = data;
                return data;
            }
        };

        const drawFromGeoJson = async () => {
            try {
                const geo = await loadGeoJson();

                // 检查是否为 TopoJSON 格式
                if (geo.type === 'Topology' && geo.objects && geo.arcs) {
                    console.log('检测到 TopoJSON 格式，使用 TopoJSON 解析器');
                    await drawFromTopoJson(geo);
                } else if (geo.type === 'FeatureCollection' && geo.features) {
                    console.log('检测到标准 GeoJSON 格式');
                    await drawFromStandardGeoJson(geo);
                } else {
                    throw new Error('不支持的 GeoJSON 格式');
                }

                // 自适应视野到全国
                map.setZoomAndCenter(4.5, [104.114129, 37.550339]);
            } catch (err) {
                console.error('加载或绘制 GeoJSON 失败:', err);
            }
        };

        const drawFromTopoJson = async (topo: any) => {
            const objects = topo.objects.default || topo.objects;
            const geometries = objects.geometries || [];
            const arcs = topo.arcs || [];

            console.log(`TopoJSON: 找到 ${geometries.length} 个几何体`);

            geometries.forEach((geom: any, index: number) => {
                const props = geom.properties || {};
                const name: string = props.fullname || props.name || '';
                if (!name) return;

                const normalized = normalizeProvinceName(name);
                const matched = provinces.find(p => normalizeProvinceName(p.name) === normalized);
                if (!matched) {
                    console.log(`未匹配到省份: ${name} (${normalized})`);
                    return;
                }

                console.log(`绘制省份: ${name} -> ${matched.name} (${matched.id})`);
                const color = getProvinceColor(matched);

                const addPolygon = (path: any) => {
                    if (!path || path.length < 3) return null; // 至少需要3个点才能形成多边形

                    const polygon = new AMap.Polygon({
                        path,
                        fillColor: color,
                        fillOpacity: matched.completedGroups > 0 ? 0.75 : matched.activeGroups > 0 ? 0.65 : 0.4,
                        strokeColor: '#000000', // 统一黑色描边
                        strokeWeight: 1.5, // 适中的描边粗细
                        strokeOpacity: 1,
                        zIndex: 60,
                        cursor: 'pointer'
                    });

                    polygon.on('click', () => {
                        setSelectedProvince(matched);
                        if (onProvinceClick) onProvinceClick(matched);
                    });

                    polygon.on('mouseover', () => {
                        polygon.setOptions({ strokeWeight: 2.5, fillOpacity: 0.85, strokeColor: '#000000' });

                        // 显示简化的悬浮提示
                        const statusText = matched.completedGroups > 0 
                            ? t('phase2.home.sections.map.statistics.status.completed') as string
                            : matched.activeGroups > 0 
                                ? t('phase2.home.sections.map.statistics.status.active') as string
                                : t('phase2.home.sections.map.statistics.status.planning') as string;
                        
                        const provinceName = t(`provinces.${matched.id}.name`) as string || matched.name;
                        
                        const timeInfo = matched.completedGroups > 0
                            ? `${t('phase2.home.sections.map.statistics.status.completedTime')}: ${matched.planningStartDate || '2024年12月'}`
                            : matched.activeGroups > 0
                                ? `${t('phase2.home.sections.map.statistics.status.currentTime')}: ${new Date().toLocaleDateString()}`
                                : `${t('phase2.home.sections.map.statistics.status.planningStart')}: ${matched.planningStartDate || t('common.messages.loading')}`;

                        const content = `
                            <div class="p-2">
                                <div class="font-bold text-sm">${provinceName}</div>
                                <div class="text-xs text-gray-600 mt-1">
                                    <div>${t('phase2.home.sections.map.statistics.status.label')}: ${statusText}</div>
                                    <div>${timeInfo}</div>
                                </div>
                            </div>
                        `;

                        if (infoWindow) {
                            infoWindow.setContent(content);
                            infoWindow.open(map, polygon.getBounds().getCenter());
                        }
                    });
                    polygon.on('mouseout', () => {
                        polygon.setOptions({ strokeWeight: 1.5, fillOpacity: matched.completedGroups > 0 ? 0.75 : matched.activeGroups > 0 ? 0.65 : 0.4, strokeColor: '#000000' });
                        if (infoWindow) {
                            infoWindow.close();
                        }
                    });

                    polygon.setMap(map);

                    const list = provincePolygonsRef.current.get(matched.id) || [];
                    list.push(polygon);
                    provincePolygonsRef.current.set(matched.id, list);

                    return polygon; // 返回多边形对象
                };

                // 添加省份名称标签
                const addProvinceLabel = (polygon: any) => {
                    // 使用多边形的外接矩形中心点，避免缩放时文字偏移
                    const bounds = polygon.getBounds();
                    const center = bounds.getCenter();

                    const text = new AMap.Text({
                        text: props.name || matched.shortName || matched.name.replace(/省|市|自治区|特别行政区/g, ''),
                        position: center, // 直接用多边形外接矩形的中心
                        style: {
                            'font-size': '12px',
                            'font-weight': 'bold',
                            'color': '#000000',
                            'background-color': 'transparent',
                            'border': 'none',
                            'text-align': 'center'
                        },
                        zIndex: 70
                    });

                    text.setMap(map);

                    // 将文字标签也存储到引用中，方便后续管理
                    const list = provincePolygonsRef.current.get(matched.id) || [];
                    list.push(text);
                    provincePolygonsRef.current.set(matched.id, list);
                };

                // 收集所有多边形用于添加标签
                const allPolygons: any[] = [];

                if (geom.type === 'Polygon') {
                    // TopoJSON Polygon: arcs: [ [arc1, arc2, ...] ]
                    const rings = geom.arcs || [];
                    rings.forEach((ring: any) => {
                        const path = decodeTopoJsonArc(ring, arcs);
                        if (path) {
                            const polygon = addPolygon(path);
                            if (polygon) allPolygons.push(polygon);
                        }
                    });
                } else if (geom.type === 'MultiPolygon') {
                    // TopoJSON MultiPolygon: arcs: [ [ [arc1, arc2, ...] ], ... ]
                    const polys = geom.arcs || [];
                    polys.forEach((poly: any) => {
                        (poly || []).forEach((ring: any) => {
                            const path = decodeTopoJsonArc(ring, arcs);
                            if (path) {
                                const polygon = addPolygon(path);
                                if (polygon) allPolygons.push(polygon);
                            }
                        });
                    });
                }

                // 为每个省份添加名称标签 - 使用第一个多边形计算中心点
                if (allPolygons.length > 0) {
                    addProvinceLabel(allPolygons[0]);
                }
            });
        };

        const drawFromStandardGeoJson = async (geo: any) => {
            const features: any[] = geo.features || [];

            features.forEach((feature: any) => {
                const props = feature.properties || {};
                const geom = feature.geometry || {};
                const name: string = props.fullname || props.name || '';
                if (!name) return;

                const normalized = normalizeProvinceName(name);
                const matched = provinces.find(p => normalizeProvinceName(p.name) === normalized);
                if (!matched) return;

                const color = getProvinceColor(matched);

                const addPolygon = (path: any) => {
                    if (!path || path.length < 3) return null; // 至少需要3个点才能形成多边形

                    const polygon = new AMap.Polygon({
                        path,
                        fillColor: color,
                        fillOpacity: matched.completedGroups > 0 ? 0.75 : matched.activeGroups > 0 ? 0.65 : 0.4,
                        strokeColor: '#000000', // 统一黑色描边
                        strokeWeight: 1.5, // 适中的描边粗细
                        strokeOpacity: 1,
                        zIndex: 60,
                        cursor: 'pointer'
                    });

                    polygon.on('click', () => {
                        setSelectedProvince(matched);
                        if (onProvinceClick) onProvinceClick(matched);
                    });

                    polygon.on('mouseover', () => {
                        polygon.setOptions({ strokeWeight: 2.5, fillOpacity: 0.85, strokeColor: '#000000' });

                        // 显示简化的悬浮提示
                        const statusText = matched.completedGroups > 0 
                            ? t('phase2.home.sections.map.statistics.status.completed') as string
                            : matched.activeGroups > 0 
                                ? t('phase2.home.sections.map.statistics.status.active') as string
                                : t('phase2.home.sections.map.statistics.status.planning') as string;
                        
                        const provinceName = t(`provinces.${matched.id}.name`) as string || matched.name;
                        
                        const timeInfo = matched.completedGroups > 0
                            ? `${t('phase2.home.sections.map.statistics.status.completedTime')}: ${matched.planningStartDate || '2024年12月'}`
                            : matched.activeGroups > 0
                                ? `${t('phase2.home.sections.map.statistics.status.currentTime')}: ${new Date().toLocaleDateString()}`
                                : `${t('phase2.home.sections.map.statistics.status.planningStart')}: ${matched.planningStartDate || t('common.messages.loading')}`;

                        const content = `
                            <div class="p-2">
                                <div class="font-bold text-sm">${provinceName}</div>
                                <div class="text-xs text-gray-600 mt-1">
                                    <div>${t('phase2.home.sections.map.statistics.status.label')}: ${statusText}</div>
                                    <div>${timeInfo}</div>
                                </div>
                            </div>
                        `;

                        if (infoWindow) {
                            infoWindow.setContent(content);
                            infoWindow.open(map, polygon.getBounds().getCenter());
                        }
                    });
                    polygon.on('mouseout', () => {
                        polygon.setOptions({ strokeWeight: 1.5, fillOpacity: matched.completedGroups > 0 ? 0.75 : matched.activeGroups > 0 ? 0.65 : 0.4, strokeColor: '#000000' });
                        if (infoWindow) {
                            infoWindow.close();
                        }
                    });

                    polygon.setMap(map);

                    const list = provincePolygonsRef.current.get(matched.id) || [];
                    list.push(polygon);
                    provincePolygonsRef.current.set(matched.id, list);

                    return polygon; // 返回多边形对象
                };

                // 添加省份名称标签
                const addProvinceLabel = (polygon: any) => {
                    // 使用多边形的外接矩形中心点，避免缩放时文字偏移
                    const bounds = polygon.getBounds();
                    const center = bounds.getCenter();

                    const text = new AMap.Text({
                        text: props.name || matched.shortName || matched.name.replace(/省|市|自治区|特别行政区/g, ''),
                        position: center, // 直接用多边形外接矩形的中心
                        style: {
                            'font-size': '12px',
                            'font-weight': 'bold',
                            'color': '#000000',
                            'background-color': 'transparent',
                            'border': 'none',
                            'text-align': 'center'
                        },
                        zIndex: 70
                    });

                    text.setMap(map);

                    // 将文字标签也存储到引用中，方便后续管理
                    const list = provincePolygonsRef.current.get(matched.id) || [];
                    list.push(text);
                    provincePolygonsRef.current.set(matched.id, list);
                };

                // 收集所有多边形用于添加标签
                const allPolygons: any[] = [];

                if (geom.type === 'Polygon') {
                    // Polygon: coordinates: [ [ [lng,lat], ... ] ]
                    const rings: any[] = geom.coordinates || [];
                    rings.forEach((ring: any) => {
                        const polygon = addPolygon(ring);
                        if (polygon) allPolygons.push(polygon);
                    });
                } else if (geom.type === 'MultiPolygon') {
                    // MultiPolygon: coordinates: [ [ [ [lng,lat], ... ] ], ... ]
                    const polys: any[] = geom.coordinates || [];
                    polys.forEach((poly: any) => {
                        (poly || []).forEach((ring: any) => {
                            const polygon = addPolygon(ring);
                            if (polygon) allPolygons.push(polygon);
                        });
                    });
                }

                // 为每个省份添加名称标签 - 使用第一个多边形计算中心点
                if (allPolygons.length > 0) {
                    addProvinceLabel(allPolygons[0]);
                }
            });
        };

        // TopoJSON arc 解码函数
        const decodeTopoJsonArc = (arc: any, arcs: any): any[] | null => {
            if (!arc || !Array.isArray(arc) || arc.length === 0) return null;

            const path: any[] = [];
            let x = 0, y = 0;

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

                const coords = isReversed ? [...arcCoords].reverse() : arcCoords;

                for (let j = 0; j < coords.length; j++) {
                    x += coords[j][0];
                    y += coords[j][1];
                    path.push([x, y]);
                }
            }

            return path.length > 0 ? path : null;
        };

        drawFromGeoJson();

    }, [map, provinces, onProvinceClick]);

    // 根据 props 高亮指定省份
    useEffect(() => {
        if (!map) return;
        // 重置所有省份为基础样式
        provincePolygonsRef.current.forEach((polys, provId) => {
            const prov = provinces.find(p => p.id === provId);
            if (!prov) return;
            const baseColor = getProvinceColor(prov);
            const isCompleted = prov.completedGroups > 0;
            const isActive = prov.activeGroups > 0;
            polys.forEach(poly => {
                poly.setOptions({
                    fillColor: baseColor,
                    fillOpacity: isCompleted ? 0.75 : isActive ? 0.65 : 0.4,
                    strokeColor: isCompleted ? '#2E7D32' : isActive ? '#F57C00' : '#CCCCCC',
                    strokeWeight: isCompleted || isActive ? 2 : 1
                });
            });
        });
        // 应用高亮
        highlightedProvinces.forEach(pid => {
            const prov = provinces.find(p => p.id === pid);
            const polys = provincePolygonsRef.current.get(pid);
            if (!prov || !polys) return;
            polys.forEach(poly => {
                poly.setOptions({
                    fillOpacity: 0.9,
                    strokeWeight: 3,
                    strokeColor: '#FF7A00'
                });
            });
        });
    }, [highlightedProvinces, map, provinces]);

    // 检查是否可以安全使用高德地图
    if (!canUseAmap) {
        return (
            <div className={`relative ${className}`}>
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
        <div className={`relative ${className}`}>
            <div
                ref={mapRef}
                style={{ height, width: '100%' }}
                className="rounded-lg shadow-lg"
            />

            {/* 地图图例 - 移动到右上角 */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-30">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">{t('phase2.home.sections.map.statistics.status.completed')}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">{t('phase2.home.sections.map.statistics.status.active')}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">{t('phase2.home.sections.map.statistics.status.planning')}</span>
                    </div>
                </div>
            </div>

            {/* 省份信息提示 */}
            {selectedProvince && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs z-40">
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {t(`provinces.${selectedProvince.id}.name`) as string || selectedProvince.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {t('phase2.home.sections.map.statistics.status.label')}: {getProvinceStatus(selectedProvince)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        {t('common.labels.totalGroups')}: {selectedProvince.totalGroups}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        {t('common.labels.activeGroups')}: {selectedProvince.activeGroups}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        {t('common.labels.completedGroups')}: {selectedProvince.completedGroups}
                    </p>
                    <p className="text-sm text-gray-600">
                        {t(`provinces.${selectedProvince.id}.description`) as string || selectedProvince.description}
                    </p>
                </div>
            )}

            {/* 省份数据统计 */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="text-sm text-gray-700">
                    <div className="font-semibold mb-2">{t('phase2.home.sections.map.statistics.title')}</div>
                    <div className="space-y-1">
                        <div>{t('phase2.home.sections.map.statistics.totalProvinces')}: {provinces.length}</div>
                        <div>{t('phase2.home.sections.map.statistics.status.active')}: {provinces.filter(p => p.activeGroups > 0).length}</div>
                        <div>{t('phase2.home.sections.map.statistics.status.completed')}: {provinces.filter(p => p.completedGroups > 0).length}</div>
                        <div>{t('phase2.home.sections.map.statistics.status.planning')}: {provinces.filter(p => p.activeGroups === 0 && p.completedGroups === 0).length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phase2MapComponent;
