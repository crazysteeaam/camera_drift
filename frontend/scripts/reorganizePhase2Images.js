const fs = require('fs');
const path = require('path');

/**
 * 重新组织第二期图片目录结构
 * 将缩略图和预览图分别放在独立的文件夹中
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
    console.log('  - 缩略图: thumbnails/example.jpg');
    console.log('  - 预览图: previews/example.jpg');
    console.log('  - 留言图片: message/example.jpg');
    console.log('  - 留言缩略图: message/thumbnails/example.jpg');
    console.log('  - 留言预览图: message/previews/example.jpg');
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

    // 创建缩略图和预览图目录
    const thumbnailsDir = path.join(dirPath, 'thumbnails');
    const previewsDir = path.join(dirPath, 'previews');

    if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true });
    }
    if (!fs.existsSync(previewsDir)) {
        fs.mkdirSync(previewsDir, { recursive: true });
    }

    // 移动缩略图文件
    for (const file of thumbnailFiles) {
        const sourcePath = path.join(dirPath, file);
        const targetPath = path.join(thumbnailsDir, file.replace('_thumb', ''));

        if (fs.existsSync(sourcePath)) {
            fs.renameSync(sourcePath, targetPath);
            console.log(`    ✓ 移动缩略图: ${file} -> thumbnails/${file.replace('_thumb', '')}`);
        }
    }

    // 移动预览图文件
    for (const file of previewFiles) {
        const sourcePath = path.join(dirPath, file);
        const targetPath = path.join(previewsDir, file.replace('_preview', ''));

        if (fs.existsSync(sourcePath)) {
            fs.renameSync(sourcePath, targetPath);
            console.log(`    ✓ 移动预览图: ${file} -> previews/${file.replace('_preview', '')}`);
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
