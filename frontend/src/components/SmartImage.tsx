// components/SmartImage.tsx
import { useState, useEffect, type CSSProperties, type FC } from 'react';
import { ImagePathGenerator } from '../utils/imagePathgenerator';

interface SmartImageProps {
    originalPath: string;
    variant: 'thumbnail' | 'preview' | 'original';
    fallback?: string;
    className?: string;
    onClick?: () => void;
    alt?: string;
    style?: CSSProperties;
}

const SmartImage: FC<SmartImageProps> = ({
    originalPath,
    variant,
    fallback,
    className,
    onClick,
    alt,
    style
}) => {
    const [imagePath, setImagePath] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            // 参数验证
            if (!originalPath || typeof originalPath !== 'string') {
                console.warn('SmartImage: originalPath is invalid:', originalPath);
                setHasError(true);
                if (fallback) {
                    setImagePath(fallback);
                }
                return;
            }

            // setIsLoading(true);
            setHasError(false);

            try {
                // 生成目标变体路径
                const targetPath = ImagePathGenerator.generateVariantPath(originalPath, variant);
                setImagePath(targetPath);
                
                // 检查目标变体是否存在
                // const exists = await ImagePathGenerator.checkVariantExists(targetPath);
                
                // if (exists) {
                //     setImagePath(targetPath);
                // } else {
                    // 降级策略：如果目标变体不存在，使用原图
                //     setImagePath(originalPath);
                // }
                console.log('Loading image:', originalPath, 'variant:', variant);
            } catch (error) {
                console.error('图片加载失败:', error);
                setHasError(true);
                if (fallback) {
                    setImagePath(fallback);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [originalPath, variant, fallback]);

    // if (isLoading) {
    //     return <div className={`animate-pulse bg-gray-200 ${className}`} />;
    // }

    if (hasError && !fallback) {
        return <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
            <span className="text-gray-500">图片加载失败</span>
        </div>;
    }

    const combinedClassName = className ? `smart-image ${className}` : 'smart-image';

    return (
        <img
            src={imagePath}
            alt={alt || '图片'}
            className={combinedClassName}
            onClick={onClick}
            onError={() => setHasError(true)}
            style={style}
        />
    );
};

export default SmartImage;
