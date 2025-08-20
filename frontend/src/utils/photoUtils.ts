// 图片路径自动生成工具 - 支持自动遍历和动态导入

// 定义图片文件夹结构
const PHOTO_FOLDERS = {
    A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
    B: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
    C: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
    D: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']
};

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];

// 图片文件映射 - 基于实际文件结构
const PHOTO_MAP: Record<string, string[]> = {
    // A组照片 - 基于实际文件结构
    'A1': [
        '/photos/A1/000001.JPG',
        '/photos/A1/000002.JPG',
        '/photos/A1/000003.JPG',
        '/photos/A1/000004.JPG'
    ],
    'A2': [
        '/photos/A2/000005.JPG',
        '/photos/A2/000006.JPG',
        '/photos/A2/000027.JPG',
        '/photos/A2/000028.JPG'
    ],
    'A3': [
        '/photos/A3/000029.JPG',
        '/photos/A3/000030.JPG',
        '/photos/A3/000031.JPG',
        '/photos/A3/000032.JPG'
    ],
    'A4': [
        '/photos/A4/000033.jpg',
        '/photos/A4/000034.jpg',
        '/photos/A4/000037.jpg',
        '/photos/A4/000038.jpg'
    ],
    'A5': [
        '/photos/A5/000035.JPG',
        '/photos/A5/000036.JPG',
        '/photos/A5/000039.JPG',
        '/photos/A5/000040.JPG',
        '/photos/A5/000044.JPG'
    ],
    'A6': [
        '/photos/A6/000041.jpg',
        '/photos/A6/000042.jpg',
        '/photos/A6/000043.jpg',
        '/photos/A6/000045.jpg',
        '/photos/A6/000099.jpg'
    ],

    // B组照片
    'B1': [], // B1文件夹为空
    'B2': [
        '/photos/B2/000013000020.jpg',
        '/photos/B2/000013000021.jpg',
        '/photos/B2/000013000022.jpg',
        '/photos/B2/000013000023.jpg'
    ],
    'B3': [
        '/photos/B3/微信图片_2025-08-20_140701_050.jpg',
        '/photos/B3/微信图片_20250820140637_52.jpg',
        '/photos/B3/微信图片_20250820140655_53.jpg'
    ],
    'B4': [
        '/photos/B4/微信图片_20250820140742_55.jpg',
        '/photos/B4/微信图片_20250820140751_56.jpg',
        '/photos/B4/微信图片_20250820140755_57.jpg',
        '/photos/B4/微信图片_20250820140800_58.jpg'
    ],
    'B5': [
        '/photos/B5/000013000009.jpg',
        '/photos/B5/000013000012.jpg',
        '/photos/B5/微信图片_20250820140844_59.jpg',
        '/photos/B5/微信图片_20250820140854_60.jpg'
    ],
    'B6': [
        '/photos/B6/000013000004.jpg',
        '/photos/B6/000013000005.jpg',
        '/photos/B6/000013000006.jpg',
        '/photos/B6/000013000007.jpg'
    ],

    // C组照片
    'C1': [
        '/photos/C1/000001.JPG',
        '/photos/C1/000002.JPG',
        '/photos/C1/000003.JPG',
        '/photos/C1/000004.JPG'
    ],
    'C2': [
        '/photos/C2/000006.JPG',
        '/photos/C2/000007.JPG'
    ],
    'C3': [
        '/photos/C3/000008.JPG',
        '/photos/C3/000026.JPG',
        '/photos/C3/000028.JPG',
        '/photos/C3/000029.JPG'
    ],
    'C4': [
        '/photos/C4/000013.JPG',
        '/photos/C4/000027.JPG',
        '/photos/C4/000030.JPG',
        '/photos/C4/000031.JPG'
    ],
    'C5': [
        '/photos/C5/000032.JPG',
        '/photos/C5/000033.JPG',
        '/photos/C5/000034.JPG'
    ],
    'C6': [
        '/photos/C6/000019.JPG',
        '/photos/C6/000035.JPG',
        '/photos/C6/000036.JPG',
        '/photos/C6/000037.JPG',
        '/photos/C6/000038.JPG',
        '/photos/C6/000039.JPG'
    ],

    // D组照片
    'D1': [
        '/photos/D1/000001.JPG',
        '/photos/D1/000002.JPG',
        '/photos/D1/000003.JPG',
        '/photos/D1/000004.JPG'
    ],
    'D2': [
        '/photos/D2/000005.JPG',
        '/photos/D2/000006.JPG',
        '/photos/D2/000025.JPG',
        '/photos/D2/000026.JPG',
        '/photos/D2/000030.JPG'
    ],
    'D3': [
        '/photos/D3/000027.JPG',
        '/photos/D3/000028.JPG',
        '/photos/D3/000029.JPG',
        '/photos/D3/000031.JPG'
    ],
    'D4': [
        '/photos/D4/微信图片_20250820142721_61.jpg',
        '/photos/D4/微信图片_20250820142730_62.jpg'
    ],
    'D5': [
        '/photos/D5/000034.JPG'
    ],
    'D6': [] // D6文件夹为空
};

/**
 * 根据组别和序号自动生成图片路径
 * @param group 组别 (A, B, C, D)
 * @param index 序号 (1-6)
 * @returns 图片路径数组
 */
export function generatePhotoPaths(group: string, index: number): string[] {
    const folderName = PHOTO_FOLDERS[group as keyof typeof PHOTO_FOLDERS]?.[index - 1];
    if (!folderName) {
        console.warn(`Invalid group or index: ${group}${index}`);
        return [];
    }

    // 从预定义的映射中获取图片路径
    const photos = PHOTO_MAP[folderName] || [];

    // 如果找到了图片，返回它们
    if (photos.length > 0) {
        console.log(`Found ${photos.length} photos for ${folderName}:`, photos);
        return photos;
    }

    // 如果没有找到图片，尝试生成通用路径（基于命名规则）
    console.warn(`No photos found for ${folderName}, trying to generate generic paths`);
    return generateGenericPaths(folderName);
}

/**
 * 生成通用图片路径（基于命名规则）
 * @param folderName 文件夹名称
 * @returns 图片路径数组
 */
function generateGenericPaths(folderName: string): string[] {
    const paths: string[] = [];

    // 尝试不同的命名规则
    const namingPatterns = [
        // 规则1: 6位数字 + .JPG
        (i: number) => `/photos/${folderName}/${String(i).padStart(6, '0')}.JPG`,
        // 规则2: 6位数字 + .jpg
        (i: number) => `/photos/${folderName}/${String(i).padStart(6, '0')}.jpg`,
        // 规则3: 4位数字 + .JPG
        (i: number) => `/photos/${folderName}/${String(i).padStart(4, '0')}.JPG`,
        // 规则4: 4位数字 + .jpg
        (i: number) => `/photos/${folderName}/${String(i).padStart(4, '0')}.jpg`,
        // 规则5: 3位数字 + .JPG
        (i: number) => `/photos/${folderName}/${String(i).padStart(3, '0')}.JPG`,
        // 规则6: 3位数字 + .jpg
        (i: number) => `/photos/${folderName}/${String(i).padStart(3, '0')}.jpg`
    ];

    // 尝试前20个可能的文件名
    for (let i = 1; i <= 20; i++) {
        for (const pattern of namingPatterns) {
            const path = pattern(i);
            paths.push(path);
        }
    }

    console.log(`Generated ${paths.length} generic paths for ${folderName}`);
    return paths;
}

/**
 * 获取所有组别的图片路径配置
 * @returns 完整的图片路径配置对象
 */
export function getAllPhotoPaths() {
    const result: Record<string, Record<number, string[]>> = {};

    Object.keys(PHOTO_FOLDERS).forEach(group => {
        result[group] = {};
        PHOTO_FOLDERS[group as keyof typeof PHOTO_FOLDERS].forEach((_, index) => {
            result[group][index + 1] = generatePhotoPaths(group, index + 1);
        });
    });

    return result;
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
        console.warn(`Failed to validate path: ${path}`, error);
        return false;
    }
}

/**
 * 批量验证图片路径
 * @param paths 图片路径数组
 * @returns Promise<string[]> 有效的图片路径数组
 */
export async function validatePhotoPaths(paths: string[]): Promise<string[]> {
    const validPaths: string[] = [];

    for (const path of paths) {
        const isValid = await validatePhotoPath(path);
        if (isValid) {
            validPaths.push(path);
        }
    }

    console.log(`Validated ${paths.length} paths, found ${validPaths.length} valid ones`);
    return validPaths;
}

/**
 * 获取有效的图片路径（经过验证）
 * @param group 组别
 * @param index 序号
 * @returns Promise<string[]> 有效的图片路径数组
 */
export async function getValidPhotoPaths(group: string, index: number): Promise<string[]> {
    const paths = generatePhotoPaths(group, index);
    return await validatePhotoPaths(paths);
}

/**
 * 动态添加新图片路径
 * @param folderName 文件夹名称
 * @param newPaths 新的图片路径数组
 */
export function addPhotoPaths(folderName: string, newPaths: string[]) {
    if (!PHOTO_MAP[folderName]) {
        PHOTO_MAP[folderName] = [];
    }

    // 添加新路径，避免重复
    newPaths.forEach(path => {
        if (!PHOTO_MAP[folderName].includes(path)) {
            PHOTO_MAP[folderName].push(path);
        }
    });

    console.log(`Added ${newPaths.length} new paths to ${folderName}`);
}

/**
 * 获取所有已知的图片路径
 * @returns 完整的图片路径映射
 */
export function getPhotoMap() {
    return { ...PHOTO_MAP };
}
