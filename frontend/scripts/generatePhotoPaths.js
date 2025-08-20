#!/usr/bin/env node

/**
 * 图片路径生成脚本
 * 使用方法: node scripts/generatePhotoPaths.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'config', 'photoConfig.ts');

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];

/**
 * 检查文件是否为图片
 */
function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * 生成图片路径配置
 */
function generatePhotoConfig() {
    const config = {};

    // 遍历photos目录
    if (!fs.existsSync(PHOTOS_DIR)) {
        console.error(`❌ Photos directory not found: ${PHOTOS_DIR}`);
        return null;
    }

    const groups = fs.readdirSync(PHOTOS_DIR).filter(item =>
        fs.statSync(path.join(PHOTOS_DIR, item)).isDirectory()
    );

    console.log(`📁 Found groups: ${groups.join(', ')}`);

    groups.forEach(folderName => {
        // 提取组别和序号（如A1 -> group='A', index=1）
        const group = folderName.charAt(0);
        const index = parseInt(folderName.substring(1));

        if (!isNaN(index)) {
            if (!config[group]) {
                config[group] = {};
            }

            const folderPath = path.join(PHOTOS_DIR, folderName);
            const files = fs.readdirSync(folderPath)
                .filter(file => isImageFile(file))
                .sort(); // 按文件名排序

            if (files.length > 0) {
                config[group][index] = files.map(file =>
                    `/photos/${folderName}/${file}`
                );
                console.log(`✅ ${folderName}: ${files.length} photos`);
            } else {
                config[group][index] = [];
                console.log(`⚠️  ${folderName}: 0 photos (empty folder)`);
            }
        }
    });

    return config;
}

/**
 * 生成TypeScript配置文件
 */
function generateTypeScriptConfig(photoConfig) {
    const template = `// 图片配置文件 - 自动生成，请勿手动修改
// 生成时间: ${new Date().toISOString()}

// 定义类型
type PhotoGroup = {
    [key: number]: string[];
};

type PhotoConfig = {
    [key: string]: PhotoGroup;
};

// 图片路径配置 - 基于实际文件结构
export const PHOTO_CONFIG: PhotoConfig = ${JSON.stringify(photoConfig, null, 4)};

/**
 * 获取指定组别和序号的图片路径
 * @param group 组别 (A, B, C, D)
 * @param index 序号 (1-6)
 * @returns 图片路径数组
 */
export function getPhotoPaths(group: string, index: number): string[] {
    return PHOTO_CONFIG[group as keyof typeof PHOTO_CONFIG]?.[index] || [];
}

/**
 * 获取所有图片配置
 * @returns 完整的图片配置对象
 */
export function getAllPhotoConfig() {
    return PHOTO_CONFIG;
}

/**
 * 添加新的图片路径
 * @param group 组别
 * @param index 序号
 * @param newPaths 新的图片路径数组
 */
export function addPhotoPaths(group: string, index: number, newPaths: string[]) {
    if (!PHOTO_CONFIG[group as keyof typeof PHOTO_CONFIG]) {
        (PHOTO_CONFIG as any)[group] = {};
    }
    
    if (!PHOTO_CONFIG[group as keyof typeof PHOTO_CONFIG][index]) {
        (PHOTO_CONFIG as any)[group][index] = [];
    }
    
    // 添加新路径，避免重复
    newPaths.forEach(path => {
        if (!PHOTO_CONFIG[group as keyof typeof PHOTO_CONFIG][index].includes(path)) {
            (PHOTO_CONFIG as any)[group][index].push(path);
        }
    });
    
    console.log(\`Added \${newPaths.length} new paths to \${group}\${index}\`);
}

/**
 * 验证图片路径是否存在
 * @param path 图片路径
 * @returns Promise<boolean> 是否存在
 */
export async function validatePhotoPath(path: string): Promise<boolean> {
    try {
        const response = await fetch(path, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn(\`Failed to validate path: \${path}\`, error);
        return false;
    }
}

/**
 * 获取有效的图片路径（经过验证）
 * @param group 组别
 * @param index 序号
 * @returns Promise<string[]> 有效的图片路径数组
 */
export async function getValidPhotoPaths(group: string, index: number): Promise<string[]> {
    const paths = getPhotoPaths(group, index);
    const validPaths: string[] = [];
    
    for (const path of paths) {
        const isValid = await validatePhotoPath(path);
        if (isValid) {
            validPaths.push(path);
        }
    }
    
    console.log(\`Validated \${paths.length} paths for \${group}\${index}, found \${validPaths.length} valid ones\`);
    return validPaths;
}
`;

    return template;
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始生成图片路径配置...');

    // 生成配置
    const photoConfig = generatePhotoConfig();
    if (!photoConfig) {
        process.exit(1);
    }

    // 生成TypeScript代码
    const tsCode = generateTypeScriptConfig(photoConfig);

    // 写入文件
    try {
        fs.writeFileSync(OUTPUT_FILE, tsCode, 'utf8');
        console.log(`✅ 配置文件已生成: ${OUTPUT_FILE}`);
        console.log('📊 配置统计:');

        Object.keys(photoConfig).forEach(group => {
            const groupConfig = photoConfig[group];
            const totalPhotos = Object.values(groupConfig).reduce((sum, photos) => sum + photos.length, 0);
            console.log(`   ${group}组: ${totalPhotos} 张照片`);
        });

    } catch (error) {
        console.error(`❌ 写入文件失败:`, error);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { generatePhotoConfig, generateTypeScriptConfig };
