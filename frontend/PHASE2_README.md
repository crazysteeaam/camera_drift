# 点亮中国 胶片漂流计划 - 第二期

## 项目概述

这是胶片漂流计划的第二期，主题为"点亮中国"。与第一期相比，第二期采用了全新的设计理念和功能架构。

## 主要特色

### 🎯 省份导航系统
- **省份为单位**：以省份为单位组织小组，每个省份包含A-E五个小组
- **智能搜索**：支持按省份名称或简称搜索
- **状态筛选**：可按进行中、计划中、已完成状态筛选
- **实时统计**：显示每个省份的总小组数、活跃小组数、完成小组数

### 📸 留言图片展示
- **独立展示**：留言图片与文字留言分开展示
- **图片画廊**：支持网格布局和模态框查看
- **图片导航**：支持上一张/下一张切换
- **详细信息**：显示参与者、日期、棒次等信息
- **响应式设计**：适配各种屏幕尺寸

### 🎨 全新界面设计
- **橙色主题**：采用温暖的橙色系配色方案
- **渐变背景**：使用渐变背景营造温暖氛围
- **动画效果**：流畅的页面切换和悬停动画
- **卡片设计**：现代化的卡片式布局

## 页面结构

### 1. 主页面 (`/phase2`)
- 项目介绍和活动说明
- 省份列表展示
- 搜索和筛选功能
- 报名通道入口

### 2. 省份详情页 (`/phase2/province/:provinceId`)
- 省份统计信息
- 小组列表展示
- 路线信息展示
- 省份特色介绍

### 3. 小组详情页 (`/phase2/province/:provinceId/group/:groupId`)
- 小组概览和进度
- 接力棒详情列表
- 照片作品展示
- 留言内容和图片
- 标签和下一棒信息

## 技术实现

### 数据架构
```typescript
interface Phase2Province {
    id: string;
    name: string;
    shortName: string;
    description: string;
    color: string;
    bgColor: string;
    groups: Phase2Group[];
    totalGroups: number;
    activeGroups: number;
    completedGroups: number;
    coordinates: { lat: number; lng: number };
}

interface Phase2Group {
    id: string;
    name: string;
    description: string;
    province: string;
    startLocation: string;
    endLocation: string;
    color: string;
    bgColor: string;
    relays: Phase2Relay[];
    status: 'planning' | 'active' | 'completed';
    participantCount: number;
    currentRelay: number;
}

interface Phase2Relay {
    id: number;
    name: string;
    participant: string;
    location: string;
    province: string;
    city: string;
    date: string;
    time: string;
    weather: string;
    camera: string;
    film: string;
    photos: string[];
    message: string;
    messageImages?: string[]; // 新增：留言图片
    coordinates: { lat: number; lng: number };
    tags: string[];
    nextLocation: string;
    nextParticipant: string;
}
```

### 核心组件

#### MessageGallery 组件
- 留言图片的专门展示组件
- 支持网格布局和模态框查看
- 图片导航和详细信息展示
- 响应式设计

#### 省份导航组件
- 省份卡片展示
- 搜索和筛选功能
- 状态统计显示

#### 小组详情组件
- 接力棒列表展示
- 照片和留言展示
- 进度条和状态显示

## 使用方法

### 访问第二期
1. 在导航栏点击"第二期"按钮
2. 或直接访问 `/phase2` 路径

### 浏览省份
1. 在主页面选择感兴趣的省份
2. 或使用搜索框搜索特定省份
3. 使用筛选器按状态查看小组

### 查看小组详情
1. 在省份页面选择小组
2. 查看接力棒详情和作品
3. 浏览留言内容和图片

### 测试功能
访问 `/phase2/test` 查看功能测试页面

## 与第一期的对比

| 特性 | 第一期 | 第二期 |
|------|--------|--------|
| 组织方式 | 按小组(A-D) | 按省份+小组(A-E) |
| 主题色彩 | 蓝色系 | 橙色系 |
| 留言展示 | 文字+图片混合 | 文字和图片分离 |
| 导航方式 | 直接小组选择 | 省份→小组层级 |
| 搜索功能 | 无 | 省份搜索+状态筛选 |
| 统计信息 | 基础进度 | 详细统计面板 |

## 未来扩展

1. **地图集成**：添加全国地图可视化
2. **实时更新**：支持实时数据更新
3. **用户系统**：添加用户注册和参与功能
4. **社交功能**：添加评论和分享功能
5. **移动应用**：开发移动端应用

## 开发说明

### 文件结构
```
frontend/src/
├── config/
│   └── phase2Data.ts          # 第二期数据配置
├── pages/
│   ├── Phase2Home.tsx         # 第二期主页面
│   ├── Phase2Province.tsx     # 省份详情页
│   ├── Phase2Group.tsx        # 小组详情页
│   └── Phase2Test.tsx         # 功能测试页
├── components/
│   └── MessageGallery.tsx     # 留言图片展示组件
└── App.tsx                    # 路由配置
```

### 添加新省份
1. 在 `phase2Data.ts` 中添加省份数据
2. 配置小组和接力棒信息
3. 添加相应的图片资源

### 自定义样式
- 主要使用 Tailwind CSS
- 颜色主题在组件中定义
- 动画使用 Framer Motion

## 注意事项

1. 确保图片路径正确配置
2. 留言图片需要单独处理
3. 响应式设计需要测试各种设备
4. 性能优化考虑大量图片的加载

---

**开发完成时间**：2024年12月
**版本**：2.0.0
**状态**：开发完成，待测试

