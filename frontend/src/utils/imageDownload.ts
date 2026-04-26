import { resolveImageAssetUrl, toImageAsset, type ImageAsset, type ImageAssetLike } from '../types/imageAsset';

const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const openInNewTab = (url: string) => {
    const nextWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!nextWindow) {
        window.location.assign(url);
    }
};

export const downloadImageAsset = async (assetLike: ImageAssetLike, filename: string): Promise<'downloaded' | 'opened'> => {
    const asset = toImageAsset(assetLike);
    const url = resolveImageAssetUrl(asset);

    if (!asset || !url) {
        throw new Error('Image asset URL is missing');
    }

    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`Download request failed: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        try {
            triggerDownload(objectUrl, filename);
        } finally {
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
        }

        return 'downloaded';
    } catch (error) {
        console.warn('Blob download failed, falling back to opening image URL.', error);
        openInNewTab(asset.original);
        return 'opened';
    }
};

export const downloadImageAssets = async (
    assets: ImageAsset[],
    filenameBuilder: (asset: ImageAsset, index: number) => string,
    onProgress?: (progress: number) => void
) => {
    for (let index = 0; index < assets.length; index += 1) {
        await downloadImageAsset(assets[index], filenameBuilder(assets[index], index));
        onProgress?.(((index + 1) / assets.length) * 100);

        if (index < assets.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
    }

    onProgress?.(100);
};
