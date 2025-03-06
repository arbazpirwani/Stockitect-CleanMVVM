import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const getDeviceLanguage = () => {
    try {
        const locales = RNLocalize.getLocales();
        const languageCode = locales[0].languageCode;
        return languageCode === 'ar' ? 'ar' : 'en'; // Fallback to English for any non-Arabic language
    } catch (error) {
        console.error('Error getting device language:', error);
        return 'en'; // Default to English
    }
};

// Initialize i18next
const initI18n = async () => {
    // Try to get stored language preference
    let userLanguage = 'en';
    try {
        const storedLanguage = await AsyncStorage.getItem('userLanguage');
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
            fallbackLng: 'en',
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
    await AsyncStorage.setItem('userLanguage', language);
    i18n.changeLanguage(language);
};

export { initI18n };
export default i18n;