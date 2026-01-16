// src/app/providers/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './ru.json';
import en from './en.json';

i18n
  .use(initReactI18next)          // подключаем react-i18next
  .use(LanguageDetector)          // автоматически определяет язык браузера
  .init({
    resources: {
      ru: { translation: ru,},
      en: { translation: en },
    },
    fallbackLng: 'ru',              // если язык не найден — русский
    supportedLngs: ['ru'],          // пока только русский
    debug: import.meta.env.DEV,     // в dev-режиме показывает предупреждения
    interpolation: {
      escapeValue: false,           // React уже экранирует
    },
  });

export default i18n;