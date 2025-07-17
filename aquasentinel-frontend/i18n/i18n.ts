import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import rw from './rw.json';

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            rw: { translation: rw },
        },
        interpolation: {
            escapeValue: false, // react handles XSS
        },
    });

export default i18n;
