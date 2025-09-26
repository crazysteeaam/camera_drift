import React from 'react';
import Phase2MapComponent from './Phase2MapComponent';
import { Phase2Province } from '../config/phase2Data';

interface ProvinceData {
    id: string;
    name: string;
    province: string;
    coordinates: { lat: number; lng: number };
    status: 'active' | 'planning' | 'completed';
    groupCount: number;
    activeGroups: number;
}

interface ChinaMapProps {
    cities?: ProvinceData[];
    onCityClick?: (city: ProvinceData) => void;
    highlightedCities?: string[];
    className?: string;
}

const ChinaMap: React.FC<ChinaMapProps> = ({
    cities = [],
    onCityClick,
    highlightedCities = [],
    className = ''
}) => {
    // 将cities转换为provinces格式
    const provinces: Phase2Province[] = cities.map(city => ({
        id: city.id,
        name: city.name,
        shortName: city.name.charAt(city.name.length - 1), // 取最后一个字符作为简称
        description: '',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        groups: [],
        totalGroups: city.groupCount,
        activeGroups: city.status === 'active' ? city.activeGroups : 0,
        completedGroups: city.status === 'completed' ? city.groupCount : 0,
        coordinates: city.coordinates
    }));

    // 处理省份点击
    const handleProvinceClick = (province: Phase2Province) => {
        const city = cities.find(c => c.id === province.id);
        if (city && onCityClick) {
            onCityClick(city);
        }
    };

    return (
        <Phase2MapComponent
            provinces={provinces}
            onProvinceClick={handleProvinceClick}
            highlightedProvinces={highlightedCities}
            className={className}
        />
    );
};

export default ChinaMap;
