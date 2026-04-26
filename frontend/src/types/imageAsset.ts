export type ImageVariant = 'thumbnail' | 'preview' | 'original';

export interface ImageAsset {
    kind: 'remote';
    original: string;
    thumbnail?: string;
    preview?: string;
    width?: number;
    height?: number;
    blurPlaceholder?: string;
}

export type ImageAssetLike = ImageAsset | string | null | undefined;

const IMAGE_BASE_URL = (process.env.REACT_APP_IMAGE_BASE_URL || '').trim().replace(/\/+$/, '');
const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;
const SPECIAL_URL_PATTERN = /^(?:data|blob):/i;
const VARIANT_SUFFIX: Record<Exclude<ImageVariant, 'original'>, string> = {
    thumbnail: '_thumb',
    preview: '_preview'
};

const isAbsoluteUrl = (value: string) => ABSOLUTE_URL_PATTERN.test(value) || SPECIAL_URL_PATTERN.test(value);

const normalizePathLike = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (isAbsoluteUrl(trimmed)) return trimmed;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

export const applyImageBaseUrl = (value: string): string => {
    const normalized = normalizePathLike(value);
    if (!normalized || !IMAGE_BASE_URL || isAbsoluteUrl(normalized)) {
        return normalized;
    }

    return `${IMAGE_BASE_URL}${normalized}`;
};

const appendVariantSuffix = (value: string, suffix: string): string => {
    if (!value || !suffix || SPECIAL_URL_PATTERN.test(value)) {
        return value;
    }

    const match = value.match(/^([^?#]*)([?#].*)?$/);
    const basePath = match?.[1] || value;
    const suffixPart = match?.[2] || '';
    const lastSlashIndex = basePath.lastIndexOf('/');
    const lastDotIndex = basePath.lastIndexOf('.');

    if (lastDotIndex <= lastSlashIndex) {
        return `${basePath}${suffix}${suffixPart}`;
    }

    return `${basePath.slice(0, lastDotIndex)}${suffix}${basePath.slice(lastDotIndex)}${suffixPart}`;
};

const buildDerivedVariantUrl = (original: string, variant: Exclude<ImageVariant, 'original'>): string => {
    const originalWithBase = applyImageBaseUrl(original);
    return appendVariantSuffix(originalWithBase, VARIANT_SUFFIX[variant]);
};

export const isImageAsset = (value: unknown): value is ImageAsset => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<ImageAsset>;
    return candidate.kind === 'remote' && typeof candidate.original === 'string';
};

export const createRemoteImageAsset = (
    original: string,
    overrides: Omit<Partial<ImageAsset>, 'kind' | 'original'> = {}
): ImageAsset => {
    const normalizedOriginal = applyImageBaseUrl(original);
    const { thumbnail: overrideThumbnail, preview: overridePreview, ...restOverrides } = overrides;
    const thumbnail = overrideThumbnail
        ? applyImageBaseUrl(overrideThumbnail)
        : buildDerivedVariantUrl(original, 'thumbnail');
    const preview = overridePreview
        ? applyImageBaseUrl(overridePreview)
        : buildDerivedVariantUrl(original, 'preview');

    return {
        kind: 'remote',
        original: normalizedOriginal,
        ...restOverrides,
        thumbnail,
        preview
    };
};

export const toImageAsset = (value: ImageAssetLike): ImageAsset | null => {
    if (!value) {
        return null;
    }

    if (isImageAsset(value)) {
        const { kind: _kind, original, ...rest } = value;
        return createRemoteImageAsset(original, rest);
    }

    if (typeof value === 'string' && value.trim()) {
        return createRemoteImageAsset(value.trim());
    }

    return null;
};

export const toImageAssets = (values: ImageAssetLike[] | null | undefined): ImageAsset[] => {
    if (!values || values.length === 0) {
        return [];
    }

    return values
        .map((value) => toImageAsset(value))
        .filter((asset): asset is ImageAsset => Boolean(asset));
};

export const resolveImageAssetUrl = (
    value: ImageAssetLike,
    variant: ImageVariant = 'original'
): string => {
    const asset = toImageAsset(value);

    if (!asset) {
        return '';
    }

    if (variant === 'thumbnail' && asset.thumbnail) {
        return asset.thumbnail;
    }

    if (variant === 'preview' && asset.preview) {
        return asset.preview;
    }

    return asset.original;
};
