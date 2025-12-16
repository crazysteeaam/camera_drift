/**
 * 多语言 Context 和 Provider
 * 
 * 提供全局的语言状态管理和翻译功能
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LanguageCode, getInitialLanguage, STORAGE_KEY, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './config';

/**
 * 翻译数据接口
 * 使用 any 类型以支持嵌套的翻译对象结构
 */
interface Translations {
  [key: string]: any;
}

/**
 * LanguageContext 的类型定义
 */
interface LanguageContextType {
  /** 当前语言代码 */
  language: LanguageCode;
  /** 切换语言的函数 */
  setLanguage: (lang: LanguageCode) => void;
  /** 翻译函数，根据 key 获取翻译文本或数组 */
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[];
  /** 是否正在加载翻译文件 */
  isLoading: boolean;
  /** 所有可用的语言代码列表 */
  availableLanguages: LanguageCode[];
}

/**
 * 创建 Context
 * 初始值为 undefined，使用时需要通过 Provider 提供值
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LanguageProvider 组件
 * 
 * 功能：
 * 1. 管理当前语言状态
 * 2. 动态加载翻译文件
 * 3. 提供翻译函数
 * 4. 持久化语言选择到 localStorage
 * 
 * @param children - 子组件
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 当前语言状态
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage());
  
  // 翻译数据状态
  const [translations, setTranslations] = useState<Translations>({});
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 动态加载翻译文件
   * 
   * 使用动态 import 实现按需加载，避免初始加载过大
   * 如果加载失败，会降级到默认语言
   * 
   * @param lang - 要加载的语言代码
   */
  const loadTranslations = useCallback(async (lang: LanguageCode) => {
    setIsLoading(true);
    try {
      // 动态导入对应语言的翻译文件
      // 路径格式：./locales/{语言代码}/index
      const translationModule = await import(`./locales/${lang}/index`);
      
      // 设置翻译数据（支持 default 导出或命名导出）
      setTranslations(translationModule.default || translationModule);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      
      // 如果加载失败且不是默认语言，尝试加载默认语言作为回退
      if (lang !== DEFAULT_LANGUAGE) {
        try {
          const fallbackModule = await import(`./locales/${DEFAULT_LANGUAGE}/index`);
          setTranslations(fallbackModule.default || fallbackModule);
        } catch (fallbackError) {
          console.error(`Failed to load fallback translations:`, fallbackError);
          // 如果连默认语言都加载失败，使用空对象
          setTranslations({});
        }
      } else {
        // 如果默认语言加载失败，使用空对象
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 初始化加载翻译文件
   * 当语言改变时，重新加载对应的翻译文件
   */
  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  /**
   * 切换语言
   * 
   * 更新语言状态并保存到 localStorage
   * 
   * @param lang - 目标语言代码
   */
  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    
    // 保存到 localStorage，实现持久化
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // localStorage 可能不可用，忽略错误
      console.warn('Failed to save language to localStorage:', error);
    }
  }, []);

  /**
   * 翻译函数
   * 
   * 根据翻译键（key）获取对应的翻译文本
   * 支持嵌套键（如 'common.buttons.viewDetails'）
   * 支持参数替换（如 'Hello {{name}}' -> 'Hello John'）
   * 支持返回数组（当 returnObjects 为 true 时）
   * 
   * @param key - 翻译键，支持点号分隔的嵌套路径
   * @param params - 可选的参数对象，用于替换翻译文本中的占位符
   *                 如果设置 returnObjects: true，则返回原始值（可能是数组或对象）
   * @returns 翻译后的文本或数组，如果找不到则返回 key 本身
   * 
   * @example
   * t('common.buttons.viewDetails') // '查看详情'
   * t('phase2.home.pagination.showing', { start: 1, end: 8, total: 20 })
   * // '显示 1-8 共 20 个省份'
   * t('phase2.home.sections.activity.process.steps', { returnObjects: true })
   * // ['步骤1', '步骤2', ...] (数组)
   */
  const t = useCallback((
    key: string, 
    params?: Record<string, string | number | boolean> & { returnObjects?: boolean }
  ): string | string[] => {
    // 如果翻译数据为空，根据 returnObjects 返回不同的默认值
    if (!translations || Object.keys(translations).length === 0) {
      // 如果要求返回对象/数组，返回空数组而不是 key（字符串）
      if (params?.returnObjects) {
        return [];
      }
      return key;
    }

    // 将嵌套键拆分为数组（如 'common.buttons.viewDetails' -> ['common', 'buttons', 'viewDetails']）
    const keys = key.split('.');
    let value: any = translations;
    
    // 遍历嵌套键，逐层访问翻译对象
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到对应的翻译键，在开发环境下输出警告
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Translation missing for key: ${key}`);
        }
        // 如果设置了 returnObjects，返回空数组而不是 key（字符串）
        if (params?.returnObjects) {
          return [];
        }
        // 返回 key 本身，便于发现缺失的翻译
        return key;
      }
    }
    
    // 如果设置了 returnObjects，直接返回原始值（可能是数组、对象或字符串）
    if (params?.returnObjects) {
      // 如果是数组，直接返回
      if (Array.isArray(value)) {
        return value;
      }
      // 如果是对象，返回对象
      if (typeof value === 'object' && value !== null) {
        return value;
      }
      // 如果是字符串，也返回（保持一致性）
      return value;
    }
    
    // 如果最终值不是字符串，返回 key
    if (typeof value !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Translation value is not a string for key: ${key}`);
      }
      return key;
    }
    
    // 如果有参数，进行参数替换
    // 支持格式：{{paramName}}
    // 注意：排除 returnObjects 参数
    const paramsForReplacement = params ? { ...params } : {};
    delete paramsForReplacement.returnObjects;
    
    if (paramsForReplacement && Object.keys(paramsForReplacement).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        // 如果参数存在，替换它；否则保留原占位符
        return paramsForReplacement[paramKey]?.toString() || match;
      });
    }
    
    return value;
  }, [translations]);

  /**
   * Context 值对象
   * 包含所有需要暴露给子组件的状态和方法
   */
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

/**
 * 内部 Hook：获取 LanguageContext
 * 
 * 用于在 Provider 内部组件中访问 Context
 * 如果不在 Provider 内使用会抛出错误
 * 
 * @returns LanguageContext 的值
 * @throws 如果不在 LanguageProvider 内使用会抛出错误
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

