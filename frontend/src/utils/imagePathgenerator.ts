// 图片路径生成工具 - 基于后缀规则
export class ImagePathGenerator {
    private static variants = {
        thumbnail: '_thumb',
        preview: '_preview',
        original: ''
    };

    /**
     * 根据原图路径生成变体路径
     */
    static generateVariantPath(originalPath: string, variant: 'thumbnail' | 'preview' | 'original'): string {
        if (variant === 'original') {
            return originalPath;
        }

        const pathParts = originalPath.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');
        
        return `${basePath}${this.variants[variant]}.${extension}`;
    }

    /**
     * 生成图片的所有变体路径
     */
    static generateAllVariants(originalPath: string) {
        return {
            thumbnail: this.generateVariantPath(originalPath, 'thumbnail'),
            preview: this.generateVariantPath(originalPath, 'preview'),
            original: this.generateVariantPath(originalPath, 'original')
        };
    }

    /**
     * 检查图片变体是否存在
     */
    static async checkVariantExists(path: string): Promise<boolean> {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * 获取可用的图片变体（降级策略）
     */
    static async getAvailableVariants(originalPath: string) {
        const variants = this.generateAllVariants(originalPath);
        
        // 检查缩略图
        const hasThumbnail = await this.checkVariantExists(variants.thumbnail);
        // 检查预览图
        const hasPreview = await this.checkVariantExists(variants.preview);

        return {
            thumbnail: hasThumbnail ? variants.thumbnail : (hasPreview ? variants.preview : variants.original),
            preview: hasPreview ? variants.preview : variants.original,
            original: variants.original
        };
    }

    /**
     * 批量处理图片路径数组
     */
    static async processPhotoArray(originalPaths: string[], variant: 'thumbnail' | 'preview' | 'original'): Promise<string[]> {
        const processedPaths: string[] = [];
        
        for (const originalPath of originalPaths) {
            const targetPath = this.generateVariantPath(originalPath, variant);
            const exists = await this.checkVariantExists(targetPath);
            
            if (exists) {
                processedPaths.push(targetPath);
            } else {
                // 降级到原图
                processedPaths.push(originalPath);
            }
        }
        
        return processedPaths;
    }
}