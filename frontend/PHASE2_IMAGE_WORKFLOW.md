# 第二期图片管理完整流程

## 新的目录结构

第二期图片现在采用更清晰的目录结构，将原图、缩略图和预览图分别管理：

```
public/photos/phase2/
├── zhejiang/           # 浙江省
│   ├── A/              # A组
│   │   ├── A1/         # 第一棒
│   │   │   ├── photos/         # 主图片目录
│   │   │   │   ├── 000001.JPG      # 原图
│   │   │   │   ├── 000002.JPG      # 原图
│   │   │   │   ├── thumbnails/     # 缩略图目录
│   │   │   │   │   ├── 000001.JPG      # 缩略图 (300px)
│   │   │   │   │   ├── 000002.JPG      # 缩略图 (300px)
│   │   │   │   │   └── ...
│   │   │   │   └── previews/       # 预览图目录
│   │   │   │       ├── 000001.JPG      # 预览图 (1200px)
│   │   │   │       ├── 000002.JPG      # 预览图 (1200px)
│   │   │   │       └── ...
│   │   │   └── message/            # 留言图片目录
│   │   │       ├── message1.jpg        # 原图
│   │   │       ├── thumbnails/         # 留言缩略图目录
│   │   │       │   └── message1.jpg        # 留言缩略图
│   │   │       └── previews/           # 留言预览图目录
│   │   │           └── message1.jpg        # 留言预览图
│   │   ├── A2/         # 第二棒
│   │   └── ...
│   └── B/              # B组
└── ...
```

## 完整工作流程

### 1. 创建目录结构
```bash
npm run update-photos
```
这会创建所有必要的目录结构。

### 2. 放置原始图片
将图片放入对应目录：
- **主图片**：放入 `photos/` 目录
- **留言图片**：放入 `message/` 目录

### 3. 生成图片变体
```bash
npm run generate-phase2-variants
```
这会为所有图片生成缩略图和预览图，并放在原图同一目录下。

### 4. 重新组织目录结构
```bash
npm run reorganize-phase2-images
```
这会将变体图片移动到独立的 `thumbnails/` 和 `previews/` 目录中。

### 5. 更新配置文件
```bash
npm run update-photos
```
这会扫描所有图片并更新 `phase2Data.ts` 配置文件。

## 路径生成规则

### 第二期图片（phase2）
- 原图：`/photos/phase2/zhejiang/A/A1/photos/000001.JPG`
- 缩略图：`/photos/phase2/zhejiang/A/A1/photos/thumbnails/000001.JPG`
- 预览图：`/photos/phase2/zhejiang/A/A1/photos/previews/000001.JPG`

### 第一期图片（兼容）
- 原图：`/photos/A1/000001.JPG`
- 缩略图：`/photos/A1/000001_thumb.JPG`
- 预览图：`/photos/A1/000001_preview.JPG`

## 优势

1. **清晰的组织结构**：原图、缩略图、预览图分别管理
2. **易于维护**：每种类型的图片都有独立目录
3. **自动生成**：变体图片自动生成，无需手动处理
4. **向后兼容**：第一期图片仍然使用后缀规则
5. **灵活命名**：原图可以使用任意文件名

## 注意事项

1. 确保在 `frontend` 目录下运行所有命令
2. 图片文件必须是常见的图片格式（JPG, PNG, GIF等）
3. 变体图片会自动覆盖同名文件
4. 配置文件更新会保留现有的数据，只更新图片路径
