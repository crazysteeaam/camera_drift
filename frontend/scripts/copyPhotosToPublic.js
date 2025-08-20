#!/usr/bin/env node

/**
 * 复制图片到public文件夹的脚本
 * 使用方法: node scripts/copyPhotosToPublic.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const SOURCE_PHOTOS_DIR = path.join(__dirname, '..', 'photos');
const TARGET_PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');

/**
 * 复制文件夹
 */
function copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const files = fs.readdirSync(source);
    
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
            copyDirectory(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始复制图片到public文件夹...');
    
    // 检查源文件夹是否存在
    if (!fs.existsSync(SOURCE_PHOTOS_DIR)) {
        console.error(`❌ 源图片文件夹不存在: ${SOURCE_PHOTOS_DIR}`);
        process.exit(1);
    }
    
    // 检查目标文件夹是否存在，如果不存在则创建
    if (!fs.existsSync(TARGET_PHOTOS_DIR)) {
        fs.mkdirSync(TARGET_PHOTOS_DIR, { recursive: true });
        console.log(`✅ 创建目标文件夹: ${TARGET_PHOTOS_DIR}`);
    }
    
    try {
        // 复制所有图片
        copyDirectory(SOURCE_PHOTOS_DIR, TARGET_PHOTOS_DIR);
        console.log(`✅ 图片复制完成！`);
        console.log(`📁 源文件夹: ${SOURCE_PHOTOS_DIR}`);
        console.log(`📁 目标文件夹: ${TARGET_PHOTOS_DIR}`);
        
        // 显示统计信息
        const targetFolders = fs.readdirSync(TARGET_PHOTOS_DIR).filter(item => 
            fs.statSync(path.join(TARGET_PHOTOS_DIR, item)).isDirectory()
        );
        
        console.log(`📊 复制完成，共 ${targetFolders.length} 个文件夹:`);
        targetFolders.forEach(folder => {
            const folderPath = path.join(TARGET_PHOTOS_DIR, folder);
            const files = fs.readdirSync(folderPath).filter(file => 
                /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file)
            );
            console.log(`   ${folder}: ${files.length} 张图片`);
        });
        
    } catch (error) {
        console.error(`❌ 复制失败:`, error);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { copyDirectory };


