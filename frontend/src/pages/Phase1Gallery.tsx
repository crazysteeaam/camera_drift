import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, MapPin, Calendar, Search } from 'lucide-react';
import WaterfallGallery, { PhotoItem as GalleryPhotoItem } from '../components/WaterfallGallery';
import SmartImage from '../components/SmartImage';
import { projectData, Relay } from '../config/projectData';

interface Phase1PhotoItem extends GalleryPhotoItem {
    relay: Relay;
    groupId: string;
    groupName: string;
}

const Phase1Gallery: React.FC = () => {
    const [allPhotos, setAllPhotos] = useState<Phase1PhotoItem[]>([]);
    const [filteredPhotos, setFilteredPhotos] = useState<Phase1PhotoItem[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Phase1PhotoItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('all');
    const [selectedProvince, setSelectedProvince] = useState<string>('all');

    // 加载第一期所有照片
    useEffect(() => {
        const photos: Phase1PhotoItem[] = [];

        projectData.forEach(group => {
            group.relays.forEach(relay => {
                relay.photos.forEach((photo, index) => {
                    photos.push({
                        id: `${group.id}-${relay.id}-photo-${index}`,
                        src: photo,
                        width: 800,
                        height: 600,
                        relay,
                        type: 'photo',
                        index,
                        groupId: group.id,
                        groupName: group.name
                    });
                });
            });
        });

        setAllPhotos(photos);
        setFilteredPhotos(photos);
    }, []);

    const groupOptions = useMemo(() => projectData.map(group => ({ id: group.id, name: group.name })), []);

    const provinceOptions = useMemo(() => {
        const provinces = new Set<string>();
        projectData.forEach(group => {
            group.relays.forEach(relay => provinces.add(relay.province));
        });
        return Array.from(provinces);
    }, []);

    // 过滤照片
    useEffect(() => {
        let filtered = allPhotos;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(photo =>
                photo.relay.participant.toLowerCase().includes(lower) ||
                photo.relay.location.toLowerCase().includes(lower) ||
                photo.relay.message.toLowerCase().includes(lower)
            );
        }

        if (selectedGroup !== 'all') {
            filtered = filtered.filter(photo => photo.groupId === selectedGroup);
        }

        if (selectedProvince !== 'all') {
            filtered = filtered.filter(photo => photo.relay.province === selectedProvince);
        }

        setFilteredPhotos(filtered);
    }, [allPhotos, searchTerm, selectedGroup, selectedProvince]);

    const handlePhotoClick = (photo: Phase1PhotoItem) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhoto(null);
    };

    const downloadImage = (src: string, filename: string) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            {/* 头部 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">第一期胶片作品集</h1>
                            <p className="text-gray-600 mt-2">回顾第一期接力过程中记录下的珍贵瞬间</p>
                        </div>

                        <div className="flex gap-6 text-sm text-gray-600">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{allPhotos.length}</div>
                                <div>总照片数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-pink-600">{groupOptions.length}</div>
                                <div>参赛组别</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {projectData.reduce((count, group) => count + group.relays.length, 0)}
                                </div>
                                <div>接力棒总数</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 过滤器 */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="搜索参与者、地点或留言..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">所有组别</option>
                            {groupOptions.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">所有省份</option>
                            {provinceOptions.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 内容 */}
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
                                <div className="lg:w-2/3 flex flex-col">
                                    <div className="relative flex-1 flex items-center justify-center bg-gray-100">
                                        <SmartImage
                                            originalPath={selectedPhoto.src}
                                            variant="preview"
                                            alt={`${selectedPhoto.relay.participant} - 照片`}
                                            className="w-full h-full max-h-[60vh] object-contain"
                                        />

                                        <button
                                            onClick={closeModal}
                                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
                                                {selectedPhoto.groupName} · 第{selectedPhoto.relay.id}棒
                                            </span>
                                        </div>
                                    </div>
                                </div>

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
                                                <p className="text-gray-700 whitespace-pre-line">
                                                    {selectedPhoto.relay.message}
                                                </p>
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
                                                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => downloadImage(
                                                    selectedPhoto.src,
                                                    `${selectedPhoto.groupId}_${selectedPhoto.relay.participant}_photo_${selectedPhoto.index + 1}.jpg`
                                                )}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                下载原图
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

export default Phase1Gallery;
