/**
 * 多语言配置文件
 * 
 * 定义支持的语言列表、默认语言、存储键等配置信息
 */

/**
 * 语言信息接口
 */
export interface Language {
  /** 语言代码（ISO 639-1 + ISO 3166-1） */
  code: string;
  /** 英文名称 */
  name: string;
  /** 本地化名称 */
  nativeName: string;
  /** 国旗 emoji */
  flag: string;
  /** 日期格式 */
  dateFormat: string;
}

/**
 * 支持的语言列表
 * 未来可以轻松添加更多语言，如日语、韩语等
 */
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
  // 未来扩展示例：
  // 'ja-JP': {
  //   code: 'ja-JP',
  //   name: 'Japanese',
  //   nativeName: '日本語',
  //   flag: '🇯🇵',
  //   dateFormat: 'YYYY年MM月DD日'
  // },
  // 'ko-KR': {
  //   code: 'ko-KR',
  //   name: 'Korean',
  //   nativeName: '한국어',
  //   flag: '🇰🇷',
  //   dateFormat: 'YYYY년 MM월 DD일'
  // }
};

/**
 * 语言代码类型
 * 基于支持的语言列表自动生成类型
 */
export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

/**
 * 默认语言
 * 当无法检测到用户语言时使用
 */
export const DEFAULT_LANGUAGE: LanguageCode = 'zh-CN';

/**
 * localStorage 存储键名
 * 用于持久化用户选择的语言
 */
export const STORAGE_KEY = 'film_relay_language';

/**
 * 检测浏览器语言
 * 
 * 优先级：
 * 1. 精确匹配（如 zh-CN）
 * 2. 模糊匹配（如 zh-TW -> zh-CN）
 * 3. 返回默认语言
 * 
 * @returns 检测到的语言代码
 */
export const detectBrowserLanguage = (): LanguageCode => {
  // 获取浏览器语言设置
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  if (!browserLang) {
    return DEFAULT_LANGUAGE;
  }
  
  // 精确匹配：直接检查是否在支持的语言列表中
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang as LanguageCode;
  }
  
  // 模糊匹配：提取语言前缀（如 zh-CN -> zh）
  // 这样可以匹配 zh-TW, zh-HK 等变体到 zh-CN
  const langPrefix = browserLang.split('-')[0].toLowerCase();
  const matched = Object.keys(SUPPORTED_LANGUAGES).find(
    code => code.toLowerCase().startsWith(langPrefix)
  );
  
  // 如果找到匹配的语言，返回它；否则返回默认语言
  return (matched as LanguageCode) || DEFAULT_LANGUAGE;
};

/**
 * 获取初始语言
 * 
 * 优先级：
 * 1. localStorage 中保存的用户选择
 * 2. 浏览器语言检测
 * 3. 默认语言
 * 
 * @returns 初始语言代码
 */
export const getInitialLanguage = (): LanguageCode => {
  // 1. 优先使用 localStorage 中保存的语言
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES[stored]) {
      return stored as LanguageCode;
    }
  } catch (error) {
    // localStorage 可能不可用（如隐私模式），忽略错误
    console.warn('Failed to read from localStorage:', error);
  }
  
  // 2. 检测浏览器语言
  return detectBrowserLanguage();
};





