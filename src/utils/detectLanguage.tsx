
// currently we do thus not differentiate between different english or dutch types
// we also support only traditional chinese for the taiwanese market
// but in the future, we might want to also support simplified chinese
// this is why we use zh-TW for traditional chinese instead of only zh
const supportedLocales = ["en", "nl", "zh-TW"];
const defaultLocale = "en";


export const getLocaleStringFromBrowserSetting = () => {
  const preferredLocaleList = getBrowserLocaleStringList();
  const maybeFoundPreferredLocale = preferredLocaleList.find(getSupportedLocaleFromPreferredLocale)
  if ( maybeFoundPreferredLocale) {
    return getSupportedLocaleFromPreferredLocale(maybeFoundPreferredLocale) + '';
  } else {
    return defaultLocale;
  }
}



const getBrowserLocaleStringList = (): readonly string[] => {
  const languageString = navigator.languages;

  // make sure userLanguage is known by typescript
  // https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/478
  interface NavigatorLanguage  {
    userLanguage?: string;
  }

  if ( languageString !== null && languageString  && languageString.length) {
    return languageString;
  } else  {
    return [
      navigator.language || 
      (navigator as NavigatorLanguage).userLanguage || 
      defaultLocale
    ];
  } 
}

// returns supported locale if found and otherwise null
const getSupportedLocaleFromPreferredLocale = (preferredLocale: string) => {
  return (
    // exactmatch
    supportedLocales.find(supportedLocale => supportedLocale === preferredLocale) 
    ||
    // partial match: string before "-". For example: "en-GB" -> "en".
    supportedLocales.find(supportedLocale => 
      supportedLocale === (preferredLocale.split('-')[0].toLowerCase())
    )
    ||
    null
  );
}