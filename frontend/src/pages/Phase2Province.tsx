import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Users,
    Camera,
    Clock,
    CheckCircle,
    PlayCircle,
    PauseCircle,
    Star,
    Filter,
    Search
} from 'lucide-react';
import { getProvinceById } from '../config/phase2Data';
import ProvinceMapComponent from '../components/ProvinceMapComponent';
import { useTranslation } from '../i18n/hooks';
import { useProvinceTranslation, translateCityName, translateGroupInfo } from '../i18n/utils';

const Phase2Province: React.FC = () => {
    const { provinceId } = useParams<{ provinceId: string }>();
    const navigate = useNavigate();
    const { t, isLoading, language } = useTranslation();
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const province = getProvinceById(provinceId || '');
    const provinceTranslation = useProvinceTranslation(provinceId || '');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                    <p className="text-gray-600">{t('common.messages.loading') as string}</p>
                </div>
            </div>
        );
    }

    if (!province) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('phase2.province.notFound') as string}</h1>
                    <Link to="/phase2" className="text-orange-600 hover:text-orange-700">
                        {t('phase2.province.back') as string}
                    </Link>
                </div>
            </div>
        );
    }

    // 过滤小组
    const filteredGroups = province.groups.filter(group => {
        const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <PlayCircle className="h-5 w-5 text-orange-500" />;
            case 'planning':
                return <Clock className="h-5 w-5 text-gray-400" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return <PauseCircle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return t('common.status.active') as string;
            case 'planning':
                return t('common.status.planning') as string;
            case 'completed':
                return t('common.status.completed') as string;
            default:
                return t('common.status.unknown') as string;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* 头部导航 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/phase2')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            {t('phase2.province.back') as string}
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${province.color} flex items-center justify-center text-white text-xl font-bold`}>
                                {province.shortName}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{provinceTranslation.name}</h1>
                                <p className="text-gray-600">{provinceTranslation.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 省份统计 */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{province.totalGroups}</div>
                            <div className="text-sm text-gray-500">{t('phase2.province.stats.totalGroups') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{province.activeGroups}</div>
                            <div className="text-sm text-gray-500">{t('phase2.province.stats.active') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{province.completedGroups}</div>
                            <div className="text-sm text-gray-500">{t('phase2.province.stats.completed') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{province.totalGroups * 6}</div>
                            <div className="text-sm text-gray-500">{t('phase2.province.stats.totalParticipants') as string}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 省份地图 */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('phase2.province.map.title') as string}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t('phase2.province.map.description', { province: provinceTranslation.name }) as string}
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                        <ProvinceMapComponent
                            province={province}
                            height="500px"
                            onCityClick={(city) => {
                                console.log('点击城市:', city);
                                // 可以在这里添加城市点击的处理逻辑
                            }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* 搜索和筛选 */}
            <section className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* 搜索框 */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('phase2.province.search.placeholder') as string}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* 状态筛选 */}
                        <div className="flex gap-2">
                            {[
                                { key: 'all', labelKey: 'common.status.all', icon: Filter },
                                { key: 'active', labelKey: 'common.status.active', icon: PlayCircle },
                                { key: 'planning', labelKey: 'common.status.planning', icon: Clock },
                                { key: 'completed', labelKey: 'common.status.completed', icon: CheckCircle }
                            ].map(({ key, labelKey, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterStatus(key as any)}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === key
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {t(labelKey) as string}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 小组列表 */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('phase2.province.groups.title') as string}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group"
                            >
                                <Link to={`/phase2/province/${province.id}/group/${group.id}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        {/* 小组标识 */}
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-2xl font-bold`}>
                                            {group.id}
                                        </div>

                                        {/* 小组信息 */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{translateGroupInfo(province.id, group.id, t).name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 text-center">{translateGroupInfo(province.id, group.id, t).description || group.description}</p>

                                        {/* 路线信息 */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span className="truncate">{translateCityName(group.startLocation, t, language)}</span>
                                                <span className="mx-1">→</span>
                                                <span className="truncate">{translateCityName(group.endLocation, t, language)}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Users className="h-3 w-3 mr-1" />
                                                <span>{t('phase2.province.groups.participants', { count: group.participantCount }) as string}</span>
                                            </div>
                                        </div>

                                        {/* 状态和进度 */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                {getStatusIcon(group.status)}
                                                <span className="ml-2 text-sm font-medium text-gray-700">
                                                    {getStatusText(group.status)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {t('phase2.province.groups.relay', { current: group.currentRelay, total: group.participantCount }) as string}
                                            </div>
                                        </div>

                                        {/* 进度条 */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>{t('phase2.province.groups.progress') as string}</span>
                                                <span>{Math.round((group.currentRelay / group.participantCount) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full bg-gradient-to-r ${group.color}`}
                                                    style={{ width: `${(group.currentRelay / group.participantCount) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* 查看详情按钮 */}
                                        <div className="text-center">
                                            <span className="inline-flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                                                {t('phase2.province.groups.viewDetails') as string}
                                                <Camera className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredGroups.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('phase2.province.search.noResults.title') as string}</h3>
                            <p className="text-gray-500">{t('phase2.province.search.noResults.description') as string}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 省份特色介绍 */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            {t('phase2.province.features.title', { province: provinceTranslation.name }) as string}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('phase2.province.features.culture.title') as string}</h3>
                                <p className="text-gray-600 mb-4">
                                    {provinceTranslation.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {((t('phase2.province.features.culture.tags', { returnObjects: true }) as unknown) as string[]).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('phase2.province.features.shooting.title') as string}</h3>
                                <ul className="space-y-2 text-gray-600">
                                    {((t('phase2.province.features.shooting.tips', { returnObjects: true }) as unknown) as string[]).map((tip, index) => (
                                        <li key={index} className="flex items-start">
                                            <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Phase2Province;

