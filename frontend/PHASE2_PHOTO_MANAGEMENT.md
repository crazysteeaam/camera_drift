# 第二期图片管理指南

## 图片存放位置（按分组管理）

### 1. 推荐目录结构（A1, A2方式）
**主图片存放路径：** `frontend/public/photos/phase2/{省份ID}/{组ID}/{组ID}{棒次}/photos/`
**留言图片存放路径：** `frontend/public/photos/phase2/{省份ID}/{组ID}/{组ID}{棒次}/message/`

**具体示例：**
- 浙江省A组第一棒主图片：`frontend/public/photos/phase2/zhejiang/A/A1/photos/`
- 浙江省A组第一棒留言图片：`frontend/public/photos/phase2/zhejiang/A/A1/message/`
- 广东省C组第一棒主图片：`frontend/public/photos/phase2/guangdong/C/C1/photos/`
- 江苏省G组第一棒主图片：`frontend/public/photos/phase2/jiangsu/G/G1/photos/`

**文件命名规则：**
- 主图片：**任意名称.JPG** (放在 `photos/` 子目录下)
- 留言图片：**任意名称.JPG** (放在 `message/` 子目录下)

**变体图片自动生成：**
- 缩略图：自动生成在 `photos/thumbnails/` 和 `message/thumbnails/` 目录
- 预览图：自动生成在 `photos/previews/` 和 `message/previews/` 目录

### 2. 传统目录结构（也支持）
**存放路径：** `frontend/public/photos/phase2/{省份ID}/{组ID}/`

**文件命名规则：**
- 主图片：`{棒次编号}.JPG` (如：`000001.JPG`, `000002.JPG`)
- 留言图片：`message_{序号}.JPG` (如：`message_001.JPG`, `message_002.JPG`)

## 省份和组ID对照表

| 省份 | 省份ID | 组ID | 组名 |
|------|--------|------|------|
| 浙江省 | zhejiang | A, B | A组, B组 |
| 广东省 | guangdong | C, D, E, F | C组, D组, E组, F组 |
| 江苏省 | jiangsu | G, H, I | G组, H组, I组 |
| 上海市 | shanghai | J | J组 |
| 澳门特别行政区 | macau | K | K组 |
| 香港特别行政区 | hongkong | L | L组 |
| 海南省 | hainan | M | M组 |
| 福建省 | fujian | N, O | N组, O组 |

## 自动更新配置文件

### 1. 创建目录结构
首次运行时，脚本会自动创建完整的目录结构：
```bash
npm run update-photos
```

### 2. 放置图片
按照上述规则将图片放入对应目录：

**推荐方式（A1, A2结构）：**
```
frontend/public/photos/phase2/
├── zhejiang/
│   ├── A/
│   │   ├── A1/                     # 第一棒
│   │   │   ├── photos/             # 主图片目录
│   │   │   │   ├── 任意名称.JPG    # 主图片
│   │   │   │   └── 另一张.JPG      # 主图片
│   │   │   └── message/            # 留言图片目录
│   │   │       ├── 留言1.JPG
│   │   │       └── 留言2.JPG
│   │   ├── A2/                     # 第二棒
│   │   │   ├── photos/             # 主图片目录
│   │   │   │   └── 风景.JPG
│   │   │   └── message/            # 留言图片目录
│   │   │       └── 留言.JPG
│   │   └── A3/                     # 第三棒
│   │       ├── photos/             # 主图片目录
│   │       │   └── 城市.JPG
│   │       └── message/            # 留言图片目录
│   └── B/
│       ├── B1/
│       │   ├── photos/
│       │   └── message/
│       └── B2/
│           ├── photos/
│           └── message/
└── guangdong/
    ├── C/
    │   ├── C1/
    │   │   ├── photos/
    │   │   └── message/
    │   └── C2/
    │       ├── photos/
    │       └── message/
    └── D/
```

**传统方式（也支持）：**
```
frontend/public/photos/phase2/
├── zhejiang/
│   ├── A/
│   │   ├── 000001.JPG          # 第一棒主图片
│   │   ├── 000002.JPG          # 第二棒主图片
│   │   └── message/
│   │       ├── message_001.JPG # 第一棒留言图片
│   │       └── message_002.JPG # 第二棒留言图片
│   └── B/
│       ├── 000001.JPG
│       └── message/
└── guangdong/
    ├── C/
    └── D/
```

### 3. 生成图片变体
运行以下命令为所有图片生成缩略图和预览图：
```bash
npm run generate-phase2-variants
```

### 4. 重新组织图片目录
运行以下命令将变体图片整理到独立目录中：
```bash
npm run reorganize-phase2-images
```

### 5. 更新配置文件
放置图片后，运行更新命令：
```bash
npm run update-photos
```

脚本会：
1. 扫描所有图片目录
2. 自动更新 `phase2Data.ts` 配置文件
3. 将图片路径添加到对应的 `photos` 和 `messageImages` 字段

### 4. 预览和缩略图生成
运行图片处理命令生成预览图和缩略图：
```bash
npm run generate-variants
```

## 工作流程

1. **准备图片**：将原始图片按命名规则放入对应目录
2. **更新配置**：运行 `npm run update-photos` 更新配置文件
3. **生成变体**：运行 `npm run generate-variants` 生成预览图和缩略图
4. **启动项目**：运行 `npm start` 查看效果

## 注意事项

- **推荐使用A1, A2结构**：图片可以任意命名，不需要按特定规则
- 留言图片必须放在 `message/` 子目录下
- 支持 JPG 格式，文件名区分大小写
- 每次添加新图片后都需要运行更新命令
- 建议在添加图片前先运行一次脚本创建目录结构
- 脚本会自动识别A1, A2目录结构，如果不存在则回退到传统结构

## 故障排除

如果更新后图片不显示：
1. 检查图片路径是否正确
2. 确认图片文件是否存在
3. 检查文件名是否符合命名规则
4. 重新运行 `npm run update-photos`
