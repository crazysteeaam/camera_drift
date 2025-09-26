const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 为单张图片生成变体
 */
async function generateVariantsForImage(sourceImagePath, targetFolder) {
    try {
        const ext = path.extname(sourceImagePath);
        const baseName = path.basename(sourceImagePath, ext);

        console.log(`处理图片: ${path.basename(sourceImagePath)}`);

        // 生成缩略图 (300px宽度)
        const thumbnailPath = path.join(targetFolder, `${baseName}_thumb${ext}`);
        await sharp(sourceImagePath)
            .resize(300, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
        console.log(`  ✓ 生成缩略图: ${path.basename(thumbnailPath)}`);

        // 生成预览图 (1200px宽度)
        const previewPath = path.join(targetFolder, `${baseName}_preview${ext}`);
        await sharp(sourceImagePath)
            .resize(1200, null, { withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(previewPath);
        console.log(`  ✓ 生成预览图: ${path.basename(previewPath)}`);

        // 复制原图到目标文件夹
        const originalTargetPath = path.join(targetFolder, path.basename(sourceImagePath));
        fs.copyFileSync(sourceImagePath, originalTargetPath);
        console.log(`  ✓ 复制原图: ${path.basename(sourceImagePath)}`);

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
    const phase2PhotosDir = path.join(__dirname, '../public/photos/phase2');

    if (!fs.existsSync(phase2PhotosDir)) {
        console.log('第二期图片目录不存在，请先运行 npm run update-photos 创建目录结构');
        return;
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
        const provincePath = path.join(phase2PhotosDir, provinceId);
        if (!fs.existsSync(provincePath)) continue;

        console.log(`\n处理省份: ${provinceId}`);

        for (const groupId of groups[provinceId]) {
            const groupPath = path.join(provincePath, groupId);
            if (!fs.existsSync(groupPath)) continue;

            console.log(`\n处理组别: ${groupId}`);

            // 处理主图片 (photos目录)
            const photosPath = path.join(groupPath, 'photos');
            if (fs.existsSync(photosPath)) {
                await processFolder(photosPath, photosPath);

                // 统计处理的图片数量
                const files = fs.readdirSync(photosPath);
                const imageFiles = files.filter(file =>
                    /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
                    !file.includes('_thumb') &&
                    !file.includes('_preview')
                );
                totalProcessed += imageFiles.length;
            }

            // 处理留言图片 (message目录)
            const messagePath = path.join(groupPath, 'message');
            if (fs.existsSync(messagePath)) {
                await processFolder(messagePath, messagePath);

                // 统计处理的图片数量
                const files = fs.readdirSync(messagePath);
                const imageFiles = files.filter(file =>
                    /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
                    !file.includes('_thumb') &&
                    !file.includes('_preview')
                );
                totalProcessed += imageFiles.length;
            }

            // 处理A1, A2等目录结构
            for (let i = 1; i <= 6; i++) {
                const photoDir = `${groupId}${i}`;
                const photoDirPath = path.join(groupPath, photoDir);

                if (fs.existsSync(photoDirPath)) {
                    console.log(`\n处理目录: ${photoDir}`);

                    // 处理主图片
                    const photosSubPath = path.join(photoDirPath, 'photos');
                    if (fs.existsSync(photosSubPath)) {
                        await processFolder(photosSubPath, photosSubPath);

                        // 统计处理的图片数量
                        const files = fs.readdirSync(photosSubPath);
                        const imageFiles = files.filter(file =>
                            /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) &&
                            !file.includes('_thumb') &&
                            !file.includes('_preview')
                        );
                        totalProcessed += imageFiles.length;
                    }

                    // 处理留言图片
                    const messageSubPath = path.join(photoDirPath, 'message');
                    if (fs.existsSync(messageSubPath)) {
                        await processFolder(messageSubPath, messageSubPath);

                        // 统计处理的图片数量
                        const files = fs.readdirSync(messageSubPath);
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
    console.log('  - 原图: example.jpg');
    console.log('  - 缩略图: example_thumb.jpg (300px宽度)');
    console.log('  - 预览图: example_preview.jpg (1200px宽度)');
    console.log('\n文件位置: public/photos/phase2/');
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateVariantsForImage, processFolder };

