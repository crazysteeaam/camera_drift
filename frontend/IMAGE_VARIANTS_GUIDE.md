# 图片变体系统使用指南

## 🎯 概述

这个系统实现了"网站显示缩略图，下载完整图片"的需求，通过自动生成图片变体来优化性能和用户体验。

## 📁 文件结构

```
frontend/
├── photos/                    # 原始图片存储
│   ├── A1/
│   │   ├── 000001.JPG       # 原图
│   │   └── 000002.JPG
│   └── ...
├── public/photos/            # 网站访问的图片（包含所有变体）
│   ├── A1/
│   │   ├── 000001.JPG       # 原图
│   │   ├── 000001_thumb.JPG # 缩略图 (300px宽度)
│   │   ├── 000001_preview.JPG # 预览图 (1200px宽度)
│   │   ├── 000002.JPG
│   │   ├── 000002_thumb.JPG
│   │   └── 000002_preview.JPG
│   └── ...
```

## 🚀 使用方法

### 1. 添加新图片

```bash
# 1. 将原图放入对应文件夹
cp new-photo.jpg photos/A1/

# 2. 生成图片变体
npm run generate-variants

# 3. 在 photoConfig.ts 中添加路径（如果需要）
"/photos/A1/new-photo.jpg"
```

### 2. 生成图片变体

```bash
# 生成所有图片的变体
npm run generate-variants

# 或者直接运行脚本
node scripts/generateImageVariants.js
```

### 3. 清理变体文件

```bash
# 删除所有生成的变体文件
node scripts/generateImageVariants.js cleanup
```

## 🔧 技术实现

### 图片变体规格

- **缩略图**: 300px宽度，JPEG格式，80%质量
- **预览图**: 1200px宽度，JPEG格式，85%质量
- **原图**: 保持原始分辨率和格式

### 自动降级策略

1. 优先使用目标变体（缩略图/预览图）
2. 如果变体不存在，自动降级到原图
3. 确保网站始终能正常显示图片

### 组件使用

```typescript
// 缩略图
<SmartImage
    originalPath="/photos/A1/000001.jpg"
    variant="thumbnail"
    className="w-24 h-24 object-cover"
/>

// 预览图
<SmartImage
    originalPath="/photos/A1/000001.jpg"
    variant="preview"
    className="w-full h-full object-cover"
/>

// 下载时使用原图
downloadImage("/photos/A1/000001.jpg", "filename.jpg");
```

## 📊 性能优化

### 加载策略

- **缩略图**: 用于网格显示，快速加载
- **预览图**: 用于主图显示，平衡质量和速度
- **原图**: 仅在下载时加载，节省带宽

### 缓存策略

- 浏览器自动缓存图片变体
- 缩略图和预览图可长期缓存
- 原图按需加载，减少初始加载时间

## 🛠️ 维护说明

### 配置文件

- 只需要在 `photoConfig.ts` 中维护原图路径
- 变体路径自动生成，无需手动配置
- 支持批量处理，一键生成所有变体

### 脚本命令

```bash
# 生成图片变体
npm run generate-variants

# 清理变体文件
node scripts/generateImageVariants.js cleanup

# 查看帮助
node scripts/generateImageVariants.js --help
```

### 注意事项

1. **文件命名**: 避免在原图文件名中使用 `_thumb` 或 `_preview` 后缀
2. **格式支持**: 支持 JPG, PNG, GIF, BMP, TIFF, WebP 格式
3. **质量设置**: 可根据需要调整脚本中的质量参数
4. **存储空间**: 变体文件会增加存储空间，建议定期清理不需要的变体

## 🔄 工作流程

1. **添加图片** → 放入对应文件夹
2. **生成变体** → 运行 `npm run generate-variants`
3. **更新配置** → 在 `photoConfig.ts` 中添加路径（如需要）
4. **网站显示** → 自动使用合适的变体
5. **用户下载** → 自动下载原图

这个系统大大简化了图片管理，同时提供了优秀的用户体验！
