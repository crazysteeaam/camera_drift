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

const Phase2Province: React.FC = () => {
    const { provinceId } = useParams<{ provinceId: string }>();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const province = getProvinceById(provinceId || '');

    if (!province) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">省份不存在</h1>
                    <Link to="/phase2" className="text-orange-600 hover:text-orange-700">
                        返回首页
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
                return '进行中';
            case 'planning':
                return '计划中';
            case 'completed':
                return '已完成';
            default:
                return '未知';
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
                            返回首页
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${province.color} flex items-center justify-center text-white text-xl font-bold`}>
                                {province.shortName}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{province.name}</h1>
                                <p className="text-gray-600">{province.description}</p>
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
                            <div className="text-sm text-gray-500">总小组数</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{province.activeGroups}</div>
                            <div className="text-sm text-gray-500">进行中</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{province.completedGroups}</div>
                            <div className="text-sm text-gray-500">已完成</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{province.totalGroups * 6}</div>
                            <div className="text-sm text-gray-500">总参与者</div>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">地级市分布图</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            探索{province.name}内各城市的接力情况，点击标记查看详细信息
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
                                placeholder="搜索小组..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* 状态筛选 */}
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: '全部', icon: Filter },
                                { key: 'active', label: '进行中', icon: PlayCircle },
                                { key: 'planning', label: '计划中', icon: Clock },
                                { key: 'completed', label: '已完成', icon: CheckCircle }
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterStatus(key as any)}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === key
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 小组列表 */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">小组列表</h2>

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
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{group.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 text-center">{group.description}</p>

                                        {/* 路线信息 */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span className="truncate">{group.startLocation}</span>
                                                <span className="mx-1">→</span>
                                                <span className="truncate">{group.endLocation}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Users className="h-3 w-3 mr-1" />
                                                <span>{group.participantCount} 位参与者</span>
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
                                                {group.currentRelay}/{group.participantCount} 棒
                                            </div>
                                        </div>

                                        {/* 进度条 */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>进度</span>
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
                                                查看详情
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的小组</h3>
                            <p className="text-gray-500">请尝试调整搜索条件或筛选器</p>
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
                            {province.name}特色
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">文化特色</h3>
                                <p className="text-gray-600 mb-4">
                                    {province.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['历史文化', '自然风光', '现代发展', '人文风情'].map((tag, index) => (
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">拍摄建议</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                        记录当地的历史建筑和文化遗迹
                                    </li>
                                    <li className="flex items-start">
                                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                        捕捉自然风光和季节变化
                                    </li>
                                    <li className="flex items-start">
                                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                        展现现代城市的发展面貌
                                    </li>
                                    <li className="flex items-start">
                                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                        记录当地人的日常生活
                                    </li>
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

