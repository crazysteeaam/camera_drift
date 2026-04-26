const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');

function ensureDir(targetRelativePath) {
  const fullPath = path.join(projectRoot, targetRelativePath);
  fs.mkdirSync(fullPath, { recursive: true });
  return fullPath;
}

function ensureUploadScaffold() {
  // 源目录根
  ensureDir('photos');
  ensureDir('photos/phase2');
  ensureDir('photos/extra');
  ensureDir('photos/meaning');

  // 上传产物根
  ensureDir('public/photos');
  ensureDir('public/photos/phase2');
  ensureDir('public/photos/extra');
  ensureDir('public/photos/meaning');
}

function runNodeScript(scriptRelativePath, args = []) {
  const scriptPath = path.join(projectRoot, scriptRelativePath);
  console.log(`\n> node ${scriptRelativePath} ${args.join(' ')}`.trim());

  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    throw new Error(`脚本执行失败: ${scriptRelativePath}`);
  }
}

function main() {
  console.log('开始准备图片上传产物...');
  ensureUploadScaffold();

  // 一期：源图在 photos/，产物生成到 public/photos/
  runNodeScript('scripts/generateImageVariants.js');

  // 二期：源图在 photos/phase2/，产物生成到 public/photos/phase2/
  runNodeScript('scripts/generatePhase2ImageVariants.js');
  runNodeScript('scripts/updatePhase2Photos.js');

  // 番外：源图在 photos/extra/，产物生成到 public/photos/extra/，再同步 manifest
  runNodeScript('scripts/generateExtraImageVariants.js');
  runNodeScript('scripts/updateExtraPhotos.js');

  // 旅行的意义：源图在 photos/meaning/，产物生成到 public/photos/meaning/
  runNodeScript('scripts/generateRecursiveVariants.js', ['photos/meaning', 'public/photos/meaning']);

  console.log('\n✅ 图片上传准备完成');
  console.log('建议上传目录：frontend/public/photos/');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('\n准备上传图片失败:', error.message);
    process.exit(1);
  }
}
