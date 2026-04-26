const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagePattern = /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i;

function isOriginalImage(fileName) {
  return imagePattern.test(fileName)
    && !fileName.includes('_thumb')
    && !fileName.includes('_preview');
}

async function generateVariantsForImage(imagePath) {
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const dirName = path.dirname(imagePath);

  const thumbnailPath = path.join(dirName, `${baseName}_thumb${ext}`);
  const previewPath = path.join(dirName, `${baseName}_preview${ext}`);

  await sharp(imagePath)
    .rotate()
    .resize(300, null, { withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);

  await sharp(imagePath)
    .rotate()
    .resize(1200, null, { withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(previewPath);
}

async function syncAndGenerate(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(targetDir, { recursive: true });
    return 0;
  }

  let processed = 0;
  fs.mkdirSync(targetDir, { recursive: true });
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      processed += await syncAndGenerate(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile() && isOriginalImage(entry.name)) {
      fs.copyFileSync(sourcePath, targetPath);
      await generateVariantsForImage(targetPath);
      processed += 1;
    }
  }

  return processed;
}

async function main() {
  const rawSource = process.argv[2];
  const rawTarget = process.argv[3];
  if (!rawSource || !rawTarget) {
    console.error('请提供源目录和目标目录，例如: node scripts/generateRecursiveVariants.js photos/meaning public/photos/meaning');
    process.exit(1);
  }

  const sourceDir = path.resolve(__dirname, '..', rawSource);
  const targetDir = path.resolve(__dirname, '..', rawTarget);
  const processed = await syncAndGenerate(sourceDir, targetDir);
  console.log(`递归变体生成完成，共处理 ${processed} 张图片：${rawSource} -> ${rawTarget}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('递归生成图片变体失败:', error);
    process.exit(1);
  });
}

module.exports = {
  generateVariantsForImage,
  syncAndGenerate
};
