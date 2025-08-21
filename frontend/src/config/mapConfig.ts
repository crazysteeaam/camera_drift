// 高德地图配置
export const MAP_CONFIG = {
    // 高德地图API密钥 - 请替换为你的实际密钥
    // 申请地址: https://lbs.amap.com/dev/key/app
    AMAP_KEY: '5934d3bbd34e2a0eb8f3de21c5a0c948',
    
    // 地图默认配置
    DEFAULT_CENTER: [120.1551, 30.2741], // 杭州坐标
    DEFAULT_ZOOM: 8,
    MAP_STYLE: 'amap://styles/normal',
    
    // 插件配置
    PLUGINS: [
        'AMap.ToolBar',
        'AMap.Scale', 
        'AMap.HawkEye',
        'AMap.MapType',
        'AMap.Geolocation'
    ],
    
    // 标记点样式
    MARKER_STYLES: {
        current: {
            color: '#E64444', // 红色 - 当前接力棒
            size: 32
        },
        normal: {
            color: '#4C8BF0', // 蓝色 - 其他接力棒
            size: 32
        }
    },
    
    // 路线样式
    ROUTE_STYLE: {
        strokeColor: '#4C8BF0',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
    }
};

// 获取高德地图API密钥
export const getAmapKey = (): string => {
    // 优先使用环境变量
    const envKey = process.env.REACT_APP_AMAP_KEY;
    if (envKey) {
        return envKey;
    }
    
    // 使用配置文件中的密钥
    return MAP_CONFIG.AMAP_KEY;
};

// 检查API密钥是否已配置
export const isAmapKeyConfigured = (): any => {
    const key = getAmapKey();
    return key && key !== 'your_amap_key_here';
};
