/**
 * 多语言工具函数
 * 
 * 提供获取省份翻译等辅助功能
 */

import { useTranslation } from './hooks';
import { LanguageCode } from './config';

/**
 * 获取省份的翻译名称
 * 
 * @param provinceId - 省份 ID（如 'zhejiang'）
 * @returns 省份的翻译名称，如果找不到则返回原始 ID
 */
export const useProvinceName = (provinceId: string): string => {
  const { t } = useTranslation();
  try {
    return t(`provinces.${provinceId}.name`) as string;
  } catch {
    return provinceId;
  }
};

/**
 * 获取省份的翻译简介
 * 
 * @param provinceId - 省份 ID（如 'zhejiang'）
 * @returns 省份的翻译简介，如果找不到则返回空字符串
 */
export const useProvinceDescription = (provinceId: string): string => {
  const { t } = useTranslation();
  try {
    return t(`provinces.${provinceId}.description`) as string;
  } catch {
    return '';
  }
};

/**
 * 获取省份翻译的 Hook
 * 
 * @param provinceId - 省份 ID
 * @returns 包含名称和简介的对象
 */
export const useProvinceTranslation = (provinceId: string) => {
  const { t } = useTranslation();
  return {
    name: (t(`provinces.${provinceId}.name`) as string) || provinceId,
    description: (t(`provinces.${provinceId}.description`) as string) || ''
  };
};

/**
 * 翻译接力棒编号（如"第一棒" -> "Relay 1"）
 * @param relayId 接力棒的ID（1-6）
 * @param t 翻译函数
 * @returns 翻译后的接力棒名称
 */
export const translateRelayName = (
  relayId: number, 
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[]
): string => {
  const translated = t(`common.relayNumber.${relayId}`) as string;
  // 如果翻译不存在，返回默认格式
  if (translated === `common.relayNumber.${relayId}`) {
    return `Relay ${relayId}`;
  }
  return translated;
};

/**
 * 翻译城市名称
 * 
 * 支持以下格式：
 * - "衢州市" -> "Quzhou"
 * - "浙江省衢州市" -> "Quzhou, Zhejiang Province" (英文) 或 "浙江省衢州市" (中文)
 * 
 * 优先查找完整地址的翻译，如果没有则尝试拆分翻译
 * 
 * @param cityName 城市名称（可能包含省份名）
 * @param t 翻译函数
 * @param language 当前语言代码（可选，用于决定格式）
 * @returns 翻译后的城市名称
 */
export const translateCityName = (
  cityName: string, 
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[],
  language?: LanguageCode
): string => {
  // 1. 先尝试直接翻译完整地址（如 "浙江省衢州市"）
  const fullAddressKey = `cities.${cityName}`;
  let translated = t(fullAddressKey) as string;
  
  if (translated !== fullAddressKey) {
    return translated;
  }
  
  // 2. 如果直接翻译不存在，尝试提取城市名和省份名
  // 匹配格式：省份名 + 城市名（如 "浙江省衢州市"）
  const provinceCityMatch = cityName.match(/^(.+?省|.+?市|.+?自治区|.+?特别行政区)(.+?市|.+?县|.+?区)$/);
  
  if (provinceCityMatch) {
    const provinceName = provinceCityMatch[1]; // 如 "浙江省"
    const cityNameOnly = provinceCityMatch[2]; // 如 "衢州市"
    
    // 翻译省份名
    let translatedProvince = provinceName;
    try {
      // 通过 provinces 翻译文件查找匹配的省份
      const provincesData = t('provinces', { returnObjects: true }) as any;
      if (provincesData && typeof provincesData === 'object') {
        for (const [provinceId, provinceData] of Object.entries(provincesData)) {
          if (provinceData && typeof provinceData === 'object' && 'name' in provinceData) {
            const provName = (provinceData as any).name;
            if (provName === provinceName) {
              // 找到匹配的省份，使用翻译后的名称
              translatedProvince = t(`provinces.${provinceId}.name`) as string;
              break;
            }
          }
        }
      }
    } catch (e) {
      // 如果查找失败，使用原省份名
    }
    
    // 翻译城市名
    const cityKey = `cities.${cityNameOnly}`;
    const translatedCity = t(cityKey) as string;
    const finalCityName = translatedCity !== cityKey ? translatedCity : cityNameOnly;
    
    // 组合：根据语言决定格式
    // 英文：城市名, 省份名
    // 中文：省份名城市名
    const isEnglish = language === 'en-US';
    if (isEnglish) {
      return `${finalCityName}, ${translatedProvince}`;
    } else {
      return `${translatedProvince}${finalCityName}`;
    }
  }
  
  // 3. 如果只是城市名（如 "衢州市"），直接翻译
  const cityKey = `cities.${cityName}`;
  translated = t(cityKey) as string;
  
  if (translated !== cityKey) {
    return translated;
  }
  
  // 4. 如果都找不到，返回原名称
  return cityName;
};

/**
 * 翻译组名称和描述
 * @param provinceId 省份ID（如"zhejiang"）
 * @param groupId 组ID（如"A"）
 * @param t 翻译函数
 * @returns 包含名称和描述的对象
 */
export const translateGroupInfo = (
  provinceId: string,
  groupId: string,
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[]
): { name: string; description: string } => {
  const nameKey = `groups.${provinceId}.${groupId}.name`;
  const descKey = `groups.${provinceId}.${groupId}.description`;
  
  const translatedName = t(nameKey) as string;
  const translatedDesc = t(descKey) as string;
  
  // 如果翻译不存在，使用 common.groups 中的组名，描述返回空
  const name = translatedName !== nameKey 
    ? translatedName 
    : (t(`common.groups.${groupId}`) as string) || `Group ${groupId}`;
  
  const description = translatedDesc !== descKey ? translatedDesc : '';
  
  return { name, description };
};

/**
 * 翻译留言内容
 * 
 * 使用嵌套结构：messages.provinceId.groupId.relayId
 * 便于扩展多语言支持
 * 
 * @param provinceId 省份ID（如"zhejiang"）
 * @param groupId 组ID（如"A"）
 * @param relayId 接力棒ID（如1，会被转换为字符串"1"）
 * @param originalMessage 原始留言内容（作为fallback）
 * @param t 翻译函数
 * @returns 翻译后的留言内容
 */
export const translateMessage = (
  provinceId: string,
  groupId: string,
  relayId: number,
  originalMessage: string,
  t: (key: string) => string | string[]
): string => {
  // 构建翻译键：messages.provinceId.groupId.relayId
  // relayId 会被自动转换为字符串
  const messageKey = `messages.${provinceId}.${groupId}.${relayId}`;
  const translated = t(messageKey) as string;
  
  // 如果翻译不存在（返回的是 key 本身），返回原始留言作为 fallback
  if (translated === messageKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Message translation not found for key: ${messageKey}, using original message`);
    }
    return originalMessage;
  }
  
  return translated;
};

/**
 * 翻译标签
 * @param tag 标签文本
 * @param t 翻译函数
 * @returns 翻译后的标签
 */
export const translateTag = (
  tag: string,
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[]
): string => {
  const tagKey = `tags.${tag}`;
  const translated = t(tagKey) as string;
  
  // 如果翻译不存在，返回原始标签
  if (translated === tagKey) {
    return tag;
  }
  
  return translated;
};

/**
 * 翻译相机型号
 * @param cameraModel 相机型号（如"富士一次性胶片机"）
 * @param t 翻译函数
 * @returns 翻译后的相机型号
 */
export const translateCamera = (
  cameraModel: string,
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[]
): string => {
  const cameraKey = `cameras.${cameraModel}`;
  const translated = t(cameraKey) as string;
  
  // 如果翻译不存在，返回原始型号
  if (translated === cameraKey) {
    return cameraModel;
  }
  
  return translated;
};

/**
 * 翻译胶片类型
 * @param filmType 胶片类型（如"C400"）
 * @param t 翻译函数
 * @returns 翻译后的胶片类型
 */
export const translateFilm = (
  filmType: string,
  t: (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }) => string | string[]
): string => {
  const filmKey = `films.${filmType}`;
  const translated = t(filmKey) as string;
  
  // 如果翻译不存在，返回原始类型
  if (translated === filmKey) {
    return filmType;
  }
  
  return translated;
};


