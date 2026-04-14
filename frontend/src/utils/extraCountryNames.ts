export const getExtraDisplayCountryName = (
  countryCode: string,
  fallbackName: string,
  language: string
) => {
  if (countryCode === 'ZZ') {
    return language === 'zh-CN' ? '预留国家' : fallbackName;
  }

  try {
    const locale = language === 'zh-CN' ? 'zh-Hans' : 'en';
    const displayName = new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode);
    return displayName || fallbackName;
  } catch (error) {
    return fallbackName;
  }
};
