const fs = require('fs');
const path = require('path');

// 配置文件路径
const configPath = path.join(__dirname, '../src/config/phase2Data.ts');
const photosBasePath = path.join(__dirname, '../public/photos/phase2');

// 省份ID映射
const provinceIdMap = {
    'zhejiang': '浙江省',
    'guangdong': '广东省',
    'jiangsu': '江苏省',
    'shanghai': '上海市',
    'macau': '澳门特别行政区',
    'hongkong': '香港特别行政区',
    'hainan': '海南省',
    'fujian': '福建省'
};

// 组ID映射
const groupIdMap = {
    'A': 'A组', 'B': 'B组', 'C': 'C组', 'D': 'D组', 'E': 'E组', 'F': 'F组',
    'G': 'G组', 'H': 'H组', 'I': 'I组', 'J': 'J组', 'K': 'K组', 'L': 'L组',
    'M': 'M组', 'N': 'N组', 'O': 'O组'
};

// 扫描图片目录
function scanPhotos() {
    const result = {};

    if (!fs.existsSync(photosBasePath)) {
        console.log('图片目录不存在，创建目录结构...');
        createDirectoryStructure();
        return result;
    }

    // 扫描省份目录
    const provinceDirs = fs.readdirSync(photosBasePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const provinceId of provinceDirs) {
        if (!provinceIdMap[provinceId]) continue;

        result[provinceId] = {};
        const provincePath = path.join(photosBasePath, provinceId);

        // 扫描组目录
        const groupDirs = fs.readdirSync(provincePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const groupId of groupDirs) {
            if (!groupIdMap[groupId]) continue;

            result[provinceId][groupId] = {
                mainPhotos: [],
                messagePhotos: []
            };

            const groupPath = path.join(provincePath, groupId);

            // 扫描主图片 - 支持A1, A2这种目录结构，主图片放在photos子目录下
            const mainPhotos = [];
            const mainPhotoDirs = fs.readdirSync(groupPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory() && /^[A-Z]\d+$/.test(dirent.name))
                .map(dirent => dirent.name)
                .sort();

            for (const photoDir of mainPhotoDirs) {
                const photosDirPath = path.join(groupPath, photoDir, 'photos');
                if (fs.existsSync(photosDirPath)) {
                    const photos = fs.readdirSync(photosDirPath)
                        .filter(file => file.endsWith('.JPG') && !file.includes('_preview') && !file.includes('_thumbnail'))
                        .sort();

                    photos.forEach(photo => {
                        mainPhotos.push(`/photos/phase2/${provinceId}/${groupId}/${photoDir}/photos/${photo}`);
                    });
                }
            }

            // 如果A1, A2目录不存在，则扫描根目录的图片
            if (mainPhotos.length === 0) {
                const rootPhotos = fs.readdirSync(groupPath)
                    .filter(file => file.endsWith('.JPG') && !file.includes('_preview') && !file.includes('_thumbnail'))
                    .sort();

                mainPhotos.push(...rootPhotos.map(photo =>
                    `/photos/phase2/${provinceId}/${groupId}/${photo}`
                ));
            }

            result[provinceId][groupId].mainPhotos = mainPhotos;

            // 扫描留言图片 - 支持A1, A2这种目录结构
            const messagePhotos = [];
            for (const photoDir of mainPhotoDirs) {
                const messagePath = path.join(groupPath, photoDir, 'message');
                if (fs.existsSync(messagePath)) {
                    const photos = fs.readdirSync(messagePath)
                        .filter(file => file.endsWith('.JPG'))
                        .sort();

                    photos.forEach(photo => {
                        messagePhotos.push(`/photos/phase2/${provinceId}/${groupId}/${photoDir}/message/${photo}`);
                    });
                }
            }

            // 如果A1, A2目录下没有message，则扫描根目录的message
            if (messagePhotos.length === 0) {
                const messagePath = path.join(groupPath, 'message');
                if (fs.existsSync(messagePath)) {
                    const photos = fs.readdirSync(messagePath)
                        .filter(file => file.endsWith('.JPG'))
                        .sort();

                    messagePhotos.push(...photos.map(photo =>
                        `/photos/phase2/${provinceId}/${groupId}/message/${photo}`
                    ));
                }
            }

            result[provinceId][groupId].messagePhotos = messagePhotos;
        }
    }

    return result;
}

// 创建目录结构
function createDirectoryStructure() {
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

    for (const provinceId of provinces) {
        const provincePath = path.join(photosBasePath, provinceId);
        fs.mkdirSync(provincePath, { recursive: true });

        for (const groupId of groups[provinceId]) {
            const groupPath = path.join(provincePath, groupId);
            fs.mkdirSync(groupPath, { recursive: true });

            // 创建A1, A2等目录结构示例
            for (let i = 1; i <= 6; i++) {
                const photoDir = `${groupId}${i}`;
                const photoDirPath = path.join(groupPath, photoDir);
                fs.mkdirSync(photoDirPath, { recursive: true });

                // 创建主图片目录
                const photosPath = path.join(photoDirPath, 'photos');
                fs.mkdirSync(photosPath, { recursive: true });

                // 创建留言图片目录
                const messagePath = path.join(photoDirPath, 'message');
                fs.mkdirSync(messagePath, { recursive: true });
            }

            // 创建README文件说明目录结构
            const readmePath = path.join(groupPath, 'README.md');
            if (!fs.existsSync(readmePath)) {
                const readmeContent = `# ${provinceIdMap[provinceId]} ${groupIdMap[groupId]} 图片目录

## 目录结构（推荐）
使用A1, A2这种目录结构，主图片和留言图片分别存放：
\`\`\`
${groupId}/
├── ${groupId}1/                    # 第一棒
│   ├── photos/                     # 主图片目录
│   │   ├── 任意名称.JPG           # 主图片
│   │   └── 另一张图片.JPG         # 主图片
│   └── message/                    # 留言图片目录
│       ├── 留言图片1.JPG
│       └── 留言图片2.JPG
├── ${groupId}2/                    # 第二棒
│   ├── photos/                     # 主图片目录
│   │   └── 风景.JPG
│   └── message/                    # 留言图片目录
│       └── 留言图片.JPG
└── ...
\`\`\`

## 传统目录结构（也支持）
如果不想使用A1, A2结构，也可以直接放在组目录下：
\`\`\`
${groupId}/
├── 000001.JPG                     # 主图片
├── 000002.JPG                     # 主图片
└── message/                       # 留言图片
    ├── message_001.JPG
    └── message_002.JPG
\`\`\`

## 自动更新
运行 \`npm run update-photos\` 会自动扫描此目录并更新配置文件。
`;
                fs.writeFileSync(readmePath, readmeContent);
            }
        }
    }

    console.log('目录结构创建完成！');
}

// 更新配置文件
function updateConfigFile(photoData) {
    let configContent = fs.readFileSync(configPath, 'utf8');

    // 更新每个省份的图片数据
    for (const [provinceId, groups] of Object.entries(photoData)) {
        for (const [groupId, photos] of Object.entries(groups)) {
            // 更新主图片
            if (photos.mainPhotos.length > 0) {
                const photosArray = photos.mainPhotos.map(photo => `'${photo}'`).join(',\n                        ');
                const photosPattern = new RegExp(
                    `(relays: \\[\\s*{[\\s\\S]*?id: \\d+,[\\s\\S]*?name: '[^']*',[\\s\\S]*?participant: '[^']*',[\\s\\S]*?location: '[^']*',[\\s\\S]*?province: '${provinceIdMap[provinceId]}',[\\s\\S]*?city: '[^']*',[\\s\\S]*?date: '[^']*',[\\s\\S]*?time: '[^']*',[\\s\\S]*?weather: '[^']*',[\\s\\S]*?camera: '[^']*',[\\s\\S]*?film: '[^']*',[\\s\\S]*?photos: \\[)[^\\]]*(\\][\\s\\S]*?message: '[^']*',[\\s\\S]*?coordinates: [^}]+,[\\s\\S]*?tags: [^\\]]+,[\\s\\S]*?nextLocation: '[^']*',[\\s\\S]*?nextParticipant: '[^']*'[\\s\\S]*?}[\\s\\S]*?\\])`,
                    'g'
                );

                configContent = configContent.replace(photosPattern, (match, before, after) => {
                    return before + '\n                        ' + photosArray + '\n                    ' + after;
                });
            }

            // 更新留言图片
            if (photos.messagePhotos.length > 0) {
                const messagePhotosArray = photos.messagePhotos.map(photo => `'${photo}'`).join(',\n                        ');
                const messagePhotosPattern = new RegExp(
                    `(message: '[^']*',[\\s\\S]*?)(messageImages: \\[)[^\\]]*(\\][\\s\\S]*?coordinates: [^}]+,[\\s\\S]*?tags: [^\\]]+,[\\s\\S]*?nextLocation: '[^']*',[\\s\\S]*?nextParticipant: '[^']*'[\\s\\S]*?}[\\s\\S]*?\\])`,
                    'g'
                );

                configContent = configContent.replace(messagePhotosPattern, (match, before, messageImagesStart, after) => {
                    return before + messageImagesStart + '\n                        ' + messagePhotosArray + '\n                    ' + after;
                });
            }
        }
    }

    fs.writeFileSync(configPath, configContent);
    console.log('配置文件更新完成！');
}

// 主函数
function main() {
    console.log('开始扫描图片目录...');
    const photoData = scanPhotos();

    if (Object.keys(photoData).length === 0) {
        console.log('未找到图片文件，请按照目录结构放置图片后重新运行。');
        return;
    }

    console.log('找到的图片数据：');
    console.log(JSON.stringify(photoData, null, 2));

    console.log('更新配置文件...');
    updateConfigFile(photoData);

    console.log('完成！');
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { scanPhotos, updateConfigFile };
