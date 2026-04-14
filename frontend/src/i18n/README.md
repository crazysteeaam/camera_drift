# i18n 架构文档

## 概述

本项目使用 React Context API 实现国际化（i18n）功能，支持多语言切换。当前支持中文（zh-CN）和英文（en-US），架构设计便于扩展更多语言。

## 目录结构

```
frontend/src/i18n/
├── config.ts          # 语言配置（支持的语言、默认语言等）
├── context.tsx        # React Context 和 Provider
├── hooks.ts           # 自定义 Hooks（useTranslation, useT）
├── utils.ts           # 翻译工具函数
├── README.md          # 本文档
└── locales/           # 翻译文件目录
    ├── zh-CN/         # 中文翻译
    │   ├── index.ts   # 入口文件，汇总所有翻译模块
    │   ├── common.ts  # 通用文本（按钮、状态、标签等）
    │   ├── navbar.ts  # 导航栏翻译
    │   ├── phase2.ts  # 第二期页面翻译
    │   ├── provinces.ts # 省份名称和描述
    │   ├── cities.ts  # 城市名称
    │   ├── groups.ts  # 组名称和路线描述
    │   ├── messages.ts # 留言内容（嵌套结构）
    │   └── tags.ts    # 标签翻译
    └── en-US/         # 英文翻译（结构同 zh-CN）
```

## 翻译文件结构

### 1. 嵌套结构（推荐）

对于有层级关系的数据，使用嵌套对象结构，便于扩展和维护：

```typescript
// messages.ts
export default {
  zhejiang: {
    A: {
      1: '留言内容1',
      2: '留言内容2'
    },
    B: {
      1: '留言内容1',
      2: '留言内容2'
    }
  },
  guangdong: {
    C: {
      1: '留言内容1',
      2: '留言内容2'
    }
  }
};
```

访问方式：`t('messages.zhejiang.A.1')`

### 2. 扁平结构

对于简单的键值对，使用扁平结构：

```typescript
// tags.ts
export default {
  '古城': 'Ancient City',
  '海风': 'Sea Breeze',
  '灯塔': 'Lighthouse'
};
```

访问方式：`t('tags.古城')`

## 添加新语言

### 步骤 1：更新配置

在 `config.ts` 中添加新语言：

```typescript
export const SUPPORTED_LANGUAGES: Record<string, Language> = {
  'zh-CN': { ... },
  'en-US': { ... },
  'ja-JP': {  // 新增日语
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dateFormat: 'YYYY年MM月DD日'
  }
};
```

### 步骤 2：创建翻译文件目录

创建 `locales/ja-JP/` 目录，并创建对应的翻译文件：

```
locales/ja-JP/
├── index.ts
├── common.ts
├── navbar.ts
├── phase2.ts
├── provinces.ts
├── cities.ts
├── groups.ts
├── messages.ts
└── tags.ts
```

### 步骤 3：更新 index.ts

在 `locales/ja-JP/index.ts` 中导入所有翻译模块：

```typescript
import common from './common';
import navbar from './navbar';
import phase2 from './phase2';
import provinces from './provinces';
import cities from './cities';
import groups from './groups';
import messages from './messages';
import tags from './tags';

export default {
  common,
  navbar,
  phase2,
  provinces,
  cities,
  groups,
  messages,
  tags
};
```

### 步骤 4：复制并翻译

从 `zh-CN` 或 `en-US` 复制翻译文件，然后翻译所有文本内容。

## 翻译工具函数

### translateMessage

翻译留言内容，使用嵌套结构：

```typescript
translateMessage(
  provinceId: string,    // 如 'zhejiang'
  groupId: string,       // 如 'A'
  relayId: number,       // 如 1
  originalMessage: string, // 原始留言（fallback）
  t: TranslationFunction
): string
```

### translateTag

翻译标签：

```typescript
translateTag(
  tag: string,           // 如 '古城'
  t: TranslationFunction
): string
```

### translateCityName

翻译城市名称：

```typescript
translateCityName(
  cityName: string,      // 如 '衢州市'
  t: TranslationFunction
): string
```

### translateGroupInfo

翻译组名称和描述：

```typescript
translateGroupInfo(
  provinceId: string,    // 如 'zhejiang'
  groupId: string,       // 如 'A'
  t: TranslationFunction
): { name: string; description: string }
```

## 使用示例

### 在组件中使用

```typescript
import { useTranslation } from '../i18n/hooks';
import { translateMessage, translateTag } from '../i18n/utils';

const MyComponent = () => {
  const { t } = useTranslation();
  
  // 简单翻译
  const title = t('common.buttons.viewDetails') as string;
  
  // 带参数的翻译
  const text = t('common.pagination.showing', { 
    start: 1, 
    end: 10, 
    total: 100 
  }) as string;
  
  // 数组翻译
  const steps = t('phase2.home.sections.activity.process.steps', { 
    returnObjects: true 
  }) as string[];
  
  // 使用工具函数翻译留言
  const message = translateMessage(
    'zhejiang', 
    'A', 
    1, 
    '原始留言', 
    t
  );
  
  return <div>{title}</div>;
};
```

## 最佳实践

1. **使用嵌套结构**：对于有层级关系的数据（如留言、组信息），使用嵌套对象结构
2. **保持一致性**：所有语言的翻译文件结构应该保持一致
3. **提供 Fallback**：翻译函数应该提供合理的 fallback 机制
4. **类型安全**：使用 TypeScript 确保类型安全
5. **开发模式警告**：在开发模式下输出缺失翻译的警告

## 注意事项

1. **数字键**：JavaScript 对象中的数字键会被转换为字符串，`{ 1: '...' }` 等同于 `{ '1': '...' }`
2. **键名格式**：使用点号分隔的键名（如 `'messages.zhejiang.A.1'`）来访问嵌套结构
3. **缺失翻译**：如果翻译不存在，函数会返回原始文本或 key，便于发现缺失的翻译



