// components/SmartImage.tsx
import { useState, useEffect, type CSSProperties, type FC } from 'react';
import { useTranslation } from '../i18n/hooks';
import { resolveImageAssetUrl, type ImageAssetLike, type ImageVariant } from '../types/imageAsset';

interface SmartImageProps {
    asset: ImageAssetLike;
    variant?: ImageVariant;
    fallback?: ImageAssetLike;
    className?: string;
    onClick?: () => void;
    alt?: string;
    style?: CSSProperties;
}

const SmartImage: FC<SmartImageProps> = ({
    asset,
    variant = 'original',
    fallback,
    className,
    onClick,
    alt,
    style
}) => {
    const { t } = useTranslation();
    const primaryOriginal = resolveImageAssetUrl(asset, 'original');
    const primaryVariant = resolveImageAssetUrl(asset, variant);
    const fallbackOriginal = resolveImageAssetUrl(fallback, 'original');
    const initialPath = primaryVariant || primaryOriginal || fallbackOriginal;

    const [imagePath, setImagePath] = useState<string>(initialPath);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
        setImagePath(primaryVariant || primaryOriginal || fallbackOriginal);
    }, [primaryVariant, primaryOriginal, fallbackOriginal]);

    if (hasError && !fallback) {
        return <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
            <span className="text-gray-500">{t('common.messages.imageLoadFailed') as string}</span>
        </div>;
    }

    const combinedClassName = className ? `smart-image ${className}` : 'smart-image';

    return (
        <img
            src={imagePath}
            alt={alt || '图片'}
            className={combinedClassName}
            onClick={onClick}
            onError={() => {
                if (imagePath !== primaryOriginal && primaryOriginal) {
                    setImagePath(primaryOriginal);
                    return;
                }

                if (imagePath !== fallbackOriginal && fallbackOriginal) {
                    setImagePath(fallbackOriginal);
                    return;
                }

                setHasError(true);
            }}
            style={style}
        />
    );
};

export default SmartImage;
