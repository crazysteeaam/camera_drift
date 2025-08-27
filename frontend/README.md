# 电影接力前端项目

这是一个基于React + TypeScript + Tailwind CSS的现代化前端应用，用于电影接力摄影社区。

## 技术栈

- **React 18** - 最新的React版本
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 流畅的动画库
- **React Router** - 客户端路由
- **Lucide React** - 精美的图标库

## 项目结构

```
frontend/
├── public/                 # 静态资源
│   ├── photos/            # 图片资源（包含原图、缩略图、预览图）
│   │   ├── A1/           # A组第1棒照片
│   │   ├── A2/           # A组第2棒照片
│   │   └── ...           # 其他组别和棒次
│   ├── index.html         # HTML入口文件
│   └── manifest.json      # PWA清单文件
├── photos/                # 原始图片存储
│   ├── A1/               # A组第1棒原图
│   ├── A2/               # A组第2棒原图
│   └── ...               # 其他组别和棒次
├── scripts/               # 工具脚本
│   ├── generateImageVariants.js  # 图片变体生成脚本
│   ├── generatePhotoPaths.js     # 图片路径生成脚本
│   └── copyPhotosToPublic.js     # 图片复制脚本
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   │   ├── Navbar.tsx    # 导航栏组件
│   │   ├── SmartImage.tsx # 智能图片组件
│   │   └── ...           # 其他组件
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx      # 首页
│   │   ├── Groups.tsx    # 小组页面
│   │   ├── Gallery.tsx   # 画廊页面
│   │   ├── Timeline.tsx  # 时间线页面
│   │   └── About.tsx     # 关于页面
│   ├── utils/            # 工具函数
│   │   └── imagePathgenerator.ts # 图片路径生成器
│   ├── config/           # 配置文件
│   │   ├── photoConfig.ts # 图片配置
│   │   └── projectData.ts # 项目数据
│   ├── App.tsx           # 主应用组件
│   ├── index.tsx         # 应用入口
│   ├── index.css         # 全局样式
│   └── App.css           # 应用样式
├── package.json           # 项目依赖配置
├── tsconfig.json          # TypeScript配置
├── tailwind.config.js     # Tailwind CSS配置
└── postcss.config.js      # PostCSS配置
```

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- Sharp 图片处理库

### 可用脚本

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 生成图片变体
npm run generate-variants

# 生成图片路径配置
npm run generate-photos

# 复制图片到public目录
npm run copy-photos

# 添加新图片（生成变体）
npm run add-photos
```

### 安装依赖

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器
npm start
```

应用将在 http://localhost:3000 启动

### 图片变体系统

本项目实现了智能图片变体系统，用于优化图片加载性能：

#### 图片变体规格

- **原图**: 保持原始分辨率和质量
- **预览图**: 1200px宽度，JPEG格式，85%质量
- **缩略图**: 300px宽度，JPEG格式，80%质量

#### 文件命名规则

```
/photos/A1/
├── 000001.jpg          # 原图
├── 000001_preview.jpg  # 预览图
├── 000001_thumb.jpg    # 缩略图
└── ...
```

#### 生成图片变体

```bash
# 生成所有图片的变体
npm run generate-variants

# 清理变体文件
node scripts/generateImageVariants.js cleanup
```

#### 添加新图片

```bash
# 1. 将原图放入对应文件夹
cp new-photo.jpg photos/A1/

# 2. 生成图片变体
npm run generate-variants

# 3. 在 photoConfig.ts 中添加路径（如需要）
"/photos/A1/new-photo.jpg"
```

#### 性能优化效果

- **缩略图**: 压缩率 99.9%（7.5MB → 9.9KB）
- **预览图**: 压缩率 98%（7.5MB → 144KB）
- **加载速度**: 大幅提升，特别是缩略图网格
- **带宽节省**: 显著减少数据传输量

### 构建生产版本

```bash
# 构建生产版本
npm run build
```

构建文件将生成在 `build/` 目录中

### 运行测试

```bash
# 运行测试
npm test
```

## 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/components/Navbar.tsx` 中添加导航链接

### 样式指南

- 使用 Tailwind CSS 类名进行样式设计
- 自定义样式放在 `src/App.css` 中
- 全局样式放在 `src/index.css` 中

### 组件开发

- 所有组件都使用 TypeScript
- 使用函数式组件和 React Hooks
- 添加适当的类型注解

### 图片管理

#### SmartImage 组件

使用 `SmartImage` 组件来自动处理图片变体：

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
```

#### 图片路径生成器

使用 `ImagePathGenerator` 工具类：

```typescript
import { ImagePathGenerator } from '../utils/imagePathgenerator';

// 生成变体路径
const thumbnailPath = ImagePathGenerator.generateVariantPath(originalPath, 'thumbnail');
const previewPath = ImagePathGenerator.generateVariantPath(originalPath, 'preview');

// 检查文件是否存在
const exists = await ImagePathGenerator.checkVariantExists(path);
```

## 常见问题

### 依赖安装失败

如果遇到依赖安装问题，可以尝试：

```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

### 端口被占用

如果3000端口被占用，React会自动选择其他可用端口。

### 热重载不工作

确保没有语法错误，并且所有导入的组件都存在。

### 图片加载失败

如果图片无法加载，请检查：

1. **文件路径是否正确**：
   ```bash
   # 检查文件是否存在
   ls -la public/photos/A1/
   ```

2. **是否生成了图片变体**：
   ```bash
   # 重新生成图片变体
   npm run generate-variants
   ```

3. **文件权限是否正确**：
   ```bash
   # 确保文件可读
   chmod 644 public/photos/A1/*
   ```

### 图片变体生成失败

如果图片变体生成失败，可能的原因：

1. **Sharp 库未安装**：
   ```bash
   npm install sharp
   ```

2. **源图片格式不支持**：
   - 支持的格式：JPG, PNG, GIF, BMP, TIFF, WebP
   - 建议使用 JPG 格式

3. **磁盘空间不足**：
   ```bash
   # 检查磁盘空间
   df -h
   ```

## 部署

### 静态部署

```bash
# 构建项目
npm run build

# 将build目录部署到Web服务器
```

### Docker部署

```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

