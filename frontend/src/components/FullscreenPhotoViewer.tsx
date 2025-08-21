import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download, RefreshCw } from 'lucide-react';

interface FullscreenPhotoViewerProps {
    photos: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onIndexChange: (index: number) => void;
    relayName: string;
    participant: string;
}

const FullscreenPhotoViewer: React.FC<FullscreenPhotoViewerProps> = ({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange,
    relayName,
    participant
}) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    // 重置变换
    const resetTransform = () => {
        setScale(1);
        setRotation(0);
    };

    // 切换照片时重置变换
    useEffect(() => {
        resetTransform();
    }, [currentIndex]);

    // 键盘导航
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        onIndexChange(currentIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (currentIndex < photos.length - 1) {
                        onIndexChange(currentIndex + 1);
                    }
                    break;
                case '=':
                case '+':
                    setScale(prev => Math.min(prev + 0.8, 5));
                    break;
                case '-':
                    setScale(prev => Math.max(prev - 0.8, 0.5));
                    break;
                case '0':
                    resetTransform();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, currentIndex, photos.length, onClose, onIndexChange]);

    // 鼠标滚轮缩放
    const handleWheel = (event: React.WheelEvent) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.3 : 0.3;
        setScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
    };



    // 下载当前照片
    const downloadCurrentPhoto = () => {
        const link = document.createElement('a');
        link.href = photos[currentIndex];
        link.download = `${relayName}_${participant}_${currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
                onClick={onClose}
            >
                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* 照片容器 */}
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                    onWheel={handleWheel}
                >
                    {/* 照片 */}
                    <img
                        src={photos[currentIndex]}
                        alt={`${relayName} - 照片 ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        style={{
                            transform: `scale(${scale}) rotate(${rotation}deg)`,
                            transition: 'transform 0.2s ease-out'
                        }}
                    />

                    {/* 导航按钮 */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={() => currentIndex > 0 && onIndexChange(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => currentIndex < photos.length - 1 && onIndexChange(currentIndex + 1)}
                                disabled={currentIndex === photos.length - 1}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* 控制工具栏 */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-full p-2">
                        <button
                            onClick={() => setScale(prev => Math.max(0.5, prev - 0.8))}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                            title="缩小 (-)"
                        >
                            <ZoomOut className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setScale(prev => Math.min(5, prev + 0.8))}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                            title="放大 (+)"
                        >
                            <ZoomIn className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setRotation(prev => (prev + 90) % 360)}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                            title="旋转"
                        >
                            <RotateCcw className="h-5 w-5" />
                        </button>
                        <button
                            onClick={resetTransform}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                            title="重置"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <button
                            onClick={downloadCurrentPhoto}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                            title="下载"
                        >
                            <Download className="h-5 w-5" />
                        </button>
                    </div>

                    {/* 照片信息 */}
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
                        <div className="text-sm">
                            {currentIndex + 1} / {photos.length}
                        </div>
                        <div className="text-xs opacity-75">
                            {Math.round(scale * 100)}% | {rotation}°
                        </div>
                    </div>

                    {/* 操作提示 */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                        <div>鼠标滚轮缩放 | 键盘导航</div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FullscreenPhotoViewer;
