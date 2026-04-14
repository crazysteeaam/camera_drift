/**
 * 语言切换组件
 * 
 * 提供语言切换功能，支持桌面端下拉菜单和移动端简单切换按钮
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/hooks';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/config';

interface LanguageSwitcherProps {
  /** 是否为移动端模式 */
  isMobile?: boolean;
}

/**
 * LanguageSwitcher 组件
 * 
 * 功能：
 * 1. 显示当前语言
 * 2. 提供语言切换下拉菜单（桌面端）
 * 3. 提供简单切换按钮（移动端）
 * 4. 点击外部区域自动关闭下拉菜单
 * 
 * @param isMobile - 是否为移动端模式
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前语言的完整信息
  const currentLanguage = SUPPORTED_LANGUAGES[language];

  /**
   * 点击外部区域关闭下拉菜单
   * 
   * 使用 useEffect 监听点击事件，如果点击的是下拉菜单外部，
   * 则关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击的目标是否在下拉菜单外部
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // 如果下拉菜单打开，添加事件监听器
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // 清理函数：移除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * 处理语言切换
   * 
   * @param langCode - 目标语言代码
   */
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as LanguageCode);
    setIsOpen(false);
  };

  // ========== 移动端模式 ==========
  // 移动端使用简单的切换按钮，直接在中英文之间切换
  if (isMobile) {
    // 找到下一个语言（如果当前是中文，切换到英文；如果当前是英文，切换到中文）
    const nextLanguage = availableLanguages.find(lang => lang !== language) || availableLanguages[0];
    const nextLangInfo = SUPPORTED_LANGUAGES[nextLanguage];
    
    return (
      <button
        onClick={() => handleLanguageChange(nextLanguage)}
        className="flex items-center px-3 py-2 text-blue-200 hover:text-white transition-colors"
        aria-label="切换语言"
      >
        <Globe className="h-5 w-5 mr-1" />
        {/* 显示下一个语言的简短标识 */}
        <span className="text-sm font-medium">
          {nextLangInfo.code === 'en-US' ? 'EN' : '中文'}
        </span>
      </button>
    );
  }

  // ========== 桌面端模式 ==========
  // 桌面端使用下拉菜单，显示所有支持的语言
  return (
    <div className="relative" ref={dropdownRef}>
      {/* 主按钮：显示当前语言 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-700 transition-colors duration-200"
        aria-label="切换语言"
        aria-expanded={isOpen}
      >
        {/* 地球图标 */}
        <Globe className="h-4 w-4 mr-2" />
        {/* 当前语言名称 */}
        <span>{currentLanguage.nativeName}</span>
        {/* 下拉箭头，根据菜单状态旋转 */}
        <ChevronDown 
          className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 下拉菜单：使用 AnimatePresence 实现动画效果 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            {/* 遍历所有支持的语言 */}
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
                  {/* 国旗 emoji */}
                  <span className="text-xl mr-3">{langInfo.flag}</span>
                  {/* 语言信息 */}
                  <div className="flex-1">
                    {/* 本地化名称（如：简体中文、English） */}
                    <div className="text-sm font-medium">{langInfo.nativeName}</div>
                    {/* 英文名称（如：Chinese、English） */}
                    <div className="text-xs text-gray-500">{langInfo.name}</div>
                  </div>
                  {/* 当前选中语言的勾选标记 */}
                  {isActive && (
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
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





