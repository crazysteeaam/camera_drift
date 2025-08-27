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
        console.log(`源文件夹中没有找到图片: ${sourceFolder}`);
        return;
    }
    
    console.log(`\n处理文件夹: ${path.basename(sourceFolder)} (${imageFiles.length}张图片)`);
    
    for (const file of imageFiles) {
        const sourceImagePath = path.join(sourceFolder, file);
        await generateVariantsForImage(sourceImagePath, targetFolder);
    }
}

/**
 * 批量处理所有图片
 */
async function processAllImages() {
    const photosDir = path.join(__dirname, '../photos');
    const publicPhotosDir = path.join(__dirname, '../public/photos');
    
    if (!fs.existsSync(photosDir)) {
        console.error('photos 文件夹不存在!');
        return;
    }
    
    // 确保 public/photos 目录存在
    if (!fs.existsSync(publicPhotosDir)) {
        fs.mkdirSync(publicPhotosDir, { recursive: true });
        console.log('创建 public/photos 目录');
    }
    
    console.log('开始生成图片变体...\n');
    
    // 遍历所有组别
    const groups = ['A', 'B', 'C', 'D'];
    let totalProcessed = 0;
    
    for (const group of groups) {
        for (let i = 1; i <= 6; i++) {
            const sourceFolder = path.join(photosDir, `${group}${i}`);
            const targetFolder = path.join(publicPhotosDir, `${group}${i}`);
            
            // 确保目标文件夹存在
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }
            
            await processFolder(sourceFolder, targetFolder);
            
            // 统计处理的图片数量
            if (fs.existsSync(sourceFolder)) {
                const files = fs.readdirSync(sourceFolder);
                const imageFiles = files.filter(file => 
                    /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file) && 
                    !file.includes('_thumb') && 
                    !file.includes('_preview')
                );
                totalProcessed += imageFiles.length;
            }
        }
    }
    
    console.log(`\n✅ 处理完成! 共处理了 ${totalProcessed} 张图片`);
    console.log('\n生成的文件结构:');
    console.log('  - 原图: example.jpg');
    console.log('  - 缩略图: example_thumb.jpg (300px宽度)');
    console.log('  - 预览图: example_preview.jpg (1200px宽度)');
    console.log('\n文件位置: public/photos/');
}

/**
 * 清理生成的变体文件
 */
async function cleanupVariants() {
    const photosDir = path.join(__dirname, '../photos');
    
    if (!fs.existsSync(photosDir)) {
        console.error('photos 文件夹不存在!');
        return;
    }
    
    console.log('开始清理图片变体...\n');
    
    const groups = ['A', 'B', 'C', 'D'];
    let totalCleaned = 0;
    
    for (const group of groups) {
        for (let i = 1; i <= 6; i++) {
            const folderPath = path.join(photosDir, `${group}${i}`);
            
            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath);
                const variantFiles = files.filter(file => 
                    file.includes('_thumb') || file.includes('_preview')
                );
                
                for (const file of variantFiles) {
                    const filePath = path.join(folderPath, file);
                    fs.unlinkSync(filePath);
                    console.log(`删除: ${file}`);
                    totalCleaned++;
                }
            }
        }
    }
    
    console.log(`\n✅ 清理完成! 共删除 ${totalCleaned} 个变体文件`);
}

// 命令行参数处理
const command = process.argv[2];

switch (command) {
    case 'cleanup':
        cleanupVariants();
        break;
    case 'generate':
    default:
        processAllImages();
        break;
}