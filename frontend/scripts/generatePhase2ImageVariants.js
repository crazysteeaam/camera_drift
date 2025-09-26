const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 为单张图片生成变体
 */
async function generateVariantsForImage(sourceImagePath, targetFolder) {
    try {
        const fileName = path.basename(sourceImagePath);
        const targetThumbnailsDir = path.join(targetFolder, 'thumbnails');
        const targetPreviewsDir = path.join(targetFolder, 'previews');

        console.log(`处理图片: ${fileName}`);

        // 确保 thumbnails 和 previews 目录存在
        if (!fs.existsSync(targetThumbnailsDir)) {
            fs.mkdirSync(targetThumbnailsDir, { recursive: true });
        }
        if (!fs.existsSync(targetPreviewsDir)) {
            fs.mkdirSync(targetPreviewsDir, { recursive: true });
        }

        // 生成缩略图 (300px宽度) 到 thumbnails 目录
        const thumbnailPath = path.join(targetThumbnailsDir, fileName);
        await sharp(sourceImagePath)
            .resize(300, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
        console.log(`  ✓ 生成缩略图: thumbnails/${fileName}`);

        // 生成预览图 (1200px宽度) 到 previews 目录
        const previewPath = path.join(targetPreviewsDir, fileName);
        await sharp(sourceImagePath)
            .resize(1200, null, { withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(previewPath);
        console.log(`  ✓ 生成预览图: previews/${fileName}`);

        // 复制原图到目标文件夹
        const originalTargetPath = path.join(targetFolder, fileName);
        fs.copyFileSync(sourceImagePath, originalTargetPath);
        console.log(`  ✓ 复制原图: ${fileName}`);

    } catch (error) {
        console.error(`处理图片失败 ${sourceImagePath}:`, error.message);
    }
}

/**
 * 处理文件夹中的所有图片
 */
async function processFolder(sourceFolder, targetFolder) {
    if (!fs.existsSync(sourceFolder)) {
        console.log(`源文件夹不存在: ${sourceFolder}`);
        return;
    }

    const files = fs.readdirSync(sourceFolder);
    const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
        !file.includes('_thumb') &&
        !file.includes('_preview')
    );

    if (imageFiles.length === 0) {
        console.log(`文件夹 ${path.basename(sourceFolder)} 中没有找到图片文件`);
        return;
    }

    console.log(`\n处理文件夹: ${path.basename(sourceFolder)} (${imageFiles.length}张图片)`);

    for (const file of imageFiles) {
        const sourceImagePath = path.join(sourceFolder, file);
        await generateVariantsForImage(sourceImagePath, targetFolder);
    }
}

/**
 * 主函数
 */
async function main() {
    const sourcePhase2PhotosDir = path.join(__dirname, '../photos/phase2');
    const targetPhase2PhotosDir = path.join(__dirname, '../public/photos/phase2');

    if (!fs.existsSync(sourcePhase2PhotosDir)) {
        console.log('源第二期图片目录不存在: photos/phase2');
        return;
    }

    // 确保目标目录存在
    if (!fs.existsSync(targetPhase2PhotosDir)) {
        fs.mkdirSync(targetPhase2PhotosDir, { recursive: true });
        console.log('创建目标目录: public/photos/phase2');
    }

    console.log('开始生成第二期图片变体...\n');

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
        const sourceProvincePath = path.join(sourcePhase2PhotosDir, provinceId);
        const targetProvincePath = path.join(targetPhase2PhotosDir, provinceId);
        
        if (!fs.existsSync(sourceProvincePath)) continue;

        console.log(`\n处理省份: ${provinceId}`);

        // 确保目标省份目录存在
        if (!fs.existsSync(targetProvincePath)) {
            fs.mkdirSync(targetProvincePath, { recursive: true });
        }

        for (const groupId of groups[provinceId]) {
            const sourceGroupPath = path.join(sourceProvincePath, groupId);
            const targetGroupPath = path.join(targetProvincePath, groupId);
            
            if (!fs.existsSync(sourceGroupPath)) continue;

            console.log(`\n处理组别: ${groupId}`);

            // 确保目标组别目录存在
            if (!fs.existsSync(targetGroupPath)) {
                fs.mkdirSync(targetGroupPath, { recursive: true });
            }

            // 处理A1, A2等目录结构
            for (let i = 1; i <= 6; i++) {
                const photoDir = `${groupId}${i}`;
                const sourcePhotoDirPath = path.join(sourceGroupPath, photoDir);
                const targetPhotoDirPath = path.join(targetGroupPath, photoDir);

                if (fs.existsSync(sourcePhotoDirPath)) {
                    console.log(`\n处理目录: ${photoDir}`);

                    // 确保目标子目录存在
                    if (!fs.existsSync(targetPhotoDirPath)) {
                        fs.mkdirSync(targetPhotoDirPath, { recursive: true });
                    }

                    // 处理主图片
                    const sourcePhotosPath = path.join(sourcePhotoDirPath, 'photos');
                    const targetPhotosPath = path.join(targetPhotoDirPath, 'photos');
                    
                    if (fs.existsSync(sourcePhotosPath)) {
                        // 确保目标photos目录存在
                        if (!fs.existsSync(targetPhotosPath)) {
                            fs.mkdirSync(targetPhotosPath, { recursive: true });
                        }
                        
                        await processFolder(sourcePhotosPath, targetPhotosPath);

                        // 统计处理的图片数量
                        const files = fs.readdirSync(sourcePhotosPath);
                        const imageFiles = files.filter(file =>
                            /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
                            !file.includes('_thumb') &&
                            !file.includes('_preview')
                        );
                        totalProcessed += imageFiles.length;
                    }

                    // 处理留言图片
                    const sourceMessagePath = path.join(sourcePhotoDirPath, 'message');
                    const targetMessagePath = path.join(targetPhotoDirPath, 'message');
                    
                    if (fs.existsSync(sourceMessagePath)) {
                        // 确保目标message目录存在
                        if (!fs.existsSync(targetMessagePath)) {
                            fs.mkdirSync(targetMessagePath, { recursive: true });
                        }
                        
                        await processFolder(sourceMessagePath, targetMessagePath);

                        // 统计处理的图片数量
                        const files = fs.readdirSync(sourceMessagePath);
                        const imageFiles = files.filter(file =>
                            /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
                            !file.includes('_thumb') &&
                            !file.includes('_preview')
                        );
                        totalProcessed += imageFiles.length;
                    }
                }
            }
        }
    }

    console.log(`\n✅ 第二期图片变体生成完成! 共处理了 ${totalProcessed} 张图片`);
    console.log('\n生成的文件结构:');
    console.log('  - 原图: photos/example.jpg');
    console.log('  - 缩略图: photos/thumbnails/example.jpg (300px宽度)');
    console.log('  - 预览图: photos/previews/example.jpg (1200px宽度)');
    console.log('\n文件位置: public/photos/phase2/');
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateVariantsForImage, processFolder };

