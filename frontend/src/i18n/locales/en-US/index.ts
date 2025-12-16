/**
 * English Translations Entry Point
 * 
 * Aggregates all module translations and exports them uniformly
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
 * English translation object
 * 
 * Structure:
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


