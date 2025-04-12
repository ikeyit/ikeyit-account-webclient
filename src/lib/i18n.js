import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
i18n
    .use(LanguageDetector)
    .use(resourcesToBackend((language, namespace) => import(`../locales/${language}/${namespace}.json`)))
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection: {
            order: ['cookie', 'navigator', 'htmlTag'],
            lookupCookie: 'locale',
        },
        ns:["common"],
        defaultNS:"common",
        fallbackLng: "en", // fallback language
        load: 'currentOnly',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;