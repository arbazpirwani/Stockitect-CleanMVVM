import { useState, useCallback } from 'react';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart'; // Make sure to install this package: npm install react-native-restart
import { changeLanguage } from '@/i18n';
import { SUPPORTED_LANGUAGES } from '@/constants';

/**
 * ViewModel for the Language Selection screen
 */
export function useLanguageViewModel(
    initialLanguage: string,
    onLanguageChanged: () => void
) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);
    const [loading, setLoading] = useState(false);

    /**
     * Set the application language and adjust layout direction if needed.
     */
    const setLanguage = useCallback(async (language: string) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            console.error(`Unsupported language: ${language}`);
            return;
        }

        try {
            setLoading(true);
            setSelectedLanguage(language);

            await changeLanguage(language);

            // Determine if the new language requires RTL (e.g., Arabic)
            const isRTL = language === 'ar';
            if (I18nManager.isRTL !== isRTL) {
                I18nManager.forceRTL(isRTL);
                // Restart the app to apply RTL changes
                RNRestart.Restart();
            }

            onLanguageChanged();
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setLoading(false);
        }
    }, [onLanguageChanged]);

    return {
        selectedLanguage,
        loading,
        setLanguage
    };
}
