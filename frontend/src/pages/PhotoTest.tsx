import React, { useState, useEffect } from 'react';
import { getAllPhotoConfig } from '../config/photoConfig';
import type { ImageAsset } from '../types/imageAsset';

const PhotoTest: React.FC = () => {
    const [photoConfig, setPhotoConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const config = getAllPhotoConfig();
        setPhotoConfig(config);
        setLoading(false);
    }, []);

    const testImagePath = async (asset: ImageAsset): Promise<boolean> => {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
            image.src = asset.original;
        });
    };

    const validateAllImages = async () => {
        const newErrors: string[] = [];
        
        for (const group in photoConfig) {
            for (const index in photoConfig[group]) {
                const photos = photoConfig[group][index];
                for (const photo of photos as ImageAsset[]) {
                    const isValid = await testImagePath(photo);
                    if (!isValid) {
                        newErrors.push(`❌ ${photo.original} - 无法访问`);
                    }
                }
            }
        }
        
        setErrors(newErrors);
    };

    if (loading) {
        return <div className="p-8">加载中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">图片路径测试页面</h1>
                
                <div className="mb-8">
                    <button 
                        onClick={validateAllImages}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        验证所有图片路径
                    </button>
                </div>

                {errors.length > 0 && (
                    <div className="mb-8 p-4 bg-red-100 border border-red-400 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">发现的问题：</h3>
                        <ul className="space-y-1">
                            {errors.map((error, index) => (
                                <li key={index} className="text-red-700">{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photoConfig && Object.keys(photoConfig).map(group => (
                        <div key={group} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">{group}组</h2>
                            {Object.keys(photoConfig[group]).map(index => {
                                const photos = photoConfig[group][index];
                                return (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                            {group}{index} ({photos.length}张)
                                        </h3>
                                        <div className="space-y-2">
                                            {photos.map((photo: ImageAsset, photoIndex: number) => (
                                                <div key={photoIndex} className="flex items-center space-x-2">
                                                    <img 
                                                        src={photo.original} 
                                                        alt={`${group}${index}-${photoIndex}`}
                                                        className="w-16 h-16 object-cover rounded border"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.border = '2px solid red';
                                                            target.title = '图片加载失败';
                                                        }}
                                                        onLoad={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.border = '2px solid green';
                                                            target.title = '图片加载成功';
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-600 truncate">{photo.original}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhotoTest;


