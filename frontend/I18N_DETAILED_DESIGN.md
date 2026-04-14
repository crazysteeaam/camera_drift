# 多语言实现详细设计文档

## 🎨 语言切换按钮 UI 设计

### 位置和样式

#### 桌面端设计
```
┌──────────────────────────────────────────────────────────────┐
│ [📷 Logo] 胶片漂流计划    [第二期] [第一期] [关于]    [🌐 中文 ▼] │
└──────────────────────────────────────────────────────────────┘
```

**实现方式：**
- 位置：导航栏右侧，与导航项同一行
- 样式：下拉菜单按钮
- 当前语言显示：图标 + 语言名称
- 悬停效果：背景色变化
- 点击：展开下拉菜单

#### 移动端设计
```
┌─────────────────────────────┐
│ [📷 Logo]            [🌐 EN] │  ← 顶部栏
├─────────────────────────────┤
│ [第二期]                      │
│ [第一期]                      │
│ [关于]                        │
│ ─────────────────────────── │
│ [🌐 Language]                │  ← 菜单底部
└─────────────────────────────┘
```

**实现方式：**
- 顶部栏：显示当前语言的简短标识（EN/中文）
- 菜单底部：完整的语言切换选项

---

## 💻 核心代码实现

### 1. 语言配置 (`i18n/config.ts`)

```typescript
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dateFormat: string;
}

export const SUPPORTED_LANGUAGES: Record<string, Language> = {
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    dateFormat: 'YYYY年MM月DD日'
  },
  'en-US': {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dateFormat: 'MMMM DD, YYYY'
  }
};

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
export const DEFAULT_LANGUAGE: LanguageCode = 'zh-CN';
export const STORAGE_KEY = 'film_relay_language';

// 检测浏览器语言
export const detectBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // 精确匹配
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang as LanguageCode;
  }
  
  // 模糊匹配（如 zh-TW -> zh-CN）
  const langPrefix = browserLang.split('-')[0];
  const matched = Object.keys(SUPPORTED_LANGUAGES).find(
    code => code.startsWith(langPrefix)
  );
  
  return (matched as LanguageCode) || DEFAULT_LANGUAGE;
};

// 获取初始语言
export const getInitialLanguage = (): LanguageCode => {
  // 1. 优先使用 localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES[stored]) {
    return stored as LanguageCode;
  }
  
  // 2. 检测浏览器语言
  return detectBrowserLanguage();
};
```

### 2. Context 实现 (`i18n/context.tsx`)

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LanguageCode, getInitialLanguage, STORAGE_KEY } from './config';

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
  availableLanguages: LanguageCode[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage());
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // 动态加载翻译文件
  const loadTranslations = useCallback(async (lang: LanguageCode) => {
    setIsLoading(true);
    try {
      // 动态导入翻译文件
      const translationModule = await import(`./locales/${lang}/index`);
      setTranslations(translationModule.default || {});
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // 降级到默认语言
      if (lang !== DEFAULT_LANGUAGE) {
        const fallbackModule = await import(`./locales/${DEFAULT_LANGUAGE}/index`);
        setTranslations(fallbackModule.default || {});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化加载翻译
  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  // 切换语言
  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  // 翻译函数
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    // 遍历嵌套键
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻译，返回键本身（开发时便于发现缺失）
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    // 如果值是字符串，进行参数替换
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return typeof value === 'string' ? value : key;
  }, [translations]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
    availableLanguages: Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
```

### 3. Hook 导出 (`i18n/hooks.ts`)

```typescript
import { useLanguage } from './context';

// 主 Hook：获取翻译函数和语言信息
export const useTranslation = () => {
  const { t, language, setLanguage, isLoading, availableLanguages } = useLanguage();
  return { t, language, setLanguage, isLoading, availableLanguages };
};

// 便捷 Hook：仅获取翻译函数
export const useT = () => {
  const { t } = useLanguage();
  return t;
};
```

### 4. 翻译文件结构示例

#### `i18n/locales/zh-CN/common.ts`
```typescript
export default {
  buttons: {
    viewDetails: '查看详情',
    back: '返回',
    close: '关闭',
    download: '下载',
    downloadAll: '下载全部',
    downloadCurrent: '下载当前',
    cancel: '取消',
    confirm: '确认',
    search: '搜索',
    filter: '筛选',
    reset: '重置',
    apply: '应用',
    clear: '清除',
    submit: '提交',
    register: '立即报名'
  },
  status: {
    all: '全部',
    active: '进行中',
    planning: '计划中',
    completed: '已完成',
    unknown: '未知'
  },
  labels: {
    location: '位置',
    date: '日期',
    time: '时间',
    weather: '天气',
    camera: '相机型号',
    film: '胶片类型',
    participant: '参与者',
    photos: '照片',
    messages: '留言',
    tags: '标签',
    nextLocation: '下一站',
    nextParticipant: '下一位参与者',
    relayInfo: '接力信息',
    shootingInfo: '拍摄信息',
    messageInfo: '留言信息',
    shootingLocation: '拍摄位置',
    participantMessage: '参与者留言',
    viewFullRoute: '查看完整路线',
    coordinates: '坐标',
    totalGroups: '总小组',
    activeGroups: '进行中',
    completedGroups: '已完成',
    totalParticipants: '总参与者'
  },
  placeholders: {
    searchProvince: '搜索省份...',
    searchGroup: '搜索小组...',
    searchCity: '搜索城市...'
  },
  messages: {
    noPhotos: '暂无照片',
    noMessageImages: '暂无留言图片',
    loading: '加载中...',
    loadingFailed: '加载失败',
    noResults: '没有找到匹配的结果',
    tryAdjustFilters: '请尝试调整搜索条件或筛选器'
  }
};
```

#### `i18n/locales/zh-CN/navbar.ts`
```typescript
export default {
  brand: '胶片漂流计划',
  navItems: {
    phase2: '第二期',
    phase1: '第一期',
    about: '关于'
  },
  language: {
    switch: '切换语言',
    current: '当前语言'
  }
};
```

#### `i18n/locales/zh-CN/phase2.ts`
```typescript
export default {
  home: {
    title: '点亮中国 · 胶片相机漂流',
    subtitle: '100 台胶片机，让 300+ 座城市的生活持续发光',
    description: '一台相机、六张胶片、一册留言本。我们邀请热爱记录的人，与城市对话，与远方的陌生人交换故事，让生活的温度沿着影像继续漂流。',
    buttons: {
      viewGallery: '浏览作品集',
      viewProgress: '查看城市进度'
    },
    sections: {
      map: {
        title: '全国地图',
        description: '点亮中国每一座城市，查看胶片漂流计划的全国分布'
      },
      provinces: {
        title: '参与省份',
        description: '点亮中国每一座城市，每个省份的小组数量不同，每个小组由6位参与者组成接力棒'
      },
      activity: {
        title: '活动说明',
        process: {
          title: '参与流程',
          steps: [
            '每位参与者会收到 1 台一次性胶片相机（24 张底片）+ 1 本漂流笔记本',
            '你只需拍摄 6 张，并写点想说的话',
            '最多保留 5 天，拍完后联系发起人',
            '我们会告诉你下一个人的地址，你只需要付一点邮费即可',
            '最终我们会冲洗这些照片，扫描留言，在小红书发布完整展览'
          ]
        },
        conditions: {
          title: '参与条件',
          description: '我们想点亮中国的每一座城市。不论你是：',
          roles: ['初中生', '大学生', '社畜', '骑手', '店主', '程序员', '作家'],
          conclusion: '来自都市的高楼，也好，来自县城的小街巷，也好\n你都值得拥有 1 次，属于自己的快门故事。'
        },
        xiaohongshu: {
          title: '关注我的小红书账号',
          account: '7527914100',
          description: '后续推进进度和活动更新',
          scan: '扫码关注'
        }
      },
      registration: {
        title: '报名通道现已开启',
        description: '请认真填写以下信息，我们会根据时间、城市、节奏合理安排漂流路线。',
        notice: '如果你被选中，我们会在半个月内联系你。',
        button: '立即报名',
        thanks: '感谢你，让一台相机，看到世界。'
      }
    },
    filters: {
      status: {
        all: '全部',
        active: '进行中',
        planning: '计划中',
        completed: '已完成'
      },
      province: '省份筛选',
      group: '组数筛选'
    },
    pagination: {
      showing: '显示 {{start}}-{{end}} 共 {{total}} 个省份',
      previous: '上一页',
      next: '下一页'
    }
  },
  province: {
    back: '返回首页',
    stats: {
      totalGroups: '总小组数',
      active: '进行中',
      completed: '已完成',
      totalParticipants: '总参与者'
    },
    map: {
      title: '地级市分布图',
      description: '探索{{province}}内各城市的接力情况，点击标记查看详细信息'
    },
    groups: {
      title: '小组列表',
      route: '{{start}} → {{end}}',
      participants: '{{count}} 位参与者',
      relay: '{{current}}/{{total}} 棒',
      progress: '进度',
      viewDetails: '查看详情'
    },
    features: {
      title: '{{province}}特色',
      culture: {
        title: '文化特色'
      },
      shooting: {
        title: '拍摄建议',
        tips: [
          '记录当地的历史建筑和文化遗迹',
          '捕捉自然风光和季节变化',
          '展现现代城市的发展面貌',
          '记录当地人的日常生活'
        ]
      }
    }
  },
  relay: {
    back: '返回小组',
    info: {
      relay: '接力信息',
      shooting: '拍摄信息',
      message: '留言信息',
      location: '拍摄位置'
    },
    photos: {
      title: '所有照片',
      current: '当前照片'
    },
    messageImages: {
      title: '留言图片',
      all: '所有留言图片',
      count: '{{count}} 张',
      type: '手写留言'
    },
    download: {
      title: '下载照片',
      all: '下载全部照片 ({{count}}张)',
      current: '下载当前照片',
      downloading: '下载中... {{progress}}%',
      notice: '批量下载将逐张下载所有照片，每张间隔0.5秒'
    }
  }
};
```

#### `i18n/locales/zh-CN/index.ts`
```typescript
import common from './common';
import navbar from './navbar';
import phase2 from './phase2';
// ... 其他模块

export default {
  common,
  navbar,
  phase2,
  // ... 其他模块
};
```

---

## 🧩 组件实现

### 1. 语言切换组件 (`components/LanguageSwitcher.tsx`)

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/hooks';
import { SUPPORTED_LANGUAGES } from '../i18n/config';

const LanguageSwitcher: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = SUPPORTED_LANGUAGES[language];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  // 移动端：简单切换按钮
  if (isMobile) {
    const nextLanguage = availableLanguages.find(lang => lang !== language) || availableLanguages[0];
    const nextLangInfo = SUPPORTED_LANGUAGES[nextLanguage];
    
    return (
      <button
        onClick={() => handleLanguageChange(nextLanguage)}
        className="flex items-center px-3 py-2 text-blue-200 hover:text-white transition-colors"
        aria-label="切换语言"
      >
        <Globe className="h-5 w-5 mr-1" />
        <span className="text-sm font-medium">{nextLangInfo.code === 'en-US' ? 'EN' : '中文'}</span>
      </button>
    );
  }

  // 桌面端：下拉菜单
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-700 transition-colors duration-200"
        aria-label="切换语言"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 mr-2" />
        <span>{currentLanguage.nativeName}</span>
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            {availableLanguages.map((langCode) => {
              const langInfo = SUPPORTED_LANGUAGES[langCode];
              const isActive = langCode === language;
              
              return (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl mr-3">{langInfo.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{langInfo.nativeName}</div>
                    <div className="text-xs text-gray-500">{langInfo.name}</div>
                  </div>
                  {isActive && (
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
```

### 2. 更新 Navbar 组件

```typescript
// 在 Navbar.tsx 中添加
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  // ... 现有代码

  return (
    <nav className="...">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* ... */}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                // ... 导航项
              ))}
              {/* 添加语言切换 */}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          {/* ... */}
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div className="md:hidden overflow-hidden bg-blue-800">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            // ... 导航项
          ))}
          {/* 移动端语言切换 */}
          <div className="px-3 py-2 border-t border-blue-700 mt-2">
            <LanguageSwitcher isMobile />
          </div>
        </div>
      </motion.div>
    </nav>
  );
};
```

### 3. 更新 App.tsx（添加 Provider）

```typescript
import { LanguageProvider } from './i18n/context';

function App() {
  return (
    <LanguageProvider>
      <Router>
        {/* ... 现有路由 */}
      </Router>
    </LanguageProvider>
  );
}
```

---

## 📝 使用示例

### 在组件中使用翻译

```typescript
import { useTranslation } from '../i18n/hooks';

const Phase2Home: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <h1>{t('phase2.home.title')}</h1>
      <p>{t('phase2.home.subtitle')}</p>
      <button>{t('common.buttons.viewDetails')}</button>
      
      {/* 带参数的翻译 */}
      <p>{t('phase2.home.pagination.showing', { 
        start: 1, 
        end: 8, 
        total: 20 
      })}</p>
    </>
  );
};
```

---

## 🎯 实施优先级

### 第一阶段（核心功能）
1. ✅ 基础架构（Context、Hook、配置）
2. ✅ 语言切换组件
3. ✅ Navbar 集成
4. ✅ 核心页面翻译（Phase2Home、Phase2Province、Phase2RelayDetail）

### 第二阶段（完善）
1. ⏳ 所有页面翻译
2. ⏳ 日期/数字格式化
3. ⏳ 错误处理和回退机制

### 第三阶段（优化）
1. ⏳ 按需加载优化
2. ⏳ 类型安全增强
3. ⏳ 翻译管理工具

---

## 📊 翻译工作量估算

| 模块 | 中文行数 | 英文行数 | 预计时间 |
|------|---------|---------|---------|
| common.ts | ~50 | ~50 | 1h |
| navbar.ts | ~10 | ~10 | 0.5h |
| phase2.ts | ~200 | ~200 | 3h |
| gallery.ts | ~50 | ~50 | 1h |
| relay.ts | ~100 | ~100 | 2h |
| map.ts | ~30 | ~30 | 0.5h |
| **总计** | **~440** | **~440** | **8h** |

---

## ✅ 完成标准

- [ ] 所有 UI 文本都有翻译
- [ ] 语言切换流畅无卡顿
- [ ] 翻译文本完整准确
- [ ] 移动端和桌面端都正常工作
- [ ] localStorage 持久化正常
- [ ] 浏览器语言检测正常
- [ ] 无控制台错误和警告





