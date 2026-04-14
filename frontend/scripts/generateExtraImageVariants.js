const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const extraPhotosRoot = path.join(__dirname, '../public/photos/extra');
const imagePattern = /\.(jpg|jpeg|png|webp)$/i;

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

async function walkAndGenerate(targetDir) {
  if (!fs.existsSync(targetDir)) {
    console.log('番外篇图片目录不存在。');
    return 0;
  }

  let processed = 0;
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      processed += await walkAndGenerate(fullPath);
      continue;
    }

    if (
      entry.isFile() &&
      imagePattern.test(entry.name) &&
      !entry.name.includes('_thumb') &&
      !entry.name.includes('_preview')
    ) {
      await generateVariantsForImage(fullPath);
      processed += 1;
    }
  }

  return processed;
}

async function main() {
  const processed = await walkAndGenerate(extraPhotosRoot);
  console.log(`番外篇图片变体生成完成，共处理 ${processed} 张图片。`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('生成番外篇图片变体失败:', error);
    process.exit(1);
  });
}

module.exports = { generateVariantsForImage, walkAndGenerate };
