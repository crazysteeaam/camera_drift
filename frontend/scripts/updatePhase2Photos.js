const fs = require('fs');
const path = require('path');
const { loadPhase2Catalog } = require('./phase2ConfigCatalog');

// 配置文件路径
const configPath = path.join(__dirname, '../src/config/phase2Data.ts');
const photosBasePath = path.join(__dirname, '../public/photos/phase2');
const phase2Catalog = loadPhase2Catalog();
const provinceCatalogMap = new Map(phase2Catalog.map((province) => [province.id, province]));

function isOriginalImage(fileName) {
    return /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(fileName)
        && !fileName.includes('_preview')
        && !fileName.includes('_thumb');
}

function listOriginalImages(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return [];
    }

    return fs.readdirSync(dirPath)
        .filter(isOriginalImage)
        .sort();
}

function toWebPaths(files, relativeDir) {
    return files.map(file => `/photos/phase2/${relativeDir}/${file}`);
}

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
        const provinceDefinition = provinceCatalogMap.get(provinceId);
        if (!provinceDefinition) continue;

        result[provinceId] = {};
        const provincePath = path.join(photosBasePath, provinceId);
        const groupCatalogMap = new Map(provinceDefinition.groups.map((group) => [group.id, group]));

        // 扫描组目录
        const groupDirs = fs.readdirSync(provincePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const groupId of groupDirs) {
            const groupDefinition = groupCatalogMap.get(groupId);
            if (!groupDefinition) continue;

            const groupPath = path.join(provincePath, groupId);
            const relayFolders = fs.readdirSync(groupPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
                .filter(dirName => new RegExp(`^${groupId}(\\d+)$`).test(dirName))
                .sort((a, b) => {
                    const aRelay = parseInt(a.slice(groupId.length), 10);
                    const bRelay = parseInt(b.slice(groupId.length), 10);
                    return aRelay - bRelay;
                });

            const mainPhotosByRelay = {};
            const messagePhotosByRelay = {};
            let hasAnyPhotos = false;

            for (const relayFolder of relayFolders) {
                const relayNumber = parseInt(relayFolder.slice(groupId.length), 10);
                const photosDirPath = path.join(groupPath, relayFolder, 'photos');
                const messageDirPath = path.join(groupPath, relayFolder, 'message');

                const relayPhotos = toWebPaths(
                    listOriginalImages(photosDirPath),
                    `${provinceId}/${groupId}/${relayFolder}/photos`
                );
                const relayMessagePhotos = toWebPaths(
                    listOriginalImages(messageDirPath),
                    `${provinceId}/${groupId}/${relayFolder}/message`
                );

                if (relayPhotos.length > 0) {
                    mainPhotosByRelay[relayNumber] = relayPhotos;
                    hasAnyPhotos = true;
                }

                if (relayMessagePhotos.length > 0) {
                    messagePhotosByRelay[relayNumber] = relayMessagePhotos;
                    hasAnyPhotos = true;
                }
            }

            const fallbackMainPhotos = toWebPaths(
                listOriginalImages(groupPath),
                `${provinceId}/${groupId}`
            );
            const fallbackMessagePhotos = toWebPaths(
                listOriginalImages(path.join(groupPath, 'message')),
                `${provinceId}/${groupId}/message`
            );

            if (fallbackMainPhotos.length > 0 || fallbackMessagePhotos.length > 0) {
                hasAnyPhotos = true;
            }

            if (!hasAnyPhotos) {
                continue;
            }

            result[provinceId][groupId] = {
                mainPhotosByRelay,
                messagePhotosByRelay,
                fallbackMainPhotos,
                fallbackMessagePhotos
            };
        }
    }

    return result;
}

// 创建目录结构
function createDirectoryStructure() {
    for (const province of phase2Catalog) {
        const provincePath = path.join(photosBasePath, province.id);
        fs.mkdirSync(provincePath, { recursive: true });

        for (const group of province.groups) {
            const groupPath = path.join(provincePath, group.id);
            fs.mkdirSync(groupPath, { recursive: true });

            // 创建A1, A2等目录结构示例
            for (let i = 1; i <= (group.participantCount || 6); i++) {
                const photoDir = `${group.id}${i}`;
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
                const readmeContent = `# ${province.name} ${group.name} 图片目录

## 目录结构（推荐）
使用A1, A2这种目录结构，主图片和留言图片分别存放：
\`\`\`
${group.id}/
├── ${group.id}1/                    # 第一棒
│   ├── photos/                     # 主图片目录
│   │   ├── 任意名称.JPG           # 主图片
│   │   └── 另一张图片.JPG         # 主图片
│   └── message/                    # 留言图片目录
│       ├── 留言图片1.JPG
│       └── 留言图片2.JPG
├── ${group.id}2/                    # 第二棒
│   ├── photos/                     # 主图片目录
│   │   └── 风景.JPG
│   └── message/                    # 留言图片目录
│       └── 留言图片.JPG
└── ...
\`\`\`

## 传统目录结构（也支持）
如果不想使用A1, A2结构，也可以直接放在组目录下：
\`\`\`
${group.id}/
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

function findMatchingChar(content, startIndex, openChar, closeChar) {
    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplateString = false;
    let isEscaped = false;

    for (let i = startIndex; i < content.length; i++) {
        const char = content[i];

        if (isEscaped) {
            isEscaped = false;
            continue;
        }

        if (char === '\\') {
            isEscaped = true;
            continue;
        }

        if (!inDoubleQuote && !inTemplateString && char === '\'') {
            inSingleQuote = !inSingleQuote;
            continue;
        }

        if (!inSingleQuote && !inTemplateString && char === '"') {
            inDoubleQuote = !inDoubleQuote;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && char === '`') {
            inTemplateString = !inTemplateString;
            continue;
        }

        if (inSingleQuote || inDoubleQuote || inTemplateString) {
            continue;
        }

        if (char === openChar) {
            depth += 1;
        } else if (char === closeChar) {
            depth -= 1;
            if (depth === 0) {
                return i;
            }
        }
    }

    return -1;
}

function findObjectRangeById(content, idValue, searchStart = 0) {
    const idMarker = `id: '${idValue}',`;
    const markerIndex = content.indexOf(idMarker, searchStart);

    if (markerIndex === -1) {
        return null;
    }

    const objectStart = content.lastIndexOf('{', markerIndex);
    if (objectStart === -1) {
        return null;
    }

    const objectEnd = findMatchingChar(content, objectStart, '{', '}');
    if (objectEnd === -1) {
        return null;
    }

    return { start: objectStart, end: objectEnd + 1 };
}

function formatArray(arrayValues, propertyIndent) {
    if (!arrayValues || arrayValues.length === 0) {
        return '[]';
    }

    const itemIndent = `${propertyIndent}    `;
    return `[\n${arrayValues.map(value => `${itemIndent}'${value}'`).join(',\n')}\n${propertyIndent}]`;
}

function replaceArrayProperty(objectBlock, propertyName, values) {
    const propertyMarker = `${propertyName}: [`;
    const propertyIndex = objectBlock.indexOf(propertyMarker);

    if (propertyIndex === -1) {
        return objectBlock;
    }

    const lineStart = objectBlock.lastIndexOf('\n', propertyIndex) + 1;
    const propertyIndent = objectBlock.slice(lineStart, propertyIndex);
    const arrayStart = objectBlock.indexOf('[', propertyIndex);
    const arrayEnd = findMatchingChar(objectBlock, arrayStart, '[', ']');

    if (arrayStart === -1 || arrayEnd === -1) {
        return objectBlock;
    }

    const formattedArray = formatArray(values, propertyIndent);
    return `${objectBlock.slice(0, arrayStart)}${formattedArray}${objectBlock.slice(arrayEnd + 1)}`;
}

function collectRelayRanges(groupBlock) {
    const relaysMarker = 'relays: [';
    const relaysMarkerIndex = groupBlock.indexOf(relaysMarker);

    if (relaysMarkerIndex === -1) {
        return [];
    }

    const relaysArrayStart = groupBlock.indexOf('[', relaysMarkerIndex);
    const relaysArrayEnd = findMatchingChar(groupBlock, relaysArrayStart, '[', ']');

    if (relaysArrayStart === -1 || relaysArrayEnd === -1) {
        return [];
    }

    const relaysContent = groupBlock.slice(relaysArrayStart + 1, relaysArrayEnd);
    const relayRanges = [];
    const relayIdPattern = /id:\s*(\d+),/g;
    let match;

    while ((match = relayIdPattern.exec(relaysContent)) !== null) {
        const absoluteMarkerIndex = relaysArrayStart + 1 + match.index;
        const relayStart = groupBlock.lastIndexOf('{', absoluteMarkerIndex);
        const relayEnd = findMatchingChar(groupBlock, relayStart, '{', '}');

        if (relayStart === -1 || relayEnd === -1) {
            continue;
        }

        relayRanges.push({
            id: Number(match[1]),
            start: relayStart,
            end: relayEnd + 1
        });
    }

    return relayRanges;
}

function updateRelayBlock(relayBlock, relayId, groupPhotoData) {
    const hasRelaySpecificMain = Object.keys(groupPhotoData.mainPhotosByRelay).length > 0;
    const hasRelaySpecificMessage = Object.keys(groupPhotoData.messagePhotosByRelay).length > 0;

    const relayPhotos = groupPhotoData.mainPhotosByRelay[relayId]
        || (!hasRelaySpecificMain && relayId === 1 ? groupPhotoData.fallbackMainPhotos : [])
        || [];

    const relayMessagePhotos = groupPhotoData.messagePhotosByRelay[relayId]
        || (!hasRelaySpecificMessage && relayId === 1 ? groupPhotoData.fallbackMessagePhotos : [])
        || [];

    let updatedRelayBlock = replaceArrayProperty(relayBlock, 'photos', relayPhotos);
    updatedRelayBlock = replaceArrayProperty(updatedRelayBlock, 'messageImages', relayMessagePhotos);

    return updatedRelayBlock;
}

// 更新配置文件
function updateConfigFile(photoData) {
    let configContent = fs.readFileSync(configPath, 'utf8');

    // 更新每个省份的图片数据
    for (const [provinceId, groups] of Object.entries(photoData)) {
        const provinceRange = findObjectRangeById(configContent, provinceId);
        if (!provinceRange) {
            console.warn(`未找到省份配置: ${provinceId}`);
            continue;
        }

        let provinceBlock = configContent.slice(provinceRange.start, provinceRange.end);

        for (const [groupId, photos] of Object.entries(groups)) {
            const groupRange = findObjectRangeById(provinceBlock, groupId);
            if (!groupRange) {
                console.warn(`未找到组配置: ${provinceId}/${groupId}`);
                continue;
            }

            const groupBlock = provinceBlock.slice(groupRange.start, groupRange.end);
            const relayRanges = collectRelayRanges(groupBlock);

            if (relayRanges.length === 0) {
                console.warn(`组 ${provinceId}/${groupId} 没有 relay 定义，跳过图片回写。`);
                continue;
            }

            let updatedGroupBlock = groupBlock;
            [...relayRanges].reverse().forEach((relayRange) => {
                const relayBlock = updatedGroupBlock.slice(relayRange.start, relayRange.end);
                const updatedRelayBlock = updateRelayBlock(relayBlock, relayRange.id, photos);
                updatedGroupBlock = `${updatedGroupBlock.slice(0, relayRange.start)}${updatedRelayBlock}${updatedGroupBlock.slice(relayRange.end)}`;
            });

            provinceBlock = `${provinceBlock.slice(0, groupRange.start)}${updatedGroupBlock}${provinceBlock.slice(groupRange.end)}`;
        }

        configContent = `${configContent.slice(0, provinceRange.start)}${provinceBlock}${configContent.slice(provinceRange.end)}`;
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

module.exports = {
    scanPhotos,
    updateConfigFile,
    collectRelayRanges,
    updateRelayBlock,
    replaceArrayProperty
};
