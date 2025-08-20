import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, MessageCircle, ArrowLeft, Heart, Share2, Download, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectData } from '../config/projectData';

const RelayDetail: React.FC = () => {
    const { groupId, relayId } = useParams<{ groupId: string; relayId: string }>();
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // 添加类型检查
    if (!groupId || !relayId) {
        return <div>参数错误</div>;
    }

    const group = projectData.find(g => g.id === groupId);
    const relay = group?.relays.find(r => r.id === parseInt(relayId));

    if (!relay) {
        return <div>接力棒不存在</div>;
    }

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % relay.photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + relay.photos.length) % relay.photos.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* 返回按钮 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    to={`/group/${groupId}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回小组
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 左侧：照片展示 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* 主照片 */}
                        <div className="relative group">
                            <div className="aspect-square overflow-hidden rounded-xl shadow-2xl">
                                <img
                                    src={relay.photos[currentPhotoIndex]}
                                    alt={`${relay.name} - 照片 ${currentPhotoIndex + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* 照片导航 */}
                            {relay.photos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPhoto}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextPhoto}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>

                                    {/* 照片指示器 */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {relay.photos.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPhotoIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* 悬浮操作按钮 */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`p-3 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                                            } transition-all duration-200`}
                                    >
                                        <Heart className="h-5 w-5" />
                                    </button>
                                    <button className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                    <button className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-green-500 hover:text-white transition-all duration-200">
                                        <Download className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* 留言提示 */}
                            <div className="absolute bottom-4 left-4">
                                <button
                                    onClick={() => setShowMessage(!showMessage)}
                                    className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* 照片信息 */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">拍摄信息</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">相机型号</span>
                                    <p className="font-medium">{relay.camera}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">胶片类型</span>
                                    <p className="font-medium">{relay.film}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">拍摄时间</span>
                                    <p className="font-medium">{relay.time}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">天气状况</span>
                                    <p className="font-medium">{relay.weather}</p>
                                </div>
                            </div>
                        </div>

                        {/* 照片缩略图 */}
                        {relay.photos.length > 1 && (
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">所有照片</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {relay.photos.map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPhotoIndex(index)}
                                            className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 ${index === currentPhotoIndex ? 'ring-2 ring-blue-500' : 'hover:scale-105'
                                                }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`照片 ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* 右侧：详细信息 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* 接力棒信息 */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                                    {relayId}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{relay.name}</h2>
                                    <p className="text-blue-600 font-medium">{relay.participant}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                                    <span>{relay.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                                    <span>{relay.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* 留言内容 */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                <MessageCircle className="h-6 w-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">参与者留言</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{relay.message}</p>

                            {/* 标签 */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {relay.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 接力信息 */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">接力信息</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">下一站</p>
                                    <p className="font-medium text-gray-900">{relay.nextLocation}</p>
                                </div>
                                <ArrowLeft className="h-6 w-6 text-blue-500 transform rotate-180" />
                                <div>
                                    <p className="text-sm text-gray-600">下一位参与者</p>
                                    <p className="font-medium text-gray-900">{relay.nextParticipant}</p>
                                </div>
                            </div>
                        </div>

                        {/* 地图占位符 */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">拍摄位置</h3>
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">地图将在这里显示</p>
                                <p className="text-gray-400 text-sm">坐标: {relay.coordinates.lat}, {relay.coordinates.lng}</p>
                                <p className="text-gray-400 text-sm mt-2">{relay.province} {relay.city}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 留言悬浮显示 */}
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowMessage(false)}
                    >
                        <div
                            className="bg-white rounded-xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center mb-4">
                                <MessageCircle className="h-6 w-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">参与者留言</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">{relay.message}</p>
                            <div className="text-right">
                                <button
                                    onClick={() => setShowMessage(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RelayDetail;

