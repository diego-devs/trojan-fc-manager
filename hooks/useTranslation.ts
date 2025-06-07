
import { useContext } from 'react';
import { LanguageContext, Language } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../i18n/translations';

interface UseTranslationOutput {
  t: (key: TranslationKey | string, params?: { [key: string]: string | number }) => string;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useTranslation = (): UseTranslationOutput => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { language, setLanguage } = context;

  const t = (key: TranslationKey | string, params?: { [key: string]: string | number }): string => {
    // Check if the key is a direct known TranslationKey
    if (key in translations) {
        const translationSet = translations[key as TranslationKey];
        let translatedString = translationSet[language] || translationSet['en'];

        if (params) {
            Object.keys(params).forEach(paramKey => {
              translatedString = translatedString.replace(`{${paramKey}}`, String(params[paramKey]));
            });
        }
        return translatedString;
    }
    
    // Fallback for keys that might be PlayerPosition enum values or other direct strings
    // if they exist as top-level keys in the translations object
    // (e.g. t("Goalkeeper") where "Goalkeeper" is a key in translations)
    const directKeyMatch = translations[key as TranslationKey] as { en: string; es: string } | undefined;
    if (directKeyMatch && typeof directKeyMatch === 'object' && directKeyMatch.hasOwnProperty(language)) {
        return directKeyMatch[language];
    }
    if (directKeyMatch && typeof directKeyMatch === 'object' && directKeyMatch.hasOwnProperty('en')) {
        return directKeyMatch['en']; // Fallback to English for direct key match
    }

    console.warn(`Translation key "${key}" not found or structure is incorrect.`);
    return key; // Return key itself as ultimate fallback
  };

  return { t, language, setLanguage };
};
