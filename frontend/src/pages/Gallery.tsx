import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Share2, Download, Filter } from 'lucide-react';

const Gallery: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());

    // 模拟照片数据
    const photos = [
        { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', title: '山间晨雾', group: '自然风光', date: '2024-01-15' },
        { id: 2, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', title: '森林小径', group: '自然风光', date: '2024-01-14' },
        { id: 3, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', title: '城市夜景', group: '城市生活', date: '2024-01-13' },
        { id: 4, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', title: '海边日落', group: '自然风光', date: '2024-01-12' },
        { id: 5, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', title: '咖啡馆时光', group: '城市生活', date: '2024-01-11' },
        { id: 6, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', title: '花海漫步', group: '自然风光', date: '2024-01-10' },
    ];

    const filters = [
        { key: 'all', label: '全部' },
        { key: 'nature', label: '自然风光' },
        { key: 'city', label: '城市生活' },
        { key: 'portrait', label: '人像' },
    ];

    const toggleLike = (photoId: number) => {
        const newLiked = new Set(likedPhotos);
        if (newLiked.has(photoId)) {
            newLiked.delete(photoId);
        } else {
            newLiked.add(photoId);
        }
        setLikedPhotos(newLiked);
    };

    const filteredPhotos = selectedFilter === 'all'
        ? photos
        : photos.filter(photo => photo.group.includes(filters.find(f => f.key === selectedFilter)?.label || ''));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 页面标题 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">照片画廊</h1>
                    <p className="text-lg text-gray-600">记录每一个精彩瞬间</p>
                </motion.div>

                {/* 过滤器 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-8"
                >
                    <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-lg">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setSelectedFilter(filter.key)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedFilter === filter.key
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* A1组图片测试区域 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">A1组图片测试</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { src: '/photos/A1/000001.JPG', title: 'A1-001' },
                            { src: '/photos/A1/000002.JPG', title: 'A1-002' },
                            { src: '/photos/A1/000003.JPG', title: 'A1-003' },
                            { src: '/photos/A1/000004.JPG', title: 'A1-004' }
                        ].map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={photo.src}
                                        alt={photo.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            console.error('图片加载失败:', photo.src);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={() => console.log('图片加载成功:', photo.src)}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{photo.title}</h3>
                                    <p className="text-sm text-gray-600">路径: {photo.src}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 照片网格 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            {/* 照片信息 */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{photo.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{photo.group}</p>
                                <p className="text-xs text-gray-500">{photo.date}</p>
                            </div>

                            {/* 操作按钮 */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => toggleLike(photo.id)}
                                        className={`p-2 rounded-full ${likedPhotos.has(photo.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                                            } transition-all duration-200`}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-green-500 hover:text-white transition-all duration-200">
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 空状态 */}
                {filteredPhotos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">没有找到符合条件的照片</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
