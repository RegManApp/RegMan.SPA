import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const STORAGE_KEY = "regman.language";

const normalizeLanguage = (lng) => {
  if (!lng) return "en";
  const lower = String(lng).toLowerCase();
  if (lower.startsWith("ar")) return "ar";
  return "en";
};

const applyDocumentLocale = (lng) => {
  const lang = normalizeLanguage(lng);
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
};

const initialLanguage = normalizeLanguage(
  typeof window !== "undefined"
    ? window.localStorage.getItem(STORAGE_KEY)
    : "en"
);

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
  });

  // Apply immediately and on change
  if (typeof document !== "undefined") {
    applyDocumentLocale(i18n.language);
    i18n.on("languageChanged", (lng) => {
      const normalized = normalizeLanguage(lng);
      window.localStorage.setItem(STORAGE_KEY, normalized);
      applyDocumentLocale(normalized);
    });
  }
}

export const changeLanguage = async (lng) => {
  const normalized = normalizeLanguage(lng);
  await i18n.changeLanguage(normalized);
};

export const getStoredLanguage = () => {
  if (typeof window === "undefined") return "en";
  return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
};

export default i18n;
