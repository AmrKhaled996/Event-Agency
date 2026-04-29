import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import ar from "./locales/ar/common.json";

const resources = {
  en: { common: en },
  ar: { common: ar }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default
    fallbackLng: "en",

    ns: ["common"],
    defaultNS: "common",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;