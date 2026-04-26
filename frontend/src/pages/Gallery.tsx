import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, MapPin, Calendar, Search } from 'lucide-react';
import WaterfallGallery, { PhotoItem as GalleryPhotoItem } from '../components/WaterfallGallery';
import SmartImage from '../components/SmartImage';
import { phase2Provinces, Phase2Relay } from '../config/phase2Data';
import { downloadImageAsset } from '../utils/imageDownload';

type Phase2PhotoItem = GalleryPhotoItem & { relay: Phase2Relay };

const Gallery: React.FC = () => {
    const [allPhotos, setAllPhotos] = useState<Phase2PhotoItem[]>([]);
    const [filteredPhotos, setFilteredPhotos] = useState<Phase2PhotoItem[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Phase2PhotoItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'message'>('all');

    // 加载所有照片数据
    useEffect(() => {
        const loadPhotos = async () => {
            const photos: Phase2PhotoItem[] = [];
            
            phase2Provinces.forEach(province => {
                province.groups.forEach(group => {
                    group.relays.forEach(relay => {
                        // 添加主照片
                        relay.photos.forEach((photo, index) => {
                            photos.push({
                                id: `${relay.id}-photo-${index}`,
                                asset: photo,
                                width: 800, // 默认宽度，实际会通过瀑布流算法计算
                                height: 600, // 默认高度，实际会通过瀑布流算法计算
                                relay,
                                type: 'photo',
                                index,
                                groupId: group.id,
                                groupName: group.name
                            });
                        });

                        // 添加留言图片
                        if (relay.messageImages) {
                            relay.messageImages.forEach((message, index) => {
                                photos.push({
                                    id: `${relay.id}-message-${index}`,
                                    asset: message,
                                    width: 800,
                                    height: 600,
                                    relay,
                                    type: 'message',
                                    index,
                                    groupId: group.id,
                                    groupName: group.name
                                });
                            });
                        }
                    });
                });
            });

            setAllPhotos(photos);
            setFilteredPhotos(photos);
        };

        loadPhotos();
    }, []);

    // 过滤照片
    useEffect(() => {
        let filtered = allPhotos;

        // 按搜索词过滤
        if (searchTerm) {
            filtered = filtered.filter(photo =>
                photo.relay.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photo.relay.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photo.relay.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 按省份过滤
        if (selectedProvince !== 'all') {
            filtered = filtered.filter(photo => photo.relay.province === selectedProvince);
        }

        // 按类型过滤
        if (selectedType !== 'all') {
            filtered = filtered.filter(photo => photo.type === selectedType);
        }

        setFilteredPhotos(filtered);
    }, [allPhotos, searchTerm, selectedProvince, selectedType]);

    const handlePhotoClick = (photo: Phase2PhotoItem) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhoto(null);
    };

    const getUniqueProvinces = () => {
        const provinces = new Set<string>();
        allPhotos.forEach(photo => provinces.add(photo.relay.province));
        return Array.from(provinces);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* 头部 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">胶片漂流画廊</h1>
                            <p className="text-gray-600 mt-2">探索来自全国各地的精彩瞬间</p>
                        </div>
                        
                        {/* 统计信息 */}
                        <div className="flex gap-6 text-sm text-gray-600">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{allPhotos.length}</div>
                                <div>总照片数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {allPhotos.filter(p => p.type === 'photo').length}
                                </div>
                                <div>主照片</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {allPhotos.filter(p => p.type === 'message').length}
                                </div>
                                <div>留言图片</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 过滤器 */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 搜索框 */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="搜索参与者、地点或留言..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* 省份过滤 */}
                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">所有省份</option>
                            {getUniqueProvinces().map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>

                        {/* 类型过滤 */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as 'all' | 'photo' | 'message')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">所有类型</option>
                            <option value="photo">主照片</option>
                            <option value="message">留言图片</option>
                        </select>

                    </div>
                </div>
            </div>

            {/* 照片展示区域 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredPhotos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">没有找到匹配的照片</div>
                        <div className="text-gray-500 text-sm mt-2">尝试调整搜索条件</div>
                    </div>
                ) : (
                    <WaterfallGallery
                        photos={filteredPhotos}
                        onPhotoClick={handlePhotoClick}
                    />
                )}
            </div>

            {/* 照片详情模态框 */}
            <AnimatePresence>
                {isModalOpen && selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                                {/* 图片区域 */}
                                <div className="lg:w-2/3 flex flex-col">
                                    <div className="relative flex-1 flex items-center justify-center bg-gray-100">
                                        <SmartImage
                                            asset={selectedPhoto.asset}
                                            variant="original"
                                            alt={`${selectedPhoto.relay.participant} - ${selectedPhoto.type === 'photo' ? '照片' : '留言'}`}
                                            className="w-full h-full max-h-[60vh] object-contain"
                                        />
                                        
                                        {/* 关闭按钮 */}
                                        <button
                                            onClick={closeModal}
                                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                        {/* 类型标签 */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                selectedPhoto.type === 'photo' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-green-500 text-white'
                                            }`}>
                                                {selectedPhoto.type === 'photo' ? '主照片' : '留言图片'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 信息区域 */}
                                <div className="lg:w-1/3 p-6 bg-gray-50 flex flex-col">
                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {selectedPhoto.relay.participant}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{selectedPhoto.relay.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{selectedPhoto.relay.date} {selectedPhoto.relay.time}</span>
                                            </div>
                                        </div>

                                        {selectedPhoto.relay.message && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">留言</h4>
                                                <p className="text-gray-700 italic">"{selectedPhoto.relay.message}"</p>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">拍摄信息</h4>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div>相机: {selectedPhoto.relay.camera}</div>
                                                <div>胶片: {selectedPhoto.relay.film}</div>
                                                <div>天气: {selectedPhoto.relay.weather}</div>
                                            </div>
                                        </div>

                                        {selectedPhoto.relay.tags && selectedPhoto.relay.tags.length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">标签</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPhoto.relay.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => void downloadImageAsset(
                                                    selectedPhoto.asset,
                                                    `${selectedPhoto.relay.participant}_${selectedPhoto.type}_${selectedPhoto.index}.jpg`
                                                )}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                下载
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
