const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const extraSourceRoot = path.join(__dirname, '../photos/extra');
const extraOutputRoot = path.join(__dirname, '../public/photos/extra');
const imagePattern = /\.(jpg|jpeg|png|webp)$/i;

function isOriginalImage(fileName) {
  return imagePattern.test(fileName)
    && !fileName.includes('_thumb')
    && !fileName.includes('_preview');
}

async function generateVariantsForImage(sourceImagePath, targetDir) {
  const ext = path.extname(sourceImagePath);
  const baseName = path.basename(sourceImagePath, ext);
  const fileName = path.basename(sourceImagePath);

  fs.mkdirSync(targetDir, { recursive: true });

  const originalTargetPath = path.join(targetDir, fileName);
  const thumbnailPath = path.join(targetDir, `${baseName}_thumb${ext}`);
  const previewPath = path.join(targetDir, `${baseName}_preview${ext}`);

  fs.copyFileSync(sourceImagePath, originalTargetPath);

  await sharp(sourceImagePath)
    .rotate()
    .resize(300, null, { withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);

  await sharp(sourceImagePath)
    .rotate()
    .resize(1200, null, { withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(previewPath);
}

async function walkAndGenerate(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('番外篇源图片目录不存在，已自动创建。');
    return 0;
  }

  let processed = 0;
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const nextTargetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      processed += await walkAndGenerate(sourcePath, nextTargetPath);
      continue;
    }

    if (entry.isFile() && isOriginalImage(entry.name)) {
      await generateVariantsForImage(sourcePath, targetDir);
      processed += 1;
    }
  }

  return processed;
}

async function main() {
  const processed = await walkAndGenerate(extraSourceRoot, extraOutputRoot);
  console.log(`番外篇图片变体生成完成，共处理 ${processed} 张图片。`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('生成番外篇图片变体失败:', error);
    process.exit(1);
  });
}

module.exports = { generateVariantsForImage, walkAndGenerate };
