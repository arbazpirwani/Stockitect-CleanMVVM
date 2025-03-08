import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPORTED_LANGUAGES, DEFAULTS, CACHE_KEYS } from '@/constants';

// Import translations
import en from './translations/en';
import ar from './translations/ar';

// Define available languages
export const resources = {
    en: {
        translation: en
    },
    ar: {
        translation: ar
    }
};

// Get device language
export const getDeviceLanguage = () => {
    try {
        const locales = RNLocalize.getLocales();
        const languageCode = locales[0].languageCode;
        return languageCode === 'ar' ? 'ar' : 'en'; // Fallback to English for any non-Arabic language
    } catch (error) {
        console.error('Error getting device language:', error);
        return DEFAULTS.LANGUAGE; // Default to English
    }
};

// Get saved language from storage
export const getSavedLanguage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(CACHE_KEYS.USER_LANGUAGE);
    } catch (error) {
        console.error('Error getting saved language:', error);
        return null;
    }
};

// Initialize i18next
export const initI18n = async () => {
    // Try to get stored language preference
    let userLanguage = DEFAULTS.LANGUAGE;
    try {
        const storedLanguage = await getSavedLanguage();
        if (storedLanguage) {
            userLanguage = storedLanguage;
        } else {
            userLanguage = getDeviceLanguage();
        }
    } catch (error) {
        console.error('Error getting stored language:', error);
    }

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: userLanguage,
            fallbackLng: DEFAULTS.LANGUAGE,
            interpolation: {
                escapeValue: false // React already escapes values
            }
        });

    return i18n;
};

/**
 * Change the app language
 * @param language Language code (e.g., 'en', 'ar')
 */
export const changeLanguage = async (language: string) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
        await AsyncStorage.setItem(CACHE_KEYS.USER_LANGUAGE, language);
        i18n.changeLanguage(language);
    }
};

// Check if language has been previously selected
export const hasLanguageBeenSelected = async (): Promise<boolean> => {
    const savedLanguage = await getSavedLanguage();
    return savedLanguage !== null;
};

// Export the i18n instance directly
export default i18n;