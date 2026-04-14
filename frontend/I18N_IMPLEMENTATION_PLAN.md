# 多语言国际化（i18n）实施方案

## 📋 方案概述

本方案设计了一个可扩展的多语言系统，支持中英文切换，并为未来添加更多语言（如日语、韩语、法语等）预留了扩展空间。

---

## 🎯 设计目标

1. **易用性**：组件中简单调用即可获取翻译文本
2. **可维护性**：翻译文件集中管理，结构清晰
3. **可扩展性**：轻松添加新语言，无需修改核心代码
4. **性能优化**：按需加载翻译文件，避免初始加载过大
5. **类型安全**：TypeScript 类型支持，避免翻译键错误

---

## 📁 文件结构设计

```
frontend/src/
├── i18n/
│   ├── index.ts                    # i18n 核心配置和导出
│   ├── context.tsx                 # LanguageContext 和 Provider
│   ├── hooks.ts                    # useTranslation Hook
│   ├── types.ts                    # TypeScript 类型定义
│   ├── config.ts                   # 语言配置（支持的语言列表）
│   ├── locales/
│   │   ├── zh-CN/                  # 中文翻译
│   │   │   ├── index.ts
│   │   │   ├── common.ts           # 通用文本（按钮、标签等）
│   │   │   ├── navbar.ts          # 导航栏
│   │   │   ├── home.ts             # 首页
│   │   │   ├── phase2.ts           # 第二期相关
│   │   │   ├── gallery.ts          # 画廊
│   │   │   ├── relay.ts            # 接力棒详情
│   │   │   ├── map.ts              # 地图相关
│   │   │   └── messages.ts         # 留言相关
│   │   └── en-US/                  # 英文翻译
│   │       ├── index.ts
│   │       ├── common.ts
│   │       ├── navbar.ts
│   │       ├── home.ts
│   │       ├── phase2.ts
│   │       ├── gallery.ts
│   │       ├── relay.ts
│   │       ├── map.ts
│   │       └── messages.ts
│   └── utils.ts                    # 工具函数（格式化、日期等）
```

---

## 🔧 技术方案

### 1. 核心实现方式

**方案选择：React Context + Custom Hook**

- ✅ 无需引入第三方库，减少依赖
- ✅ 轻量级，性能好
- ✅ 完全可控，易于定制
- ✅ TypeScript 支持良好

**备选方案（未来考虑）：**
- `react-i18next`：功能强大但较重，适合大型项目
- `next-i18next`：如果未来迁移到 Next.js

### 2. 语言切换按钮位置

**推荐位置：导航栏右侧**

```
┌─────────────────────────────────────────────────┐
│ [Logo] 胶片漂流计划    [第二期] [第一期] [关于] [🌐 EN] │
└─────────────────────────────────────────────────┘
```

**桌面端：**
- 位置：导航项右侧，与导航项同一行
- 样式：下拉菜单或切换按钮
- 图标：使用 `Globe` 或 `Languages` 图标（lucide-react）

**移动端：**
- 位置：移动菜单底部，或与 Logo 同一行右侧
- 样式：简洁的切换按钮

### 3. 语言存储策略

**使用 localStorage 持久化：**
```typescript
const STORAGE_KEY = 'film_relay_language';
const DEFAULT_LANGUAGE = 'zh-CN';
```

**优先级：**
1. localStorage 中保存的用户选择
2. 浏览器语言检测（navigator.language）
3. 默认语言（zh-CN）

---

## 📝 代码结构设计

### 1. 语言配置 (`i18n/config.ts`)

```typescript
export const SUPPORTED_LANGUAGES = {
  'zh-CN': {
    code: 'zh-CN',
    name: '中文',
    nativeName: '简体中文',
    flag: '🇨🇳'
  },
  'en-US': {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
  // 未来扩展：
  // 'ja-JP': { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  // 'ko-KR': { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
};

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
export const DEFAULT_LANGUAGE: LanguageCode = 'zh-CN';
```

### 2. 翻译文件结构示例 (`i18n/locales/zh-CN/common.ts`)

```typescript
export default {
  buttons: {
    viewDetails: '查看详情',
    back: '返回',
    close: '关闭',
    download: '下载',
    downloadAll: '下载全部',
    cancel: '取消',
    confirm: '确认',
    search: '搜索',
    filter: '筛选',
    reset: '重置'
  },
  status: {
    all: '全部',
    active: '进行中',
    planning: '计划中',
    completed: '已完成'
  },
  labels: {
    location: '位置',
    date: '日期',
    time: '时间',
    weather: '天气',
    camera: '相机',
    film: '胶片',
    participant: '参与者',
    photos: '照片',
    messages: '留言',
    tags: '标签'
  }
};
```

### 3. Context 实现 (`i18n/context.tsx`)

```typescript
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 加载翻译文件
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  // 翻译函数
  const t = (key: string, params?: Record<string, any>) => {
    // 实现翻译逻辑
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### 4. Hook 实现 (`i18n/hooks.ts`)

```typescript
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};
```

### 5. 组件使用示例

```typescript
// 在组件中使用
const Phase2Home = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('phase2.home.title')}</h1>
    <button>{t('common.buttons.viewDetails')}</button>
  );
};
```

---

## 🎨 UI/UX 设计

### 语言切换组件设计

**桌面端：下拉菜单**
```
┌─────────────┐
│ 🌐 中文  ▼  │
├─────────────┤
│ 🇨🇳 简体中文 │
│ 🇺🇸 English │
└─────────────┘
```

**移动端：简洁按钮**
```
┌──────┐
│ 🌐 EN│  (当前是中文时显示 EN，当前是英文时显示 中文)
└──────┘
```

**交互细节：**
- 点击切换按钮：直接切换语言（中英文之间）
- 点击下拉箭头：显示所有支持的语言列表
- 切换时显示加载动画（如果翻译文件较大）
- 切换后保持当前页面和滚动位置

---

## 📊 翻译内容分类

### 需要翻译的内容类型

1. **UI 文本**（按钮、标签、提示等）
   - 导航栏：第二期、第一期、关于
   - 按钮：查看详情、返回、下载等
   - 状态：进行中、计划中、已完成

2. **页面内容**
   - 首页标题和描述
   - 省份/小组/接力棒信息
   - 活动说明

3. **数据内容**（可选，根据需求）
   - 参与者留言（可能需要保留原文）
   - 省份描述
   - 标签

4. **动态内容**（需要特殊处理）
   - 日期格式（中文：2024年1月1日，英文：January 1, 2024）
   - 数字格式（千分位分隔符）
   - 地图上的文本（可能需要动态替换）

---

## 🔄 实施步骤

### Phase 1: 基础架构（当前阶段）
1. ✅ 创建 i18n 目录结构
2. ✅ 实现 Context 和 Provider
3. ✅ 创建 useTranslation Hook
4. ✅ 实现语言切换逻辑
5. ✅ 创建语言切换组件（Navbar 中）
6. ✅ 实现 localStorage 持久化

### Phase 2: 翻译文件（当前阶段）
1. ✅ 创建中文翻译文件（zh-CN）
2. ✅ 创建英文翻译文件（en-US）
3. ✅ 提取现有硬编码文本到翻译文件
4. ✅ 更新组件使用翻译

### Phase 3: 优化和扩展
1. ⏳ 添加日期/数字格式化工具
2. ⏳ 实现按需加载翻译文件
3. ⏳ 添加翻译缺失检测和回退机制
4. ⏳ 添加翻译键的类型检查

### Phase 4: 未来扩展
1. ⏳ 添加更多语言（日语、韩语等）
2. ⏳ 实现 RTL（从右到左）语言支持
3. ⏳ 添加翻译管理工具

---

## ⚠️ 注意事项

### 1. 参与者留言的处理
- **建议**：保留原始留言，不翻译
- **原因**：留言是参与者的真实表达，翻译可能失去原意
- **可选**：提供"显示翻译"按钮，让用户选择

### 2. 图片中的文字
- 地图上的城市名称：使用高德地图的多语言 API
- 图片中的文字：无法自动翻译，需要准备多语言版本的图片

### 3. SEO 考虑
- 如果未来需要 SEO，考虑使用 URL 参数（如 `/en/phase2`）
- 当前阶段：仅客户端切换即可

### 4. 性能优化
- 翻译文件按模块拆分，避免单文件过大
- 使用动态 import 按需加载
- 缓存已加载的翻译文件

---

## 🧪 测试策略

1. **功能测试**
   - 语言切换是否正常工作
   - localStorage 持久化是否生效
   - 浏览器语言检测是否准确

2. **内容测试**
   - 所有翻译键是否都有对应翻译
   - 翻译文本是否完整显示
   - 特殊字符和标点是否正确

3. **UI 测试**
   - 不同语言下文本长度是否适配
   - 按钮和布局是否正常
   - 移动端显示是否正常

---

## 📚 参考资源

- React Context API: https://react.dev/reference/react/useContext
- i18n 最佳实践: https://www.i18next.com/principles/best-practices
- 语言代码标准: https://en.wikipedia.org/wiki/ISO_639-1

---

## ✅ 实施检查清单

### 基础架构
- [ ] 创建 i18n 目录结构
- [ ] 实现 LanguageContext
- [ ] 实现 LanguageProvider
- [ ] 实现 useTranslation Hook
- [ ] 创建语言配置（config.ts）
- [ ] 实现语言切换逻辑
- [ ] 实现 localStorage 持久化

### UI 组件
- [ ] 创建 LanguageSwitcher 组件
- [ ] 在 Navbar 中集成语言切换
- [ ] 实现桌面端下拉菜单
- [ ] 实现移动端切换按钮
- [ ] 添加切换动画效果

### 翻译文件
- [ ] 创建 zh-CN 翻译文件结构
- [ ] 创建 en-US 翻译文件结构
- [ ] 提取 common.ts 翻译
- [ ] 提取 navbar.ts 翻译
- [ ] 提取 phase2.ts 翻译
- [ ] 提取其他页面翻译

### 组件更新
- [ ] 更新 Navbar 组件
- [ ] 更新 Phase2Home 组件
- [ ] 更新 Phase2Province 组件
- [ ] 更新 Phase2RelayDetail 组件
- [ ] 更新其他页面组件

### 测试和优化
- [ ] 测试语言切换功能
- [ ] 测试翻译完整性
- [ ] 测试 UI 适配
- [ ] 性能优化

---

## 🎯 总结

本方案提供了一个**轻量级、可扩展**的多语言解决方案，满足当前中英文切换需求，并为未来扩展预留了空间。实施过程中建议**分阶段进行**，先完成基础架构和核心页面，再逐步扩展到所有页面。

**预计工作量：**
- 基础架构：2-3 小时
- 翻译文件创建：3-4 小时
- 组件更新：4-6 小时
- 测试和优化：2-3 小时
- **总计：约 12-16 小时**





