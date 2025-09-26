import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin } from 'lucide-react';
import SmartImage from './SmartImage';
export interface GalleryRelayInfo {
    id: number;
    location: string;
    participant?: string;
    [key: string]: any;
}

export interface PhotoItem {
    id: string;
    src: string;
    width: number;
    height: number;
    relay: GalleryRelayInfo;
    type: 'photo' | 'message';
    index: number;
    groupId?: string;
    groupName?: string;
}

interface WaterfallGalleryProps<T extends PhotoItem> {
    photos: T[];
    onPhotoClick?: (photo: T) => void;
}
function WaterfallGallery<T extends PhotoItem>({ photos, onPhotoClick }: WaterfallGalleryProps<T>) {
    const [columns, setColumns] = useState<T[][]>([]);
    const [columnCount, setColumnCount] = useState(4);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // 计算列数
    useEffect(() => {
        const updateColumns = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width);
                
                let newColumnCount = 4;
                if (width < 640) newColumnCount = 1;
                else if (width < 768) newColumnCount = 2;
                else if (width < 1024) newColumnCount = 3;
                else if (width < 1280) newColumnCount = 4;
                else newColumnCount = 5;
                
                setColumnCount(newColumnCount);
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // 瀑布流布局算法
    useEffect(() => {
        if (photos.length === 0 || columnCount === 0) return;

        const newColumns: T[][] = Array.from({ length: columnCount }, () => []);
        const columnHeights = new Array(columnCount).fill(0);

        photos.forEach((photo) => {
            // 找到最短的列
            const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            
            // 计算图片在容器中的实际宽度
            const gap = 16; // 16px gap
            const availableWidth = containerWidth - (columnCount - 1) * gap;
            const imageWidth = availableWidth / columnCount;
            
            // 计算图片的实际高度（保持宽高比）
            const aspectRatio = photo.height / photo.width;
            const imageHeight = imageWidth * aspectRatio;

            // 添加图片到最短的列
            newColumns[shortestColumnIndex].push({
                ...photo,
                width: imageWidth,
                height: imageHeight
            } as T);

            // 更新列高度
            columnHeights[shortestColumnIndex] += imageHeight + gap;
        });

        setColumns(newColumns);
    }, [photos, columnCount, containerWidth]);

    const downloadImage = (src: string, filename: string) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div ref={containerRef} className="w-full">
            <div className="flex gap-4">
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="flex-1 flex flex-col gap-4">
                        {column.map((photo, photoIndex) => (
                            <motion.div
                                key={`${photo.groupId ?? 'default'}-${photo.relay.id}-${photo.type}-${photo.index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: photoIndex * 0.1 }}
                                className="group relative cursor-pointer"
                                onClick={() => onPhotoClick?.(photo)}
                            >
                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                    <SmartImage
                                        originalPath={photo.src}
                                        variant="thumbnail"
                                        alt={`${photo.relay.location} - ${photo.type === 'photo' ? '照片' : '留言'}`}
                                        className="w-full h-auto object-cover"
                                    />
                                    
                                    {/* 悬停遮罩 - 只显示位置信息 */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <MapPin className="h-5 w-5" />
                                                <span className="text-lg font-medium">{photo.relay.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 照片类型标签 */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            photo.type === 'photo' 
                                                ? 'bg-blue-500/90 text-white' 
                                                : 'bg-green-500/90 text-white'
                                        }`}>
                                            {photo.type === 'photo' ? '照片' : '留言'}
                                        </span>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadImage(photo.src, `${photo.relay.location}_${photo.type}_${photo.index}.jpg`);
                                            }}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                        >
                                            <Download className="h-4 w-4 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaterfallGallery;
