// const manageTranslations = require("react-intl-translations-manager").default;

// manageTranslations({
//   messagesDirectory: "src/translations/extracted/",
//   translationsDirectory: "src/translations/locales/",
//   languages: ["nl"], // any language you need
//   singleMessagesFile: false
// });

// See https://github.com/GertjanReynaert/react-intl-translations-manager
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
  messagesDirectory: '.messages',
  translationsDirectory: 'src/i18n/translations/',
  // en is defaultLocale so no need to list en here
  languages: ['en', 'nl', 'es', 'zh-TW']
});
