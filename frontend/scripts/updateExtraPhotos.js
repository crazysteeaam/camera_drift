const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const extraDataPath = path.join(projectRoot, 'src/config/extraData.ts');
const outputPath = path.join(projectRoot, 'src/config/extraPhotoManifest.ts');
const extraSourceRoot = path.join(projectRoot, 'photos/extra');
const extraOutputRoot = path.join(projectRoot, 'public/photos/extra');
const imagePattern = /\.(jpg|jpeg|png|webp)$/i;

function isOriginalImage(fileName) {
  return imagePattern.test(fileName)
    && !fileName.includes('_thumb')
    && !fileName.includes('_preview');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getMemberFolders() {
  const content = fs.readFileSync(extraDataPath, 'utf8');
  const matches = [...content.matchAll(/folder:\s*'([^']+)'/g)];
  return [...new Set(matches.map((match) => match[1]).filter(Boolean))].sort();
}

function ensureScaffold(folders) {
  ensureDir(extraSourceRoot);
  ensureDir(extraOutputRoot);

  folders.forEach((folder) => {
    ensureDir(path.join(extraSourceRoot, folder, 'photos'));
    ensureDir(path.join(extraSourceRoot, folder, 'message'));
    ensureDir(path.join(extraOutputRoot, folder, 'photos'));
    ensureDir(path.join(extraOutputRoot, folder, 'message'));
  });
}

function listImages(dirPath, webPathPrefix) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isOriginalImage(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((fileName) => `${webPathPrefix}/${fileName}`);
}

function buildManifest(folders) {
  const manifest = {};

  folders.forEach((folder) => {
    manifest[folder] = {
      photos: listImages(
        path.join(extraOutputRoot, folder, 'photos'),
        `/photos/extra/${folder}/photos`
      ),
      messagePhotos: listImages(
        path.join(extraOutputRoot, folder, 'message'),
        `/photos/extra/${folder}/message`
      )
    };
  });

  return manifest;
}

function writeManifest(manifest) {
  const fileContent = `// 番外篇图片清单 - 由 npm run update-extra-photos 自动生成
import { toImageAssets, type ImageAsset } from '../types/imageAsset';

export type ExtraPhotoManifestEntry = {
  photos: ImageAsset[];
  messagePhotos: ImageAsset[];
};

const RAW_EXTRA_PHOTO_MANIFEST: Record<string, { photos: string[]; messagePhotos: string[] }> = ${JSON.stringify(
    manifest,
    null,
    2
  )};

export const EXTRA_PHOTO_MANIFEST: Record<string, ExtraPhotoManifestEntry> = Object.fromEntries(
  Object.entries(RAW_EXTRA_PHOTO_MANIFEST).map(([folder, entry]) => [
    folder,
    {
      photos: toImageAssets(entry.photos),
      messagePhotos: toImageAssets(entry.messagePhotos)
    }
  ])
);
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
}

function ensureReadme() {
  const readmePath = path.join(extraSourceRoot, 'README.md');
  const content = `# 番外篇图片目录

## 推荐结构
按 \`组 / 成员序号\` 组织，并固定使用 \`photos\` 和 \`message\` 两个子目录。
国家、城市、成员名都继续放在数据里管理，不放进目录名：

\`\`\`
extra/
├── G1/
│   ├── G1-1/
│   │   ├── photos/   # 第 1 位成员主图
│   │   └── message/  # 第 1 位成员留言图
│   ├── G1-2/
│   │   ├── photos/
│   │   └── message/
│   └── G1-3/
│       ├── photos/
│       └── message/
\`\`\`

## 目录理解
- \`G1\`、\`G2\`、\`G3\` 表示番外篇小组
- \`G1-1\`、\`G1-2\`、\`G1-3\` 表示这一组里的第 1、2、3 位成员
- 你平时放图只需要知道它属于哪一组、第几位成员，不需要再管国家名

## 你的日常操作
1. 主图放进对应成员的 \`photos/\`
2. 留言图放进对应成员的 \`message/\`
3. 把原图放在这里后，运行 \`npm run update-extra-photos\`

这个命令会同时完成：
- 从 \`photos/extra\` 生成上传产物到 \`public/photos/extra\`
- 更新番外篇图片清单

## 命名建议
- 为了控制显示顺序，建议使用 \`000001.jpg\`、\`000002.jpg\` 这种编号
- 支持 \`.jpg\`、\`.jpeg\`、\`.png\`、\`.webp\`
- 一个成员的图片只放在自己的目录里，不要混放
`;

  fs.writeFileSync(readmePath, content, 'utf8');
}

function main() {
  const folders = getMemberFolders();

  if (folders.length === 0) {
    console.log('未在 extraData.ts 中找到番外成员目录。');
    return;
  }

  ensureScaffold(folders);
  ensureReadme();

  const manifest = buildManifest(folders);
  writeManifest(manifest);

  console.log('番外篇图片目录已同步。');
  console.log(JSON.stringify(manifest, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  buildManifest,
  ensureScaffold,
  getMemberFolders
};
