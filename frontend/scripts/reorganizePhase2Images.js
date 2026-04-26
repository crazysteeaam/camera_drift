const fs = require('fs');
const path = require('path');

/**
 * 重新组织第二期图片目录结构
 * 将旧的 thumbnails / previews 目录扁平化回原图同目录
 */
async function reorganizeImages() {
    const phase2PhotosDir = path.join(__dirname, '../public/photos/phase2');

    if (!fs.existsSync(phase2PhotosDir)) {
        console.log('第二期图片目录不存在');
        return;
    }

    console.log('开始重新组织第二期图片目录结构...\n');

    // 遍历所有省份
    const provinces = ['zhejiang', 'guangdong', 'jiangsu', 'shanghai', 'macau', 'hongkong', 'hainan', 'fujian'];
    const groups = {
        'zhejiang': ['A', 'B'],
        'guangdong': ['C', 'D', 'E', 'F'],
        'jiangsu': ['G', 'H', 'I'],
        'shanghai': ['J'],
        'macau': ['K'],
        'hongkong': ['L'],
        'hainan': ['M'],
        'fujian': ['N', 'O']
    };

    let totalProcessed = 0;

    for (const provinceId of provinces) {
        const provincePath = path.join(phase2PhotosDir, provinceId);
        if (!fs.existsSync(provincePath)) continue;

        console.log(`\n处理省份: ${provinceId}`);

        for (const groupId of groups[provinceId]) {
            const groupPath = path.join(provincePath, groupId);
            if (!fs.existsSync(groupPath)) continue;

            console.log(`\n处理组别: ${groupId}`);

            // 处理A1, A2等目录结构
            for (let i = 1; i <= 6; i++) {
                const photoDir = `${groupId}${i}`;
                const photoDirPath = path.join(groupPath, photoDir);

                if (fs.existsSync(photoDirPath)) {
                    console.log(`\n处理目录: ${photoDir}`);

                    // 处理主图片目录
                    const photosPath = path.join(photoDirPath, 'photos');
                    if (fs.existsSync(photosPath)) {
                        await reorganizeDirectory(photosPath, 'photos');
                        totalProcessed += await countImages(photosPath);
                    }

                    // 处理留言图片目录
                    const messagePath = path.join(photoDirPath, 'message');
                    if (fs.existsSync(messagePath)) {
                        await reorganizeDirectory(messagePath, 'message');
                        totalProcessed += await countImages(messagePath);
                    }
                }
            }
        }
    }

    console.log(`\n✅ 图片目录重新组织完成! 共处理了 ${totalProcessed} 张图片`);
    console.log('\n新的目录结构:');
    console.log('  - 原图: photos/example.jpg');
    console.log('  - 缩略图: photos/example_thumb.jpg');
    console.log('  - 预览图: photos/example_preview.jpg');
    console.log('  - 留言图片: message/example.jpg');
    console.log('  - 留言缩略图: message/example_thumb.jpg');
    console.log('  - 留言预览图: message/example_preview.jpg');
}

/**
 * 重新组织单个目录
 */
async function reorganizeDirectory(dirPath, type) {
    const files = fs.readdirSync(dirPath);

    // 分离原图、缩略图和预览图
    const originalFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
        !file.includes('_thumb') &&
        !file.includes('_preview')
    );

    const thumbnailFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
        file.includes('_thumb')
    );

    const previewFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
        file.includes('_preview')
    );

    if (originalFiles.length === 0) return;

    console.log(`  ${type}: ${originalFiles.length}张原图, ${thumbnailFiles.length}张缩略图, ${previewFiles.length}张预览图`);

    const thumbnailsDir = path.join(dirPath, 'thumbnails');
    const previewsDir = path.join(dirPath, 'previews');

    if (fs.existsSync(thumbnailsDir)) {
        for (const file of fs.readdirSync(thumbnailsDir)) {
            const sourcePath = path.join(thumbnailsDir, file);
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const targetPath = path.join(dirPath, `${baseName}_thumb${ext}`);

            if (fs.existsSync(sourcePath)) {
                fs.renameSync(sourcePath, targetPath);
                console.log(`    ✓ 扁平化缩略图: thumbnails/${file} -> ${path.basename(targetPath)}`);
            }
        }

        if (fs.existsSync(thumbnailsDir) && fs.readdirSync(thumbnailsDir).length === 0) {
            fs.rmdirSync(thumbnailsDir);
        }
    }

    if (fs.existsSync(previewsDir)) {
        for (const file of fs.readdirSync(previewsDir)) {
            const sourcePath = path.join(previewsDir, file);
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const targetPath = path.join(dirPath, `${baseName}_preview${ext}`);

            if (fs.existsSync(sourcePath)) {
                fs.renameSync(sourcePath, targetPath);
                console.log(`    ✓ 扁平化预览图: previews/${file} -> ${path.basename(targetPath)}`);
            }
        }

        if (fs.existsSync(previewsDir) && fs.readdirSync(previewsDir).length === 0) {
            fs.rmdirSync(previewsDir);
        }
    }
}

/**
 * 统计图片数量
 */
async function countImages(dirPath) {
    const files = fs.readdirSync(dirPath);
    return files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
        !file.includes('_thumb') &&
        !file.includes('_preview')
    ).length;
}

// 运行脚本
if (require.main === module) {
    reorganizeImages().catch(console.error);
}

module.exports = { reorganizeImages, reorganizeDirectory };
