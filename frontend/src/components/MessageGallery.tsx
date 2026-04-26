import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, MessageSquare, User, Calendar } from 'lucide-react';
import SmartImage from './SmartImage';
import type { ImageAsset } from '../types/imageAsset';

interface MessageImage {
    id: string;
    asset: ImageAsset;
    caption?: string;
    participant: string;
    date: string;
    relayName: string;
}

interface MessageGalleryProps {
    images: MessageImage[];
    title?: string;
}

const MessageGallery: React.FC<MessageGalleryProps> = ({ images, title = "留言图片" }) => {
    const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (image: MessageImage, index: number) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    const goToNext = () => {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <ImageIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无留言图片</h3>
                <p className="text-gray-500">该小组还没有留言图片</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {title}
                </h3>
                <span className="text-sm text-gray-500">{images.length} 张图片</span>
            </div>

            {/* 图片网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => openModal(image, index)}
                    >
                        <div className="aspect-square overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <SmartImage
                                asset={image.asset}
                                fallback="/placeholder-message.jpg"
                                alt={image.caption || `留言图片 ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* 悬停遮罩 */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* 图片信息 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
                            <div className="text-white text-sm font-medium truncate">
                                {image.participant}
                            </div>
                            <div className="text-white/80 text-xs">
                                {image.relayName}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 模态框 */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 关闭按钮 */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* 导航按钮 */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            {/* 图片 */}
                            <div className="relative">
                                <SmartImage
                                    asset={selectedImage.asset}
                                    fallback="/placeholder-message.jpg"
                                    alt={selectedImage.caption || `留言图片 ${currentIndex + 1}`}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                />

                                {/* 图片计数器 */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {/* 图片信息 */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center text-gray-600">
                                            <User className="h-4 w-4 mr-1" />
                                            <span className="text-sm font-medium">{selectedImage.participant}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span className="text-sm">{selectedImage.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {selectedImage.relayName}
                                    </div>
                                </div>

                                {selectedImage.caption && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-line">{selectedImage.caption}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageGallery;

