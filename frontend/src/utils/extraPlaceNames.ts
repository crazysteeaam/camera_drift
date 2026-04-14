import { getExtraDisplayCountryName } from './extraCountryNames';

const EXTRA_CITY_NAMES_ZH: Record<string, string> = {
  Tokyo: '东京',
  Bangkok: '曼谷',
  Seoul: '首尔',
  Auckland: '奥克兰',
  Jakarta: '雅加达',
  'Coming Soon': '即将开放'
};

export const getExtraDisplayCityName = (city: string, language: string) => {
  if (language !== 'zh-CN') return city;
  return EXTRA_CITY_NAMES_ZH[city] || city;
};

export const getExtraDisplayPlace = (
  countryCode: string,
  country: string,
  city: string,
  language: string
) => {
  const displayCountry = getExtraDisplayCountryName(countryCode, country, language);
  const displayCity = getExtraDisplayCityName(city, language);
  return `${displayCountry} · ${displayCity}`;
};
