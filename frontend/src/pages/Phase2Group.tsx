import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Camera,
    Clock,
    CheckCircle,
    PlayCircle,
    PauseCircle,
    Star,
    MessageSquare,
    Calendar,
    Sun,
    Film
} from 'lucide-react';
import { getGroupById } from '../config/phase2Data';
import MessageGallery from '../components/MessageGallery';
import SmartImage from '../components/SmartImage';
import { useTranslation } from '../i18n/hooks';
import { translateRelayName, translateCityName, translateGroupInfo, translateMessage } from '../i18n/utils';

const Phase2Group: React.FC = () => {
    const { provinceId, groupId } = useParams<{ provinceId: string; groupId: string }>();
    const navigate = useNavigate();
    const { t, isLoading, language } = useTranslation();
    // 与第一期保持一致的卡片式列表 + 跳转详页，无本页选中状态

    const group = getGroupById(provinceId || '', groupId || '');

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

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('phase2.group.notFound') as string}</h1>
                    <Link to="/phase2" className="text-orange-600 hover:text-orange-700">
                        {t('phase2.group.backToHome') as string}
                    </Link>
                </div>
            </div>
        );
    }

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

    const getProgressPercentage = () => {
        return Math.round((group.currentRelay / group.participantCount) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* 头部导航 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(`/phase2/province/${provinceId}`)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            {t('phase2.group.back') as string}
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-xl font-bold`}>
                                {group.id}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{translateGroupInfo(provinceId || '', group.id, t).name}</h1>
                                <p className="text-gray-600">{translateGroupInfo(provinceId || '', group.id, t).description || group.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 小组概览 */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{group.participantCount}</div>
                            <div className="text-sm text-gray-500">{t('phase2.group.stats.totalParticipants') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{group.currentRelay}</div>
                            <div className="text-sm text-gray-500">{t('phase2.group.stats.currentRelay') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{getProgressPercentage()}%</div>
                            <div className="text-sm text-gray-500">{t('phase2.group.stats.progress') as string}</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center">
                                {getStatusIcon(group.status)}
                                <span className="ml-2 text-lg font-medium text-gray-700">
                                    {getStatusText(group.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 路线信息 */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-lg font-medium text-gray-900">{translateCityName(group.startLocation, t)}</span>
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-gray-900">{translateCityName(group.endLocation, t)}</span>
                                <MapPin className="h-5 w-5 text-gray-400 ml-2" />
                            </div>
                        </div>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>{t('phase2.group.route.progress') as string}</span>
                            <span>{t('phase2.group.route.relay', { current: group.currentRelay, total: group.participantCount }) as string}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full bg-gradient-to-r ${group.color}`}
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 接力棒列表（与第一期一致的卡片布局） */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('phase2.group.relays.title') as string}</h2>
                        <p className="text-lg text-gray-600">{t('phase2.group.relays.description') as string}</p>
                    </motion.div>

                    {group.relays.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.relays.map((relay, index) => (
                                <motion.div
                                    key={relay.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link to={`/phase2/group/${provinceId}/${groupId}/relay/${relay.id}`}>
                                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="aspect-square overflow-hidden">
                                                {relay.photos && relay.photos[0] && typeof relay.photos[0] === 'string' ? (
                                                    <SmartImage originalPath={relay.photos[0]} variant="thumbnail" alt={relay.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">{t('phase2.group.relays.noPhoto') as string}</div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-semibold text-gray-900">{translateRelayName(relay.id, t)}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${group.color} text-white`}>
                                                        {relay.participant}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        <span>{translateCityName(relay.location, t, language)}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        <span>{relay.date}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-3">{translateMessage(provinceId || '', groupId || '', relay.id, relay.message, t)}</p>
                                                <div className="mt-3 text-xs text-gray-500">{t('phase2.group.relays.photoCount', { count: relay.photos ? relay.photos.length : 0 }) as string}</div>
                                                <div className="mt-4 text-center">
                                                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                                        {t('phase2.group.relays.viewDetails') as string}
                                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Clock className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('phase2.group.relays.notStarted.title') as string}</h3>
                            <p className="text-gray-500">{t('phase2.group.relays.notStarted.description') as string}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 小组特色介绍 */}
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
                            {t('phase2.group.features.title', { group: translateGroupInfo(provinceId || '', group.id, t).name }) as string}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('phase2.group.features.route.title') as string}</h3>
                                <p className="text-gray-600 mb-4">
                                    {translateGroupInfo(provinceId || '', group.id, t).description || group.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{t('phase2.group.features.route.start', { location: translateCityName(group.startLocation, t) }) as string}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{t('phase2.group.features.route.end', { location: translateCityName(group.endLocation, t) }) as string}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('phase2.group.features.participation.title') as string}</h3>
                                <ul className="space-y-2 text-gray-600">
                                    {((t('phase2.group.features.participation.tips', { returnObjects: true }) as unknown) as string[]).map((tip, index) => (
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

export default Phase2Group;
