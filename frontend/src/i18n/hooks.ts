/**
 * 多语言相关的自定义 Hooks
 * 
 * 提供便捷的 Hook 函数，简化组件中的使用
 */

import { useLanguage } from './context';

/**
 * useTranslation Hook
 * 
 * 主要的翻译 Hook，返回翻译函数和语言相关信息
 * 
 * @returns 包含翻译函数、当前语言、切换语言函数等的对象
 * 
 * @example
 * ```tsx
 * const { t, language, setLanguage } = useTranslation();
 * 
 * <h1>{t('phase2.home.title')}</h1>
 * <button onClick={() => setLanguage('en-US')}>Switch to English</button>
 * ```
 */
export const useTranslation = () => {
  const { t, language, setLanguage, isLoading, availableLanguages } = useLanguage();
  return { t, language, setLanguage, isLoading, availableLanguages };
};

/**
 * useT Hook
 * 
 * 便捷 Hook，仅返回翻译函数
 * 适用于只需要翻译功能，不需要切换语言的场景
 * 
 * @returns 翻译函数
 * 
 * @example
 * ```tsx
 * const t = useT();
 * 
 * <button>{t('common.buttons.submit')}</button>
 * ```
 */
export const useT = () => {
  const { t } = useLanguage();
  return t;
};





