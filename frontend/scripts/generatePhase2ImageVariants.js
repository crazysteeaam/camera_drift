const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { loadPhase2Catalog } = require('./phase2ConfigCatalog');

/**
 * 为单张图片生成变体
 */
async function generateVariantsForImage(sourceImagePath, targetFolder) {
    try {
        const ext = path.extname(sourceImagePath);
        const baseName = path.basename(sourceImagePath, ext);
        const fileName = path.basename(sourceImagePath);

        console.log(`处理图片: ${fileName}`);

        // 生成缩略图，与原图放在同目录
        const thumbnailPath = path.join(targetFolder, `${baseName}_thumb${ext}`);
        await sharp(sourceImagePath)
            .rotate()
            .resize(300, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
        console.log(`  ✓ 生成缩略图: ${path.basename(thumbnailPath)}`);

        // 生成预览图，与原图放在同目录
        const previewPath = path.join(targetFolder, `${baseName}_preview${ext}`);
        await sharp(sourceImagePath)
            .rotate()
            .resize(1200, null, { withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(previewPath);
        console.log(`  ✓ 生成预览图: ${path.basename(previewPath)}`);

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

function ensureRelayScaffold(groupPath, groupId, participantCount) {
    fs.mkdirSync(groupPath, { recursive: true });

    for (let i = 1; i <= participantCount; i++) {
        const relayDir = path.join(groupPath, `${groupId}${i}`);
        fs.mkdirSync(path.join(relayDir, 'photos'), { recursive: true });
        fs.mkdirSync(path.join(relayDir, 'message'), { recursive: true });
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
    const phase2Catalog = loadPhase2Catalog();

    let totalProcessed = 0;

    for (const province of phase2Catalog) {
        const provinceId = province.id;
        const sourceProvincePath = path.join(sourcePhase2PhotosDir, provinceId);
        const targetProvincePath = path.join(targetPhase2PhotosDir, provinceId);

        console.log(`\n处理省份: ${provinceId}`);

        fs.mkdirSync(sourceProvincePath, { recursive: true });
        fs.mkdirSync(targetProvincePath, { recursive: true });

        for (const group of province.groups) {
            const groupId = group.id;
            const sourceGroupPath = path.join(sourceProvincePath, groupId);
            const targetGroupPath = path.join(targetProvincePath, groupId);

            console.log(`\n处理组别: ${groupId}`);

            ensureRelayScaffold(sourceGroupPath, groupId, group.participantCount || 6);
            ensureRelayScaffold(targetGroupPath, groupId, group.participantCount || 6);

            // 处理A1, A2等目录结构
            for (let i = 1; i <= (group.participantCount || 6); i++) {
                const photoDir = `${groupId}${i}`;
                const sourcePhotoDirPath = path.join(sourceGroupPath, photoDir);
                const targetPhotoDirPath = path.join(targetGroupPath, photoDir);

                console.log(`\n处理目录: ${photoDir}`);

                // 处理主图片
                const sourcePhotosPath = path.join(sourcePhotoDirPath, 'photos');
                const targetPhotosPath = path.join(targetPhotoDirPath, 'photos');

                if (fs.existsSync(sourcePhotosPath)) {
                    await processFolder(sourcePhotosPath, targetPhotosPath);

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
                    await processFolder(sourceMessagePath, targetMessagePath);

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

    console.log(`\n✅ 第二期图片变体生成完成! 共处理了 ${totalProcessed} 张图片`);
    console.log('\n生成的文件结构:');
    console.log('  - 原图: photos/example.jpg');
    console.log('  - 缩略图: photos/example_thumb.jpg (300px宽度)');
    console.log('  - 预览图: photos/example_preview.jpg (1200px宽度)');
    console.log('\n文件位置: public/photos/phase2/');
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateVariantsForImage, processFolder, ensureRelayScaffold };
