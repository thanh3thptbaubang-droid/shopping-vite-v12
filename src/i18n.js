import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/translation.json";
import vi from "./locales/vi/translation.json";
import zh from "./locales/zh/translation.json";
import ja from "./locales/ja/translation.json";
import ko from "./locales/ko/translation.json";
import fr from "./locales/fr/translation.json";
import es from "./locales/es/translation.json";
import de from "./locales/de/translation.json";
import ru from "./locales/ru/translation.json";
import ar from "./locales/ar/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en:{translation:en}, vi:{translation:vi}, zh:{translation:zh}, ja:{translation:ja},
      ko:{translation:ko}, fr:{translation:fr}, es:{translation:es}, de:{translation:de}, ru:{translation:ru}, ar:{translation:ar}
    },
    fallbackLng: "en",
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    interpolation: { escapeValue: false }
  });

export default i18n;
