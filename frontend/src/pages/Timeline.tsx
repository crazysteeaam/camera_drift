import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Camera } from 'lucide-react';

const Timeline: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState('2024');

    // 模拟时间线数据
    const timelineEvents = [
        {
            id: 1,
            year: '2024',
            month: '01',
            title: '新年摄影之旅',
            description: '在雪山的见证下，我们迎来了新的一年',
            location: '长白山',
            participants: ['张三', '李四', '王五'],
            photos: 24,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        },
        {
            id: 2,
            year: '2023',
            month: '12',
            title: '冬日暖阳',
            description: '在寒冷的冬天里，寻找那一抹温暖的阳光',
            location: '哈尔滨',
            participants: ['张三', '李四'],
            photos: 18,
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
        },
        {
            id: 3,
            year: '2023',
            month: '11',
            title: '秋色满园',
            description: '金秋时节，漫步在五彩斑斓的秋色中',
            location: '香山',
            participants: ['张三', '李四', '王五', '赵六'],
            photos: 32,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        },
        {
            id: 4,
            year: '2023',
            month: '10',
            title: '海边日落',
            description: '在海边等待最美的日落，记录下这美好的时刻',
            location: '青岛',
            participants: ['张三', '李四'],
            photos: 15,
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
        }
    ];

    const years = ['2024', '2023', '2022', '2021'];

    const filteredEvents = timelineEvents.filter(event => event.year === selectedYear);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 页面标题 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">时光记忆</h1>
                    <p className="text-lg text-gray-600">记录每一个值得纪念的时刻</p>
                </motion.div>

                {/* 年份选择器 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-12"
                >
                    <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-lg">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 ${selectedYear === year
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-600 hover:bg-orange-100'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* 时间线 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    {/* 时间线轴线 */}
                    <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-orange-300"></div>

                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative mb-12 flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                }`}
                        >
                            {/* 时间线节点 */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>

                            {/* 事件卡片 */}
                            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {/* 事件图片 */}
                                    <div className="aspect-video overflow-hidden rounded-lg mb-4">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* 事件信息 */}
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                        <p className="text-gray-600">{event.description}</p>

                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {event.year}-{event.month}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {event.location}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Users className="h-4 w-4 mr-1" />
                                                {event.participants.join(', ')}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Camera className="h-4 w-4 mr-1" />
                                                {event.photos} 张照片
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 空状态 */}
                {filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">这一年还没有记录任何事件</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Timeline;

