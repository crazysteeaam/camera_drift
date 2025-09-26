import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, MessageCircle, ArrowLeft, Heart, Download, ChevronLeft, ChevronRight, ArrowRight, Eye } from 'lucide-react';
import { getGroupById, Phase2Relay } from '../config/phase2Data';
import AmapComponent from '../components/AmapComponent';
import FullscreenPhotoViewer from '../components/FullscreenPhotoViewer';
import SmartImage from '../components/SmartImage';
import MessageGallery from '../components/MessageGallery';

const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadAllImages = async (photos: string[], relayName: string, participant: string, onProgress?: (progress: number) => void) => {
    for (let i = 0; i < photos.length; i++) {
        const filename = `${relayName}_${participant}_${i + 1}.jpg`;
        downloadImage(photos[i], filename);
        onProgress?.(((i + 1) / photos.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    onProgress?.(100);
};

const Phase2RelayDetail: React.FC = () => {
    const { provinceId, groupId, relayId } = useParams<{ provinceId: string; groupId: string; relayId: string }>();
    const navigate = useNavigate();

    const group = getGroupById(provinceId || '', groupId || '');
    const relay: Phase2Relay | undefined = group?.relays.find(r => r.id === parseInt(relayId || '0'));

    const [isLiked, setIsLiked] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [processedPhotos, setProcessedPhotos] = useState<string[]>([]);

    // 右侧：留言图片浏览状态
    const [messagePhotos, setMessagePhotos] = useState<string[]>([]);
    const [msgCurrentIndex, setMsgCurrentIndex] = useState(0);
    const [isMsgFullscreenOpen, setIsMsgFullscreenOpen] = useState(false);
    const [msgIsDownloading, setMsgIsDownloading] = useState(false);
    const [msgDownloadProgress, setMsgDownloadProgress] = useState(0);
    const [msgShowDownloadOptions, setMsgShowDownloadOptions] = useState(false);
    const [msgIsLiked, setMsgIsLiked] = useState(false);

    useEffect(() => {
        if (relay) {
            // 过滤掉 undefined 或空字符串的路径
            const validPhotos = (relay.photos || []).filter(photo => photo && typeof photo === 'string' && photo.trim() !== '');
            const validMessageImages = (relay.messageImages || []).filter(image => image && typeof image === 'string' && image.trim() !== '');
            
            setProcessedPhotos(validPhotos);
            setMessagePhotos(validMessageImages);
        }
    }, [relay?.photos]);

    if (!group || !relay) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">接力棒不存在</h1>
                    <Link to={`/phase2/province/${provinceId}/group/${groupId}`} className="text-orange-600 hover:text-orange-700">返回小组</Link>
                </div>
            </div>
        );
    }

    const nextPhoto = () => {
        const nextIndex = currentPhotoIndex + 1;
        if (nextIndex >= relay.photos.length) {
            const currentRelayIndex = group.relays.findIndex(r => r.id === relay.id);
            const nextRelay = group.relays[currentRelayIndex + 1];
            if (nextRelay) {
                navigate(`/phase2/group/${provinceId}/${groupId}/relay/${nextRelay.id}`);
                setCurrentPhotoIndex(0);
            } else {
                setCurrentPhotoIndex(0);
            }
        } else {
            setCurrentPhotoIndex(nextIndex);
        }
    };

    const nextMsgPhoto = () => {
        const nextIndex = msgCurrentIndex + 1;
        if (nextIndex >= messagePhotos.length) {
            setMsgCurrentIndex(0);
        } else {
            setMsgCurrentIndex(nextIndex);
        }
    };

    const prevMsgPhoto = () => {
        const prevIndex = msgCurrentIndex - 1;
        if (prevIndex < 0) {
            setMsgCurrentIndex((messagePhotos.length || 1) - 1);
        } else {
            setMsgCurrentIndex(prevIndex);
        }
    };

    const prevPhoto = () => {
        const prevIndex = currentPhotoIndex - 1;
        if (prevIndex < 0) {
            const currentRelayIndex = group.relays.findIndex(r => r.id === relay.id);
            const prevRelay = group.relays[currentRelayIndex - 1];
            if (prevRelay) {
                navigate(`/phase2/group/${provinceId}/${groupId}/relay/${prevRelay.id}`);
            } else {
                setCurrentPhotoIndex((relay.photos.length || 1) - 1);
            }
        } else {
            setCurrentPhotoIndex(prevIndex);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    to={`/phase2/province/${provinceId}/group/${groupId}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回小组
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 顶部合并卡片：棒次信息 + 接力信息 */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">{relayId}</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{relay.name}</h2>
                                    <p className="text-blue-600 font-medium">{relay.participant}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-gray-600"><MapPin className="h-5 w-5 mr-3 text-blue-500" /><span>{relay.location}</span></div>
                                <div className="flex items-center text-gray-600"><Calendar className="h-5 w-5 mr-3 text-blue-500" /><span>{relay.date}</span></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">接力信息</h3>
                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                <div>
                                    <p className="text-sm text-gray-600">下一站</p>
                                    <p className="font-medium text-gray-900">{relay.nextLocation}</p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">下一位参与者</p>
                                    <p className="font-medium text-gray-900">{relay.nextParticipant}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
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
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="aspect-square overflow-hidden rounded-xl shadow-2xl cursor-pointer" onClick={() => setIsFullscreenOpen(true)}>
                                {processedPhotos[currentPhotoIndex] ? (
                                    <SmartImage
                                        originalPath={processedPhotos[currentPhotoIndex]}
                                        variant="preview"
                                        alt={`${relay.name} - 照片 ${currentPhotoIndex + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        暂无照片
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium">点击查看大图</div>
                                </div>
                            </div>

                            {processedPhotos.length >= 1 && (
                                <>
                                    <button onClick={prevPhoto} className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={nextPhoto} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {processedPhotos.map((_, index) => (
                                            <button key={index} onClick={() => setCurrentPhotoIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex space-x-2">
                                    <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'} transition-all duration-200`}>
                                        <Heart className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (processedPhotos.length === 1) {
                                                const filename = `${relay.name}_${relay.participant}.jpg`;
                                                downloadImage(processedPhotos[0], filename);
                                            } else {
                                                setShowDownloadOptions(true);
                                            }
                                        }}
                                        disabled={isDownloading}
                                        className={`p-3 rounded-full transition-all duration-200 ${isDownloading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/80 text-gray-600 hover:bg-green-500 hover:text-white'}`}
                                    >
                                        {isDownloading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Download className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4">
                                <button onClick={() => setShowMessage(!showMessage)} className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200">
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {processedPhotos.length > 1 && (
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">所有照片</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {processedPhotos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <button onClick={() => setCurrentPhotoIndex(index)} className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 w-full ${index === currentPhotoIndex ? 'ring-2 ring-blue-500' : 'hover:scale-105'}`}>
                                                <SmartImage originalPath={photo} variant="thumbnail" alt={`照片 ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">留言信息</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500">留言数量</span>
                                    <p className="font-medium">{messagePhotos ? messagePhotos.length : 0} 张</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">留言类型</span>
                                    <p className="font-medium">手写留言</p>
                                </div>
                            </div>
                        </div>

                        {messagePhotos && messagePhotos.length > 0 ? (
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">留言图片</h3>
                                <div className="relative group">
                                    <div className="aspect-square overflow-hidden rounded-xl shadow-2xl cursor-pointer" onClick={() => setIsMsgFullscreenOpen(true)}>
                                        {messagePhotos[msgCurrentIndex] ? (
                                            <SmartImage
                                                originalPath={messagePhotos[msgCurrentIndex]}
                                                variant="preview"
                                                alt={`留言图片 ${msgCurrentIndex + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                暂无留言图片
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium">点击查看大图</div>
                                        </div>
                                    </div>

                                    <button onClick={prevMsgPhoto} className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={nextMsgPhoto} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {messagePhotos.map((_, index) => (
                                            <button key={index} onClick={() => setMsgCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-200 ${index === msgCurrentIndex ? 'bg-white' : 'bg-white/50'}`} />
                                        ))}
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex space-x-2">
                                            <button onClick={() => setMsgIsLiked(!msgIsLiked)} className={`p-3 rounded-full ${msgIsLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'} transition-all duration-200`}>
                                                <Heart className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (messagePhotos.length === 1) {
                                                        const filename = `${relay.name}_${relay.participant}_留言.jpg`;
                                                        downloadImage(messagePhotos[0], filename);
                                                    } else {
                                                        setMsgShowDownloadOptions(true);
                                                    }
                                                }}
                                                disabled={msgIsDownloading}
                                                className={`p-3 rounded-full transition-all duration-200 ${msgIsDownloading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/80 text-gray-600 hover:bg-green-500 hover:text-white'}`}
                                            >
                                                {msgIsDownloading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Download className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">留言图片</h3>
                                <div className="h-64 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">暂无留言图片</div>
                            </div>
                        )}

                        {messagePhotos && messagePhotos.length > 1 && (
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">所有留言图片</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {messagePhotos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <button onClick={() => setMsgCurrentIndex(index)} className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 w-full ${index === msgCurrentIndex ? 'ring-2 ring-blue-500' : 'hover:scale-105'}`}>
                                                <SmartImage originalPath={photo} variant="thumbnail" alt={`留言 ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* 全宽：参与者留言 */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center mb-4">
                            <MessageCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-900">参与者留言</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{relay.message}</p>
                        {relay.tags && relay.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {relay.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 全宽：拍摄位置 */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">拍摄位置</h3>
                            <Link to={`/route-map/${group.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">查看完整路线 →</Link>
                        </div>
                        <div className="h-64 rounded-lg overflow-hidden">
                            <AmapComponent relays={(group.relays as any)} currentRelayId={relay.id} height="100%" showRoute={true} showAllMarkers={true} />
                        </div>
                        {relay.coordinates && (
                            <div className="mt-3 text-sm text-gray-500 text-center">坐标: {relay.coordinates.lat.toFixed(4)}, {relay.coordinates.lng.toFixed(4)}</div>
                        )}
                    </div>
                </div>

                {showMessage && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessage(false)}>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center mb-4">
                                <MessageCircle className="h-6 w-6 text-blue-500 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">参与者留言</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">{relay.message}</p>
                            <div className="text-right">
                                <button onClick={() => setShowMessage(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">关闭</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {showDownloadOptions && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDownloadOptions(false)}>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
                                            await downloadAllImages(processedPhotos, relay.name, relay.participant, (p) => setDownloadProgress(p));
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
                                            下载全部照片 ({processedPhotos.length}张)
                                        </>
                                    )}
                                </button>

                                {isDownloading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                                    </div>
                                )}

                                <button onClick={() => { setShowDownloadOptions(false); const filename = `${relay.name}_${relay.participant}_当前照片.jpg`; downloadImage(processedPhotos[currentPhotoIndex], filename); }} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    <Download className="h-5 w-5 mr-2" />
                                    下载当前照片
                                </button>
                                <div className="text-sm text-gray-600 text-center">批量下载将逐张下载所有照片，每张间隔0.5秒</div>
                            </div>
                            <div className="text-right">
                                <button onClick={() => setShowDownloadOptions(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200">取消</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 留言图片下载选项 */}
                {msgShowDownloadOptions && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setMsgShowDownloadOptions(false)}>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center mb-4">
                                <Download className="h-6 w-6 text-green-500 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">下载留言图片</h3>
                            </div>
                            <div className="space-y-4 mb-6">
                                <button
                                    onClick={async () => {
                                        setMsgShowDownloadOptions(false);
                                        setMsgIsDownloading(true);
                                        setMsgDownloadProgress(0);
                                        try {
                                            await downloadAllImages(messagePhotos, relay.name, relay.participant, (p) => setMsgDownloadProgress(p));
                                        } finally {
                                            setMsgIsDownloading(false);
                                            setMsgDownloadProgress(0);
                                        }
                                    }}
                                    disabled={msgIsDownloading}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {msgIsDownloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            下载中... {Math.round(msgDownloadProgress)}%
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5 mr-2" />
                                            下载全部留言图片 ({messagePhotos.length}张)
                                        </>
                                    )}
                                </button>

                                {msgIsDownloading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${msgDownloadProgress}%` }}></div>
                                    </div>
                                )}

                                <button onClick={() => { setMsgShowDownloadOptions(false); const filename = `${relay.name}_${relay.participant}_留言_${msgCurrentIndex + 1}.jpg`; downloadImage(messagePhotos[msgCurrentIndex], filename); }} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text白 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    <Download className="h-5 w-5 mr-2" />
                                    下载当前留言图片
                                </button>
                                <div className="text-sm text-gray-600 text-center">批量下载将逐张下载所有留言图片，每张间隔0.5秒</div>
                            </div>
                            <div className="text-right">
                                <button onClick={() => setMsgShowDownloadOptions(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200">取消</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <FullscreenPhotoViewer
                    photos={processedPhotos}
                    currentIndex={currentPhotoIndex}
                    isOpen={isFullscreenOpen}
                    onClose={() => setIsFullscreenOpen(false)}
                    onIndexChange={setCurrentPhotoIndex}
                    relayName={relay.name}
                    participant={relay.participant}
                />
                <FullscreenPhotoViewer
                    photos={messagePhotos}
                    currentIndex={msgCurrentIndex}
                    isOpen={isMsgFullscreenOpen}
                    onClose={() => setIsMsgFullscreenOpen(false)}
                    onIndexChange={setMsgCurrentIndex}
                    relayName={`${relay.name}-留言`}
                    participant={relay.participant}
                />
            </div>
        </div>
    );
};

export default Phase2RelayDetail;


