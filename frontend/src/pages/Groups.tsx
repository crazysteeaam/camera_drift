import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Camera, MapPin, Clock, UserPlus } from 'lucide-react';

interface Group {
    id: number;
    name: string;
    description: string;
    currentParticipants: number;
    maxParticipants: number;
    location: string;
    startDate: string;
    status: 'recruiting' | 'active' | 'completed';
}

const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([
        {
            id: 1,
            name: '经典电影接力小组',
            description: '专注于经典黑白电影的接力观看，体验电影艺术的永恒魅力',
            currentParticipants: 4,
            maxParticipants: 6,
            location: '北京',
            startDate: '2024-01-15',
            status: 'recruiting'
        },
        {
            id: 2,
            name: '科幻电影探索队',
            description: '探索科幻电影的无限可能，从经典到现代，感受科技与想象的碰撞',
            currentParticipants: 6,
            maxParticipants: 6,
            location: '上海',
            startDate: '2024-01-10',
            status: 'active'
        },
        {
            id: 3,
            name: '文艺片爱好者联盟',
            description: '深度探讨文艺片的艺术价值，分享观影感受和人生感悟',
            currentParticipants: 3,
            maxParticipants: 6,
            location: '广州',
            startDate: '2024-01-20',
            status: 'recruiting'
        }
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'recruiting':
                return 'bg-green-100 text-green-800';
            case 'active':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'recruiting':
                return '招募中';
            case 'active':
                return '进行中';
            case 'completed':
                return '已完成';
            default:
                return '未知';
        }
    };

    return (
        <div className="min-h-screen bg-film-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-serif font-bold text-film-900 mb-4">
                        电影接力小组
                    </h1>
                    <p className="text-xl text-film-700 max-w-2xl mx-auto">
                        加入或创建电影接力小组，与志同道合的朋友一起体验独特的观影方式
                    </p>
                </motion.div>

                {/* Create Group Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="inline-flex items-center px-6 py-3 bg-vintage-600 text-white font-medium rounded-lg hover:bg-vintage-700 transition-colors duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        创建新小组
                    </button>
                </motion.div>

                {/* Groups Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group, index) => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-film-900">
                                        {group.name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group.status)}`}>
                                        {getStatusText(group.status)}
                                    </span>
                                </div>

                                <p className="text-film-700 mb-4 leading-relaxed">
                                    {group.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-film-600">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>{group.currentParticipants} / {group.maxParticipants} 人</span>
                                    </div>
                                    <div className="flex items-center text-sm text-film-600">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>{group.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-film-600">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>开始于 {group.startDate}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {group.status === 'recruiting' && group.currentParticipants < group.maxParticipants ? (
                                        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-vintage-600 text-white text-sm font-medium rounded-md hover:bg-vintage-700 transition-colors duration-200">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            加入小组
                                        </button>
                                    ) : (
                                        <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-film-200 text-film-800 text-sm font-medium rounded-md cursor-not-allowed">
                                            {group.status === 'active' ? '进行中' : '已满员'}
                                        </button>
                                    )}

                                    <button className="inline-flex items-center justify-center px-4 py-2 bg-film-100 text-film-700 text-sm font-medium rounded-md hover:bg-film-200 transition-colors duration-200">
                                        <Camera className="mr-2 h-4 w-4" />
                                        查看照片
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {groups.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Users className="mx-auto h-12 w-12 text-film-400 mb-4" />
                        <h3 className="text-lg font-medium text-film-900 mb-2">
                            还没有小组
                        </h3>
                        <p className="text-film-600 mb-6">
                            创建第一个电影接力小组，开始你的观影之旅
                        </p>
                        <button className="inline-flex items-center px-6 py-3 bg-vintage-600 text-white font-medium rounded-lg hover:bg-vintage-700 transition-colors duration-200">
                            <Plus className="mr-2 h-5 w-5" />
                            创建小组
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Groups;
