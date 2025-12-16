/**
 * 中文翻译文件入口
 * 
 * 汇总所有模块的翻译，统一导出
 */

import common from './common';
import navbar from './navbar';
import phase2 from './phase2';
import provinces from './provinces';
import cities from './cities';
import groups from './groups';
import messages from './messages';
import tags from './tags';
import cameras from './cameras';
import films from './films';

/**
 * 中文翻译对象
 * 
 * 结构：
 * {
 *   common: { ... },
 *   navbar: { ... },
 *   phase2: { ... },
 *   provinces: { ... },
 *   cities: { ... },
 *   groups: { ... },
 *   messages: { ... },
 *   tags: { ... },
 *   cameras: { ... },
 *   films: { ... }
 * }
 */
export default {
  common,
  navbar,
  phase2,
  provinces,
  cities,
  groups,
  messages,
  tags,
  cameras,
  films
};


