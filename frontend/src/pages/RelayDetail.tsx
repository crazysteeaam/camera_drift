import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, MessageCircle, ArrowLeft, Heart, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectData } from '../config/projectData';
import AmapComponent from '../components/AmapComponent';
import FullscreenPhotoViewer from '../components/FullscreenPhotoViewer';
import SmartImage from '../components/SmartImage';
import { useNavigate } from "react-router-dom";
import { downloadImageAsset, downloadImageAssets } from '../utils/imageDownload';

const RelayDetail: React.FC = () => {
    const { groupId, relayId } = useParams<{ groupId: string; relayId: string }>();
    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const navigate = useNavigate();

    // 获取数据
    const group = projectData.find(g => g.id === groupId);
    const relay = group?.relays.find(r => r.id === parseInt(relayId || '0'));

    // 添加类型检查
    if (!groupId || !relayId) {
        return <div>参数错误</div>;
    }

    if (!relay) {
        return <div>接力棒不存在</div>;
    }





    const nextPhoto = () => {
        const nextIndex = currentPhotoIndex + 1;
        if (nextIndex >= relay.photos.length) {
            // 已经是最后一张照片，跳转到下一棒
            if (group) {
                const currentRelayIndex = group.relays.findIndex(r => r.id === relay.id);
                const nextRelay = group.relays[currentRelayIndex + 1];
                
                if (nextRelay) {
                    // 跳转到下一棒的第一张照片
                    // window.location.href = `/group/${groupId}/relay/${nextRelay.id}`;
                    navigate(`/group/${groupId}/relay/${nextRelay.id}`);
                    setCurrentPhotoIndex(0);
                } else {
                    // 已经是最后一棒，回到第一张照片
                    setCurrentPhotoIndex(0);
                }
            } else {
                // 如果group不存在，回到第一张照片
                setCurrentPhotoIndex(0);
            }
        } else {
            setCurrentPhotoIndex(nextIndex);
        }
    };

    const prevPhoto = () => {
        const prevIndex = currentPhotoIndex - 1;
        if (prevIndex < 0) {
            // 已经是第一张照片，跳转到上一棒
            if (group) {
                const currentRelayIndex = group.relays.findIndex(r => r.id === relay.id);
                const prevRelay = group.relays[currentRelayIndex - 1];
                
                if (prevRelay) {
                    // 跳转到上一棒的最后一张照片
                    // window.location.href = `/group/${groupId}/relay/${prevRelay.id}`;
                    navigate(`/group/${groupId}/relay/${prevRelay.id}`);
                } else {
                    // 已经是第一棒，回到最后一张照片
                    setCurrentPhotoIndex(relay.photos.length - 1);
                }
            } else {
                // 如果group不存在，回到最后一张照片
                setCurrentPhotoIndex(relay.photos.length - 1);
            }
        } else {
            setCurrentPhotoIndex(prevIndex);
        }
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
                            <div 
                                className="aspect-square overflow-hidden rounded-xl shadow-2xl cursor-pointer"
                                onClick={() => setIsFullscreenOpen(true)}
                            >
                                <SmartImage
                                    asset={relay.photos[currentPhotoIndex]}
                                    variant="preview"
                                    alt={`${relay.name} - 照片 ${currentPhotoIndex + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* 点击提示 */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium">
                                        点击查看大图
                                    </div>
                                </div>
                            </div>

                            {/* 照片导航 */}
                            {relay.photos.length >= 1 && (
                                <>
                                    <button
                                        onClick={prevPhoto}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200"
                                        title={currentPhotoIndex === 0 ? "跳转到上一棒" : "上一张照片"}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextPhoto}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200"
                                        title={currentPhotoIndex === relay.photos.length - 1 ? "跳转到下一棒" : "下一张照片"}
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
                                    
                                    {/* 跳转提示 */}
                                    {currentPhotoIndex === relay.photos.length - 1 && group && (
                                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            点击右箭头跳转到下一棒
                                        </div>
                                    )}
                                    {currentPhotoIndex === 0 && group && (
                                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            点击左箭头跳转到上一棒
                                        </div>
                                    )}
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
                                    {/* <button className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200">
                                        <Share2 className="h-5 w-5" />
                                    </button> */}
                                    <button 
                                        onClick={() => {
                                            if (relay.photos.length === 1) {
                                                // 单张照片直接下载原图
                                                const filename = `${relay.name}_${relay.participant}.jpg`;
                                                void downloadImageAsset(relay.photos[0], filename);
                                            } else {
                                                // 多张照片显示下载选项
                                                setShowDownloadOptions(true);
                                            }
                                        }}
                                        disabled={isDownloading}
                                        className={`p-3 rounded-full transition-all duration-200 ${
                                            isDownloading 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-white/80 text-gray-600 hover:bg-green-500 hover:text-white'
                                        }`}
                                    >
                                        {isDownloading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <Download className="h-5 w-5" />
                                        )}
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
                                        <div key={index} className="relative group">
                                            <button
                                                onClick={() => setCurrentPhotoIndex(index)}
                                                className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 w-full ${index === currentPhotoIndex ? 'ring-2 ring-blue-500' : 'hover:scale-105'
                                                    }`}
                                            >
                                                <SmartImage
                                                    asset={photo}
                                                    variant="thumbnail"
                                                    alt={`照片 ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                            {/* 全屏查看按钮 */}
                                            <button
                                                onClick={() => {
                                                    setCurrentPhotoIndex(index);
                                                    setIsFullscreenOpen(true);
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                                                title="全屏查看"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
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

                        {/* 地图组件 */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">拍摄位置</h3>
                                <Link
                                    to={`/route-map/${groupId}`}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    查看完整路线 →
                                </Link>
                            </div>
                            <div className="h-64 rounded-lg overflow-hidden">
                                <AmapComponent
                                    relays={group?.relays || []}
                                    currentRelayId={relay.id}
                                    height="100%"
                                    showRoute={true}
                                    showAllMarkers={true}
                                />
                            </div>
                            <div className="mt-3 text-sm text-gray-500 text-center">
                                {relay.province} {relay.city} • 坐标: {relay.coordinates.lat.toFixed(4)}, {relay.coordinates.lng.toFixed(4)}
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

                {/* 下载选项悬浮显示 */}
                {showDownloadOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDownloadOptions(false)}
                    >
                        <div
                            className="bg-white rounded-xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center mb-4">
                                <Download className="h-6 w-6 text-green-500 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">下载照片</h3>
                            </div>
                            
                            <div className="space-y-4 mb-6">
                                <button
                                    onClick={async () => {
                                        setShowDownloadOptions(false);
                                        setIsDownloading(true);
                                        setDownloadProgress(0);
                                        
                                        try {
                                            await downloadImageAssets(
                                                relay.photos, 
                                                (_, index) => `${relay.name}_${relay.participant}_${index + 1}.jpg`,
                                                (progress) => setDownloadProgress(progress)
                                            );
                                        } finally {
                                            setIsDownloading(false);
                                            setDownloadProgress(0);
                                        }
                                    }}
                                    disabled={isDownloading}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {isDownloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            下载中... {Math.round(downloadProgress)}%
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5 mr-2" />
                                            下载全部照片 ({relay.photos.length}张)
                                        </>
                                    )}
                                </button>
                                
                                {isDownloading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${downloadProgress}%` }}
                                        ></div>
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => {
                                        setShowDownloadOptions(false);
                                        const filename = `${relay.name}_${relay.participant}_当前照片.jpg`;
                                        void downloadImageAsset(relay.photos[currentPhotoIndex], filename);
                                    }}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Download className="h-5 w-5 mr-2" />
                                    下载当前照片
                                </button>
                                
                                <div className="text-sm text-gray-600 text-center">
                                    批量下载将逐张下载所有照片，每张间隔0.5秒
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <button
                                    onClick={() => setShowDownloadOptions(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 全屏照片查看器 */}
                <FullscreenPhotoViewer
                    photos={relay.photos}
                    currentIndex={currentPhotoIndex}
                    isOpen={isFullscreenOpen}
                    onClose={() => setIsFullscreenOpen(false)}
                    onIndexChange={setCurrentPhotoIndex}
                    relayName={relay.name}
                    participant={relay.participant}
                />
            </div>
        </div>
    );
};

export default RelayDetail;

