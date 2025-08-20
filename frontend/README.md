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
│   ├── index.html         # HTML入口文件
│   └── manifest.json      # PWA清单文件
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   │   └── Navbar.tsx    # 导航栏组件
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx      # 首页
│   │   ├── Groups.tsx    # 小组页面
│   │   ├── Gallery.tsx   # 画廊页面
│   │   ├── Timeline.tsx  # 时间线页面
│   │   └── About.tsx     # 关于页面
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

